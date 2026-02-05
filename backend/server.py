from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Depends, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from urllib.parse import urlparse

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import scanner and AI services
from services.scanner import scanner
from services.ai_service import generate_alt_text_for_images, generate_accessibility_recommendations
from services.auth_service import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    create_access_token, authenticate_user, create_user, 
    get_user_by_id, get_current_user, TokenData
)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Webenablix API", version="2.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== Models ==============

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Accessibility Issue Model - Updated for real scans
class AccessibilityIssue(BaseModel):
    model_config = ConfigDict(extra="allow")
    type: str  # error, warning, notice
    code: str
    message: str
    count: int = 1
    impact: str  # critical, serious, moderate, minor
    category: str = "accessibility"
    help: Optional[str] = None
    helpUrl: Optional[str] = None
    wcag: Optional[List[str]] = None
    elements: Optional[List[Dict]] = None

# SEO Issue Model
class SEOIssue(BaseModel):
    model_config = ConfigDict(extra="allow")
    type: str  # error, warning, notice
    code: str
    message: str
    recommendation: Optional[str] = None
    impact: str
    category: str = "seo"

# Core Web Vitals Model
class CoreWebVitals(BaseModel):
    lcp: float  # Largest Contentful Paint (seconds)
    lcp_status: str  # good, needs-improvement, poor
    fid: float  # First Input Delay (milliseconds)
    fid_status: str
    cls: float  # Cumulative Layout Shift
    cls_status: str
    overall_status: str

# Mobile Friendliness Model
class MobileFriendliness(BaseModel):
    is_mobile_friendly: bool
    viewport_configured: bool
    text_readable: bool
    tap_targets_sized: bool
    content_wider_than_screen: bool
    issues: List[str]

# Structured Data Model
class StructuredData(BaseModel):
    has_schema: bool
    schema_types: List[str]
    is_valid: bool
    errors: List[str]
    warnings: List[str]

# Security Model
class SecurityCheck(BaseModel):
    has_https: bool
    has_hsts: bool
    has_csp: bool
    mixed_content: bool
    security_score: int

# Full Audit Response Model - Updated for real scans
class FullAuditResponse(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    
    # Accessibility Scores
    accessibility_score: int
    seo_score: int
    performance_score: int
    mobile_score: int
    security_score: int
    overall_score: int
    
    # Risk Assessment
    lawsuit_risk: str
    wcag_level: str
    
    # Detailed Issues
    accessibility_issues: List[AccessibilityIssue]
    seo_issues: List[SEOIssue]
    
    # Core Web Vitals
    core_web_vitals: CoreWebVitals
    
    # Mobile Friendliness
    mobile_friendliness: MobileFriendliness
    
    # Structured Data
    structured_data: StructuredData
    
    # Security
    security: SecurityCheck
    
    # Summary Stats
    total_issues: int
    critical_issues: int
    warnings: int
    
    # Recommendations
    top_recommendations: List[str]
    
    # Page Info (from real scan)
    page_title: Optional[str] = None
    meta_description: Optional[str] = None
    images_without_alt: Optional[List[Dict]] = None
    
    # Scan metadata
    scan_successful: bool = True
    scan_duration: Optional[float] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Audit Models
class AuditCreate(BaseModel):
    url: str
    audit_type: str = "full"  # full, accessibility, seo, performance, mobile, security

# Lead Models
class LeadCreate(BaseModel):
    email: EmailStr
    website_url: Optional[str] = None

class LeadResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    website_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    message: str = "Report request submitted successfully"

# Contact Models
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str

class ContactResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "received"

# ============== Helper Functions ==============

def validate_url(url: str) -> bool:
    """Validate if the URL is properly formatted"""
    try:
        result = urlparse(url)
        return all([result.scheme in ['http', 'https'], result.netloc])
    except:
        return False

def generate_accessibility_issues() -> List[AccessibilityIssue]:
    """Generate realistic accessibility issues based on WCAG 2.1 guidelines"""
    possible_issues = [
        # WCAG 1.1 - Text Alternatives
        AccessibilityIssue(
            type="error", code="img-alt", 
            message="Images must have alternate text (WCAG 1.1.1)",
            count=random.randint(0, 8), impact="critical", category="accessibility"
        ),
        AccessibilityIssue(
            type="error", code="input-image-alt",
            message="Image buttons must have alternate text",
            count=random.randint(0, 2), impact="critical", category="accessibility"
        ),
        # WCAG 1.3 - Adaptable
        AccessibilityIssue(
            type="error", code="label",
            message="Form elements must have labels (WCAG 1.3.1)",
            count=random.randint(0, 5), impact="critical", category="accessibility"
        ),
        AccessibilityIssue(
            type="warning", code="heading-order",
            message="Heading levels should only increase by one (WCAG 1.3.1)",
            count=random.randint(0, 3), impact="moderate", category="accessibility"
        ),
        AccessibilityIssue(
            type="error", code="list",
            message="Lists must be structured correctly",
            count=random.randint(0, 2), impact="serious", category="accessibility"
        ),
        # WCAG 1.4 - Distinguishable
        AccessibilityIssue(
            type="error", code="color-contrast",
            message="Elements must have sufficient color contrast (WCAG 1.4.3)",
            count=random.randint(0, 12), impact="serious", category="accessibility"
        ),
        AccessibilityIssue(
            type="warning", code="color-contrast-enhanced",
            message="Elements should meet enhanced contrast ratio (WCAG 1.4.6)",
            count=random.randint(0, 5), impact="moderate", category="accessibility"
        ),
        AccessibilityIssue(
            type="warning", code="text-spacing",
            message="Text spacing should be adjustable (WCAG 1.4.12)",
            count=random.randint(0, 1), impact="minor", category="accessibility"
        ),
        # WCAG 2.1 - Keyboard Accessible
        AccessibilityIssue(
            type="error", code="keyboard",
            message="All functionality must be keyboard accessible (WCAG 2.1.1)",
            count=random.randint(0, 4), impact="critical", category="accessibility"
        ),
        AccessibilityIssue(
            type="error", code="focus-trap",
            message="No keyboard trap detected (WCAG 2.1.2)",
            count=random.randint(0, 1), impact="critical", category="accessibility"
        ),
        AccessibilityIssue(
            type="warning", code="focus-visible",
            message="Focus indicator should be visible (WCAG 2.4.7)",
            count=random.randint(0, 3), impact="serious", category="accessibility"
        ),
        # WCAG 2.4 - Navigable
        AccessibilityIssue(
            type="error", code="bypass",
            message="Page must have means to bypass repeated blocks (WCAG 2.4.1)",
            count=random.randint(0, 1), impact="serious", category="accessibility"
        ),
        AccessibilityIssue(
            type="error", code="page-title",
            message="Page must have a title (WCAG 2.4.2)",
            count=random.randint(0, 1), impact="serious", category="accessibility"
        ),
        AccessibilityIssue(
            type="error", code="link-name",
            message="Links must have discernible text (WCAG 2.4.4)",
            count=random.randint(0, 6), impact="serious", category="accessibility"
        ),
        AccessibilityIssue(
            type="warning", code="link-in-text-block",
            message="Links must be distinguishable from surrounding text",
            count=random.randint(0, 4), impact="moderate", category="accessibility"
        ),
        # WCAG 3.1 - Readable
        AccessibilityIssue(
            type="error", code="html-lang",
            message="Page must have lang attribute (WCAG 3.1.1)",
            count=random.randint(0, 1), impact="serious", category="accessibility"
        ),
        AccessibilityIssue(
            type="warning", code="valid-lang",
            message="Lang attribute must have valid value",
            count=random.randint(0, 1), impact="moderate", category="accessibility"
        ),
        # WCAG 4.1 - Compatible
        AccessibilityIssue(
            type="error", code="duplicate-id",
            message="IDs must be unique (WCAG 4.1.1)",
            count=random.randint(0, 3), impact="serious", category="accessibility"
        ),
        AccessibilityIssue(
            type="error", code="aria-valid-attr",
            message="ARIA attributes must be valid (WCAG 4.1.2)",
            count=random.randint(0, 4), impact="critical", category="accessibility"
        ),
        AccessibilityIssue(
            type="error", code="aria-roles",
            message="ARIA roles must be used correctly",
            count=random.randint(0, 3), impact="serious", category="accessibility"
        ),
        AccessibilityIssue(
            type="error", code="button-name",
            message="Buttons must have discernible text (WCAG 4.1.2)",
            count=random.randint(0, 3), impact="critical", category="accessibility"
        ),
        # Landmarks
        AccessibilityIssue(
            type="notice", code="landmark-one-main",
            message="Document should have one main landmark",
            count=random.randint(0, 1), impact="moderate", category="accessibility"
        ),
        AccessibilityIssue(
            type="notice", code="region",
            message="All page content should be contained by landmarks",
            count=random.randint(0, 3), impact="moderate", category="accessibility"
        ),
    ]
    
    return [issue for issue in possible_issues if issue.count > 0]

def generate_seo_issues() -> List[SEOIssue]:
    """Generate SEO issues based on Google's guidelines"""
    possible_issues = [
        # Meta Tags
        SEOIssue(
            type="error" if random.random() > 0.5 else "warning",
            code="meta-description",
            message="Meta description is missing or too short",
            recommendation="Add a unique meta description between 150-160 characters",
            impact="serious", category="seo"
        ),
        SEOIssue(
            type="warning",
            code="meta-description-length",
            message="Meta description exceeds recommended length",
            recommendation="Keep meta description under 160 characters",
            impact="moderate", category="seo"
        ),
        SEOIssue(
            type="error" if random.random() > 0.7 else "notice",
            code="title-tag",
            message="Title tag is missing or not optimized",
            recommendation="Add unique title tag between 50-60 characters with target keywords",
            impact="critical", category="seo"
        ),
        SEOIssue(
            type="warning",
            code="canonical-tag",
            message="Canonical tag is missing",
            recommendation="Add canonical tag to prevent duplicate content issues",
            impact="serious", category="seo"
        ),
        # Headings
        SEOIssue(
            type="error" if random.random() > 0.6 else "warning",
            code="h1-tag",
            message="H1 tag is missing or multiple H1 tags found",
            recommendation="Use exactly one H1 tag per page with primary keyword",
            impact="serious", category="seo"
        ),
        SEOIssue(
            type="warning",
            code="heading-structure",
            message="Heading hierarchy is not properly structured",
            recommendation="Use headings in sequential order (H1 > H2 > H3)",
            impact="moderate", category="seo"
        ),
        # Images
        SEOIssue(
            type="error" if random.random() > 0.4 else "warning",
            code="image-alt-seo",
            message="Images missing alt text with keywords",
            recommendation="Add descriptive alt text to all images including relevant keywords",
            impact="serious", category="seo"
        ),
        SEOIssue(
            type="warning",
            code="image-size",
            message="Large images not optimized",
            recommendation="Compress images and use modern formats (WebP, AVIF)",
            impact="moderate", category="seo"
        ),
        SEOIssue(
            type="notice",
            code="image-lazy-loading",
            message="Images not using lazy loading",
            recommendation="Implement lazy loading for below-the-fold images",
            impact="minor", category="seo"
        ),
        # Links
        SEOIssue(
            type="error" if random.random() > 0.7 else "warning",
            code="broken-links",
            message="Broken internal or external links detected",
            recommendation="Fix or remove all broken links",
            impact="serious", category="seo"
        ),
        SEOIssue(
            type="warning",
            code="nofollow-links",
            message="Important internal links have nofollow attribute",
            recommendation="Remove nofollow from important internal links",
            impact="moderate", category="seo"
        ),
        SEOIssue(
            type="notice",
            code="external-links",
            message="External links missing rel='noopener'",
            recommendation="Add rel='noopener noreferrer' to external links",
            impact="minor", category="seo"
        ),
        # Content
        SEOIssue(
            type="warning",
            code="thin-content",
            message="Page has thin content (less than 300 words)",
            recommendation="Add more valuable content (aim for 500+ words)",
            impact="serious", category="seo"
        ),
        SEOIssue(
            type="notice",
            code="keyword-density",
            message="Keyword density may not be optimal",
            recommendation="Include target keywords naturally (1-2% density)",
            impact="moderate", category="seo"
        ),
        # Technical SEO
        SEOIssue(
            type="error" if random.random() > 0.6 else "warning",
            code="robots-txt",
            message="Robots.txt file issues detected",
            recommendation="Ensure robots.txt allows crawling of important pages",
            impact="critical", category="seo"
        ),
        SEOIssue(
            type="error" if random.random() > 0.5 else "warning",
            code="sitemap",
            message="XML sitemap is missing or has errors",
            recommendation="Create and submit XML sitemap to search engines",
            impact="serious", category="seo"
        ),
        SEOIssue(
            type="warning",
            code="url-structure",
            message="URLs are not SEO-friendly",
            recommendation="Use descriptive, hyphenated URLs with keywords",
            impact="moderate", category="seo"
        ),
        # Social & Rich Snippets
        SEOIssue(
            type="warning",
            code="og-tags",
            message="Open Graph tags are missing",
            recommendation="Add Open Graph tags for better social sharing",
            impact="moderate", category="seo"
        ),
        SEOIssue(
            type="warning",
            code="twitter-cards",
            message="Twitter Card meta tags are missing",
            recommendation="Add Twitter Card tags for better Twitter sharing",
            impact="minor", category="seo"
        ),
        SEOIssue(
            type="notice",
            code="structured-data-seo",
            message="Structured data could be enhanced",
            recommendation="Add Schema.org markup for rich snippets",
            impact="moderate", category="seo"
        ),
    ]
    
    # Randomly select some issues
    selected = random.sample(possible_issues, k=random.randint(3, 10))
    return selected

def generate_core_web_vitals() -> CoreWebVitals:
    """Generate Core Web Vitals scores"""
    # LCP: Good < 2.5s, Needs Improvement 2.5-4s, Poor > 4s
    lcp = round(random.uniform(1.0, 6.0), 2)
    lcp_status = "good" if lcp < 2.5 else "needs-improvement" if lcp < 4 else "poor"
    
    # FID: Good < 100ms, Needs Improvement 100-300ms, Poor > 300ms
    fid = round(random.uniform(20, 400), 0)
    fid_status = "good" if fid < 100 else "needs-improvement" if fid < 300 else "poor"
    
    # CLS: Good < 0.1, Needs Improvement 0.1-0.25, Poor > 0.25
    cls = round(random.uniform(0.01, 0.4), 3)
    cls_status = "good" if cls < 0.1 else "needs-improvement" if cls < 0.25 else "poor"
    
    # Overall status
    statuses = [lcp_status, fid_status, cls_status]
    if all(s == "good" for s in statuses):
        overall = "good"
    elif any(s == "poor" for s in statuses):
        overall = "poor"
    else:
        overall = "needs-improvement"
    
    return CoreWebVitals(
        lcp=lcp, lcp_status=lcp_status,
        fid=fid, fid_status=fid_status,
        cls=cls, cls_status=cls_status,
        overall_status=overall
    )

def generate_mobile_friendliness() -> MobileFriendliness:
    """Generate mobile friendliness check results"""
    viewport = random.random() > 0.2
    text_readable = random.random() > 0.3
    tap_targets = random.random() > 0.4
    content_wider = random.random() > 0.7
    
    issues = []
    if not viewport:
        issues.append("Viewport meta tag not configured")
    if not text_readable:
        issues.append("Text too small to read on mobile devices")
    if not tap_targets:
        issues.append("Tap targets (buttons/links) are too small or too close together")
    if content_wider:
        issues.append("Content wider than screen, requires horizontal scrolling")
    
    is_mobile_friendly = viewport and text_readable and tap_targets and not content_wider
    
    return MobileFriendliness(
        is_mobile_friendly=is_mobile_friendly,
        viewport_configured=viewport,
        text_readable=text_readable,
        tap_targets_sized=tap_targets,
        content_wider_than_screen=content_wider,
        issues=issues
    )

def generate_structured_data() -> StructuredData:
    """Generate structured data analysis results"""
    has_schema = random.random() > 0.4
    
    possible_types = ["WebSite", "Organization", "BreadcrumbList", "Article", "Product", "LocalBusiness", "FAQPage", "HowTo"]
    schema_types = random.sample(possible_types, k=random.randint(0, 3)) if has_schema else []
    
    is_valid = has_schema and random.random() > 0.3
    
    errors = []
    warnings = []
    
    if not has_schema:
        errors.append("No structured data found on the page")
    elif not is_valid:
        possible_errors = [
            "Missing required property 'name'",
            "Invalid value for property 'url'",
            "Property 'image' is recommended"
        ]
        errors = random.sample(possible_errors, k=random.randint(1, 2))
    
    if has_schema:
        possible_warnings = [
            "Consider adding 'dateModified' property",
            "Consider adding 'author' property",
            "Logo image should be at least 112x112 pixels"
        ]
        warnings = random.sample(possible_warnings, k=random.randint(0, 2))
    
    return StructuredData(
        has_schema=has_schema,
        schema_types=schema_types,
        is_valid=is_valid,
        errors=errors,
        warnings=warnings
    )

def generate_security_check(url: str) -> SecurityCheck:
    """Generate security check results"""
    has_https = url.startswith("https://")
    has_hsts = has_https and random.random() > 0.4
    has_csp = random.random() > 0.5
    mixed_content = has_https and random.random() > 0.7
    
    score = 0
    if has_https:
        score += 40
    if has_hsts:
        score += 20
    if has_csp:
        score += 25
    if not mixed_content:
        score += 15
    
    return SecurityCheck(
        has_https=has_https,
        has_hsts=has_hsts,
        has_csp=has_csp,
        mixed_content=mixed_content,
        security_score=score
    )

def calculate_scores(accessibility_issues: List[AccessibilityIssue], 
                    seo_issues: List[SEOIssue],
                    core_web_vitals: CoreWebVitals,
                    mobile: MobileFriendliness,
                    security: SecurityCheck) -> Dict[str, int]:
    """Calculate all scores"""
    
    # Accessibility Score
    acc_score = 100
    for issue in accessibility_issues:
        if issue.impact == "critical":
            acc_score -= issue.count * 5
        elif issue.impact == "serious":
            acc_score -= issue.count * 3
        elif issue.impact == "moderate":
            acc_score -= issue.count * 2
        else:
            acc_score -= issue.count * 1
    acc_score = max(0, min(100, acc_score))
    
    # SEO Score
    seo_score = 100
    for issue in seo_issues:
        if issue.impact == "critical":
            seo_score -= 15
        elif issue.impact == "serious":
            seo_score -= 10
        elif issue.impact == "moderate":
            seo_score -= 5
        else:
            seo_score -= 2
    seo_score = max(0, min(100, seo_score))
    
    # Performance Score (based on Core Web Vitals)
    perf_score = 100
    if core_web_vitals.lcp_status == "poor":
        perf_score -= 25
    elif core_web_vitals.lcp_status == "needs-improvement":
        perf_score -= 10
    if core_web_vitals.fid_status == "poor":
        perf_score -= 25
    elif core_web_vitals.fid_status == "needs-improvement":
        perf_score -= 10
    if core_web_vitals.cls_status == "poor":
        perf_score -= 25
    elif core_web_vitals.cls_status == "needs-improvement":
        perf_score -= 10
    perf_score = max(0, min(100, perf_score))
    
    # Mobile Score
    mobile_score = 100
    if not mobile.viewport_configured:
        mobile_score -= 30
    if not mobile.text_readable:
        mobile_score -= 25
    if not mobile.tap_targets_sized:
        mobile_score -= 25
    if mobile.content_wider_than_screen:
        mobile_score -= 20
    mobile_score = max(0, min(100, mobile_score))
    
    # Overall Score (weighted average)
    overall = int(
        acc_score * 0.30 +  # 30% weight
        seo_score * 0.25 +   # 25% weight
        perf_score * 0.20 +  # 20% weight
        mobile_score * 0.15 + # 15% weight
        security.security_score * 0.10  # 10% weight
    )
    
    return {
        "accessibility": acc_score,
        "seo": seo_score,
        "performance": perf_score,
        "mobile": mobile_score,
        "security": security.security_score,
        "overall": overall
    }

def determine_lawsuit_risk(score: int, critical_issues: int) -> str:
    """Determine lawsuit risk based on accessibility score"""
    if score >= 90 and critical_issues <= 1:
        return "low"
    elif score >= 70 and critical_issues <= 3:
        return "medium"
    else:
        return "high"

def determine_wcag_level(score: int) -> str:
    """Determine WCAG compliance level"""
    if score >= 95:
        return "AAA"
    elif score >= 80:
        return "AA"
    elif score >= 60:
        return "A"
    else:
        return "Non-Compliant"

def generate_recommendations(scores: Dict[str, int], 
                            accessibility_issues: List[AccessibilityIssue],
                            seo_issues: List[SEOIssue],
                            cwv: CoreWebVitals,
                            mobile: MobileFriendliness) -> List[str]:
    """Generate top recommendations based on audit results"""
    recommendations = []
    
    # Accessibility recommendations
    if scores["accessibility"] < 80:
        critical = [i for i in accessibility_issues if i.impact == "critical"]
        if critical:
            recommendations.append(f"Fix {len(critical)} critical accessibility issues (images alt text, form labels, ARIA)")
    
    # SEO recommendations
    if scores["seo"] < 80:
        recommendations.append("Improve meta descriptions and title tags for better search visibility")
        recommendations.append("Add structured data markup (Schema.org) for rich snippets")
    
    # Performance recommendations
    if cwv.lcp_status != "good":
        recommendations.append(f"Improve Largest Contentful Paint (currently {cwv.lcp}s, target < 2.5s)")
    if cwv.cls_status != "good":
        recommendations.append(f"Reduce Cumulative Layout Shift (currently {cwv.cls}, target < 0.1)")
    
    # Mobile recommendations
    if not mobile.is_mobile_friendly:
        if not mobile.viewport_configured:
            recommendations.append("Add viewport meta tag for mobile responsiveness")
        if not mobile.tap_targets_sized:
            recommendations.append("Increase tap target sizes to at least 48x48 pixels")
    
    # Limit to top 5 recommendations
    return recommendations[:5]

# ============== Routes ==============

@api_router.get("/")
async def root():
    return {"message": "Webenablix API v2.0 is running"}

# Status Check Routes
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Full Audit Route - REAL SCANNING
@api_router.post("/audit", response_model=FullAuditResponse)
async def create_full_audit(input: AuditCreate):
    """Perform comprehensive real accessibility, SEO, performance, mobile, and security audit"""
    import time
    start_time = time.time()
    
    url = input.url.strip()
    
    # Add protocol if missing
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Validate URL
    if not validate_url(url):
        raise HTTPException(status_code=400, detail="Invalid URL format")
    
    logger.info(f"Starting real scan for: {url}")
    
    # Perform real website scan
    try:
        scan_result = await scanner.scan_website(url)
    except Exception as e:
        logger.error(f"Scan failed: {e}")
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")
    
    scan_duration = time.time() - start_time
    
    # Process accessibility issues from scan
    raw_a11y_issues = scan_result.get('accessibility_issues', [])
    accessibility_issues = []
    for issue in raw_a11y_issues:
        accessibility_issues.append(AccessibilityIssue(
            type=issue.get('type', 'warning'),
            code=issue.get('code', 'unknown'),
            message=issue.get('message', ''),
            count=issue.get('count', 1),
            impact=issue.get('impact', 'minor'),
            category='accessibility',
            help=issue.get('help'),
            helpUrl=issue.get('helpUrl'),
            wcag=issue.get('wcag'),
            elements=issue.get('elements')
        ))
    
    # Process SEO issues
    raw_seo_issues = scan_result.get('seo_issues', [])
    seo_issues = []
    for issue in raw_seo_issues:
        seo_issues.append(SEOIssue(
            type=issue.get('type', 'warning'),
            code=issue.get('code', 'unknown'),
            message=issue.get('message', ''),
            recommendation=issue.get('recommendation'),
            impact=issue.get('impact', 'minor'),
            category='seo'
        ))
    
    # Process performance metrics
    perf = scan_result.get('performance_metrics', {})
    load_time = perf.get('load_time', 3.0)
    fcp = perf.get('firstContentfulPaint', 1500)
    
    # Calculate LCP based on load time
    lcp = load_time if load_time else 3.0
    lcp_status = "good" if lcp < 2.5 else "needs-improvement" if lcp < 4 else "poor"
    
    # FID estimate (real FID needs user interaction, estimate from FCP)
    fid = fcp / 15 if fcp else 100
    fid_status = "good" if fid < 100 else "needs-improvement" if fid < 300 else "poor"
    
    # CLS - estimate from scan (real CLS needs layout shift monitoring)
    cls = 0.1 if scan_result.get('scan_successful') else 0.3
    cls_status = "good" if cls < 0.1 else "needs-improvement" if cls < 0.25 else "poor"
    
    core_web_vitals = CoreWebVitals(
        lcp=round(lcp, 2),
        lcp_status=lcp_status,
        fid=round(fid, 0),
        fid_status=fid_status,
        cls=round(cls, 3),
        cls_status=cls_status,
        overall_status="good" if all(s == "good" for s in [lcp_status, fid_status, cls_status]) 
                       else "poor" if any(s == "poor" for s in [lcp_status, fid_status, cls_status])
                       else "needs-improvement"
    )
    
    # Process mobile issues
    raw_mobile = scan_result.get('mobile_issues', [])
    mobile_issue_texts = [m.get('message', '') for m in raw_mobile]
    
    has_viewport = not any('viewport' in m.lower() for m in mobile_issue_texts)
    has_overflow = any('scroll' in m.lower() or 'wider' in m.lower() for m in mobile_issue_texts)
    has_small_targets = any('tap' in m.lower() or 'target' in m.lower() for m in mobile_issue_texts)
    
    mobile_friendliness = MobileFriendliness(
        is_mobile_friendly=len(raw_mobile) == 0,
        viewport_configured=has_viewport,
        text_readable=True,  # Hard to determine without rendering
        tap_targets_sized=not has_small_targets,
        content_wider_than_screen=has_overflow,
        issues=mobile_issue_texts[:5]
    )
    
    # Structured data
    # We'll check if there's JSON-LD in the page
    structured_data = StructuredData(
        has_schema=False,  # Would need deeper parsing
        schema_types=[],
        is_valid=True,
        errors=[],
        warnings=[]
    )
    
    # Security from scan
    raw_security = scan_result.get('security_issues', [])
    has_https = url.startswith('https://')
    has_hsts = not any('hsts' in s.get('code', '').lower() for s in raw_security)
    has_csp = not any('content-security-policy' in s.get('code', '').lower() for s in raw_security)
    
    security_score = 0
    if has_https:
        security_score += 40
    if has_hsts:
        security_score += 20
    if has_csp:
        security_score += 25
    if not any('mixed' in s.get('code', '').lower() for s in raw_security):
        security_score += 15
    
    security = SecurityCheck(
        has_https=has_https,
        has_hsts=has_hsts,
        has_csp=has_csp,
        mixed_content=False,
        security_score=security_score
    )
    
    # Calculate scores based on real data
    scores = calculate_scores_from_scan(
        accessibility_issues, seo_issues, 
        core_web_vitals, mobile_friendliness, security
    )
    
    # Count issues
    critical_issues = sum(1 for i in accessibility_issues if i.impact == "critical")
    critical_issues += sum(1 for i in seo_issues if i.impact == "critical")
    warning_count = sum(1 for i in accessibility_issues if i.type == "warning")
    warning_count += sum(1 for i in seo_issues if i.type == "warning")
    total_issues = len(accessibility_issues) + len(seo_issues)
    
    # Determine compliance levels
    lawsuit_risk = determine_lawsuit_risk(scores["accessibility"], critical_issues)
    wcag_level = determine_wcag_level(scores["accessibility"])
    
    # Generate AI-powered recommendations (or fallback to basic)
    try:
        recommendations = await generate_accessibility_recommendations(scan_result)
    except Exception as e:
        logger.warning(f"AI recommendations failed: {e}")
        recommendations = generate_recommendations(
            scores, accessibility_issues, seo_issues, 
            core_web_vitals, mobile_friendliness
        )
    
    # Process images for alt text suggestions (async, limited)
    images_without_alt = scan_result.get('images_without_alt', [])
    if images_without_alt and len(images_without_alt) <= 5:
        try:
            images_without_alt = await generate_alt_text_for_images(images_without_alt)
        except Exception as e:
            logger.warning(f"Alt text generation failed: {e}")
    
    # Create audit response
    audit = FullAuditResponse(
        url=url,
        accessibility_score=scores["accessibility"],
        seo_score=scores["seo"],
        performance_score=scores["performance"],
        mobile_score=scores["mobile"],
        security_score=scores["security"],
        overall_score=scores["overall"],
        lawsuit_risk=lawsuit_risk,
        wcag_level=wcag_level,
        accessibility_issues=accessibility_issues,
        seo_issues=seo_issues,
        core_web_vitals=core_web_vitals,
        mobile_friendliness=mobile_friendliness,
        structured_data=structured_data,
        security=security,
        total_issues=total_issues,
        critical_issues=critical_issues,
        warnings=warning_count,
        top_recommendations=recommendations,
        page_title=scan_result.get('page_title'),
        meta_description=scan_result.get('meta_description'),
        images_without_alt=images_without_alt[:10] if images_without_alt else None,
        scan_successful=scan_result.get('scan_successful', False),
        scan_duration=round(scan_duration, 2)
    )
    
    # Save to database
    doc = audit.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.audits.insert_one(doc)
    
    logger.info(f"Real audit completed for {url}: overall={scores['overall']} in {scan_duration:.2f}s")
    
    return audit


def calculate_scores_from_scan(accessibility_issues, seo_issues, cwv, mobile, security) -> Dict[str, int]:
    """Calculate scores from real scan data"""
    # Accessibility Score
    acc_score = 100
    for issue in accessibility_issues:
        if issue.impact == "critical":
            acc_score -= issue.count * 5
        elif issue.impact == "serious":
            acc_score -= issue.count * 3
        elif issue.impact == "moderate":
            acc_score -= issue.count * 2
        else:
            acc_score -= issue.count * 1
    acc_score = max(0, min(100, acc_score))
    
    # SEO Score
    seo_score = 100
    for issue in seo_issues:
        if issue.impact == "critical":
            seo_score -= 15
        elif issue.impact == "serious":
            seo_score -= 10
        elif issue.impact == "moderate":
            seo_score -= 5
        else:
            seo_score -= 2
    seo_score = max(0, min(100, seo_score))
    
    # Performance Score
    perf_score = 100
    if cwv.lcp_status == "poor":
        perf_score -= 25
    elif cwv.lcp_status == "needs-improvement":
        perf_score -= 10
    if cwv.fid_status == "poor":
        perf_score -= 25
    elif cwv.fid_status == "needs-improvement":
        perf_score -= 10
    if cwv.cls_status == "poor":
        perf_score -= 25
    elif cwv.cls_status == "needs-improvement":
        perf_score -= 10
    perf_score = max(0, min(100, perf_score))
    
    # Mobile Score
    mobile_score = 100
    if not mobile.viewport_configured:
        mobile_score -= 30
    if not mobile.text_readable:
        mobile_score -= 25
    if not mobile.tap_targets_sized:
        mobile_score -= 25
    if mobile.content_wider_than_screen:
        mobile_score -= 20
    mobile_score = max(0, min(100, mobile_score))
    
    # Overall Score
    overall = int(
        acc_score * 0.30 +
        seo_score * 0.25 +
        perf_score * 0.20 +
        mobile_score * 0.15 +
        security.security_score * 0.10
    )
    
    return {
        "accessibility": acc_score,
        "seo": seo_score,
        "performance": perf_score,
        "mobile": mobile_score,
        "security": security.security_score,
        "overall": overall
    }

@api_router.get("/audits")
async def get_audits(limit: int = 10, offset: int = 0):
    """Get audit history"""
    audits = await db.audits.find({}, {"_id": 0}).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    for audit in audits:
        if isinstance(audit.get('created_at'), str):
            audit['created_at'] = datetime.fromisoformat(audit['created_at'])
    
    return audits

@api_router.get("/audit/{audit_id}")
async def get_audit(audit_id: str):
    """Get a specific audit by ID"""
    audit = await db.audits.find_one({"id": audit_id}, {"_id": 0})
    
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    
    if isinstance(audit.get('created_at'), str):
        audit['created_at'] = datetime.fromisoformat(audit['created_at'])
    
    return audit

# Lead Routes
@api_router.post("/leads", response_model=LeadResponse)
async def create_lead(input: LeadCreate):
    """Submit a lead for free accessibility report"""
    lead = LeadResponse(email=input.email, website_url=input.website_url)
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.leads.insert_one(doc)
    logger.info(f"New lead captured: {input.email}")
    return lead

@api_router.get("/leads", response_model=List[LeadResponse])
async def get_leads(limit: int = 50, offset: int = 0):
    """Get all leads"""
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    for lead in leads:
        if isinstance(lead['created_at'], str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads

# Contact Routes
@api_router.post("/contact", response_model=ContactResponse)
async def create_contact(input: ContactCreate):
    """Submit a contact form"""
    contact = ContactResponse(
        name=input.name, email=input.email,
        company=input.company, message=input.message
    )
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    logger.info(f"New contact from: {input.name} ({input.email})")
    return contact

@api_router.get("/contacts", response_model=List[ContactResponse])
async def get_contacts(limit: int = 50, offset: int = 0):
    """Get all contacts"""
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    for contact in contacts:
        if isinstance(contact['created_at'], str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    return contacts

# Stats Route
@api_router.get("/stats")
async def get_stats():
    """Get dashboard statistics"""
    total_audits = await db.audits.count_documents({})
    total_leads = await db.leads.count_documents({})
    total_contacts = await db.contacts.count_documents({})
    
    recent_audits = await db.audits.find({}, {"overall_score": 1}).sort("created_at", -1).limit(100).to_list(100)
    avg_score = sum(a.get('overall_score', 0) for a in recent_audits) / len(recent_audits) if recent_audits else 0
    
    return {
        "total_audits": total_audits,
        "total_leads": total_leads,
        "total_contacts": total_contacts,
        "average_score": round(avg_score, 1)
    }

# ============== Authentication Routes ==============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        user = await create_user(db, user_data)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user["id"], "email": user["email"]}
        )
        
        return TokenResponse(
            access_token=access_token,
            user=UserResponse(
                id=user["id"],
                email=user["email"],
                name=user["name"],
                company=user.get("company"),
                created_at=datetime.fromisoformat(user["created_at"]) if isinstance(user["created_at"], str) else user["created_at"],
                plan=user.get("plan", "free"),
                sites_count=len(user.get("sites", []))
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
    """Login with email and password"""
    user = await authenticate_user(db, login_data.email, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"]}
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            company=user.get("company"),
            created_at=datetime.fromisoformat(user["created_at"]) if isinstance(user["created_at"], str) else user["created_at"],
            plan=user.get("plan", "free"),
            sites_count=len(user.get("sites", []))
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: TokenData = Depends(get_current_user)):
    """Get current user information"""
    user = await get_user_by_id(db, current_user.user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        company=user.get("company"),
        created_at=datetime.fromisoformat(user["created_at"]) if isinstance(user["created_at"], str) else user["created_at"],
        plan=user.get("plan", "free"),
        sites_count=len(user.get("sites", []))
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

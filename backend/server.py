from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import random
import re
from urllib.parse import urlparse

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="WebAbility API", version="1.0.0")

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

# Accessibility Issue Model
class AccessibilityIssue(BaseModel):
    type: str  # error, warning, notice
    code: str
    message: str
    count: int
    impact: str  # critical, serious, moderate, minor

# Audit Models
class AuditCreate(BaseModel):
    url: str

class AuditResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    score: int
    issues: List[AccessibilityIssue]
    lawsuit_risk: str  # low, medium, high
    wcag_level: str  # A, AA, AAA
    total_issues: int
    errors: int
    warnings: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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

def generate_mock_accessibility_issues() -> List[AccessibilityIssue]:
    """Generate realistic mock accessibility issues"""
    possible_issues = [
        AccessibilityIssue(
            type="error",
            code="img-alt",
            message="Images must have alternate text",
            count=random.randint(0, 5),
            impact="critical"
        ),
        AccessibilityIssue(
            type="error",
            code="color-contrast",
            message="Elements must have sufficient color contrast",
            count=random.randint(0, 8),
            impact="serious"
        ),
        AccessibilityIssue(
            type="error",
            code="label",
            message="Form elements must have labels",
            count=random.randint(0, 3),
            impact="critical"
        ),
        AccessibilityIssue(
            type="warning",
            code="link-name",
            message="Links must have discernible text",
            count=random.randint(0, 4),
            impact="serious"
        ),
        AccessibilityIssue(
            type="warning",
            code="heading-order",
            message="Heading levels should only increase by one",
            count=random.randint(0, 2),
            impact="moderate"
        ),
        AccessibilityIssue(
            type="notice",
            code="landmark-one-main",
            message="Document should have one main landmark",
            count=random.randint(0, 1),
            impact="minor"
        ),
        AccessibilityIssue(
            type="notice",
            code="region",
            message="All page content should be contained by landmarks",
            count=random.randint(0, 3),
            impact="moderate"
        ),
        AccessibilityIssue(
            type="error",
            code="button-name",
            message="Buttons must have discernible text",
            count=random.randint(0, 2),
            impact="critical"
        ),
    ]
    
    # Return only issues with count > 0
    return [issue for issue in possible_issues if issue.count > 0]

def calculate_accessibility_score(issues: List[AccessibilityIssue]) -> int:
    """Calculate accessibility score based on issues"""
    base_score = 100
    
    for issue in issues:
        if issue.impact == "critical":
            base_score -= issue.count * 5
        elif issue.impact == "serious":
            base_score -= issue.count * 3
        elif issue.impact == "moderate":
            base_score -= issue.count * 2
        else:  # minor
            base_score -= issue.count * 1
    
    return max(0, min(100, base_score))

def determine_lawsuit_risk(score: int, errors: int) -> str:
    """Determine lawsuit risk based on score and error count"""
    if score >= 90 and errors <= 2:
        return "low"
    elif score >= 70 and errors <= 5:
        return "medium"
    else:
        return "high"

def determine_wcag_level(score: int) -> str:
    """Determine WCAG compliance level"""
    if score >= 95:
        return "AAA"
    elif score >= 80:
        return "AA"
    else:
        return "A"

# ============== Routes ==============

@api_router.get("/")
async def root():
    return {"message": "WebAbility API is running"}

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

# Audit Routes
@api_router.post("/audit", response_model=AuditResponse)
async def create_audit(input: AuditCreate):
    """Perform accessibility audit on a website"""
    url = input.url.strip()
    
    # Add protocol if missing
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Validate URL
    if not validate_url(url):
        raise HTTPException(status_code=400, detail="Invalid URL format")
    
    # Generate mock audit results
    issues = generate_mock_accessibility_issues()
    score = calculate_accessibility_score(issues)
    
    errors = sum(1 for i in issues if i.type == "error")
    warnings = sum(1 for i in issues if i.type == "warning")
    
    lawsuit_risk = determine_lawsuit_risk(score, errors)
    wcag_level = determine_wcag_level(score)
    
    audit = AuditResponse(
        url=url,
        score=score,
        issues=issues,
        lawsuit_risk=lawsuit_risk,
        wcag_level=wcag_level,
        total_issues=len(issues),
        errors=errors,
        warnings=warnings
    )
    
    # Save to database
    doc = audit.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['issues'] = [i.model_dump() for i in issues]
    await db.audits.insert_one(doc)
    
    logger.info(f"Audit completed for {url}: score={score}, issues={len(issues)}")
    
    return audit

@api_router.get("/audits", response_model=List[AuditResponse])
async def get_audits(limit: int = 10, offset: int = 0):
    """Get audit history"""
    audits = await db.audits.find({}, {"_id": 0}).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    for audit in audits:
        if isinstance(audit['created_at'], str):
            audit['created_at'] = datetime.fromisoformat(audit['created_at'])
        audit['issues'] = [AccessibilityIssue(**i) for i in audit['issues']]
    
    return audits

@api_router.get("/audit/{audit_id}", response_model=AuditResponse)
async def get_audit(audit_id: str):
    """Get a specific audit by ID"""
    audit = await db.audits.find_one({"id": audit_id}, {"_id": 0})
    
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    
    if isinstance(audit['created_at'], str):
        audit['created_at'] = datetime.fromisoformat(audit['created_at'])
    audit['issues'] = [AccessibilityIssue(**i) for i in audit['issues']]
    
    return audit

# Lead Routes
@api_router.post("/leads", response_model=LeadResponse)
async def create_lead(input: LeadCreate):
    """Submit a lead for free accessibility report"""
    lead = LeadResponse(
        email=input.email,
        website_url=input.website_url
    )
    
    # Save to database
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.leads.insert_one(doc)
    
    logger.info(f"New lead captured: {input.email}")
    
    return lead

@api_router.get("/leads", response_model=List[LeadResponse])
async def get_leads(limit: int = 50, offset: int = 0):
    """Get all leads (admin endpoint)"""
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
        name=input.name,
        email=input.email,
        company=input.company,
        message=input.message
    )
    
    # Save to database
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    
    logger.info(f"New contact form submission from: {input.name} ({input.email})")
    
    return contact

@api_router.get("/contacts", response_model=List[ContactResponse])
async def get_contacts(limit: int = 50, offset: int = 0):
    """Get all contact submissions (admin endpoint)"""
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
    
    # Get average score from recent audits
    recent_audits = await db.audits.find({}, {"score": 1}).sort("created_at", -1).limit(100).to_list(100)
    avg_score = sum(a['score'] for a in recent_audits) / len(recent_audits) if recent_audits else 0
    
    return {
        "total_audits": total_audits,
        "total_leads": total_leads,
        "total_contacts": total_contacts,
        "average_score": round(avg_score, 1)
    }

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

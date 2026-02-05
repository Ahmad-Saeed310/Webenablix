"""
Real Website Scanner for Webenablix
Uses Playwright for headless browser automation and axe-core for accessibility testing
"""

import asyncio
import httpx
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
from urllib.parse import urljoin, urlparse
import re
import logging
import base64

logger = logging.getLogger(__name__)

# Axe-core accessibility testing script
AXE_CORE_SCRIPT = """
(function() {
    return new Promise((resolve, reject) => {
        // Inject axe-core if not present
        if (!window.axe) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js';
            script.onload = function() {
                axe.run().then(resolve).catch(reject);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        } else {
            axe.run().then(resolve).catch(reject);
        }
    });
})();
"""

class WebsiteScanner:
    """Real website scanner using Playwright and accessibility testing"""
    
    def __init__(self):
        self.timeout = 30000  # 30 seconds
    
    async def scan_website(self, url: str) -> Dict[str, Any]:
        """Perform comprehensive website scan"""
        logger.info(f"Starting scan for: {url}")
        
        # Normalize URL
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        result = {
            'url': url,
            'accessibility_issues': [],
            'seo_issues': [],
            'images_without_alt': [],
            'performance_metrics': {},
            'mobile_issues': [],
            'security_issues': [],
            'page_title': '',
            'meta_description': '',
            'headings': [],
            'links': {'internal': 0, 'external': 0, 'broken': []},
            'html_validation': [],
            'scan_successful': False,
            'error': None
        }
        
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=['--no-sandbox', '--disable-dev-shm-usage']
                )
                context = await browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Webenablix/1.0'
                )
                page = await context.new_page()
                
                # Measure performance
                import time
                start_time = time.time()
                
                # Navigate to page
                try:
                    response = await page.goto(url, wait_until='domcontentloaded', timeout=self.timeout)
                    load_time = time.time() - start_time
                    result['performance_metrics']['load_time'] = round(load_time, 2)
                    
                    if response:
                        result['performance_metrics']['status_code'] = response.status
                        result['security_issues'] = self._check_security(url, dict(response.headers))
                except Exception as e:
                    logger.warning(f"Navigation warning: {e}")
                    result['error'] = f"Failed to load page: {str(e)}"
                    await browser.close()
                    return result
                
                # Wait for page to be fully loaded
                await page.wait_for_timeout(2000)
                
                # Get page content
                content = await page.content()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Extract basic SEO info
                result['page_title'] = self._get_page_title(soup)
                result['meta_description'] = self._get_meta_description(soup)
                result['headings'] = self._get_headings(soup)
                
                # Check for images without alt text
                result['images_without_alt'] = await self._check_images(page, soup, url)
                
                # Check links
                result['links'] = await self._check_links(page, soup, url)
                
                # Run axe-core accessibility tests
                try:
                    axe_results = await page.evaluate(AXE_CORE_SCRIPT)
                    result['accessibility_issues'] = self._process_axe_results(axe_results)
                except Exception as e:
                    logger.warning(f"Axe-core test failed: {e}")
                    # Fallback to basic HTML checks
                    result['accessibility_issues'] = self._basic_accessibility_check(soup)
                
                # SEO analysis
                result['seo_issues'] = self._analyze_seo(soup, url)
                
                # HTML validation
                result['html_validation'] = self._validate_html(soup)
                
                # Mobile check
                await page.set_viewport_size({'width': 375, 'height': 667})
                await page.wait_for_timeout(1000)
                result['mobile_issues'] = await self._check_mobile(page, soup)
                
                # Performance metrics
                perf_metrics = await page.evaluate("""
                    () => {
                        const perf = performance.getEntriesByType('navigation')[0];
                        const paint = performance.getEntriesByType('paint');
                        return {
                            domContentLoaded: perf ? perf.domContentLoadedEventEnd : null,
                            loadComplete: perf ? perf.loadEventEnd : null,
                            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
                            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime
                        };
                    }
                """)
                result['performance_metrics'].update(perf_metrics)
                
                await browser.close()
                result['scan_successful'] = True
                
        except Exception as e:
            logger.error(f"Scan failed for {url}: {e}")
            result['error'] = str(e)
        
        return result
    
    def _get_page_title(self, soup: BeautifulSoup) -> str:
        title_tag = soup.find('title')
        return title_tag.get_text().strip() if title_tag else ''
    
    def _get_meta_description(self, soup: BeautifulSoup) -> str:
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        return meta_desc.get('content', '').strip() if meta_desc else ''
    
    def _get_headings(self, soup: BeautifulSoup) -> List[Dict]:
        headings = []
        for i in range(1, 7):
            for h in soup.find_all(f'h{i}'):
                headings.append({
                    'level': i,
                    'text': h.get_text().strip()[:100]
                })
        return headings[:20]  # Limit to first 20
    
    async def _check_images(self, page, soup: BeautifulSoup, base_url: str) -> List[Dict]:
        """Check images for alt text and collect URLs for AI analysis"""
        images_without_alt = []
        
        for img in soup.find_all('img'):
            src = img.get('src', '')
            alt = img.get('alt')
            
            if not src:
                continue
            
            # Resolve relative URLs
            if not src.startswith(('http://', 'https://', 'data:')):
                src = urljoin(base_url, src)
            
            # Check if alt is missing or empty
            if alt is None or alt.strip() == '':
                images_without_alt.append({
                    'src': src,
                    'has_alt': False,
                    'suggested_alt': None,  # Will be filled by AI
                    'context': self._get_image_context(img)
                })
        
        return images_without_alt[:50]  # Limit to 50 images
    
    def _get_image_context(self, img) -> str:
        """Get surrounding text context for image"""
        context = []
        
        # Get parent text
        parent = img.find_parent()
        if parent:
            parent_text = parent.get_text().strip()[:100]
            if parent_text:
                context.append(parent_text)
        
        # Get figcaption if in figure
        figure = img.find_parent('figure')
        if figure:
            figcaption = figure.find('figcaption')
            if figcaption:
                context.append(figcaption.get_text().strip()[:100])
        
        return ' | '.join(context) if context else ''
    
    async def _check_links(self, page, soup: BeautifulSoup, base_url: str) -> Dict:
        """Analyze links on the page"""
        internal = 0
        external = 0
        broken = []
        base_domain = urlparse(base_url).netloc
        
        links = soup.find_all('a', href=True)
        
        for link in links[:100]:  # Limit to 100 links
            href = link.get('href', '')
            
            if not href or href.startswith(('#', 'javascript:', 'mailto:', 'tel:')):
                continue
            
            # Resolve relative URLs
            full_url = urljoin(base_url, href)
            parsed = urlparse(full_url)
            
            if parsed.netloc == base_domain:
                internal += 1
            else:
                external += 1
            
            # Check link text
            link_text = link.get_text().strip()
            if not link_text and not link.find('img'):
                broken.append({
                    'href': href,
                    'issue': 'Empty link text (WCAG 2.4.4)'
                })
        
        return {
            'internal': internal,
            'external': external,
            'broken': broken[:10]  # Limit broken links report
        }
    
    def _process_axe_results(self, axe_results: Dict) -> List[Dict]:
        """Process axe-core results into our format"""
        issues = []
        
        if not axe_results:
            return issues
        
        violations = axe_results.get('violations', [])
        
        for violation in violations:
            impact_map = {
                'critical': 'critical',
                'serious': 'serious', 
                'moderate': 'moderate',
                'minor': 'minor'
            }
            
            issue = {
                'type': 'error' if violation.get('impact') in ['critical', 'serious'] else 'warning',
                'code': violation.get('id', 'unknown'),
                'message': violation.get('description', ''),
                'help': violation.get('help', ''),
                'helpUrl': violation.get('helpUrl', ''),
                'impact': impact_map.get(violation.get('impact', 'minor'), 'minor'),
                'count': len(violation.get('nodes', [])),
                'wcag': [t.get('id', '') for t in violation.get('tags', []) if 'wcag' in t.get('id', '')],
                'elements': [
                    {
                        'selector': node.get('target', []),
                        'html': node.get('html', '')[:200]
                    } 
                    for node in violation.get('nodes', [])[:5]
                ]
            }
            issues.append(issue)
        
        return issues
    
    def _basic_accessibility_check(self, soup: BeautifulSoup) -> List[Dict]:
        """Fallback basic accessibility checks"""
        issues = []
        
        # Check for missing alt text
        imgs_no_alt = soup.find_all('img', alt=False)
        imgs_empty_alt = [img for img in soup.find_all('img', alt=True) if not img.get('alt').strip()]
        if imgs_no_alt or imgs_empty_alt:
            issues.append({
                'type': 'error',
                'code': 'img-alt',
                'message': 'Images must have alternate text (WCAG 1.1.1)',
                'impact': 'critical',
                'count': len(imgs_no_alt) + len(imgs_empty_alt)
            })
        
        # Check for missing form labels
        inputs = soup.find_all(['input', 'select', 'textarea'])
        unlabeled = 0
        for inp in inputs:
            inp_id = inp.get('id')
            inp_type = inp.get('type', '')
            if inp_type in ['hidden', 'submit', 'button', 'reset']:
                continue
            if inp_id and soup.find('label', attrs={'for': inp_id}):
                continue
            if inp.find_parent('label'):
                continue
            unlabeled += 1
        
        if unlabeled:
            issues.append({
                'type': 'error',
                'code': 'label',
                'message': 'Form elements must have labels (WCAG 1.3.1)',
                'impact': 'critical',
                'count': unlabeled
            })
        
        # Check for lang attribute
        html_tag = soup.find('html')
        if not html_tag or not html_tag.get('lang'):
            issues.append({
                'type': 'error',
                'code': 'html-lang',
                'message': 'Page must have lang attribute (WCAG 3.1.1)',
                'impact': 'serious',
                'count': 1
            })
        
        # Check for page title
        if not soup.find('title') or not soup.find('title').get_text().strip():
            issues.append({
                'type': 'error',
                'code': 'page-title',
                'message': 'Page must have a title (WCAG 2.4.2)',
                'impact': 'serious',
                'count': 1
            })
        
        # Check heading structure
        h1_count = len(soup.find_all('h1'))
        if h1_count == 0:
            issues.append({
                'type': 'warning',
                'code': 'heading-order',
                'message': 'Page should have at least one h1 heading',
                'impact': 'moderate',
                'count': 1
            })
        elif h1_count > 1:
            issues.append({
                'type': 'warning',
                'code': 'multiple-h1',
                'message': 'Page has multiple h1 headings',
                'impact': 'moderate',
                'count': h1_count
            })
        
        # Check for skip links
        skip_link = soup.find('a', class_=re.compile(r'skip', re.I)) or \
                   soup.find('a', href='#main') or \
                   soup.find('a', href='#content')
        if not skip_link:
            issues.append({
                'type': 'warning',
                'code': 'bypass',
                'message': 'Page should have skip navigation links (WCAG 2.4.1)',
                'impact': 'moderate',
                'count': 1
            })
        
        # Check color contrast (basic - just flag inline styles)
        elements_with_color = soup.find_all(style=re.compile(r'color:', re.I))
        if elements_with_color:
            issues.append({
                'type': 'warning',
                'code': 'color-contrast',
                'message': 'Elements with inline color styles should be checked for contrast',
                'impact': 'serious',
                'count': len(elements_with_color)
            })
        
        return issues
    
    def _analyze_seo(self, soup: BeautifulSoup, url: str) -> List[Dict]:
        """Analyze SEO issues"""
        issues = []
        
        # Title tag
        title = soup.find('title')
        if not title:
            issues.append({
                'type': 'error',
                'code': 'title-tag',
                'message': 'Title tag is missing',
                'recommendation': 'Add a unique title tag between 50-60 characters',
                'impact': 'critical'
            })
        elif title:
            title_text = title.get_text().strip()
            if len(title_text) < 30:
                issues.append({
                    'type': 'warning',
                    'code': 'title-too-short',
                    'message': f'Title tag is too short ({len(title_text)} chars)',
                    'recommendation': 'Title should be 50-60 characters',
                    'impact': 'moderate'
                })
            elif len(title_text) > 60:
                issues.append({
                    'type': 'warning',
                    'code': 'title-too-long',
                    'message': f'Title tag is too long ({len(title_text)} chars)',
                    'recommendation': 'Title should be 50-60 characters',
                    'impact': 'moderate'
                })
        
        # Meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if not meta_desc:
            issues.append({
                'type': 'error',
                'code': 'meta-description',
                'message': 'Meta description is missing',
                'recommendation': 'Add meta description between 150-160 characters',
                'impact': 'serious'
            })
        elif meta_desc:
            desc_text = meta_desc.get('content', '').strip()
            if len(desc_text) < 100:
                issues.append({
                    'type': 'warning',
                    'code': 'meta-description-short',
                    'message': f'Meta description is short ({len(desc_text)} chars)',
                    'recommendation': 'Meta description should be 150-160 characters',
                    'impact': 'moderate'
                })
            elif len(desc_text) > 160:
                issues.append({
                    'type': 'warning',
                    'code': 'meta-description-long',
                    'message': f'Meta description is too long ({len(desc_text)} chars)',
                    'recommendation': 'Meta description should be under 160 characters',
                    'impact': 'minor'
                })
        
        # H1 tag
        h1_tags = soup.find_all('h1')
        if len(h1_tags) == 0:
            issues.append({
                'type': 'error',
                'code': 'h1-missing',
                'message': 'H1 tag is missing',
                'recommendation': 'Add exactly one H1 tag with primary keyword',
                'impact': 'serious'
            })
        elif len(h1_tags) > 1:
            issues.append({
                'type': 'warning',
                'code': 'multiple-h1',
                'message': f'Multiple H1 tags found ({len(h1_tags)})',
                'recommendation': 'Use only one H1 tag per page',
                'impact': 'moderate'
            })
        
        # Canonical tag
        canonical = soup.find('link', rel='canonical')
        if not canonical:
            issues.append({
                'type': 'warning',
                'code': 'canonical-missing',
                'message': 'Canonical tag is missing',
                'recommendation': 'Add canonical tag to prevent duplicate content',
                'impact': 'moderate'
            })
        
        # Open Graph tags
        og_tags = soup.find_all('meta', property=re.compile(r'^og:'))
        if len(og_tags) < 3:
            issues.append({
                'type': 'warning',
                'code': 'og-tags-missing',
                'message': 'Open Graph tags are incomplete',
                'recommendation': 'Add og:title, og:description, og:image for social sharing',
                'impact': 'minor'
            })
        
        # Robots meta
        robots = soup.find('meta', attrs={'name': 'robots'})
        if robots:
            content = robots.get('content', '').lower()
            if 'noindex' in content:
                issues.append({
                    'type': 'warning',
                    'code': 'noindex-found',
                    'message': 'Page has noindex directive',
                    'recommendation': 'Remove noindex if this page should be searchable',
                    'impact': 'critical'
                })
        
        # Check for structured data
        scripts = soup.find_all('script', type='application/ld+json')
        if not scripts:
            issues.append({
                'type': 'notice',
                'code': 'no-structured-data',
                'message': 'No structured data (JSON-LD) found',
                'recommendation': 'Add Schema.org markup for rich snippets',
                'impact': 'minor'
            })
        
        return issues
    
    def _check_security(self, url: str, headers: Dict) -> List[Dict]:
        """Check security headers"""
        issues = []
        
        if not url.startswith('https://'):
            issues.append({
                'type': 'error',
                'code': 'no-https',
                'message': 'Site is not using HTTPS',
                'impact': 'critical'
            })
        
        # Check security headers
        security_headers = {
            'strict-transport-security': ('HSTS header missing', 'serious'),
            'content-security-policy': ('CSP header missing', 'moderate'),
            'x-content-type-options': ('X-Content-Type-Options header missing', 'minor'),
            'x-frame-options': ('X-Frame-Options header missing', 'moderate'),
            'x-xss-protection': ('X-XSS-Protection header missing', 'minor')
        }
        
        for header, (message, impact) in security_headers.items():
            if header not in [h.lower() for h in headers.keys()]:
                issues.append({
                    'type': 'warning',
                    'code': header,
                    'message': message,
                    'impact': impact
                })
        
        return issues
    
    def _validate_html(self, soup: BeautifulSoup) -> List[Dict]:
        """Basic HTML validation"""
        issues = []
        
        # Check for doctype
        # Note: BeautifulSoup doesn't preserve doctype well, but we can check
        
        # Check for duplicate IDs
        ids = [el.get('id') for el in soup.find_all(id=True)]
        duplicates = set([x for x in ids if ids.count(x) > 1])
        if duplicates:
            issues.append({
                'type': 'error',
                'code': 'duplicate-id',
                'message': f'Duplicate IDs found: {", ".join(list(duplicates)[:5])}',
                'impact': 'serious'
            })
        
        # Check for deprecated tags
        deprecated = ['font', 'center', 'big', 'strike', 'marquee', 'blink']
        for tag in deprecated:
            found = soup.find_all(tag)
            if found:
                issues.append({
                    'type': 'warning',
                    'code': f'deprecated-{tag}',
                    'message': f'Deprecated <{tag}> tag found ({len(found)} instances)',
                    'impact': 'minor'
                })
        
        return issues
    
    async def _check_mobile(self, page, soup: BeautifulSoup) -> List[Dict]:
        """Check mobile friendliness"""
        issues = []
        
        # Check viewport
        viewport = soup.find('meta', attrs={'name': 'viewport'})
        if not viewport:
            issues.append({
                'type': 'error',
                'code': 'no-viewport',
                'message': 'Viewport meta tag not configured',
                'impact': 'critical'
            })
        elif viewport:
            content = viewport.get('content', '')
            if 'width=device-width' not in content:
                issues.append({
                    'type': 'warning',
                    'code': 'viewport-config',
                    'message': 'Viewport should include width=device-width',
                    'impact': 'serious'
                })
        
        # Check for horizontal overflow
        try:
            overflow = await page.evaluate("""
                () => {
                    return document.body.scrollWidth > window.innerWidth;
                }
            """)
            if overflow:
                issues.append({
                    'type': 'error',
                    'code': 'horizontal-scroll',
                    'message': 'Content wider than screen on mobile',
                    'impact': 'serious'
                })
        except:
            pass
        
        # Check tap target sizes
        try:
            small_targets = await page.evaluate("""
                () => {
                    const clickables = document.querySelectorAll('a, button, input, select, textarea');
                    let small = 0;
                    clickables.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        if (rect.width < 44 || rect.height < 44) {
                            if (rect.width > 0 && rect.height > 0) {
                                small++;
                            }
                        }
                    });
                    return small;
                }
            """)
            if small_targets > 5:
                issues.append({
                    'type': 'warning',
                    'code': 'small-tap-targets',
                    'message': f'{small_targets} tap targets smaller than 44x44px',
                    'impact': 'moderate'
                })
        except:
            pass
        
        return issues


# Singleton scanner instance
scanner = WebsiteScanner()

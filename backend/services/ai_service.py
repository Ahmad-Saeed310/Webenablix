"""
AI Service for Webenablix
Handles AI-powered features like alt text generation
"""

import os
import logging
import httpx
import base64
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Get the Emergent LLM key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

async def generate_alt_text_for_images(images: List[Dict]) -> List[Dict]:
    """
    Generate alt text suggestions for images using AI
    
    Args:
        images: List of dicts with 'src' and 'context' keys
    
    Returns:
        List of dicts with added 'suggested_alt' field
    """
    if not EMERGENT_LLM_KEY:
        logger.warning("EMERGENT_LLM_KEY not set, skipping AI alt text generation")
        return images
    
    if not images:
        return images
    
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
        
        results = []
        
        # Process images (limit to first 10 for performance)
        for img_data in images[:10]:
            src = img_data.get('src', '')
            context = img_data.get('context', '')
            
            # Skip data URIs and invalid URLs
            if not src or src.startswith('data:'):
                img_data['suggested_alt'] = None
                results.append(img_data)
                continue
            
            try:
                # Download image and convert to base64
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.get(src)
                    if response.status_code == 200:
                        content_type = response.headers.get('content-type', '')
                        
                        # Only process JPEG, PNG, WEBP
                        if any(fmt in content_type.lower() for fmt in ['jpeg', 'jpg', 'png', 'webp']):
                            image_base64 = base64.b64encode(response.content).decode('utf-8')
                            
                            # Create chat instance for this image
                            chat = LlmChat(
                                api_key=EMERGENT_LLM_KEY,
                                session_id=f"alt-text-{hash(src)}",
                                system_message="You are an accessibility expert. Generate concise, descriptive alt text for images. Alt text should be informative but brief (under 125 characters). Describe what the image shows, not what it is."
                            ).with_model("openai", "gpt-4o-mini")
                            
                            # Create message with image
                            image_content = ImageContent(image_base64=image_base64)
                            
                            context_hint = f" Context from page: {context}" if context else ""
                            
                            user_message = UserMessage(
                                text=f"Generate alt text for this image.{context_hint} Be concise (under 125 chars) and descriptive.",
                                image_contents=[image_content]
                            )
                            
                            # Get response
                            alt_text = await chat.send_message(user_message)
                            
                            # Clean up the response
                            if alt_text:
                                alt_text = alt_text.strip().strip('"').strip("'")
                                if len(alt_text) > 125:
                                    alt_text = alt_text[:122] + '...'
                            
                            img_data['suggested_alt'] = alt_text
                            logger.info(f"Generated alt text for {src[:50]}...")
                        else:
                            img_data['suggested_alt'] = None
                    else:
                        img_data['suggested_alt'] = None
                        
            except Exception as e:
                logger.warning(f"Failed to generate alt text for {src}: {e}")
                img_data['suggested_alt'] = None
            
            results.append(img_data)
        
        # Add remaining images without processing
        for img_data in images[10:]:
            img_data['suggested_alt'] = None
            results.append(img_data)
        
        return results
        
    except ImportError:
        logger.error("emergentintegrations not installed")
        return images
    except Exception as e:
        logger.error(f"AI alt text generation failed: {e}")
        return images


async def generate_accessibility_recommendations(scan_results: Dict) -> List[str]:
    """
    Generate AI-powered recommendations based on scan results
    """
    if not EMERGENT_LLM_KEY:
        return _generate_basic_recommendations(scan_results)
    
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        # Prepare summary of issues
        a11y_issues = scan_results.get('accessibility_issues', [])
        seo_issues = scan_results.get('seo_issues', [])
        mobile_issues = scan_results.get('mobile_issues', [])
        
        issues_summary = f"""
        Accessibility Issues: {len(a11y_issues)}
        - Critical: {len([i for i in a11y_issues if i.get('impact') == 'critical'])}
        - Serious: {len([i for i in a11y_issues if i.get('impact') == 'serious'])}
        
        Top issues: {', '.join([i.get('code', '') for i in a11y_issues[:5]])}
        
        SEO Issues: {len(seo_issues)}
        Mobile Issues: {len(mobile_issues)}
        Images without alt: {len(scan_results.get('images_without_alt', []))}
        """
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"recommendations-{hash(scan_results.get('url', ''))}",
            system_message="You are a web accessibility and SEO expert. Provide 5 actionable, prioritized recommendations based on scan results. Be specific and concise."
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(
            text=f"Based on this website scan, provide 5 specific, prioritized recommendations:\n{issues_summary}"
        )
        
        response = await chat.send_message(user_message)
        
        # Parse response into list
        if response:
            recommendations = []
            lines = response.strip().split('\n')
            for line in lines:
                line = line.strip()
                if line and (line[0].isdigit() or line.startswith('-') or line.startswith('•')):
                    # Clean up numbering
                    clean = line.lstrip('0123456789.-•) ').strip()
                    if clean:
                        recommendations.append(clean[:200])
            return recommendations[:5]
        
    except Exception as e:
        logger.error(f"AI recommendations failed: {e}")
    
    return _generate_basic_recommendations(scan_results)


def _generate_basic_recommendations(scan_results: Dict) -> List[str]:
    """Generate basic recommendations without AI"""
    recommendations = []
    
    a11y_issues = scan_results.get('accessibility_issues', [])
    seo_issues = scan_results.get('seo_issues', [])
    images = scan_results.get('images_without_alt', [])
    mobile_issues = scan_results.get('mobile_issues', [])
    
    # Critical accessibility
    critical_a11y = [i for i in a11y_issues if i.get('impact') == 'critical']
    if critical_a11y:
        recommendations.append(f"Fix {len(critical_a11y)} critical accessibility issues: {', '.join([i.get('code', '') for i in critical_a11y[:3]])}")
    
    # Images
    if images:
        recommendations.append(f"Add alt text to {len(images)} images for screen reader accessibility")
    
    # SEO
    seo_errors = [i for i in seo_issues if i.get('type') == 'error']
    if seo_errors:
        recommendations.append(f"Address {len(seo_errors)} SEO errors: {', '.join([i.get('code', '') for i in seo_errors[:3]])}")
    
    # Mobile
    if mobile_issues:
        recommendations.append(f"Fix {len(mobile_issues)} mobile usability issues")
    
    # General
    if not recommendations:
        recommendations.append("Continue monitoring for accessibility compliance")
    
    return recommendations[:5]

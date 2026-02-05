# WebAbility Clone - API Contracts & Backend Implementation

## Overview
This document outlines the API contracts and implementation plan for the WebAbility clone backend.

## Features to Implement

### 1. Website Accessibility Audit
- **Purpose**: Allow users to check their website's accessibility score
- **Endpoint**: `POST /api/audit`
- **Request Body**:
```json
{
  "url": "https://example.com"
}
```
- **Response**:
```json
{
  "id": "uuid",
  "url": "https://example.com",
  "score": 85,
  "issues": [
    {
      "type": "error",
      "code": "img-alt",
      "message": "Images must have alternate text",
      "count": 3
    }
  ],
  "lawsuitRisk": "low",
  "wcagLevel": "AA",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### 2. Lead Generation (Free Report Request)
- **Purpose**: Capture user emails for free accessibility report
- **Endpoint**: `POST /api/leads`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "website_url": "https://example.com"
}
```
- **Response**:
```json
{
  "id": "uuid",
  "message": "Report request submitted successfully",
  "email": "user@example.com"
}
```

### 3. Contact Form Submission
- **Purpose**: Handle contact form submissions
- **Endpoint**: `POST /api/contact`
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Inc",
  "message": "I need help with accessibility"
}
```

### 4. Get Audit History
- **Endpoint**: `GET /api/audits`
- **Query Params**: `?limit=10&offset=0`

## Mock Data Currently in Frontend

### File: `/app/frontend/src/data/mock.js`
- `navigationItems` - Navigation menu items (static, no backend needed)
- `heroStats` - Accessibility score and lawsuit risk (will be dynamic from audit)
- `features` - Feature descriptions (static)
- `footerLinks` - Footer navigation (static)

## Database Models

### Audit Model
```python
class Audit:
    id: str
    url: str
    score: int  # 0-100
    issues: List[dict]
    lawsuit_risk: str  # low, medium, high
    wcag_level: str  # A, AA, AAA
    created_at: datetime
```

### Lead Model
```python
class Lead:
    id: str
    email: str
    website_url: str
    created_at: datetime
```

### Contact Model
```python
class Contact:
    id: str
    name: str
    email: str
    company: str
    message: str
    created_at: datetime
```

## Frontend Integration Points

1. **AuditSection.jsx** - Connect to `POST /api/audit`
2. **Modals.jsx** (AccessibilityReportModal) - Connect to `POST /api/leads`
3. **HeroSection.jsx** - Display real audit results if available

## Implementation Order
1. Create MongoDB models
2. Implement audit endpoint with mock scoring algorithm
3. Implement lead capture endpoint
4. Implement contact form endpoint
5. Update frontend components to use real APIs

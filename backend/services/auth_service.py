"""
Authentication Service for Webenablix
JWT-based authentication with password hashing
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Load JWT secret from env or generate one
JWT_SECRET = os.environ.get('JWT_SECRET', 'webenablix-secret-key-change-in-production-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Bearer token scheme
security = HTTPBearer()

# ============== Models ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    company: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    company: Optional[str] = None
    created_at: datetime
    plan: str = "free"
    sites_count: int = 0

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None

# ============== Password Utilities ==============

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

# ============== JWT Utilities ==============

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[TokenData]:
    """Decode and verify a JWT access token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        
        if user_id is None:
            return None
        
        return TokenData(user_id=user_id, email=email)
    except JWTError:
        return None

# ============== Dependency for Protected Routes ==============

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get the current authenticated user"""
    token = credentials.credentials
    token_data = decode_access_token(token)
    
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return token_data

# ============== User Database Operations ==============

async def create_user(db, user_data: UserCreate) -> dict:
    """Create a new user in the database"""
    import uuid
    
    # Check if email already exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user document
    user_doc = {
        "id": str(uuid.uuid4()),
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "name": user_data.name,
        "company": user_data.company,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "plan": "free",
        "sites": [],
        "settings": {
            "widget_defaults": {},
            "notifications": True
        }
    }
    
    await db.users.insert_one(user_doc)
    
    # Remove password_hash from response
    del user_doc["password_hash"]
    return user_doc

async def authenticate_user(db, email: str, password: str) -> Optional[dict]:
    """Authenticate a user by email and password"""
    user = await db.users.find_one({"email": email})
    
    if not user:
        return None
    
    if not verify_password(password, user.get("password_hash", "")):
        return None
    
    return user

async def get_user_by_id(db, user_id: str) -> Optional[dict]:
    """Get a user by their ID"""
    user = await db.users.find_one({"id": user_id}, {"password_hash": 0, "_id": 0})
    return user

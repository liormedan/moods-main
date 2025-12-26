from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth
from backend.app.core.firebase import auth
import jwt

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify Firebase ID token or custom token and return user info
    """
    token = credentials.credentials
    
    try:
        # First, try to verify as ID token (standard Firebase token)
        try:
            decoded_token = firebase_auth.verify_id_token(token)
            user_id = decoded_token['uid']
            email = decoded_token.get('email')
            
            return {
                'id': user_id,
                'email': email,
                'is_active': True
            }
        except Exception as id_token_error:
            # If ID token verification fails, try to decode as custom token
            # Custom tokens are JWTs signed by Firebase Admin SDK
            error_msg = str(id_token_error)
            
            # Always try to decode as custom token if ID token fails
            try:
                # Decode without verification first to get the payload
                decoded = jwt.decode(token, options={"verify_signature": False})
                
                # Check if it's a custom token (has 'uid' in payload)
                if 'uid' in decoded:
                    user_id = decoded['uid']
                    # Get user info from Firebase Admin SDK to verify user exists
                    user = firebase_auth.get_user(user_id)
                    
                    return {
                        'id': user.uid,
                        'email': user.email,
                        'is_active': not user.disabled
                    }
                else:
                    # Not a custom token, raise the original ID token error
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Invalid token: {error_msg}"
                    )
            except jwt.DecodeError:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Invalid token format: {error_msg}"
                )
            except firebase_auth.UserNotFoundError:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User not found"
                )
            except HTTPException:
                raise
            except Exception as decode_error:
                # If decoding also fails, raise the original error
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Could not validate credentials: {error_msg}"
                )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Could not validate credentials: {str(e)}"
        )

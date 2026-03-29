from fastapi import APIRouter, HTTPException, status
from .models import SignupRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest, TokenResponse
from .utils import hash_password, verify_password, create_access_token, create_reset_token, decode_token
from . import store

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest):
    if store.get_user(body.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    store.create_user(body.name, body.email, hash_password(body.password))
    return {"message": "Account created successfully"}


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    user = store.get_user(body.email)
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user["email"], "name": user["name"]})
    return TokenResponse(access_token=token)


@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest):
    user = store.get_user(body.email)
    if not user:
        return {"message": "If that email is registered, a reset link has been sent"}
    reset_token = create_reset_token(body.email)
    return {"message": "Reset token generated", "reset_token": reset_token}


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest):
    payload = decode_token(body.token)
    if not payload or payload.get("type") != "reset":
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    email = payload.get("sub")
    if not store.update_password(email, hash_password(body.new_password)):
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Password updated successfully"}

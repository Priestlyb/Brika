/**
 * -----------------------------------------------------------------------------
 * File: src/services/auth/auth.types.ts
 * -----------------------------------------------------------------------------
 * Brika frontend authentication types.
 *
 * These types mirror the authentication and authenticated-user contracts
 * exposed by the Brika backend.
 * -----------------------------------------------------------------------------
 */

/**
 * -----------------------------------------------------------------------------
 * User Role
 * -----------------------------------------------------------------------------
 *
 * Keep this aligned with the backend Prisma UserRole enum.
 */

export type UserRole =
    | "USER"
    | "ADMIN";

/**
 * -----------------------------------------------------------------------------
 * Authenticated User
 * -----------------------------------------------------------------------------
 *
 * Mirrors the backend UserProfileResponse contract.
 */

export interface AuthUser {
    id: string;

    email: string;

    firstName: string;

    lastName: string;

    phone: string | null;

    avatarUrl: string | null;

    company: string | null;

    country: string | null;

    role: UserRole;

    emailVerified: boolean;

    createdAt: string;

    updatedAt: string;
}

/**
 * -----------------------------------------------------------------------------
 * Token Pair
 * -----------------------------------------------------------------------------
 *
 * Access token:
 * Used by the frontend when making authenticated API requests.
 *
 * Refresh token:
 * Used by the backend to restore/refresh an authenticated session.
 *
 * The backend may store the refresh token in an HTTP-only cookie. The property
 * remains part of the response contract for compatibility with the backend.
 */

export interface TokenPair {
    accessToken: string;

    refreshToken: string;
}

/**
 * -----------------------------------------------------------------------------
 * Authentication Response
 * -----------------------------------------------------------------------------
 *
 * Returned by:
 *
 * - POST /auth/register
 * - POST /auth/login
 * - POST /auth/refresh
 */

export interface AuthResponse {
    user: AuthUser;

    tokens: TokenPair;
}

/**
 * -----------------------------------------------------------------------------
 * Authentication API Response
 * -----------------------------------------------------------------------------
 */

export interface AuthApiResponse {
    success: boolean;

    message: string;

    data: AuthResponse;
}

/**
 * -----------------------------------------------------------------------------
 * Register
 * -----------------------------------------------------------------------------
 */

export interface RegisterInput {
    firstName: string;

    lastName: string;

    email: string;

    password: string;

    confirmPassword: string;
}

/**
 * -----------------------------------------------------------------------------
 * Login
 * -----------------------------------------------------------------------------
 */

export interface LoginInput {
    email: string;

    password: string;
}

/**
 * -----------------------------------------------------------------------------
 * Forgot Password
 * -----------------------------------------------------------------------------
 */

export interface ForgotPasswordInput {
    email: string;
}

/**
 * -----------------------------------------------------------------------------
 * Reset Password
 * -----------------------------------------------------------------------------
 */

export interface ResetPasswordInput {
    token: string;

    password: string;

    confirmPassword: string;
}

/**
 * -----------------------------------------------------------------------------
 * Refresh Token
 * -----------------------------------------------------------------------------
 *
 * The backend reads the refresh token from the HTTP-only cookie.
 *
 * No request body is therefore required by the frontend.
 */

export interface RefreshResponse {
    success: boolean;

    message: string;

    data: AuthResponse;
}

/**
 * -----------------------------------------------------------------------------
 * Basic API Response
 * -----------------------------------------------------------------------------
 *
 * Used by endpoints that do not return authentication data.
 */

export interface AuthMessageResponse {
    success: boolean;

    message: string;
}

/**
 * -----------------------------------------------------------------------------
 * User Profile Update
 * -----------------------------------------------------------------------------
 *
 * Mirrors the backend UpdateProfileInput contract.
 *
 * Only these fields are editable through:
 *
 * PATCH /users/me
 */

export interface UpdateProfileInput {
    firstName?: string;

    lastName?: string;

    phone?: string | null;

    company?: string | null;

    country?: string | null;
}

/**
 * -----------------------------------------------------------------------------
 * User Profile API Response
 * -----------------------------------------------------------------------------
 *
 * Used by:
 *
 * GET /users/me
 * PATCH /users/me
 */

export interface UserProfileApiResponse {
    success: boolean;

    message: string;

    data: AuthUser;
}

/**
 * -----------------------------------------------------------------------------
 * Authentication State
 * -----------------------------------------------------------------------------
 *
 * Represents the state maintained by AuthProvider.
 */

export interface AuthState {
    /**
     * Currently authenticated user.
     */
    user: AuthUser | null;

    /**
     * Current access token.
     */
    accessToken: string | null;

    /**
     * Whether the user currently has an authenticated session.
     */
    isAuthenticated: boolean;

    /**
     * Whether the authentication provider is restoring the session.
     */
    isLoading: boolean;

    /**
     * Current authentication error.
     *
     * Null means there is no active authentication error.
     */
    error: string | null;
}

/**
 * -----------------------------------------------------------------------------
 * Authentication Context
 * -----------------------------------------------------------------------------
 *
 * Extends AuthState with the actions exposed by AuthProvider.
 */

export interface AuthContextValue extends AuthState {
    /**
     * Clear the current authentication error.
     */
    clearError(): void;

    /**
     * Login.
     */
    login(
        credentials: LoginInput,
    ): Promise<void>;

    /**
     * Register a new account.
     */
    register(
        data: RegisterInput,
    ): Promise<void>;

    /**
     * Logout the current user.
     */
    logout(): Promise<void>;

    /**
     * Refresh the current authenticated session.
     *
     * Returns true when the session was successfully refreshed.
     *
     * Returns false when the refresh failed and the local session
     * was cleared.
     */
    refreshSession(): Promise<boolean>;

    /**
     * Request password reset instructions.
     */
    forgotPassword(
        data: ForgotPasswordInput,
    ): Promise<void>;

    /**
     * Reset the user's password.
     */
    resetPassword(
        data: ResetPasswordInput,
    ): Promise<void>;

    /**
     * Verify the user's email address.
     *
     * The backend expects the verification token supplied in the
     * verification email.
     */
    verifyEmail(
        token: string,
    ): Promise<void>;

    /**
     * Update the authenticated user's profile.
     *
     * Sends the supplied profile fields to:
     *
     * PATCH /users/me
     *
     * The AuthProvider updates its local user state after the
     * backend successfully saves the changes.
     */
    updateProfile(
        data: UpdateProfileInput,
    ): Promise<void>;
}
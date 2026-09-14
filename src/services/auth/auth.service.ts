/**
 * -----------------------------------------------------------------------------
 * File: src/services/auth/auth.service.ts
 * -----------------------------------------------------------------------------
 * Brika frontend authentication service.
 *
 * Connects the frontend authentication flow to the Brika backend API.
 *
 * Responsibilities:
 *
 * - Register users.
 * - Authenticate users.
 * - Refresh authenticated sessions.
 * - Log users out.
 * - Request password resets.
 * - Reset passwords.
 * - Verify email addresses.
 * - Get the authenticated user's profile.
 * - Update the authenticated user's profile.
 * - Persist authenticated sessions.
 * - Restore locally stored authentication state.
 * - Clear locally stored authentication state.
 * -----------------------------------------------------------------------------
 */

import { apiClient } from "@/services/api/client";
import { secureStorage } from "@/services/storage/secure-storage";

import type {
    AuthApiResponse,
    AuthMessageResponse,
    AuthResponse,
    AuthUser,
    ForgotPasswordInput,
    LoginInput,
    RefreshResponse,
    RegisterInput,
    ResetPasswordInput,
    UpdateProfileInput,
    UserProfileApiResponse,
} from "./auth.types";

/**
 * -----------------------------------------------------------------------------
 * Storage Keys
 * -----------------------------------------------------------------------------
 */

export const AUTH_STORAGE_KEYS = {
    accessToken: "brika.accessToken",
    user: "brika.user",
} as const;

/**
 * -----------------------------------------------------------------------------
 * Auth Service
 * -----------------------------------------------------------------------------
 */

export const authService = {
    /**
     * ---------------------------------------------------------------------------
     * Register
     * ---------------------------------------------------------------------------
     *
     * POST /auth/register
     */

    async register(
        data: RegisterInput,
    ): Promise<AuthResponse> {
        const response = await apiClient<AuthApiResponse>(
            "/auth/register",
            {
                method: "POST",

                body: JSON.stringify(data),

                credentials: "include",
            },
        );

        await this.persistSession(response.data);

        return response.data;
    },

    /**
     * ---------------------------------------------------------------------------
     * Login
     * ---------------------------------------------------------------------------
     *
     * POST /auth/login
     */

    async login(
        data: LoginInput,
    ): Promise<AuthResponse> {
        const response = await apiClient<AuthApiResponse>(
            "/auth/login",
            {
                method: "POST",

                body: JSON.stringify(data),

                credentials: "include",
            },
        );

        await this.persistSession(response.data);

        return response.data;
    },

    /**
     * ---------------------------------------------------------------------------
     * Refresh Session
     * ---------------------------------------------------------------------------
     *
     * POST /auth/refresh
     */

    async refresh(): Promise<AuthResponse> {
        const response = await apiClient<RefreshResponse>(
            "/auth/refresh",
            {
                method: "POST",

                credentials: "include",
            },
        );

        await this.persistSession(response.data);

        return response.data;
    },

    /**
     * ---------------------------------------------------------------------------
     * Logout
     * ---------------------------------------------------------------------------
     *
     * POST /auth/logout
     */

    async logout(): Promise<void> {
        try {
            await apiClient<AuthMessageResponse>(
                "/auth/logout",
                {
                    method: "POST",

                    credentials: "include",
                },
            );
        } finally {
            await this.clearSession();
        }
    },

    /**
     * ---------------------------------------------------------------------------
     * Forgot Password
     * ---------------------------------------------------------------------------
     *
     * POST /auth/forgot-password
     */

    async forgotPassword(
        data: ForgotPasswordInput,
    ): Promise<void> {
        await apiClient<AuthMessageResponse>(
            "/auth/forgot-password",
            {
                method: "POST",

                body: JSON.stringify(data),

                credentials: "include",
            },
        );
    },

    /**
     * ---------------------------------------------------------------------------
     * Reset Password
     * ---------------------------------------------------------------------------
     *
     * POST /auth/reset-password
     */

    async resetPassword(
        data: ResetPasswordInput,
    ): Promise<void> {
        await apiClient<AuthMessageResponse>(
            "/auth/reset-password",
            {
                method: "POST",

                body: JSON.stringify(data),

                credentials: "include",
            },
        );
    },

    /**
     * ---------------------------------------------------------------------------
     * Verify Email
     * ---------------------------------------------------------------------------
     *
     * GET /auth/verify-email?token=...
     */

    async verifyEmail(
        token: string,
    ): Promise<void> {
        const encodedToken = encodeURIComponent(token);

        await apiClient<AuthMessageResponse>(
            `/auth/verify-email?token=${encodedToken}`,
            {
                method: "GET",

                credentials: "include",
            },
        );
    },

    /**
     * ---------------------------------------------------------------------------
     * Get Current User
     * ---------------------------------------------------------------------------
     *
     * GET /users/me
     *
     * Retrieves the latest authenticated user's profile from the backend.
     *
     * The returned user is also persisted locally so the locally stored
     * authentication state remains synchronized with the backend.
     */

    async getCurrentUser(): Promise<AuthUser> {
        const response = await apiClient<UserProfileApiResponse>(
            "/users/me",
            {
                method: "GET",

                credentials: "include",
            },
        );

        await secureStorage.setItem(
            AUTH_STORAGE_KEYS.user,
            JSON.stringify(response.data),
        );

        return response.data;
    },

    /**
     * ---------------------------------------------------------------------------
     * Update Current User Profile
     * ---------------------------------------------------------------------------
     *
     * PATCH /users/me
     *
     * Updates the authenticated user's editable profile fields.
     *
     * Supported fields:
     *
     * - firstName
     * - lastName
     * - phone
     * - company
     * - country
     *
     * The backend returns the complete updated user profile.
     *
     * The updated user is persisted locally so AuthProvider and the rest of
     * the application can remain synchronized with the backend.
     */

    async updateProfile(
        data: UpdateProfileInput,
    ): Promise<AuthUser> {
        const response = await apiClient<UserProfileApiResponse>(
            "/users/me",
            {
                method: "PATCH",

                body: JSON.stringify(data),

                credentials: "include",
            },
        );

        await secureStorage.setItem(
            AUTH_STORAGE_KEYS.user,
            JSON.stringify(response.data),
        );

        return response.data;
    },

    /**
     * ---------------------------------------------------------------------------
     * Get Stored Access Token
     * ---------------------------------------------------------------------------
     */

    async getAccessToken(): Promise<string | null> {
        return secureStorage.getItem(
            AUTH_STORAGE_KEYS.accessToken,
        );
    },

    /**
     * ---------------------------------------------------------------------------
     * Get Stored User
     * ---------------------------------------------------------------------------
     */

    async getStoredUser(): Promise<
        AuthResponse["user"] | null
    > {
        const value = await secureStorage.getItem(
            AUTH_STORAGE_KEYS.user,
        );

        if (!value) {
            return null;
        }

        try {
            return JSON.parse(value) as AuthResponse["user"];
        } catch {
            await secureStorage.removeItem(
                AUTH_STORAGE_KEYS.user,
            );

            return null;
        }
    },

    /**
     * ---------------------------------------------------------------------------
     * Persist Session
     * ---------------------------------------------------------------------------
     */

    async persistSession(
        auth: AuthResponse,
    ): Promise<void> {
        await Promise.all([
            secureStorage.setItem(
                AUTH_STORAGE_KEYS.accessToken,
                auth.tokens.accessToken,
            ),

            secureStorage.setItem(
                AUTH_STORAGE_KEYS.user,
                JSON.stringify(auth.user),
            ),
        ]);
    },

    /**
     * ---------------------------------------------------------------------------
     * Clear Session
     * ---------------------------------------------------------------------------
     */

    async clearSession(): Promise<void> {
        await secureStorage.clear([
            AUTH_STORAGE_KEYS.accessToken,
            AUTH_STORAGE_KEYS.user,
        ]);
    },
};
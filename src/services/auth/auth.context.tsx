/**
 * -----------------------------------------------------------------------------
 * File: src/services/auth/auth.context.tsx
 * -----------------------------------------------------------------------------
 * Brika authentication context.
 *
 * Provides authentication state and authentication actions throughout the app.
 *
 * Responsibilities:
 *
 * - Restore authenticated sessions.
 * - Manage the current authenticated user.
 * - Manage the access token.
 * - Handle login and registration.
 * - Handle logout.
 * - Refresh authentication sessions.
 * - Handle profile updates.
 * - Handle forgot/reset password flows.
 * - Handle email verification.
 * - Expose authentication errors.
 * - Provide a centralized way to clear authentication errors.
 * -----------------------------------------------------------------------------
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authService } from "./auth.service";

import type {
  AuthContextValue,
  AuthUser,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from "./auth.types";

/**
 * -----------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------
 */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * -----------------------------------------------------------------------------
 * Provider
 * -----------------------------------------------------------------------------
 */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  /**
   * ---------------------------------------------------------------------------
   * Authentication Error
   * ---------------------------------------------------------------------------
   *
   * Stores the latest authentication-related error.
   *
   * Screens can consume this through useAuth().
   */

  const [error, setError] = useState<string | null>(null);

  /**
   * ---------------------------------------------------------------------------
   * Clear Error
   * ---------------------------------------------------------------------------
   *
   * Clears the currently stored authentication error.
   */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * ---------------------------------------------------------------------------
   * Restore Session
   * ---------------------------------------------------------------------------
   *
   * First restore the locally stored session.
   *
   * If an access token exists, attempt to refresh it through the backend.
   * This allows an expired access token to be replaced automatically.
   */

  const restoreSession = useCallback(async () => {
    try {
      const storedToken = await authService.getAccessToken();

      const storedUser = await authService.getStoredUser();

      /**
       * -----------------------------------------------------------------------
       * No Local Session
       * -----------------------------------------------------------------------
       */

      if (!storedToken) {
        setAccessToken(null);

        setUser(null);

        return;
      }

      /**
       * -----------------------------------------------------------------------
       * Temporarily Restore Local Session
       * -----------------------------------------------------------------------
       *
       * Restore the locally cached session immediately while the backend
       * refresh request is being performed.
       */

      setAccessToken(storedToken);

      setUser(storedUser);

      /**
       * -----------------------------------------------------------------------
       * Refresh Session
       * -----------------------------------------------------------------------
       *
       * The backend reads the refresh token from its HTTP-only cookie.
       */

      try {
        const refreshed = await authService.refresh();

        setAccessToken(refreshed.tokens.accessToken);

        setUser(refreshed.user);

        clearError();
      } catch {
        /**
         * ---------------------------------------------------------------------
         * Refresh Failed
         * ---------------------------------------------------------------------
         *
         * The stored session is no longer valid.
         */

        await authService.clearSession();

        setAccessToken(null);

        setUser(null);
      }
    } catch (err) {
      /**
       * -----------------------------------------------------------------------
       * Session Restoration Error
       * -----------------------------------------------------------------------
       */

      setAccessToken(null);

      setUser(null);

      setError(
        err instanceof Error ? err.message : "Unable to restore your session.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  /**
   * ---------------------------------------------------------------------------
   * Initial Session Restoration
   * ---------------------------------------------------------------------------
   */

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  /**
   * ---------------------------------------------------------------------------
   * Login
   * ---------------------------------------------------------------------------
   */

  const login = useCallback(
    async (credentials: LoginInput): Promise<void> => {
      clearError();

      try {
        const result = await authService.login(credentials);

        setAccessToken(result.tokens.accessToken);

        setUser(result.user);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to log in. Please try again.",
        );

        throw err;
      }
    },
    [clearError],
  );

  /**
   * ---------------------------------------------------------------------------
   * Register
   * ---------------------------------------------------------------------------
   */

  const register = useCallback(
    async (data: RegisterInput): Promise<void> => {
      clearError();

      try {
        const result = await authService.register(data);

        setAccessToken(result.tokens.accessToken);

        setUser(result.user);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to create your account. Please try again.",
        );

        throw err;
      }
    },
    [clearError],
  );

  /**
   * ---------------------------------------------------------------------------
   * Logout
   * ---------------------------------------------------------------------------
   */

  const logout = useCallback(async (): Promise<void> => {
    clearError();

    try {
      await authService.logout();
    } finally {
      setAccessToken(null);

      setUser(null);
    }
  }, [clearError]);

  /**
   * ---------------------------------------------------------------------------
   * Refresh Session
   * ---------------------------------------------------------------------------
   */

  const refreshSession = useCallback(async (): Promise<boolean> => {
    clearError();

    try {
      const result = await authService.refresh();

      setAccessToken(result.tokens.accessToken);

      setUser(result.user);

      return true;
    } catch (err) {
      await authService.clearSession();

      setAccessToken(null);

      setUser(null);

      setError(
        err instanceof Error ? err.message : "Unable to refresh your session.",
      );

      return false;
    }
  }, [clearError]);

  /**
   * ---------------------------------------------------------------------------
   * Update Profile
   * ---------------------------------------------------------------------------
   *
   * PATCH /users/me
   *
   * Updates the authenticated user's profile through the backend.
   *
   * The backend returns the complete updated user. We immediately replace
   * the current AuthUser state so every screen consuming useAuth() receives
   * the updated profile.
   */

  const updateProfile = useCallback(
    async (data: UpdateProfileInput): Promise<void> => {
      clearError();

      try {
        const updatedUser = await authService.updateProfile(data);

        setUser(updatedUser);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update your profile. Please try again.",
        );

        throw err;
      }
    },
    [clearError],
  );

  /**
   * ---------------------------------------------------------------------------
   * Forgot Password
   * ---------------------------------------------------------------------------
   */

  const forgotPassword = useCallback(
    async (data: ForgotPasswordInput): Promise<void> => {
      clearError();

      try {
        await authService.forgotPassword(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to send password reset instructions. Please try again.",
        );

        throw err;
      }
    },
    [clearError],
  );

  /**
   * ---------------------------------------------------------------------------
   * Reset Password
   * ---------------------------------------------------------------------------
   */

  const resetPassword = useCallback(
    async (data: ResetPasswordInput): Promise<void> => {
      clearError();

      try {
        await authService.resetPassword(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to reset your password. Please try again.",
        );

        throw err;
      }
    },
    [clearError],
  );

  /**
   * ---------------------------------------------------------------------------
   * Verify Email
   * ---------------------------------------------------------------------------
   *
   * Verifies the email verification token supplied by the backend.
   *
   * The verification screen is responsible for providing the token.
   */

  const verifyEmail = useCallback(
    async (token: string): Promise<void> => {
      clearError();

      try {
        await authService.verifyEmail(token);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify your email. Please try again.",
        );

        throw err;
      }
    },
    [clearError],
  );

  /**
   * ---------------------------------------------------------------------------
   * Context Value
   * ---------------------------------------------------------------------------
   */

  const value = useMemo<AuthContextValue>(
    () => ({
      user,

      accessToken,

      isAuthenticated: Boolean(accessToken),

      isLoading,

      error,

      clearError,

      login,

      register,

      logout,

      refreshSession,

      updateProfile,

      forgotPassword,

      resetPassword,

      verifyEmail,
    }),
    [
      user,
      accessToken,
      isLoading,
      error,
      clearError,
      login,
      register,
      logout,
      refreshSession,
      updateProfile,
      forgotPassword,
      resetPassword,
      verifyEmail,
    ],
  );

  /**
   * ---------------------------------------------------------------------------
   * Provider
   * ---------------------------------------------------------------------------
   */

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * -----------------------------------------------------------------------------
 * useAuth
 * -----------------------------------------------------------------------------
 *
 * Provides access to the Brika authentication context.
 */

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

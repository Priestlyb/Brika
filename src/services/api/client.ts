/**
 * -----------------------------------------------------------------------------
 * File: src/services/api/client.ts
 * -----------------------------------------------------------------------------
 * Base HTTP client for Brika API communication.
 *
 * Responsibilities:
 *
 * - Build API requests.
 * - Attach the stored access token automatically.
 * - Include authentication cookies.
 * - Handle API errors consistently.
 * - Refresh an expired access token once.
 * - Retry the original request after a successful refresh.
 * - Preserve FormData uploads.
 * - Prevent stale Authorization headers from overriding refreshed tokens.
 * -----------------------------------------------------------------------------
 */

import { secureStorage } from "@/services/storage/secure-storage";

/**
 * -----------------------------------------------------------------------------
 * Configuration
 * -----------------------------------------------------------------------------
 */

const API_URL =
    process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
    console.warn(
        "[Brika API] EXPO_PUBLIC_API_URL is not configured.",
    );
}

/**
 * -----------------------------------------------------------------------------
 * Storage Keys
 * -----------------------------------------------------------------------------
 */

const ACCESS_TOKEN_KEY =
    "brika.accessToken";

/**
 * -----------------------------------------------------------------------------
 * API Response
 * -----------------------------------------------------------------------------
 */

interface ApiErrorResponse {
    message?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Request Options
 * -----------------------------------------------------------------------------
 */

export interface ApiRequestOptions
    extends RequestInit {
    token?: string;

    /**
     * Prevent this request from attempting an automatic
     * token refresh after a 401 response.
     */
    skipAuthRefresh?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Refresh Response
 * -----------------------------------------------------------------------------
 */

interface RefreshResponse {
    success: boolean;

    message: string;

    data: {
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            avatarUrl: string | null;
            company: string | null;
            country: string | null;
            emailVerified: boolean;
            createdAt: string;
        };

        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    };
}

/**
 * -----------------------------------------------------------------------------
 * Refresh Lock
 * -----------------------------------------------------------------------------
 *
 * Prevent multiple simultaneous API requests from all attempting to refresh
 * the access token at the same time.
 *
 * Example:
 *
 * Request A -> 401
 * Request B -> 401
 * Request C -> 401
 *
 * Only one refresh request is made. The other requests wait for it.
 */

let refreshPromise: Promise<string | null> | null = null;

/**
 * -----------------------------------------------------------------------------
 * Refresh Access Token
 * -----------------------------------------------------------------------------
 *
 * This function intentionally does NOT use apiClient().
 *
 * Otherwise a failed refresh request could recursively trigger another
 * refresh attempt.
 */

async function refreshAccessToken(): Promise<string | null> {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = performTokenRefresh();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

/**
 * -----------------------------------------------------------------------------
 * Perform Token Refresh
 * -----------------------------------------------------------------------------
 */

async function performTokenRefresh(): Promise<string | null> {
    try {
        console.log(
            "[Brika Auth] Attempting access-token refresh...",
        );

        const response =
            await fetch(
                `${API_URL}/auth/refresh`,
                {
                    method: "POST",

                    credentials:
                        "include",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                },
            );

        if (!response.ok) {
            console.warn(
                "[Brika Auth] Token refresh failed:",
                response.status,
            );

            await secureStorage.removeItem(
                ACCESS_TOKEN_KEY,
            );

            return null;
        }

        const data =
            (await response.json()) as RefreshResponse;

        const accessToken =
            data.data?.tokens?.accessToken;

        if (!accessToken) {
            console.warn(
                "[Brika Auth] Refresh response did not contain an access token.",
            );

            await secureStorage.removeItem(
                ACCESS_TOKEN_KEY,
            );

            return null;
        }

        /**
         * Store the newly rotated access token.
         *
         * Do NOT log the actual token.
         */

        await secureStorage.setItem(
            ACCESS_TOKEN_KEY,
            accessToken,
        );

        console.log(
            "[Brika Auth] Access token refreshed successfully.",
        );

        return accessToken;
    } catch (error) {
        console.error(
            "[Brika Auth] Token refresh error:",
            error,
        );

        await secureStorage.removeItem(
            ACCESS_TOKEN_KEY,
        );

        return null;
    }
}

/**
 * -----------------------------------------------------------------------------
 * API Error Message
 * -----------------------------------------------------------------------------
 */

function getErrorMessage(
    data: unknown,
): string {
    if (
        typeof data === "object" &&
        data !== null &&
        "message" in data
    ) {
        const message =
            (data as ApiErrorResponse)
                .message;

        if (message) {
            return message;
        }
    }

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    return "An unexpected error occurred.";
}

/**
 * -----------------------------------------------------------------------------
 * Authentication Endpoint Detection
 * -----------------------------------------------------------------------------
 */

function isAuthEndpoint(
    path: string,
): boolean {
    return (
        path.startsWith("/auth/login") ||
        path.startsWith("/auth/register") ||
        path.startsWith("/auth/refresh") ||
        path.startsWith("/auth/forgot-password") ||
        path.startsWith("/auth/reset-password") ||
        path.startsWith("/auth/verify-email") ||
        path.startsWith("/auth/logout")
    );
}

/**
 * -----------------------------------------------------------------------------
 * Build Request Headers
 * -----------------------------------------------------------------------------
 *
 * Important:
 *
 * - JSON requests receive Content-Type: application/json.
 * - FormData requests do NOT receive a manually specified Content-Type.
 *
 * Fetch automatically creates:
 *
 * multipart/form-data; boundary=...
 *
 * when the body is FormData.
 */

function buildHeaders(
    headers: HeadersInit | undefined,
    accessToken: string | null,
    body: BodyInit | null | undefined,
): Headers {
    const result =
        new Headers(headers);

    /**
     * -------------------------------------------------------------------------
     * Authorization
     * -------------------------------------------------------------------------
     *
     * Always let the current access token win.
     *
     * This prevents a stale Authorization header supplied by a service from
     * overriding a newly refreshed token.
     */

    result.delete("Authorization");

    if (accessToken) {
        result.set(
            "Authorization",
            `Bearer ${accessToken}`,
        );
    }

    /**
     * -------------------------------------------------------------------------
     * Content-Type
     * -------------------------------------------------------------------------
     *
     * Never manually set Content-Type for FormData.
     */

    if (body instanceof FormData) {
        result.delete("Content-Type");
    } else if (!result.has("Content-Type")) {
        result.set(
            "Content-Type",
            "application/json",
        );
    }

    return result;
}

/**
 * -----------------------------------------------------------------------------
 * API Client
 * -----------------------------------------------------------------------------
 */

export async function apiClient<T>(
    path: string,
    options: ApiRequestOptions = {},
): Promise<T> {
    const {
        token,
        headers,
        skipAuthRefresh = false,
        body,
        ...requestOptions
    } = options;

    /**
     * -------------------------------------------------------------------------
     * Access Token
     * -------------------------------------------------------------------------
     *
     * Use an explicitly supplied token first.
     *
     * Otherwise retrieve the current token from secure storage.
     */

    const accessToken =
        token ??
        (await secureStorage.getItem(
            ACCESS_TOKEN_KEY,
        ));

    console.log(
        "[Brika API] Request:",
        `${API_URL}${path}`,
    );

    console.log(
        "[Brika API] Has access token:",
        Boolean(accessToken),
    );

    /**
     * -------------------------------------------------------------------------
     * First Request
     * -------------------------------------------------------------------------
     */

    const requestHeaders =
        buildHeaders(
            headers,
            accessToken,
            body,
        );

    const response =
        await fetch(
            `${API_URL}${path}`,
            {
                ...requestOptions,

                body,

                credentials:
                    "include",

                headers:
                    requestHeaders,
            },
        );

    /**
     * -------------------------------------------------------------------------
     * Handle 401
     * -------------------------------------------------------------------------
     *
     * If the access token has expired, attempt one refresh.
     *
     * Authentication endpoints are excluded to prevent refresh loops.
     */

    if (
        response.status === 401 &&
        !skipAuthRefresh &&
        !isAuthEndpoint(path)
    ) {
        console.warn(
            "[Brika API] Access token rejected. Attempting refresh...",
        );

        const newAccessToken =
            await refreshAccessToken();

        if (newAccessToken) {
            console.log(
                "[Brika API] Retrying request with refreshed access token.",
            );

            /**
             * -----------------------------------------------------------------
             * Retry Request
             * -----------------------------------------------------------------
             *
             * Reuse the original body.
             *
             * IMPORTANT:
             * If the body is FormData, this is safe because the same FormData
             * object can be supplied to fetch again in this client flow.
             */

            const retryHeaders =
                buildHeaders(
                    headers,
                    newAccessToken,
                    body,
                );

            const retryResponse =
                await fetch(
                    `${API_URL}${path}`,
                    {
                        ...requestOptions,

                        body,

                        credentials:
                            "include",

                        headers:
                            retryHeaders,
                    },
                );

            /**
             * ---------------------------------------------------------------
             * Parse Retry Response
             * ---------------------------------------------------------------
             */

            const retryContentType =
                retryResponse.headers.get(
                    "content-type",
                );

            const retryData =
                retryContentType?.includes(
                    "application/json",
                )
                    ? await retryResponse.json()
                    : await retryResponse.text();

            if (!retryResponse.ok) {
                console.error(
                    "[Brika API] Retry request failed:",
                    {
                        path,
                        status:
                            retryResponse.status,
                        data:
                            retryData,
                    },
                );

                throw new Error(
                    getErrorMessage(
                        retryData,
                    ),
                );
            }

            console.log(
                "[Brika API] Retry request succeeded:",
                {
                    path,
                    status:
                        retryResponse.status,
                },
            );

            return retryData as T;
        }

        /**
         * ---------------------------------------------------------------------
         * Refresh Failed
         * ---------------------------------------------------------------------
         */

        await secureStorage.removeItem(
            ACCESS_TOKEN_KEY,
        );
    }

    /**
     * -------------------------------------------------------------------------
     * Parse Response
     * -------------------------------------------------------------------------
     */

    const contentType =
        response.headers.get(
            "content-type",
        );

    const data =
        contentType?.includes(
            "application/json",
        )
            ? await response.json()
            : await response.text();

    /**
     * -------------------------------------------------------------------------
     * Handle Errors
     * -------------------------------------------------------------------------
     */

    if (!response.ok) {
        console.error(
            "[Brika API] Request failed:",
            {
                path,
                status:
                    response.status,
                data,
            },
        );

        throw new Error(
            getErrorMessage(data),
        );
    }

    /**
     * -------------------------------------------------------------------------
     * Successful Response
     * -------------------------------------------------------------------------
     */

    console.log(
        "[Brika API] Backend response:",
        {
            path,
            status:
                response.status,
        },
    );

    return data as T;
}
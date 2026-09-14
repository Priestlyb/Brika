/**
 * -----------------------------------------------------------------------------
 * File: src/hooks/generation/useGenerationStatus.ts
 * -----------------------------------------------------------------------------
 * Brika — Generation Status Hook
 *
 * React hook for monitoring a 3D generation job.
 *
 * Responsibilities:
 *
 * - Fetch the current generation status
 * - Poll the backend while generation is active
 * - Stop polling when generation reaches a terminal state
 * - Expose loading, polling, and error state
 * - Clean up timers when the component unmounts
 * - Allow manual refresh/reset
 *
 * Backend endpoints:
 *
 * GET /api/v1/generation/:jobId
 *
 * The generation service is responsible for HTTP communication.
 * This hook is responsible only for React state and polling.
 * -----------------------------------------------------------------------------
 */

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    generationService,
    GenerationStatus,
    GenerationStatusResult,
} from "@/services/generation/generation.service";

/* =============================================================================
 * Types
 * =============================================================================
 */

export interface UseGenerationStatusOptions {
    /**
     * Whether polling/fetching should be active.
     *
     * Defaults to true when a generation ID is supplied.
     */
    enabled?: boolean;

    /**
     * Polling interval in milliseconds.
     *
     * Defaults to 30000ms.
     */
    pollInterval?: number;

    /**
     * Whether to fetch the status immediately when the hook starts.
     *
     * Defaults to true.
     */
    immediate?: boolean;
}

export interface UseGenerationStatusResult {
    /**
     * Latest generation status returned by the backend.
     */
    status: GenerationStatusResult | null;

    /**
     * True while the first/manual status request is loading.
     */
    isLoading: boolean;

    /**
     * True while automatic polling is active.
     */
    isPolling: boolean;

    /**
     * Latest request error.
     */
    error: string | null;

    /**
     * Manually fetch the latest generation status.
     */
    refresh: () => Promise<void>;

    /**
     * Clear the current status and error state.
     */
    reset: () => void;
}

/* =============================================================================
 * Constants
 * =============================================================================
 */

const DEFAULT_POLL_INTERVAL = 60_000;

/**
 * Terminal states.
 *
 * Once one of these states is received, polling stops.
 */
const TERMINAL_STATUSES: GenerationStatus[] = [
    "COMPLETED",
    "FAILED",
    "CANCELLED",
];

/* =============================================================================
 * Helpers
 * =============================================================================
 */

/**
 * Determines whether a generation status is terminal.
 */
function isTerminalStatus(
    status: GenerationStatus | undefined,
): boolean {
    if (!status) {
        return false;
    }

    return TERMINAL_STATUSES.includes(status);
}

/**
 * Converts an unknown error into a useful message.
 */
function getErrorMessage(
    error: unknown,
): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (
        typeof error === "string" &&
        error.trim().length > 0
    ) {
        return error;
    }

    return "Failed to retrieve generation status.";
}

/* =============================================================================
 * Hook
 * =============================================================================
 */

/**
 * Monitor a generation job until it reaches a terminal state.
 *
 * Example:
 *
 * const {
 *     status,
 *     isLoading,
 *     isPolling,
 *     error,
 *     refresh,
 *     reset,
 * } = useGenerationStatus(generationId);
 */
export function useGenerationStatus(
    generationId: string | null | undefined,
    options: UseGenerationStatusOptions = {},
): UseGenerationStatusResult {
    const {
        enabled = true,
        pollInterval = DEFAULT_POLL_INTERVAL,
        immediate = true,
    } = options;

    /* -------------------------------------------------------------------------
     * State
     * -------------------------------------------------------------------------
     */

    const [status, setStatus] =
        useState<GenerationStatusResult | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(false);

    const [isPolling, setIsPolling] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    /* -------------------------------------------------------------------------
     * Refs
     * -------------------------------------------------------------------------
     *
     * Refs allow the polling loop to remain stable without creating multiple
     * timers when React state changes.
     */

    const timerRef =
        useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );

    const mountedRef =
        useRef(true);

    const requestInFlightRef =
        useRef(false);

    const generationIdRef =
        useRef<string | null>(
            generationId ?? null,
        );

    /* -------------------------------------------------------------------------
     * Keep generation ID ref current
     * -------------------------------------------------------------------------
     */

    useEffect(() => {
        generationIdRef.current =
            generationId ?? null;
    }, [generationId]);

    /* -------------------------------------------------------------------------
     * Timer cleanup
     * -------------------------------------------------------------------------
     */

    const clearPollingTimer =
        useCallback(() => {
            if (timerRef.current !== null) {
                clearTimeout(
                    timerRef.current,
                );

                timerRef.current = null;
            }
        }, []);

    /* -------------------------------------------------------------------------
     * Refresh
     * -------------------------------------------------------------------------
     */

    const refresh =
        useCallback(async (): Promise<void> => {
            const currentGenerationId =
                generationIdRef.current;

            if (
                !currentGenerationId ||
                !enabled
            ) {
                return;
            }

            /**
             * Prevent overlapping requests.
             *
             * This is important because the polling timer and a manual refresh
             * could otherwise request the same generation simultaneously.
             */
            if (
                requestInFlightRef.current
            ) {
                return;
            }

            requestInFlightRef.current =
                true;

            if (mountedRef.current) {
                setIsLoading(true);
                setError(null);
            }

            try {
                const result =
                    await generationService.getGenerationStatus(
                        currentGenerationId,
                    );

                if (
                    !mountedRef.current
                ) {
                    return;
                }

                setStatus(result);
                setError(null);
            } catch (requestError) {
                if (
                    !mountedRef.current
                ) {
                    return;
                }

                setError(
                    getErrorMessage(
                        requestError,
                    ),
                );
            } finally {
                requestInFlightRef.current =
                    false;

                if (
                    mountedRef.current
                ) {
                    setIsLoading(false);
                }
            }
        }, [enabled]);

    /* -------------------------------------------------------------------------
     * Reset
     * -------------------------------------------------------------------------
     */

    const reset =
        useCallback(() => {
            clearPollingTimer();

            requestInFlightRef.current =
                false;

            if (!mountedRef.current) {
                return;
            }

            setStatus(null);
            setError(null);
            setIsLoading(false);
            setIsPolling(false);
        }, [clearPollingTimer]);

    /* -------------------------------------------------------------------------
     * Mount / Unmount
     * -------------------------------------------------------------------------
     */

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            clearPollingTimer();

            requestInFlightRef.current =
                false;
        };
    }, [clearPollingTimer]);

    /* -------------------------------------------------------------------------
     * Reset when generation ID changes
     * -------------------------------------------------------------------------
     */

    useEffect(() => {
        clearPollingTimer();

        requestInFlightRef.current =
            false;

        setStatus(null);
        setError(null);
        setIsLoading(false);
        setIsPolling(false);
    }, [
        generationId,
        clearPollingTimer,
    ]);

    /* -------------------------------------------------------------------------
     * Polling loop
     * -------------------------------------------------------------------------
     */

    useEffect(() => {
        if (
            !enabled ||
            !generationId
        ) {
            clearPollingTimer();
            setIsPolling(false);

            return;
        }

        let cancelled = false;

        const poll = async (): Promise<void> => {
            if (
                cancelled ||
                !mountedRef.current
            ) {
                return;
            }

            const currentGenerationId =
                generationIdRef.current;

            if (!currentGenerationId) {
                setIsPolling(false);
                return;
            }

            /**
             * Fetch current status.
             *
             * We call the service directly here instead of calling `refresh`
             * so the polling loop can decide exactly when to schedule the
             * next request.
             */
            if (
                requestInFlightRef.current
            ) {
                timerRef.current =
                    setTimeout(
                        poll,
                        pollInterval,
                    );

                return;
            }

            requestInFlightRef.current =
                true;

            setIsPolling(true);

            if (immediate) {
                setIsLoading(true);
            }

            try {
                const result =
                    await generationService.getGenerationStatus(
                        currentGenerationId,
                    );

                if (
                    cancelled ||
                    !mountedRef.current
                ) {
                    return;
                }

                setStatus(result);
                setError(null);
                setIsLoading(false);

                /**
                 * Stop polling when the backend reports a terminal state.
                 */
                if (
                    isTerminalStatus(
                        result.status,
                    )
                ) {
                    setIsPolling(false);
                    clearPollingTimer();

                    return;
                }

                /**
                 * Schedule exactly one future poll.
                 */
                timerRef.current =
                    setTimeout(
                        poll,
                        pollInterval,
                    );
            } catch (requestError) {
                if (
                    cancelled ||
                    !mountedRef.current
                ) {
                    return;
                }

                /**
                 * A temporary polling error should not permanently stop the
                 * generation monitor. We expose the error to the UI and retry
                 * on the next polling cycle.
                 */
                setError(
                    getErrorMessage(
                        requestError,
                    ),
                );

                setIsLoading(false);

                timerRef.current =
                    setTimeout(
                        poll,
                        pollInterval,
                    );
            } finally {
                requestInFlightRef.current =
                    false;
            }
        };

        /**
         * Start immediately when requested.
         *
         * Otherwise wait for the first polling interval.
         */
        if (immediate) {
            void poll();
        } else {
            timerRef.current =
                setTimeout(
                    poll,
                    pollInterval,
                );
        }

        return () => {
            cancelled = true;

            clearPollingTimer();
        };
    }, [
        generationId,
        enabled,
        immediate,
        pollInterval,
        clearPollingTimer,
    ]);

    /* -------------------------------------------------------------------------
     * Return
     * -------------------------------------------------------------------------
     */

    return {
        status,
        isLoading,
        isPolling,
        error,
        refresh,
        reset,
    };
}

/* =============================================================================
 * Default Export
 * =============================================================================
 */

export default useGenerationStatus;

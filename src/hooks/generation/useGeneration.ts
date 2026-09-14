/**
 * -----------------------------------------------------------------------------
 * File: src/hooks/generation/useGenerationStatus.ts
 * -----------------------------------------------------------------------------
 * Brika — Generation Status Hook
 *
 * Responsibilities:
 *
 * - Retrieve generation status.
 * - Poll active generation jobs.
 * - Stop polling when generation completes.
 * - Stop polling when generation fails.
 * - Stop polling when generation is cancelled.
 * - Expose the latest generation progress to the UI.
 *
 * Flow:
 *
 * generationId
 *      ↓
 * GET /generation/:generationId
 *      ↓
 * QUEUED
 *      ↓
 * PROCESSING
 *      ↓
 * COMPLETED / FAILED / CANCELLED
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
    generationService,
    type GenerationStatusResult,
} from "@/services/generation/generation.service";

/**
 * -----------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------
 */

/**
 * Poll every 60 seconds while a generation job is active.
 */
const DEFAULT_POLL_INTERVAL = 60_000;

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

interface UseGenerationStatusOptions {
    /**
     * Enable/disable the hook.
     *
     * Defaults to true when generationId exists.
     */
    enabled?: boolean;

    /**
     * Poll interval in milliseconds.
     *
     * Defaults to 2000ms.
     */
    pollInterval?: number;

    /**
     * Poll immediately when the hook starts.
     *
     * Defaults to true.
     */
    immediate?: boolean;
}

interface UseGenerationStatusResult {
    status: GenerationStatusResult | null;

    isLoading: boolean;
    isPolling: boolean;
    error: string | null;

    refresh: () => Promise<void>;
    reset: () => void;
}

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

function getErrorMessage(
    error: unknown,
): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return "Generation status could not be retrieved.";
}

function isTerminalStatus(
    status: GenerationStatusResult["status"],
): boolean {
    return (
        status === "COMPLETED" ||
        status === "FAILED" ||
        status === "CANCELLED"
    );
}

/**
 * -----------------------------------------------------------------------------
 * Hook
 * -----------------------------------------------------------------------------
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

    const [status, setStatus] =
        React.useState<GenerationStatusResult | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        React.useState(false);

    const [isPolling, setIsPolling] =
        React.useState(false);

    const [error, setError] =
        React.useState<string | null>(null);

    const mountedRef = React.useRef(true);

    const pollingTimeoutRef =
        React.useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );

    const requestInFlightRef =
        React.useRef(false);

    /**
     * ---------------------------------------------------------------------------
     * Mounted state
     * ---------------------------------------------------------------------------
     */

    React.useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current);
                pollingTimeoutRef.current = null;
            }
        };
    }, []);

    /**
     * ---------------------------------------------------------------------------
     * Clear polling timer
     * ---------------------------------------------------------------------------
     */

    const clearPollingTimer =
        React.useCallback(() => {
            if (pollingTimeoutRef.current) {
                clearTimeout(
                    pollingTimeoutRef.current,
                );

                pollingTimeoutRef.current = null;
            }
        }, []);

    /**
     * ---------------------------------------------------------------------------
     * Fetch Status
     * ---------------------------------------------------------------------------
     */

    const refresh = React.useCallback(async () => {
        if (
            !generationId ||
            !enabled ||
            requestInFlightRef.current
        ) {
            return;
        }

        requestInFlightRef.current = true;

        setIsLoading(true);
        setError(null);

        try {
            const result =
                await generationService.getGenerationStatus(
                    generationId,
                );

            if (!mountedRef.current) {
                return;
            }

            setStatus(result);

            /**
             * Terminal generation states do not need further polling.
             */
            if (isTerminalStatus(result.status)) {
                clearPollingTimer();
                setIsPolling(false);

                return;
            }

            setIsPolling(true);
        } catch (statusError) {
            if (!mountedRef.current) {
                return;
            }

            setError(getErrorMessage(statusError));

            /**
             * Keep polling after a transient request error.
             *
             * This is important for mobile/web connections where an individual
             * request can fail without the generation itself failing.
             */
            setIsPolling(true);
        } finally {
            requestInFlightRef.current = false;

            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [
        generationId,
        enabled,
        clearPollingTimer,
    ]);

    /**
     * ---------------------------------------------------------------------------
     * Polling
     * ---------------------------------------------------------------------------
     */

    React.useEffect(() => {
        clearPollingTimer();

        if (
            !generationId ||
            !enabled
        ) {
            setIsPolling(false);
            return;
        }

        if (
            status &&
            isTerminalStatus(status.status)
        ) {
            setIsPolling(false);
            return;
        }

        let cancelled = false;

        const scheduleNextPoll = () => {
            if (
                cancelled ||
                !mountedRef.current ||
                !generationId ||
                !enabled
            ) {
                return;
            }

            pollingTimeoutRef.current =
                setTimeout(async () => {
                    if (
                        cancelled ||
                        !mountedRef.current
                    ) {
                        return;
                    }

                    await refresh();

                    if (
                        cancelled ||
                        !mountedRef.current
                    ) {
                        return;
                    }

                    /**
                     * refresh() updates status asynchronously.
                     *
                     * We intentionally schedule another request here. The effect will
                     * also be re-evaluated when status changes, and clear any stale
                     * timer before establishing the next polling cycle.
                     */
                    scheduleNextPoll();
                }, pollInterval);
        };

        if (immediate) {
            void refresh().finally(() => {
                if (!cancelled) {
                    scheduleNextPoll();
                }
            });
        } else {
            scheduleNextPoll();
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
        refresh,
        clearPollingTimer,
        status,
    ]);

    /**
     * ---------------------------------------------------------------------------
     * Reset
     * ---------------------------------------------------------------------------
     */

    const reset = React.useCallback(() => {
        clearPollingTimer();

        requestInFlightRef.current = false;

        setStatus(null);
        setIsLoading(false);
        setIsPolling(false);
        setError(null);
    }, [clearPollingTimer]);

    /**
     * ---------------------------------------------------------------------------
     * Return
     * ---------------------------------------------------------------------------
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

export default useGenerationStatus;
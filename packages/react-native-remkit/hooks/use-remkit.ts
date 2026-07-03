import { useCallback, useEffect, useState } from "react";
import { InitRemkitOptions } from "../functions/remkit";
import { createRemoteModule } from "../helpers/create-remote";

export type RemkitComponent = React.ComponentType<Record<string, unknown>>;

export type UseRemkitResult = {
    /** The resolved remote component, or `null` while it hasn't loaded yet. */
    Component: RemkitComponent | null;
    /** `true` while the remote module is being (re)fetched. */
    loading: boolean;
    /** The error thrown by the last load attempt, or `null`. */
    error: Error | null;
    /** Re-fetches the remote module, bypassing any HTTP cache. */
    reload: () => void;
};

/**
 * Loads a remote component and exposes its loading state and an imperative
 * `reload` function. Powers both the `remkit()` component and the public hook.
 */
export function useRemkit(options: InitRemkitOptions): UseRemkitResult {
    const [Component, setComponent] = useState<RemkitComponent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [reloadToken, setReloadToken] = useState(0);

    const reload = useCallback(() => setReloadToken((token) => token + 1), []);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError(null);

        // Only bypass the cache on an explicit reload so the first load keeps
        // the original URL untouched (signed URLs, query params, etc.).
        createRemoteModule(options.url, { bustCache: reloadToken > 0 })
            .then((module) => {
                if (!cancelled) setComponent(() => module as RemkitComponent);
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [options.url, reloadToken]);

    return { Component, loading, error, reload };
}

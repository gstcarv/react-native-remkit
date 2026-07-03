import { forwardRef, useImperativeHandle } from "react";
import { InitRemkitOptions } from "../functions/remkit";
import { useRemkit } from "../hooks/use-remkit";

export type RemkitHandle = {
    /** Re-fetches the remote component, bypassing any HTTP cache. */
    reload: () => void;
};

type RemoteComponentCoreProps = {
    options: InitRemkitOptions;
    props: Record<string, unknown>;
};

export const RemoteComponentCore = forwardRef<RemkitHandle, RemoteComponentCoreProps>(
    ({ options, props }, ref) => {
        const { Component, error, reload } = useRemkit(options);

        useImperativeHandle(ref, () => ({ reload }), [reload]);

        // Surface load failures to the nearest error boundary.
        if (error) throw error;

        // Keep the previous component mounted during a reload to avoid a flash.
        if (!Component) return options.loading?.() ?? null;

        return <Component {...props} />;
    }
);

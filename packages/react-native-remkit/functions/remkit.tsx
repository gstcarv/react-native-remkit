import React, { forwardRef } from "react";
import { RemkitHandle, RemoteComponentCore } from "../components/remote-component-core";

export type InitRemkitOptions = {
    url: string;
    loading?: () => React.ReactNode;
};

export type RemkitComponentType<TProps extends Record<string, unknown> = {}> =
    React.ForwardRefExoticComponent<React.PropsWithoutRef<TProps> & React.RefAttributes<RemkitHandle>>;

export const remkit = <TProps extends Record<string, unknown> = {}>(
    options: InitRemkitOptions
): RemkitComponentType<TProps> => {
    return forwardRef<RemkitHandle, TProps>((props, ref) => (
        <RemoteComponentCore ref={ref} options={options} props={props} />
    ));
};

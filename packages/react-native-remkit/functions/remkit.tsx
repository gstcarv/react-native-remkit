import React from "react";
import { RemoteComponentCore } from "../components/remote-component-core";

export type InitRemkitOptions = {
    url: string;
};

export const remkit = <TProps extends Record<string, unknown> = {}>(
    options: InitRemkitOptions
): React.ComponentType<TProps> => {
    return (props: TProps) => <RemoteComponentCore options={options} props={props} />;
};

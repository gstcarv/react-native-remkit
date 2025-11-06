import React from "react";
import { RemoteComponentCore } from "../components/remote-component-core";

export type InitRemotelyOptions = {
    url: string;
};

export const remotely = <TProps extends Record<string, unknown> = {}>(
    options: InitRemotelyOptions
): React.ComponentType<TProps> => {
    return (props: TProps) => <RemoteComponentCore options={options} props={props} />;
};

import { useEffect, useState } from "react";
import { InitRemkitOptions } from "../functions/remkit";
import { createRemoteModule } from "../helpers/create-remote";

type RemoteComponentCoreProps = {
    options: InitRemkitOptions;
    props: Record<string, unknown>;
};

export function RemoteComponentCore({ options, props }: RemoteComponentCoreProps) {
    const [Component, setComponent] = useState<React.ComponentType<Record<string, unknown>> | null>(null);

    useEffect(() => {
        createRemoteModule(options.url).then((module) => {
            setComponent(() => module as React.ComponentType<Record<string, unknown>>);
        });
    }, [props.url]);

    if (!Component) return options.loading?.() ?? null;

    return <Component {...props} />;
}

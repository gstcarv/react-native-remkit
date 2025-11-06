import { useEffect, useState } from "react";
import { Text } from "react-native";
import { InitRemotelyOptions } from "../functions/remotely";
import { createRemoteModule } from "../helpers/create-remote";

type RemoteComponentCoreProps = {
    options: InitRemotelyOptions;
    props: Record<string, unknown>;
};

export function RemoteComponentCore({ options, props }: RemoteComponentCoreProps) {
    const [Component, setComponent] = useState<React.ComponentType<Record<string, unknown>> | null>(null);

    useEffect(() => {
        createRemoteModule(options.url).then((module) => {
            setComponent(() => module as React.ComponentType<Record<string, unknown>>);
        });
    }, [props.url]);

    if (!Component) return <Text>Loading...</Text>;

    return <Component {...props} />;
}

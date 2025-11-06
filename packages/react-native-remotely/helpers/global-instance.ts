const remotelyGlobalInstance = "__remotely__" as const;

export const getGlobalInstance = () => {
    if (!globalThis[remotelyGlobalInstance]) {
        globalThis[remotelyGlobalInstance] = {};
    }

    return globalThis[remotelyGlobalInstance];
};

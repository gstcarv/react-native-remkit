const remkitGlobalInstance = "__remkit__" as const;

export const getGlobalInstance = () => {
    if (!globalThis[remkitGlobalInstance]) {
        globalThis[remkitGlobalInstance] = {};
    }

    return globalThis[remkitGlobalInstance];
};

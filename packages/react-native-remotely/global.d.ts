declare global {
    namespace globalThis {
        var __remotely__: Record<string, unknown> | undefined;
    }
}

export {};

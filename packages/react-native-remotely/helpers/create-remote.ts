import { getGlobalInstance } from "./global-instance";

export async function createRemoteModule(url: string) {
    const remoteModule = await requestRemoteModule(url);

    parseRemoteModule(remoteModule);

    return (getGlobalInstance()["RemoteLib"] as Record<string, unknown>)?.default;
}

async function requestRemoteModule(url: string) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch remote module: ${response.statusText}`);
        }

        return response.text();
    } catch (error) {
        throw new Error(`Failed to fetch remote module: ${error}`);
    }
}

function parseRemoteModule(remoteModule: string) {
    try {
        return new Function(remoteModule)();
    } catch (error) {
        throw new Error(`Failed to parse remote module: ${error}`);
    }
}

import { ComponentNotFoundError } from "../errors/component-not-found";
import { getGlobalInstance } from "./global-instance";

export type CreateRemoteModuleOptions = {
    /** Appends a cache-busting param so a reload fetches fresh content. */
    bustCache?: boolean;
};

export async function createRemoteModule(url: string, options: CreateRemoteModuleOptions = {}) {
    const remoteModule = await requestRemoteModule(options.bustCache ? withCacheBust(url) : url);

    parseRemoteModule(remoteModule);

    const component = (getGlobalInstance()["RemoteLib"] as Record<string, unknown>)?.default;

    if (!component) {
        throw new ComponentNotFoundError({ url });
    }

    return component;
}

function withCacheBust(url: string) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}__remkit=${Date.now()}`;
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

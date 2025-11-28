export class ComponentNotFoundError extends Error {
    constructor({ url }: { url: string }) {
        super(
            `Remkit could not find any component exported in the remote module on url ${url}. Ensure the remote module exports a default component.`
        );

        this.name = "ComponentNotFoundError";
    }
}

export interface RemkitConfig {
    /**
     * The name of the project
     */
    name: string;

    /**
     * The entry file of the project. Defaults to index.tsx.
     */
    entry?: string;

    /**
     * The output directory of the project. Defaults to dist.
     */
    output?: string;

    /**
     * The external dependencies of the project. Defaults to react, react-native, and react/jsx-runtime.
     */
    externals?: string[];
}

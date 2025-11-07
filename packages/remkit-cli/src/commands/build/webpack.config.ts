import * as path from "path";
import { Configuration } from "webpack";

interface WebpackConfigOptions {
    entry: string;
    output: string;
    externals?: string[];
}

export default function webpackConfig(options: WebpackConfigOptions): Configuration {
    const projectRoot = path.dirname(options.entry);

    return {
        mode: "production",
        entry: options.entry,
        target: "web",
        output: {
            filename: "remoteEntry.js",
            path: path.resolve(options.output),
            library: {
                name: "RemoteLib",
                type: "umd",
                umdNamedDefine: true,
            },
            globalObject: "globalThis.__remkit__",
            publicPath: "",
            chunkLoading: false,
            wasmLoading: false,
            clean: true,
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            modules: ["node_modules"],
            alias: {
                "@": projectRoot,
            },
        },
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    include: [path.resolve(projectRoot)],
                    use: {
                        loader: require.resolve("babel-loader"),
                        options: {
                            presets: ["module:@react-native/babel-preset"],
                            plugins: ["react-native-reanimated/plugin"],
                        },
                    },
                },
                {
                    test: /\.(ttf|otf|eot|woff|woff2)$/i,
                    type: "asset/resource",
                    generator: { filename: "fonts/[name][ext]" },
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    type: "asset/resource",
                    generator: { filename: "assets/[name][ext]" },
                },
            ],
        },
        externals: [...(options.externals || []), "react", "react-native", "react/jsx-runtime"],
        optimization: {
            splitChunks: false,
            runtimeChunk: false,
            minimize: true,
        },
    };
}

import { Command } from "commander";
import * as fs from "fs/promises";
import * as path from "path";
import { webpack } from "webpack";
import webpackConfig from "./webpack.config";
import { RemkitConfig } from "../../types/remkit-config.type";

export const build = new Command("build").description("Build remote components using webpack").action(async () => {
    console.log("\n🔨 Building remote components...\n");

    try {
        // Read remkit.config.json
        const configPath = path.join(process.cwd(), "remkit.config.json");
        const configContent = await fs.readFile(configPath, "utf-8");
        const remkitConfig: RemkitConfig = JSON.parse(configContent);

        // Get webpack configuration
        const entryPath = path.resolve(remkitConfig.entry || "index.tsx");
        const outputPath = path.resolve(remkitConfig.output || "dist");
        const config = webpackConfig({
            entry: entryPath,
            output: outputPath,
            externals: remkitConfig.externals,
        });

        // Create webpack compiler
        const compiler = webpack(config);
        if (!compiler) {
            console.error("❌ Failed to create webpack compiler");
            process.exit(1);
        }

        // Build callback
        const callback = (err: Error | null, stats: any) => {
            if (err || stats?.hasErrors()) {
                console.error("❌ Build failed");
                console.error(stats?.toString({ colors: true }) || err?.message);
                process.exit(1);
            }
            console.log("✅ Build completed successfully!");
            console.log(`   Output: dist/index.js\n`);
        };

        compiler.run(callback);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            console.error("❌ Error: remkit.config.json not found");
            console.error("   Run 'remkit init' first");
        } else {
            console.error("❌ Error:", error.message);
        }
        process.exit(1);
    }
});

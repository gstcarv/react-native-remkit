import { Command } from "commander";
import * as fs from "fs/promises";
import * as path from "path";
import { RemkitConfig } from "../../types/remkit-config.type";

export const init = new Command("init").description("Initialize a new RemKit project").action(async () => {
    console.log("\n🚀 Initializing RemKit project...\n");

    try {
        // Read package.json from current directory
        const packageJsonPath = path.join(process.cwd(), "package.json");
        const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
        const packageJson = JSON.parse(packageJsonContent);

        if (!packageJson.name) {
            console.error("❌ Error: package.json does not have a 'name' field");
            process.exit(1);
        }

        // Read template config
        const templatePath = path.join(__dirname, "remkit.config.json");
        const templateContent = await fs.readFile(templatePath, "utf-8");
        const templateConfig: RemkitConfig = JSON.parse(templateContent);

        // Create remkit.config.json with name from package.json
        const configPath = path.join(process.cwd(), "remkit.config.json");
        const configContent: RemkitConfig = {
            ...templateConfig,
            name: packageJson.name,
        };

        await fs.writeFile(configPath, JSON.stringify(configContent, null, 4) + "\n", "utf-8");

        console.log("✅ Created remkit.config.json");
        console.log(`   Name: ${configContent.name}`);
        console.log(`   Entry: ${configContent.entry || "index.tsx"}`);
        console.log(`   Output: ${configContent.output || "dist"}`);
        console.log(`   Library: ${configContent.library || "RemoteLib"}`);
        console.log(`   Externals: ${configContent.externals?.length || 0} packages\n`);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            if (error.path?.includes("package.json")) {
                console.error("❌ Error: package.json not found in current directory");
            } else {
                console.error("❌ Error: Template file not found");
            }
        } else {
            console.error("❌ Error:", error.message);
        }
        process.exit(1);
    }
});

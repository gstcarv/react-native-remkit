#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./commands/init";
import { build } from "./commands/build";

const version = "1.0.0";

const program = new Command();

program.name("remkit").description("Interactive CLI for RemKit").version(version);

program.addCommand(init);
program.addCommand(build);

program.parse(process.argv);

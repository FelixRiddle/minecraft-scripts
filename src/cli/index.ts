import Launcher from "../Launcher";
import MinecraftServer from "../MinecraftServer";
import yargs from "yargs";

/**
 * Run commands
 */
async function mainCommand() {
	yargs.command(
		"minecraft",
		"Runs the Minecraft server",
		(yargs) => {
			yargs.option("directory", {
				alias: "d",
				type: "string",
				describe: "Path to the Minecraft server directory",
				demandOption: true,
			});

			yargs.option("script", {
				alias: "s",
				type: "string",
				describe: "Name of the script to run (default: run.sh)",
				default: "run.sh",
			});
		},
		async (argv) => {
			const server = new MinecraftServer(
				argv.directory as string,
				argv.script as string
			);
			server
				.run()
				.then((output: any) => console.log(output))
				.catch((error: any) => console.error(error));
		}
	);

	yargs.command(
		"launcher",
		"Runs the TLauncher",
		(yargs) => {
			yargs.option("path", {
				alias: "p",
				type: "string",
				describe: "Path to the TLauncher.jar file",
				demandOption: true,
			});
		},
		async (argv) => {
			const launcher = new Launcher(argv.path as string);
			launcher
				.run()
				.then((output: any) => console.log(output))
				.catch((error: any) => console.error(error));
		}
	);

	yargs.command(
		"both",
		"Runs both Minecraft server and TLauncher",
		(yargs) => {
			yargs.option("serverPath", {
				alias: "sp",
				type: "string",
				describe: "Path to the Minecraft server directory",
			});

			yargs.option("script", {
				alias: "s",
				type: "string",
				describe: "Name of the script to run (default: run.sh)",
				default: "run.sh",
			});

			yargs.option("launcherPath", {
				alias: "lp",
				type: "string",
				describe: "Path to the TLauncher.jar file",
			});
		},
		async (argv) => {
			const serverPath =
				(argv.serverPath as string) || process.env.SERVER_PATH;
			const script = argv.script as string;
			const launcherPath =
				(argv.launcherPath as string) || process.env.LAUNCHER_PATH;

			if (!serverPath) {
				throw new Error(
					"Server path not provided. Please set SERVER_PATH environment variable or use --serverPath option."
				);
			}

			if (!launcherPath) {
				throw new Error(
					"Launcher path not provided. Please set LAUNCHER_PATH environment variable or use --launcherPath option."
				);
			}

			// Run Minecraft server
			const minecraftServer = new MinecraftServer(serverPath, script);
			minecraftServer.runShell();

			// Run TLauncher
			const launcher = new Launcher(launcherPath);
			launcher.runShell();

			// Log output
			minecraftServer.logOutput();
			launcher.logOutput();
		}
	);

	yargs.parse();
}

export default mainCommand;

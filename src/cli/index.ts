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

			yargs.option("launcherPath", {
				alias: "lp",
				type: "string",
				describe: "Path to the TLauncher.jar file",
				demandOption: true,
			});
		},
		async (argv) => {
			const directory = argv.directory as string;
			const script = argv.script as string;
			const launcherPath = argv.launcherPath as string;

			// Run Minecraft server
			const minecraftServer = new MinecraftServer(directory, script);
			minecraftServer.runShell();

			// Run TLauncher
			const launcher = new Launcher(launcherPath);
			launcher.runShell();

			// Log output
			minecraftServer.on("output", (data) => {
				console.log(`Minecraft Server: ${data}`);
			});

			minecraftServer.on("error", (data) => {
				console.error(`Minecraft Server Error: ${data}`);
			});

			minecraftServer.on("close", (code) => {
				console.log(`Minecraft Server exited with code ${code}`);
			});

			launcher.on("output", (data) => {
				console.log(`TLauncher: ${data}`);
			});

			launcher.on("error", (data) => {
				console.error(`TLauncher Error: ${data}`);
			});

			launcher.on("close", (code) => {
				console.log(`TLauncher exited with code ${code}`);
			});
		}
	);

	yargs.parse();
}

export default mainCommand;

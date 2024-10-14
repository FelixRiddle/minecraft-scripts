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

	yargs.parse();
}

export default mainCommand;

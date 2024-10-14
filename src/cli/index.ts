import Launcher from "../Launcher";
import MinecraftServer from "../MinecraftServer";
import yargs from "yargs";
import { spawn } from "child_process";

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

			const serverCmd = `cd ${directory} && chmod +x ${script} && ./${script}`;
			const launcherCmd = `java -jar ${launcherPath}`;

			const serverProcess = spawn(serverCmd, {
				shell: true,
			});
			const launcherProcess = spawn(
				launcherCmd,
				{
					shell: true,
				}
			);

			serverProcess.stdout.on("data", (data: any) => {
				console.log(`Minecraft Server: ${data.toString()}`);
			});

			serverProcess.stderr.on("data", (data: any) => {
				console.error(`Minecraft Server Error: ${data.toString()}`);
			});

			launcherProcess.stdout.on("data", (data: any) => {
				console.log(`TLauncher: ${data.toString()}`);
			});

			launcherProcess.stderr.on("data", (data: any) => {
				console.error(`TLauncher Error: ${data.toString()}`);
			});
		}
	);
	
	yargs.parse();
}

export default mainCommand;

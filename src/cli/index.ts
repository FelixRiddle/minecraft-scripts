import MinecraftServer from "MinecraftServer";
import yargs from "yargs";

/**
 * Run commands
 */
async function mainCommand() {
	yargs.command("hello", "Prints a hello message", () => {
		console.log("Hello, World!");
	});

	yargs.option("name", {
		alias: "n",
		type: "string",
		describe: "Your name",
	});

	// Example usage:
	const server = new MinecraftServer(
		"/home/felix/Documents/Data/Minecraft/Servers/modded-main"
	);
	server
		.run()
		.then((output) => console.log(output))
		.catch((error) => console.error(error));
	
	yargs.parse();
}

export default mainCommand;

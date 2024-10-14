import colors from "colors";

export type ColorType = "magenta" | "cyan" | "red" | "blue";

/**
 * Log output
 *
 * @param name
 * @param eventEmitter
 */
export function logOutput(name: string, color: ColorType, eventEmitter: any) {
	let styledName = colors.bgWhite.bold.magenta(name);
	if(color === "magenta") {
		styledName = colors.bgWhite.bold.magenta(name);
	} else if(color === "red") {
		styledName = colors.bgWhite.bold.red(name);
	} else if(color === "cyan") {
		styledName = colors.bgWhite.bold.cyan(name);
	} else if(color === "blue") {
		styledName = colors.bgWhite.bold.blue(name);
	} else {
		throw new Error("Invalid color");
	}

	eventEmitter.on("output", (data: any) => {
		console.log(`${styledName} ${data}`);
	});

	eventEmitter.on("error", (data: any) => {
		console.error(`${styledName} ${colors.red("<Error>")} ${data}`);
	});

	eventEmitter.on("close", (code: any) => {
		console.log(
			`${styledName} ${colors.yellow(
				"<Exit>"
			)} exited with code ${code}`
		);
	});
}

import { exec } from "child_process";
import * as fs from "fs";

/**
 * Launcher class
 */
export default class Launcher {
	private launcherPath: string;
	private javaCommand: string;

	/**
	 * Initializes a new instance of the Launcher class.
	 *
	 * @param launcherPath The path to the TLauncher.jar file.
	 */
	constructor(launcherPath: string) {
		this.launcherPath = launcherPath;
		this.javaCommand = "java -jar";
	}

	/**
	 * Checks if the TLauncher.jar file exists.
	 *
	 * @returns True if the file exists, false otherwise.
	 */
	private launcherExists(): boolean {
		return fs.existsSync(this.launcherPath);
	}

	/**
	 * Runs the TLauncher.jar file using the java command.
	 *
	 * @returns A promise that resolves with the output or rejects with an error.
	 */
	public async run(): Promise<string> {
		if (!this.launcherExists()) {
			throw new Error(
				`TLauncher.jar file not found at '${this.launcherPath}'.`
			);
		}

		const command = `${this.javaCommand} ${this.launcherPath}`;
		return new Promise((resolve, reject) => {
			exec(command, (error, stdout, stderr) => {
				if (error) {
					reject(error);
				} else {
					resolve(stdout);
				}
			});
		});
	}
}

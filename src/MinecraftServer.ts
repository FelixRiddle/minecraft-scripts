import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { spawn } from "child_process";
import { EventEmitter } from "events";

/**
 * Minecraft server
 */
export default class MinecraftServer extends EventEmitter {
	private directoryPath: string;
	private scriptName: string;
	private process: any;

	/**
	 * Initializes a new instance of the MinecraftServer class.
	 *
	 * @param directoryPath The path to the Minecraft server directory.
	 * @param scriptName The name of the script to run (default: 'run.sh').
	 */
	constructor(directoryPath: string, scriptName: string = "run.sh") {
		super();
		this.directoryPath = directoryPath;
		this.scriptName = scriptName;
	}

	/**
	 * Checks if the specified directory exists.
	 *
	 * @returns True if the directory exists, false otherwise.
	 */
	private directoryExists(): boolean {
		return fs.existsSync(this.directoryPath);
	}

	/**
	 * Checks if the script exists in the specified directory.
	 *
	 * @returns True if the script exists, false otherwise.
	 */
	private scriptExists(): boolean {
		const scriptPath = path.join(this.directoryPath, this.scriptName);
		return fs.existsSync(scriptPath);
	}

	/**
	 * Changes to the specified directory and runs the script.
	 *
	 * @returns A promise that resolves with the script output or rejects with an error.
	 */
	public async run(): Promise<string> {
		if (!this.directoryExists()) {
			throw new Error(
				`Directory '${this.directoryPath}' does not exist.`
			);
		}

		if (!this.scriptExists()) {
			throw new Error(
				`Script '${this.scriptName}' does not exist in directory '${this.directoryPath}'.`
			);
		}

		const command = `cd ${this.directoryPath} && chmod +x ${this.scriptName} && ./${this.scriptName}`;
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

	/**
	 * Changes to the specified directory and runs the script in a shell environment.
	 */
	public runShell() {
		if (!this.directoryExists()) {
			throw new Error(
				`Directory '${this.directoryPath}' does not exist.`
			);
		}

		if (!this.scriptExists()) {
			throw new Error(
				`Script '${this.scriptName}' does not exist in directory '${this.directoryPath}'.`
			);
		}

		const command = `cd ${this.directoryPath} && chmod +x ${this.scriptName} && ./${this.scriptName}`;
		this.process = spawn(command, {
			shell: true,
		});

		this.process.stdout.on("data", (data: any) => {
			this.emit("output", data.toString());
		});

		this.process.stderr.on("data", (data: any) => {
			this.emit("error", data.toString());
		});

		this.process.on("close", (code: any) => {
			this.emit("close", code);
		});
	}

	/**
	 * Listens for events.
	 *
	 * @param eventName The event name.
	 * @param listener The event listener.
	 * @returns This EventEmitter instance.
	 */
	public on(eventName: string, listener: (...args: any[]) => void): this {
		return super.on(eventName, listener);
	}

	public logOutput() {
		this.on("output", (data) => {
			console.log(`Minecraft Server: ${data}`);
		});

		this.on("error", (data) => {
			console.error(`Minecraft Server Error: ${data}`);
		});

		this.on("close", (code) => {
			console.log(`Minecraft Server exited with code ${code}`);
		});
	}
}

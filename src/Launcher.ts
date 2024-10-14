import { exec } from "child_process";
import * as fs from "fs";
import { spawn } from "child_process";
import { EventEmitter } from "events";

/**
 * Launcher class
 */
export default class Launcher extends EventEmitter {
	private launcherPath: string;
	private javaCommand: string;
	private process: any;

	/**
	 * Initializes a new instance of the Launcher class.
	 *
	 * @param launcherPath The path to the TLauncher.jar file.
	 */
	constructor(launcherPath: string) {
		super();
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

	/**
	 * Runs the TLauncher.jar file in a shell environment.
	 */
	public runShell() {
		if (!this.launcherExists()) {
			throw new Error(
				`TLauncher.jar file not found at '${this.launcherPath}'.`
			);
		}

		const command = `${this.javaCommand} ${this.launcherPath}`;
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
	 * @param event The event name.
	 * @param listener The event listener.
	 */
	public on(event: string, listener: (...args: any[]) => void) {
		super.on(event, listener);
	}

	public logOutput() {
		this.on("output", (data) => {
			console.log(`TLauncher: ${data}`);
		});

		this.on("error", (data) => {
			console.error(`TLauncher Error: ${data}`);
		});

		this.on("close", (code) => {
			console.log(`TLauncher exited with code ${code}`);
		});
	}
}

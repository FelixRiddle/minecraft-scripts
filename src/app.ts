import { initializeDotenv } from "felixriddle.ts-app-models";
import mainCommand from "./cli/index";

/**
 * Main function
 */
export default function main() {
	// Setup dotenv
	// I don't know why this causes so many problems, it somehow mixes with arguments
	initializeDotenv();
	
	mainCommand();
}

main();

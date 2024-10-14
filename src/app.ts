import mainCommand from "./cli/index";
import { initializeDotenv } from "felixriddle.ts-app-models";

/**
 * Main function
 */
export default function main() {
	// Setup dotenv
	initializeDotenv();
	
	mainCommand();
}

main();

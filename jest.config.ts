export default {
	preset: "ts-jest",
	collectCoverage: true,
	coverageReporters: ["json", "text", "lcov", "clover"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
	transform: {
		'^.+\\.(ts|tsx)$': "ts-jest"
	},
	moduleNameMapper: {
		'^~/(.*)$': '<rootDir>/$1',
	},
	testMatch: ['**/__tests__/**/*.+(ts|js|(x)', '**/?(*.)+(spec|test).+(ts|js|(x)'],
	testEnvironment: "node"
};

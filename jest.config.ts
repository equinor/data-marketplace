import type { Config } from "@jest/types"
import nextJest from "next/jest"

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default nextJest({ dir: "./" })({
  moduleDirectories: [
    "<rootDir>",
    "node_modules"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  testMatch: [
    "**/*.{spec,test,int}.{j,t}s?(x)"
  ],
} as Config.InitialOptions)

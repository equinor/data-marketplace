import fs from "fs"
import path from "path"
import util from "util"

import { faker } from "@faker-js/faker/locale/en"

import { MOCK_DATA_DIR_PATH } from "./lib/constants.mjs"
import { randomNumber } from "./lib/randomNumber.mjs"

const MOCK_DATA_FILE_PATH = path.join(MOCK_DATA_DIR_PATH, "most_viewed.json")

const mkdir = util.promisify(fs.mkdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

if (!fs.existsSync(MOCK_DATA_DIR_PATH)) {
  try {
    console.log("\x1b[107;30mINFO:\x1b[0m Directory %s not found. Creating...", MOCK_DATA_DIR_PATH)
    await mkdir(MOCK_DATA_DIR_PATH)
    console.log("\x1b[107;30mINFO:\x1b[0m Successfully created directory %s", MOCK_DATA_DIR_PATH)
  } catch (error) {
    console.log("\x1b[41;30mERROR:\x1b[0m Unable to create directory %s", MOCK_DATA_DIR_PATH)
    console.log(error)
    process.exit(1)
  }
}

if (fs.existsSync(MOCK_DATA_FILE_PATH)) {
  console.log("\x1b[41;30mERROR:\x1b[0m File %s already exists", MOCK_DATA_FILE_PATH)
  console.log("       \x1b[2mDelete the file and run the program again\x1b[0m")
  process.exit(1)
}

const MOCK_ASSETS_PATH = path.join(MOCK_DATA_DIR_PATH, "assets.json")

if (!fs.existsSync(MOCK_ASSETS_PATH)) {
  console.log("\x1b[41;30mERROR:\x1b[0m Missing required dependency file %s", MOCK_ASSETS_PATH)
  console.log("       \x1b[2mRun `node ./scripts/seedMockAssets.mjs [number_of_assets]` to generate it\x1b[0m")
  process.exit(3)
}

const MOCK_ASSETS = JSON.parse(await readFile(MOCK_ASSETS_PATH, { encoding: "utf-8" }))

let NUMBER_OF_ASSETS = process.argv[2] ? Number(process.argv[2]) : 20

if (Number.isNaN(NUMBER_OF_ASSETS)) {
  console.log("\x1b[41;30mERROR:\x1b[0m Argument must be a number")
  console.log("       \x1b[2mExample: `node ./scrips/seedMockAssets.mjs 20`\x1b[0m")
  process.exit(2)
} else if (NUMBER_OF_ASSETS > MOCK_ASSETS.length) {
  NUMBER_OF_ASSETS = Math.min(MOCK_ASSETS.length, NUMBER_OF_ASSETS)
}

console.log("\x1b[107;30mINFO:\x1b[0m Generating %s fake assets", NUMBER_OF_ASSETS)

const assets = MOCK_ASSETS.slice(0, NUMBER_OF_ASSETS).map((asset) => ({
  assetId: asset.id,
  name: asset.name,
  numberOfViews: randomNumber(100, 500, { precision: 0 }),
  lastViewDate: faker.date.recent().valueOf(),
}))

console.log("\x1b[107;30mINFO:\x1b[0m Successfully generated %s fake assets", NUMBER_OF_ASSETS)

try {
  console.log("\x1b[107;30mINFO:\x1b[0m Writing fake assets to file %s", MOCK_DATA_FILE_PATH)
  await writeFile(MOCK_DATA_FILE_PATH, JSON.stringify(assets, null, 2), { encoding: "utf-8" })
  console.log("\x1b[107;30mINFO:\x1b[0m Successfully wrote fake assets to file %s", MOCK_DATA_FILE_PATH)
} catch (error) {
  console.log("\x1b[41;30mERROR:\x1b[0m Failed to write assets to file %s", MOCK_DATA_FILE_PATH)
  console.log(error)
  process.exit(1)
}

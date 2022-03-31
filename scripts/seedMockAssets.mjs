import fs from "fs"
import path from "path"
import url from "url"
import util from "util"

import faker from "faker"

import { randomNumber } from "./lib/randomNumber.mjs"

const MOCK_DATA_DIR_PATH = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "../__mock-data__")
const MOCK_DATA_FILE_PATH = path.join(MOCK_DATA_DIR_PATH, "assets.json")

const mkdir = util.promisify(fs.mkdir)
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

const NUMBER_OF_ASSETS = process.argv[2] ? Number(process.argv[2]) : 100

if (Number.isNaN(NUMBER_OF_ASSETS)) {
  console.log("\x1b[41;30mERROR:\x1b[0m Argument must be a number")
  console.log("       \x1b[2mExample: `node ./scrips/seedMockAssets.mjs 20`\x1b[0m")
  process.exit(2)
}

console.log("\x1b[107;30mINFO:\x1b[0m Generating %s fake assets", NUMBER_OF_ASSETS)

const assets = []

const domainID = faker.datatype.uuid()
const typeID = faker.datatype.uuid()
const statusID = faker.datatype.uuid()

for (let i = 0; i < NUMBER_OF_ASSETS; i += 1) {
  const createdOnDate = faker.date.past()
  const assetName = faker.commerce.productName()

  assets.push({
    id: faker.datatype.uuid(),
    createdBy: faker.datatype.uuid(),
    createdOn: createdOnDate.valueOf(),
    lastModifiedBy: faker.datatype.uuid(),
    lastModifiedOn: faker.date.between(createdOnDate, new Date()).valueOf(),
    system: false,
    resourceType: "Asset",
    name: assetName,
    displayName: assetName,
    articulationScore: randomNumber(0, 100, { precision: 0 }),
    excludedFromAutoHyperlinking: false,
    domain: {
      id: domainID,
      resourceType: "Domain",
      name: "REN - Data Product",
    },
    type: {
      id: typeID,
      resourceType: "AssetType",
      name: "Data Product",
    },
    status: {
      id: statusID,
      resourceType: "Status",
      name: "Approved",
    },
    avgRating: randomNumber(0, 1, { precision: 1 }),
    ratingsCount: randomNumber(5, 50, { precision: 0 }),
  })
}

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

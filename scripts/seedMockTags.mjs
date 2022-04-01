import fs from "fs"
import path from "path"
import util from "util"

import faker from "faker"

import { MOCK_DATA_DIR_PATH } from "./lib/constants.mjs"

const writeFile = util.promisify(fs.writeFile)

const MOCK_TAGS_FILE_PATH = path.join(MOCK_DATA_DIR_PATH, "tags.json")

const tags = []

for (let i = 0; i < 15; i += 1) {
  const createdOnDate = faker.date.past()
  const isModified = faker.datatype.boolean()

  tags.push({
    id: faker.datatype.uuid(),
    createdBy: faker.datatype.uuid(),
    createdOn: createdOnDate.valueOf(),
    lastModifiedBy: isModified ? faker.datatype.uuid() : null,
    lastModifiedOn: isModified ? faker.date.between(createdOnDate, new Date()).valueOf() : null,
    system: false,
    resourceType: "Tag",
    name: faker.name.jobArea(),
  })
}

try {
  await writeFile(MOCK_TAGS_FILE_PATH, JSON.stringify(tags, null, 2), { encoding: "utf-8" })
  console.log("\x1b[107;30mINFO:\x1b[0m Successfully wrote %s mock tags to %s", tags.length, MOCK_TAGS_FILE_PATH)
} catch (error) {
  console.log("\x1b[41;30mERROR:\x1b[0m Failed to write mock tags to %s", MOCK_TAGS_FILE_PATH)
  console.log(error)
  process.exit(1)
}

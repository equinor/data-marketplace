import path from "path"
import url from "url"

export const MOCK_DATA_DIR_PATH = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "../../__mock-data__")

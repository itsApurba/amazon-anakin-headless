import fs from "fs/promises";
import zlib from "zlib";
// Import the json file
const json = JSON.parse(await fs.readFile("storage/key_value_stores/default/data.json", "utf-8"));

// compressing it to gzip
const gzip = zlib.gzipSync(JSON.stringify(json));

await fs.writeFile("data.json.gzip", gzip);

const json2 = JSON.parse(zlib.gunzipSync(gzip));
// console.log(json2)

await fs.writeFile("data.json", JSON.stringify(json2))

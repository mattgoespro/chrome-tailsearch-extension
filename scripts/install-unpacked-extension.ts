import fs from "fs-extra";
import path from "path";
import os from "os";
import packageJson from "../package.json";

const destinationDir = path.join(
  os.homedir(),
  "AppData",
  "Local",
  "Google",
  "Chrome",
  "Unpacked Extensions",
  `${packageJson.name}-${packageJson.version}-unpacked`
);

fs.ensureDirSync(destinationDir);
const sourceDirectory = path.resolve(__dirname, "..", "out");

console.log(`Copying unpacked extension -> ${destinationDir}`);

try {
  fs.copySync(sourceDirectory, destinationDir);
  console.log("Extension copied successfully.");
} catch (error) {
  console.error("Error copying extension:", error);
}

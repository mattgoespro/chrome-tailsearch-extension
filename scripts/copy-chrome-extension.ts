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

fs.ensureDirSync(destinationDir, { mode: 0o755 });
const sourceDirectory = path.resolve(__dirname, "..", "dist");

console.log(`Copying unpacked extension -> ${destinationDir}`);

fs.copy(
  sourceDirectory,
  destinationDir,
  {
    overwrite: true,
    errorOnExist: true
  },
  (err) => {
    if (err != null) {
      console.error("Error copying files:", err);
      return;
    }

    console.log("Installed unpacked extension successfully.");
  }
);

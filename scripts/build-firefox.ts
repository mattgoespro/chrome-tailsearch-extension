import path from "node:path";
import AdmZip from "adm-zip";
import fs from "fs-extra";

const outDir = path.resolve(__dirname, "..", "out");
const distDir = path.resolve(__dirname, "..", "dist");

function zipExtension() {
  const browserDistDir = path.join(distDir, "firefox");
  fs.ensureDirSync(browserDistDir);
  fs.copySync(outDir, browserDistDir);
  fs.rmSync(path.join(browserDistDir, "manifest.json"), { force: true });
  fs.copyFileSync(
    path.join(__dirname, "..", "src", "manifest.firefox.json"),
    path.join(browserDistDir, "manifest.json")
  );
  const zip = new AdmZip();
  zip.addLocalFolder(browserDistDir);
  zip.writeZip(path.join(distDir, `tailsearch-firefox.zip`));
}

zipExtension();

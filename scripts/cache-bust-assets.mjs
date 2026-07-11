import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const assetPattern = /((?:\/|(?:\.\.\/)*|(?:\.\/)?)(?:assets\/)[^\s"'?#)]+)(?:\?v=[a-f0-9]{12})*/g;

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;

    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findHtmlFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
}

function resolveAsset(htmlFile, assetUrl) {
  if (assetUrl.startsWith("/")) {
    return path.join(root, assetUrl.slice(1));
  }

  return path.resolve(path.dirname(htmlFile), assetUrl);
}

async function assetVersion(assetFile) {
  const contents = await readFile(assetFile);
  return createHash("sha256").update(contents).digest("hex").slice(0, 12);
}

const htmlFiles = await findHtmlFiles(root);
const versions = new Map();
const changedFiles = [];
const missingAssets = new Set();

for (const htmlFile of htmlFiles) {
  const original = await readFile(htmlFile, "utf8");
  const matches = [...original.matchAll(assetPattern)];
  const fileVersions = new Map();

  for (const match of matches) {
    const [, assetUrl] = match;
    if (fileVersions.has(assetUrl)) continue;

    const assetFile = resolveAsset(htmlFile, assetUrl);

    try {
      if (!(await stat(assetFile)).isFile()) {
        missingAssets.add(path.relative(root, assetFile));
        fileVersions.set(assetUrl, null);
        continue;
      }
    } catch {
      missingAssets.add(path.relative(root, assetFile));
      fileVersions.set(assetUrl, null);
      continue;
    }

    let version = versions.get(assetFile);
    if (!version) {
      version = await assetVersion(assetFile);
      versions.set(assetFile, version);
    }

    fileVersions.set(assetUrl, version);
  }

  const updated = original.replace(assetPattern, (reference, assetUrl) => {
    const version = fileVersions.get(assetUrl);
    return version ? `${assetUrl}?v=${version}` : reference;
  });

  if (updated !== original) {
    changedFiles.push(path.relative(root, htmlFile));
    if (!checkOnly) await writeFile(htmlFile, updated);
  }
}

if (missingAssets.size > 0) {
  console.error("Missing local assets:");
  for (const asset of [...missingAssets].sort()) console.error(`- ${asset}`);
  process.exitCode = 1;
} else if (checkOnly && changedFiles.length > 0) {
  console.error("Stale or missing asset versions:");
  for (const file of changedFiles) console.error(`- ${file}`);
  process.exitCode = 1;
} else {
  const action = checkOnly ? "Verified" : "Updated";
  console.log(`${action} ${versions.size} local assets across ${htmlFiles.length} HTML files (${changedFiles.length} files changed).`);
}

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const configFile = path.join(root, "race-day-links.json");
const args = process.argv.slice(2);

function usage() {
  console.log(`Usage:
  node scripts/set-race-day-links.mjs --live-tracking <url> [--results <url>]
  node scripts/set-race-day-links.mjs --results <url>
  node scripts/set-race-day-links.mjs --check`);
}

function readOption(name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a URL.`);
  }
  return value;
}

function validateUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} is not a valid URL: ${value}`);
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`${label} must use http:// or https://.`);
  }

  return url.toString();
}

function validateConfig(config) {
  for (const [name, entry] of Object.entries({
    "Live tracking": config.liveTracking,
    Results: config.results,
  })) {
    if (!entry || typeof entry.enabled !== "boolean") {
      throw new Error(`${name} must have an enabled boolean.`);
    }
    if (entry.enabled) validateUrl(entry.url, name);
  }
}

try {
  const config = JSON.parse(await readFile(configFile, "utf8"));
  const checkOnly = args.includes("--check");
  const liveTrackingUrl = readOption("--live-tracking");
  const resultsUrl = readOption("--results");

  if (checkOnly) {
    if (args.length !== 1) throw new Error("--check cannot be combined with URL options.");
    validateConfig(config);
    console.log("Verified race-day-links.json.");
    process.exit(0);
  }

  if (!liveTrackingUrl && !resultsUrl) {
    usage();
    process.exit(1);
  }

  if (liveTrackingUrl) {
    config.liveTracking.enabled = true;
    config.liveTracking.url = validateUrl(liveTrackingUrl, "Live tracking");
  }

  if (resultsUrl) {
    config.results.enabled = true;
    config.results.url = validateUrl(resultsUrl, "Results");
  }

  config.updatedAt = new Date().toISOString();
  validateConfig(config);
  await writeFile(configFile, `${JSON.stringify(config, null, 2)}\n`);

  const enabled = [
    liveTrackingUrl ? "live tracking" : null,
    resultsUrl ? "results" : null,
  ].filter(Boolean).join(" and ");
  console.log(`Enabled ${enabled} in race-day-links.json.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

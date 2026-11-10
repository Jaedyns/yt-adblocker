import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const errors = [];
const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    errors.push(`${path}: ${err.message}`);
    return null;
  }
};

const manifest = readJson("manifest.json");
const rules = readJson("rules.json");

if (manifest) {
  const files = [
    manifest.background?.service_worker,
    manifest.action?.default_popup,
    ...Object.values(manifest.icons ?? {}),
    ...manifest.declarative_net_request.rule_resources.map((r) => r.path),
    ...manifest.content_scripts.flatMap((c) => [...(c.js ?? []), ...(c.css ?? [])]),
  ];
  for (const file of files) if (!existsSync(file)) errors.push(`manifest.json references missing file ${file}`);

  for (const file of files.filter((f) => f.endsWith(".js"))) {
    try {
      execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    } catch (err) {
      errors.push(`${file}: ${err.stderr.toString().trim()}`);
    }
  }
}

if (rules) {
  const ids = new Set();
  for (const rule of rules) {
    if (!Number.isInteger(rule.id) || rule.id < 1) errors.push(`rule has a bad id: ${JSON.stringify(rule.id)}`);
    if (ids.has(rule.id)) errors.push(`duplicate rule id ${rule.id}`);
    ids.add(rule.id);
    if (!rule.action?.type) errors.push(`rule ${rule.id} has no action.type`);
    if (!rule.condition?.urlFilter && !rule.condition?.regexFilter) errors.push(`rule ${rule.id} has no urlFilter`);
  }
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ manifest and ${rules.length} rules look good`);

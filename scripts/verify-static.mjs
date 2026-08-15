import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(resolve(root, "index.html"), "utf8");
const errors = [];

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

for (const id of new Set(duplicateIds)) {
  errors.push(`Duplicate id: #${id}`);
}

const idSet = new Set(ids);
const anchors = [...html.matchAll(/\bhref="#([^"]+)"/g)].map(
  (match) => match[1],
);

for (const anchor of new Set(anchors)) {
  if (!idSet.has(anchor)) errors.push(`Missing anchor target: #${anchor}`);
}

const assetReferences = [
  ...html.matchAll(/\b(?:href|src)="((?!#|[a-z]+:|\/\/)[^"]+)"/gi),
].map((match) => match[1].split(/[?#]/, 1)[0]);

for (const reference of new Set(assetReferences)) {
  try {
    await access(resolve(root, reference));
  } catch {
    errors.push(`Missing local file: ${reference}`);
  }
}

const rootRelativeReferences = [
  ...html.matchAll(/\b(?:href|src)="\/(?!\/)([^"]+)"/gi),
];

if (rootRelativeReferences.length) {
  errors.push("Root-relative asset paths break the GitHub Pages subpath preview.");
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Static checks passed (${ids.length} ids, ${anchors.length} anchor links, ${assetReferences.length} local file references).`,
  );
}

// The Most Boring Object, Reviewed in One Line
// Writes a single-line, <= 200 character review of a doorstop to /output/entry.txt.
//
// Why a doorstop: it is the dullest everyday object imaginable — a rubber
// wedge whose whole job is to sit on the floor and be ignored — and the joke
// comes from how it really behaves: kicked, stepped on, and still beaten by
// a light breeze. The turn lands fast and the last words sharpen it.
//
// Structure of this script:
//   1. Constants — output path and the entry-text limits.
//   2. The entry text itself (a single literal, never assembled at runtime,
//      so the submitted line cannot drift from what was reviewed).
//   3. Small validation helpers, one rule each, composed by validateLine().
//   4. writeEntry() — creates the output directory and writes the file.
//   5. main() — wires the steps together in order.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const OUTPUT_PATH = "/output/entry.txt";

// The gate requires 1-200 characters, UTF-8 text, not only whitespace,
// and a single line. These bounds are the contract validateLine enforces.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// ---------------------------------------------------------------------------
// Entry text
// ---------------------------------------------------------------------------

// One line, 119 characters: subject, colon, the gag, then a one-star rating.
// The stars are literal Unicode characters, so length is measured in code
// points (see countChars), not UTF-16 code units or bytes.
const ENTRY_TEXT =
  "The doorstop: a rubber wedge whose entire career is being kicked, stepped on, and still losing to a light breeze. ★☆☆☆☆";

// ---------------------------------------------------------------------------
// Validation helpers — one rule per function, so a failure names its rule.
// ---------------------------------------------------------------------------

/** Counts Unicode code points, so a star counts as one character. */
function countChars(text: string): number {
  return [...text].length;
}

/** The entry must fit the gate's length window. Returns the char count so
 *  the caller can report it without recounting. */
function validateLength(text: string): number {
  const chars = countChars(text);
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `Entry is ${chars} characters; must be ${MIN_CHARS}-${MAX_CHARS}.`,
    );
  }
  return chars;
}

/** The entry must contain something besides whitespace. */
function validateNotBlank(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only whitespace.");
  }
}

/** The entry must be exactly one line — no LF or CR anywhere. */
function assertSingleLine(text: string): void {
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
}

/**
 * Runs every gate rule over the entry and returns its character count.
 * Throws on the first rule that fails, naming the rule that failed.
 */
function validateLine(text: string): number {
  const chars = validateLength(text);
  validateNotBlank(text);
  assertSingleLine(text);
  return chars;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

/** Creates the output directory if needed, then writes the entry as UTF-8. */
function writeEntry(text: string): void {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, text, "utf8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  // Validate first so a bad entry fails before anything is written.
  const chars = validateLine(ENTRY_TEXT);
  writeEntry(ENTRY_TEXT);
  console.log(`Wrote ${chars} characters to ${OUTPUT_PATH}`);
}

main();

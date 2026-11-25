// One-line review of the most boring object imaginable: a doorstop.
// A rubber wedge that spends its whole life on the floor getting kicked
// and stepped on, only to still lose to a light breeze. That mismatch —
// an object built to hold a door, beaten by moving air — is the whole joke,
// and the single star at the end delivers the verdict.
//
// How this file is laid out:
//   1. The review itself, kept as one fixed literal so the submitted line
//      can never drift away from the line that was checked.
//   2. Limits for the gate (length window and output destination).
//   3. Small checks, each enforcing a single gate rule.
//   4. A writer that prepares the folder and saves the file.
//   5. The entry point, which runs the checks before writing anything.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// Review text
// ---------------------------------------------------------------------------

// A single line of 119 characters: the subject, a colon, the gag about
// being kicked and stepped on yet losing to a breeze, then one filled star
// followed by four empty ones. Stars are literal Unicode, so the length
// check below counts code points rather than UTF-16 units or bytes.
const REVIEW_TEXT =
  "The doorstop: a rubber wedge whose entire career is being kicked, stepped on, and still losing to a light breeze. ★☆☆☆☆";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const DESTINATION_PATH = "/output/entry.txt";

// The gate accepts 1-200 characters of UTF-8 text, non-blank, on one line.
// These two bounds are the length window the checks below enforce.
const MIN_ENTRY_CHARS = 1;
const MAX_ENTRY_CHARS = 200;

// ---------------------------------------------------------------------------
// Gate checks — each helper enforces exactly one rule, so a failure names
// the rule that was broken. runGateChecks composes them and reports the
// character count for the success message.
// ---------------------------------------------------------------------------

/** Measures length in Unicode code points, so each star counts as one. */
function measureLengthInCodePoints(line: string): number {
  return [...line].length;
}

/** The review must contain at least one non-whitespace character. */
function checkNotOnlyWhitespace(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("Entry must not be only whitespace.");
  }
}

/** The review must be exactly one line — no line-feed or carriage-return. */
function checkHasNoLineBreaks(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
}

/**
 * The review must fit inside the gate's length window. Returns the
 * character count so the caller can report it without recounting.
 */
function checkLengthWithinWindow(line: string): number {
  const total = measureLengthInCodePoints(line);
  if (total < MIN_ENTRY_CHARS || total > MAX_ENTRY_CHARS) {
    throw new Error(
      `Entry is ${total} characters; must be ${MIN_ENTRY_CHARS}-${MAX_ENTRY_CHARS}.`,
    );
  }
  return total;
}

/**
 * Runs every gate rule over the review and returns its character count.
 * Throws on the first rule that fails.
 */
function runGateChecks(line: string): number {
  checkNotOnlyWhitespace(line);
  checkHasNoLineBreaks(line);
  return checkLengthWithinWindow(line);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

/** Creates the folder for the destination file when it does not exist yet. */
function ensureOutputDirectory(): void {
  mkdirSync(dirname(DESTINATION_PATH), { recursive: true });
}

/** Prepares the output folder, then writes the review as UTF-8 text. */
function saveReview(line: string): void {
  ensureOutputDirectory();
  writeFileSync(DESTINATION_PATH, line, "utf8");
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  // Check first so a review that fails the gate never reaches the disk.
  const charCount = runGateChecks(REVIEW_TEXT);
  saveReview(REVIEW_TEXT);
  console.log(`Wrote ${charCount} characters to ${DESTINATION_PATH}`);
}

main();

#!/usr/bin/env node
/**
 * TRIAGE ENGINE v2 - Manager Sub-Agent Router
 * Analyzes input text to determine which of the 13 workers to call.
 */

const fs = require('fs');
const path = require('path');

// Load competencies
const competenciesPath = path.join(__dirname, 'competencies.json');
let competencies;
try {
  competencies = JSON.parse(fs.readFileSync(competenciesPath, 'utf8'));
} catch (e) {
  console.error("Error: Could not load competencies.json", e);
  process.exit(1);
}

const inputText = process.argv.slice(2).join(" ").toLowerCase();

if (!inputText) {
  console.log("Error: No input text provided.");
  process.exit(1);
}

// Simple Scoring Logic
let results = [];

for (const [agentId, data] of Object.entries(competencies.agents)) {
  let score = 0;
  data.keywords.forEach(keyword => {
    if (inputText.includes(keyword)) {
      score += 1;
    }
  });

  if (score > 0) {
    results.push({ agentId, score });
  }
}

// Sort by score (descending)
results.sort((a, b) => b.score - a.score);

// Output decision
if (results.length === 0) {
  console.log("=== DECISION ===");
  console.log("ACTION: CLARIFY");
  console.log("REASON: No matching keywords found.");
  console.log("DEFAULT_AGENT: researcher");
} else {
  const primary = results[0];
  console.log("=== DECISION ===");
  console.log(`ACTION: DELEGATE`);
  console.log(`AGENT: ${primary.agentId}`);
  console.log(`CONFIDENCE: ${(primary.score / inputText.split(" ").length).toFixed(2)}`);
  
  if (results.length > 1) {
    console.log(`SECONDARY_AGENT: ${results[1].agentId}`);
  }
  
  // Rule check: Code review requirement
  if (competencies.rules.require_review_on_code && primary.agentId === "code-writer") {
    console.log("MANDATORY_HOOK: code-reviewer");
  }
}

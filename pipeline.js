import axios from "axios";
import { OPENROUTER_API_KEY } from "./config.js";

export async function getFunctionSequence(userQuery) {
  // If the query is a simple greeting or doesn't match any tool, just use LLM to answer
  const simplePatterns = [
    /\bhi\b|\bhello\b|\bhow are you\b|\bwho are you\b|\bwhat's up\b/i
  ];
  if (simplePatterns.some(re => re.test(userQuery))) {
    // Use LLM to answer simply
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/ministral-3b",
        messages: [
          { role: "system", content: "You are a helpful assistant. Answer simply and conversationally." },
          { role: "user", content: userQuery }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return [{ function: "llmAnswer", inputs: { userQuery }, output: response.data.choices[0].message.content }];
  }
  const functionLibrary = (await import("./functionLibrary.js")).default;
  const systemPrompt = `
You are an AI assistant. Given a user query, break it down into a sequence of function calls using ONLY the following functions:
${functionLibrary.map(fn => `- ${fn.name}: ${fn.description} (inputs: ${fn.inputs.join(", ")})`).join("\n")}
Return the sequence as a JSON array, each item with: function, inputs (object), and output (string).
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/ministral-3b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const content = response.data.choices[0].message.content;
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]");
    if (jsonStart === -1 || jsonEnd === -1) {
      // No tool found or model didn't return a sequence
      return [{ function: "noTool", inputs: { userQuery }, output: "Sorry, I cannot do this thing in absence of a suitable tool." }];
    }
    const jsonString = content.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [{ function: "noTool", inputs: { userQuery }, output: "Sorry, I cannot do this thing in absence of a suitable tool." }];
    }
    return parsed;
  } catch (error) {
    return [{ function: "noTool", inputs: { userQuery }, output: "Sorry, I cannot do this thing in absence of a suitable tool." }];
  }
}

export async function executeFunctionSequence(sequence, opts = {}) {
  const results = [];
  for (const step of sequence) {
    // Directly print LLM or noTool answers
    if (step.function === 'llmAnswer' || step.function === 'noTool') {
      results.push({ function: step.function, result: step.output });
      continue;
    }
    const functionLibrary = (await import("./functionLibrary.js")).default;
    const fn = functionLibrary.find(f => f.name === step.function);
    if (!fn || typeof fn.implementation !== 'function') {
      results.push({ function: step.function, error: `No implementation for function: ${step.function}` });
      continue;
    }
    try {
      const args = fn.inputs.map(input => step.inputs ? step.inputs[input] : undefined);
      const result = await fn.implementation(...args);
      results.push({ function: step.function, result });
    } catch (e) {
      results.push({ function: step.function, error: e && e.message ? e.message : String(e) });
    }
  }
  // Beautified output
  if (!opts.noClear) console.clear();
  const divider = '\x1b[36m' + '═'.repeat(54) + '\x1b[0m';
  console.log('\n\x1b[1;35m🛠️  PIPELINE EXECUTION SUMMARY\x1b[0m\n');
  let summary = [];
  let pipelineSteps = results.map(res => res.function).join('  \x1b[90m→\x1b[0m  ');
  console.log(`\x1b[1;36mPipeline:\x1b[0m  ${pipelineSteps}\n`);
  results.forEach((res, idx) => {
    console.log(divider);
    // Use an emoji for the function name
    console.log(` 🟢  \x1b[36m${res.function}\x1b[0m`);
    console.log('\x1b[36m' + '─'.repeat(54) + '\x1b[0m');
    if (res.error) {
      console.log("   \x1b[31m❌ Error:\x1b[0m\n   " + res.error);
      summary.push(`❌ ${res.function}: ${res.error}`);
    } else {
      let pretty;
      try {
        pretty = typeof res.result === 'string' ? res.result : JSON.stringify(res.result, null, 2).replace(/\n/g, '\n   ');
      } catch {
        pretty = String(res.result);
      }
      console.log("   \x1b[32m✅ Result:\x1b[0m\n   " + pretty);
      summary.push(`✅ ${res.function}: ${typeof res.result === 'string' ? res.result : JSON.stringify(res.result)}`);
    }
  });
  console.log(divider);
  // Combined summary at the end
  console.log("\n\x1b[1;33mSummary of this query:\x1b[0m");
  summary.forEach(line => console.log('  ' + line));
  console.log("\n\x1b[1;34m✔️  All function calls completed.\x1b[0m\n");
  results.length = 0; // Clear the array
}

// Example queries to test the pipeline with a sequence of 5 queries
export const exampleQueries = [
  "Add a user with user id 401 and name Dave",
  "Create a todo for user 401 to 'finish project' at 2pm",
  "Send an email to Dave with subject 'Project' and body 'Finish your project by 2pm'",
  "List all files in the ./tools directory",
  "Check if https://openai.com is up"
];

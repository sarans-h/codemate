// index.js
import readline from 'readline';
import { getFunctionSequence, executeFunctionSequence } from "./pipeline.js";

async function chat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("AI Function Pipeline Chat. Type 'exit' to quit.\n");

  rl.setPrompt('You: ');
  rl.prompt();

  rl.on('line', async (userQuery) => {
    if (userQuery.trim().toLowerCase() === 'exit') {
      rl.close();
      return;
    }
    try {
      const sequence = await getFunctionSequence(userQuery);
      // Print the query and its pipeline (do not clear the console)
      console.log("\x1b[1;33m\nQuery:\x1b[0m " + userQuery);
      console.log("\x1b[1;36mPipeline:\x1b[0m");
      console.log(JSON.stringify(sequence, null, 2));
      await executeFunctionSequence(sequence, { noClear: true });
    } catch (err) {
      console.error("Error:", err.message);
    }
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
  });
}

chat();

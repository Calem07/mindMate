const fs = require('fs');
const readline = require('readline');

async function run() {
  const fileStream = fs.createReadStream('C:\\Users\\RAKTIM\\.gemini\\antigravity\\brain\\f4761fed-061e-46c2-853f-47cee352c325\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    index++;
    if (line.includes('App.jsx') && line.includes('write_to_file')) {
      try {
        const obj = JSON.parse(line);
        // Find if it has tool calls writing to App.jsx
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            if (tc.name === 'write_to_file' && tc.args && tc.args.CodeContent) {
              const content = tc.args.CodeContent;
              const cleanContent = content.startsWith('"') ? JSON.parse(content) : content;
              console.log(`Step ${obj.step_index || index} wrote App.jsx. Length: ${cleanContent.length}`);
              
              // Let's search inside this content for AuthPage
              if (cleanContent.includes('AuthPage')) {
                fs.writeFileSync(`C:\\Users\\RAKTIM\\Documents\\New project\\mindmate\\brain\\f4761fed-061e-46c2-853f-47cee352c325\\scratch\\extracted_App_${obj.step_index || index}.jsx`, cleanContent);
                console.log(`Saved extracted file to scratch/extracted_App_${obj.step_index || index}.jsx`);
              }
            }
          }
        }
      } catch (err) {
        console.error(`Failed parsing line ${index}:`, err.message);
      }
    }
  }
}

run();

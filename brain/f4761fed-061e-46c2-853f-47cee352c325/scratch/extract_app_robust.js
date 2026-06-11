const fs = require('fs');
const readline = require('readline');

async function run() {
  const fileStream = fs.createReadStream('C:\\Users\\RAKTIM\\.gemini\\antigravity\\brain\\f4761fed-061e-46c2-853f-47cee352c325\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (let line of rl) {
    index++;
    if (line.includes('App.jsx') && line.includes('write_to_file')) {
      // Escape raw control characters (0x00 to 0x1F) except \r and \n
      const cleaned = line.replace(/[\x00-\x09\x0b\x0c\x0e-\x1f\x7f]/g, (x) => {
        if (x === '\t') return '\\t';
        return '\\u' + ('0000' + x.charCodeAt(0).toString(16)).slice(-4);
      });
      try {
        const obj = JSON.parse(cleaned);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            if (tc.name === 'write_to_file' && tc.args && tc.args.CodeContent) {
              let content = tc.args.CodeContent;
              
              // CodeContent is doubly stringified in some formats
              if (typeof content === 'string') {
                if (content.startsWith('"')) {
                  try {
                    content = JSON.parse(content);
                  } catch (e) {
                    // try removing outer quotes and unescaping
                    content = JSON.parse('"' + content.replace(/"/g, '\\"') + '"');
                  }
                }
                
                // Let's check again
                if (typeof content === 'string' && content.startsWith('"')) {
                  content = JSON.parse(content);
                }
                
                if (content.includes('AuthPage') || content.includes('LoginPage')) {
                  fs.writeFileSync(`C:\\Users\\RAKTIM\\Documents\\New project\\mindmate\\brain\\f4761fed-061e-46c2-853f-47cee352c325\\scratch\\extracted_App_full_${obj.step_index || index}.jsx`, content);
                  console.log(`Saved full App.jsx to scratch/extracted_App_full_${obj.step_index || index}.jsx. Length: ${content.length}`);
                }
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

"const fs = require('fs');
const readline = require('readline');

async function run() {
  const fileStream = fs.createReadStream('C:\\Users\\RAKTIM\\.gemini\\antigravity\\brain\\f4761fed-061e-46c2-853f-47cee352c325\\.system_generated\\logs\	ranscript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    index++;
    if (line.includes('App.jsx') && line.includes('write_to_file')) {
      // Use regex to locate CodeContent
      const match = line.match(/"CodeContent"\s*:\s*"((?:\\?.)*?)"/);
      if (match) {
        let rawContent = match[1];
        // Unescape the string
        try {
          // If it is doubly escaped
          if (rawContent.startsWith('\\"')) {
            rawContent = JSON.parse('"' + rawContent + '"');
          }
          const cleanContent = JSON.parse('"' + rawContent + '"');
          console.log(`Regex parsed line ${index}. Length: ${cleanContent.length}`);
          if (cleanContent.includes('AuthPage') || cleanContent.includes('LoginPage')) {
            fs.writeFileSync(`C:\\Users\\RAKTIM\\Documents\\New project\\mindmate\\brain\\f4761fed-061e-46c2-853f-47cee352c325\\scratch\\extracted_App_${index}.jsx`, cleanContent);
            console.log(`Saved extracted file to scratch/extracted_App_${index}.jsx`);
          }
        } catch (e) {
          // Fallback simple replace
          const cleanContent = rawContent
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\
/g, '
')
            .replace(/\/g, '')
            .replace(/\	/g, '	');
          console.log(`Fallback regex parsed line ${index}. Length: ${cleanContent.length}`);
          if (cleanContent.includes('AuthPage') || cleanContent.includes('LoginPage')) {
            fs.writeFileSync(`C:\\Users\\RAKTIM\\Documents\\New project\\mindmate\\brain\
<truncated 245 bytes>
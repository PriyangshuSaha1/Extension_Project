import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({});

// List files
async function listFiles(directory) {
  const files = [];
  const allowed = ['.js', '.html', '.css'];

  function scan(dir) {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);

      if (full.includes('node_modules')) continue;

      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else if (allowed.includes(path.extname(file))) {
        files.push(full);
      }
    }
  }

  scan(directory);
  return files;
}

// Main Agent
export async function runAgent(directory) {

  const files = await listFiles(directory);

  for (const file of files) {

    const code = fs.readFileSync(file, 'utf-8');

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{
          text: `Review and fix this code:\n\n${code}`
        }]
      }]
    });

    const fixedCode = result.text;

    fs.writeFileSync(file, fixedCode, 'utf-8');
  }
}

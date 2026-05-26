import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.join(__dirname, '../../prompts');

export const loadPrompt = (filename) => {
  const filePath = path.join(promptsDir, filename);
  return fs.readFileSync(filePath, 'utf-8');
};

export const fillPrompt = (template, variables) => {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
};

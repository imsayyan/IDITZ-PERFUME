import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDist = path.resolve(__dirname, '../frontend/dist');
const targetPublic = path.resolve(__dirname, '../public');

if (fs.existsSync(sourceDist)) {
  fs.mkdirSync(targetPublic, { recursive: true });
  fs.cpSync(sourceDist, targetPublic, { recursive: true, force: true });
  console.log('✓ Successfully mirrored frontend/dist to root public/ directory for cPanel/Cloud hosting.');
} else {
  console.warn('! Source frontend/dist does not exist yet. Run build first.');
}

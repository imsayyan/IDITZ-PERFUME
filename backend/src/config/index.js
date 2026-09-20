import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'noore_secret_super_key_2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  dbPath: process.env.DB_PATH
    ? (path.isAbsolute(process.env.DB_PATH)
        ? process.env.DB_PATH
        : (path.resolve(__dirname, '../../data/noore.db')))
    : path.resolve(__dirname, '../../data/noore.db'),
  uploadsPath: process.env.UPLOADS_PATH
    ? (path.isAbsolute(process.env.UPLOADS_PATH)
        ? process.env.UPLOADS_PATH
        : (path.resolve(__dirname, '../../uploads')))
    : path.resolve(__dirname, '../../uploads'),
  payment: {
    provider: process.env.PAYMENT_GATEWAY_PROVIDER || 'razorpay',
    keyId: process.env.PAYMENT_GATEWAY_KEY_ID || '',
    keySecret: process.env.PAYMENT_GATEWAY_KEY_SECRET || '',
    webhookSecret: process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET || '',
  }
};

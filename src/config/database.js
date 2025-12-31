import 'dotenv/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Configure for Neon Local if NEON_LOCAL_HOST is set (development with Docker)
// Neon Local only supports HTTP-based communication, not WebSockets
if (process.env.NEON_LOCAL_HOST) {
  neonConfig.fetchEndpoint = `http://${process.env.NEON_LOCAL_HOST}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export { db, sql };

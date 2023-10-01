import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;
console.log('DATABASE_URL', process.env.DATABASE_URL)
if (!process.env.DATABASE_URL) {
    throw new Error('Databse url not found')
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql)
import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

export default {
    driver: 'pg',
    schema: './src/lib/db/schema.ts',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    }
} satisfies Config

// Run the below to push our schema to drizzle
// npx drizzle-kit push:pg

// To run drizzle run
// npx drizzle-kit studio
// Port will open on:
// http://127.0.0.1:4983
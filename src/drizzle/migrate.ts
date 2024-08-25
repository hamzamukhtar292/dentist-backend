import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { configDotenv } from 'dotenv';
import postgres from 'postgres';
configDotenv()

async function main() {
    const migrationClient = postgres(process.env.DATABASE_URL as string, {max:1});
    await migrate(drizzle(migrationClient), {
        migrationsFolder:"./src/drizzle/migrations"
    })
    await migrationClient.end()
}
main()

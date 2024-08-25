import { defineConfig } from "drizzle-kit";
import { config } from 'dotenv';
config();

console.log(process.env.DATABASE_URL);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
//   dbCredentials: {
//     host: "127.0.0.1",  // Corrected IP address format
//     port: 5432,  // Use number instead of string
//     user: "hamza",
//     password: "hamza",
//     database: "dentist",
//   },
  verbose: true,
  strict: true,
});
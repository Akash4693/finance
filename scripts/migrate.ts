/* import { config } from "dotenv"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"

config({ path: ".env.local" })

const sql = neon(process.env.DATABASE_URL!)

const db = drizzle(sql);

const main = async () => {
    try {
        console.log(sql)
        await migrate(db, { migrationsFolder: "drizzle"})
    } catch (error) {
        console.error("Error during migration:", error)
        process.exit(1);
    }
}

main() */

import { config } from "dotenv"; // Load environment variables
import { neon } from "@neondatabase/serverless"; // Neon DB serverless library
import { drizzle } from "drizzle-orm/neon-http"; // Drizzle ORM Neon adapter
import { migrate } from "drizzle-orm/neon-http/migrator"; // Migration handler

config({ path: ".env.local" }); // Load env variables from .env.local file

// Check if DATABASE_URL is set in the environment
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the environment");
}

// Initialize the connection to the database
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql); // Drizzle ORM initialized

const main = async () => {
  try {
    console.log("Starting migration...");
    await migrate(db, { migrationsFolder: "drizzle" }); // Run migrations
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error); // Log any errors
    process.exit(1); // Exit the process with failure code
  }
};

main(); // Execute the main function

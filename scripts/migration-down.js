const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readlineSync = require("readline-sync");

const downMigrationsDir = path.join(
  __dirname,
  "..",
  "supabase",
  "down_migrations"
);

function isPsqlAvailable() {
  try {
    execSync("psql --version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

function getMigrationFiles() {
  return fs
    .readdirSync(downMigrationsDir)
    .filter((file) => file.endsWith("_down.sql"))
    .sort((a, b) => b.localeCompare(a)); // Sort in descending order
}

function extractTimestamp(filename) {
  const match = filename.match(/^(\d+)_/);
  return match ? match[1] : null;
}

function runMigrationDown(file) {
  const filePath = path.join(downMigrationsDir, file);
  const timestamp = extractTimestamp(file);

  console.log(`Running down migration: ${file}`);
  try {
    if (isPsqlAvailable()) {
      // Confirm the database URL before running the migration
      const dbUrl = process.env.SUPABASE_DB_URL;
      // Extract the user, hide the password with ****, and replace the host with <hidden>
      const dbUrlWithoutPassword = dbUrl?.replace(
        /(\w.*):\/\/(\w.*)\:(\w.+)\@(\w.*)\:(\w.+)\//,
        "$1://$2:[Password_DB]@[Host_DB]:$5"
      );

      console.log(`\n\nConnecting to database:\n${dbUrlWithoutPassword}\n`);
      const confirmation = readlineSync.question(
        `Do you want to proceed with this database? (y/n): `
      );

      if (confirmation.toLowerCase() !== "y") {
        console.log("Migration cancelled by user.");
        process.exit(0);
      }

      execSync(`psql -d "${dbUrl}" -f "${filePath}"`, {
        stdio: "inherit",
      });

      // Update Supabase migration status
      execSync(`npx supabase migration repair ${timestamp} --status reverted`, {
        stdio: "inherit",
      });
    } else {
      console.error(
        "psql is not available. Please install PostgreSQL and make sure psql is in your PATH."
      );
      console.error(
        "Alternatively, you can manually run the SQL commands in the file:"
      );
      console.error(filePath);
      process.exit(1);
    }
    console.log(`Successfully ran down migration: ${file}`);
  } catch (error) {
    console.error(`Error running down migration ${file}:`, error.message);
    process.exit(1);
  }
}

function runMigrationsDown(targetTimestamp) {
  const migrationFiles = getMigrationFiles();

  for (const file of migrationFiles) {
    const timestamp = extractTimestamp(file);

    runMigrationDown(file);

    if (timestamp <= targetTimestamp) {
      console.log(`Reached target timestamp. Stopping migrations.`);
      break;
    }
  }
}

// Check if a timestamp argument is provided
let targetTimestamp = process.argv[2];

if (targetTimestamp && !/^\d+$/.test(targetTimestamp)) {
  console.error(
    "Invalid timestamp format. Please provide a numeric timestamp."
  );
  process.exit(1);
}

// If no timestamp is provided, set it to the oldest migration timestamp
if (!targetTimestamp) {
  const oldestMigration = getMigrationFiles().pop();
  targetTimestamp = extractTimestamp(oldestMigration);
  console.log(
    `No timestamp provided. Running all migrations down to the oldest: ${targetTimestamp}`
  );
}

// Check if psql is available before running migrations
if (!isPsqlAvailable()) {
  console.error(
    "psql is not available. Please install PostgreSQL and make sure psql is in your PATH."
  );
  console.error(
    "Alternatively, you can manually run the SQL commands in the down migration files located in:"
  );
  console.error(downMigrationsDir);
  process.exit(1);
}

runMigrationsDown(targetTimestamp);

// Add this at the end of the script
console.log("\nUpdated migration list:");
const updatedOutput = execSync("npx supabase migration list", {
  encoding: "utf-8",
});
console.log(updatedOutput);

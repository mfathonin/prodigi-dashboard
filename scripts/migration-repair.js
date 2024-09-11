const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getMigrationList() {
  try {
    console.log("Fetching migration list...");
    const output = execSync("npx supabase migration list", {
      encoding: "utf-8",
    });

    const lines = output.split("\n");
    const migrations = lines
      .filter((line) => line.includes("│")) // Filter lines containing the separator
      .filter((line) => !line.includes("LOCAL") && !line.includes("─────")) // Exclude header and separator lines
      .map((line) => {
        // Remove ANSI escape codes
        const cleanLine = line.replace(/\x1B\[[0-9;]*[mG]/g, "").trim();
        const [local, remote] = cleanLine.split("│").map((s) => s.trim());
        return { timestamp: local, applied: !!remote };
      });

    if (migrations.length === 0) {
      console.log("No migrations found. Check the output format.");
    }

    return migrations;
  } catch (error) {
    console.error("Error fetching migration list:", error.message);
    process.exit(1);
  }
}

function promptMigrations(migrations) {
  return new Promise((resolve) => {
    let selectedIndexes = new Set(
      migrations.map((m, i) => (m.applied ? i : -1)).filter((i) => i !== -1)
    );
    let currentIndex = 0;

    function renderMigrations() {
      console.clear();
      console.log(
        "Select migrations to mark as applied (use spacebar to toggle, enter to confirm):"
      );
      migrations.forEach((migration, index) => {
        const isSelected = selectedIndexes.has(index);
        const marker = isSelected ? "[x]" : "[ ]";
        const cursor = index === currentIndex ? ">" : " ";
        const currentStatus = migration.applied ? "applied" : "reverted";
        const newStatus = isSelected ? "applied" : "reverted";
        const statusChange =
          currentStatus !== newStatus ? ` -> ${newStatus}` : "";
        console.log(
          `${cursor} ${marker} ${migration.timestamp} (${currentStatus}${statusChange})`
        );
      });
    }

    renderMigrations();

    process.stdin.setRawMode(true);
    process.stdin.on("data", (key) => {
      const keyCode = key.toString();

      if (keyCode === "\u0020") {
        // Spacebar
        if (selectedIndexes.has(currentIndex)) {
          selectedIndexes.delete(currentIndex);
        } else {
          selectedIndexes.add(currentIndex);
        }
      } else if (keyCode === "\u001B[A" || keyCode === "k") {
        // Up arrow or 'k'
        currentIndex =
          (currentIndex - 1 + migrations.length) % migrations.length;
      } else if (keyCode === "\u001B[B" || keyCode === "j") {
        // Down arrow or 'j'
        currentIndex = (currentIndex + 1) % migrations.length;
      } else if (keyCode === "\r") {
        // Enter
        process.stdin.setRawMode(false);
        process.stdin.removeAllListeners("data");
        resolve(
          Array.from(selectedIndexes).map((i) => migrations[i].timestamp)
        );
        return;
      }

      renderMigrations();
    });
  });
}

async function main() {
  const migrations = getMigrationList();

  if (migrations.length === 0) {
    console.log("No migrations to repair. Exiting.");
    rl.close();
    return;
  }

  const selectedMigrations = await promptMigrations(migrations);

  console.clear();
  const toApply = [];
  const toRevert = [];

  for (const migration of migrations) {
    const isSelected = selectedMigrations.includes(migration.timestamp);
    if (isSelected !== migration.applied) {
      if (isSelected) {
        toApply.push(migration.timestamp);
      } else {
        toRevert.push(migration.timestamp);
      }
    }
  }

  try {
    if (toApply.length > 0) {
      execSync(
        `npx supabase migration repair ${toApply.join(" ")} --status applied`,
        { stdio: "inherit" }
      );
    }
    if (toRevert.length > 0) {
      execSync(
        `npx supabase migration repair ${toRevert.join(" ")} --status reverted`,
        { stdio: "inherit" }
      );
    }
  } catch (error) {
    console.error("Error repairing migrations:", error.message);
  }

  console.clear();
  // Print updated migration list
  console.log("Updated migration list:");
  const updatedOutput = execSync("npx supabase migration list", {
    encoding: "utf-8",
  });
  console.log(updatedOutput);

  rl.close();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  rl.close();
});

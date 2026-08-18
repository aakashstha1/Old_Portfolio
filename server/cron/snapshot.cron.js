import cron from "node-cron";
import { generateSnapshot } from "../utils/snapshot.js";

// Runs every 6 hours as a safety net (main trigger is still every write)
export const startSnapshotCron = () => {
  cron.schedule("0 */6 * * *", () => {
    console.log("Running scheduled snapshot regeneration...");
    generateSnapshot();
  });
};

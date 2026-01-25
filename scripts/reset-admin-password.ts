/**
 * Reset super admin password in Convex
 * 
 * Usage: bunx tsx scripts/reset-admin-password.ts
 */

import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import bcrypt from "bcryptjs";
import * as readline from "readline";

config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL is not set");
  process.exit(1);
}

const convex = new ConvexHttpClient(CONVEX_URL);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function resetPassword() {
  console.log("🔐 Reset Super Admin Password\n");

  // Get all admin users
  const users = await convex.query(api.adminUsers.list, {});
  
  // Filter super admins
  const superAdmins = users.filter((u: any) => u.role === "super_admin");

  if (superAdmins.length === 0) {
    console.log("❌ No super admin users found!");
    rl.close();
    return;
  }

  console.log("Super Admin accounts found:\n");
  superAdmins.forEach((admin: any, index: number) => {
    console.log(`  ${index + 1}. ${admin.email} (${admin.name})`);
  });

  const selection = await question("\nEnter the number of the account to reset (or 'q' to quit): ");
  
  if (selection.toLowerCase() === 'q') {
    console.log("Cancelled.");
    rl.close();
    return;
  }

  const selectedIndex = parseInt(selection) - 1;
  if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= superAdmins.length) {
    console.log("❌ Invalid selection.");
    rl.close();
    return;
  }

  const selectedAdmin = superAdmins[selectedIndex];
  console.log(`\nResetting password for: ${selectedAdmin.email}`);

  const newPassword = await question("Enter new password (min 6 characters): ");
  
  if (newPassword.length < 6) {
    console.log("❌ Password must be at least 6 characters.");
    rl.close();
    return;
  }

  const confirmPassword = await question("Confirm new password: ");
  
  if (newPassword !== confirmPassword) {
    console.log("❌ Passwords do not match.");
    rl.close();
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user
  await convex.mutation(api.adminUsers.update, {
    id: selectedAdmin._id,
    password: hashedPassword,
  });

  console.log(`\n✅ Password reset successfully for ${selectedAdmin.email}`);
  rl.close();
}

resetPassword();

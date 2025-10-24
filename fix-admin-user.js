import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL);

async function fixAdminUser() {
  try {
    console.log("Fixing admin user...\n");
    
    // Update the admin record with the correct Supabase User ID
    const result = await sql`
UPDATE "admin_users" 
SET "supabase_user_id" = 'b57533e8-4da0-423f-a607-8d88fba092cc'
WHERE "email" = 'hhh.3nree@gmail.com'
RETURNING *`;
    
    if (result.length === 0) {
      console.log("❌ No admin record found");
    } else {
      const admin = result[0];
      console.log("✅ Admin record updated!\n");
      console.log("Email:", admin.email);
      console.log("Supabase User ID:", admin.supabase_user_id);
      console.log("Role:", admin.role);
      console.log("Active:", admin.is_active);
      console.log("\n✅ You should now have access to all admin features!");
      console.log("Try refreshing the admin dashboard.");
    }
    
    await sql.end();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixAdminUser();

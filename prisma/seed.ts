import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import { authenticator } from "otplib";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {

  const passwordHash = await bcrypt.hash("123456", 10);

  // generate TOTP secret
  const totpSecret = authenticator.generateSecret();

  const admin = await prisma.admin.upsert({
    where: {
      email: "admin@test.com",
    },
    update: {},
    create: {
      email: "admin@test.com",
      name: "Admin",
      passwordHash,
      totpSecret,
      totpEnabled: true
    },
  });

  console.log("✅ Admin seeded:", admin.email);
  console.log("🔐 TOTP Secret:", totpSecret);

  const uri = authenticator.keyuri(
    admin.email,
    "AdminDashboard",
    totpSecret
  );

  console.log("📱 Authenticator URI:");
  console.log(uri);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding database...");

  // Create admin user with plain text password
  const existingAdmin = await db.adminUser.findFirst({
    where: { email: "admin@bloodcamp.com" },
  });

  if (!existingAdmin) {
    await db.adminUser.create({
      data: {
        email: "admin@bloodcamp.com",
        password: "admin123", // Plain text password
        name: "Admin",
      },
    });
    console.log("Admin user created:");
    console.log("  Email: admin@bloodcamp.com");
    console.log("  Password: admin123");
  } else {
    // Update existing admin with plain text password
    await db.adminUser.update({
      where: { id: existingAdmin.id },
      data: { password: "admin123" },
    });
    console.log("Admin user already exists, password updated");
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

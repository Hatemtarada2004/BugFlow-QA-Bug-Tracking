import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo users
  const adminPassword = await bcrypt.hash("admin123", 12);
  const testerPassword = await bcrypt.hash("tester123", 12);
  const devPassword = await bcrypt.hash("dev123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bugflow.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@bugflow.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const tester = await prisma.user.upsert({
    where: { email: "tester@bugflow.com" },
    update: {},
    create: {
      name: "Sarah Tester",
      email: "tester@bugflow.com",
      password: testerPassword,
      role: Role.TESTER,
    },
  });

  const developer = await prisma.user.upsert({
    where: { email: "dev@bugflow.com" },
    update: {},
    create: {
      name: "John Developer",
      email: "dev@bugflow.com",
      password: devPassword,
      role: Role.DEVELOPER,
    },
  });

  // Create demo project
  const project = await prisma.project.upsert({
    where: { id: "demo-project-001" },
    update: {},
    create: {
      id: "demo-project-001",
      name: "E-Commerce Platform",
      description: "Main e-commerce web application",
      createdById: admin.id,
    },
  });

  // Create demo bugs
  await prisma.bug.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "demo-bug-001",
        title: "Login button unresponsive on mobile",
        description:
          "The login button does not respond to tap events on iOS Safari. Users cannot log in from iPhones.",
        priority: "HIGH",
        status: "OPEN",
        severity: "MAJOR",
        stepsToReproduce:
          "1. Open the app on iPhone\n2. Enter credentials\n3. Tap Login",
        expectedResult: "User should be logged in",
        actualResult: "Nothing happens on tap",
        environment: "Safari 17 / iOS 17 / iPhone 14",
        projectId: project.id,
        createdById: tester.id,
        assignedToId: developer.id,
      },
      {
        id: "demo-bug-002",
        title: "Product images not loading in cart",
        description:
          "Thumbnail images fail to display in the shopping cart when more than 5 items are added.",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        severity: "MINOR",
        stepsToReproduce:
          "1. Add 6+ items to cart\n2. Open cart sidebar\n3. Observe images",
        expectedResult: "All product images should be visible",
        actualResult: "Images show broken icon after 5th item",
        environment: "Chrome 120 / Windows 11 / Desktop",
        projectId: project.id,
        createdById: tester.id,
        assignedToId: developer.id,
      },
      {
        id: "demo-bug-003",
        title: "Checkout crashes with invalid coupon code",
        description:
          "Entering an invalid coupon code throws an unhandled exception and crashes the checkout page.",
        priority: "CRITICAL",
        status: "OPEN",
        severity: "BLOCKER",
        stepsToReproduce:
          "1. Add item to cart\n2. Proceed to checkout\n3. Enter 'INVALID123' as coupon",
        expectedResult: "Show 'Invalid coupon' error message",
        actualResult: "White screen of death — page crashes",
        environment: "Firefox 121 / macOS 14 / MacBook Pro",
        projectId: project.id,
        createdById: tester.id,
      },
    ],
  });

  console.log("Database seeded successfully!");
  console.log("\nDemo Accounts:");
  console.log("  Admin:     admin@bugflow.com   / admin123");
  console.log("  Tester:    tester@bugflow.com  / tester123");
  console.log("  Developer: dev@bugflow.com     / dev123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

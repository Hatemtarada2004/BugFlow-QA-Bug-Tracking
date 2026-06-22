import "dotenv/config";
import { PrismaClient, Role, Priority, Status, Severity } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding BugFlow database…");

  // ── Users ──────────────────────────────────────────────────────────────────
  const h = (pw: string) => bcrypt.hash(pw, 10);

  const [admin, tester, dev, tester2, dev2] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@bugflow.com" },
      update: {},
      create: { name: "Admin User",  email: "admin@bugflow.com",   password: await h("admin123"),  role: Role.ADMIN },
    }),
    prisma.user.upsert({
      where: { email: "tester@bugflow.com" },
      update: {},
      create: { name: "Sara Tester", email: "tester@bugflow.com",  password: await h("tester123"), role: Role.TESTER },
    }),
    prisma.user.upsert({
      where: { email: "dev@bugflow.com" },
      update: {},
      create: { name: "Omar Dev",    email: "dev@bugflow.com",     password: await h("dev123456"), role: Role.DEVELOPER },
    }),
    prisma.user.upsert({
      where: { email: "tester2@bugflow.com" },
      update: {},
      create: { name: "Lina QA",     email: "tester2@bugflow.com", password: await h("tester123"), role: Role.TESTER },
    }),
    prisma.user.upsert({
      where: { email: "dev2@bugflow.com" },
      update: {},
      create: { name: "Khaled Dev",  email: "dev2@bugflow.com",    password: await h("dev123456"), role: Role.DEVELOPER },
    }),
  ]);

  console.log("✅ Users seeded (5)");

  // ── Projects ───────────────────────────────────────────────────────────────
  const [ecom, mobile, adminPanel, apiGw] = await Promise.all([
    prisma.project.upsert({
      where: { id: "proj-ecommerce" },
      update: {},
      create: {
        id: "proj-ecommerce",
        name: "E-Commerce Platform",
        description: "Full-stack online shopping platform with cart, checkout, and Stripe payment integration.",
        createdById: admin.id,
      },
    }),
    prisma.project.upsert({
      where: { id: "proj-mobile" },
      update: {},
      create: {
        id: "proj-mobile",
        name: "Mobile App (iOS/Android)",
        description: "React Native mobile client for browsing products and tracking orders.",
        createdById: admin.id,
      },
    }),
    prisma.project.upsert({
      where: { id: "proj-admin" },
      update: {},
      create: {
        id: "proj-admin",
        name: "Admin Dashboard",
        description: "Internal dashboard for managing products, users, orders, and analytics.",
        createdById: admin.id,
      },
    }),
    prisma.project.upsert({
      where: { id: "proj-api" },
      update: {},
      create: {
        id: "proj-api",
        name: "API Gateway",
        description: "Central API gateway for routing, rate-limiting, and auth across microservices.",
        createdById: admin.id,
      },
    }),
  ]);

  console.log("✅ Projects seeded (4)");

  // ── Bugs ───────────────────────────────────────────────────────────────────
  type BugSeed = {
    id: string; title: string; description: string;
    priority: Priority; status: Status; severity: Severity;
    environment: string;
    stepsToReproduce?: string; expectedResult?: string; actualResult?: string;
    projectId: string; createdById: string; assignedToId?: string;
  };

  const bugs: BugSeed[] = [
    // ── E-Commerce ──────────────────────────────────────────────────────────
    {
      id: "bug-001",
      title: "Checkout crashes when applying expired coupon code",
      description: "When a user enters an expired coupon at checkout, the page crashes with an unhandled promise rejection instead of showing a friendly error.",
      priority: Priority.CRITICAL, status: Status.IN_PROGRESS, severity: Severity.BLOCKER,
      environment: "Production · Chrome 125 · Windows 11",
      stepsToReproduce: "1. Add any item to cart\n2. Proceed to checkout\n3. Enter coupon code 'SUMMER2023'\n4. Click Apply",
      expectedResult: "Show inline error: 'This coupon has expired'",
      actualResult: "White screen with console error: TypeError: Cannot read properties of null",
      projectId: ecom.id, createdById: tester.id, assignedToId: dev.id,
    },
    {
      id: "bug-002",
      title: "Product images not loading on slow 3G connections",
      description: "Product images fail to load on slow connections with no fallback placeholder, leaving empty white rectangles across the listing page.",
      priority: Priority.HIGH, status: Status.OPEN, severity: Severity.MAJOR,
      environment: "Staging · All browsers · Mobile (throttled 3G)",
      stepsToReproduce: "1. Open Chrome DevTools → Network → Slow 3G\n2. Navigate to any product listing page",
      expectedResult: "Skeleton/placeholder shown until image loads",
      actualResult: "Empty white rectangle, no loading indicator",
      projectId: ecom.id, createdById: tester.id, assignedToId: dev2.id,
    },
    {
      id: "bug-003",
      title: "Cart item count badge shows stale value after removal",
      description: "After removing an item from the cart, the header badge still shows the old count until the page is manually refreshed.",
      priority: Priority.MEDIUM, status: Status.FIXED, severity: Severity.MINOR,
      environment: "Production · All browsers",
      projectId: ecom.id, createdById: tester2.id, assignedToId: dev.id,
    },
    {
      id: "bug-004",
      title: "Payment gateway timeout not handled gracefully",
      description: "When Stripe's API takes more than 10 seconds to respond, the user sees a generic network error with no retry option or guidance.",
      priority: Priority.CRITICAL, status: Status.OPEN, severity: Severity.CRITICAL,
      environment: "Production · All browsers",
      stepsToReproduce: "1. Add item to cart\n2. Enter valid card details\n3. Submit payment while throttling network to simulate timeout",
      expectedResult: "'Payment is taking longer than expected. Please try again.'",
      actualResult: "Generic 'Network Error' toast with no retry option",
      projectId: ecom.id, createdById: admin.id, assignedToId: dev2.id,
    },
    {
      id: "bug-005",
      title: "Search results not sorted correctly by price",
      description: "When sorting products by 'Price: Low to High', results are sorted alphabetically (string comparison) instead of numerically.",
      priority: Priority.MEDIUM, status: Status.OPEN, severity: Severity.MAJOR,
      environment: "Production · All browsers",
      projectId: ecom.id, createdById: tester.id,
    },
    {
      id: "bug-006",
      title: "Order confirmation email contains unrendered template variables",
      description: "The confirmation email after purchase has broken HTML — all CSS is stripped and variables like {{customerName}} appear as raw text.",
      priority: Priority.HIGH, status: Status.IN_PROGRESS, severity: Severity.MAJOR,
      environment: "Production · All email clients",
      stepsToReproduce: "1. Complete a purchase\n2. Check inbox for confirmation email",
      expectedResult: "Formatted HTML email with customer name and order summary",
      actualResult: "Plain text with unrendered {{customerName}} placeholders",
      projectId: ecom.id, createdById: tester2.id, assignedToId: dev.id,
    },
    {
      id: "bug-007",
      title: "Discount percentage rounds incorrectly on .5 values",
      description: "A 15.5% discount on a $100 item shows $85 instead of $84.50 due to incorrect Math.round() usage in the pricing engine.",
      priority: Priority.LOW, status: Status.CLOSED, severity: Severity.MINOR,
      environment: "Production",
      projectId: ecom.id, createdById: tester.id, assignedToId: dev2.id,
    },

    // ── Mobile App ───────────────────────────────────────────────────────────
    {
      id: "bug-008",
      title: "App crashes on launch on Android 12 (API level 31)",
      description: "The application immediately crashes after the splash screen on Android 12 devices. Works correctly on Android 13+.",
      priority: Priority.CRITICAL, status: Status.IN_PROGRESS, severity: Severity.BLOCKER,
      environment: "Production · Android 12 (API 31) · Samsung Galaxy S21",
      stepsToReproduce: "1. Install APK on Android 12 device\n2. Launch the app\n3. Observe crash after splash screen",
      expectedResult: "App loads to home screen",
      actualResult: "App crashes immediately — 'App stopped' system dialog appears",
      projectId: mobile.id, createdById: tester.id, assignedToId: dev2.id,
    },
    {
      id: "bug-009",
      title: "Push notifications not received when app is in background (iOS)",
      description: "Push notifications for order status updates are not delivered when the app is backgrounded or killed on iOS.",
      priority: Priority.HIGH, status: Status.OPEN, severity: Severity.CRITICAL,
      environment: "Production · iOS 17 · iPhone 14 Pro",
      projectId: mobile.id, createdById: tester2.id, assignedToId: dev.id,
    },
    {
      id: "bug-010",
      title: "Biometric auth fallback bypasses PIN validation",
      description: "Critical security bug: when biometric auth fails 3 times and falls back to PIN entry, any PIN is accepted regardless of the registered PIN.",
      priority: Priority.CRITICAL, status: Status.OPEN, severity: Severity.BLOCKER,
      environment: "Production · iOS 16+ and Android 11+",
      stepsToReproduce: "1. Enable biometric auth\n2. Fail fingerprint scan 3 times\n3. Enter any random 4-digit PIN",
      expectedResult: "Only the registered PIN should grant access",
      actualResult: "Any PIN bypasses authentication",
      projectId: mobile.id, createdById: admin.id, assignedToId: dev2.id,
    },
    {
      id: "bug-011",
      title: "Dark mode preference resets after app restart",
      description: "User's dark mode setting is not persisted to local storage. Every time the app restarts, it reverts to light mode.",
      priority: Priority.LOW, status: Status.FIXED, severity: Severity.MINOR,
      environment: "Production · iOS and Android",
      projectId: mobile.id, createdById: tester.id, assignedToId: dev.id,
    },
    {
      id: "bug-012",
      title: "Search input loses focus after typing first character",
      description: "On Android physical devices, the search field loses keyboard focus after the first character is entered, making search unusable.",
      priority: Priority.MEDIUM, status: Status.OPEN, severity: Severity.MAJOR,
      environment: "Production · Android 11+ · Physical devices only (not emulator)",
      projectId: mobile.id, createdById: tester2.id,
    },

    // ── Admin Dashboard ───────────────────────────────────────────────────────
    {
      id: "bug-013",
      title: "Bulk user deletion doesn't refresh the count in the header",
      description: "After selecting multiple users and clicking 'Delete Selected', the total count shown in the page header doesn't update until hard reload.",
      priority: Priority.MEDIUM, status: Status.FIXED, severity: Severity.MINOR,
      environment: "Staging · Chrome · Windows",
      projectId: adminPanel.id, createdById: tester.id, assignedToId: dev.id,
    },
    {
      id: "bug-014",
      title: "Revenue chart shows $0 for February regardless of actual data",
      description: "The monthly revenue chart always shows $0 for February. All other months display correctly. Likely an off-by-one error in month indexing.",
      priority: Priority.HIGH, status: Status.IN_PROGRESS, severity: Severity.CRITICAL,
      environment: "Production · All browsers",
      stepsToReproduce: "1. Log in as admin\n2. Navigate to Analytics → Revenue\n3. Select 'This Year' timeframe\n4. Observe February bar",
      expectedResult: "February shows actual revenue (e.g. $42,500)",
      actualResult: "February always shows $0",
      projectId: adminPanel.id, createdById: admin.id, assignedToId: dev2.id,
    },
    {
      id: "bug-015",
      title: "Export to Excel generates a corrupt file",
      description: "Clicking 'Export to Excel' on the Orders table downloads a file that Excel refuses to open with 'File format or extension is not valid'.",
      priority: Priority.HIGH, status: Status.OPEN, severity: Severity.MAJOR,
      environment: "Production · Chrome · Microsoft Excel 2021",
      projectId: adminPanel.id, createdById: tester2.id, assignedToId: dev.id,
    },
    {
      id: "bug-016",
      title: "Admin session expires silently without redirecting to login",
      description: "When the JWT expires, API calls begin failing with 401 errors in the console, but the UI shows no notification and doesn't redirect to login.",
      priority: Priority.HIGH, status: Status.OPEN, severity: Severity.MAJOR,
      environment: "Production · All browsers",
      projectId: adminPanel.id, createdById: tester.id,
    },
    {
      id: "bug-017",
      title: "Product category dropdown shows duplicate options",
      description: "The category filter in the Products table lists the same category multiple times (e.g., 'Electronics' appears 3 times).",
      priority: Priority.LOW, status: Status.CLOSED, severity: Severity.TRIVIAL,
      environment: "Production · All browsers",
      projectId: adminPanel.id, createdById: tester2.id, assignedToId: dev2.id,
    },
    {
      id: "bug-018",
      title: "Avatar upload accepts SVG files with embedded JavaScript (XSS)",
      description: "The profile avatar upload endpoint stores SVG files containing JavaScript without sanitization, resulting in stored XSS that executes when any admin views the user's profile.",
      priority: Priority.CRITICAL, status: Status.IN_PROGRESS, severity: Severity.BLOCKER,
      environment: "Production · All browsers",
      stepsToReproduce: "1. Upload an SVG containing <script>alert('XSS')</script>\n2. Ask an admin to view your profile",
      expectedResult: "SVG files should be sanitized or rejected with 400",
      actualResult: "SVG stored and served as-is; script executes in admin's browser",
      projectId: adminPanel.id, createdById: admin.id, assignedToId: dev.id,
    },

    // ── API Gateway ───────────────────────────────────────────────────────────
    {
      id: "bug-019",
      title: "Rate limiter counter never resets — permanent ban after first cap",
      description: "The rate limiter allows 100 requests/minute but the Redis TTL is never set, so the counter never expires. Users become permanently rate-limited after hitting the limit once.",
      priority: Priority.CRITICAL, status: Status.OPEN, severity: Severity.BLOCKER,
      environment: "Production · All clients",
      stepsToReproduce: "1. Send 101 requests in under 60 seconds\n2. Wait 5 minutes\n3. Send another request",
      expectedResult: "After 60 seconds, counter resets and request succeeds with 200",
      actualResult: "Request permanently blocked with 429 Too Many Requests",
      projectId: apiGw.id, createdById: tester.id, assignedToId: dev2.id,
    },
    {
      id: "bug-020",
      title: "CORS headers missing on 4xx error responses",
      description: "When the API returns a 4xx error, CORS headers are stripped, causing browser clients to receive an opaque network error rather than the actual error message.",
      priority: Priority.HIGH, status: Status.FIXED, severity: Severity.MAJOR,
      environment: "Production · Browser clients only",
      projectId: apiGw.id, createdById: admin.id, assignedToId: dev.id,
    },
    {
      id: "bug-021",
      title: "JWT middleware accepts tokens signed with 'none' algorithm",
      description: "Critical: the JWT verification middleware doesn't restrict allowed algorithms. Attackers can forge tokens using alg:'none' (no signature required).",
      priority: Priority.CRITICAL, status: Status.FIXED, severity: Severity.BLOCKER,
      environment: "Production · All clients",
      stepsToReproduce: "1. Create a JWT with alg:'none' and any userId in payload\n2. Send it in the Authorization header\n3. Request succeeds as that user",
      expectedResult: "401 Unauthorized — 'none' algorithm must be rejected",
      actualResult: "Request succeeds — authentication fully bypassed",
      projectId: apiGw.id, createdById: admin.id, assignedToId: dev2.id,
    },
    {
      id: "bug-022",
      title: "Health check endpoint exposes environment variables",
      description: "GET /health returns the full process.env object in the response body, leaking DATABASE_URL, JWT_SECRET, and all API keys to anyone who calls it.",
      priority: Priority.CRITICAL, status: Status.CLOSED, severity: Severity.CRITICAL,
      environment: "Production",
      projectId: apiGw.id, createdById: tester2.id, assignedToId: dev.id,
    },
    {
      id: "bug-023",
      title: "Request logger silently truncates payloads larger than 1 KB",
      description: "The request logging middleware silently truncates request bodies beyond 1 KB, making debugging of larger payloads impossible without disabling logging.",
      priority: Priority.LOW, status: Status.OPEN, severity: Severity.MINOR,
      environment: "All environments",
      projectId: apiGw.id, createdById: dev2.id,
    },
    {
      id: "bug-024",
      title: "Retry logic creates duplicate orders on network flap",
      description: "On transient network errors, the retry middleware resends the original POST request without idempotency keys, creating 2-3 duplicate orders per checkout attempt.",
      priority: Priority.HIGH, status: Status.IN_PROGRESS, severity: Severity.CRITICAL,
      environment: "Production · Unstable network conditions",
      stepsToReproduce: "1. Add item to cart and reach payment step\n2. Submit order\n3. Kill network connection mid-flight, restore after 2 seconds\n4. Check orders table in admin",
      expectedResult: "Exactly one order created per checkout",
      actualResult: "2-3 duplicate orders created with different IDs",
      projectId: apiGw.id, createdById: tester.id, assignedToId: dev2.id,
    },
    {
      id: "bug-025",
      title: "Swagger docs expose internal Kubernetes service DNS names",
      description: "The auto-generated Swagger UI lists internal k8s service hostnames and port numbers in the server dropdown, leaking internal network topology.",
      priority: Priority.MEDIUM, status: Status.CLOSED, severity: Severity.MINOR,
      environment: "Production · /api-docs endpoint",
      projectId: apiGw.id, createdById: admin.id,
    },
  ];

  for (const b of bugs) {
    await prisma.bug.upsert({ where: { id: b.id }, update: {}, create: b });
  }

  console.log(`✅ Bugs seeded (${bugs.length})`);

  // ── Activity Logs ──────────────────────────────────────────────────────────
  const logs = [
    { bugId: "bug-001", userId: tester.id,  action: "BUG_CREATED" },
    { bugId: "bug-001", userId: admin.id,   action: "PRIORITY_CHANGED", detail: "MEDIUM → CRITICAL" },
    { bugId: "bug-001", userId: admin.id,   action: "ASSIGNED" },
    { bugId: "bug-001", userId: dev.id,     action: "STATUS_CHANGED",   detail: "OPEN → IN_PROGRESS" },
    { bugId: "bug-002", userId: tester.id,  action: "BUG_CREATED" },
    { bugId: "bug-002", userId: admin.id,   action: "ASSIGNED" },
    { bugId: "bug-003", userId: tester2.id, action: "BUG_CREATED" },
    { bugId: "bug-003", userId: dev.id,     action: "STATUS_CHANGED",   detail: "OPEN → FIXED" },
    { bugId: "bug-004", userId: admin.id,   action: "BUG_CREATED" },
    { bugId: "bug-004", userId: admin.id,   action: "ASSIGNED" },
    { bugId: "bug-006", userId: tester2.id, action: "BUG_CREATED" },
    { bugId: "bug-006", userId: admin.id,   action: "ASSIGNED" },
    { bugId: "bug-006", userId: dev.id,     action: "STATUS_CHANGED",   detail: "OPEN → IN_PROGRESS" },
    { bugId: "bug-008", userId: tester.id,  action: "BUG_CREATED" },
    { bugId: "bug-008", userId: admin.id,   action: "SEVERITY_CHANGED", detail: "MAJOR → BLOCKER" },
    { bugId: "bug-008", userId: dev2.id,    action: "STATUS_CHANGED",   detail: "OPEN → IN_PROGRESS" },
    { bugId: "bug-010", userId: admin.id,   action: "BUG_CREATED" },
    { bugId: "bug-010", userId: admin.id,   action: "PRIORITY_CHANGED", detail: "HIGH → CRITICAL" },
    { bugId: "bug-013", userId: tester.id,  action: "BUG_CREATED" },
    { bugId: "bug-013", userId: dev.id,     action: "STATUS_CHANGED",   detail: "OPEN → FIXED" },
    { bugId: "bug-014", userId: admin.id,   action: "BUG_CREATED" },
    { bugId: "bug-014", userId: admin.id,   action: "ASSIGNED" },
    { bugId: "bug-014", userId: dev2.id,    action: "STATUS_CHANGED",   detail: "OPEN → IN_PROGRESS" },
    { bugId: "bug-018", userId: admin.id,   action: "BUG_CREATED" },
    { bugId: "bug-018", userId: admin.id,   action: "ASSIGNED" },
    { bugId: "bug-018", userId: dev.id,     action: "STATUS_CHANGED",   detail: "OPEN → IN_PROGRESS" },
    { bugId: "bug-019", userId: tester.id,  action: "BUG_CREATED" },
    { bugId: "bug-019", userId: admin.id,   action: "SEVERITY_CHANGED", detail: "CRITICAL → BLOCKER" },
    { bugId: "bug-019", userId: admin.id,   action: "ASSIGNED" },
    { bugId: "bug-020", userId: admin.id,   action: "BUG_CREATED" },
    { bugId: "bug-020", userId: dev.id,     action: "STATUS_CHANGED",   detail: "OPEN → FIXED" },
    { bugId: "bug-021", userId: admin.id,   action: "BUG_CREATED" },
    { bugId: "bug-021", userId: admin.id,   action: "PRIORITY_CHANGED", detail: "HIGH → CRITICAL" },
    { bugId: "bug-021", userId: dev2.id,    action: "STATUS_CHANGED",   detail: "OPEN → FIXED" },
    { bugId: "bug-022", userId: tester2.id, action: "BUG_CREATED" },
    { bugId: "bug-022", userId: dev.id,     action: "STATUS_CHANGED",   detail: "OPEN → FIXED" },
    { bugId: "bug-022", userId: admin.id,   action: "STATUS_CHANGED",   detail: "FIXED → CLOSED" },
    { bugId: "bug-024", userId: tester.id,  action: "BUG_CREATED" },
    { bugId: "bug-024", userId: admin.id,   action: "ASSIGNED" },
    { bugId: "bug-024", userId: dev2.id,    action: "STATUS_CHANGED",   detail: "OPEN → IN_PROGRESS" },
  ];

  for (const log of logs) {
    await prisma.activityLog.create({ data: log });
  }

  console.log(`✅ Activity logs seeded (${logs.length})`);

  // ── Comments ───────────────────────────────────────────────────────────────
  const comments = [
    { bugId: "bug-001", authorId: dev.id,    content: "Reproduced locally. The couponValidator middleware throws instead of returning a 400 response. Fix incoming." },
    { bugId: "bug-001", authorId: tester.id, content: "Confirmed — affects all expired coupons, not just SUMMER2023. WINTER2024 also crashes." },
    { bugId: "bug-001", authorId: dev.id,    content: "Fix ready on branch fix/coupon-validation. Added proper try/catch and returning 400 with user-friendly message." },
    { bugId: "bug-002", authorId: dev2.id,   content: "Using Intersection Observer with a blurred placeholder as interim fix. Proper lazy loading will be in next sprint." },
    { bugId: "bug-002", authorId: tester.id, content: "The placeholder looks great! But we also need it for the product detail page hero image." },
    { bugId: "bug-004", authorId: admin.id,  content: "This is a revenue blocker — deprioritize everything else this sprint until this is resolved." },
    { bugId: "bug-004", authorId: dev2.id,   content: "Adding 15-second client-side timeout with automatic retry and a spinner. Also adding a Stripe webhook for reliable confirmation." },
    { bugId: "bug-006", authorId: dev.id,    content: "The template engine was updated last week and the variable syntax changed from {{var}} to {var}. Fixing the templates now." },
    { bugId: "bug-006", authorId: tester2.id, content: "Also noticed the order total shows '0.00' in the email — the `amount` binding is broken too." },
    { bugId: "bug-008", authorId: dev2.id,   content: "Root cause found: Android 12 changed background process scheduling and our foreground service declaration is missing the required type attribute." },
    { bugId: "bug-008", authorId: tester.id, content: "This affects 23% of our Android user base per Play Console. 1-star reviews are coming in. Please escalate." },
    { bugId: "bug-008", authorId: dev2.id,   content: "Fix committed. Adding type='dataSync' to the foreground service declaration in AndroidManifest.xml." },
    { bugId: "bug-010", authorId: admin.id,  content: "CRITICAL SECURITY BUG. Escalating to P0 immediately. This needs a hotfix today — no exceptions." },
    { bugId: "bug-010", authorId: dev2.id,   content: "Found two separate bugs: (1) PIN comparison uses == instead of constant-time comparison, (2) fallback PIN is compared against undefined. Both must be fixed." },
    { bugId: "bug-010", authorId: tester.id, content: "Confirmed: entering '0000' on an account with PIN '9999' grants full access. Reproduced on iPhone 13 and Galaxy S22." },
    { bugId: "bug-014", authorId: dev2.id,   content: "Found it — JavaScript's Date months are 0-indexed. We're passing month 1 (February) but the chart expects 0-indexed, so it's fetching January data and displaying nothing for Feb." },
    { bugId: "bug-014", authorId: admin.id,  content: "This has been wrong since January — we've been showing wrong revenue for 2 months. Fix and deploy today." },
    { bugId: "bug-018", authorId: admin.id,  content: "Security advisory: this is a stored XSS vulnerability. Scope currently limited to admin-viewed profiles. Classifying as P0/Blocker." },
    { bugId: "bug-018", authorId: dev.id,    content: "Adding server-side SVG sanitization using DOMPurify. Also adding Content-Security-Policy: script-src 'self' header to all responses." },
    { bugId: "bug-018", authorId: tester.id, content: "Penetration test confirmed: the XSS payload can steal admin session cookies. We should also rotate all admin sessions after the fix." },
    { bugId: "bug-021", authorId: admin.id,  content: "This is a CVE-level vulnerability. All JWTs in the system must be invalidated after the fix is deployed." },
    { bugId: "bug-021", authorId: dev2.id,   content: "Fixed by passing { algorithms: ['HS256'] } to jsonwebtoken.verify(). The 'none' algorithm is now explicitly rejected." },
    { bugId: "bug-024", authorId: tester.id, content: "Reproduced consistently: cancel network mid-checkout and restore — always creates 2 orders. Used Fiddler to intercept the duplicate POST requests." },
    { bugId: "bug-024", authorId: dev2.id,   content: "Implementing idempotency keys using a SHA-256 hash of (userId + cartId + timestamp_bucket). The retry will send the same key and the server will deduplicate." },
    { bugId: "bug-024", authorId: admin.id,  content: "Until fixed, I'm manually cancelling duplicate orders daily. We have ~15 duplicates per day. Need this fixed this week." },
  ];

  for (const c of comments) {
    await prisma.comment.create({ data: c });
  }

  console.log(`✅ Comments seeded (${comments.length})`);

  console.log("\n🎉 BugFlow database seeded successfully!");
  console.log("─────────────────────────────────────────");
  console.log("Demo accounts:");
  console.log("  admin@bugflow.com   / admin123   (Admin)");
  console.log("  tester@bugflow.com  / tester123  (Tester)");
  console.log("  dev@bugflow.com     / dev123456  (Developer)");
  console.log("─────────────────────────────────────────");
  console.log(`  ${bugs.length} bugs · 4 projects · 5 users`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

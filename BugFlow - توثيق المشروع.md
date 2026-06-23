# BugFlow — توثيق المشروع الشامل

> **نوع المشروع:** تطبيق ويب كامل (Full-Stack Web Application)
> **تاريخ الانتهاء:** يونيو 2026
> **GitHub:** https://github.com/Hatemtarada2004/BugFlow-QA-Bug-Tracking

---

## ما هو BugFlow؟

BugFlow هو نظام متكامل لتتبع الأخطاء البرمجية (Bug Tracking System) مشابه لأدوات مثل Jira وLinear. يتيح لفرق ضمان الجودة (QA) والمطورين ومدراء المشاريع إدارة الأخطاء البرمجية بشكل منظم وقابل للقياس عبر واجهة ويب احترافية.

المشروع مبني من الصفر بدون استخدام قوالب جاهزة، ويغطي كل طبقات التطوير: قاعدة البيانات، الـ API، وواجهة المستخدم.

---

## التقنيات المستخدمة

### الـ Frontend (واجهة المستخدم)

| التقنية | الإصدار | الاستخدام |
|---|---|---|
| **React** | 19 | بناء واجهة المستخدم بمكونات تفاعلية |
| **TypeScript** | 5.x | كتابة كود آمن النوع بدون أخطاء runtime |
| **Tailwind CSS** | v4 | تصميم الواجهة بدون ملفات CSS منفصلة |
| **React Router** | v7 | التنقل بين الصفحات (SPA routing) |
| **Recharts** | 2.x | رسم البيانات البيانية (charts) |
| **React Hook Form** | 7.x | إدارة النماذج (forms) بأداء عالي |
| **Zod** | 4.x | التحقق من صحة البيانات في الـ frontend |
| **Axios** | 1.x | إرسال الطلبات إلى الـ API |
| **react-i18next** | 15.x | دعم اللغتين العربية والإنجليزية |

### الـ Backend (الخادم)

| التقنية | الإصدار | الاستخدام |
|---|---|---|
| **Node.js** | 20+ | بيئة تشغيل الـ JavaScript على السيرفر |
| **Express** | 5.x | إطار عمل الـ API |
| **TypeScript** | 5.x | كتابة الـ backend بأمان |
| **Prisma ORM** | 5.x | التعامل مع قاعدة البيانات |
| **PostgreSQL** | 17 | قاعدة البيانات الرئيسية |
| **JWT (jsonwebtoken)** | 9.x | نظام المصادقة والتوثيق |
| **bcryptjs** | 3.x | تشفير كلمات المرور |
| **Multer** | 2.x | رفع الملفات |
| **Nodemailer** | 9.x | إرسال الإيميلات |
| **Zod** | 4.x | التحقق من صحة طلبات الـ API |

### أدوات أخرى

| التقنية | الاستخدام |
|---|---|
| **Playwright** | اختبارات E2E تلقائية |
| **Nodemon** | إعادة تشغيل السيرفر تلقائياً عند التعديل |
| **ts-node** | تشغيل TypeScript مباشرة بدون compile |
| **Git + GitHub** | إدارة الكود ونشره |

---

## هيكل المشروع

```
BugFlow/
│
├── backend/                     ← الخادم (Node.js + Express)
│   ├── prisma/
│   │   ├── schema.prisma        ← تعريف الجداول والعلاقات
│   │   └── seed.ts              ← بيانات تجريبية (25 bug، 4 projects)
│   │
│   ├── src/
│   │   ├── app.ts               ← نقطة الدخول الرئيسية
│   │   ├── controllers/         ← منطق معالجة الطلبات
│   │   │   ├── auth.controller.ts
│   │   │   ├── bug.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── comment.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── attachment.controller.ts
│   │   ├── routes/              ← تعريف الـ endpoints
│   │   ├── middleware/          ← طبقات الحماية
│   │   │   ├── auth.middleware.ts    ← التحقق من الـ JWT
│   │   │   ├── role.middleware.ts    ← التحقق من الصلاحيات
│   │   │   └── error.middleware.ts   ← معالجة الأخطاء العامة
│   │   ├── validators/          ← مخططات Zod للتحقق من البيانات
│   │   ├── lib/
│   │   │   ├── prisma.ts        ← اتصال قاعدة البيانات (singleton)
│   │   │   ├── activity.ts      ← تسجيل سجل النشاط
│   │   │   ├── upload.ts        ← إعداد Multer لرفع الملفات
│   │   │   └── mailer.ts        ← إعداد Nodemailer للإيميل
│   │   └── utils/
│   │       └── jwt.ts           ← توليد والتحقق من الـ JWT
│   └── uploads/                 ← مجلد الملفات المرفوعة
│
├── frontend/                    ← واجهة المستخدم (React)
│   ├── src/
│   │   ├── main.tsx             ← نقطة الدخول
│   │   ├── App.tsx              ← تعريف الـ routes
│   │   ├── context/
│   │   │   └── AuthContext.tsx  ← إدارة حالة المستخدم عبر التطبيق
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx  ← القائمة الجانبية (تتضمن Dark Mode)
│   │   │   │   └── AppLayout.tsx ← الهيكل العام للتطبيق
│   │   │   └── ui/              ← مكونات قابلة لإعادة الاستخدام
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Spinner.tsx
│   │   │       └── Skeleton.tsx ← تحميل هيكلي احترافي
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── bugs/
│   │   │   │   ├── BugsListPage.tsx
│   │   │   │   ├── BugDetailPage.tsx
│   │   │   │   └── BugFormPage.tsx
│   │   │   ├── projects/
│   │   │   │   └── ProjectsPage.tsx
│   │   │   ├── admin/
│   │   │   │   └── UsersPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── hooks/
│   │   │   └── useDarkMode.ts   ← hook مخصص للوضع الليلي
│   │   ├── services/
│   │   │   └── api.ts           ← Axios instance مع الـ token تلقائياً
│   │   ├── types/
│   │   │   └── index.ts         ← TypeScript interfaces لكل الكيانات
│   │   └── i18n/                ← ملفات الترجمة (EN/AR)
│   └── index.html               ← يتضمن script لمنع وميض الوضع الليلي
│
└── e2e/                         ← اختبارات Playwright
    ├── tests/
    │   ├── auth.spec.ts         ← 5 اختبارات للمصادقة
    │   ├── bugs.spec.ts         ← 5 اختبارات لإدارة الـ bugs
    │   └── dashboard.spec.ts    ← 4 اختبارات للـ dashboard
    └── playwright.config.ts
```

---

## قاعدة البيانات — النماذج والعلاقات

### الجداول (Models)

#### `User` — المستخدم
```
id, name, email (unique), password (hashed), role, createdAt, updatedAt
```
- **Role**: `ADMIN` | `TESTER` | `DEVELOPER`
- العلاقات: ينشئ bugs، يُسند إليه bugs، يكتب comments، يملك projects

#### `Project` — المشروع
```
id, name, description, createdById, createdAt, updatedAt
```
- كل bug يجب أن ينتمي إلى project
- العلاقات: يحتوي على bugs متعددة

#### `Bug` — الخطأ البرمجي
```
id, title, description, priority, status, severity,
stepsToReproduce, expectedResult, actualResult, environment,
projectId, createdById, assignedToId, createdAt, updatedAt
```
- **Priority**: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
- **Status**: `OPEN` | `IN_PROGRESS` | `FIXED` | `CLOSED`
- **Severity**: `TRIVIAL` | `MINOR` | `MAJOR` | `CRITICAL` | `BLOCKER`

#### `Comment` — التعليق
```
id, content, bugId, authorId, createdAt
```
- يُحذف تلقائياً عند حذف الـ bug (Cascade Delete)

#### `ActivityLog` — سجل النشاط
```
id, action, detail, bugId, userId, createdAt
```
- يُسجَّل تلقائياً عند: إنشاء bug، تغيير الحالة، تغيير الأولوية، الإسناد، إضافة تعليق، رفع ملف

#### `Attachment` — المرفق
```
id, filename, originalName, mimeType, size, bugId, uploadedById, createdAt
```
- يُحذف تلقائياً عند حذف الـ bug (Cascade Delete)

---

## الـ API Endpoints

جميع الـ endpoints محمية بـ JWT ما عدا `/auth/login` و `/auth/register`.

### المصادقة — `/api/auth`

| الطريقة | الـ Endpoint | الوصف | الصلاحية |
|---|---|---|---|
| `POST` | `/register` | تسجيل مستخدم جديد | عام |
| `POST` | `/login` | تسجيل الدخول والحصول على JWT | عام |
| `GET` | `/me` | بيانات المستخدم الحالي | مسجّل دخول |

**كيف تعمل المصادقة:**
1. المستخدم يرسل email + password
2. الـ backend يتحقق من الـ email ويقارن الـ password المشفر بـ bcrypt
3. عند النجاح، يُولَّد JWT يحتوي `id`, `name`, `email`, `role` مع صلاحية 7 أيام
4. الـ frontend يخزن الـ JWT في localStorage
5. كل طلب لاحق يرسل الـ JWT في Header: `Authorization: Bearer <token>`
6. الـ `authenticate` middleware يتحقق من الـ token قبل كل endpoint محمي

---

### الـ Bugs — `/api/bugs`

| الطريقة | الـ Endpoint | الوصف | الصلاحية |
|---|---|---|---|
| `GET` | `/` | قائمة الـ bugs مع filters وpagination | جميع المسجّلين |
| `GET` | `/stats` | إحصائيات الـ dashboard | جميع المسجّلين |
| `GET` | `/:id` | تفاصيل bug واحد مع تعليقاته | جميع المسجّلين |
| `GET` | `/:id/activity` | سجل النشاط لـ bug معين | جميع المسجّلين |
| `POST` | `/` | إنشاء bug جديد | ADMIN, TESTER |
| `PUT` | `/:id` | تعديل bug | ADMIN, TESTER (كامل)، DEVELOPER (status فقط) |
| `DELETE` | `/:id` | حذف bug | ADMIN أو صاحب الـ bug |

**البحث والفلترة في `GET /bugs`:**
يقبل query parameters: `search`, `status`, `priority`, `severity`, `projectId`, `sortOrder`, `page`, `limit`

مثال: `/api/bugs?status=OPEN&priority=HIGH&search=login&page=1&limit=20`

الـ backend يبني Prisma `where` object ديناميكياً ويُنفّذ استعلامَين بالتوازي: واحد للبيانات وواحد للعدد الكلي.

---

### المشاريع — `/api/projects`

| الطريقة | الـ Endpoint | الوصف | الصلاحية |
|---|---|---|---|
| `GET` | `/` | قائمة المشاريع | جميع المسجّلين |
| `POST` | `/` | إنشاء مشروع | ADMIN, TESTER |
| `PUT` | `/:id` | تعديل مشروع | ADMIN, صاحب المشروع |
| `DELETE` | `/:id` | حذف مشروع | ADMIN فقط |

---

### التعليقات — `/api/comments`

| الطريقة | الـ Endpoint | الوصف | الصلاحية |
|---|---|---|---|
| `POST` | `/:bugId` | إضافة تعليق | جميع المسجّلين |
| `DELETE` | `/:id` | حذف تعليق | صاحب التعليق أو ADMIN |

عند إضافة تعليق، يُسجَّل تلقائياً `COMMENT_ADDED` في سجل النشاط.

---

### الملفات المرفقة — `/api/attachments`

| الطريقة | الـ Endpoint | الوصف | الصلاحية |
|---|---|---|---|
| `GET` | `/:bugId` | قائمة مرفقات bug | جميع المسجّلين |
| `POST` | `/:bugId` | رفع ملف | جميع المسجّلين |
| `DELETE` | `/:id` | حذف ملف | صاحبه أو ADMIN |

**الملفات المسموح بها:** صور (jpg/png/gif/webp)، PDF، CSV، TXT، MP4  
**الحجم الأقصى:** 10 MB  
**التخزين:** على القرص في مجلد `backend/uploads/`، تُقدَّم statically على `/uploads`

---

### المستخدمون — `/api/users`

| الطريقة | الـ Endpoint | الوصف | الصلاحية |
|---|---|---|---|
| `GET` | `/` | قائمة كل المستخدمين | ADMIN فقط |
| `PATCH` | `/:id/role` | تغيير دور مستخدم | ADMIN فقط |

---

## نظام الصلاحيات (RBAC)

يعمل النظام بطبقتين من الحماية:

### الطبقة الأولى: `authenticate` middleware
يتحقق من وجود وصحة الـ JWT Token في كل طلب.
```
Header → Bearer token → verifyToken() → req.user = { id, name, email, role }
```

### الطبقة الثانية: `authorize` middleware
يتحقق من أن دور المستخدم مسموح له بهذا الـ endpoint.
```javascript
router.post("/", authenticate, authorize(Role.ADMIN, Role.TESTER), createBug)
```

### جدول الصلاحيات التفصيلي

| الإجراء | ADMIN | TESTER | DEVELOPER |
|---|---|---|---|
| إنشاء bug | ✅ | ✅ | ❌ |
| تعديل bug (كامل) | ✅ | ✅ | ❌ |
| تغيير status فقط | ✅ | ✅ | ✅ |
| حذف bug | ✅ | bugs أنشأها فقط | ❌ |
| إنشاء project | ✅ | ✅ | ❌ |
| حذف project | ✅ | ❌ | ❌ |
| إدارة المستخدمين | ✅ | ❌ | ❌ |
| تغيير دور مستخدم | ✅ | ❌ | ❌ |
| إضافة تعليق | ✅ | ✅ | ✅ |
| رفع ملفات | ✅ | ✅ | ✅ |

---

## الميزات التقنية المهمة

### 1. التحقق من البيانات بـ Zod (طبقتان)

كل بيانات تدخل من المستخدم تُتحقق منها مرتين:
- **Frontend (React Hook Form + Zod):** يتحقق قبل إرسال الطلب، يعرض رسائل خطأ فورية
- **Backend (Zod):** يتحقق عند وصول الطلب، يُرجع `400 Bad Request` مع تفاصيل الخطأ

هذا يحمي من:
- إدخال قيم غير مسموحة (مثل status غير موجود)
- حقول ناقصة
- أنواع بيانات خاطئة

### 2. سجل النشاط التلقائي (Activity Log)

كل تغيير في الـ bug يُسجَّل تلقائياً في جدول `ActivityLog`:

```typescript
// في bug.controller.ts
await logActivity(bug.id, req.user.id, "STATUS_CHANGED", "OPEN → IN_PROGRESS")
```

الأحداث المُسجَّلة:
- `BUG_CREATED` — عند إنشاء الـ bug
- `STATUS_CHANGED` — مع القيمة القديمة والجديدة
- `PRIORITY_CHANGED` — مع القيمة القديمة والجديدة
- `SEVERITY_CHANGED` — مع القيمة القديمة والجديدة
- `ASSIGNED` — عند إسناد المطور
- `UNASSIGNED` — عند إزالة الإسناد
- `COMMENT_ADDED` — عند إضافة تعليق
- `ATTACHMENT_ADDED` — عند رفع ملف

### 3. البحث المؤجل (Debounced Search)

في صفحة قائمة الـ bugs، البحث النصي لا يُرسل طلب API عند كل حرف:

```typescript
// في BugsListPage.tsx
const [search, setSearch] = useState("");          // ما يكتبه المستخدم
const [appliedSearch, setAppliedSearch] = useState(""); // ما يُرسَل فعلاً

useEffect(() => {
  const timer = setTimeout(() => setAppliedSearch(search), 350); // 350ms تأخير
  return () => clearTimeout(timer);
}, [search]);
```

النتيجة: يُرسَل طلب API فقط بعد 350ms من توقف المستخدم عن الكتابة. يوفر الضغط على الخادم.

### 4. إلغاء الطلبات (Cancellable Fetch)

لمنع race conditions عند تغيير الفلاتر بسرعة:

```typescript
useEffect(() => {
  let cancelled = false;
  (async () => {
    const res = await api.get(...);
    if (!cancelled) setBugs(res.data.bugs); // لا تُحدَّث الصفحة إذا أُلغي
  })();
  return () => { cancelled = true; }; // cleanup
}, [appliedSearch, statusF, ...]);
```

### 5. إحصائيات الـ Dashboard بالتوازي

الـ backend ينفّذ 9 استعلامات قاعدة بيانات بالتوازي باستخدام `Promise.all`:

```typescript
const [total, open, inProgress, fixed, closed, assignedToMe,
       byPriority, bySeverity, byProject] = await Promise.all([
  prisma.bug.count(),
  prisma.bug.count({ where: { status: "OPEN" } }),
  // ... إلخ
]);
```

هذا يُقلل وقت الاستجابة من ~900ms (تسلسلي) إلى ~100ms (متوازي).

### 6. الوضع الليلي (Dark Mode)

يعمل بثلاثة مكونات:

**أ) منع الوميض (Anti-Flash Script)** في `index.html`:
```html
<script>
  if(localStorage.getItem('theme')==='dark')
    document.documentElement.classList.add('dark')
</script>
```
يُنفَّذ قبل تحميل React لتجنب وميض الوضع الفاتح.

**ب) Hook مخصص `useDarkMode`:**
يُدير الحالة ويُعدّل `document.documentElement.classList` ويحفظ في `localStorage`.

**ج) CSS Overrides في `index.css`:**
قواعد CSS تستهدف `.dark .bg-white` وما شابه بـ `!important` لتجاوز Tailwind بدون تعديل كل مكون.

### 7. تصدير CSV مع BOM

```typescript
const blob = new Blob(["﻿" + csvContent], { type: "text/csv" });
```

الـ BOM (Byte Order Mark `﻿`) يخبر Excel أن الملف بترميز UTF-8، مما يمنع مشكلة عرض الأحرف الخاصة بشكل خاطئ.

### 8. إرسال الإيميل غير المُعيق (Non-Blocking Email)

```typescript
sendBugAssignedEmail({...}).catch(() => {}); // لا await، لا يمنع الرد
```

إرسال الإيميل لا يُوقف الاستجابة للمستخدم. إذا فشل الإيميل، الـ bug يُعدَّل بنجاح وسجل النشاط يُحفظ، فقط الإيميل يُسقَط بصمت.

### 9. حذف متتالي (Cascade Delete)

في Prisma Schema:
```prisma
bug Bug @relation(fields: [bugId], references: [id], onDelete: Cascade)
```

عند حذف bug: تُحذف تلقائياً كل تعليقاته وسجلات نشاطه ومرفقاته من قاعدة البيانات.

---

## مكتبة المكونات (UI Components)

### `Button`
يدعم: `variant` (primary/secondary/danger)، `size` (sm/md/lg)، `isLoading` (يُظهر spinner).

### `Input`
يدعم: `label`، `error` (رسالة الخطأ باللون الأحمر)، يعمل مع React Hook Form مباشرة عبر `register`.

### `Badge`
بادج صغير ملوّن للحالة/الأولوية/الخطورة.

### `Skeleton`
مكونات تحميل هيكلية تُعطي المستخدم انطباعاً بتحميل المحتوى:
- `BugsTableSkeleton` — يحاكي شكل الجدول بـ 8 صفوف وهمية
- `DashboardSkeleton` — يحاكي البطاقات والرسوم البيانية
- `BugDetailSkeleton` — يحاكي صفحة تفاصيل الـ bug

---

## واجهة المستخدم — الصفحات

### صفحة تسجيل الدخول (`LoginPage`)
- تصميم ثنائي: لوحة يسارية بالعلامة التجارية + نموذج دخول
- حسابات تجريبية ظاهرة مباشرة في الصفحة لسهولة العرض
- دعم الـ RTL عند التبديل للعربية
- مُتحقَّق منها بـ Zod (يمنع إرسال نموذج فارغ)

### لوحة التحكم (`DashboardPage`)
تُحمَّل 9 استعلامات بالتوازي وتعرض:
- **6 بطاقات إحصائية:** الإجمالي، مفتوح، قيد التنفيذ، محلول، مغلق، مُسنَد لي
- **رسم دائري (Donut):** توزيع الـ bugs حسب الحالة مع رقم في المنتصف وأسطورة أسفله
- **رسم شريطي أفقي:** توزيع الـ bugs حسب الخطورة (مرتبة من BLOCKER إلى TRIVIAL)
- **رسم شريطي أفقي:** توزيع الـ bugs حسب الأولوية (مرتبة من CRITICAL إلى LOW)
- **قائمة آخر الـ Bugs:** مع نقطة ملونة حسب الأولوية
- **رسم شريطي عمودي:** عدد الـ bugs لكل مشروع

### قائمة الـ Bugs (`BugsListPage`)
- **بحث نصي مؤجل** (350ms debounce)
- **5 فلاتر:** الحالة، الأولوية، الخطورة، المشروع، ترتيب العرض
- **رقائق الفلاتر النشطة:** كل فلتر مُطبَّق يظهر كـ chip قابل للحذف الفردي
- **زر تصدير CSV:** يُصدِّر كل الـ bugs المُصفَّاة (ليس الصفحة الحالية فقط)
- **جدول** مع: عنوان، مشروع، أولوية، خطورة، حالة، مُسنَد إلى، التاريخ
- **ترقيم صفحات:** 20 bug لكل صفحة، يعرض "1-20 من 150"

### تفاصيل الـ Bug (`BugDetailPage`)
- **رأس الصفحة:** العنوان، من أنشأه، متى أُنشئ، أزرار التعديل والحذف
- **شبكة metadata:** 6 بطاقات (الحالة، الأولوية، الخطورة، المشروع، مُسنَد إلى، البيئة)
- **قسم الوصف:** النص الكامل + خطوات الإعادة + النتيجة المتوقعة (خضراء) + النتيجة الفعلية (حمراء)
- **قسم المرفقات:** رفع ملف، عرض القائمة مع الحجم والرافع، حذف بـ hover
- **Timeline النشاط:** خط زمني رأسي مع أيقونة لكل حدث ووقته
- **قسم التعليقات:** عرض التعليقات مع avatar + نموذج إضافة تعليق جديد

### صفحة المشاريع (`ProjectsPage`)
- شبكة cards ثلاثية، كل card بشريط لوني فريد في الأعلى
- badge أحمر لعدد الـ bugs، أخضر إذا لا يوجد أخطاء
- نموذج إنشاء مشروع جديد يظهر inline بدون انتقال لصفحة أخرى

### صفحة المستخدمين (`UsersPage`) — Admin فقط
- جدول بكل المستخدمين المسجّلين
- يعرض: الاسم، الإيميل، الدور، عدد الـ bugs المُنشأة، عدد الـ bugs المُسنَدة، تاريخ التسجيل
- تغيير دور أي مستخدم مباشرة من dropdown في الجدول (عدا نفسك)
- يُمَيَّز المستخدم الحالي بخلفية مختلفة وبادج "You"

---

## الاختبارات التلقائية (E2E Tests)

مكتوبة بـ Playwright وتعمل على Chromium.

### `auth.spec.ts` — اختبارات المصادقة (5 اختبارات)
1. إعادة التوجيه لصفحة الدخول عند الوصول غير المسجّل
2. عرض رسالة خطأ عند بيانات دخول خاطئة
3. دخول Admin ورؤية Dashboard
4. دخول Tester بنجاح
5. Logout يُعيد للـ Login

### `bugs.spec.ts` — اختبارات الـ Bugs (5 اختبارات)
1. تحميل قائمة الـ bugs وعرض البيانات التجريبية
2. البحث النصي يُضيِّق النتائج
3. فلتر الحالة يعمل بشكل صحيح
4. Tester يُنشئ bug جديد بنجاح
5. صفحة تفاصيل Bug تعرض كل الأقسام

### `dashboard.spec.ts` — اختبارات الـ Dashboard (4 اختبارات)
1. الصفحة تُحمَّل وتعرض البطاقات الإحصائية
2. الأرقام منطقية (ليست null أو NaN)
3. الرسوم البيانية ظاهرة
4. رابط "View All" يعمل

---

## بيانات Demo الجاهزة

عند تشغيل `npm run db:seed`:

### المستخدمون
| الاسم | الإيميل | كلمة المرور | الدور |
|---|---|---|---|
| Admin User | admin@bugflow.com | admin123 | ADMIN |
| Sara Tester | tester@bugflow.com | tester123 | TESTER |
| Omar Dev | dev@bugflow.com | dev123456 | DEVELOPER |
| Lina QA | tester2@bugflow.com | tester123 | TESTER |
| Khaled Dev | dev2@bugflow.com | dev123456 | DEVELOPER |

### المشاريع والبيانات
- **4 مشاريع:** E-Commerce Platform، Mobile App، Admin Dashboard، API Gateway
- **25 bug** موزّعة بشكل واقعي:
  - 12 مفتوح | 7 قيد التنفيذ | 4 محلول | 2 مغلق
  - 5 Blocker | 5 Critical | 6 Major | 5 Minor | 2 Trivial
  - تتضمن bugs أمنية (XSS، JWT algorithm none، credentials leak)
- **40 سجل نشاط** يمثل تاريخ كل bug
- **25 تعليق** بلغة مهنية تحاكي تواصل فريق حقيقي

---

## كيفية تشغيل المشروع

```bash
# 1. استنساخ المشروع
git clone https://github.com/Hatemtarada2004/BugFlow-QA-Bug-Tracking.git
cd BugFlow-QA-Bug-Tracking

# 2. تشغيل الـ Backend
cd backend
npm install
cp .env.example .env
# عدّل .env واكتب بيانات PostgreSQL
npm run db:push    # إنشاء الجداول
npm run db:seed    # بيانات تجريبية
npm run dev        # http://localhost:5000

# 3. تشغيل الـ Frontend (terminal جديد)
cd ../frontend
npm install
npm run dev        # http://localhost:5173

# 4. تشغيل الاختبارات (terminal جديد)
cd ../e2e
npm install
npx playwright install chromium
npm test
```

---

## المهارات التي يُثبتها هذا المشروع

| المجال | ما يُثبته |
|---|---|
| **Full-Stack Development** | بناء Backend كامل + Frontend كامل بدون frameworks جاهزة |
| **TypeScript** | استخدام متقدم: enums، generics، custom types، interfaces |
| **Database Design** | تصميم 6 جداول بعلاقات معقدة، Cascade Delete، groupBy aggregations |
| **REST API Design** | endpoints منظمة، HTTP status codes صحيحة، error handling |
| **Security** | bcrypt hashing، JWT auth، RBAC، input validation بطبقتين |
| **React Patterns** | Context API، Custom Hooks، Controlled Forms، Optimistic Updates |
| **Performance** | Debounced search، Cancellable requests، Parallel DB queries |
| **UX/UI** | Skeleton loaders، Responsive design، Dark mode، RTL support |
| **Testing** | E2E tests بـ Playwright تغطي auth + CRUD + UI |
| **Data Visualization** | 4 أنواع رسوم بيانية بـ Recharts مع tooltips مخصصة |

---

*BugFlow — Hatem Tarada | 2026*

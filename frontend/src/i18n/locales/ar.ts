const ar = {
  // Navigation
  nav: {
    dashboard: "لوحة التحكم",
    bugs: "الأخطاء",
    projects: "المشاريع",
    users: "المستخدمون",
    admin: "الإدارة",
    logout: "تسجيل الخروج",
  },

  // Auth
  auth: {
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    loginTitle: "مرحباً بك في BugFlow",
    loginSubtitle: "سجّل دخولك إلى حسابك",
    registerTitle: "إنشاء حساب جديد",
    registerSubtitle: "انضم إلى BugFlow اليوم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    name: "الاسم الكامل",
    noAccount: "ليس لديك حساب؟",
    haveAccount: "لديك حساب بالفعل؟",
    registerLink: "سجّل الآن",
    loginLink: "سجّل دخولك",
    demoAccounts: "حسابات تجريبية",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    registerFailed: "فشل التسجيل. قد يكون البريد الإلكتروني مستخدماً بالفعل.",
  },

  // Dashboard
  dashboard: {
    title: "لوحة التحكم",
    welcome: "مرحباً",
    subtitle: "إليك ما يحدث مع أخطائك اليوم.",
    total: "الإجمالي",
    open: "مفتوح",
    inProgress: "قيد التنفيذ",
    fixed: "تم الإصلاح",
    closed: "مغلق",
    assignedToMe: "مسنَد إليّ",
    recentBugs: "أحدث الأخطاء",
    viewAll: "عرض الكل",
    noBugs: "لا توجد أخطاء بعد",
  },

  // Bugs
  bugs: {
    title: "الأخطاء",
    reportBug: "+ الإبلاغ عن خطأ",
    searchPlaceholder: "ابحث عن أخطاء...",
    allStatuses: "جميع الحالات",
    allPriorities: "جميع الأولويات",
    noBugsFound: "لا توجد أخطاء",
    reportedBy: "أُبلغ بواسطة",
    backToBugs: "→ العودة إلى الأخطاء",
    edit: "تعديل",
    delete: "حذف",
    confirmDelete: "هل تريد حذف هذا الخطأ؟",
    comments: "التعليقات",
    addComment: "أضف تعليقاً...",
    post: "نشر",
    noComments: "لا توجد تعليقات بعد",
    editBug: "تعديل الخطأ",
    reportNewBug: "الإبلاغ عن خطأ جديد",
    updateBug: "تحديث الخطأ",
    cancel: "إلغاء",
    unassigned: "غير مسنَد",
    // Fields
    titleField: "العنوان",
    description: "الوصف",
    project: "المشروع",
    assignedTo: "مسنَد إلى",
    priority: "الأولوية",
    severity: "الخطورة",
    status: "الحالة",
    environment: "البيئة",
    stepsToReproduce: "خطوات إعادة الإنتاج",
    expectedResult: "النتيجة المتوقعة",
    actualResult: "النتيجة الفعلية",
    qaDetails: "تفاصيل ضمان الجودة",
    selectProject: "اختر مشروعاً...",
    // Status labels
    statusOpen: "مفتوح",
    statusInProgress: "قيد التنفيذ",
    statusFixed: "تم الإصلاح",
    statusClosed: "مغلق",
    // Priority labels
    priorityLow: "منخفضة",
    priorityMedium: "متوسطة",
    priorityHigh: "عالية",
    priorityCritical: "حرجة",
    // Severity labels
    severityTrivial: "تافه",
    severityMinor: "بسيط",
    severityMajor: "رئيسي",
    severityCritical: "حرج",
    severityBlocker: "مانع",
    // Table headers
    colTitle: "العنوان",
    colProject: "المشروع",
    colPriority: "الأولوية",
    colStatus: "الحالة",
    colAssignedTo: "مسنَد إلى",
    colDate: "التاريخ",
    // Detail
    detailStatus: "الحالة",
    detailPriority: "الأولوية",
    detailSeverity: "الخطورة",
    detailProject: "المشروع",
    detailAssigned: "مسنَد إلى",
    detailEnvironment: "البيئة",
  },

  // Projects
  projects: {
    title: "المشاريع",
    newProject: "+ مشروع جديد",
    createProject: "إنشاء مشروع جديد",
    projectName: "اسم المشروع",
    projectNamePlaceholder: "مثال: منصة التجارة الإلكترونية",
    descriptionPlaceholder: "ما الذي يتعلق به هذا المشروع؟",
    description: "الوصف",
    createBtn: "إنشاء المشروع",
    noProjects: "لا توجد مشاريع بعد",
    bugsCount: "أخطاء",
    createdBy: "أُنشئ بواسطة",
    cancel: "إلغاء",
  },

  // Users (Admin)
  users: {
    title: "إدارة المستخدمين",
    colUser: "المستخدم",
    colRole: "الدور",
    colCreated: "أخطاء أنشأها",
    colAssigned: "مسنَدة إليه",
    colJoined: "تاريخ الانضمام",
    colActions: "الإجراءات",
    you: "أنت",
  },

  // Common
  common: {
    loading: "جارٍ التحميل...",
    save: "حفظ",
    close: "إغلاق",
    bugNotFound: "الخطأ غير موجود",
    found: "موجود",
  },
};

export default ar;

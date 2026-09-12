export type Language = 'bn' | 'en';

export const translations = {
  en: {
    // Brand
    brandTitle: 'Campus360',
    brandSubtitle: 'Green University of Bangladesh',

    // Language Selector
    langBangla: 'বাংলা',
    langEnglish: 'English',

    // Roles
    roleStudent: 'Student',
    roleTeacher: 'Teacher / Faculty',
    roleAdmin: 'Administrator',
    roleConductor: 'Bus Conductor (Transit Staff)',
    roleStudentShort: 'Student',
    roleTeacherShort: 'Faculty',
    roleAdminShort: 'Admin',
    roleConductorShort: 'Conductor',

    // Departments
    deptCSE: 'CSE — Computer Science & Engineering',
    deptEEE: 'EEE — Electrical & Electronic Engineering',
    deptTE: 'TE — Textile Engineering',
    deptBBA: 'BBA — Green Business School',
    deptEnglish: 'Department of English',
    deptLaw: 'Department of Law',
    deptTransport: 'Transport & Fleet Division',

    // Auth / Login Page
    tabSignIn: 'Sign In',
    tabCreateAccount: 'Create Account',
    
    // Labels
    labelFullName: 'Full Name',
    labelRole: 'Role',
    labelDepartment: 'Department',
    labelUniversityId: 'University ID Number',
    labelConductorId: 'Staff / Conductor ID Number',
    labelEmailLogin: 'Email Address',
    // USER EXPLICIT REQUEST: "create account option a Email Address er jai likhe diba Your Microsoft Account Email"
    labelEmailRegister: 'Your Microsoft Account Email',
    labelPassword: 'Password',

    // Placeholders
    placeholderNameStudent: 'Ahmed Sizan',
    placeholderNameConductor: 'e.g. Md. Rafiqul Islam (Conductor)',
    placeholderIdStudent: 'e.g. 232002038 (Exactly 9 digits)',
    placeholderIdConductor: 'e.g. STAFF-042 or GUB-COND-01',
    placeholderIdTeacher: 'e.g. FAC-CSE-104',
    placeholderEmailLogin: 'user@green.edu.bd',
    placeholderEmailRegister: '232002038@student.green.ac.bd',
    placeholderPassword: '••••••••',

    // Digits & Live ID Status
    digitsCounter: '{count}/9 digits',
    idRuleNote: '* University ID must be exactly 9 numeric digits (e.g. 232002038).',
    idRemainingNote: 'ID must be 9 digits ({current}/9). {needed} more needed. Email will be: {email}',
    idValidAvailable: 'Valid 9-digit Student ID ({id}) is available — Email: {email}',
    idChecking: 'Checking ID uniqueness...',
    idAlreadyTakenAlert: 'University ID ({id}) is already registered! You cannot create multiple accounts with the same ID. Please switch to Sign In.',
    
    // Microsoft Email Specific Helpers
    msTeamsNote: '* Green University students use official Microsoft 365 / Teams email ([ID]@student.green.ac.bd).',
    msAutoFillChip: '⚡ Click to Auto-Fill: {email}',
    msAutoFillMatched: 'Matched ({email})',
    msEmailMismatchAlert: 'Student email must strictly match your 9-digit University ID Microsoft account: "{expected}". You cannot register with "{actual}".',

    // Buttons
    btnSignIn: 'Sign In',
    btnCreateAccount: 'Create Account',
    btnIdTakenDisabled: 'ID Already Registered — Switch to Sign In',
    btnPleaseWait: 'Please wait...',

    // Demo Logins
    demoTitle: 'Quick 1-Tap Demo Sandbox Login',
    demoSubtitle: '🧪 Isolated Sandbox: Demo requests, bus passes, and notices stay strictly inside the Demo environment and never touch real accounts.',
    demoStudent: 'Student Demo',
    demoTeacher: 'Teacher Demo',
    demoAdmin: 'Admin Demo',
    demoConductor: 'Bus Conductor',

    // Toasts & Alerts
    toastSignInSuccess: 'Signed in successfully.',
    toastWelcome: 'Welcome',
    toastSignInFailed: 'Sign In Failed',
    toastInvalidCredentials: 'Invalid credentials. Please check your email and password.',
    toastAccountCreated: 'Account Created',
    toastAccountCreatedMsg: 'Account created successfully! Welcome to Campus 360.',
    toastSignUpFailed: 'Sign Up Failed',
    toastInvalidStudentIdTitle: 'Invalid Student ID',
    toastInvalidStudentIdMsg: 'Student ID must be exactly 9 numeric digits (e.g. 232002038). Currently entered: {count} digit(s).',
    toastEmailMatchTitle: 'Email Must Match Student ID',
    toastEmailMatchMsg: 'Student email must match your 9-digit University ID exactly: "{expected}". You cannot open an account with "{actual}".',
    toastIdTakenTitle: 'ID Already Registered',
    toastIdTakenMsg: 'University ID "{id}" is already registered ({owner}). Duplicate accounts with the same ID are strictly prohibited. Please switch to Sign In.',

    // Navbar
    navDashboard: 'Dashboard',
    navNotices: 'Notices',
    navCafeteria: 'Cafeteria',
    navTransport: 'Transport',
    navLostFound: 'Lost & Found',
    navComplaints: 'Complaints',
    navInstallApp: 'Install App',
    navMyProfile: 'My Profile',
    navSignOut: 'Sign Out',
    navSettings: 'Settings',

    // Student Dashboard / Home Page
    dashStudentPortal: 'Student Portal',
    dashSemester: 'Summer 2026',
    dashWelcomeBack: 'Welcome back, {name}!',
    dashOrderFood: 'Order Food',
    dashTrackBus: 'Track Bus',
    dashRecentNotices: 'Recent Official Notices',
    dashViewAll: 'View All',
    dashActiveBuses: 'Active Campus Buses',
    dashQuickServices: 'Campus Express Services',
    dashCafeteriaDesc: 'Browse live cafeteria menu and pre-order meals',
    dashTransportDesc: 'Real-time GPS tracking & schedule updates',
    dashNoticesDesc: 'Official university notices and event alerts',
    dashLostFoundDesc: 'Report and recover lost belongings on campus',
    dashComplaintsDesc: 'Submit feedback and campus maintenance requests',
    dashThemeNight: 'Night',
    dashThemeLight: 'Light',
    dashThemePink: 'Pink',
    dashBusFleet: 'University Bus Fleet (4 Lines)',
    dashLatestNotices: 'Latest Official Notices',
    dashNoticeBoard: 'Notice Board',
    dashGrievanceBox: 'Grievance Box',
    dashAnonymousComplaints: 'Anonymous complaints',
    dashOrderMealsSnacks: 'Order meals & snacks',
    dashSchedulesBooking: 'Schedules & 45-seat booking',
    dashOfficialAnnouncements: 'Official announcements',
    dashReportClaimItems: 'Report & claim items',
    dashId: 'ID',
    dashFacultyPortal: 'Faculty Portal',
    dashFacultyId: 'Faculty ID',
    dashOfficeHours: 'Office Hours',
    dashSystemAdmin: 'System Administration',
    dashSuperuser: 'Superuser Access',
    dashCampusOperations: 'Campus Operations Control',
    dashLoggedInAs: 'Logged in as',
    dashTransitStaff: 'Transit Staff Portal',
    dashSyncCloud: 'Sync Cloud',
    dashSyncing: 'Syncing...',
    dashApproveAllPending: 'Approve All Pending ({count})',
  },
  bn: {
    // Brand
    brandTitle: 'ক্যাম্পাস৩৬০',
    brandSubtitle: 'গ্রিন ইউনিভার্সিটি অব বাংলাদেশ',

    // Language Selector
    langBangla: 'বাংলা',
    langEnglish: 'English',

    // Roles
    roleStudent: 'শিক্ষার্থী',
    roleTeacher: 'শিক্ষক / অনুষদ সদস্য',
    roleAdmin: 'সিস্টেম প্রশাসক',
    roleConductor: 'বাস কন্ডাকটর (ট্রান্সপোর্ট স্টাফ)',
    roleStudentShort: 'শিক্ষার্থী',
    roleTeacherShort: 'অনুষদ',
    roleAdminShort: 'প্রশাসক',
    roleConductorShort: 'কন্ডাকটর',

    // Departments
    deptCSE: 'সিএসই — কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং',
    deptEEE: 'ইইই — ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং',
    deptTE: 'টিই — টেক্সটাইল ইঞ্জিনিয়ারিং',
    deptBBA: 'বিবিএ — গ্রিন বিজনেস স্কুল',
    deptEnglish: 'ইংরেজি বিভাগ',
    deptLaw: 'আইন বিভাগ',
    deptTransport: 'পরিবহন ও বহর ব্যবস্থাপনা বিভাগ',

    // Auth / Login Page
    tabSignIn: 'সাইন ইন',
    tabCreateAccount: 'অ্যাকাউন্ট খুলুন',
    
    // Labels
    labelFullName: 'পূর্ণ নাম',
    labelRole: 'পদবী / ভূমিকা',
    labelDepartment: 'বিভাগ',
    labelUniversityId: 'বিশ্ববিদ্যালয় আইডি নম্বর (রোল)',
    labelConductorId: 'স্টাফ / কন্ডাকটর আইডি নম্বর',
    labelEmailLogin: 'অফিসিয়াল ইমেইল অ্যাড্রেস',
    // USER EXPLICIT REQUEST: "create account option a Email Address er jai likhe diba Your Microsoft Account Email"
    labelEmailRegister: 'আপনার মাইক্রোসফট অ্যাকাউন্ট ইমেইল',
    labelPassword: 'পাসওয়ার্ড',

    // Placeholders
    placeholderNameStudent: 'যেমন: আহমেদ সিজান',
    placeholderNameConductor: 'যেমন: মো. রফিকুল ইসলাম (কন্ডাকটর)',
    placeholderIdStudent: 'যেমন: ২৩২০০২০৩৮ (ঠিক ৯টি সংখ্যা)',
    placeholderIdConductor: 'যেমন: STAFF-042 বা GUB-COND-01',
    placeholderIdTeacher: 'যেমন: FAC-CSE-104',
    placeholderEmailLogin: 'user@green.edu.bd',
    placeholderEmailRegister: '232002038@student.green.ac.bd',
    placeholderPassword: '••••••••',

    // Digits & Live ID Status
    digitsCounter: '{count}/৯ ডিজিট',
    idRuleNote: '* বিশ্ববিদ্যালয় আইডি নম্বরটি অবশ্যই ঠিক ৯টি সংখ্যার হতে হবে (যেমন: ২৩২০০২০৩৮)।',
    idRemainingNote: 'আইডি অবশ্যই ৯ সংখ্যার হতে হবে ({current}/৯)। আরও {needed} সংখ্যা প্রয়োজন। আপনার ইমেইল হবে: {email}',
    idValidAvailable: 'সঠিক ৯ ডিজিটের শিক্ষার্থী আইডি ({id}) পাওয়া গেছে — ইমেইল: {email}',
    idChecking: 'আইডি যাচাই করা হচ্ছে...',
    idAlreadyTakenAlert: 'বিশ্ববিদ্যালয় আইডি ({id}) দিয়ে ইতিমধ্যে অ্যাকাউন্ট নিবন্ধিত রয়েছে! একই আইডি দিয়ে একাধিক অ্যাকাউন্ট খোলা সম্ভব নয়। দয়া করে সাইন ইন করুন।',
    
    // Microsoft Email Specific Helpers
    msTeamsNote: '* গ্রিন ইউনিভার্সিটির শিক্ষার্থীদের জন্য অফিসিয়াল মাইক্রোসফট ৩৬৫ / টিমস ইমেইল আবশ্যক ([ID]@student.green.ac.bd)।',
    msAutoFillChip: '⚡ ১-ক্লিকে স্বয়ংক্রিয় পূরণ: {email}',
    msAutoFillMatched: 'মিলে গেছে ({email})',
    msEmailMismatchAlert: 'শিক্ষার্থী ইমেইল অবশ্যই আপনার ৯ ডিজিটের বিশ্ববিদ্যালয় আইডি ভিত্তিক মাইক্রোসফট অ্যাকাউন্টের সাথে মিলতে হবে: "{expected}"। আপনি "{actual}" দিয়ে অ্যাকাউন্ট খুলতে পারবেন না।',

    // Buttons
    btnSignIn: 'সাইন ইন করুন',
    btnCreateAccount: 'অ্যাকাউন্ট তৈরি করুন',
    btnIdTakenDisabled: 'আইডি ইতিমধ্যে নিবন্ধিত — সাইন ইন করুন',
    btnPleaseWait: 'অনুগ্রহ করে অপেক্ষা করুন...',

    // Demo Logins
    demoTitle: 'দ্রুত ১-ট্যাপ ডেমো স্যান্ডবক্স লগইন',
    demoSubtitle: '🧪 আইসোলেটেড স্যান্ডবক্স: ডেমো টিকিট রিকোয়েস্ট ও নোটিশ শুধুমাত্র ডেমো অ্যাকাউন্টে সীমাবদ্ধ থাকবে, রিয়েল অ্যাকাউন্টে যাবে না।',
    demoStudent: 'শিক্ষার্থী ডেমো',
    demoTeacher: 'শিক্ষক ডেমো',
    demoAdmin: 'প্রশাসক ডেমো',
    demoConductor: 'বাস কন্ডাকটর',

    // Toasts & Alerts
    toastSignInSuccess: 'সফলভাবে সাইন ইন হয়েছে।',
    toastWelcome: 'স্বাগতম',
    toastSignInFailed: 'সাইন ইন ব্যর্থ হয়েছে',
    toastInvalidCredentials: 'ভুল তথ্য দিয়েছেন। দয়া করে আপনার ইমেইল ও পাসওয়ার্ড পুনরায় পরীক্ষা করুন।',
    toastAccountCreated: 'অ্যাকাউন্ট তৈরি সম্পন্ন',
    toastAccountCreatedMsg: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! ক্যাম্পাস ৩৬০-এ স্বাগতম।',
    toastSignUpFailed: 'রেজিস্ট্রেশন ব্যর্থ হয়েছে',
    toastInvalidStudentIdTitle: 'ভুল শিক্ষার্থী আইডি',
    toastInvalidStudentIdMsg: 'শিক্ষার্থী আইডি অবশ্যই ঠিক ৯ সংখ্যার হতে হবে (যেমন: ২৩২০০২০৩৮)। বর্তমানে দিয়েছেন: {count} ডিজিট।',
    toastEmailMatchTitle: 'ইমেইল অবশ্যই স্টুডেন্ট আইডির সাথে মিলতে হবে',
    toastEmailMatchMsg: 'শিক্ষার্থী ইমেইল আপনার ৯ ডিজিটের অফিসিয়াল মাইক্রোসফট আইডির সাথে মিলতে হবে: "{expected}"। আপনি "{actual}" দিয়ে অ্যাকাউন্ট খুলতে পারবেন না।',
    toastIdTakenTitle: 'আইডি ইতিমধ্যে নিবন্ধিত',
    toastIdTakenMsg: 'বিশ্ববিদ্যালয় আইডি "{id}" দিয়ে ইতিমধ্যে অ্যাকাউন্ট নিবন্ধিত রয়েছে ({owner})। একই আইডি দিয়ে একাধিক অ্যাকাউন্ট খোলা সম্পূর্ণ নিষিদ্ধ। দয়া করে সাইন ইন করুন।',

    // Navbar
    navDashboard: 'ড্যাশবোর্ড',
    navNotices: 'নোটিশ বোর্ড',
    navCafeteria: 'ক্যাফেটেরিয়া',
    navTransport: 'বাস পরিবহন',
    navLostFound: 'হারানো ও প্রাপ্তি',
    navComplaints: 'অভিযোগ বক্স',
    navInstallApp: 'অ্যাপ ইনস্টল',
    navMyProfile: 'আমার প্রোফাইল',
    navSignOut: 'লগ আউট',
    navSettings: 'সেটিংস',

    // Student Dashboard / Home Page
    dashStudentPortal: 'শিক্ষার্থী পোর্টাল',
    dashSemester: 'সামার ২০২৬',
    dashWelcomeBack: 'স্বাগতম, {name}!',
    dashOrderFood: 'খাবার অর্ডার',
    dashTrackBus: 'বাস ট্র্যাকিং',
    dashRecentNotices: 'সাম্প্রতিক অফিসিয়াল নোটিশ',
    dashViewAll: 'সব দেখুন',
    dashActiveBuses: 'চলমান ক্যাম্পাস বাসসমূহ',
    dashQuickServices: 'ক্যাম্পাস এক্সপ্রেস সেবাসমূহ',
    dashCafeteriaDesc: 'ক্যাফেটেরিয়ার মেনু দেখুন এবং খাবার অর্ডার করুন',
    dashTransportDesc: 'রিয়েল-টাইম বাস জিপিএস ট্র্যাকিং ও সময়সূচী',
    dashNoticesDesc: 'বিশ্ববিদ্যালয়ের অফিসিয়াল নোটিশ ও জরুরি বিজ্ঞপ্তি',
    dashLostFoundDesc: 'ক্যাম্পাসে হারানো বা প্রাপ্ত জিনিসপত্রের তথ্য',
    dashComplaintsDesc: 'যেকোনো সমস্যা বা অভিযোগ সরাসরি প্রশাসনকে জানান',
    dashThemeNight: 'নাইট',
    dashThemeLight: 'লাইট',
    dashThemePink: 'গোলাপী',
    dashBusFleet: 'বিশ্ববিদ্যালয় বাস বহর (৪টি রুট)',
    dashLatestNotices: 'সাম্প্রতিক অফিসিয়াল নোটিশ',
    dashNoticeBoard: 'নোটিশ বোর্ড',
    dashGrievanceBox: 'অভিযোগ বক্স',
    dashAnonymousComplaints: 'গোপন ও সরাসরি অভিযোগ',
    dashOrderMealsSnacks: 'খাবার ও স্ন্যাক্স অর্ডার',
    dashSchedulesBooking: 'সময়সূচী ও ৪৫ সিট বুকিং',
    dashOfficialAnnouncements: 'বিশ্ববিদ্যালয়ের আনুষ্ঠানিক বিজ্ঞপ্তি',
    dashReportClaimItems: 'হারানো জিনিস রিপোর্ট ও গ্রহণ',
    dashId: 'আইডি',
    dashFacultyPortal: 'অনুষদ পোর্টাল',
    dashFacultyId: 'অনুষদ আইডি',
    dashOfficeHours: 'অফিস সময়',
    dashSystemAdmin: 'সিস্টেম অ্যাডমিনিস্ট্রেশন',
    dashSuperuser: 'সুপারইউজার অ্যাক্সেস',
    dashCampusOperations: 'ক্যাম্পাস অপারেশনস কন্ট্রোল',
    dashLoggedInAs: 'লগ ইন আছেন',
    dashTransitStaff: 'ট্রান্সপোর্ট স্টাফ পোর্টাল',
    dashSyncCloud: 'ক্লাউড সিঙ্ক',
    dashSyncing: 'সিঙ্ক হচ্ছে...',
    dashApproveAllPending: 'সব পেন্ডিং অনুমোদন ({count})',
  }
};


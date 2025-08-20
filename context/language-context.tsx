"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Language = "uz" | "ru" | "en";

interface TranslationDict {
  [key: string]: string;
}

interface Translations {
  uz: TranslationDict;
  ru: TranslationDict;
  en: TranslationDict;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const defaultTranslations: Translations = {
  uz: {
    // Header / Navigation
    home: "Bosh sahifa",
    courses: "Kurslar",
    jobs: "Vakansiyalar",
    about: "Biz haqimizda",
    contact: "Aloqa",
    profile: "Profil",
    account: "Hisob",
    logout: "Chiqish",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    search: "Qidirish",
    adminPanel: "Admin panel",

    // Home page
    learnEnglishForIT: "IT uchun ingliz tilini o'rganing",
    academyDescription:
      "Zamonaviy uslubda IT mutaxassislari uchun maxsus ingliz tili kurslari.",
    viewCourses: "Kurslarni ko'rish",
    contactUs: "Biz bilan bog'lanish",
    academyImageAlt: "IT English Academy tasviri",
    ourAdvantages: "Afzalliklarimiz",
    whyChooseUs: "Nega bizni tanlaysiz?",
    itEnglish: "IT uchun Ingliz tili",
    itEnglishDescription: "ITga moslashtirilgan so'z boyligi va mavzular.",
    modernTeaching: "Zamonaviy ta'lim",
    modernTeachingDescription: "Interaktiv darslar va haqiqiy loyihalar.",
    experiencedTeachers: "Tajribali o'qituvchilar",
    experiencedTeachersDescription: "Soha mutaxassislari bilan darslar.",
    practicalExercises: "Amaliy mashg'ulotlar",
    practicalExercisesDescription: "Har bir mavzuga mos mashqlar.",
    smallGroups: "Kichik guruhlar",
    smallGroupsDescription: "Har bir o'quvchiga e'tibor.",
    guaranteedResult: "Kafolatlangan natija",
    guaranteedResultDescription: "Bosqichma-bosqich natijaga yo'naltirish.",
    popularCourses: "Ommabop kurslar",
    explorePopularCourses: "Mashhur kurslarni ko'rib chiqing",
    englishBasics: "Ingliz tili asoslari",
    englishBasicsDescription: "Boshlang'ich darajadagi mustahkam poydevor.",
    price1: "$49 / oy",
    details: "Batafsil",
    webDevelopment: "Veb-dasturlash uchun Ingliz tili",
    webDevelopmentDescription: "Frontend/Backend atamalari va amaliy mashqlar.",
    price2: "$79 / oy",
    price3: "$99 / oy",
    viewAllCourses: "Barcha kurslarni ko'rish",
    registerNow: "Hozir ro'yxatdan o'ting",
    registerNowDescription: "Bugun boshlang va karyerangizni tezlashtiring!",
    pages: "Sahifalar",
    address: "Manzil",
    phone: "Telefon",
    email: "Email",
    socialMedia: "Ijtimoiy tarmoqlar",
    allRightsReserved: "Barcha huquqlar himoyalangan",

    // Courses page
    itEnglishCourses: "IT uchun ingliz tili kurslari",
    specializedEnglishCourses:
      "IT sohasiga ixtisoslashgan ingliz tili kurslari",
    searchCourses: "Kurslarni qidirish",
    level: "Daraja",
    allLevels: "Barcha darajalar",
    beginner: "Boshlang'ich",
    intermediate: "O'rta",
    advanced: "Yuqori",
    duration: "Davomiylik",
    allDurations: "Barcha davomiyliklar",
    shortDuration: "Qisqa",
    mediumDuration: "O'rta",
    longDuration: "Uzoq",
    availableCourses: "Mavjud kurslar",
    filter: "Filtr",
    loading: "Yuklanmoqda...",
    lessons: "dars",
    currency: "so'm",
    viewCourse: "Kursga o'tish",
    noCoursesFound: "Kurslar topilmadi",
    active: "faol",

    // Theme / Language Switchers
    language: "Til",
    change_theme: "Mavzuni o'zgartirish",
    light: "Yorug'lik",
    dark: "Qorong'u",
    system: "Tizim",

    // Notifications
    notifications: "Bildirishnomalar",
    mark_all_as_read: "Barchasini o'qilgan deb belgilash",
    no_notifications: "Hozircha bildirishnoma yo'q",
    cart: "Savat",

    // Auth / Register page
    error: "Xatolik",
    fillAllFields: "Barcha maydonlarni to'ldiring",
    passwordsDoNotMatch: "Parollar mos kelmayapti",
    invalidEmailFormat: "Email formati noto'g'ri",
    invalidPhoneFormat: "Telefon raqami formati noto'g'ri",
    usernameAlreadyExists: "Foydalanuvchi nomi allaqachon mavjud",
    emailAlreadyExists: "Bu email allaqachon ro'yxatdan o'tgan",
    success: "Muvaffaqiyat",
    registrationSuccessful: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi",
    registrationError: "Ro'yxatdan o'tishda xatolik yuz berdi",
    enterYourInformation: "Ma'lumotlaringizni kiriting",
    firstName: "Ism",
    firstNamePlaceholder: "Ismingiz",
    lastName: "Familiya",
    lastNamePlaceholder: "Familiyangiz",
    phonePlaceholder: "+998 ...",
    password: "Parol",
    confirmPassword: "Parolni tasdiqlang",
    registering: "Ro'yxatdan o'tilmoqda...",
    alreadyHaveAccount: "Hisobingiz bormi?",

    // Profile
    completed_lesson: "bajarilgan dars",
    days_ago: "kun oldin",
    profile_completion: "Profil to'ldirilishi",
    student: "Talaba",
    english_b2: "Ingliz tili B2",
    it_beginner: "IT boshlang'ich",
    edit_profile: "Profilni tahrirlash",
    quick_links: "Tezkor havolalar",
    my_courses: "Mening kurslarim",
    certificates: "Sertifikatlar",
    support_chat: "Yordam chat",
    browse_courses: "Kurslarni ko'rib chiqish",
    overview: "Umumiy",
    progress: "Rivojlanish",
    achievements: "Yutuqlar",
    welcome_back: "Qaytganingiz bilan!",
    welcome_message: "Xush kelibsiz, {name}",
    active_courses: "Faol kurslar",
    completed_courses: "Tugallangan kurslar",

    // Profile Settings (keys with spaces preserved as-is)
    settings: "Sozlamalar",
    "manage account settings": "Hisob sozlamalarini boshqarish",
    "profile information": "Profil ma'lumotlari",
    "update profile information": "Profil ma'lumotlarini yangilang",
    "change avatar": "Avatarni almashtirish",
    "remove avatar": "Avatarni olib tashlash",
    "first name": "Ism",
    "last name": "Familiya",
    bio: "Bio",
    "tell us about yourself": "O'zingiz haqingizda yozing",
    "preferred language": "Afzal til",
    "select language": "Tilni tanlang",
    cancel: "Bekor qilish",
    "save changes": "O'zgarishlarni saqlash",
    "account settings": "Hisob sozlamalari",
    "update account settings": "Hisob sozlamalarini yangilang",
    "change password": "Parolni o'zgartirish",
    "current password": "Joriy parol",
    "new password": "Yangi parol",
    "confirm password": "Parolni tasdiqlang",
    "danger zone": "Xavfli hudud",
    "danger zone description": "Hisobingizni o'chirish qayta tiklanmaydi",
    "delete account": "Hisobni o'chirish",
    "notification settings": "Bildirishnoma sozlamalari",
    "manage notification preferences":
      "Bildirishnomalar afzalliklarini boshqarish",
    "email notifications": "Email bildirishnomalari",
    "receive email notifications": "Email orqali bildirishnomalarni oling",
    "push notifications": "Push bildirishnomalari",
    "receive push notifications": "Push bildirishnomalarni oling",
    "marketing emails": "Marketing xatlari",
    "receive marketing emails": "Marketing xatlarini oling",
    "course updates": "Kurs yangilanishlari",
    "receive course updates": "Kurs yangilanishlarini oling",

    // Auth context
    accountInactive: "Hisob faolsiz",
    accountInactiveDescription:
      "Hisobingiz vaqtincha faol emas. Yordam uchun qo'llab-quvvatlashga murojaat qiling.",
    loginFailed: "Kirish muvaffaqiyatsiz",
    usernameOrPasswordIncorrect: "Foydalanuvchi nomi yoki parol noto'g'ri",

    // Course chat
    audioRecordingStarted: "Audio yozuv boshlandi",
    pressStopToFinishRecording: "Yakunlash uchun 'To'xtatish' ni bosing",
    failedToStartAudioRecording: "Audio yozuvni boshlashda xatolik",
    audioRecordingStopped: "Audio yozuv to'xtatildi",
    audioMessageSent: "Audio xabar yuborildi",
    videoRecordingStarted: "Video yozuv boshlandi",
    failedToStartVideoRecording: "Video yozuvni boshlashda xatolik",
    videoRecordingStopped: "Video yozuv to'xtatildi",
    videoMessageSent: "Video xabar yuborildi",
    callWithTeacher: "O'qituvchi bilan qo'ng'iroq: {teacher}",
    callEnded: "Qo'ng'iroq tugadi",
    callWithTeacherEnded: "{teacher} bilan qo'ng'iroq tugadi",
    pleaseEnterReportReason: "Iltimos, muammo sababini yozing",
    reportSubmitted: "Hisobot yuborildi",
    thankYouForYourReport: "Hisobotingiz uchun rahmat",
    pleaseEnterApplicationDetails: "Iltimos, ariza tafsilotlarini yozing",
    applicationSubmitted: "Ariza yuborildi",
    thankYouForYourApplication: "Ariza uchun rahmat",
    loadingChat: "Chat yuklanmoqda...",
    online: "Onlayn",
    offline: "Oflayn",
    reportProblem: "Muammo haqida xabar berish",
    reportProblemDescription: "Muammoni qisqacha tasvirlab bering",
    applyToTeach: "O'qituvchi bo'lish uchun ariza",
    applyToTeachDescription: "{course} kursi uchun ariza qoldiring",
    audioCall: "Audio qo'ng'iroq",
    videoCall: "Video qo'ng'iroq",
    withTeacher: "O'qituvchi: {teacher}",
    endCall: "Qo'ng'iroqni tugatish",
    startConversation: "Suhbatni boshlang",
    startConversationDescription: "{course} bo'yicha savollaringizni yozing",
    recordingAudio: "Audio yozilmoqda",
    recordingVideo: "Video yozilmoqda",
    typeMessage: "Xabar yozing",
    describeProblem: "Muammoni tasvirlang",
    submitReport: "Yuborish",
    describeExperience: "Tajriba haqida yozing",
    submitApplication: "Ariza yuborish",
  },
  ru: {
    // Header / Navigation
    home: "Главная",
    courses: "Курсы",
    jobs: "Вакансии",
    about: "О нас",
    contact: "Контакты",
    profile: "Профиль",
    account: "Аккаунт",
    logout: "Выйти",
    login: "Войти",
    register: "Регистрация",
    search: "Поиск",
    adminPanel: "Админ-панель",

    // Home page
    learnEnglishForIT: "Изучайте английский для IT",
    academyDescription:
      "Специализированные курсы английского для IT-специалистов современными методами.",
    viewCourses: "Смотреть курсы",
    contactUs: "Связаться с нами",
    academyImageAlt: "Изображение IT English Academy",
    ourAdvantages: "Наши преимущества",
    whyChooseUs: "Почему выбирают нас",
    itEnglish: "Английский для IT",
    itEnglishDescription: "Лексика и темы, адаптированные под IT.",
    modernTeaching: "Современное обучение",
    modernTeachingDescription: "Интерактивные занятия и реальные проекты.",
    experiencedTeachers: "Опытные преподаватели",
    experiencedTeachersDescription: "Занятия с практикующими специалистами.",
    practicalExercises: "Практические задания",
    practicalExercisesDescription: "Упражнения к каждой теме.",
    smallGroups: "Небольшие группы",
    smallGroupsDescription: "Внимание каждому студенту.",
    guaranteedResult: "Гарантированный результат",
    guaranteedResultDescription: "Пошаговое достижение целей.",
    popularCourses: "Популярные курсы",
    explorePopularCourses: "Изучите популярные курсы",
    englishBasics: "Основы английского",
    englishBasicsDescription: "Надёжная база для начинающих.",
    price1: "$49 / мес",
    details: "Подробнее",
    webDevelopment: "Английский для веб‑разработки",
    webDevelopmentDescription: "Термины Frontend/Backend и практика.",
    price2: "$79 / мес",
    price3: "$99 / мес",
    viewAllCourses: "Смотреть все курсы",
    registerNow: "Зарегистрируйтесь сейчас",
    registerNowDescription: "Начните сегодня и ускорьте карьеру!",
    pages: "Страницы",
    address: "Адрес",
    phone: "Телефон",
    email: "Email",
    socialMedia: "Соцсети",
    allRightsReserved: "Все права защищены",

    // Courses page
    itEnglishCourses: "Курсы английского для IT",
    specializedEnglishCourses: "Специализированные курсы английского для IT",
    searchCourses: "Поиск курсов",
    level: "Уровень",
    allLevels: "Все уровни",
    beginner: "Начальный",
    intermediate: "Средний",
    advanced: "Продвинутый",
    duration: "Длительность",
    allDurations: "Любая длительность",
    shortDuration: "Короткая",
    mediumDuration: "Средняя",
    longDuration: "Длинная",
    availableCourses: "Доступные курсы",
    filter: "Фильтр",
    loading: "Загрузка...",
    lessons: "уроков",
    currency: "сум",
    viewCourse: "Перейти к курсу",
    noCoursesFound: "Курсы не найдены",
    active: "активный",

    // Theme / Language Switchers
    language: "Язык",
    change_theme: "Сменить тему",
    light: "Светлая",
    dark: "Тёмная",
    system: "Системная",

    // Notifications
    notifications: "Уведомления",
    mark_all_as_read: "Отметить все как прочитанные",
    no_notifications: "Пока нет уведомлений",
    cart: "Корзина",

    // Auth / Register page
    error: "Ошибка",
    fillAllFields: "Заполните все поля",
    passwordsDoNotMatch: "Пароли не совпадают",
    invalidEmailFormat: "Неверный формат email",
    invalidPhoneFormat: "Неверный формат телефона",
    usernameAlreadyExists: "Имя пользователя уже занято",
    emailAlreadyExists: "Email уже зарегистрирован",
    success: "Успех",
    registrationSuccessful: "Регистрация прошла успешно",
    registrationError: "Ошибка при регистрации",
    enterYourInformation: "Введите свои данные",
    firstName: "Имя",
    firstNamePlaceholder: "Ваше имя",
    lastName: "Фамилия",
    lastNamePlaceholder: "Ваша фамилия",
    phonePlaceholder: "+998 ...",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    registering: "Регистрация...",
    alreadyHaveAccount: "Уже есть аккаунт?",

    // Profile
    completed_lesson: "выполненный урок",
    days_ago: "дн. назад",
    profile_completion: "Заполнение профиля",
    student: "Студент",
    english_b2: "Английский B2",
    it_beginner: "IT начинающий",
    edit_profile: "Редактировать профиль",
    quick_links: "Быстрые ссылки",
    my_courses: "Мои курсы",
    certificates: "Сертификаты",
    support_chat: "Чат поддержки",
    browse_courses: "Смотреть курсы",
    overview: "Обзор",
    progress: "Прогресс",
    achievements: "Достижения",
    welcome_back: "С возвращением!",
    welcome_message: "Добро пожаловать, {name}",
    active_courses: "Активные курсы",
    completed_courses: "Завершённые курсы",

    // Profile Settings (keys with spaces preserved)
    settings: "Настройки",
    "manage account settings": "Управляйте настройками аккаунта",
    "profile information": "Информация профиля",
    "update profile information": "Обновите информацию профиля",
    "change avatar": "Сменить аватар",
    "remove avatar": "Удалить аватар",
    "first name": "Имя",
    "last name": "Фамилия",
    bio: "Био",
    "tell us about yourself": "Расскажите о себе",
    "preferred language": "Предпочитаемый язык",
    "select language": "Выберите язык",
    cancel: "Отмена",
    "save changes": "Сохранить изменения",
    "account settings": "Настройки аккаунта",
    "update account settings": "Обновите настройки аккаунта",
    "change password": "Сменить пароль",
    "current password": "Текущий пароль",
    "new password": "Новый пароль",
    "confirm password": "Подтвердите пароль",
    "danger zone": "Опасная зона",
    "danger zone description": "Удаление аккаунта необратимо",
    "delete account": "Удалить аккаунт",
    "notification settings": "Настройки уведомлений",
    "manage notification preferences": "Управляйте уведомлениями",
    "email notifications": "Email-уведомления",
    "receive email notifications": "Получать email-уведомления",
    "push notifications": "Push-уведомления",
    "receive push notifications": "Получать push-уведомления",
    "marketing emails": "Маркетинговые письма",
    "receive marketing emails": "Получать маркетинговые письма",
    "course updates": "Обновления курсов",
    "receive course updates": "Получать обновления курсов",

    // Auth context
    accountInactive: "Аккаунт неактивен",
    accountInactiveDescription:
      "Ваш аккаунт временно неактивен. Обратитесь в поддержку.",
    loginFailed: "Не удалось войти",
    usernameOrPasswordIncorrect: "Неверное имя пользователя или пароль",

    // Course chat
    audioRecordingStarted: "Запись аудио начата",
    pressStopToFinishRecording: "Нажмите 'Стоп' для завершения",
    failedToStartAudioRecording: "Ошибка запуска записи аудио",
    audioRecordingStopped: "Запись аудио остановлена",
    audioMessageSent: "Аудио‑сообщение отправлено",
    videoRecordingStarted: "Запись видео начата",
    failedToStartVideoRecording: "Ошибка запуска записи видео",
    videoRecordingStopped: "Запись видео остановлена",
    videoMessageSent: "Видео‑сообщение отправлено",
    callWithTeacher: "Звонок с преподавателем: {teacher}",
    callEnded: "Звонок завершён",
    callWithTeacherEnded: "Звонок с {teacher} завершён",
    pleaseEnterReportReason: "Пожалуйста, укажите причину",
    reportSubmitted: "Жалоба отправлена",
    thankYouForYourReport: "Спасибо за обращение",
    pleaseEnterApplicationDetails: "Пожалуйста, опишите детали заявки",
    applicationSubmitted: "Заявка отправлена",
    thankYouForYourApplication: "Спасибо за заявку",
    loadingChat: "Загрузка чата...",
    online: "Онлайн",
    offline: "Офлайн",
    reportProblem: "Сообщить о проблеме",
    reportProblemDescription: "Кратко опишите проблему",
    applyToTeach: "Заявка на преподавание",
    applyToTeachDescription: "Оставьте заявку по курсу {course}",
    audioCall: "Аудио‑звонок",
    videoCall: "Видео‑звонок",
    withTeacher: "Преподаватель: {teacher}",
    endCall: "Завершить звонок",
    startConversation: "Начните разговор",
    startConversationDescription: "Задайте вопросы по курсу {course}",
    recordingAudio: "Идёт запись аудио",
    recordingVideo: "Идёт запись видео",
    typeMessage: "Напишите сообщение",
    describeProblem: "Опишите проблему",
    submitReport: "Отправить",
    describeExperience: "Опишите опыт",
    submitApplication: "Отправить заявку",
  },
  en: {
    // Header / Navigation
    home: "Home",
    courses: "Courses",
    jobs: "Jobs",
    about: "About",
    contact: "Contact",
    profile: "Profile",
    account: "Account",
    logout: "Logout",
    login: "Login",
    register: "Register",
    search: "Search",
    adminPanel: "Admin Panel",

    // Home page
    learnEnglishForIT: "Learn English for IT",
    academyDescription:
      "Specialized English courses for IT professionals with modern methods.",
    viewCourses: "View Courses",
    contactUs: "Contact Us",
    academyImageAlt: "IT English Academy image",
    ourAdvantages: "Our Advantages",
    whyChooseUs: "Why Choose Us",
    itEnglish: "English for IT",
    itEnglishDescription: "Vocabulary and topics tailored for IT.",
    modernTeaching: "Modern Teaching",
    modernTeachingDescription: "Interactive lessons and real projects.",
    experiencedTeachers: "Experienced Teachers",
    experiencedTeachersDescription: "Classes with industry professionals.",
    practicalExercises: "Practical Exercises",
    practicalExercisesDescription: "Exercises for every topic.",
    smallGroups: "Small Groups",
    smallGroupsDescription: "Attention to every student.",
    guaranteedResult: "Guaranteed Result",
    guaranteedResultDescription: "Step-by-step progress to your goals.",
    popularCourses: "Popular Courses",
    explorePopularCourses: "Explore popular courses",
    englishBasics: "English Basics",
    englishBasicsDescription: "Solid foundation for beginners.",
    price1: "$49 / mo",
    details: "Details",
    webDevelopment: "English for Web Development",
    webDevelopmentDescription: "Frontend/Backend terms and practice.",
    price2: "$79 / mo",
    price3: "$99 / mo",
    viewAllCourses: "View all courses",
    registerNow: "Register Now",
    registerNowDescription: "Start today and accelerate your career!",
    pages: "Pages",
    address: "Address",
    phone: "Phone",
    email: "Email",
    socialMedia: "Social Media",
    allRightsReserved: "All rights reserved",

    // Courses page
    itEnglishCourses: "IT English Courses",
    specializedEnglishCourses: "Specialized English courses for IT",
    searchCourses: "Search courses",
    level: "Level",
    allLevels: "All levels",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    duration: "Duration",
    allDurations: "All durations",
    shortDuration: "Short",
    mediumDuration: "Medium",
    longDuration: "Long",
    availableCourses: "Available courses",
    filter: "Filter",
    loading: "Loading...",
    lessons: "lessons",
    currency: "UZS",
    viewCourse: "View course",
    noCoursesFound: "No courses found",
    active: "active",

    // Theme / Language Switchers
    language: "Language",
    change_theme: "Change theme",
    light: "Light",
    dark: "Dark",
    system: "System",

    // Notifications
    notifications: "Notifications",
    mark_all_as_read: "Mark all as read",
    no_notifications: "No notifications yet",
    cart: "Cart",

    // Auth / Register page
    error: "Error",
    fillAllFields: "Please fill in all fields",
    passwordsDoNotMatch: "Passwords do not match",
    invalidEmailFormat: "Invalid email format",
    invalidPhoneFormat: "Invalid phone format",
    usernameAlreadyExists: "Username already exists",
    emailAlreadyExists: "Email already exists",
    success: "Success",
    registrationSuccessful: "Registration successful",
    registrationError: "Registration error",
    enterYourInformation: "Enter your information",
    firstName: "First name",
    firstNamePlaceholder: "Your first name",
    lastName: "Last name",
    lastNamePlaceholder: "Your last name",
    phonePlaceholder: "+998 ...",
    password: "Password",
    confirmPassword: "Confirm password",
    registering: "Registering...",
    alreadyHaveAccount: "Already have an account?",

    // Profile
    completed_lesson: "completed lesson",
    days_ago: "days ago",
    profile_completion: "Profile completion",
    student: "Student",
    english_b2: "English B2",
    it_beginner: "IT beginner",
    edit_profile: "Edit profile",
    quick_links: "Quick links",
    my_courses: "My courses",
    certificates: "Certificates",
    support_chat: "Support chat",
    browse_courses: "Browse courses",
    overview: "Overview",
    progress: "Progress",
    achievements: "Achievements",
    welcome_back: "Welcome back!",
    welcome_message: "Welcome, {name}",
    active_courses: "Active courses",
    completed_courses: "Completed courses",

    // Profile Settings (keys with spaces preserved)
    settings: "Settings",
    "manage account settings": "Manage account settings",
    "profile information": "Profile information",
    "update profile information": "Update profile information",
    "change avatar": "Change avatar",
    "remove avatar": "Remove avatar",
    "first name": "First name",
    "last name": "Last name",
    bio: "Bio",
    "tell us about yourself": "Tell us about yourself",
    "preferred language": "Preferred language",
    "select language": "Select language",
    cancel: "Cancel",
    "save changes": "Save changes",
    "account settings": "Account settings",
    "update account settings": "Update account settings",
    "change password": "Change password",
    "current password": "Current password",
    "new password": "New password",
    "confirm password": "Confirm password",
    "danger zone": "Danger zone",
    "danger zone description": "Deleting your account is irreversible",
    "delete account": "Delete account",
    "notification settings": "Notification settings",
    "manage notification preferences": "Manage notification preferences",
    "email notifications": "Email notifications",
    "receive email notifications": "Receive email notifications",
    "push notifications": "Push notifications",
    "receive push notifications": "Receive push notifications",
    "marketing emails": "Marketing emails",
    "receive marketing emails": "Receive marketing emails",
    "course updates": "Course updates",
    "receive course updates": "Receive course updates",

    // Auth context
    accountInactive: "Account inactive",
    accountInactiveDescription:
      "Your account is temporarily inactive. Please contact support.",
    loginFailed: "Login failed",
    usernameOrPasswordIncorrect: "Incorrect username or password",

    // Course chat
    audioRecordingStarted: "Audio recording started",
    pressStopToFinishRecording: "Press 'Stop' to finish",
    failedToStartAudioRecording: "Failed to start audio recording",
    audioRecordingStopped: "Audio recording stopped",
    audioMessageSent: "Audio message sent",
    videoRecordingStarted: "Video recording started",
    failedToStartVideoRecording: "Failed to start video recording",
    videoRecordingStopped: "Video recording stopped",
    videoMessageSent: "Video message sent",
    callWithTeacher: "Call with teacher: {teacher}",
    callEnded: "Call ended",
    callWithTeacherEnded: "Call with {teacher} ended",
    pleaseEnterReportReason: "Please enter the reason",
    reportSubmitted: "Report submitted",
    thankYouForYourReport: "Thank you for your report",
    pleaseEnterApplicationDetails: "Please enter application details",
    applicationSubmitted: "Application submitted",
    thankYouForYourApplication: "Thank you for your application",
    loadingChat: "Loading chat...",
    online: "Online",
    offline: "Offline",
    reportProblem: "Report a problem",
    reportProblemDescription: "Briefly describe the problem",
    applyToTeach: "Apply to teach",
    applyToTeachDescription: "Leave an application for the {course} course",
    audioCall: "Audio call",
    videoCall: "Video call",
    withTeacher: "Teacher: {teacher}",
    endCall: "End call",
    startConversation: "Start a conversation",
    startConversationDescription: "Ask your questions about {course}",
    recordingAudio: "Recording audio",
    recordingVideo: "Recording video",
    typeMessage: "Type a message",
    describeProblem: "Describe the problem",
    submitReport: "Submit",
    describeExperience: "Describe your experience",
    submitApplication: "Submit application",
  },
};

const STORAGE_KEY = "language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("uz");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem(STORAGE_KEY) as Language;
      if (storedLanguage && ["uz", "ru", "en"].includes(storedLanguage)) {
        setLanguage(storedLanguage);
        document.documentElement.lang = storedLanguage;
      } else {
        document.documentElement.lang = "uz";
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const base =
      defaultTranslations[language]?.[key] ??
      defaultTranslations.en[key] ??
      key;
    if (!params) return base;
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
      base
    );
  };

  const value = {
    language,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;
      }
    },
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

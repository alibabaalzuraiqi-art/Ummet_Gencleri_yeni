export type EventCategory = 'workshop' | 'lecture' | 'volunteer' | 'training' | 'trip' | 'entertainment' | 'visit';

export interface UEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // ISO
  location: string;
  description: string;
  status: 'upcoming' | 'past';
  capacity: number;
  registered: number;
  image: string;
  showOnHomepage?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  fullContent?: string;
  pinnedOnHomepage?: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  year: string;
  joinedAt: string;
  registeredEvents: string[];
  status: 'active' | 'inactive';
  phone?: string;
}

export interface Suggestion {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentUniversity?: string;
  studentMajor?: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'implemented';
  adminReply?: string;
  adminDecision?: 'accepted' | 'reviewing' | 'unavailable';
  repliedAt?: string;
}

export interface AdminPlan {
  id: string;
  title: string;
  description: string;
  quarter: string;
  progress: number; // 0-100
  owner: string;
  status: 'planned' | 'in-progress' | 'completed';
  committee?: CommitteeId;
  authorRole?: string;
  authorId?: string;
  pdfUrl?: string;
}

export interface AdminReport {
  id: string;
  title: string;
  period: string;
  date: string;
  type: string;
  summary: string;
  committee?: CommitteeId;
  authorRole?: string;
  authorId?: string;
  pdfUrl?: string;
  isGeneral?: boolean;
}

export const categoryLabels: Record<EventCategory, string> = {
  workshop: 'ورشة عمل',
  lecture: 'محاضرة',
  volunteer: 'عمل تطوعي',
  training: 'تدريب',
  trip: 'رحلة',
  entertainment: 'ترفيهي',
  visit: 'زيارات',
};

export const categoryColors: Record<EventCategory, string> = {
  workshop: 'bg-navy-100 text-navy-700',
  lecture: 'bg-gold-100 text-gold-700',
  volunteer: 'bg-emerald-100 text-emerald-700',
  training: 'bg-sky-100 text-sky-700',
  trip: 'bg-rose-100 text-rose-700',
  entertainment: 'bg-fuchsia-100 text-fuchsia-700',
  visit: 'bg-teal-100 text-teal-700',
};

export const mockEvents: UEvent[] = [
  {
    id: 'e1',
    title: 'ورشة عمل: مهارات القيادة الشبابية',
    category: 'workshop',
    date: '2026-08-15T16:00:00',
    location: 'قاعة المؤتمرات الرئيسية - إسطنبول',
    description:
      'ورشة عمل تفاعلية تهدف إلى تنمية مهارات القيادة لدى الشباب، مع التركيز على اتخاذ القرار وإدارة الفرق وخطاب الجمهور.',
    status: 'upcoming',
    capacity: 80,
    registered: 54,
    image:
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    showOnHomepage: true,
  },
  {
    id: 'e2',
    title: 'محاضرة: هوية الأمة وتحديات العصر',
    category: 'lecture',
    date: '2026-08-22T18:00:00',
    location: 'المركز الثقافي - أنقرة',
    description:
      'محاضرة قيمة يتناول فيها المُحاضر التحديات التي تواجه هوية الأمة في العصر الحديث وسبائل التعامل معها بوعي ومسؤولية.',
    status: 'upcoming',
    capacity: 200,
    registered: 132,
    image:
      'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=1200',
    showOnHomepage: true,
  },
  {
    id: 'e3',
    title: 'حملة تطوعية: معًا نزرع الأمل',
    category: 'volunteer',
    date: '2026-09-05T09:00:00',
    location: 'حديقة المدينة العامة - بورصة',
    description:
      'حملة تطوعية لزراعة الأشجار وتنظيف الحدائق العامة، ضمن مبادرة الاتحاد للحفاظ على البيئة وتعزيز المسؤولية المجتمعية.',
    status: 'upcoming',
    capacity: 120,
    registered: 41,
    image:
      'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1200',
    showOnHomepage: true,
  },
  {
    id: 'e4',
    title: 'برنامج تدريبي: أساسيات الإعلام الرقمي',
    category: 'training',
    date: '2026-09-12T14:00:00',
    location: 'مختبر الحاسوب - مقر الاتحاد',
    description:
      'برنامج تدريبي مكثف يقدم أساسيات صناعة المحتوى الإعلامي الرقمي وإدارة منصات التواصل الاجتماعي باحترافية ومسؤولية.',
    status: 'upcoming',
    capacity: 40,
    registered: 38,
    image:
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e5',
    title: 'رحلة تثقيفية: آثار إسطنبول',
    category: 'trip',
    date: '2026-09-20T08:00:00',
    location: 'المعالم التاريخية - إسطنبول',
    description:
      'رحلة تثقيفية إلى أبرز المعالم التاريخية في إسطنبول، تستكشف المشاركون إرث المدينة العثماني وروائع عمارتها.',
    status: 'upcoming',
    capacity: 60,
    registered: 60,
    image:
      'https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e6',
    title: 'ملتقى الشباب الأول',
    category: 'lecture',
    date: '2026-05-10T17:00:00',
    location: 'قاعة الكبرى - إسطنبول',
    description:
      'ملتقى شبابي حضره أكثر من 300 شاب وشابة، تضمن لقاءات حوارية وورش مصاحبة وتوجيهات من قيادات الاتحاد.',
    status: 'past',
    capacity: 300,
    registered: 312,
    image:
      'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e7',
    title: 'دورة: إدارة المشاريع الشبابية',
    category: 'training',
    date: '2026-04-22T15:00:00',
    location: 'مقر الاتحاد - أنقرة',
    description:
      'دورة عملية في إدارة المشاريع الشبابية من التخطيط إلى التنفيذ والتقييم، خرج منها 45 متدربًا بشهادات معتمدة.',
    status: 'past',
    capacity: 45,
    registered: 45,
    image:
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e8',
    title: 'حملة: إفطار جماعي في رمضان',
    category: 'volunteer',
    date: '2026-03-18T18:30:00',
    location: 'ساحات المدينة - بورصة',
    description:
      'حملة خيرية نظمها الاتحاد لتقديم وجبات إفطار للمحتاجين طوال شهر رمضان، شارك فيها 80 متطوعًا ووزع 2400 وجبة.',
    status: 'past',
    capacity: 80,
    registered: 80,
    image:
      'https://images.pexels.com/photos/4252142/pexels-photo-4252142.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

export const mockNews: NewsItem[] = [
  {
    id: 'n1',
    title: 'الاتحاد يوقع اتفاقية شراكة مع جامعة إسطنبول',
    excerpt:
      'في خطوة لتعزيز التعاون الأكاديمي، وقّع الاتحاد اتفاقية شراكة مع جامعة إسطنبول تتيح للطلاب برامج تبادل وتدريب.',
    date: '2026-07-12',
    category: 'شراكات',
    image:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fullContent: 'في خطوة لتعزيز التعاون الأكاديمي، وقّع الاتحاد اتفاقية شراكة مع جامعة إسطنبول تتيح للطلاب برامج تبادل وتدريب. تأتي هذه الاتفاقية ضمن استراتيجية الاتحاد لتوسيع شبكة علاقاته الأكاديمية وتوفير فرص نوعية للطلاب.',
    pinnedOnHomepage: true,
  },
  {
    id: 'n2',
    title: 'انطلاق التسجيل في برنامج القادة الشبابي الصيفي',
    excerpt:
      'يفتح الاتحاد باب التسجيل في النسخة الثالثة من برنامج القادة الشبابي الصيفي، الذي يستقطب 100 طالب من مختلف الجامعات.',
    date: '2026-07-08',
    category: 'إعلانات',
    image:
      'https://images.pexels.com/photos/3184320/pexels-photo-3184320.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fullContent: 'يفتح الاتحاد باب التسجيل في النسخة الثالثة من برنامج القادة الشبابي الصيفي، الذي يستقطب 100 طالب من مختلف الجامعات. يشمل البرنامج ورش عمل تدريبية ومحاضرات تثقيفية وأنشطة تطوعية.',
    pinnedOnHomepage: true,
  },
  {
    id: 'n3',
    title: 'فريق الاتحاد يحصد المركز الأول في مسابقة الابتكار',
    excerpt:
      'حقق فريق الاتحاد المركز الأول في مسابقة الابتكار الشبابي على مستوى الجامعات، بمشروع بيئي لتحويل النفايات إلى طاقة.',
    date: '2026-06-30',
    category: 'إنجازات',
    image:
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fullContent: 'حقق فريق الاتحاد المركز الأول في مسابقة الابتكار الشبابي على مستوى الجامعات، بمشروع بيئي لتحويل النفايات إلى طاقة. يأتي هذا الإنجاز ثمرة لجهود متواصلة وبرامج تدريبية نوعية.',
    pinnedOnHomepage: true,
  },
];

export const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'أحمد يلدز',
    email: 'ahmed.yildiz@student.ummet.org',
    university: 'جامعة إسطنبول',
    major: 'هندسة الحاسوب',
    year: 'السنة الثالثة',
    joinedAt: '2025-09-14',
    registeredEvents: ['e1', 'e2', 'e6'],
    status: 'active',
    phone: '05321234567',
  },
  {
    id: 's2',
    name: 'فاطمة كايا',
    email: 'fatima.kaya@student.ummet.org',
    university: 'جامعة أنقرة',
    major: 'العلاقات الدولية',
    year: 'السنة الثانية',
    joinedAt: '2025-10-02',
    registeredEvents: ['e2', 'e3', 'e8'],
    status: 'active',
    phone: '05322345678',
  },
  {
    id: 's3',
    name: 'عمر ديمير',
    email: 'omar.demir@student.ummet.org',
    university: 'جامعة بورصة التقنية',
    major: 'إدارة الأعمال',
    year: 'السنة الرابعة',
    joinedAt: '2025-08-21',
    registeredEvents: ['e4', 'e7'],
    status: 'active',
    phone: '05323456789',
  },
  {
    id: 's4',
    name: 'مريم شاهين',
    email: 'meryem.sahin@student.ummet.org',
    university: 'جامعة مرمرة',
    major: 'الإعلام والاتصال',
    year: 'السنة الأولى',
    joinedAt: '2026-01-10',
    registeredEvents: ['e1', 'e5'],
    status: 'active',
    phone: '05324567890',
  },
  {
    id: 's5',
    name: 'يوسف أكسوي',
    email: 'yusuf.aksoy@student.ummet.org',
    university: 'جامعة إسطنبول التقنية',
    major: 'الهندسة المدنية',
    year: 'السنة الثالثة',
    joinedAt: '2025-11-05',
    registeredEvents: ['e3', 'e6', 'e8'],
    status: 'active',
    phone: '05325678901',
  },
  {
    id: 's6',
    name: 'سارة أوزترك',
    email: 'sara.ozturk@student.ummet.org',
    university: 'جامعة حاجي تبه',
    major: 'الطب البشري',
    year: 'السنة الثانية',
    joinedAt: '2026-02-18',
    registeredEvents: ['e2'],
    status: 'inactive',
    phone: '05326789012',
  },
  {
    id: 's7',
    name: 'خالد أرسلان',
    email: 'khaled.arslan@student.ummet.org',
    university: 'جامعة إسطنبول',
    major: 'الحقوق',
    year: 'السنة الرابعة',
    joinedAt: '2025-07-30',
    registeredEvents: ['e6', 'e7', 'e8'],
    status: 'active',
  },
  {
    id: 's8',
    name: 'نور هاكان',
    email: 'nour.hakan@student.ummet.org',
    university: 'جامعة بيلجي',
    major: 'تصميم الجرافيك',
    year: 'السنة الثانية',
    joinedAt: '2026-03-12',
    registeredEvents: ['e1', 'e4'],
    status: 'active',
  },
];

export const mockSuggestions: Suggestion[] = [
  {
    id: 'sg1',
    studentId: 's1',
    studentName: 'أحمد يلدز',
    studentEmail: 'ahmed.yildiz@student.ummet.org',
    studentUniversity: 'جامعة إسطنبول',
    studentMajor: 'هندسة الحاسوب',
    title: 'إضافة دورات في البرمجة والتقنية',
    body: 'أقترح تنظيم دورات تعليمية في أساسيات البرمجة وتطوير المواقع، لأن هناك إقبالًا كبيرًا من الطلاب على هذا المجال.',
    category: 'برامج',
    createdAt: '2026-07-05',
    status: 'reviewed',
  },
  {
    id: 'sg2',
    studentId: 's2',
    studentName: 'فاطمة كايا',
    studentEmail: 'fatima.kaya@student.ummet.org',
    studentUniversity: 'جامعة أنقرة',
    studentMajor: 'العلاقات الدولية',
    title: 'تخصيص ركن للطالبات في الفعاليات',
    body: 'سيكون من الرائع تخصيص أنشطة وندوات للطالبات بشكل دوري، تتناسب مع اهتماماتهن وتعزز مشاركتهن.',
    category: 'اقتراحات',
    createdAt: '2026-07-09',
    status: 'new',
  },
  {
    id: 'sg3',
    studentId: 's5',
    studentName: 'يوسف أكسوي',
    studentEmail: 'yusuf.aksoy@student.ummet.org',
    studentUniversity: 'جامعة إسطنبول التقنية',
    studentMajor: 'الهندسة المدنية',
    title: 'إنشاء نادٍ رياضي للاتحاد',
    body: 'أقترح تأسيس نادٍ رياضي ينظم مباريات دورية في كرة القدم والتنس، لتعزيز روح الفريق بين الأعضاء.',
    category: 'أنشطة',
    createdAt: '2026-06-28',
    status: 'implemented',
  },
];

export const mockPlans: AdminPlan[] = [
  {
    id: 'p1',
    title: 'توسيع البرامج الصيفية',
    description: 'زيادة عدد البرامج الصيفية بنسبة 40% والوصول إلى 500 طالب مشارك.',
    quarter: 'الربع الثالث 2026',
    progress: 65,
    owner: 'د. عبد الله قوني',
    status: 'in-progress',
    committee: 'presidency',
    authorRole: 'president',
    authorId: 'president@ummet.org',
  },
  {
    id: 'p2',
    title: 'إطلاق منصة رقمية للأنشطة',
    description: 'تطوير منصة إلكترونية متكاملة لإدارة التسجيل ومتابعة الأنشطة والاقتراحات.',
    quarter: 'الربع الرابع 2026',
    progress: 30,
    owner: 'م. سلمى أردوغان',
    status: 'in-progress',
    committee: 'activities',
    authorRole: 'committee-head',
    authorId: 'activities@ummet.org',
  },
  {
    id: 'p3',
    title: 'شراكات مع 5 جامعات جديدة',
    description: 'عقد اتفاقيات تعاون مع خمس جامعات إضافية لتوسيع قاعدة المستفيدين.',
    quarter: 'الربع الثالث 2026',
    progress: 100,
    owner: 'أ. خليل جوربوز',
    status: 'completed',
    committee: 'vice-presidency',
    authorRole: 'committee-head',
    authorId: 'vice.president@ummet.org',
  },
  {
    id: 'p4',
    title: 'تدريب 100 قائد شبابي',
    description: 'إعداد وتدريب 100 قائد شبابي قادر على إدارة المبادرات المجتمعية.',
    quarter: 'الربع الأول 2027',
    progress: 10,
    owner: 'د. عبد الله قوني',
    status: 'planned',
    committee: 'academic',
    authorRole: 'committee-head',
    authorId: 'academic@ummet.org',
  },
];

export const mockReports: AdminReport[] = [
  {
    id: 'r1',
    title: 'التقرير السنوي 2025',
    period: 'سنوي',
    date: '2026-01-15',
    type: 'تقرير سنوي',
    summary: 'ملخص شامل لإنجازات الاتحاد خلال عام 2025، شمل 24 فعالية و1200 مستفيد.',
    committee: 'presidency',
    authorRole: 'president',
    authorId: 'president@ummet.org',
    isGeneral: true,
  },
  {
    id: 'r2',
    title: 'تقرير الربع الثاني 2026',
    period: 'ربع سنوي',
    date: '2026-07-01',
    type: 'تقرير ربع سنوي',
    summary: 'تحليل أداء الأنشطة والبرامج في الربع الثاني ومؤشرات المشاركة.',
    committee: 'presidency',
    authorRole: 'president',
    authorId: 'president@ummet.org',
    isGeneral: true,
  },
  {
    id: 'r3',
    title: 'تقرير الحملة التطوعية الرمضانية',
    period: 'فعالية',
    date: '2026-04-05',
    type: 'تقرير لجنة',
    summary: 'توثيق نتائج حملة الإفطار الجماعي وتقييم الأثر المجتمعي.',
    committee: 'activities',
    authorRole: 'committee-head',
    authorId: 'activities@ummet.org',
  },
];

export const stats = {
  members: 1248,
  events: 86,
  universities: 24,
  volunteers: 540,
};

/* ===================== Student Application & Interview ===================== */

export type ApplicationStatus =
  | 'pending'        // طلب جديد قيد المراجعة
  | 'interview'      // تمت الموافقة المبدئية - مقابلة مجدولة
  | 'accepted'       // قبول نهائي
  | 'rejected';      // رفض

export interface InterviewInfo {
  date: string;   // ISO date
  time: string;   // HH:MM
  meetingUrl: string;
}

export interface StudentApplication {
  id: string;
  studentId: string;
  name: string;
  email: string;
  university: string;
  major: string;
  year: string;
  phone?: string;
  motivation: string;
  appliedAt: string;
  status: ApplicationStatus;
  interview?: InterviewInfo;
  decidedAt?: string;
  rejectionReason?: string;
}

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending: 'قيد المراجعة',
  interview: 'مقابلة مجدولة',
  accepted: 'مقبول',
  rejected: 'مرفوض',
};

export const applicationStatusColors: Record<ApplicationStatus, string> = {
  pending: 'bg-gold-100 text-gold-700',
  interview: 'bg-sky-100 text-sky-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

export const mockApplications: StudentApplication[] = [
  {
    id: 'app1',
    studentId: 'app-s1',
    name: 'إبراهيم تشيليك',
    email: 'ibrahim.celik@app.ummet.org',
    university: 'جامعة إسطنبول',
    major: 'العلوم السياسية',
    year: 'السنة الثانية',
    motivation: 'أرغب في الانضمام إلى الاتحاد لتطوير مهاراتي القيادية والمساهمة في خدمة المجتمع.',
    appliedAt: '2026-07-10',
    status: 'pending',
  },
  {
    id: 'app2',
    studentId: 'app-s2',
    name: 'عائشة كارا',
    email: 'ayshe.kara@app.ummet.org',
    university: 'جامعة أنقرة',
    major: 'الإعلام والاتصال',
    year: 'السنة الثالثة',
    motivation: 'أبحث عن منصة شبابية فعّالة أعبّر فيها عن طاقاتي وأخدم أمتي.',
    appliedAt: '2026-07-08',
    status: 'interview',
    interview: {
      date: '2026-07-28',
      time: '16:00',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
    },
  },
  {
    id: 'app3',
    studentId: 'app-s3',
    name: 'مصطفى أوزدمير',
    email: 'mustafa.ozdemir@app.ummet.org',
    university: 'جامعة بورصة التقنية',
    major: 'الهندسة الميكانيكية',
    year: 'السنة الأولى',
    motivation: 'طالب طموح يحب العمل التطوعي ويبحث عن بيئة شبابية محفّزة.',
    appliedAt: '2026-07-05',
    status: 'pending',
  },
  {
    id: 'app4',
    studentId: 'app-s4',
    name: 'زينب يلدريم',
    email: 'zeynep.yildirim@app.ummet.org',
    university: 'جامعة مرمرة',
    major: 'الحقوق',
    year: 'السنة الرابعة',
    motivation: 'خبرة في العمل التطوعي وأرغب في قيادة مبادرات مجتمعية ضمن الاتحاد.',
    appliedAt: '2026-06-28',
    status: 'interview',
    interview: {
      date: '2026-07-25',
      time: '14:00',
      meetingUrl: 'https://zoom.us/j/1234567890',
    },
  },
  {
    id: 'app5',
    studentId: 'app-s5',
    name: 'براء شين',
    email: 'baris.shin@app.ummet.org',
    university: 'جامعة إسطنبول التقنية',
    major: 'هندسة البرمجيات',
    year: 'السنة الثانية',
    motivation: 'مطور برمجيات أرغب في المساهمة التقنية في مشاريع الاتحاد.',
    appliedAt: '2026-06-20',
    status: 'accepted',
    decidedAt: '2026-07-01',
  },
  {
    id: 'app6',
    studentId: 'app-s6',
    name: 'ليلى مراد',
    email: 'leyla.murad@app.ummet.org',
    university: 'جامعة حاجي تبه',
    major: 'الصيدلة',
    year: 'السنة الثالثة',
    motivation: 'مهتمة بالعمل المجتمعي والصحي.',
    appliedAt: '2026-06-15',
    status: 'rejected',
    decidedAt: '2026-06-25',
    rejectionReason: 'لم يستوفي معايير القبول في هذه الدورة، نرحب بتقديمه مجددًا.',
  },
];

/* ===================== RBAC & Executive Board ===================== */

export type CommitteeId =
  | 'presidency'
  | 'vice-presidency'
  | 'media'
  | 'academic'
  | 'supervisory'
  | 'activities'
  | 'finance';

export type Role = 'student' | 'president' | 'committee-head';

export interface Committee {
  id: CommitteeId;
  name: string;
  shortName: string;
  icon: string; // lucide icon name
  color: string; // tailwind gradient classes
  description: string;
  responsibilities: string[];
  head: BoardMember;
  members: CommitteeMember[];
  stats: { label: string; value: string }[];
  vision?: string;
  goals?: string;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  email: string;
  phone?: string;
  university?: string;
  major?: string;
  year?: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  phone?: string;
  university?: string;
  major?: string;
  year?: string;
}

export const committeeMeta: Record<
  CommitteeId,
  { name: string; shortName: string; icon: string; color: string }
> = {
  presidency: { name: 'رئاسة الاتحاد', shortName: 'الرئاسة', icon: 'Crown', color: 'from-navy-700 to-navy-950' },
  'vice-presidency': { name: 'نائب الرئيس', shortName: 'النائب', icon: 'UserCog', color: 'from-navy-600 to-navy-800' },
  media: { name: 'اللجنة الإعلامية', shortName: 'الإعلام', icon: 'Megaphone', color: 'from-sky-600 to-sky-800' },
  academic: { name: 'اللجنة الأكاديمية', shortName: 'الأكاديمية', icon: 'GraduationCap', color: 'from-emerald-600 to-emerald-800' },
  supervisory: { name: 'اللجنة الرقابية', shortName: 'الرقابة', icon: 'ShieldCheck', color: 'from-rose-600 to-rose-800' },
  activities: { name: 'لجنة الأنشطة', shortName: 'الأنشطة', icon: 'CalendarDays', color: 'from-gold-500 to-gold-700' },
  finance: { name: 'اللجنة المالية', shortName: 'المالية', icon: 'Wallet', color: 'from-teal-600 to-teal-800' },
};

export const committeeOrder: CommitteeId[] = [
  'presidency',
  'vice-presidency',
  'media',
  'academic',
  'supervisory',
  'activities',
  'finance',
];

export const mockCommittees: Committee[] = [
  {
    id: 'presidency',
    name: 'رئاسة الاتحاد',
    shortName: 'الرئاسة',
    icon: 'Crown',
    color: 'from-navy-700 to-navy-950',
    description:
      'القيادة العليا للاتحاد، تتولى رسم السياسات العامة وتمثيل الاتحاد داخليًا وخارجيًا، والإشراف على عمل جميع اللجان والمكاتب.',
    responsibilities: [
      'رسم الرؤية الاستراتيجية والسياسات العامة للاتحاد',
      'تمثيل الاتحاد أمام المؤسسات والجهات الخارجية',
      'الإشراف العام على أداء جميع اللجان',
      'إقرار الخطط السنوية والموازنات',
      'رئاسة الاجتماعات الدورية للهيئة التنفيذية',
    ],
    head: {
      id: 'b1',
      name: 'د. عبد الله قوني',
      role: 'رئيس الاتحاد',
      bio: 'أكاديمي وقائد شبابي يحمل دكتوراه في العلوم السياسية، له خبرة واسعة في العمل المؤسسي والشبابي، يقود الاتحاد منذ عام 2024.',
      photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600',
      email: 'president@ummet.org',
      phone: '05312345678',
      university: 'جامعة إسطنبول',
      major: 'العلوم السياسية',
      year: 'دراسات عليا',
    },
    members: [
      { id: 'pm1', name: 'م. سلمى أردوغان', position: 'مستشار أول', photo: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05313456789', university: 'جامعة إسطنبول التقنية', major: 'الهندسة المدنية', year: 'دراسات عليا' },
      { id: 'pm2', name: 'أ. خليل جوربوز', position: 'منسق عام', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05314567890', university: 'جامعة أنقرة', major: 'إدارة المؤسسات', year: 'ماجستير' },
    ],
    stats: [
      { label: 'قرارات صادرة', value: '47' },
      { label: 'اجتماعات الهيئة', value: '32' },
      { label: 'شراكات خارجية', value: '18' },
    ],
  },
  {
    id: 'vice-presidency',
    name: 'نائب الرئيس',
    shortName: 'النائب',
    icon: 'UserCog',
    color: 'from-navy-600 to-navy-800',
    description:
      'المكتب التنفيذي لنائب الرئيس، يتولى متابعة تنفيذ القرارات وتنسيق العمل بين اللجان، ويتولى صلاحيات الرئيس في حال غيابه.',
    responsibilities: [
      'متابعة تنفيذ قرارات الرئيس والهيئة التنفيذية',
      'تنسيق العمل بين اللجان المختلفة',
      'الإشراف على الخطط التشغيلية',
      'تولي صلاحيات الرئيس في حال غيابه',
      'إعداد تقارير الأداء الدورية',
    ],
    head: {
      id: 'b2',
      name: 'أ. خليل جوربوز',
      role: 'نائب الرئيس',
      bio: 'قائد شبابي ومدير مشاريع، يحمل ماجستير في إدارة المؤسسات، يشغل منصب نائب الرئيس ويتولى التنسيق بين جميع اللجان.',
      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
      email: 'vice.president@ummet.org',
      phone: '05315678901',
      university: 'جامعة أنقرة',
      major: 'إدارة المؤسسات',
      year: 'ماجستير',
    },
    members: [
      { id: 'vm1', name: 'نور هاكان', position: 'منسق تنفيذي', photo: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05316789012', university: 'جامعة مرمرة', major: 'إدارة الأعمال', year: 'السنة الرابعة' },
    ],
    stats: [
      { label: 'متابعات تنفيذية', value: '64' },
      { label: 'جلسات تنسيق', value: '28' },
      { label: 'تقارير دورية', value: '12' },
    ],
  },
  {
    id: 'media',
    name: 'اللجنة الإعلامية',
    shortName: 'الإعلام',
    icon: 'Megaphone',
    color: 'from-sky-600 to-sky-800',
    description:
      'تتولى اللجنة الإعلامية إدارة صورة الاتحاد وتواصله مع الجمهور عبر المنصات الرقمية والمواد الإعلامية والتغطيات.',
    responsibilities: [
      'إدارة حسابات التواصل الاجتماعي للاتحاد',
      'تغطية الفعاليات والأنشطة إعلاميًا',
      'إنتاج المحتوى الرقمي والمطبوع',
      'التنسيق مع وسائل الإعلام الخارجية',
      'إصدار النشرات والمطبوعات الدورية',
    ],
    head: {
      id: 'b3',
      name: 'مريم شاهين',
      role: 'رئيسة اللجنة الإعلامية',
      bio: 'إعلامية متخصصة في الإعلام الرقمي، طالبة دراسات عليا في الاتصال، تقود فريق الإعلام وتشرف على منصات الاتحاد.',
      photo: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=600',
      email: 'media@ummet.org',
      phone: '05317890123',
      university: 'جامعة مرمرة',
      major: 'الإعلام والاتصال',
      year: 'دراسات عليا',
    },
    members: [
      { id: 'mm1', name: 'يوسف أكسوي', position: 'مصور صحفي', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05318901234', university: 'جامعة إسطنبول التقنية', major: 'الهندسة المدنية', year: 'السنة الثالثة' },
      { id: 'mm2', name: 'سارة أوزترك', position: 'كاتلة محتوى', photo: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05319012345', university: 'جامعة حاجي تبه', major: 'الطب البشري', year: 'السنة الثانية' },
    ],
    stats: [
      { label: 'منشورات سنوية', value: '320' },
      { label: 'متابعون', value: '12.4K' },
      { label: 'تغطيات إعلامية', value: '86' },
    ],
  },
  {
    id: 'academic',
    name: 'اللجنة الأكاديمية',
    shortName: 'الأكاديمية',
    icon: 'GraduationCap',
    color: 'from-emerald-600 to-emerald-800',
    description:
      'تهتم اللجنة الأكاديمية بالشأن العلمي للطلاب، عبر تنظيم الدورات التدريبية والندوات وورش العمل ودعم المسار الأكاديمي.',
    responsibilities: [
      'تنظيم الدورات التدريبية وورش العمل',
      'عقد الندوات والمحاضرات الأكاديمية',
      'دعم الطلاب أكاديميًا وتوجيههم',
      'الإشراف على المكتبة العلمية للاتحاد',
      'تنسيق البرامج مع الجامعات الشريكة',
    ],
    head: {
      id: 'b4',
      name: 'د. عبد الله قوني',
      role: 'رئيس اللجنة الأكاديمية',
      bio: 'أكاديمي متخصص في العلوم السياسية، يشرف على البرامج الأكاديمية ويقود فريق التنسيق مع الجامعات الشريكة.',
      photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600',
      email: 'academic@ummet.org',
      phone: '05312345678',
      university: 'جامعة إسطنبول',
      major: 'العلوم السياسية',
      year: 'دراسات عليا',
    },
    members: [
      { id: 'am1', name: 'أحمد يلدز', position: 'منسق برامج', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05321234567', university: 'جامعة إسطنبول', major: 'هندسة الحاسوب', year: 'السنة الثالثة' },
      { id: 'am2', name: 'فاطمة كايا', position: 'مدرّب', photo: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05322345678', university: 'جامعة أنقرة', major: 'العلاقات الدولية', year: 'السنة الثانية' },
    ],
    stats: [
      { label: 'دورات منفذة', value: '24' },
      { label: 'متدربون', value: '680' },
      { label: 'شراكات جامعية', value: '24' },
    ],
  },
  {
    id: 'supervisory',
    name: 'اللجنة الرقابية',
    shortName: 'الرقابة',
    icon: 'ShieldCheck',
    color: 'from-rose-600 to-rose-800',
    description:
      'اللجنة الرقابية هي الجهة المستقلة المسؤولة عن مراقبة الالتزام والشفافية داخل الاتحاد، وتقييم الأداء وضمان نزاهة العمل المؤسسي.',
    responsibilities: [
      'مراقبة الالتزام باللوائح والأنظمة',
      'تدقيق التقارير المالية والإدارية',
      'التحقيق في الشكاوى والمخالفات',
      'تقييم أداء اللجان والأعضاء',
      'إعداد تقارير الشفافية الدورية',
    ],
    head: {
      id: 'b5',
      name: 'أ. خالد أرسلان',
      role: 'رئيس اللجنة الرقابية',
      bio: 'خبير قانوني ومراجع حسابات، طالب دكتوراه في القانون العام، يشرف على الرقابة والالتزام داخل الاتحاد.',
      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
      email: 'supervisory@ummet.org',
      phone: '05313456789',
      university: 'جامعة أنقرة',
      major: 'القانون العام',
      year: 'دكتوراه',
    },
    members: [
      { id: 'sm1', name: 'عمر ديمير', position: 'مراجع مالي', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05323456789', university: 'جامعة بورصة التقنية', major: 'إدارة الأعمال', year: 'السنة الرابعة' },
    ],
    stats: [
      { label: 'تدقيقات منجزة', value: '18' },
      { label: 'تقارير شفافية', value: '6' },
      { label: 'شكاوى محلولة', value: '14' },
    ],
  },
  {
    id: 'activities',
    name: 'لجنة الأنشطة',
    shortName: 'الأنشطة',
    icon: 'CalendarDays',
    color: 'from-gold-500 to-gold-700',
    description:
      'تنظيم وإدارة الفعاليات والأنشطة الشبابية المتنوعة، من رحلات وندوات وحملات تطوعية، وتفعيل المشاركة الطلابية.',
    responsibilities: [
      'تخطيط وتنظيم الفعاليات والأنشطة',
      'إدارة الحملات التطوعية',
      'تنظيم الرحلات التثقيفية والترفيهية',
      'الإشراف على الأندية الطلابية',
      'تفعيل المشاركة الطلابية في الأنشطة',
    ],
    head: {
      id: 'b6',
      name: 'م. سلمى أردوغان',
      role: 'رئيسة لجنة الأنشطة',
      bio: 'مهندسة وقائدة شبابية، تنسق الفعاليات الكبرى للاتحاد وتشرف على فرق المتطوعين في مختلف المدن.',
      photo: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=600',
      email: 'activities@ummet.org',
      phone: '05314567890',
      university: 'جامعة إسطنبول التقنية',
      major: 'الهندسة المدنية',
      year: 'دراسات عليا',
    },
    members: [
      { id: 'acm1', name: 'يوسف أكسوي', position: 'منسق فعاليات', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05325678901', university: 'جامعة إسطنبول التقنية', major: 'الهندسة المدنية', year: 'السنة الثالثة' },
      { id: 'acm2', name: 'نور هاكان', position: 'منسق متطوعين', photo: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05316789012', university: 'جامعة مرمرة', major: 'إدارة الأعمال', year: 'السنة الرابعة' },
    ],
    stats: [
      { label: 'فعاليات منفذة', value: '86' },
      { label: 'متطوعون', value: '540' },
      { label: 'مستفيدون', value: '4.2K' },
    ],
  },
  {
    id: 'finance',
    name: 'اللجنة المالية',
    shortName: 'المالية',
    icon: 'Wallet',
    color: 'from-teal-600 to-teal-800',
    description:
      'تتولى اللجنة المالية إدارة الموارد المالية للاتحاد، وإعداد الموازنات ومتابعة الإيرادات والمصروفات وضمان الاستدامة المالية.',
    responsibilities: [
      'إعداد الموازنة السنوية للاتحاد',
      'متابعة الإيرادات والمصروفات',
      'إدارة التبرعات والرعايات',
      'إعداد التقارير المالية الدورية',
      'التنسيق مع اللجنة الرقابية للتدقيق',
    ],
    head: {
      id: 'b7',
      name: 'أ. عمر ديمير',
      role: 'رئيس اللجنة المالية',
      bio: 'خبير مالي ومحاسب معتمد، يدير الموازنة السنوية للاتحاد ويشرف على التبرعات والرعايات وضمان الشفافية المالية.',
      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
      email: 'finance@ummet.org',
      phone: '05323456789',
      university: 'جامعة بورصة التقنية',
      major: 'إدارة الأعمال',
      year: 'السنة الرابعة',
    },
    members: [
      { id: 'fm1', name: 'خالد أرسلان', position: 'محاسب', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', phone: '05313456789', university: 'جامعة أنقرة', major: 'القانون العام', year: 'دكتوراه' },
    ],
    stats: [
      { label: 'موازنة 2026', value: '480K ₺' },
      { label: 'تمويل مشاريع', value: '320K ₺' },
      { label: 'رعاة', value: '11' },
    ],
  },
];

/* Demo accounts for role-based login simulation */
export interface DemoAccount {
  email: string;
  name: string;
  role: Role;
  committee?: CommitteeId; // for committee-head role
}

export const demoAccounts: DemoAccount[] = [
  { email: 'president@ummet.org', name: 'د. عبد الله قوني', role: 'president' },
  { email: 'media@ummet.org', name: 'مريم شاهين', role: 'committee-head', committee: 'media' },
  { email: 'academic@ummet.org', name: 'د. عبد الله قوني', role: 'committee-head', committee: 'academic' },
  { email: 'supervisory@ummet.org', name: 'أ. خالد أرسلان', role: 'committee-head', committee: 'supervisory' },
  { email: 'activities@ummet.org', name: 'م. سلمى أردوغان', role: 'committee-head', committee: 'activities' },
  { email: 'finance@ummet.org', name: 'أ. عمر ديمير', role: 'committee-head', committee: 'finance' },
  { email: 'ahmed.yildiz@student.ummet.org', name: 'أحمد يلدز', role: 'student' },
];

/* ===== Student Guide dynamic content ===== */
export interface GuideContact {
  id: string;
  label: string;
  value: string;
  type: 'phone' | 'link';
}

export interface GuideItem {
  id: string;
  heading: string;
  body: string;
  tips: string[];
}

export interface GuideSectionData {
  id: string;
  label: string;
  icon: string; // lucide icon name
  color: string; // tailwind text color class
  bg: string; // tailwind bg color class
  title: string;
  intro: string;
  items: GuideItem[];
  contacts: GuideContact[];
}

export const initialGuideSections: GuideSectionData[] = [
  {
    id: 'registration',
    label: 'التسجيل الجامعي',
    icon: 'GraduationCap',
    color: 'text-navy-700',
    bg: 'bg-navy-100',
    title: 'دليل التسجيل الجامعي',
    intro: 'كل ما تحتاج معرفته للتسجيل في جامعة أتاتورك بأرضروم، من المستندات المطلوبة إلى خطوات التسجيل الإلكتروني.',
    items: [
      {
        id: 'reg-1',
        heading: 'المستندات المطلوبة',
        body: 'تأكد من إعداد جميع المستندات التالية قبل بدء عملية التسجيل:',
        tips: [
          'جواز السفر الأصلي + صورة مصدقة عنه',
          'شهادة الثانوية العامة مصدقة ومترجمة إلى التركية أو الإنجليزية',
          'صورة شخصية حديثة (6 صور)',
          'كشف درجات التوفق (إن وُجد)',
          'خطاب قبول من الجامعة (إن وُجد)',
        ],
      },
      {
        id: 'reg-2',
        heading: 'خطوات التسجيل الإلكتروني',
        body: 'يمكنك التسجيل عبر البوابة الإلكترونية للجامعة باتباع الخطوات التالية:',
        tips: [
          'الدخول إلى موقع جامعة أتاتورك: eru.edu.tr',
          'إنشاء حساب طالب جديد في نظام التسجيل',
          'تعبئة البيانات الشخصية والأكاديمية بدقة',
          'رفع المستندات المطلوبة بصيغة PDF',
          'مراجعة الطلب وإرساله',
        ],
      },
      {
        id: 'reg-3',
        heading: 'رسوم التسجيل',
        body: 'تختلف الرسوم حسب التخصص ونوع القبول. الطلاب الدوليون قد يستفيدون من منحة تقليل الرسوم. راجع صفحة الرسوم على موقع الجامعة لمعرفة التفاصيل.',
        tips: [],
      },
    ],
    contacts: [
      { id: 'reg-c1', label: 'قسم شؤون الطلاب الدوليين', value: '+90 442 231 0000', type: 'phone' },
      { id: 'reg-c2', label: 'موقع التسجيل', value: 'eru.edu.tr/ogrenci', type: 'link' },
    ],
  },
  {
    id: 'housing',
    label: 'السكن الطلابي',
    icon: 'Home',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
    title: 'دليل السكن الطلبي',
    intro: 'خيارات السكن المتاحة للطلاب في مدينة أرضروم، من سكن الجامعة إلى الشقق الخاصة.',
    items: [
      {
        id: 'h-1',
        heading: 'سكن الطلاب الحكومي (KYK)',
        body: 'يوفر مركز KYK سكنًا طلابيًا بأسعار مدعومة. التسجيل يكون عبر الموقع الإلكتروني في موعد محدد سنويًا.',
        tips: [
          'الموقع: حي ينيشهير، أرضروم',
          'الرسوم الشهرية: تقريبًا 500-800 ليرة تركية',
          'تشمل: وجبات، إنترنت، غسيل',
          'التسجيل عبر: kyk.gov.tr',
        ],
      },
      {
        id: 'h-2',
        heading: 'الشقق الخاصة',
        body: 'تتوفر شقق مفروشة وغير مفروشة في محيط الجامعة. يفضل البحث المبكر قبل بداية العام الدراسي.',
        tips: [
          'السعر الشهري لشقة 1+1: 4000-7000 ليرة',
          'السعر الشهري لشقة 2+1: 6000-10000 ليرة',
          'يفضل السكن في أحياء: ينيشهير، كازيم كارابيكير، مركز المدينة',
        ],
      },
      {
        id: 'h-3',
        heading: 'السكن العائلي (Aile Yanı)',
        body: 'خيار اقتصادي للإقامة مع عائلة تركية، يشمل غرفة ووجبات. مناسب للطلاب الذين يفضلون بيئة هادئة.',
        tips: [
          'السعر الشهري: 3000-5000 ليرة (شامل الوجبات)',
          'يمكن البحث عنه عبر مجموعات فيسبوك للطلاب العرب في أرضروم',
        ],
      },
    ],
    contacts: [
      { id: 'h-c1', label: 'مركز KYK للسكن الطلابي', value: '+90 442 213 0000', type: 'phone' },
      { id: 'h-c2', label: 'موقع KYK', value: 'kyk.gov.tr', type: 'link' },
    ],
  },
  {
    id: 'transport',
    label: 'المواصلات',
    icon: 'Bus',
    color: 'text-sky-700',
    bg: 'bg-sky-100',
    title: 'دليل المواصلات',
    intro: 'كيفية التنقل في مدينة أرضروم بين الجامعة والسكن والمناطق الحيوية.',
    items: [
      {
        id: 't-1',
        heading: 'الحافلات البلدية',
        body: 'تغطي حافلات البلدية معظم أنحاء المدينة بتذكرة موحدة رخيصة.',
        tips: [
          'سعر التذكرة: 15 ليرة تركية',
          'يمكن استخدام بطاقة ErzurumKart للدفع',
          'الخطوط 1 و 3 تصل إلى الحرم الجامعي',
          'المواعيد: 6:00 صباحًا - 11:30 مساءً',
        ],
      },
      {
        id: 't-2',
        heading: 'المترو (صغير)',
        body: 'يوجد خط مترو صغير يربط بين وسط المدينة ومحطة الحافلات، مرورًا ببعض المناطق الطلابية.',
        tips: [
          'المحطات الرئيسية: أزiziye، كازيم كارابيكير، الحرم الجامعي',
          'سعر التذكرة: 15 ليرة',
          'المواعيد: 6:00 - 24:00',
        ],
      },
      {
        id: 't-3',
        heading: 'سيارات الأجرة',
        body: 'تتوفر سيارات الأجرة في جميع أنحاء المدينة. يفضل استخدام تطبيقات مثل BiTaksi للحصول على أسعار أفضل.',
        tips: [
          'السعر الأدنى: 30 ليرة',
          'تطبيق BiTaksi متاح في أرضروم',
        ],
      },
    ],
    contacts: [
      { id: 't-c1', label: 'شركة البلدية للمواصلات', value: '+90 442 215 0000', type: 'phone' },
      { id: 't-c2', label: 'تطبيق BiTaksi', value: 'bitaksi.com', type: 'link' },
    ],
  },
  {
    id: 'libraries',
    label: 'المكتبات والخدمات الأكاديمية',
    icon: 'Library',
    color: 'text-gold-700',
    bg: 'bg-gold-100',
    title: 'المكتبات والخدمات الأكاديمية',
    intro: 'المكتبات ومراكز الدراسة والخدمات الأكاديمية المتاحة للطلاب في جامعة أتاتورك.',
    items: [
      {
        id: 'lib-1',
        heading: 'مكتبة جامعة أتاتورك المركزية',
        body: 'مكتبة كبيرة تضم آلاف الكتب والمراجع باللغات التركية والإنجليزية والعربية. توفر أماكن للدراسة الفردية والجماعية.',
        tips: [
          'الموقع: داخل الحرم الجامعي الرئيسي',
          'مواعيد العمل: 8:00 صباحًا - 12:00 منتصف الليل',
          'خدمة استعارة الكتب مجانية للطلاب المسجلين',
          'توفر إنترنت مجاني وغرف دراسة',
        ],
      },
      {
        id: 'lib-2',
        heading: 'قواعد البيانات الإلكترونية',
        body: 'تتيح الجامعة لطلابها الوصول إلى قواعد بيانات أكاديمية عالمية مجانًا عبر حساب الطالب.',
        tips: [
          'EBSCO, Scopus, Web of Science',
          'JSTOR, ScienceDirect',
          'الوصول عبر: library.eru.edu.tr',
        ],
      },
      {
        id: 'lib-3',
        heading: 'مركز الدعم الأكاديمي',
        body: 'يقدم المركز خدمات الدعم الدراسي للطلاب الذين يواجهون صعوبات في المواد، بالإضافة إلى دورات تقوية.',
        tips: [
          'دروس تقوية مجانية في الرياضيات والفيزياء واللغة الإنجليزية',
          'استشارات أكاديمية فردية',
          'الموقع: مبنى الدعم الطلابي',
        ],
      },
    ],
    contacts: [
      { id: 'lib-c1', label: 'المكتبة المركزية', value: '+90 442 231 0000', type: 'phone' },
      { id: 'lib-c2', label: 'المكتبة الإلكترونية', value: 'library.eru.edu.tr', type: 'link' },
    ],
  },
];

/* ===== Media Gallery dynamic content ===== */
export interface GalleryMedia {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
}

export interface GalleryCategory {
  id: string;
  label: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  categoryId: string;
  date: string;
  location: string;
  coverImage: string;
  photoCount: number;
  videoCount: number;
  description: string;
  media: GalleryMedia[];
}

export const initialGalleryCategories: GalleryCategory[] = [
  { id: 'football', label: 'كرة القدم' },
  { id: 'skiing', label: 'رحلات التزلج' },
  { id: 'academic', label: 'الأنشطة الأكاديمية' },
  { id: 'erzurum', label: 'حفل أرضروم' },
];

export const initialGalleryAlbums: GalleryAlbum[] = [
  {
    id: 'a1',
    title: 'بطولة كرة القدم الربيعية',
    categoryId: 'football',
    date: '2026-05-15',
    location: 'ملعب أتاتورك، أرضروم',
    coverImage: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
    photoCount: 48,
    videoCount: 3,
    description: 'البطولة السنوية لكرة القدم بين الفرق الطلابية، بمشاركة 8 فرق من مختلف الجامعات.',
    media: [
      { id: 'a1m1', type: 'photo', url: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'افتتاح البطولة' },
      { id: 'a1m2', type: 'photo', url: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'المباراة النهائية' },
      { id: 'a1m3', type: 'photo', url: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'تتويج الفائزين' },
      { id: 'a1m4', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'ملخص البطولة' },
    ],
  },
  {
    id: 'a2',
    title: 'مباراة النهائي الكروي',
    categoryId: 'football',
    date: '2026-05-22',
    location: 'استاد كازيم كارابيكير',
    coverImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800',
    photoCount: 62,
    videoCount: 5,
    description: 'مباراة نهائية مثيرة جمعت فريقي اتحاد شباب الأمة واتحاد الطلاب العرب.',
    media: [
      { id: 'a2m1', type: 'photo', url: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'بداية المباراة' },
      { id: 'a2m2', type: 'photo', url: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'هدف الفوز' },
      { id: 'a2m3', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'أبرز اللقطات' },
    ],
  },
  {
    id: 'a3',
    title: 'رحلة تزلج جبال بالكاندي',
    categoryId: 'skiing',
    date: '2026-02-10',
    location: 'منتجع بالكاندي للتزلج',
    coverImage: 'https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=800',
    photoCount: 85,
    videoCount: 7,
    description: 'رحلة تزلج لا تُنسى على جبال أرضروم الثلجية، بمشاركة أكثر من 60 طالبًا.',
    media: [
      { id: 'a3m1', type: 'photo', url: 'https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'قمة الجبل' },
      { id: 'a3m2', type: 'photo', url: 'https://images.pexels.com/photos/848613/pexels-photo-848613.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'التزلج على المنحدرات' },
      { id: 'a3m3', type: 'photo', url: 'https://images.pexels.com/photos/848614/pexels-photo-848614.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'غروب الشمس' },
      { id: 'a3m4', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'فيديو الرحلة' },
    ],
  },
  {
    id: 'a4',
    title: 'يوم التزلج الشتوي',
    categoryId: 'skiing',
    date: '2026-01-20',
    location: 'منتجع كوناكلي',
    coverImage: 'https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=800',
    photoCount: 54,
    videoCount: 4,
    description: 'يوم مليء بالمرح والتزلج على المنحدرات الثلجية في كوناكلي.',
    media: [
      { id: 'a4m1', type: 'photo', url: 'https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'وصول المنتجع' },
      { id: 'a4m2', type: 'photo', url: 'https://images.pexels.com/photos/848613/pexels-photo-848613.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'تدريبات التزلج' },
    ],
  },
  {
    id: 'a5',
    title: 'المؤتمر الأكاديمي السنوي',
    categoryId: 'academic',
    date: '2026-04-05',
    location: 'قاعة المؤتمرات، جامعة أتاتورك',
    coverImage: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    photoCount: 72,
    videoCount: 6,
    description: 'مؤتمر علمي ضم باحثين وطلابًا من مختلف التخصصات لعرض أوراقهم البحثية.',
    media: [
      { id: 'a5m1', type: 'photo', url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'افتتاح المؤتمر' },
      { id: 'a5m2', type: 'photo', url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'ورشة بحثية' },
      { id: 'a5m3', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'كلمة الافتتاح' },
    ],
  },
  {
    id: 'a6',
    title: 'ورشة عمل المهارات القيادية',
    categoryId: 'academic',
    date: '2026-03-18',
    location: 'مركز التطوير الطلابي',
    coverImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    photoCount: 38,
    videoCount: 2,
    description: 'ورشة تدريبية مكثفة لتطوير مهارات القيادة وإدارة الفرق لدى الطلاب.',
    media: [
      { id: 'a6m1', type: 'photo', url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'جلسة تدريبية' },
      { id: 'a6m2', type: 'photo', url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'عمل جماعي' },
    ],
  },
  {
    id: 'a7',
    title: 'حفل أرضروم السنوي',
    categoryId: 'erzurum',
    date: '2026-06-28',
    location: 'قصر المؤتمرات، أرضروم',
    coverImage: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800',
    photoCount: 120,
    videoCount: 12,
    description: 'الحفل السنوي الكبير لاتحاد شباب الأمة، سهرة فنية وثقافية لا تُنسى.',
    media: [
      { id: 'a7m1', type: 'photo', url: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'قاعة الحفل' },
      { id: 'a7m2', type: 'photo', url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'عروض فنية' },
      { id: 'a7m3', type: 'photo', url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'تكريم المتميزين' },
      { id: 'a7m4', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'تغطية الحفل' },
    ],
  },
  {
    id: 'a8',
    title: 'احتفالات يوم الأمة',
    categoryId: 'erzurum',
    date: '2026-03-01',
    location: 'ساحة أزiziye، أرضروم',
    coverImage: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
    photoCount: 95,
    videoCount: 8,
    description: 'احتفال كبير بيوم الأمة شمل عروضًا ثقافية وأنشطة شبابية متنوعة.',
    media: [
      { id: 'a8m1', type: 'photo', url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'ساحة الاحتفال' },
      { id: 'a8m2', type: 'photo', url: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'العروض الثقافية' },
    ],
  },
];

/* ===== FAQ dynamic content ===== */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategoryData {
  id: string;
  title: string;
  icon: string;
  color: string;
  bg: string;
  items: FAQItem[];
}

export const initialFAQCategories: FAQCategoryData[] = [
  {
    id: 'join',
    title: 'كيفية الانضمام للاتحاد',
    icon: 'Users',
    color: 'text-navy-700',
    bg: 'bg-navy-100',
    items: [
      { id: 'j1', question: 'كيف أصبح عضوًا في اتحاد شباب الأمة؟', answer: 'يمكنك التقديم لعضوية الاتحاد عبر إنشاء حساب جديد على موقعنا وتعبئة نموذج طلب الانضمام. سيتم مراجعة طلبك من قبل إدارة الاتحاد، وفي حال الموافقة المبدئية سيتم دعوتك لمقابلة شخصية قبل القبول النهائي.' },
      { id: 'j2', question: 'ما هي شروط الانضمام؟', answer: 'يشترط أن يكون المتقدم طالبًا جامعيًا في إحدى الجامعات التركية، وملتزمًا بقيم ومبادئ الاتحاد. يفضل أن يكون لديه اهتمام بالعمل التطوعي والأنشطة الشبابية. لا يُشترط عربيًا، فالاتحاد مفتوح لكل الطلاب المتفقين مع رؤيته.' },
      { id: 'j3', question: 'كم تستغرق عملية القبول؟', answer: 'بعد تقديم الطلب، تستغرق المراجعة المبدئية عادة 3-5 أيام عمل. في حال الموافقة المبدئية، يتم جدولة مقابلة شخصية خلال أسبوع. القرار النهائي يُتخذ خلال 2-3 أيام بعد المقابلة.' },
      { id: 'j4', question: 'هل هناك رسوم لعضوية الاتحاد؟', answer: 'لا، عضوية اتحاد شباب الأمة مجانية تمامًا. لا توجد أي رسوم تسجيل أو اشتراك شهري. الاتحاد يعتمد على المتطوعين والتبرعات في تمويل أنشطته.' },
    ],
  },
  {
    id: 'services',
    title: 'الاستفادة من الخدمات',
    icon: 'Shield',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
    items: [
      { id: 's1', question: 'ما الخدمات التي يقدمها الاتحاد للأعضاء؟', answer: 'يقدم الاتحاد مجموعة متنوعة من الخدمات تشمل: الأنشطة الرياضية (كرة القدم، التزلج)، الأنشطة الأكاديمية (مؤتمرات، ورش عمل)، الرحلات الترفيهية، الإرشاد الطلابي، دليل الطالب للمدينة، والأنشطة الثقافية والاجتماعية.' },
      { id: 's2', question: 'كيف أسجل في الفعاليات والأنشطة؟', answer: 'بعد تسجيل الدخول إلى حسابك، يمكنك تصفح الفعاليات المتاحة في صفحة "البرامج والأنشطة" والضغط على زر "سجل الآن" في أي فعالية تهمك. ستجد جميع تسجيلاتك في لوحة تحكم الطالب.' },
      { id: 's3', question: 'هل الفعاليات مفتوحة لغير الأعضاء؟', answer: 'بعض الفعاليات العامة مفتوحة للجميع، بينما بعض الأنشطة الخاصة مقتصرة على الأعضاء المسجلين فقط. يمكنك التحقق من حالة الفعالية في صفحة البرامج والأنشطة.' },
      { id: 's4', question: 'كيف أحصل على دليل الطالب لمدينة أرضروم؟', answer: 'يمكنك الوصول إلى دليل الطالب الشامل من القائمة العلوية للموقع. الدليل يحتوي على معلومات مفصلة عن التسجيل الجامعي، السكن الطلابي، المواصلات، والمكتبات والخدمات الأكاديمية.' },
    ],
  },
  {
    id: 'committees',
    title: 'المشاركة في اللجان',
    icon: 'ClipboardList',
    color: 'text-gold-700',
    bg: 'bg-gold-100',
    items: [
      { id: 'c1', question: 'ما اللجان المتاحة للانضمام إليها؟', answer: 'يضم الاتحاد عدة لجان متخصصة: لجنة الإعلام والنشر، اللجنة الرياضية، اللجنة الثقافية، اللجنة الأكاديمية، لجنة التطوع، واللجنة المالية. كل لجنة لها مهام وأهداف محددة.' },
      { id: 'c2', question: 'كيف أنضم إلى لجنة معينة؟', answer: 'بعد أن تصبح عضوًا مقبولًا في الاتحاد، يمكنك التواصل مع رئيس اللجنة التي تهمك عبر صفحة "اللجان" في الموقع. سيقوم رئيس اللجنة بتقييم طلبك وإبلاغك بقرار الانضمام.' },
      { id: 'c3', question: 'هل يمكنني الانضمام لأكثر من لجنة؟', answer: 'نعم، يمكنك الانضمام إلى لجنتين كحد أقصى في وقت واحد لضمان التزامك الفعلي بكل لجنة. يفضل التركيز على لجنة واحدة في البداية للتأقلم قبل التوسع.' },
      { id: 'c4', question: 'ما هي مسؤوليات عضو اللجنة؟', answer: 'تشمل المسؤوليات: حضور اجتماعات اللجنة الدورية، المساهمة في تنظيم الفعاليات، تنفيذ المهام الموكلة إليك، والمشاركة الفعالة في اتخاذ قرارات اللجنة. تختلف التفاصيل حسب نوع اللجنة.' },
    ],
  },
];

/* ===== Contact page dynamic content ===== */
export interface ContactCardData {
  id: string;
  icon: string;
  title: string;
  value: string;
  sub: string;
  ltr?: boolean;
}

export const initialContactCards: ContactCardData[] = [
  { id: 'address', icon: 'MapPin', title: 'العنوان', value: 'أرضروم، تركيا - جامعة أتاتورك', sub: 'مقر الاتحاد الرئيسي' },
  { id: 'email', icon: 'Mail', title: 'البريد الإلكتروني', value: 'info@ummet.org', sub: 'للاستفسارات العامة', ltr: true },
  { id: 'phone', icon: 'Phone', title: 'الهاتف', value: '+90 442 231 0000', sub: 'من 9ص حتى 6م', ltr: true },
  { id: 'hours', icon: 'Clock', title: 'ساعات العمل', value: 'الإثنين - الجمعة', sub: '9:00 صباحًا - 6:00 مساءً' },
];

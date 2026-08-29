import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import {
  mockEvents,
  mockNews,
  mockStudents,
  mockSuggestions,
  mockPlans,
  mockReports,
  mockCommittees,
  demoAccounts,
  type UEvent,
  type NewsItem,
  type Student,
  type Suggestion,
  type AdminPlan,
  type AdminReport,
  type CommitteeId,
  type Role,
  type BoardMember,
  type Committee,
  type CommitteeMember,
  type StudentApplication,
  type ApplicationStatus,
  type InterviewInfo,
  type GuideSectionData,
  initialGuideSections,
  type GalleryAlbum,
  type GalleryCategory,
  initialGalleryAlbums,
  initialGalleryCategories,
  type FAQCategoryData,
  type FAQItem,
  initialFAQCategories,
  type ContactCardData,
  initialContactCards,
} from '../data/mockData';

export type View =
  | { kind: 'home' }
  | { kind: 'about' }
  | { kind: 'programs' }
  | { kind: 'contact' }
  | { kind: 'gallery' }
  | { kind: 'guide' }
  | { kind: 'faq' }
  | { kind: 'login' }
  | { kind: 'register' }
  | { kind: 'student-dashboard' }
  | { kind: 'admin' }
  | { kind: 'board' }
  | { kind: 'committee'; committeeId: CommitteeId };

export interface CurrentUser {
  name: string;
  email: string;
  role: Role;
  committee?: CommitteeId;
}

export type MemberRole =
  | 'رئيس الاتحاد'
  | 'نائب الرئيس'
  | 'المسؤول الإعلامي'
  | 'المسؤول الأكاديمي'
  | 'مسؤول الأنشطة'
  | 'المسؤول المالي'
  | 'الرقابة'
  | 'عضو';

export interface UnifiedMember {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  year: string;
  phone?: string;
  photo: string;
  role: MemberRole;
  committee?: CommitteeId;
  joinedAt: string;
  status: 'active' | 'inactive';
}

const MEMBER_ROLES_BY_COMMITTEE: Record<CommitteeId, MemberRole> = {
  presidency: 'رئيس الاتحاد',
  'vice-presidency': 'نائب الرئيس',
  media: 'المسؤول الإعلامي',
  academic: 'المسؤول الأكاديمي',
  activities: 'مسؤول الأنشطة',
  finance: 'المسؤول المالي',
  supervisory: 'الرقابة',
};

const COMMITTEE_BY_ROLE: Partial<Record<MemberRole, CommitteeId>> = {
  'رئيس الاتحاد': 'presidency',
  'نائب الرئيس': 'vice-presidency',
  'المسؤول الإعلامي': 'media',
  'المسؤول الأكاديمي': 'academic',
  'مسؤول الأنشطة': 'activities',
  'المسؤول المالي': 'finance',
  'الرقابة': 'supervisory',
};

const DEFAULT_PHOTO = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400';

function seedMembersFromCommittees(committees: typeof mockCommittees): UnifiedMember[] {
  const out: UnifiedMember[] = [];
  const seen = new Set<string>();
  for (const c of committees) {
    if (c.head?.name && c.head.email) {
      const key = c.head.email.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push({
          id: c.head.id || 'm-' + key,
          name: c.head.name,
          email: c.head.email,
          university: c.head.university ?? '—',
          major: c.head.major ?? '—',
          year: c.head.year ?? '—',
          phone: c.head.phone ?? '',
          photo: c.head.photo || DEFAULT_PHOTO,
          role: MEMBER_ROLES_BY_COMMITTEE[c.id] ?? 'عضو',
          committee: c.id,
          joinedAt: '—',
          status: 'active',
        });
      }
    }
    for (const m of c.members) {
      if (m?.name) {
        const key = (m.id || m.name).toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          out.push({
            id: m.id || 'm-' + key,
            name: m.name,
            email: '',
            university: m.university ?? '—',
            major: m.major ?? '—',
            year: m.year ?? '—',
            phone: m.phone ?? '',
            photo: m.photo || DEFAULT_PHOTO,
            role: 'عضو',
            committee: c.id,
            joinedAt: '—',
            status: 'active',
          });
        }
      }
    }
  }
  return out;
}

export interface GeneralInfo {
  vision: string;
  goals: string;
  studentStats: string;
  contactLinks: { label: string; url: string }[];
}

export type AdminSection =
  | 'general'
  | 'board'
  | 'events'
  | 'members'
  | 'applications'
  | 'plans'
  | 'gallery'
  | 'guide'
  | 'stats'
  | 'homepage'
  | 'about-page';

export interface AboutContent {
  header: { badge: string; title: string; description: string };
  story: {
    badge: string;
    title: string;
    paragraphs: string[];
    images: string[];
  };
  mission: {
    badge: string;
    title: string;
    cards: { icon: string; title: string; text: string }[];
  };
  goals: {
    badge: string;
    title: string;
    cards: { icon: string; title: string; desc: string }[];
  };
  cta: {
    icon: string;
    title: string;
    description: string;
    buttonText: string;
  };
}

export interface SiteContent {
  brand: {
    name: string;
    nameTr: string;
    logoIcon: string;
  };
  footer: {
    phone: string;
    email: string;
    address: string;
    copyright: string;
    social: { facebook: string; twitter: string; instagram: string; youtube: string };
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    primaryBtn: string;
    secondaryBtn: string;
    tertiaryBtn: string;
    image: string;
    badge1: { value: string; label: string };
    badge2: { value: string; label: string };
  };
  stats: { value: number; label: string; icon: string }[];
  about: {
    badge: string;
    title: string;
    description: string;
    image: string;
    imageBadge: { value: string; label: string };
    features: { icon: string; title: string; desc: string }[];
  };
  boardPreview: {
    title: string;
    subtitle: string;
    description: string;
    memberIds: string[];
  };
}

export function canEditSection(user: CurrentUser | null, section: AdminSection): boolean {
  if (!user) return false;
  if (user.role === 'president') return true;
  if (user.role === 'committee-head') {
    if (user.committee === 'media') return ['gallery', 'homepage', 'about-page'].includes(section);
    if (user.committee === 'academic') return ['guide', 'events'].includes(section);
    if (user.committee === 'activities') return ['events'].includes(section);
    if (user.committee === 'finance') return ['plans'].includes(section);
    if (user.committee === 'supervisory') return ['members'].includes(section);
    return false;
  }
  return false;
}

interface AppContextValue {
  view: View;
  setView: (v: View) => void;
  events: UEvent[];
  setEvents: React.Dispatch<React.SetStateAction<UEvent[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  students: Student[];
  suggestions: Suggestion[];
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
  plans: AdminPlan[];
  setPlans: React.Dispatch<React.SetStateAction<AdminPlan[]>>;
  reports: AdminReport[];
  setReports: React.Dispatch<React.SetStateAction<AdminReport[]>>;
  currentStudent: Student | null;
  currentUser: CurrentUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginAs: (accountEmail: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  registerForEvent: (eventId: string) => void;
  unregisterFromEvent: (eventId: string) => void;
  contactMessages: ContactMessage[];
  addContactMessage: (m: Omit<ContactMessage, 'id' | 'date'>) => void;
  canAccessCommittee: (committeeId: CommitteeId) => boolean;
  canAccessAdmin: () => boolean;
  canEditSection: (section: AdminSection) => boolean;
  generalInfo: GeneralInfo;
  setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfo>>;
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  updateSiteField: (path: string, value: string | number) => void;
  aboutContent: AboutContent;
  setAboutContent: React.Dispatch<React.SetStateAction<AboutContent>>;
  updateAboutField: (path: string, value: string | string[]) => void;
  guideSections: GuideSectionData[];
  setGuideSections: React.Dispatch<React.SetStateAction<GuideSectionData[]>>;
  galleryAlbums: GalleryAlbum[];
  setGalleryAlbums: React.Dispatch<React.SetStateAction<GalleryAlbum[]>>;
  galleryCategories: GalleryCategory[];
  setGalleryCategories: React.Dispatch<React.SetStateAction<GalleryCategory[]>>;
  faqCategories: FAQCategoryData[];
  setFaqCategories: React.Dispatch<React.SetStateAction<FAQCategoryData[]>>;
  contactCards: ContactCardData[];
  setContactCards: React.Dispatch<React.SetStateAction<ContactCardData[]>>;
  committees: typeof mockCommittees;
  setCommittees: React.Dispatch<React.SetStateAction<typeof mockCommittees>>;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  members: UnifiedMember[];
  setMembers: React.Dispatch<React.SetStateAction<UnifiedMember[]>>;
  applications: StudentApplication[];
  setApplications: React.Dispatch<React.SetStateAction<StudentApplication[]>>;
  myApplication: StudentApplication | null;
  registerWithApplication: (name: string, email: string, password: string, university: string, major: string, year: string, phone: string, motivation: string) => Promise<{ ok: boolean; error?: string }>;
  scheduleInterview: (applicationId: string, interview: InterviewInfo) => void;
  decideApplication: (applicationId: string, status: 'accepted' | 'rejected', rejectionReason?: string) => void;
  updateStudentProfile: (updates: Partial<Pick<Student, 'name' | 'email' | 'university' | 'major' | 'year' | 'phone'>>) => void;
  replyToSuggestion: (id: string, decision: 'accepted' | 'reviewing' | 'unavailable', reply: string) => void;
  updatePresidentProfile: (updates: Partial<Pick<BoardMember, 'name' | 'photo' | 'bio' | 'email'>>) => void;
  assignMemberRole: (memberId: string, role: string, committeeId?: CommitteeId) => void;
  updateMemberProfile: (memberId: string, data: Partial<{ name: string; email: string; university: string; major: string; year: string; phone: string; photo: string }>) => void;
  updateCommitteeVision: (committeeId: CommitteeId, data: { vision?: string; goals?: string }) => void;
  updateOwnProfile: (data: Partial<{ name: string; email: string; phone: string; university: string; major: string; year: string }>) => void;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  date: string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>({ kind: 'home' });
  const [events, setEvents] = useState<UEvent[]>(mockEvents);
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions);
  const [plans, setPlans] = useState<AdminPlan[]>(mockPlans);
  const [reports, setReports] = useState<AdminReport[]>(mockReports);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>({
    vision: 'بناء جيل شبابي واعٍٍ بذاته وهويته، قادر على القيادة والعطاء، يجمع بين أصالة المنطلق ومعاصرة الأداء.',
    goals: 'تنمية المهارات القيادية لدى الشباب، تعزيز الهوية الثقافية، خدمة المجتمع، وبناء شراكات استراتيجية.',
    studentStats: '1248 طالب، 24 جامعة، 540 متطوع، 86 فعالية',
    contactLinks: [
      { label: 'الموقع الإلكتروني', url: 'https://ummet.org' },
      { label: 'البريد الإلكتروني', url: 'mailto:info@ummet.org' },
      { label: 'تيليجرام', url: 'https://t.me/ummet' },
    ],
  });
  const [committees, setCommittees] = useState(mockCommittees);
  const [members, setMembers] = useState<UnifiedMember[]>(() => seedMembersFromCommittees(mockCommittees));
  const [siteContent, setSiteContent] = useState<SiteContent>({
    brand: { name: 'اتحاد شباب الأمة', nameTr: 'Ummet Gençleri Birliği', logoIcon: 'Users' },
    footer: {
      phone: '+90 212 555 00 00',
      email: 'info@ummet.org',
      address: 'إسطنبول، تركيا - حي الفاتح',
      copyright: 'اتحاد شباب الأمة - جميع الحقوق محفوظة.',
      social: { facebook: 'https://facebook.com/ummet', twitter: 'https://twitter.com/ummet', instagram: 'https://instagram.com/ummet', youtube: 'https://youtube.com/@ummet' },
    },
    hero: {
      badge: 'نُمكّن الشباب، نبني المستقبل',
      title: 'اتحاد شباب الأمة',
      subtitle: 'نحو جيلٍ واعٍ ومسؤول',
      description: 'اتحاد شبابي يجمع طلاب الجامعات تحت مظلة واحدة، لتعزيز الهوية، وتنمية المهارات، وبناء قادة الغد عبر برامج تثقيفية وتدريبية وتطوعية متكاملة.',
      primaryBtn: 'تصفح البرامج',
      secondaryBtn: 'تعرّف على الاتحاد',
      tertiaryBtn: 'الهيئة التنفيذية',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=900',
      badge1: { value: '12', label: 'جائزة تكريم' },
      badge2: { value: '+38%', label: 'نمو سنوي' },
    },
    stats: [
      { value: 1248, label: 'عضو مسجل', icon: 'Users' },
      { value: 86, label: 'فعالية منظمة', icon: 'CalendarDays' },
      { value: 24, label: 'جامعة شريكة', icon: 'GraduationCap' },
      { value: 540, label: 'متطوع نشط', icon: 'HeartHandshake' },
    ],
    about: {
      badge: 'من نحن',
      title: 'رسالتنا: بناء جيلٍ يحمل همّ أمته',
      description: 'نؤمن أن الشباب هم عماد المستقبل وصناع التغيير. لذلك نعمل على تأهيل الطلاب أكاديميًا ومهاريًا، وتعزيز انتمائهم لأمتهم، عبر بيئة شبابية محفّزة وبرامج متنوعة تجمع بين العلم والعمل والقيم.',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=900',
      imageBadge: { value: '+1200', label: 'طالب استفاد من برامجنا هذا العام' },
      features: [
        { icon: 'Target', title: 'رؤية واضحة', desc: 'إعداد قادة شباب مؤثرين.' },
        { icon: 'BookOpen', title: 'تعليم مستمر', desc: 'برامج تدريبية وتثقيفية.' },
        { icon: 'HeartHandshake', title: 'عمل تطوعي', desc: 'خدمة المجتمع والأمة.' },
        { icon: 'Sparkles', title: 'إبداع وابتكار', desc: 'مساحات للمبادرات الشبابية.' },
      ],
    },
    boardPreview: {
      title: 'الهيئة التنفيذية',
      subtitle: 'الهيكل التنظيمي',
      description: 'فريق قيادي متكامل يضم الرئاسة ونائب الرئيس وخمس لجان متخصصة.',
      memberIds: ['presidency', 'vice-presidency', 'media', 'academic'],
    },
  });

  const [guideSections, setGuideSections] = useState<GuideSectionData[]>(initialGuideSections);
  const [galleryAlbums, setGalleryAlbums] = useState<GalleryAlbum[]>(initialGalleryAlbums);
  const [galleryCategories, setGalleryCategories] = useState<GalleryCategory[]>(initialGalleryCategories);
  const [faqCategories, setFaqCategories] = useState<FAQCategoryData[]>(initialFAQCategories);
  const [contactCards, setContactCards] = useState<ContactCardData[]>(initialContactCards);

  // Persist students + committees to localStorage for live cross-page sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ummet_students');
      if (saved) {
        const parsed = JSON.parse(saved) as Student[];
        if (Array.isArray(parsed) && parsed.length > 0) setStudents(parsed);
      }
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('ummet_students', JSON.stringify(students)); } catch { /* ignore */ }
  }, [students]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ummet_committees');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setCommittees(parsed);
      }
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('ummet_committees', JSON.stringify(committees)); } catch { /* ignore */ }
  }, [committees]);

  // Unified members persistence (single source of truth for roles)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ummet_members');
      if (saved) {
        const parsed = JSON.parse(saved) as UnifiedMember[];
        if (Array.isArray(parsed)) setMembers(parsed);
      }
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('ummet_members', JSON.stringify(members)); } catch { /* ignore */ }
  }, [members]);

  // Persist plans + reports to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ummet_plans');
      if (saved) setPlans(JSON.parse(saved) as AdminPlan[]);
    } catch { /* ignore */ }
    try {
      const saved = localStorage.getItem('ummet_reports');
      if (saved) setReports(JSON.parse(saved) as AdminReport[]);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('ummet_plans', JSON.stringify(plans)); } catch { /* ignore */ }
  }, [plans]);
  useEffect(() => {
    try { localStorage.setItem('ummet_reports', JSON.stringify(reports)); } catch { /* ignore */ }
  }, [reports]);

  // Persist siteContent to localStorage for global inline-edit sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ummet_site');
      if (saved) setSiteContent(JSON.parse(saved) as SiteContent);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('ummet_site', JSON.stringify(siteContent)); } catch { /* ignore */ }
  }, [siteContent]);

  // Derive committee heads/members from the unified members array so that
  // role changes in the members table are reflected everywhere automatically.
  useEffect(() => {
    setCommittees((prev) =>
      prev.map((c) => {
        const headMember = members.find((m) => m.committee === c.id && m.role !== 'عضو');
        const regularMembers = members.filter((m) => m.committee === c.id && m.role === 'عضو');
        const head = headMember
          ? {
              id: headMember.id,
              name: headMember.name,
              role: headMember.role,
              bio: c.head?.bio ?? '',
              photo: headMember.photo,
              email: headMember.email || c.head?.email || '',
            }
          : c.head;
        const mappedMembers = regularMembers.map((m) => ({
          id: m.id,
          name: m.name,
          position: m.role,
          photo: m.photo,
        }));
        return { ...c, head, members: mappedMembers };
      })
    );
  }, [members]);

  const [aboutContent, setAboutContent] = useState<AboutContent>({
    header: {
      badge: 'من نحن',
      title: 'عن اتحاد شباب الأمة',
      description: 'اتحاد شبابي تأسس ليجمع طلاب الجامعات تحت مظلة واحدة، يعزز الهوية ويبني المهارات ويصنع القادة.',
    },
    story: {
      badge: 'قصتنا',
      title: 'من البداية حتى اليوم',
      paragraphs: [
        'بدأنا كمجموعة صغيرة من الطلاب المتطوعين يحلمون بمساحة شبابية تجمع بين الهمّ والعمل. اليوم، أصبحنا اتحادًا يضم أكثر من 1200 عضو من 24 جامعة مختلفة.',
        'نظّمنا 86 فعالية متنوعة بين ورش عمل ومحاضرات وبرامج تدريبية وحملات تطوعية، وخرّجنا قادة شبابًا يقودون اليوم مبادراتهم الخاصة في مجتمعاتهم.',
        'نؤمن أن بناء الأمة يبدأ من بناء الشاب، وأن كل طالب يحمل في داخله طاقة قادرة على التغيير إذا وُجدت البيئة المناسبة.',
      ],
      images: [
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
    },
    mission: {
      badge: 'رسالتنا ورؤيتنا',
      title: 'قيمنا، رؤيتنا، ورسالتنا',
      cards: [
        { icon: 'Target', title: 'رسالتنا', text: 'إعداد جيل شبابي واعٍ ومسؤول، يمتلك المهارات والقيم التي تؤهله لقيادة مستقبل أمته.' },
        { icon: 'Eye', title: 'رؤيتنا', text: 'أن نكون الاتحاد الشبابي الرائد في تأهيل القادة وتنمية المجتمعات على مستوى المنطقة.' },
        { icon: 'Heart', title: 'قيمنا', text: 'الانتماء، الإخلاص، التعاون، التميّز، والمسؤولية. مبادئ نلتزم بها في كل ما نقوم به.' },
      ],
    },
    goals: {
      badge: 'أهدافنا',
      title: 'ما نسعى لتحقيقه',
      cards: [
        { icon: 'BookOpen', title: 'التثقيف المستمر', desc: 'محاضرات وندوات تعزز الوعي الثقافي والفكري.' },
        { icon: 'GraduationCap', title: 'الإرشاد الأكاديمي', desc: 'دعم الطلاب علميًا وتوجيههم نحو التميز في مساراتهم.' },
        { icon: 'Users', title: 'تنمية المهارات', desc: 'تطوير القدرات القيادية والإدارية والإعلامية لدى الطلاب.' },
        { icon: 'ShieldCheck', title: 'تعزيز الهوية', desc: 'تثبيت قيم الانتماء للأمة لدى جيل الشباب.' },
        { icon: 'Sparkles', title: 'دعم الابتكار', desc: 'احتضان المبادرات الشبابية الإبداعية وتطويرها.' },
        { icon: 'Handshake', title: 'العمل التطوعي', desc: 'تنظيم حملات ومبادرات تخدم المجتمع وتعزز المسؤولية.' },
      ],
    },
    cta: {
      icon: 'Award',
      title: 'كن جزءًا من رحلتنا',
      description: 'انضم إلى آلاف الطلاب الذين اختاروا أن يكونوا فاعلين في مجتمعاتهم.',
      buttonText: 'سجّل الآن',
    },
  });

  // Persist aboutContent to localStorage for global inline-edit sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ummet_about');
      if (saved) setAboutContent(JSON.parse(saved) as AboutContent);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('ummet_about', JSON.stringify(aboutContent)); } catch { /* ignore */ }
  }, [aboutContent]);

  // Fetch applications from Supabase on mount
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('student_applications')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped: StudentApplication[] = data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            studentId: row.student_id as string,
            name: row.name as string,
            email: row.email as string,
            university: row.university as string,
            major: row.major as string,
            year: row.year as string,
            motivation: row.motivation as string,
            appliedAt: row.applied_at as string,
            status: row.status as ApplicationStatus,
            interview: row.interview_date ? {
              date: row.interview_date as string,
              time: row.interview_time as string,
              meetingUrl: row.interview_meeting_url as string,
            } : undefined,
            decidedAt: row.decided_at as string | undefined,
            rejectionReason: row.rejection_reason as string | undefined,
          }));
          setApplications(mapped);
        }
      } catch (err) {
        console.error('Failed to load applications from Supabase:', err);
      } finally {
        setApplicationsLoaded(true);
      }
    })();
  }, []);

  // Restore session from Supabase Auth on mount, and listen for auth changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          await applySession(session);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (event === 'SIGNED_OUT') {
          setCurrentStudent(null);
          setCurrentUser(null);
          setView({ kind: 'home' });
        } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
          await applySession(session);
        }
      })();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply a Supabase session: determine role and load student profile if applicable
  const applySession = async (session: import('@supabase/supabase-js').Session) => {
    const email = session.user.email ?? '';
    const meta = session.user.user_metadata as { name?: string; role?: string; committee?: string } | null;
    // Check board_members table for role mapping
    try {
      const { data: board } = await supabase
        .from('board_members')
        .select('name, role, committee')
        .eq('email', email)
        .maybeSingle();
      if (board) {
        setCurrentUser({
          name: board.name,
          email,
          role: board.role as Role,
          committee: (board.committee as CommitteeId) ?? undefined,
        });
        setCurrentStudent(null);
        setView({ kind: 'admin' });
        return;
      }
    } catch (err) {
      console.error('Failed to look up board member:', err);
    }
    // Otherwise treat as student: load profile
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      if (profile) {
        const student: Student = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          university: profile.university ?? 'غير محدد',
          major: profile.major ?? 'غير محدد',
          year: profile.year ?? 'السنة الأولى',
          joinedAt: profile.joined_at ?? new Date().toISOString().slice(0, 10),
          registeredEvents: [],
          status: (profile.status as 'active' | 'inactive') ?? 'inactive',
          phone: profile.phone ?? undefined,
        };
        setCurrentStudent(student);
        setCurrentUser({ name: student.name, email: student.email, role: 'student' });
        setView({ kind: 'student-dashboard' });
        return;
      }
      // Profile not found — use metadata from signup
      const name = meta?.name ?? email;
      const student: Student = {
        id: session.user.id,
        name,
        email,
        university: 'غير محدد',
        major: 'غير محدد',
        year: 'السنة الأولى',
        joinedAt: new Date().toISOString().slice(0, 10),
        registeredEvents: [],
        status: 'inactive',
      };
      setCurrentStudent(student);
      setCurrentUser({ name, email, role: 'student' });
      setView({ kind: 'student-dashboard' });
    } catch (err) {
      console.error('Failed to load student profile:', err);
    }
  };

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { ok: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }
    if (data.session) {
      await applySession(data.session);
    }
    return { ok: true };
  };

  const loginAs = (_accountEmail: string) => {
    // Role simulation disabled — real auth only.
  };

  const register = (name: string, email: string) => {
    const newStudent: Student = {
      id: 's' + (students.length + 1) + Date.now(),
      name,
      email,
      university: 'غير محدد',
      major: 'غير محدد',
      year: 'السنة الأولى',
      joinedAt: new Date().toISOString().slice(0, 10),
      registeredEvents: [],
      status: 'inactive',
    };
    setCurrentStudent(newStudent);
    setCurrentUser({ name, email, role: 'student' });
    // Auto-create a pending application
    const app: StudentApplication = {
      id: 'app' + Date.now(),
      studentId: newStudent.id,
      name,
      email,
      university: 'غير محدد',
      major: 'غير محدد',
      year: 'السنة الأولى',
      motivation: '',
      appliedAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    };
    setApplications((prev) => [app, ...prev]);
    setView({ kind: 'student-dashboard' });
  };

  const registerWithApplication = async (name: string, email: string, password: string, university: string, major: string, year: string, phone: string, motivation: string): Promise<{ ok: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    const userId = data.user?.id;
    if (userId) {
      try {
        await supabase.from('profiles').insert({
          id: userId,
          email,
          name,
          university,
          major,
          year,
          phone,
          status: 'inactive',
        });
      } catch (err) {
        console.error('Failed to create profile row:', err);
      }
      const app: StudentApplication = {
        id: 'app' + Date.now(),
        studentId: userId,
        name,
        email,
        university,
        major,
        year,
        phone,
        motivation,
        appliedAt: new Date().toISOString().slice(0, 10),
        status: 'pending',
      };
      setApplications((prev) => [app, ...prev]);
      try {
        await supabase.from('student_applications').insert({
          id: app.id,
          student_id: app.studentId,
          name: app.name,
          email: app.email,
          university: app.university,
          major: app.major,
          year: app.year,
          phone: app.phone,
          motivation: app.motivation,
          applied_at: app.appliedAt,
          status: app.status,
        });
      } catch (err) {
        console.error('Failed to persist application to Supabase:', err);
      }
      const student: Student = {
        id: userId,
        name,
        email,
        university,
        major,
        year,
        phone,
        joinedAt: new Date().toISOString().slice(0, 10),
        registeredEvents: [],
        status: 'inactive',
      };
      setCurrentStudent(student);
      setCurrentUser({ name, email, role: 'student' });
      setView({ kind: 'student-dashboard' });
    }
    return { ok: true };
  };

  const scheduleInterview = async (applicationId: string, interview: InterviewInfo) => {
    setApplications((prev) => prev.map((a) => a.id === applicationId ? { ...a, status: 'interview' as ApplicationStatus, interview } : a));
    try {
      await supabase.from('student_applications').update({
        status: 'interview',
        interview_date: interview.date,
        interview_time: interview.time,
        interview_meeting_url: interview.meetingUrl,
      }).eq('id', applicationId);
    } catch (err) {
      console.error('Failed to update interview in Supabase:', err);
    }
  };

  const decideApplication = async (applicationId: string, status: 'accepted' | 'rejected', rejectionReason?: string) => {
    const decidedAt = new Date().toISOString().slice(0, 10);
    const app = applications.find((a) => a.id === applicationId);
    setApplications((prev) => prev.map((a) => a.id === applicationId ? { ...a, status, decidedAt, rejectionReason } : a));
    if (app && currentStudent && currentStudent.email === app.email && status === 'accepted') {
      setCurrentStudent((prev) => prev ? { ...prev, status: 'active' } : prev);
    }
    // Auto-add accepted applicant to the members list with all application data
    if (app && status === 'accepted') {
      const newStudent: Student = {
        id: app.studentId || 's' + Date.now(),
        name: app.name,
        email: app.email,
        university: app.university || 'غير محدد',
        major: app.major || 'غير محدد',
        year: app.year || 'السنة الأولى',
        joinedAt: decidedAt,
        registeredEvents: [],
        status: 'active',
      };
      setStudents((prev) => {
        // Avoid duplicates by email
        if (prev.some((s) => s.email.toLowerCase() === newStudent.email.toLowerCase())) {
          return prev.map((s) => s.email.toLowerCase() === newStudent.email.toLowerCase() ? { ...s, status: 'active' as const } : s);
        }
        return [newStudent, ...prev];
      });
      // Also add to the unified members array as a regular "عضو" so it appears in
      // the members management table and persists across refreshes.
      setMembers((prev) => {
        if (prev.some((m) => m.email.toLowerCase() === newStudent.email.toLowerCase())) {
          return prev.map((m) => m.email.toLowerCase() === newStudent.email.toLowerCase() ? { ...m, status: 'active' as const } : m);
        }
        return [
          {
            id: newStudent.id,
            name: newStudent.name,
            email: newStudent.email,
            university: newStudent.university,
            major: newStudent.major,
            year: newStudent.year,
            phone: app?.phone,
            photo: DEFAULT_PHOTO,
            role: 'عضو',
            joinedAt: decidedAt,
            status: 'active',
          },
          ...prev,
        ];
      });
      // Persist to profiles table
      try {
        await supabase.from('profiles').upsert({
          id: newStudent.id,
          email: newStudent.email,
          name: newStudent.name,
          university: newStudent.university,
          major: newStudent.major,
          year: newStudent.year,
          phone: app?.phone,
          status: 'active',
        });
      } catch (err) {
        console.error('Failed to add accepted student to profiles:', err);
      }
    }
    try {
      await supabase.from('student_applications').update({
        status,
        decided_at: decidedAt,
        rejection_reason: status === 'rejected' ? rejectionReason : null,
      }).eq('id', applicationId);
    } catch (err) {
      console.error('Failed to update decision in Supabase:', err);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentStudent(null);
    setCurrentUser(null);
    setView({ kind: 'home' });
  };

  const updateStudentProfile: AppContextValue['updateStudentProfile'] = async (updates) => {
    setCurrentStudent((prev) => (prev ? { ...prev, ...updates } : prev));
    setCurrentUser((prev) =>
      prev && prev.role === 'student'
        ? { ...prev, name: updates.name ?? prev.name, email: updates.email ?? prev.email }
        : prev
    );
    setStudents((prev) =>
      prev.map((s) => (currentStudent && s.id === currentStudent.id ? { ...s, ...updates } : s))
    );
    if (currentStudent) {
      try {
        await supabase.from('profiles').update({
          name: updates.name,
          email: updates.email,
          university: updates.university,
          major: updates.major,
          year: updates.year,
          phone: updates.phone,
        }).eq('id', currentStudent.id);
      } catch (err) {
        console.error('Failed to update profile in Supabase:', err);
      }
    }
  };

  const replyToSuggestion: AppContextValue['replyToSuggestion'] = (id, decision, reply) => {
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: decision === 'accepted' ? 'implemented' : decision === 'reviewing' ? 'reviewed' : 'reviewed',
              adminDecision: decision,
              adminReply: reply,
              repliedAt: new Date().toISOString().slice(0, 10),
            }
          : s
      )
    );
  };

  const updatePresidentProfile: AppContextValue['updatePresidentProfile'] = async (updates) => {
    setCurrentUser((prev) =>
      prev && prev.role === 'president'
        ? { ...prev, name: updates.name ?? prev.name, email: updates.email ?? prev.email }
        : prev
    );
    setCommittees((prev) =>
      prev.map((c) =>
        c.id === 'presidency'
          ? { ...c, head: { ...c.head, ...updates } }
          : c
      )
    );
    try {
      const president = committees.find((c) => c.id === 'presidency')?.head;
      if (president) {
        await supabase.from('board_members').update({
          name: updates.name,
          photo: updates.photo,
          bio: updates.bio,
          email: updates.email,
        }).eq('id', president.id);
      }
    } catch (err) {
      console.error('Failed to update president profile in Supabase:', err);
    }
  };

  const assignMemberRole: AppContextValue['assignMemberRole'] = (memberId, role, _committeeId) => {
    const normalized = (role === 'عضو عام' ? 'عضو' : role) as MemberRole;
    const targetCommittee = COMMITTEE_BY_ROLE[normalized];

    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, role: normalized, committee: targetCommittee ?? (normalized === 'عضو' ? m.committee : undefined) }
          : m
      )
    );

    // If the affected member is currently logged in, update their session role live.
    const target = members.find((m) => m.id === memberId);
    setCurrentUser((u) => {
      if (!u || !target || u.email.toLowerCase() !== target.email.toLowerCase()) return u;
      if (normalized === 'عضو') return { ...u, role: 'student', committee: undefined };
      if (normalized === 'رئيس الاتحاد') return { ...u, role: 'president', committee: undefined };
      return { ...u, role: 'committee-head', committee: targetCommittee };
    });
  };

  const updateMemberProfile: AppContextValue['updateMemberProfile'] = (memberId, data) => {
    setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, ...data } : m));
  };

  const updateCommitteeVision: AppContextValue['updateCommitteeVision'] = (committeeId, data) => {
    setCommittees((prev) => prev.map((c) => c.id === committeeId ? { ...c, ...data } : c));
  };

  const updateOwnProfile: AppContextValue['updateOwnProfile'] = (data) => {
    if (!currentUser) return;
    setCurrentUser((prev) => prev ? { ...prev, ...data } : prev);
    setMembers((prev) => prev.map((m) => m.email.toLowerCase() === currentUser.email.toLowerCase() ? { ...m, ...data } : m));
  };

  const registerForEvent = (eventId: string) => {
    if (!currentStudent) return;
    setCurrentStudent((prev) =>
      prev
        ? {
            ...prev,
            registeredEvents: prev.registeredEvents.includes(eventId)
              ? prev.registeredEvents
              : [...prev.registeredEvents, eventId],
          }
        : prev
    );
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, registered: Math.min(e.registered + 1, e.capacity) }
          : e
      )
    );
  };

  const unregisterFromEvent = (eventId: string) => {
    if (!currentStudent) return;
    setCurrentStudent((prev) =>
      prev
        ? {
            ...prev,
            registeredEvents: prev.registeredEvents.filter((id) => id !== eventId),
          }
        : prev
    );
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, registered: Math.max(e.registered - 1, 0) }
          : e
      )
    );
  };

  const addContactMessage = (m: Omit<ContactMessage, 'id' | 'date'>) => {
    setContactMessages((prev) => [
      { ...m, id: 'm' + Date.now(), date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
  };

  const canAccessCommittee = (committeeId: CommitteeId): boolean => {
    if (!currentUser) return true; // public access when not logged in
    if (currentUser.role === 'president') return true;
    if (currentUser.role === 'committee-head') return currentUser.committee === committeeId;
    return true; // students and others can view public committee pages
  };

  const canAccessAdmin = (): boolean => {
    if (!currentUser) return false;
    return currentUser.role === 'president' || currentUser.role === 'committee-head';
  };

  const setByPath = (obj: Record<string, unknown> | unknown[], path: string, value: unknown): Record<string, unknown> | unknown[] => {
    const keys = path.split('.');
    const clone: Record<string, unknown> = Array.isArray(obj) ? [...obj] as unknown as Record<string, unknown> : { ...(obj as Record<string, unknown>) };
    let cur: Record<string, unknown> = clone;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      const idx = Number(k);
      if (!Number.isNaN(idx) && Array.isArray(cur)) {
        cur = cur[idx] as Record<string, unknown>;
      } else {
        cur = (cur[k] as Record<string, unknown>) ?? {};
      }
    }
    const last = keys[keys.length - 1];
    const lastIdx = Number(last);
    if (!Number.isNaN(lastIdx) && Array.isArray(cur)) {
      cur[lastIdx] = value;
    } else {
      cur[last] = value;
    }
    return clone;
  };

  const updateSiteField: AppContextValue['updateSiteField'] = (path, value) => {
    setSiteContent((prev) => setByPath(prev as unknown as Record<string, unknown>, path, value) as unknown as SiteContent);
  };
  const updateAboutField: AppContextValue['updateAboutField'] = (path, value) => {
    setAboutContent((prev) => setByPath(prev as unknown as Record<string, unknown>, path, value) as unknown as AboutContent);
  };

  const canEditSection = (section: AdminSection): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'president') return true;
    if (currentUser.role === 'committee-head') {
      if (currentUser.committee === 'media') return ['gallery', 'homepage', 'about-page', 'plans'].includes(section);
      if (currentUser.committee === 'academic') return ['guide', 'events', 'plans'].includes(section);
      if (currentUser.committee === 'activities') return ['events', 'plans'].includes(section);
      if (currentUser.committee === 'finance') return ['plans'].includes(section);
      if (currentUser.committee === 'supervisory') return ['members', 'plans'].includes(section);
      if (currentUser.committee === 'vice-presidency') return ['plans'].includes(section);
      if (currentUser.committee === 'presidency') return ['plans'].includes(section);
      return false;
    }
    return false;
  };

  const myApplication = currentStudent ? applications.find((a) => a.email.toLowerCase() === currentStudent.email.toLowerCase()) ?? null : null;

  const value = useMemo<AppContextValue>(
    () => ({
      view,
      setView,
      events,
      setEvents,
      news,
      setNews,
      students,
      suggestions,
      setSuggestions,
      plans,
      setPlans,
      reports,
      setReports,
      currentStudent,
      currentUser,
      login,
      loginAs,
      register,
      logout,
      registerForEvent,
      unregisterFromEvent,
      contactMessages,
      addContactMessage,
      canAccessCommittee,
      canAccessAdmin,
      canEditSection,
      generalInfo,
      setGeneralInfo,
      siteContent,
      setSiteContent,
      updateSiteField,
      aboutContent,
      setAboutContent,
      updateAboutField,
      guideSections,
      setGuideSections,
      galleryAlbums,
      setGalleryAlbums,
      galleryCategories,
      setGalleryCategories,
      faqCategories,
      setFaqCategories,
      contactCards,
      setContactCards,
      committees: committees,
      members,
      setMembers,
      updateMemberProfile,
      setCommittees,
      setStudents,
      applications,
      setApplications,
      myApplication,
      registerWithApplication,
      scheduleInterview,
      decideApplication,
      updateStudentProfile,
      replyToSuggestion,
      updatePresidentProfile,
      assignMemberRole,
      updateCommitteeVision,
      updateOwnProfile,
    }),
    [view, events, news, students, suggestions, plans, reports, currentStudent, currentUser, contactMessages, applications, myApplication, generalInfo, committees, members, siteContent, aboutContent, guideSections, galleryAlbums, galleryCategories, faqCategories, contactCards, updateStudentProfile, replyToSuggestion, updatePresidentProfile, assignMemberRole, updateMemberProfile, setReports, updateSiteField, updateAboutField, updateCommitteeVision, updateOwnProfile]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

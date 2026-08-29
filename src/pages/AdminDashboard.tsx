import { useState, useMemo } from 'react';
import {
  LayoutDashboard, CalendarDays, Users, ClipboardList, BarChart3, PieChart, TrendingUp,
  Plus, Search, Trash2, Edit3, Mail, GraduationCap, X, CheckCircle2, Clock, FileText, Target, ChevronLeft, User,
  Video, UserCheck, UserX, CalendarClock, Link2, Inbox, Info, Crown, Save, Image, MessageSquareReply, Send, Pencil,
  Download, Eye, Paperclip,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import BarChart, { DonutChart, LineChart } from '../components/Charts';

import {
  categoryLabels, categoryColors, applicationStatusLabels, applicationStatusColors,
  type EventCategory, type UEvent, type StudentApplication, type InterviewInfo,
  type BoardMember, type CommitteeMember, type CommitteeId, type Suggestion,
} from '../data/mockData';

type AdminTab = 'stats' | 'board' | 'events' | 'members' | 'applications' | 'plans' | 'profile';

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('stats');
  const {
    events, students, suggestions, plans, setPlans, reports, contactMessages,
    applications, scheduleInterview, decideApplication,
    setEvents, setStudents, canEditSection, currentUser, replyToSuggestion,
    committees, setCommittees, updatePresidentProfile, assignMemberRole,
    members, setMembers,
    updateMemberProfile,
    setReports,
    updateCommitteeVision,
    updateOwnProfile,
  } = useApp();

  const isPresidentOrVice = currentUser?.role === 'president' || (currentUser?.role === 'committee-head' && currentUser.committee === 'vice-presidency');
  const tabs: { id: AdminTab; label: string; icon: typeof BarChart3; show: boolean }[] = [
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3, show: currentUser?.role === 'president' || currentUser?.role === 'committee-head' },
    { id: 'board', label: 'الهيئة التنفيذية', icon: Crown, show: canEditSection('board') },
    { id: 'events', label: 'إدارة الفعاليات', icon: CalendarDays, show: canEditSection('events') },
    { id: 'members', label: 'إدارة الأعضاء', icon: Users, show: canEditSection('members') },
    { id: 'applications', label: 'طلبات الانضمام', icon: Inbox, show: isPresidentOrVice },
    { id: 'plans', label: 'الخطط والتقارير', icon: ClipboardList, show: canEditSection('plans') },
    { id: 'profile', label: 'الملف الشخصي', icon: User, show: currentUser?.role === 'committee-head' },
  ];

  const visibleTabs = tabs.filter((t) => t.show);

  const roleLabel = currentUser?.role === 'president' ? 'رئيس الاتحاد'
    : currentUser?.role === 'committee-head' ? 'رئيس لجنة'
    : 'مدير الاتحاد';

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20">
      <div className="container-app py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-600">
              <LayoutDashboard className="h-4 w-4" />
              لوحة الإدارة
            </div>
            <h1 className="mt-1 text-2xl font-extrabold text-navy-900 lg:text-3xl">لوحة تحكم الإدارة</h1>
            <p className="mt-1 text-sm text-gray-500">إدارة الفعاليات والأعضاء والخطط والتقارير.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white">
              {currentUser?.name?.charAt(0) || 'إ'}
            </div>
            <div>
              <div className="font-bold text-navy-900">{currentUser?.name || 'مدير الاتحاد'}</div>
              <div className="text-xs text-gray-400">{roleLabel} · {currentUser?.email || 'admin@ummet.org'}</div>
            </div>
          </div>
        </div>

        {/* Permission badge */}
        {currentUser?.role === 'committee-head' && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm text-sky-800">
            <Info className="h-4 w-4" />
            <span className="font-semibold">صلاحياتك:</span>
            <span>يمكنك التعديل والإضافة في الأقسام المخصصة للجنة {currentUser.committee} فقط.</span>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm">
          {visibleTabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  tab === t.id ? 'bg-navy-800 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'stats' && <StatsTab events={events} students={students} suggestions={suggestions} contactMessages={contactMessages} applications={applications} onReplySuggestion={replyToSuggestion} />}
        {tab === 'board' && canEditSection('board') && <BoardTab committees={committees} setCommittees={setCommittees} students={students} currentUser={currentUser} assignMemberRole={assignMemberRole} updatePresidentProfile={updatePresidentProfile} setMembers={setMembers} />}
        {tab === 'events' && canEditSection('events') && <EventsTab events={events} setEvents={setEvents} />}
        {tab === 'members' && canEditSection('members') && <MembersTab members={members} setMembers={setMembers} events={events} suggestions={suggestions} currentUser={currentUser} assignMemberRole={assignMemberRole} updateMemberProfile={updateMemberProfile} />}
        {tab === 'applications' && <ApplicationsTab applications={applications} scheduleInterview={scheduleInterview} decideApplication={decideApplication} />}
        {tab === 'plans' && canEditSection('plans') && <PlansTab plans={plans} setPlans={setPlans} reports={reports} setReports={setReports} currentUser={currentUser} />}
        {tab === 'profile' && currentUser?.role === 'committee-head' && <ProfileTab currentUser={currentUser} />}
      </div>
    </div>
  );
}

/* ---------------- Stats Tab ---------------- */
function StatsTab({ events, students, suggestions, contactMessages, applications, onReplySuggestion }: {
  events: UEvent[]; students: ReturnType<typeof useApp>['students'];
  suggestions: ReturnType<typeof useApp>['suggestions'];
  contactMessages: ReturnType<typeof useApp>['contactMessages'];
  applications: StudentApplication[];
  onReplySuggestion: (id: string, decision: 'accepted' | 'reviewing' | 'unavailable', reply: string) => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion | null>(null);
  const [decision, setDecision] = useState<'accepted' | 'reviewing' | 'unavailable'>('reviewing');
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState(false);

  const activeStudents = students.filter((s) => s.status === 'active').length;
  const upcoming = events.filter((e) => e.status === 'upcoming').length;
  const pendingApps = applications.filter((a) => a.status === 'pending' || a.status === 'interview').length;

  const catColors: Record<EventCategory, string> = {
    workshop: '#1e3454', lecture: '#d49a24', volunteer: '#10b981',
    training: '#0ea5e9', trip: '#f43f5e', entertainment: '#8b5cf6', visit: '#ec4899',
  };
  const catData = (Object.keys(categoryLabels) as EventCategory[]).map((c) => ({
    label: categoryLabels[c],
    value: events.filter((e) => e.category === c).length,
    color: catColors[c],
  })).filter((d) => d.value > 0);

  const monthlyData = useMemo(() => {
    const months = [
      { key: 0, label: 'ينا' }, { key: 1, label: 'فبر' }, { key: 2, label: 'مار' },
      { key: 3, label: 'أبر' }, { key: 4, label: 'ماي' }, { key: 5, label: 'يون' },
      { key: 6, label: 'يول' }, { key: 7, label: 'أغس' }, { key: 8, label: 'سبت' },
      { key: 9, label: 'أكت' }, { key: 10, label: 'نوف' }, { key: 11, label: 'ديس' },
    ];
    const now = new Date();
    const curMonth = now.getMonth();
    const last6 = [4, 5, 6, 7, 8, 9].map((back) => (curMonth - back + 12) % 12);
    return last6.reverse().map((m) => {
      const monthLabel = months[m].label;
      const joiners = students.filter((s) => {
        const d = new Date(s.joinedAt);
        return d.getMonth() === m && d.getFullYear() === now.getFullYear();
      }).length;
      const registrants = events
        .filter((e) => { const d = new Date(e.date); return d.getMonth() === m && d.getFullYear() === now.getFullYear(); })
        .reduce((sum, e) => sum + e.registered, 0);
      return { label: monthLabel, value: joiners + registrants };
    });
  }, [students, events]);

  const openSuggestion = (s: Suggestion) => {
    setActiveSuggestion(s);
    setDecision(s.adminDecision ?? 'reviewing');
    setReplyText(s.adminReply ?? '');
    setReplyOpen(true);
  };

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSuggestion) return;
    onReplySuggestion(activeSuggestion.id, decision, replyText.trim());
    setReplyOpen(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: 'إجمالي الطلاب', value: students.length, color: 'bg-navy-800' },
          { icon: CheckCircle2, label: 'طلاب نشطون', value: activeStudents, color: 'bg-emerald-600' },
          { icon: CalendarDays, label: 'فعاليات قادمة', value: upcoming, color: 'bg-gold-500' },
          { icon: Inbox, label: 'طلبات قيد المراجعة', value: pendingApps, color: 'bg-sky-600' },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${k.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ChevronLeft className="h-5 w-5 text-gray-300" />
              </div>
              <div className="mt-4 text-3xl font-extrabold text-navy-900">{k.value.toLocaleString('ar-EG')}</div>
              <div className="text-sm text-gray-500">{k.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-bold text-navy-900">
              <BarChart3 className="h-5 w-5 text-navy-600" /> نمو التسجيلات والمشاركات (آخر 6 أشهر)
            </h3>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">مباشر</span>
          </div>
          <LineChart data={monthlyData} height={220} />
        </div>
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-navy-900">
            <PieChart className="h-5 w-5 text-navy-600" /> توزيع الفعاليات
          </h3>
          {catData.length > 0 ? (
            <DonutChart data={catData} />
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">لا فعاليات مضافة بعد.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-navy-900">
            <BarChart3 className="h-5 w-5 text-navy-600" /> المشاركة حسب نوع الفعالية
          </h3>
          <BarChart
            data={(Object.keys(categoryLabels) as EventCategory[]).map((c) => ({
              label: categoryLabels[c],
              value: events.filter((e) => e.category === c).reduce((s, e) => s + e.registered, 0),
              color: catColors[c],
            }))}
            height={200}
          />
        </div>
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-navy-900">
            <Clock className="h-5 w-5 text-navy-600" /> آخر الاقتراحات والرسائل
          </h3>
          <div className="space-y-3">
            {(!suggestions || suggestions.length === 0) && (!contactMessages || contactMessages.length === 0) ? (
              <div className="py-8 text-center">
                <Inbox className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-400">لا توجد اقتراحات أو رسائل حالية.</p>
              </div>
            ) : (
              <>
                {(!suggestions || suggestions.length === 0) ? (
                  <p className="text-sm text-gray-400">لا توجد اقتراحات حالية.</p>
                ) : (
                  suggestions.slice(0, 4).map((s) => (
                <button
                  key={s?.id ?? Math.random()}
                  onClick={() => openSuggestion(s)}
                  className="flex w-full items-start gap-3 rounded-xl border border-gray-100 p-3 text-right transition-colors hover:border-navy-200 hover:bg-navy-50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-xs font-bold text-navy-700">{(s?.studentName ?? '?').charAt(0)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-bold text-navy-900">{s?.title ?? 'بدون عنوان'}</div>
                      {s?.adminReply && (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">تم الرد</span>
                      )}
                    </div>
                    <div className="truncate text-xs text-gray-500">{s?.body ?? ''}</div>
                  </div>
                </button>
              ))
                )}
            {(!contactMessages || contactMessages.length === 0) ? (
              <p className="text-sm text-gray-400">لا رسائل جديدة.</p>
            ) : (
              contactMessages.slice(0, 2).map((m) => (
                <div key={m?.id ?? Math.random()} className="flex items-start gap-3 rounded-xl border border-gray-100 p-3">
                  <Mail className="h-4 w-4 shrink-0 text-navy-500 mt-0.5" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-navy-900">{m?.subject ?? 'بدون موضوع'}</div>
                    <div className="truncate text-xs text-gray-500">{m?.name ?? ''} - {m?.body ?? ''}</div>
                  </div>
                </div>
              ))
            )}
              </>
            )}
          </div>
        </div>
      </div>

      <SuggestionReplyModal
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
        suggestion={activeSuggestion}
        decision={decision}
        setDecision={setDecision}
        replyText={replyText}
        setReplyText={setReplyText}
        onSubmit={submitReply}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-slide-up rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-2xl">
          <CheckCircle2 className="ml-2 inline h-4 w-4" />
          تم إرسال الرد وتحديث حالة الاقتراح
        </div>
      )}
    </div>
  );
}

function SuggestionReplyModal({
  open, onClose, suggestion, decision, setDecision, replyText, setReplyText, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  suggestion: Suggestion | null;
  decision: 'accepted' | 'reviewing' | 'unavailable';
  setDecision: (d: 'accepted' | 'reviewing' | 'unavailable') => void;
  replyText: string;
  setReplyText: (t: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const decisionOptions: { value: 'accepted' | 'reviewing' | 'unavailable'; label: string; color: string }[] = [
    { value: 'accepted', label: 'مقبول', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    { value: 'reviewing', label: 'قيد الدراسة', color: 'bg-gold-100 text-gold-700 border-gold-300' },
    { value: 'unavailable', label: 'غير متاح حالياً', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  ];
  return (
    <Modal open={open} onClose={onClose} title="تفاصيل الاقتراح والرد عليه" maxWidth="max-w-2xl">
      {!suggestion ? (
        <div className="py-10 text-center">
          <Inbox className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-400">لا توجد اقتراحات حالية.</p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100 text-lg font-extrabold text-navy-700">
                {(suggestion?.studentName ?? '?').charAt(0)}
              </div>
              <div>
                <div className="text-base font-bold text-navy-900">{suggestion?.studentName ?? 'غير محدد'}</div>
                <div className="text-xs text-gray-500">{suggestion?.createdAt ?? '—'}</div>
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span dir="ltr">{suggestion?.studentEmail ?? 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                {suggestion?.studentUniversity ?? 'غير محدد'}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="h-4 w-4 text-gray-400" />
                {suggestion?.studentMajor ?? 'غير محدد'}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">عنوان الاقتراح</div>
            <div className="text-sm font-bold text-navy-900">{suggestion?.title ?? 'بدون عنوان'}</div>
            <div className="mt-1 inline-block rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-bold text-navy-700">{suggestion?.category ?? 'عام'}</div>
          </div>
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">النص الكامل</div>
            <p className="rounded-xl border border-gray-100 bg-white p-3 text-sm leading-relaxed text-gray-700">{suggestion?.body ?? 'لا يوجد نص.'}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-sm font-bold text-navy-800">
              <MessageSquareReply className="h-4 w-4" />
              الرد على الاقتراح
            </div>
            <div>
              <label className="label-field">قرار الإدارة</label>
              <div className="flex flex-wrap gap-2">
                {decisionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDecision(opt.value)}
                    className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all ${decision === opt.value ? opt.color : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-field">نص الرد للطالب</label>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="input-field resize-none"
                placeholder="اكتب ردك الموجه للطالب هنا..."
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-1">
              <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
                إلغاء
              </button>
              <button type="submit" className="btn-primary">
                <Send className="h-4 w-4" />
                إرسال الرد وتحديث الحالة
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}

/* ---------------- Board Management Tab ---------------- */
function BoardTab({ committees, setCommittees, students, currentUser, assignMemberRole, updatePresidentProfile, setMembers }: {
  committees: ReturnType<typeof useApp>['committees'];
  setCommittees: React.Dispatch<React.SetStateAction<ReturnType<typeof useApp>['committees']>>;
  students: ReturnType<typeof useApp>['students'];
  currentUser: ReturnType<typeof useApp>['currentUser'];
  assignMemberRole: ReturnType<typeof useApp>['assignMemberRole'];
  updatePresidentProfile: ReturnType<typeof useApp>['updatePresidentProfile'];
  setMembers: React.Dispatch<React.SetStateAction<ReturnType<typeof useApp>['members']>>;
}) {
  const [memberModal, setMemberModal] = useState(false);
  const [editMember, setEditMember] = useState<{ committeeId: CommitteeId; member: CommitteeMember | null } | null>(null);
  const [memberForm, setMemberForm] = useState({ studentId: '', position: '', photo: '' });
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);

  const [headModal, setHeadModal] = useState(false);
  const [headCommittee, setHeadCommittee] = useState<CommitteeId | null>(null);
  const [headForm, setHeadForm] = useState({ name: '', role: '', bio: '', photo: '', email: '', phone: '', university: '', major: '', year: '' });

  const [respModal, setRespModal] = useState(false);
  const [respTarget, setRespTarget] = useState<{ committeeId: CommitteeId; idx: number } | null>(null);
  const [respText, setRespText] = useState('');

  const [statModal, setStatModal] = useState(false);
  const [statTarget, setStatTarget] = useState<{ committeeId: CommitteeId; idx: number } | null>(null);
  const [statForm, setStatForm] = useState({ label: '', value: '' });

  const openAddMember = (committeeId: CommitteeId) => {
    setEditMember({ committeeId, member: null });
    setMemberForm({ studentId: '', position: '', photo: '' });
    setStudentSearch('');
    setStudentDropdownOpen(false);
    setMemberModal(true);
  };
  const openEditMember = (committeeId: CommitteeId, m: CommitteeMember) => {
    setEditMember({ committeeId, member: m });
    setMemberForm({ studentId: '', position: m.position, photo: m.photo });
    setStudentSearch(m.name);
    setStudentDropdownOpen(false);
    setMemberModal(true);
  };
  const saveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMember) return;
    const { committeeId, member } = editMember;
    if (member) {
      const photo = memberForm.photo || member.photo;
      setCommittees((prev) => prev.map((c) => {
        if (c.id !== committeeId) return c;
        return { ...c, members: c.members.map((m) => m.id === member.id ? { ...m, position: memberForm.position, photo } : m) };
      }));
    } else {
      if (!memberForm.studentId) return;
      const student = students.find((s) => s.id === memberForm.studentId);
      if (!student) return;
      const photo = memberForm.photo || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400`;
      setCommittees((prev) => prev.map((c) => {
        if (c.id !== committeeId) return c;
        return { ...c, members: [...c.members, { id: 'cm' + Date.now(), name: student.name, position: memberForm.position || 'عضو', photo }] };
      }));
    }
    setMemberModal(false);
  };
  const removeMember = (committeeId: CommitteeId, memberId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) return;
    setCommittees((prev) => prev.map((c) => c.id === committeeId ? { ...c, members: c.members.filter((m) => m.id !== memberId) } : c));
  };

  const openHead = (c: typeof committees[0]) => {
    setHeadCommittee(c.id);
    setHeadForm({ name: c.head.name, role: c.head.role, bio: c.head.bio, photo: c.head.photo, email: c.head.email, phone: c.head.phone ?? '', university: c.head.university ?? '', major: c.head.major ?? '', year: c.head.year ?? '' });
    setHeadModal(true);
  };
  const saveHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headCommittee) return;
    setCommittees((prev) => prev.map((c) => c.id === headCommittee ? { ...c, head: { ...c.head, ...headForm } } : c));
    setMembers((prev) => prev.map((m) => m.committee === headCommittee && m.role !== 'عضو' ? { ...m, name: headForm.name, email: headForm.email, phone: headForm.phone, university: headForm.university, major: headForm.major, year: headForm.year, photo: headForm.photo } : m));
    if (headCommittee === 'presidency') {
      updatePresidentProfile({ name: headForm.name, photo: headForm.photo, bio: headForm.bio, email: headForm.email });
    }
    setHeadModal(false);
  };

  const openAddResp = (committeeId: CommitteeId) => {
    setRespTarget({ committeeId, idx: -1 });
    setRespText('');
    setRespModal(true);
  };
  const openEditResp = (committeeId: CommitteeId, idx: number) => {
    const c = committees.find((x) => x.id === committeeId);
    setRespTarget({ committeeId, idx });
    setRespText(c?.responsibilities[idx] || '');
    setRespModal(true);
  };
  const saveResp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respTarget || !respText.trim()) return;
    const { committeeId, idx } = respTarget;
    setCommittees((prev) => prev.map((c) => {
      if (c.id !== committeeId) return c;
      const items = [...c.responsibilities];
      if (idx >= 0) items[idx] = respText;
      else items.push(respText);
      return { ...c, responsibilities: items };
    }));
    setRespModal(false);
  };
  const removeResp = (committeeId: CommitteeId, idx: number) => {
    if (!confirm('حذف هذا البند؟')) return;
    setCommittees((prev) => prev.map((c) => c.id === committeeId ? { ...c, responsibilities: c.responsibilities.filter((_, i) => i !== idx) } : c));
  };

  const openEditStat = (committeeId: CommitteeId, idx: number) => {
    const c = committees.find((x) => x.id === committeeId);
    setStatTarget({ committeeId, idx });
    setStatForm({ ...c!.stats[idx] });
    setStatModal(true);
  };
  const saveStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statTarget) return;
    const { committeeId, idx } = statTarget;
    setCommittees((prev) => prev.map((c) => {
      if (c.id !== committeeId) return c;
      const stats = [...c.stats];
      stats[idx] = { ...statForm };
      return { ...c, stats };
    }));
    setStatModal(false);
  };

  return (
    <div className="space-y-6">
      {committees.map((c) => (
        <div key={c.id} className="card overflow-hidden">
          <div className={`bg-gradient-to-l ${c.color} p-5`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">{c.name}</h3>
              <button onClick={() => openAddMember(c.id)} className="flex items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                <Plus className="h-4 w-4" /> إضافة عضو
              </button>
            </div>
          </div>
          <div className="p-5">
            {/* Head */}
            <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-bold uppercase text-gray-400">رئيس اللجنة / المسؤول</div>
                <button onClick={() => openHead(c)} className="flex items-center gap-1 rounded-lg bg-navy-50 px-2.5 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:bg-navy-100">
                  <Edit3 className="h-3.5 w-3.5" /> تعديل البيانات الكاملة
                </button>
              </div>
              <div className="flex items-center gap-4">
                <img src={c.head.photo} alt={c.head.name} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1 space-y-2">
                  <input type="text" value={c.head.name} onChange={(e) => { const v = e.target.value; setCommittees((prev) => prev.map((x) => x.id === c.id ? { ...x, head: { ...x.head, name: v } } : x)); if (c.id === 'presidency') updatePresidentProfile({ name: v }); }} className="input-field font-bold" placeholder="الاسم" />
                  <input type="text" value={c.head.role} onChange={(e) => setCommittees((prev) => prev.map((x) => x.id === c.id ? { ...x, head: { ...x.head, role: e.target.value } } : x))} className="input-field text-sm" placeholder="المسمى" />
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <input type="email" dir="ltr" value={c.head.email} onChange={(e) => setCommittees((prev) => prev.map((x) => x.id === c.id ? { ...x, head: { ...x.head, email: e.target.value } } : x))} className="input-field text-sm" placeholder="البريد الرسمي" />
                <input type="url" dir="ltr" value={c.head.photo} onChange={(e) => { const v = e.target.value; setCommittees((prev) => prev.map((x) => x.id === c.id ? { ...x, head: { ...x.head, photo: v } } : x)); if (c.id === 'presidency') updatePresidentProfile({ photo: v }); }} className="input-field text-sm" placeholder="رابط الصورة" />
              </div>
              <textarea rows={2} value={c.head.bio} onChange={(e) => setCommittees((prev) => prev.map((x) => x.id === c.id ? { ...x, head: { ...x.head, bio: e.target.value } } : x))} className="input-field mt-2 resize-none text-sm" placeholder="النبذة التعريفية" />
            </div>

            {/* Stats */}
            <div className="mb-4 rounded-xl border border-gray-100 p-4">
              <div className="mb-2 text-xs font-bold uppercase text-gray-400">الإحصائيات والعدادات</div>
              <div className="grid grid-cols-3 gap-2">
                {c.stats.map((s, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-2 text-center">
                    <input type="text" value={s.value} onChange={(e) => setCommittees((prev) => prev.map((x) => x.id === c.id ? { ...x, stats: x.stats.map((st, j) => j === i ? { ...st, value: e.target.value } : st) } : x))} className="input-field mb-1 text-center text-sm font-bold" />
                    <input type="text" value={s.label} onChange={(e) => setCommittees((prev) => prev.map((x) => x.id === c.id ? { ...x, stats: x.stats.map((st, j) => j === i ? { ...st, label: e.target.value } : st) } : x))} className="input-field text-center text-xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="mb-4 rounded-xl border border-gray-100 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-bold uppercase text-gray-400">المهام والمسؤوليات</div>
                <button onClick={() => openAddResp(c.id)} className="flex items-center gap-1 rounded-lg bg-navy-50 px-2.5 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:bg-navy-100">
                  <Plus className="h-3.5 w-3.5" /> إضافة بند
                </button>
              </div>
              <ul className="space-y-2">
                {(c.responsibilities || []).map((r, i) => (
                  <li key={i} className="group flex items-start gap-2 rounded-lg bg-gray-50 p-2 text-sm text-gray-600">
                    <span className="flex-1">{r}</span>
                    <button onClick={() => openEditResp(c.id, i)} className="flex h-6 w-6 items-center justify-center rounded-md text-navy-600 opacity-0 transition-opacity hover:bg-navy-100 group-hover:opacity-100" title="تعديل">
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => removeResp(c.id, i)} className="flex h-6 w-6 items-center justify-center rounded-md text-rose-600 opacity-0 transition-opacity hover:bg-rose-100 group-hover:opacity-100" title="حذف">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
                {(!c.responsibilities || c.responsibilities.length === 0) && (
                  <li className="py-2 text-center text-xs text-gray-400">لا توجد مهام مضافة.</li>
                )}
              </ul>
            </div>

            {/* Members */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-gray-400">الأعضاء</div>
              {(c.members || []).map((m) => (
                <div key={m?.id ?? Math.random()} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50">
                  <img src={m?.photo} alt={m?.name ?? ''} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-navy-900">{m?.name ?? 'غير محدد'}</div>
                    <div className="text-xs text-gray-500">{m?.position ?? 'عضو'}</div>
                  </div>
                  <button onClick={() => openEditMember(c.id, m)} className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-600 transition-colors hover:bg-navy-50" title="تعديل">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeMember(c.id, m?.id ?? '')} className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50" title="حذف">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {(!c.members || c.members.length === 0) && (
                <p className="py-4 text-center text-sm text-gray-400">لا يوجد أعضاء في هذه اللجنة.</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Member modal */}
      <Modal open={memberModal} onClose={() => setMemberModal(false)} title={editMember?.member ? 'تعديل عضو' : 'إضافة عضو جديد'} maxWidth="max-w-md">
        <form onSubmit={saveMember} className="space-y-4">
          <div>
            <label className="label-field">العضو *</label>
            {editMember?.member ? (
              <input type="text" value={editMember.member.name} disabled className="input-field bg-gray-50 text-gray-500" />
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => { setStudentSearch(e.target.value); setStudentDropdownOpen(true); setMemberForm((prev) => ({ ...prev, studentId: '' })); }}
                  onFocus={() => setStudentDropdownOpen(true)}
                  className="input-field"
                  placeholder="ابحث عن عضو مسجل..."
                />
                {studentDropdownOpen && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                    {(students || [])
                      .filter((s) => (s?.name ?? '').includes(studentSearch) || (s?.email ?? '').toLowerCase().includes(studentSearch.toLowerCase()))
                      .slice(0, 8)
                      .map((s) => (
                        <button
                          key={s?.id ?? Math.random()}
                          type="button"
                          onClick={() => {
                            setMemberForm((prev) => ({ ...prev, studentId: s?.id ?? '' }));
                            setStudentSearch(s?.name ?? '');
                            setStudentDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-right transition-colors hover:bg-navy-50"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-navy-700">{(s?.name ?? '?').charAt(0)}</div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-navy-900">{s?.name ?? 'غير محدد'}</div>
                            <div className="truncate text-xs text-gray-400" dir="ltr">{s?.email ?? ''}</div>
                          </div>
                        </button>
                      ))}
                    {(students || []).filter((s) => (s?.name ?? '').includes(studentSearch) || (s?.email ?? '').toLowerCase().includes(studentSearch.toLowerCase())).length === 0 && (
                      <div className="px-3 py-3 text-center text-xs text-rose-600">هذا العضو غير مسجل في قائمة أعضاء الاتحاد</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="label-field">المسمى الوظيفي</label>
            <input type="text" value={memberForm.position} onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })} className="input-field" placeholder="مثال: منسق، مستشار..." />
          </div>
          <div>
            <label className="label-field">رابط الصورة</label>
            <input type="url" value={memberForm.photo} onChange={(e) => setMemberForm({ ...memberForm, photo: e.target.value })} className="input-field" placeholder="https://..." dir="ltr" />
            <p className="mt-1 text-xs text-gray-400">اتركه فارغًا لاستخدام صورة افتراضية.</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setMemberModal(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> {editMember?.member ? 'حفظ التعديلات' : 'إضافة'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Head modal */}
      <Modal open={headModal} onClose={() => setHeadModal(false)} title="تعديل بيانات المسؤول الكاملة" maxWidth="max-w-md">
        <form onSubmit={saveHead} className="space-y-4">
          <div>
            <label className="label-field">الاسم الكامل</label>
            <input className="input-field" value={headForm.name} onChange={(e) => setHeadForm({ ...headForm, name: e.target.value })} />
          </div>
          <div>
            <label className="label-field">المسمى الوظيفي</label>
            <input className="input-field" value={headForm.role} onChange={(e) => setHeadForm({ ...headForm, role: e.target.value })} />
          </div>
          <div>
            <label className="label-field">النبذة التعريفية</label>
            <textarea rows={3} className="input-field resize-none" value={headForm.bio} onChange={(e) => setHeadForm({ ...headForm, bio: e.target.value })} />
          </div>
          <div>
            <label className="label-field">رابط الصورة</label>
            <input type="url" dir="ltr" className="input-field" value={headForm.photo} onChange={(e) => setHeadForm({ ...headForm, photo: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className="label-field">البريد الإلكتروني الرسمي</label>
            <input type="email" dir="ltr" className="input-field" value={headForm.email} onChange={(e) => setHeadForm({ ...headForm, email: e.target.value })} />
          </div>
          <div>
            <label className="label-field">رقم التواصل</label>
            <input type="tel" dir="ltr" className="input-field" value={headForm.phone} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); setHeadForm({ ...headForm, phone: v }); }} placeholder="05551234567" />
            <p className="mt-1.5 text-xs text-gray-400">يرجى كتابة الرقم بدءاً بـ 05 (مثال: 05551234567)</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">الجامعة</label>
              <input className="input-field" value={headForm.university} onChange={(e) => setHeadForm({ ...headForm, university: e.target.value })} placeholder="اسم الجامعة" />
            </div>
            <div>
              <label className="label-field">التخصص</label>
              <input className="input-field" value={headForm.major} onChange={(e) => setHeadForm({ ...headForm, major: e.target.value })} placeholder="التخصص" />
            </div>
          </div>
          <div>
            <label className="label-field">السنة الدراسية</label>
            <select className="input-field" value={headForm.year} onChange={(e) => setHeadForm({ ...headForm, year: e.target.value })}>
              <option value="">—</option>
              <option>السنة الأولى</option>
              <option>السنة الثانية</option>
              <option>السنة الثالثة</option>
              <option>السنة الرابعة</option>
              <option>دراسات عليا</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setHeadModal(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> حفظ</button>
          </div>
        </form>
      </Modal>

      {/* Responsibility modal */}
      <Modal open={respModal} onClose={() => setRespModal(false)} title={respTarget?.idx && respTarget.idx >= 0 ? 'تعديل البند' : 'إضافة بند جديد'} maxWidth="max-w-md">
        <form onSubmit={saveResp} className="space-y-4">
          <div>
            <label className="label-field">نص البند</label>
            <textarea rows={3} className="input-field resize-none" value={respText} onChange={(e) => setRespText(e.target.value)} placeholder="اكتب المهمة أو المسؤولية" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setRespModal(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> حفظ</button>
          </div>
        </form>
      </Modal>

      {/* Stat modal */}
      <Modal open={statModal} onClose={() => setStatModal(false)} title="تعديل الإحصائية" maxWidth="max-w-xs">
        <form onSubmit={saveStat} className="space-y-4">
          <div>
            <label className="label-field">الرقم/القيمة</label>
            <input className="input-field" value={statForm.value} onChange={(e) => setStatForm({ ...statForm, value: e.target.value })} />
          </div>
          <div>
            <label className="label-field">المسمى</label>
            <input className="input-field" value={statForm.label} onChange={(e) => setStatForm({ ...statForm, label: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setStatModal(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> حفظ</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ---------------- Events Tab ---------------- */
function EventsTab({ events, setEvents }: {
  events: UEvent[];
  setEvents: React.Dispatch<React.SetStateAction<UEvent[]>>;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    title: '', category: 'workshop' as EventCategory, date: '', time: '16:00',
    location: '', description: '', capacity: 50, status: 'upcoming' as 'upcoming' | 'past',
    image: '',
  });

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', category: 'workshop', date: '', time: '16:00', location: '', description: '', capacity: 50, status: 'upcoming', image: '' });
    setModalOpen(true);
  };

  const openEdit = (e: UEvent) => {
    setEditId(e.id);
    const d = new Date(e.date);
    setForm({
      title: e.title, category: e.category, date: e.date.slice(0, 10), time: d.toTimeString().slice(0, 5),
      location: e.location, description: e.description, capacity: e.capacity, status: e.status, image: e.image,
    });
    setModalOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    const iso = new Date(`${form.date}T${form.time}`).toISOString();
    const image = form.image || `https://images.pexels.com/photos/${['3184360', '256417', '6646917', '3184339', '1549326'][Math.floor(Math.random() * 5)]}/pexels-photo-${['3184360', '256417', '6646917', '3184339', '1549326'][Math.floor(Math.random() * 5)]}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
    if (editId) {
      setEvents((prev) => prev.map((ev) => ev.id === editId ? { ...ev, title: form.title, category: form.category, date: iso, location: form.location, description: form.description, capacity: form.capacity, status: form.status, image } : ev));
    } else {
      const newEvent: UEvent = { id: 'e' + Date.now(), title: form.title, category: form.category, date: iso, location: form.location, description: form.description, status: form.status, capacity: Number(form.capacity), registered: 0, image };
      setEvents((prev) => [newEvent, ...prev]);
    }
    setModalOpen(false);
  };

  const remove = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const filtered = events.filter((e) => e.title.includes(search) || e.location.includes(search));

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pr-10" placeholder="ابحث عن فعالية..." />
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> إضافة فعالية جديدة
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 font-bold">الفعالية</th>
                <th className="px-4 py-3 font-bold">التصنيف</th>
                <th className="px-4 py-3 font-bold">التاريخ</th>
                <th className="px-4 py-3 font-bold">التسجيل</th>
                <th className="px-4 py-3 font-bold">الحالة</th>
                <th className="px-4 py-3 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={e.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <div className="font-bold text-navy-900">{e.title}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${categoryColors[e.category]}`}>{categoryLabels[e.category]}</span></td>
                  <td className="px-4 py-3 text-gray-600">{new Date(e.date).toLocaleDateString('ar-EG')}</td>
                  <td className="px-4 py-3 text-gray-600">{e.registered}/{e.capacity}</td>
                  <td className="px-4 py-3">
                    {e.status === 'upcoming' ? <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">قادمة</span>
                      : <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">منتهية</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(e)} className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-600 transition-colors hover:bg-navy-50" title="تعديل"><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => remove(e.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50" title="حذف"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'} maxWidth="max-w-xl">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label-field">عنوان الفعالية *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="عنوان الفعالية" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">التصنيف</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as EventCategory })} className="input-field">
                {(Object.keys(categoryLabels) as EventCategory[]).map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">السعة</label>
              <input type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="input-field" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">التاريخ *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">الوقت</label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field">الموقع</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="مكان الفعالية" />
          </div>
          <div>
            <label className="label-field">الوصف</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="وصف الفعالية" />
          </div>
          <div>
            <label className="label-field">رابط الصورة</label>
            <div className="relative">
              <Image className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-field pr-10" placeholder="https://..." dir="ltr" />
            </div>
            <p className="mt-1 text-xs text-gray-400">اتركه فارغًا لاستخدام صورة عشوائية.</p>
          </div>
          <div>
            <label className="label-field">الحالة</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'upcoming' | 'past' })} className="input-field">
              <option value="upcoming">قادمة</option>
              <option value="past">منتهية</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary"><CheckCircle2 className="h-4 w-4" /> {editId ? 'حفظ التعديلات' : 'إضافة'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ---------------- Members Tab ---------------- */
function MembersTab({ members, setMembers, events, suggestions, currentUser, assignMemberRole, updateMemberProfile }: {
  members: ReturnType<typeof useApp>['members'];
  setMembers: React.Dispatch<React.SetStateAction<ReturnType<typeof useApp>['members']>>;
  events: UEvent[];
  suggestions: ReturnType<typeof useApp>['suggestions'];
  currentUser: ReturnType<typeof useApp>['currentUser'];
  assignMemberRole: ReturnType<typeof useApp>['assignMemberRole'];
  updateMemberProfile: ReturnType<typeof useApp>['updateMemberProfile'];
}) {
  const [search, setSearch] = useState('');
  const [roleModal, setRoleModal] = useState<{ id: string; name: string; currentRole?: string } | null>(null);
  const [roleForm, setRoleForm] = useState({ role: '', committeeId: '' as CommitteeId | '' });
  const [editModal, setEditModal] = useState<ReturnType<typeof useApp>['members'][0] | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', university: '', major: '', year: '', phone: '' });

  const roleOptions = [
    'رئيس الاتحاد', 'نائب الرئيس', 'المسؤول الإعلامي', 'المسؤول الأكاديمي',
    'مسؤول الأنشطة', 'المسؤول المالي', 'الرقابة', 'عضو عام',
  ];

  const filtered = (members || []).filter(
    (m) => (m?.name ?? '').includes(search) || (m?.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const removeMember = (id: string) => {
    if (!confirm('هل أنت متأكد من إزالة هذا العضو من الاتحاد؟')) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleStatus = (id: string) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m));
  };

  const openRoleModal = (m: ReturnType<typeof useApp>['members'][0]) => {
    setRoleModal({ id: m?.id ?? '', name: m?.name ?? 'غير محدد', currentRole: m?.role });
    setRoleForm({ role: m?.role ?? '', committeeId: (m?.committee ?? '') as CommitteeId | '' });
  };

  const openEditModal = (m: ReturnType<typeof useApp>['members'][0]) => {
    setEditModal(m);
    setEditForm({ name: m?.name ?? '', email: m?.email ?? '', university: m?.university ?? '', major: m?.major ?? '', year: m?.year ?? '', phone: m?.phone ?? '' });
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    updateMemberProfile(editModal.id, { ...editForm, phone: editForm.phone.replace(/[^0-9]/g, '') });
    setEditModal(null);
  };

  const submitRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModal || !roleForm.role) return;
    assignMemberRole(roleModal.id, roleForm.role, roleForm.committeeId || undefined);
    setRoleModal(null);
  };

  const isPresident = currentUser?.role === 'president';

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pr-10" placeholder="ابحث عن عضو..." />
        </div>
        <span className="text-sm text-gray-500">{(members || []).length} عضو</span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 font-bold">العضو</th>
                <th className="px-4 py-3 font-bold">المنصب الحالي</th>
                <th className="px-4 py-3 font-bold">الجامعة</th>
                <th className="px-4 py-3 font-bold">التخصص</th>
                <th className="px-4 py-3 font-bold">السنة</th>
                <th className="px-4 py-3 font-bold">رقم التواصل</th>
                <th className="px-4 py-3 font-bold">الحالة</th>
                <th className="px-4 py-3 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white">{(m.name ?? '?').charAt(0)}</div>
                      <div>
                        <div className="font-bold text-navy-900">{m.name}</div>
                        <div className="text-xs text-gray-400" dir="ltr">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {m.role && m.role !== 'عضو' ? (
                      <span className="inline-block rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-gold-800">{m.role}</span>
                    ) : (
                      <span className="text-xs text-gray-400">عضو</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.university ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{m.major ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{m.year ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600" dir="ltr">{m.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(m.id)} className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors ${m.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {m.status === 'active' ? 'نشط' : 'غير نشط'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {isPresident && (
                        <>
                          <button onClick={() => openRoleModal(m)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gold-600 transition-colors hover:bg-gold-50" title="تغيير المنصب">
                            <Crown className="h-4 w-4" />
                          </button>
                          <button onClick={() => openEditModal(m)} className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-600 transition-colors hover:bg-navy-50" title="تعديل البيانات">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => removeMember(m.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50" title="إزالة"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!roleModal} onClose={() => setRoleModal(null)} title="تغيير المنصب / تعيين التكليف" maxWidth="max-w-md">
        {roleModal && (
          <form onSubmit={submitRole} className="space-y-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="text-xs text-gray-400">العضو المحدد</div>
              <div className="text-sm font-bold text-navy-900">{roleModal.name}</div>
              {roleModal.currentRole && <div className="mt-1 text-xs text-gray-500">المنصب الحالي: {roleModal.currentRole}</div>}
            </div>
            <div>
              <label className="label-field">الدور التنظيمي</label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleForm({ ...roleForm, role: r })}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${roleForm.role === r ? 'border-gold-400 bg-gold-50 text-gold-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setRoleModal(null)} className="btn-ghost">إلغاء</button>
              <button type="submit" className="btn-primary">
                <Crown className="h-4 w-4" /> تعيين المنصب
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="تعديل البيانات العامة" maxWidth="max-w-lg">
        {editModal && (
          <form onSubmit={submitEdit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field">الاسم الكامل</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input-field" placeholder="الاسم الكامل" />
              </div>
              <div>
                <label className="label-field">البريد الإلكتروني</label>
                <input type="email" dir="ltr" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="input-field" placeholder="example@email.com" />
              </div>
              <div>
                <label className="label-field">الجامعة</label>
                <input type="text" value={editForm.university} onChange={(e) => setEditForm({ ...editForm, university: e.target.value })} className="input-field" placeholder="اسم الجامعة" />
              </div>
              <div>
                <label className="label-field">التخصص</label>
                <input type="text" value={editForm.major} onChange={(e) => setEditForm({ ...editForm, major: e.target.value })} className="input-field" placeholder="التخصص" />
              </div>
              <div>
                <label className="label-field">السنة الدراسية</label>
                <select value={editForm.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} className="input-field">
                  <option>السنة الأولى</option>
                  <option>السنة الثانية</option>
                  <option>السنة الثالثة</option>
                  <option>السنة الرابعة</option>
                  <option>دراسات عليا</option>
                </select>
              </div>
              <div>
                <label className="label-field">رقم التواصل</label>
                <input type="tel" dir="ltr" value={editForm.phone} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); setEditForm({ ...editForm, phone: v }); }} className="input-field" placeholder="05551234567" />
                <p className="mt-1.5 text-xs text-gray-400">يرجى كتابة الرقم بدءاً بـ 05 (مثال: 05551234567)</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditModal(null)} className="btn-ghost">إلغاء</button>
              <button type="submit" className="btn-primary">
                <Save className="h-4 w-4" /> حفظ التعديلات
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

/* ---------------- Applications Tab ---------------- */
function ApplicationsTab({
  applications, scheduleInterview, decideApplication,
}: {
  applications: StudentApplication[];
  scheduleInterview: (id: string, interview: InterviewInfo) => void;
  decideApplication: (id: string, status: 'accepted' | 'rejected', rejectionReason?: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [interviewModal, setInterviewModal] = useState<StudentApplication | null>(null);
  const [decisionModal, setDecisionModal] = useState<StudentApplication | null>(null);
  const [interviewForm, setInterviewForm] = useState({ date: '', time: '16:00', meetingUrl: '' });
  const [decisionForm, setDecisionForm] = useState({ status: 'accepted' as 'accepted' | 'rejected', reason: '' });

  const filtered = applications.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (search && !a.name.includes(search) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const openInterview = (app: StudentApplication) => {
    setInterviewModal(app);
    setInterviewForm({ date: '', time: '16:00', meetingUrl: '' });
  };

  const submitInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModal || !interviewForm.date) return;
    scheduleInterview(interviewModal.id, { date: interviewForm.date, time: interviewForm.time, meetingUrl: interviewForm.meetingUrl || 'https://meet.google.com/xxx-xxxx-xxx' });
    setInterviewModal(null);
  };

  const openDecision = (app: StudentApplication, status: 'accepted' | 'rejected') => {
    setDecisionModal(app);
    setDecisionForm({ status, reason: '' });
  };

  const submitDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionModal) return;
    decideApplication(decisionModal.id, decisionForm.status, decisionForm.status === 'rejected' ? decisionForm.reason : undefined);
    setDecisionModal(null);
  };

  return (
    <div>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {([
          { key: 'all', label: 'الإجمالي', color: 'bg-navy-800' },
          { key: 'pending', label: 'قيد المراجعة', color: 'bg-gold-500' },
          { key: 'interview', label: 'مقابلة مجدولة', color: 'bg-sky-500' },
          { key: 'accepted', label: 'مقبول', color: 'bg-emerald-500' },
          { key: 'rejected', label: 'مرفوض', color: 'bg-rose-500' },
        ] as { key: keyof typeof counts; label: string; color: string }[]).map((c) => (
          <button key={c.key} onClick={() => setStatusFilter(c.key)} className={`card flex items-center gap-3 p-4 text-right transition-all hover:shadow-md ${statusFilter === c.key ? 'ring-2 ring-navy-400' : ''}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color} text-white`}><Inbox className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-navy-900">{counts[c.key]}</div>
              <div className="text-xs text-gray-500">{c.label}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pr-10" placeholder="ابحث عن متقدم..." />
        </div>
        <span className="text-sm text-gray-500">{filtered.length} طلب</span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 font-bold">المتقدم</th>
                <th className="px-4 py-3 font-bold">الجامعة</th>
                <th className="px-4 py-3 font-bold">تاريخ التقديم</th>
                <th className="px-4 py-3 font-bold">الحالة</th>
                <th className="px-4 py-3 font-bold">المقابلة</th>
                <th className="px-4 py-3 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white">{a.name.charAt(0)}</div>
                      <div>
                        <div className="font-bold text-navy-900">{a.name}</div>
                        <div className="text-xs text-gray-400" dir="ltr">{a.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.university}<div className="text-xs text-gray-400">{a.major}</div></td>
                  <td className="px-4 py-3 text-gray-600">{a.appliedAt}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${applicationStatusColors[a.status]}`}>{applicationStatusLabels[a.status]}</span></td>
                  <td className="px-4 py-3">
                    {a.interview ? (
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5 text-sky-500" />{new Date(a.interview.date).toLocaleDateString('ar-EG')}</div>
                        <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-sky-500" />{a.interview.time}</div>
                      </div>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {a.status === 'pending' && (
                        <button onClick={() => openInterview(a)} className="flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-100">
                          <Video className="h-3.5 w-3.5" /> قبول للمقابلة
                        </button>
                      )}
                      {a.status === 'interview' && (
                        <>
                          <button onClick={() => openDecision(a, 'accepted')} className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100">
                            <UserCheck className="h-3.5 w-3.5" /> قبول نهائي
                          </button>
                          <button onClick={() => openDecision(a, 'rejected')} className="flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100">
                            <UserX className="h-3.5 w-3.5" /> رفض
                          </button>
                        </>
                      )}
                      {(a.status === 'accepted' || a.status === 'rejected') && (
                        <span className="text-xs text-gray-400">تم البت بتاريخ {a.decidedAt}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!interviewModal} onClose={() => setInterviewModal(null)} title="جدولة مقابلة شخصية" maxWidth="max-w-lg">
        {interviewModal && (
          <form onSubmit={submitInterview} className="space-y-4">
            <div className="rounded-xl bg-navy-50 p-3 text-sm">
              <span className="font-bold text-navy-900">{interviewModal.name}</span>
              <span className="text-gray-500"> - {interviewModal.university}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field">تاريخ المقابلة *</label>
                <input type="date" value={interviewForm.date} onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label-field">الوقت</label>
                <input type="time" value={interviewForm.time} onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })} className="input-field" />
              </div>
            </div>
            <div>
              <label className="label-field">رابط المقابلة (Zoom / Meet)</label>
              <div className="relative">
                <Link2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="url" value={interviewForm.meetingUrl} onChange={(e) => setInterviewForm({ ...interviewForm, meetingUrl: e.target.value })} className="input-field pr-10" placeholder="https://meet.google.com/..." dir="ltr" />
              </div>
              <p className="mt-1 text-xs text-gray-400">سيظهر الرابط للطالب في لوحة تحكمه.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setInterviewModal(null)} className="btn-ghost">إلغاء</button>
              <button type="submit" className="btn-primary"><Video className="h-4 w-4" />تأكيد وتجدولة</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!decisionModal} onClose={() => setDecisionModal(null)} title={decisionForm.status === 'accepted' ? 'تأكيد القبول النهائي' : 'رفض الطلب'} maxWidth="max-w-md">
        {decisionModal && (
          <form onSubmit={submitDecision} className="space-y-4">
            <div className={`rounded-xl p-3 text-sm ${decisionForm.status === 'accepted' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
              <span className="font-bold">{decisionModal.name}</span>
              <span> - {decisionModal.email}</span>
            </div>
            {decisionForm.status === 'accepted' ? (
              <p className="text-sm text-gray-600">سيتم منح الطالب صلاحيات العضو الكاملة وتفعيل حسابه. سيظهر له تنبيه القبول في لوحة التحكم.</p>
            ) : (
              <div>
                <p className="mb-3 text-sm text-gray-600">سيتم إرسال رسالة شكر واعتذار للطالب. يمكنك إضافة سبب الرفض (اختياري).</p>
                <label className="label-field">سبب الرفض</label>
                <textarea rows={3} value={decisionForm.reason} onChange={(e) => setDecisionForm({ ...decisionForm, reason: e.target.value })} className="input-field resize-none" placeholder="سبب الرفض..." />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setDecisionModal(null)} className="btn-ghost">إلغاء</button>
              <button type="submit" className={decisionForm.status === 'accepted' ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98]' : 'inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-[0.98]'}>
                {decisionForm.status === 'accepted' ? <><UserCheck className="h-4 w-4" />تأكيد القبول</> : <><UserX className="h-4 w-4" />تأكيد الرفض</>}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

/* ---------------- Plans & Reports Tab ---------------- */
const COMMITTEE_LABELS: Record<CommitteeId, string> = {
  presidency: 'الرئاسة',
  'vice-presidency': 'النيابة',
  media: 'اللجنة الإعلامية',
  academic: 'اللجنة الأكاديمية',
  activities: 'اللجنة الأنشطة',
  finance: 'اللجنة المالية',
  supervisory: 'اللجنة الرقابية',
};

const COMMITTEE_BADGE_CLS: Record<CommitteeId, string> = {
  presidency: 'bg-gold-100 text-gold-700',
  'vice-presidency': 'bg-navy-100 text-navy-700',
  media: 'bg-sky-100 text-sky-700',
  academic: 'bg-emerald-100 text-emerald-700',
  activities: 'bg-rose-100 text-rose-700',
  finance: 'bg-amber-100 text-amber-700',
  supervisory: 'bg-violet-100 text-violet-700',
};

function PlansTab({ plans, setPlans, reports, setReports, currentUser }: {
  plans: ReturnType<typeof useApp>['plans'];
  setPlans: React.Dispatch<React.SetStateAction<ReturnType<typeof useApp>['plans']>>;
  reports: ReturnType<typeof useApp>['reports'];
  setReports: React.Dispatch<React.SetStateAction<ReturnType<typeof useApp>['reports']>>;
  currentUser: ReturnType<typeof useApp>['currentUser'];
}) {
  const isPresident = currentUser?.role === 'president';
  const myCommittee = currentUser?.committee;

  const visiblePlans = useMemo(() => {
    if (isPresident) return plans;
    return plans.filter((p) => !p.committee || p.committee === myCommittee);
  }, [plans, isPresident, myCommittee]);

  const visibleReports = useMemo(() => {
    if (isPresident) return reports;
    return reports.filter((r) => r.isGeneral || !r.committee || r.committee === myCommittee);
  }, [reports, isPresident, myCommittee]);

  const canModifyPlan = (p: ReturnType<typeof useApp>['plans'][0]) => {
    if (isPresident) return true;
    return p.authorId === currentUser?.email;
  };
  const canModifyReport = (r: ReturnType<typeof useApp>['reports'][0]) => {
    if (isPresident) return true;
    return r.authorId === currentUser?.email;
  };

  const [planModal, setPlanModal] = useState(false);
  const [editPlanId, setEditPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({ title: '', description: '', quarter: '', owner: '', status: 'planned' as 'planned' | 'in-progress' | 'completed', progress: 0, committee: (myCommittee ?? 'presidency') as CommitteeId, pdfUrl: '' });

  const openAddPlan = () => {
    setEditPlanId(null);
    setPlanForm({ title: '', description: '', quarter: '', owner: currentUser?.name ?? '', status: 'planned', progress: 0, committee: (myCommittee ?? 'presidency') as CommitteeId, pdfUrl: '' });
    setPlanModal(true);
  };
  const openEditPlan = (p: ReturnType<typeof useApp>['plans'][0]) => {
    setEditPlanId(p.id);
    setPlanForm({ title: p.title, description: p.description, quarter: p.quarter, owner: p.owner, status: p.status, progress: p.progress, committee: (p.committee ?? 'presidency') as CommitteeId, pdfUrl: p.pdfUrl ?? '' });
    setPlanModal(true);
  };
  const savePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.title.trim()) return;
    const payload = { ...planForm, progress: Number(planForm.progress), committee: planForm.committee as CommitteeId, authorRole: isPresident ? 'president' : 'committee-head', authorId: currentUser?.email ?? '', pdfUrl: planForm.pdfUrl.trim() || undefined };
    if (editPlanId) {
      setPlans((prev) => prev.map((p) => p.id === editPlanId ? { ...p, ...payload } : p));
    } else {
      setPlans((prev) => [{ id: 'p' + Date.now(), ...payload }, ...prev]);
    }
    setPlanModal(false);
  };
  const removePlan = (id: string) => { if (confirm('هل أنت متأكد من حذف هذه الخطة؟')) setPlans((prev) => prev.filter((p) => p.id !== id)); };

  const [reportModal, setReportModal] = useState(false);
  const [editReportId, setEditReportId] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState({ title: '', type: 'تقرير لجنة', period: '', date: '', summary: '', committee: (myCommittee ?? 'presidency') as CommitteeId, pdfUrl: '', isGeneral: false });

  const openAddReport = () => {
    setEditReportId(null);
    setReportForm({ title: '', type: 'تقرير لجنة', period: '', date: new Date().toISOString().slice(0, 10), summary: '', committee: (myCommittee ?? 'presidency') as CommitteeId, pdfUrl: '', isGeneral: false });
    setReportModal(true);
  };
  const openEditReport = (r: ReturnType<typeof useApp>['reports'][0]) => {
    setEditReportId(r.id);
    setReportForm({ title: r.title, type: r.type, period: r.period, date: r.date, summary: r.summary, committee: (r.committee ?? 'presidency') as CommitteeId, pdfUrl: r.pdfUrl ?? '', isGeneral: r.isGeneral ?? false });
    setReportModal(true);
  };
  const saveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title.trim()) return;
    const payload = { ...reportForm, committee: reportForm.committee as CommitteeId, authorRole: isPresident ? 'president' : 'committee-head', authorId: currentUser?.email ?? '', pdfUrl: reportForm.pdfUrl.trim() || undefined };
    if (editReportId) {
      setReports((prev) => prev.map((r) => r.id === editReportId ? { ...r, ...payload } : r));
    } else {
      setReports((prev) => [{ id: 'r' + Date.now(), ...payload }, ...prev]);
    }
    setReportModal(false);
  };
  const removeReport = (id: string) => { if (confirm('هل أنت متأكد من حذف هذا التقرير؟')) setReports((prev) => prev.filter((r) => r.id !== id)); };

  const [viewReport, setViewReport] = useState<ReturnType<typeof useApp>['reports'][0] | null>(null);

  const statusMap = {
    planned: { label: 'مخطط', cls: 'bg-gray-100 text-gray-600' },
    'in-progress': { label: 'قيد التنفيذ', cls: 'bg-gold-100 text-gold-700' },
    completed: { label: 'مكتمل', cls: 'bg-emerald-100 text-emerald-700' },
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900"><Target className="h-5 w-5 text-navy-600" /> الخطط الإدارية</h3>
          <button onClick={openAddPlan} className="btn-primary"><Plus className="h-4 w-4" /> خطة جديدة</button>
        </div>
        {visiblePlans.length === 0 ? (
          <div className="card p-8 text-center text-sm text-gray-400">لا توجد خطط متاحة لعرضها حالياً.</div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visiblePlans.map((p) => (
            <div key={p.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-base font-bold text-navy-900">{p.title}</h4>
                  {p.committee && (
                    <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${COMMITTEE_BADGE_CLS[p.committee]}`}>خطة {COMMITTEE_LABELS[p.committee]}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusMap[p.status].cls}`}>{statusMap[p.status].label}</span>
                  {canModifyPlan(p) && (
                    <>
                      <button onClick={() => openEditPlan(p)} className="flex h-7 w-7 items-center justify-center rounded-lg text-navy-600 transition-colors hover:bg-navy-50" title="تعديل"><Edit3 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => removePlan(p.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50" title="حذف"><Trash2 className="h-3.5 w-3.5" /></button>
                    </>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{p.description}</p>
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500">التقدم</span>
                  <span className="font-bold text-navy-900">{p.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full transition-all ${p.progress === 100 ? 'bg-emerald-500' : 'bg-navy-600'}`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.quarter}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{p.owner}</span>
              </div>
              {p.pdfUrl && (
                <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:bg-navy-100">
                  <FileText className="h-3.5 w-3.5" /> معاينة/تحميل ملف PDF التصور
                </a>
              )}
            </div>
          ))}
        </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900"><FileText className="h-5 w-5 text-navy-600" /> التقارير</h3>
          <button onClick={openAddReport} className="btn-primary"><Plus className="h-4 w-4" /> تقرير جديد</button>
        </div>
        {visibleReports.length === 0 ? (
          <div className="card p-8 text-center text-sm text-gray-400">لا توجد تقارير متاحة لعرضها حالياً.</div>
        ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {visibleReports.map((r) => (
            <div key={r.id} className="card flex flex-col p-5 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-bold text-navy-700">{r.type}</span>
                {r.isGeneral && <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">عام</span>}
                {r.committee && !r.isGeneral && <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${COMMITTEE_BADGE_CLS[r.committee]}`}>{COMMITTEE_LABELS[r.committee]}</span>}
              </div>
              <h4 className="mt-3 text-base font-bold text-navy-900">{r.title}</h4>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{r.summary}</p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">{r.date}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewReport(r)} className="inline-flex items-center gap-1 text-xs font-bold text-navy-700 hover:text-navy-900">عرض التقرير <ChevronLeft className="h-3.5 w-3.5" /></button>
                  {canModifyReport(r) && (
                    <>
                      <button onClick={() => openEditReport(r)} className="flex h-7 w-7 items-center justify-center rounded-lg text-navy-600 transition-colors hover:bg-navy-50" title="تعديل"><Edit3 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => removeReport(r.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50" title="حذف"><Trash2 className="h-3.5 w-3.5" /></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Plan Modal */}
      <Modal open={planModal} onClose={() => setPlanModal(false)} title={editPlanId ? 'تعديل الخطة' : 'إضافة خطة إدارية'} maxWidth="max-w-lg">
        <form onSubmit={savePlan} className="space-y-4">
          <div>
            <label className="label-field">عنوان الخطة *</label>
            <input type="text" value={planForm.title} onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label-field">اللجنة / المكتب التابع</label>
            <select value={planForm.committee} onChange={(e) => setPlanForm({ ...planForm, committee: e.target.value as CommitteeId })} className="input-field" disabled={!isPresident}>
              {Object.entries(COMMITTEE_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">الوصف التفصيلي</label>
            <textarea rows={3} value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} className="input-field resize-none" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">الحالة</label>
              <select value={planForm.status} onChange={(e) => setPlanForm({ ...planForm, status: e.target.value as 'planned' | 'in-progress' | 'completed' })} className="input-field">
                <option value="planned">مخطط</option>
                <option value="in-progress">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
              </select>
            </div>
            <div>
              <label className="label-field">نسبة التقدم: {planForm.progress}%</label>
              <input type="range" min={0} max={100} value={planForm.progress} onChange={(e) => setPlanForm({ ...planForm, progress: Number(e.target.value) })} className="w-full accent-navy-700" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">الفترة الزمنية</label>
              <select value={planForm.quarter} onChange={(e) => setPlanForm({ ...planForm, quarter: e.target.value })} className="input-field">
                <option value="">— اختر —</option>
                <option>الربع الأول 2026</option>
                <option>الربع الثاني 2026</option>
                <option>الربع الثالث 2026</option>
                <option>الربع الرابع 2026</option>
                <option>السنة 2026</option>
                <option>الربع الأول 2027</option>
              </select>
            </div>
            <div>
              <label className="label-field">المسؤول</label>
              <input type="text" value={planForm.owner} onChange={(e) => setPlanForm({ ...planForm, owner: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field">إرفاق ملف التصور PDF (رابط)</label>
            <div className="relative">
              <Paperclip className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="url" dir="ltr" value={planForm.pdfUrl} onChange={(e) => setPlanForm({ ...planForm, pdfUrl: e.target.value })} className="input-field pr-10" placeholder="https://example.com/plan.pdf" />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">ألصق رابط ملف الـ PDF التفصيلي للخطة ليظهر زر المعاينة والتحميل.</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setPlanModal(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary"><CheckCircle2 className="h-4 w-4" /> {editPlanId ? 'حفظ التعديلات' : 'إضافة'}</button>
          </div>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal open={reportModal} onClose={() => setReportModal(false)} title={editReportId ? 'تعديل التقرير' : 'إضافة تقرير'} maxWidth="max-w-lg">
        <form onSubmit={saveReport} className="space-y-4">
          <div>
            <label className="label-field">عنوان التقرير *</label>
            <input type="text" value={reportForm.title} onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })} className="input-field" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">نوع التقرير</label>
              <select value={reportForm.type} onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })} className="input-field">
                <option>تقرير سنوي</option>
                <option>تقرير ربع سنوي</option>
                <option>تقرير لجنة</option>
              </select>
            </div>
            <div>
              <label className="label-field">اللجنة التابعة</label>
              <select value={reportForm.committee} onChange={(e) => setReportForm({ ...reportForm, committee: e.target.value as CommitteeId })} className="input-field" disabled={!isPresident}>
                {Object.entries(COMMITTEE_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">تاريخ الصدور</label>
              <input type="date" value={reportForm.date} onChange={(e) => setReportForm({ ...reportForm, date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">الفترة</label>
              <input type="text" value={reportForm.period} onChange={(e) => setReportForm({ ...reportForm, period: e.target.value })} className="input-field" placeholder="مثال: سنوي / ربع سنوي" />
            </div>
          </div>
          <div>
            <label className="label-field">ملخص التقرير</label>
            <textarea rows={3} value={reportForm.summary} onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })} className="input-field resize-none" />
          </div>
          <div>
            <label className="label-field">إرفاق ملف التقرير الكامل PDF (رابط)</label>
            <div className="relative">
              <Paperclip className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="url" dir="ltr" value={reportForm.pdfUrl} onChange={(e) => setReportForm({ ...reportForm, pdfUrl: e.target.value })} className="input-field pr-10" placeholder="https://example.com/report.pdf" />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">ألصق رابط ملف الـ PDF الكامل للتقرير ليظهر زر المعاينة والتحميل.</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={reportForm.isGeneral} onChange={(e) => setReportForm({ ...reportForm, isGeneral: e.target.checked })} className="h-4 w-4 accent-navy-700" />
            تقرير عام (متاح لجميع اللجان)
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setReportModal(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary"><CheckCircle2 className="h-4 w-4" /> {editReportId ? 'حفظ التعديلات' : 'إضافة'}</button>
          </div>
        </form>
      </Modal>

      {/* View Report Modal */}
      <Modal open={!!viewReport} onClose={() => setViewReport(null)} title="استعراض التقرير" maxWidth="max-w-xl">
        {viewReport && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-bold text-navy-700">{viewReport.type}</span>
              {viewReport.isGeneral && <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">عام</span>}
              {viewReport.committee && !viewReport.isGeneral && <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${COMMITTEE_BADGE_CLS[viewReport.committee]}`}>{COMMITTEE_LABELS[viewReport.committee]}</span>}
              <span className="text-xs text-gray-400">{viewReport.date}</span>
            </div>
            <h4 className="text-lg font-bold text-navy-900">{viewReport.title}</h4>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="mb-2 text-xs font-bold text-gray-400">الملخص التنفيذي</div>
              <p className="text-sm leading-relaxed text-gray-600">{viewReport.summary}</p>
            </div>
            {viewReport.pdfUrl ? (
              <a href={viewReport.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy-700">
                <Download className="h-4 w-4" /> معاينة / تحميل التقرير PDF
              </a>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-400">
                <FileText className="h-4 w-4" /> لا يوجد ملف PDF مرفق لهذا التقرير.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}


/* ---------------- Profile Tab ---------------- */
function ProfileTab({ currentUser }: { currentUser: ReturnType<typeof useApp>["currentUser"] }) {
  const { committees, updateOwnProfile, updateCommitteeVision } = useApp();
  const myCommittee = currentUser?.committee;
  const committee = committees.find((c) => c.id === myCommittee);
  const [form, setForm] = useState({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    phone: "",
    university: "",
    major: "",
    year: "",
  });
  const [visionForm, setVisionForm] = useState({
    vision: committee?.vision ?? "",
    goals: committee?.goals ?? "",
  });
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateOwnProfile({ ...form, phone: form.phone.replace(/[^0-9]/g, "") });
    setSavedAt(Date.now());
  };
  const saveVision = (e: React.FormEvent) => {
    e.preventDefault();
    if (myCommittee) updateCommitteeVision(myCommittee, { ...visionForm });
    setSavedAt(Date.now());
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900"><User className="h-5 w-5 text-navy-600" /> البيانات الشخصية</h3>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="label-field">الاسم الكامل</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label-field">البريد الإلكتروني</label>
            <input type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label-field">رقم التواصل</label>
            <input type="tel" dir="ltr" value={form.phone} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 10); setForm({ ...form, phone: v }); }} className="input-field" placeholder="05551234567" />
            <p className="mt-1.5 text-xs text-gray-400">يرجى كتابة الرقم بدءاً بـ 05 (مثال: 05551234567)</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">الجامعة</label>
              <input type="text" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">التخصص</label>
              <input type="text" value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field">السنة الدراسية</label>
            <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="input-field">
              <option value="">—</option>
              <option>السنة الأولى</option>
              <option>السنة الثانية</option>
              <option>السنة الثالثة</option>
              <option>السنة الرابعة</option>
              <option>دراسات عليا</option>
            </select>
          </div>
          <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> حفظ البيانات</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900"><Target className="h-5 w-5 text-navy-600" /> رؤية وأهداف اللجنة</h3>
        {committee ? (
          <form onSubmit={saveVision} className="space-y-4">
            <div className="rounded-lg bg-navy-50 px-4 py-2 text-sm font-bold text-navy-700">{committee.name}</div>
            <div>
              <label className="label-field">الرؤية</label>
              <textarea rows={4} value={visionForm.vision} onChange={(e) => setVisionForm({ ...visionForm, vision: e.target.value })} className="input-field resize-none" placeholder="رؤية اللجنة المستقبلية..." />
            </div>
            <div>
              <label className="label-field">الأهداف</label>
              <textarea rows={4} value={visionForm.goals} onChange={(e) => setVisionForm({ ...visionForm, goals: e.target.value })} className="input-field resize-none" placeholder="أهداف اللجنة الاستراتيجية..." />
            </div>
            <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> حفظ الرؤية والأهداف</button>
          </form>
        ) : (
          <p className="text-sm text-gray-400">لا توجد لجنة مرتبطة بحسابك.</p>
        )}
      </div>

      {savedAt && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg animate-fade-in-fast">
          <CheckCircle2 className="ml-2 inline h-4 w-4" /> تم حفظ التغييرات بنجاح
        </div>
      )}
    </div>
  );
}

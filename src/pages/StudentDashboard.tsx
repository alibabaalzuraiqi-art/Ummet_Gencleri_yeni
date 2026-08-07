import { useState, useEffect } from 'react';
import { CalendarDays, Lightbulb, CheckCircle2, Clock, MapPin, Users, LogOut, Send, Sparkles, UserCircle, GraduationCap, Mail, Building2, AlertCircle, Video, XCircle, PartyPopper, FileText, Pencil, Phone, Lock, MessageSquareReply } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categoryLabels, categoryColors, applicationStatusLabels, applicationStatusColors, type Suggestion, type ApplicationStatus } from '../data/mockData';
import Modal from '../components/Modal';

type Tab = 'activities' | 'suggestions' | 'application';

export default function StudentDashboard() {
  const { currentStudent, events, suggestions, setSuggestions, logout, setView, unregisterFromEvent, myApplication, updateStudentProfile } = useApp();
  const [tab, setTab] = useState<Tab>('activities');
  const [form, setForm] = useState({ title: '', body: '', category: 'اقتراح' });
  const [sent, setSent] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState(false);

  if (!currentStudent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-20 text-center">
        <UserCircle className="h-16 w-16 text-gray-300" />
        <h2 className="text-xl font-bold text-navy-900">يجب تسجيل الدخول أولًا</h2>
        <p className="text-sm text-gray-500">للوصول إلى لوحة تحكم الطالب، سجّل الدخول أو أنشئ حسابًا.</p>
        <button onClick={() => setView({ kind: 'login' })} className="btn-primary">تسجيل الدخول</button>
      </div>
    );
  }

  const myEvents = events.filter((e) => currentStudent.registeredEvents.includes(e.id));
  const mySuggestions = suggestions.filter((s) => s.studentId === currentStudent.id);
  const appStatus = myApplication?.status;
  const isAccepted = appStatus === 'accepted';

  const submitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    const ns: Suggestion = {
      id: 'sg' + Date.now(),
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentEmail: currentStudent.email,
      studentUniversity: currentStudent.university,
      studentMajor: currentStudent.major,
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'new',
    };
    setSuggestions((prev) => [ns, ...prev]);
    setForm({ title: '', body: '', category: 'اقتراح' });
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="animate-fade-in bg-gray-50 pt-16 lg:pt-20">
      {/* Header */}
      <div className="bg-gradient-to-l from-navy-800 to-navy-950">
        <div className="container-app py-10">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl font-extrabold text-white backdrop-blur-sm">
                {currentStudent.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white lg:text-3xl">{currentStudent.name}</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-300">
                  <GraduationCap className="h-4 w-4" />
                  {currentStudent.university} - {currentStudent.major}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <Pencil className="h-4 w-4" />
                تعديل الملف الشخصي
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </button>
            </div>
          </div>

          {/* Mini stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: CalendarDays, label: 'فعاليات مسجلة', value: myEvents.length },
              { icon: Lightbulb, label: 'اقتراحات مقدمة', value: mySuggestions.length },
              { icon: Clock, label: 'عضو منذ', value: currentStudent.joinedAt },
              { icon: CheckCircle2, label: 'الحالة', value: currentStudent.status === 'active' ? 'نشط' : 'غير نشط' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-gold-300" />
                  <div className="mt-2 text-lg font-extrabold text-white">{s.value}</div>
                  <div className="text-xs text-gray-300">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-app py-10">
        {/* Application status banner */}
        {myApplication && <ApplicationBanner status={myApplication.status} application={myApplication} />}

        {/* Tabs */}
        <div className="mb-6 inline-flex rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm">
          <button
            onClick={() => setTab('activities')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              tab === 'activities' ? 'bg-navy-800 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            أنشطتي
          </button>
          <button
            onClick={() => setTab('suggestions')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              tab === 'suggestions' ? 'bg-navy-800 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            الاقتراحات والمشاركات
          </button>
          {myApplication && (
            <button
              onClick={() => setTab('application')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                tab === 'application' ? 'bg-navy-800 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-4 w-4" />
              حالة الانضمام
            </button>
          )}
        </div>

        {tab === 'activities' ? (
          <div>
            {/* Profile card */}
            <div className="mb-6 grid gap-4 lg:grid-cols-3">
              <div className="card p-5 lg:col-span-1">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                    <UserCircle className="h-4 w-4" /> الملف الشخصي
                  </h3>
                  <button
                    onClick={() => setEditOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    تعديل
                  </button>
                </div>
                <dl className="space-y-3 text-sm">
                  {[
                    { icon: Mail, label: 'البريد', value: currentStudent.email, ltr: true },
                    { icon: Building2, label: 'الجامعة', value: currentStudent.university },
                    { icon: GraduationCap, label: 'التخصص', value: currentStudent.major },
                    { icon: UserCircle, label: 'السنة', value: currentStudent.year },
                  ].map((r) => {
                    const Icon = r.icon;
                    return (
                      <div key={r.label} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <dt className="text-xs text-gray-400">{r.label}</dt>
                          <dd className="font-semibold text-navy-900" dir={r.ltr ? 'ltr' : undefined}>{r.value}</dd>
                        </div>
                      </div>
                    );
                  })}
                </dl>
              </div>

              <div className="card p-5 lg:col-span-2">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                  <CalendarDays className="h-4 w-4" /> فعالياتي المسجلة
                </h3>
                {myEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <CalendarDays className="h-10 w-10 text-gray-300" />
                    <p className="mt-3 text-sm text-gray-500">لم تسجل في أي فعالية بعد.</p>
                    <button onClick={() => setView({ kind: 'programs' })} className="btn-ghost mt-4">
                      تصفح البرامج
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myEvents.map((e) => {
                      const date = new Date(e.date);
                      return (
                        <div key={e.id} className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50">
                          <img src={e.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="truncate text-sm font-bold text-navy-900">{e.title}</h4>
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${categoryColors[e.category]}`}>
                                {categoryLabels[e.category]}
                              </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{date.toLocaleDateString('ar-EG')}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{e.registered}/{e.capacity}</span>
                            </div>
                          </div>
                          {e.status === 'upcoming' && (
                            <button
                              onClick={() => unregisterFromEvent(e.id)}
                              className="shrink-0 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                            >
                              إلغاء التسجيل
                            </button>
                          )}
                          {e.status === 'past' && (
                            <span className="shrink-0 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                              منتهية
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : tab === 'suggestions' ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Submit suggestion */}
            <div className="card p-6 lg:col-span-1">
              <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900">
                <Sparkles className="h-5 w-5 text-gold-500" />
                قدّم اقتراحًا
              </h3>
              <p className="mt-1 text-sm text-gray-500">شاركنا أفكارك لتطوير أنشطة الاتحاد.</p>
              {sent && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 animate-fade-in-fast">
                  <CheckCircle2 className="h-4 w-4" />
                  تم إرسال اقتراحك بنجاح!
                </div>
              )}
              <form onSubmit={submitSuggestion} className="mt-4 space-y-3">
                <div>
                  <label className="label-field">العنوان</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input-field"
                    placeholder="عنوان الاقتراح"
                  />
                </div>
                <div>
                  <label className="label-field">التصنيف</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                  >
                    <option>اقتراح</option>
                    <option>برامج</option>
                    <option>أنشطة</option>
                    <option>شكاوى</option>
                    <option>أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="label-field">التفاصيل</label>
                  <textarea
                    rows={4}
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    className="input-field resize-none"
                    placeholder="اشرح فكرتك بالتفصيل..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  <Send className="h-4 w-4" />
                  إرسال
                </button>
              </form>
            </div>

            {/* My suggestions */}
            <div className="lg:col-span-2">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900">
                <Lightbulb className="h-5 w-5 text-gold-500" />
                اقتراحاتي السابقة
              </h3>
              {mySuggestions.length === 0 ? (
                <div className="card flex flex-col items-center justify-center py-12 text-center">
                  <Lightbulb className="h-10 w-10 text-gray-300" />
                  <p className="mt-3 text-sm text-gray-500">لم تقدم أي اقتراح بعد.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mySuggestions.map((s) => (
                    <div key={s.id} className="card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-bold text-navy-700">{s.category}</span>
                          <h4 className="text-sm font-bold text-navy-900">{s.title}</h4>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.body}</p>
                      <div className="mt-3 text-xs text-gray-400">{s.createdAt}</div>
                      {s.adminReply && (
                        <div className="mt-4 rounded-xl border border-navy-100 bg-navy-50 p-4">
                          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-navy-700">
                            <MessageSquareReply className="h-4 w-4" />
                            رد الإدارة
                            {s.adminDecision === 'accepted' && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">مقبول</span>}
                            {s.adminDecision === 'reviewing' && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] text-gold-700">قيد الدراسة</span>}
                            {s.adminDecision === 'unavailable' && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] text-rose-700">غير متاح حالياً</span>}
                          </div>
                          <p className="text-sm leading-relaxed text-navy-800">{s.adminReply}</p>
                          {s.repliedAt && <div className="mt-2 text-xs text-gray-400">{s.repliedAt}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : tab === 'application' && myApplication ? (
          <ApplicationDetails application={myApplication} isAccepted={isAccepted} />
        ) : null}
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        student={currentStudent}
        onSave={(updates) => {
          updateStudentProfile(updates);
          setEditOpen(false);
          setToast(true);
          setTimeout(() => setToast(false), 3000);
        }}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-slide-up rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-2xl">
          <CheckCircle2 className="ml-2 inline h-4 w-4" />
          تم تحديث بياناتك الشخصية بنجاح
        </div>
      )}
    </div>
  );
}

function ApplicationBanner({ status, application }: { status: ApplicationStatus; application: NonNullable<ReturnType<typeof useApp>['myApplication']> }) {
  if (!application) return null;
  const interviewDate = application.interview ? new Date(application.interview.date) : null;

  const configs: Record<ApplicationStatus, { icon: typeof Clock; bg: string; border: string; title: string; body: React.ReactNode }> = {
    pending: {
      icon: Clock,
      bg: 'bg-gold-50',
      border: 'border-gold-200',
      title: 'طلبك قيد المراجعة من قبل إدارة الاتحاد',
      body: <span>تم استلام طلب انضمامك بتاريخ <strong>{application.appliedAt}</strong>. سيتم مراجعة طلبك والتواصل معك قريبًا.</span>,
    },
    interview: {
      icon: Video,
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      title: 'تمت الموافقة المبدئية! موعد مقابلتك الشخصية',
      body: (
        <span>
          موعد مقابلتك يوم <strong>{interviewDate?.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong> الساعة <strong>{application.interview?.time}</strong>.
          رابط المقابلة:{' '}
          <a href={application.interview?.meetingUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-sky-700 underline hover:text-sky-900" dir="ltr">{application.interview?.meetingUrl}</a>
        </span>
      ),
    },
    accepted: {
      icon: PartyPopper,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      title: 'مبروك! تم قبولك نهائيًا في الاتحاد',
      body: <span>أصبحت عضوًا كامل الصلاحيات في اتحاد شباب الأمة. يمكنك الآن التسجيل في الفعاليات والمشاركة في جميع الأنشطة.</span>,
    },
    rejected: {
      icon: XCircle,
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      title: 'شكرًا واعتذار',
      body: <span>{application.rejectionReason || 'نعتذر عن عدم قبول طلبك في هذه الدورة. نرحب بك لتقديم طلب جديد في الدورة القادمة.'}</span>,
    },
  };
  const cfg = configs[status];
  const Icon = cfg.icon;

  return (
    <div className={`mb-6 flex items-start gap-4 rounded-2xl border ${cfg.border} ${cfg.bg} p-5 animate-fade-in`}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${status === 'accepted' ? 'bg-emerald-500' : status === 'rejected' ? 'bg-rose-500' : status === 'interview' ? 'bg-sky-500' : 'bg-gold-500'} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-extrabold text-navy-900">{cfg.title}</div>
        <div className="mt-1 text-sm leading-relaxed text-gray-600">{cfg.body}</div>
      </div>
      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${applicationStatusColors[status]}`}>
        {applicationStatusLabels[status]}
      </span>
    </div>
  );
}

function ApplicationDetails({ application, isAccepted }: { application: NonNullable<ReturnType<typeof useApp>['myApplication']>; isAccepted: boolean }) {
  const steps: { key: ApplicationStatus; label: string; icon: typeof Clock }[] = [
    { key: 'pending', label: 'قيد المراجعة', icon: Clock },
    { key: 'interview', label: 'المقابلة', icon: Video },
    { key: 'accepted', label: 'القبول النهائي', icon: CheckCircle2 },
  ];
  const currentIdx = application.status === 'rejected' ? 0 : steps.findIndex((s) => s.key === application.status);

  return (
    <div className="space-y-6">
      {/* Progress tracker */}
      {application.status !== 'rejected' && (
        <div className="card p-6">
          <h3 className="mb-6 text-lg font-bold text-navy-900">مراحل طلب الانضمام</h3>
          <div className="flex items-center justify-between">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const done = i < currentIdx;
              const current = i === currentIdx;
              return (
                <div key={step.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${done ? 'bg-emerald-500 text-white' : current ? 'bg-navy-800 text-white shadow-lg ring-4 ring-navy-100' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-xs font-bold ${done || current ? 'text-navy-900' : 'text-gray-400'}`}>{step.label}</span>
                  {i < steps.length - 1 && (
                    <div className={`absolute -ml-12 mt-6 h-0.5 w-24 ${done ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Application info */}
      <div className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900">
          <FileText className="h-5 w-5 text-navy-600" />
          تفاصيل الطلب
        </h3>
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            { label: 'الاسم', value: application.name },
            { label: 'البريد الإلكتروني', value: application.email, ltr: true },
            { label: 'الجامعة', value: application.university },
            { label: 'التخصص', value: application.major },
            { label: 'السنة الدراسية', value: application.year },
            { label: 'تاريخ التقديم', value: application.appliedAt },
            { label: 'الحالة', value: applicationStatusLabels[application.status] },
            ...(application.decidedAt ? [{ label: 'تاريخ القرار', value: application.decidedAt }] : []),
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <dt className="text-xs text-gray-400">{r.label}</dt>
                <dd className="text-sm font-semibold text-navy-900" dir={(r as { ltr?: boolean }).ltr ? 'ltr' : undefined}>{r.value}</dd>
              </div>
            </div>
          ))}
        </dl>
        {application.motivation && (
          <div className="mt-4">
            <div className="mb-1 text-xs text-gray-400">دوافع الانضمام</div>
            <p className="rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">{application.motivation}</p>
          </div>
        )}
      </div>

      {/* Interview info */}
      {application.interview && (
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900">
            <Video className="h-5 w-5 text-sky-600" />
            تفاصيل المقابلة
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-center">
              <CalendarDays className="mx-auto h-6 w-6 text-sky-600" />
              <div className="mt-2 text-xs text-gray-500">التاريخ</div>
              <div className="text-sm font-bold text-navy-900">{new Date(application.interview.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-center">
              <Clock className="mx-auto h-6 w-6 text-sky-600" />
              <div className="mt-2 text-xs text-gray-500">الوقت</div>
              <div className="text-sm font-bold text-navy-900">{application.interview.time}</div>
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-center">
              <Video className="mx-auto h-6 w-6 text-sky-600" />
              <div className="mt-2 text-xs text-gray-500">رابط المقابلة</div>
              <a href={application.interview.meetingUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block max-w-full truncate text-sm font-bold text-sky-700 underline hover:text-sky-900" dir="ltr">{application.interview.meetingUrl}</a>
            </div>
          </div>
          <a href={application.interview.meetingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 w-full sm:w-auto">
            <Video className="h-4 w-4" />
            الانضمام إلى المقابلة
          </a>
        </div>
      )}

      {/* Rejection info */}
      {application.status === 'rejected' && (
        <div className="card border-rose-100 bg-rose-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">رسالة شكر واعتذار</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {application.rejectionReason || 'نعتذر عن عدم قبول طلبك في هذه الدورة. نرحب بك لتقديم طلب جديد في الدورة القادمة.'}
              </p>
              <p className="mt-3 text-sm font-semibold text-navy-700">نتمنى لك التوفيق في مسيرتك، ونرحب بك دائمًا في فعالياتنا العامة.</p>
            </div>
          </div>
        </div>
      )}

      {/* Accepted: full access notice */}
      {isAccepted && (
        <div className="card border-emerald-100 bg-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <PartyPopper className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">صلاحيات العضو الكاملة مفعّلة</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                يمكنك الآن التسجيل في جميع الفعاليات، تقديم الاقتراحات، والمشاركة في أنشطة الاتحاد الكاملة. أهلًا بك في عائلة اتحاد شباب الأمة!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Suggestion['status'] }) {
  const map = {
    new: { label: 'جديد', cls: 'bg-sky-100 text-sky-700' },
    reviewed: { label: 'قيد المراجعة', cls: 'bg-gold-100 text-gold-700' },
    implemented: { label: 'تم التنفيذ', cls: 'bg-emerald-100 text-emerald-700' },
  };
  const m = map[status];
  return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${m.cls}`}>{m.label}</span>;
}

function EditProfileModal({
  open,
  onClose,
  student,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  student: { name: string; email: string; university: string; major: string; year: string; phone?: string };
  onSave: (updates: { name: string; email: string; university: string; major: string; year: string; phone: string }) => void;
}) {
  const [form, setForm] = useState({
    name: student.name,
    email: student.email,
    university: student.university,
    major: student.major,
    year: student.year,
    phone: student.phone ?? '',
  });
  const [pwd, setPwd] = useState({ current: '', next: '' });
  const [error, setError] = useState('');

  // reset form when modal reopens with fresh student data
  useEffect(() => {
    if (open) {
      setForm({
        name: student.name,
        email: student.email,
        university: student.university,
        major: student.major,
        year: student.year,
        phone: student.phone ?? '',
      });
      setPwd({ current: '', next: '' });
      setError('');
    }
  }, [open, student]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.university.trim() || !form.major.trim()) {
      setError('الرجاء ملء حقول الاسم والجامعة والتخصص');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('بريد إلكتروني غير صالح');
      return;
    }
    onSave({
      name: form.name.trim(),
      email: form.email.trim(),
      university: form.university.trim(),
      major: form.major.trim(),
      year: form.year,
      phone: form.phone.trim(),
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="تعديل الملف الشخصي" maxWidth="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <div>
          <label className="label-field">الاسم الكامل *</label>
          <div className="relative">
            <UserCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(''); }}
              className="input-field pr-10"
              placeholder="اسمك الكامل"
            />
          </div>
        </div>
        <div>
          <label className="label-field">البريد الإلكتروني *</label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }}
              className="input-field pr-10"
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">الجامعة *</label>
            <div className="relative">
              <Building2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.university}
                onChange={(e) => { setForm({ ...form, university: e.target.value }); setError(''); }}
                className="input-field pr-10"
                placeholder="اسم جامعتك"
              />
            </div>
          </div>
          <div>
            <label className="label-field">التخصص *</label>
            <div className="relative">
              <GraduationCap className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.major}
                onChange={(e) => { setForm({ ...form, major: e.target.value }); setError(''); }}
                className="input-field pr-10"
                placeholder="تخصصك"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">السنة الدراسية</label>
            <select
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="input-field"
            >
              <option>السنة الأولى</option>
              <option>السنة الثانية</option>
              <option>السنة الثالثة</option>
              <option>السنة الرابعة</option>
              <option>دراسات عليا</option>
            </select>
          </div>
          <div>
            <label className="label-field">رقم الهاتف / الواتساب</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-field pr-10"
                placeholder="+90 5XX XXX XX XX"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-800">
            <Lock className="h-4 w-4" />
            تغيير كلمة المرور (اختياري)
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="password"
              value={pwd.current}
              onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
              className="input-field"
              placeholder="كلمة المرور الحالية"
            />
            <input
              type="password"
              value={pwd.next}
              onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
              className="input-field"
              placeholder="كلمة المرور الجديدة"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
            إلغاء
          </button>
          <button type="submit" className="btn-primary">
            <CheckCircle2 className="h-4 w-4" />
            حفظ التغييرات
          </button>
        </div>
      </form>
    </Modal>
  );
}

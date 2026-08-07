import { useState } from 'react';
import {
  Crown, UserCog, Megaphone, GraduationCap, ShieldCheck, CalendarDays, Wallet,
  ChevronLeft, ChevronRight, Mail, CheckCircle2, Users, Lock, ShieldAlert, Briefcase,
  Edit3, Trash2, Plus, Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { committeeOrder, committeeMeta, type CommitteeId, type CommitteeMember } from '../data/mockData';

const iconMap: Record<string, typeof Crown> = {
  Crown, UserCog, Megaphone, GraduationCap, ShieldCheck, CalendarDays, Wallet,
};

type HeadForm = { name: string; role: string; bio: string; photo: string; email: string };
type MemberForm = { name: string; position: string; photo: string };
type StatForm = { label: string; value: string };

export default function CommitteePage({ committeeId }: { committeeId: CommitteeId }) {
  const { committees, setCommittees, currentUser, setView } = useApp();
  const committee = committees.find((c) => c.id === committeeId);
  if (!committee) return null;

  const allowed = currentUser?.role === 'president' ||
    (currentUser?.role === 'committee-head' && currentUser.committee === committeeId);
  const isPresident = currentUser?.role === 'president';
  const Icon = iconMap[committee.icon] || Crown;

  const idx = committeeOrder.indexOf(committeeId);
  const prev = idx > 0 ? committeeOrder[idx - 1] : null;
  const next = idx < committeeOrder.length - 1 ? committeeOrder[idx + 1] : null;

  const isRestricted =
    currentUser?.role === 'committee-head' && currentUser.committee !== committeeId;

  // Modals
  const [headModal, setHeadModal] = useState(false);
  const [headForm, setHeadForm] = useState<HeadForm>({ name: '', role: '', bio: '', photo: '', email: '' });

  const [respModal, setRespModal] = useState(false);
  const [respIdx, setRespIdx] = useState<number>(-1);
  const [respText, setRespText] = useState('');

  const [statModal, setStatModal] = useState(false);
  const [statIdx, setStatIdx] = useState<number>(-1);
  const [statForm, setStatForm] = useState<StatForm>({ label: '', value: '' });

  const [memberModal, setMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [memberForm, setMemberForm] = useState<MemberForm>({ name: '', position: '', photo: '' });

  // Head
  const openHead = () => {
    setHeadForm({ name: committee.head.name, role: committee.head.role, bio: committee.head.bio, photo: committee.head.photo, email: committee.head.email });
    setHeadModal(true);
  };
  const saveHead = (e: React.FormEvent) => {
    e.preventDefault();
    setCommittees((prev) => prev.map((c) => c.id === committeeId ? { ...c, head: { ...c.head, ...headForm } } : c));
    setHeadModal(false);
  };

  // Responsibilities
  const openAddResp = () => { setRespIdx(-1); setRespText(''); setRespModal(true); };
  const openEditResp = (i: number) => { setRespIdx(i); setRespText(committee.responsibilities[i]); setRespModal(true); };
  const saveResp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respText.trim()) return;
    setCommittees((prev) => prev.map((c) => {
      if (c.id !== committeeId) return c;
      const items = [...c.responsibilities];
      if (respIdx >= 0) items[respIdx] = respText;
      else items.push(respText);
      return { ...c, responsibilities: items };
    }));
    setRespModal(false);
  };
  const deleteResp = (i: number) => {
    if (!confirm('حذف هذا البند؟')) return;
    setCommittees((prev) => prev.map((c) => c.id === committeeId ? { ...c, responsibilities: c.responsibilities.filter((_, x) => x !== i) } : c));
  };

  // Stats
  const openEditStat = (i: number) => { setStatIdx(i); setStatForm({ ...committee.stats[i] }); setStatModal(true); };
  const saveStat = (e: React.FormEvent) => {
    e.preventDefault();
    setCommittees((prev) => prev.map((c) => {
      if (c.id !== committeeId) return c;
      const stats = [...c.stats];
      stats[statIdx] = { ...statForm };
      return { ...c, stats };
    }));
    setStatModal(false);
  };

  // Members
  const openAddMember = () => { setEditingMember(null); setMemberForm({ name: '', position: '', photo: '' }); setMemberModal(true); };
  const openEditMember = (m: CommitteeMember) => { setEditingMember(m); setMemberForm({ name: m.name, position: m.position, photo: m.photo }); setMemberModal(true); };
  const saveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim()) return;
    const photo = memberForm.photo || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400`;
    setCommittees((prev) => prev.map((c) => {
      if (c.id !== committeeId) return c;
      if (editingMember) {
        return { ...c, members: c.members.map((m) => m.id === editingMember.id ? { ...m, ...memberForm, photo } : m) };
      }
      return { ...c, members: [...c.members, { id: 'cm' + Date.now(), name: memberForm.name, position: memberForm.position, photo }] };
    }));
    setMemberModal(false);
  };
  const deleteMember = (mid: string) => {
    if (!confirm('حذف هذا العضو؟')) return;
    setCommittees((prev) => prev.map((c) => c.id === committeeId ? { ...c, members: c.members.filter((m) => m.id !== mid) } : c));
  };

  return (
    <div className="animate-fade-in pt-16 lg:pt-20">
      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${committee.color} py-14 lg:py-16`}>
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="container-app relative">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                  {committeeId === 'presidency' || committeeId === 'vice-presidency' ? 'مكتب تنفيذي' : 'لجنة'}
                </span>
                {isRestricted && (
                  <span className="flex items-center gap-1 rounded-full bg-red-500/30 px-3 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                    <Lock className="h-3 w-3" />
                    وصول محدود
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-extrabold text-white lg:text-4xl">{committee.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">{committee.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-app py-12">
        {isRestricted ? (
          <AccessDenied committeeId={committeeId} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Head profile */}
            <div className="lg:col-span-1">
              <div className="group/head card relative overflow-hidden">
                {isPresident && (
                  <button
                    onClick={openHead}
                    className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-navy-700 opacity-0 shadow ring-1 ring-gray-200 transition-opacity hover:bg-navy-50 group-hover/head:opacity-100"
                    title="تعديل بيانات المسؤول"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
                <div className={`h-24 bg-gradient-to-br ${committee.color}`} />
                <div className="-mt-12 px-6 pb-6 text-center">
                  <img
                    src={committee.head.photo}
                    alt={committee.head.name}
                    className="mx-auto h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-lg"
                  />
                  <h3 className="mt-3 text-lg font-extrabold text-navy-900">{committee.head.name}</h3>
                  <p className="text-sm font-semibold text-navy-600">{committee.head.role}</p>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">{committee.head.bio}</p>
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500">
                    <Mail className="h-3.5 w-3.5" />
                    <span dir="ltr">{committee.head.email}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {committee.stats.map((s, i) => (
                  <button
                    key={i}
                    onClick={isPresident ? () => openEditStat(i) : undefined}
                    className={`card group/stat relative p-3 text-center ${isPresident ? 'cursor-pointer hover:ring-2 hover:ring-navy-200' : 'cursor-default'}`}
                  >
                    {isPresident && (
                      <Edit3 className="absolute left-1.5 top-1.5 h-3 w-3 text-gray-300 opacity-0 transition-opacity group-hover/stat:opacity-100" />
                    )}
                    <div className="text-lg font-extrabold text-navy-900">{s.value}</div>
                    <div className="text-[10px] text-gray-500">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Responsibilities + members */}
            <div className="lg:col-span-2 space-y-6">
              <div className="group/resp card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900">
                    <Briefcase className="h-5 w-5 text-navy-600" />
                    المهام والمسؤوليات
                  </h3>
                  {isPresident && (
                    <button onClick={openAddResp} className="flex items-center gap-1 rounded-lg bg-navy-50 px-2.5 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:bg-navy-100">
                      <Plus className="h-3.5 w-3.5" /> إضافة بند
                    </button>
                  )}
                </div>
                <ul className="mt-4 space-y-3">
                  {committee.responsibilities.map((r, i) => (
                    <li key={i} className="group/item flex items-start gap-3 text-sm leading-relaxed text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="flex-1">{r}</span>
                      {isPresident && (
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover/item:opacity-100">
                          <button onClick={() => openEditResp(i)} className="flex h-6 w-6 items-center justify-center rounded-md text-navy-600 hover:bg-navy-50" title="تعديل">
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => deleteResp(i)} className="flex h-6 w-6 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50" title="حذف">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="group/mem card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900">
                    <Users className="h-5 w-5 text-navy-600" />
                    أعضاء {committee.shortName}
                  </h3>
                  {isPresident && (
                    <button onClick={openAddMember} className="flex items-center gap-1 rounded-lg bg-navy-50 px-2.5 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:bg-navy-100">
                      <Plus className="h-3.5 w-3.5" /> إضافة عضو
                    </button>
                  )}
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {committee.members.map((m) => (
                    <div key={m.id} className="group/memitem relative flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50">
                      <img src={m.photo} alt={m.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <div className="text-sm font-bold text-navy-900">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.position}</div>
                      </div>
                      {isPresident && (
                        <div className="absolute left-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover/memitem:opacity-100">
                          <button onClick={() => openEditMember(m)} className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-navy-600 shadow-sm ring-1 ring-gray-200 hover:bg-navy-50" title="تعديل">
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button onClick={() => deleteMember(m.id)} className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-rose-600 shadow-sm ring-1 ring-gray-200 hover:bg-rose-50" title="حذف">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {committee.members.length === 0 && (
                    <p className="py-4 text-center text-sm text-gray-400">لا يوجد أعضاء مضافون.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav between committees */}
        <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-6">
          {prev ? (
            <button
              onClick={() => { setView({ kind: 'committee', committeeId: prev }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50"
            >
              <ChevronRight className="h-4 w-4" />
              {committeeMeta[prev].name}
            </button>
          ) : (
            <button
              onClick={() => setView({ kind: 'board' })}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50"
            >
              <ChevronRight className="h-4 w-4" />
              الهيئة التنفيذية
            </button>
          )}
          {next ? (
            <button
              onClick={() => { setView({ kind: 'committee', committeeId: next }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50"
            >
              {committeeMeta[next].name}
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setView({ kind: 'board' })}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50"
            >
              الهيئة التنفيذية
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Head edit modal */}
      {isPresident && (
        <Modal open={headModal} onClose={() => setHeadModal(false)} title="تعديل بيانات المسؤول" maxWidth="max-w-md">
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
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setHeadModal(false)} className="btn-ghost">إلغاء</button>
              <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> حفظ</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Responsibility modal */}
      {isPresident && (
        <Modal open={respModal} onClose={() => setRespModal(false)} title={respIdx >= 0 ? 'تعديل البند' : 'إضافة بند جديد'} maxWidth="max-w-md">
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
      )}

      {/* Stat modal */}
      {isPresident && (
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
      )}

      {/* Member modal */}
      {isPresident && (
        <Modal open={memberModal} onClose={() => setMemberModal(false)} title={editingMember ? 'تعديل عضو' : 'إضافة عضو جديد'} maxWidth="max-w-md">
          <form onSubmit={saveMember} className="space-y-4">
            <div>
              <label className="label-field">الاسم *</label>
              <input className="input-field" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
            </div>
            <div>
              <label className="label-field">المسؤولية</label>
              <input className="input-field" value={memberForm.position} onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })} placeholder="مثال: منسق، مستشار..." />
            </div>
            <div>
              <label className="label-field">رابط الصورة</label>
              <input type="url" dir="ltr" className="input-field" value={memberForm.photo} onChange={(e) => setMemberForm({ ...memberForm, photo: e.target.value })} placeholder="https://..." />
              <p className="mt-1 text-xs text-gray-400">اتركه فارغًا لاستخدام صورة افتراضية.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setMemberModal(false)} className="btn-ghost">إلغاء</button>
              <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> حفظ</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function AccessDenied({ committeeId }: { committeeId: CommitteeId }) {
  const { currentUser, setView } = useApp();
  const myCommittee = currentUser?.committee
    ? committeeMeta[currentUser.committee].name
    : '';

  return (
    <div className="mx-auto max-w-lg py-10">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-rose-600 to-rose-800 px-6 py-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-white">غير مصرح بالوصول</h2>
          <p className="mt-2 text-sm text-white/80">
            لا تملك صلاحية الوصول إلى هذه الصفحة
          </p>
        </div>
        <div className="p-6 text-center">
          <p className="text-sm leading-relaxed text-gray-600">
            أنت مسجّل الدخول كـ <span className="font-bold text-navy-900">مسؤول {myCommittee}</span>،
            ويمكنك فقط الوصول إلى صفحة لجنتك الخاصة. صفحة{' '}
            <span className="font-bold text-navy-900">{committeeMeta[committeeId].name}</span> متاحة
            لرئيس الاتحاد أو مسؤول اللجنة المختص فقط.
          </p>
          <div className="mt-5 rounded-xl bg-navy-50 p-4 text-right text-sm">
            <div className="font-bold text-navy-900">دورك الحالي:</div>
            <div className="mt-1 text-navy-700">
              {currentUser?.role === 'president' ? 'رئيس الاتحاد' : `مسؤول ${myCommittee}`}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {currentUser?.committee && (
              <button
                onClick={() => setView({ kind: 'committee', committeeId: currentUser.committee! })}
                className="btn-primary"
              >
                الذهاب إلى لجنتي ({committeeMeta[currentUser.committee].shortName})
              </button>
            )}
            <button
              onClick={() => setView({ kind: 'board' })}
              className="btn-ghost"
            >
              العودة للهيئة التنفيذية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  CalendarDays, CheckCircle2, History, Sparkles, Plus, Edit3, Trash2, Save,
  CheckCircle2 as Check, X, Image, Settings,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';
import { categoryLabels, type EventCategory, type UEvent } from '../data/mockData';

type Tab = 'upcoming' | 'past';

interface ProgramsContent {
  badge: string;
  title: string;
  description: string;
}

const defaultContent: ProgramsContent = {
  badge: 'أنشطتنا',
  title: 'البرامج والأنشطة',
  description: 'تصفح برامجنا القادمة وسجّل في ما يناسبك، أو استعرض إنجازاتنا في الفعاليات السابقة.',
};

export default function ProgramsPage() {
  const { events, setEvents, currentUser } = useApp();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [cat, setCat] = useState<EventCategory | 'all'>('all');
  const [content, setContent] = useState<ProgramsContent>(defaultContent);
  const [editingHeader, setEditingHeader] = useState(false);
  const [headerForm, setHeaderForm] = useState<ProgramsContent>(defaultContent);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', category: 'workshop' as EventCategory, date: '', time: '16:00',
    location: '', description: '', capacity: 50, registered: 0,
    status: 'upcoming' as 'upcoming' | 'past', image: '', showOnHomepage: false,
  });

  const isPresidentOrMedia =
    currentUser &&
    ((currentUser.role === 'president') ||
     (currentUser.role === 'committee-head' && currentUser.committee === 'media'));

  const canAddEvent = currentUser && (currentUser.role === 'president' || currentUser.role === 'committee-head');

  const filtered = events.filter((e) => {
    if (tab === 'upcoming' && e.status !== 'upcoming') return false;
    if (tab === 'past' && e.status !== 'past') return false;
    if (cat !== 'all' && e.category !== cat) return false;
    return true;
  });

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const pastCount = events.filter((e) => e.status === 'past').length;

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', category: 'workshop', date: '', time: '16:00', location: '', description: '', capacity: 50, registered: 0, status: 'upcoming', image: '', showOnHomepage: false });
    setModalOpen(true);
  };

  const openEdit = (e: UEvent) => {
    setEditId(e.id);
    const d = new Date(e.date);
    setForm({
      title: e.title, category: e.category, date: e.date.slice(0, 10), time: d.toTimeString().slice(0, 5),
      location: e.location, description: e.description, capacity: e.capacity, registered: e.registered,
      status: e.status, image: e.image, showOnHomepage: e.showOnHomepage ?? false,
    });
    setModalOpen(true);
  };

  const saveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    const iso = new Date(`${form.date}T${form.time}`).toISOString();
    const image = form.image || `https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200`;
    if (editId) {
      setEvents((prev) => prev.map((ev) => ev.id === editId ? {
        ...ev, title: form.title, category: form.category, date: iso, location: form.location,
        description: form.description, capacity: Number(form.capacity), registered: Number(form.registered),
        status: form.status, image, showOnHomepage: form.showOnHomepage,
      } : ev));
    } else {
      const newEvent: UEvent = {
        id: 'e' + Date.now(), title: form.title, category: form.category, date: iso,
        location: form.location, description: form.description, status: form.status,
        capacity: Number(form.capacity), registered: Number(form.registered), image,
        showOnHomepage: form.showOnHomepage,
      };
      setEvents((prev) => [newEvent, ...prev]);
    }
    setModalOpen(false);
  };

  const removeEvent = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const saveHeader = () => {
    setContent(headerForm);
    setEditingHeader(false);
  };

  return (
    <div className="animate-fade-in pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 py-16 text-center lg:py-20">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="container-app relative">
          {editingHeader ? (
            <div className="mx-auto max-w-2xl space-y-3 text-right">
              <input
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-gray-400 focus:border-gold-400 focus:outline-none"
                value={headerForm.badge}
                onChange={(e) => setHeaderForm({ ...headerForm, badge: e.target.value })}
                placeholder="الشارة"
              />
              <input
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-lg font-bold text-white placeholder:text-gray-400 focus:border-gold-400 focus:outline-none"
                value={headerForm.title}
                onChange={(e) => setHeaderForm({ ...headerForm, title: e.target.value })}
                placeholder="العنوان الرئيسي"
              />
              <textarea
                rows={2}
                className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-gray-400 focus:border-gold-400 focus:outline-none"
                value={headerForm.description}
                onChange={(e) => setHeaderForm({ ...headerForm, description: e.target.value })}
                placeholder="النص الوصفي"
              />
              <div className="flex justify-center gap-2">
                <button onClick={saveHeader} className="inline-flex items-center gap-1.5 rounded-lg bg-gold-400 px-4 py-2 text-sm font-bold text-navy-950 hover:bg-gold-300">
                  <Save className="h-4 w-4" /> حفظ
                </button>
                <button onClick={() => { setEditingHeader(false); setHeaderForm(content); }} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                  <X className="h-4 w-4" /> إلغاء
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm font-bold uppercase tracking-wider text-gold-300">{content.badge}</span>
                {isPresidentOrMedia && (
                  <button
                    onClick={() => { setHeaderForm(content); setEditingHeader(true); }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-gold-300 transition-colors hover:bg-white/20"
                    title="تعديل الترويسة"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <h1 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">{content.title}</h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300">{content.description}</p>
            </>
          )}
        </div>
      </section>

      <section className="container-app py-12">
        {/* Tabs + Add button */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setTab('upcoming')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                tab === 'upcoming' ? 'bg-navy-800 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              البرامج القادمة
              <span className={`rounded-full px-2 py-0.5 text-xs ${tab === 'upcoming' ? 'bg-white/20' : 'bg-gray-100'}`}>{upcomingCount}</span>
            </button>
            <button
              onClick={() => setTab('past')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                tab === 'past' ? 'bg-navy-800 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <History className="h-4 w-4" />
              البرامج السابقة
              <span className={`rounded-full px-2 py-0.5 text-xs ${tab === 'past' ? 'bg-white/20' : 'bg-gray-100'}`}>{pastCount}</span>
            </button>
          </div>

          {canAddEvent && (
            <button onClick={openAdd} className="btn-primary">
              <Plus className="h-4 w-4" /> إضافة فعالية جديدة
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setCat('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              cat === 'all' ? 'bg-navy-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            الكل
          </button>
          {(Object.keys(categoryLabels) as EventCategory[]).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                cat === c ? 'bg-navy-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {categoryLabels[c]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <CalendarDays className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">لا توجد فعاليات في هذا التصنيف حاليًا.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <div key={e.id} className="relative">
                <EventCard event={e} />
                {isPresidentOrMedia && (
                  <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                    <button
                      onClick={() => openEdit(e)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-navy-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                      title="تعديل"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeEvent(e.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-rose-600 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievements banner for past tab */}
        {tab === 'past' && (
          <div className="mt-12 rounded-3xl border border-emerald-100 bg-emerald-50 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900">إنجازات نفخر بها</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  نظّمنا حتى الآن أكثر من 86 فعالية شملت ورش عمل ومحاضرات وبرامج
                  تدريبية وحملات تطوعية، استفاد منها أكثر من 1200 طالب من 24 جامعة
                  مختلفة. ونواصل العمل على توسيع أثرنا عامًا بعد عام.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Add/Edit Event Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'تعديل فعالية' : 'إضافة فعالية جديدة'} maxWidth="max-w-xl">
        <form onSubmit={saveEvent} className="space-y-4">
          <div>
            <label className="label-field">عنوان الفعالية *</label>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">النوع</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'upcoming' | 'past' })}>
                <option value="upcoming">قادمة</option>
                <option value="past">سابقة</option>
              </select>
            </div>
            <div>
              <label className="label-field">الفئة</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as EventCategory })}>
                {(Object.keys(categoryLabels) as EventCategory[]).map((c) => (
                  <option key={c} value={c}>{categoryLabels[c]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">التاريخ *</label>
              <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="label-field">الوقت</label>
              <input type="time" className="input-field" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label-field">المكان</label>
            <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="label-field">الوصف</label>
            <textarea rows={2} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label-field">رابط الصورة</label>
            <div className="relative">
              <Image className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input className="input-field pr-10" dir="ltr" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">عدد المقاعد</label>
              <input type="number" className="input-field" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label-field">عدد المسجلين</label>
              <input type="number" className="input-field" value={form.registered} onChange={(e) => setForm({ ...form, registered: Number(e.target.value) })} />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={form.showOnHomepage} onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })} className="h-4 w-4 accent-navy-700" />
            <span className="text-sm font-semibold text-navy-900">عرض في الصفحة الرئيسية</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Check className="h-4 w-4" /> {editId ? 'حفظ' : 'إضافة'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import {
  Plus, Trash2, Edit3, CheckCircle2, Image, X, Save, Eye, EyeOff,
  Users, CalendarDays, GraduationCap, HeartHandshake, Target, BookOpen, Sparkles,
  TrendingUp, Award, Crown, UserCog, Megaphone, ShieldCheck, Wallet, Network,
  type LucideIcon, Settings,
} from 'lucide-react';
import { useApp, type SiteContent } from '../context/AppContext';
import Modal from '../components/Modal';
import { categoryLabels, type EventCategory, type UEvent, type NewsItem } from '../data/mockData';

const iconOptions: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: 'Users', label: 'أعضاء', Icon: Users },
  { value: 'CalendarDays', label: 'فعاليات', Icon: CalendarDays },
  { value: 'GraduationCap', label: 'جامعات', Icon: GraduationCap },
  { value: 'HeartHandshake', label: 'متطوعون', Icon: HeartHandshake },
  { value: 'Target', label: 'رؤية', Icon: Target },
  { value: 'BookOpen', label: 'تعليم', Icon: BookOpen },
  { value: 'Sparkles', label: 'إبداع', Icon: Sparkles },
  { value: 'TrendingUp', label: 'نمو', Icon: TrendingUp },
  { value: 'Award', label: 'جوائز', Icon: Award },
  { value: 'Crown', label: 'رئاسة', Icon: Crown },
  { value: 'UserCog', label: 'إدارة', Icon: UserCog },
  { value: 'Megaphone', label: 'إعلام', Icon: Megaphone },
  { value: 'ShieldCheck', label: 'رقابة', Icon: ShieldCheck },
  { value: 'Wallet', label: 'مالية', Icon: Wallet },
  { value: 'Network', label: 'شراكات', Icon: Network },
];

const committeeIdOptions = [
  { value: 'presidency', label: 'الرئاسة' },
  { value: 'vice-presidency', label: 'نائب الرئيس' },
  { value: 'media', label: 'اللجنة الإعلامية' },
  { value: 'academic', label: 'اللجنة الأكاديمية' },
  { value: 'supervisory', label: 'لجنة الرقابة' },
  { value: 'activities', label: 'لجنة الأنشطة' },
  { value: 'finance', label: 'اللجنة المالية' },
];

type SubTab = 'brand' | 'hero' | 'stats' | 'about' | 'events' | 'news' | 'board';

export default function HomepageContentCMS() {
  const [subTab, setSubTab] = useState<SubTab>('brand');

  const tabs: { id: SubTab; label: string }[] = [
    { id: 'brand', label: 'الشعار والتذييل' },
    { id: 'hero', label: 'القسم الترحيبي' },
    { id: 'stats', label: 'الإحصائيات' },
    { id: 'about', label: 'الرؤية والرسالة' },
    { id: 'events', label: 'الفعاليات' },
    { id: 'news', label: 'الأخبار' },
    { id: 'board', label: 'الهيئة التنفيذية' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl border border-gold-200 bg-gold-50 p-4">
        <Settings className="h-6 w-6 text-gold-600" />
        <div>
          <h2 className="text-lg font-extrabold text-navy-900">إدارة محتوى الصفحة الرئيسية</h2>
          <p className="text-sm text-gray-500">تحكّم في جميع أقسام الصفحة الرئيسية. تظهر التعديلات فورًا على الموقع.</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              subTab === t.id ? 'bg-navy-800 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'brand' && <BrandTab />}
      {subTab === 'hero' && <HeroTab />}
      {subTab === 'stats' && <StatsTab />}
      {subTab === 'about' && <AboutTab />}
      {subTab === 'events' && <EventsCMSTab />}
      {subTab === 'news' && <NewsCMSTab />}
      {subTab === 'board' && <BoardPreviewTab />}
    </div>
  );
}

/* ---------- Brand & Footer ---------- */
function BrandTab() {
  const { siteContent, setSiteContent } = useApp();
  const [form, setForm] = useState(siteContent);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={save} className="card space-y-5 p-6">
      <SectionTitle icon={Settings} title="الشعار واسم الاتحاد" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="اسم الاتحاد (عربي)">
          <input className="input-field" value={form.brand.name} onChange={(e) => setForm({ ...form, brand: { ...form.brand, name: e.target.value } })} />
        </Field>
        <Field label="اسم الاتحاد (إنجليزي)">
          <input className="input-field" value={form.brand.nameTr} onChange={(e) => setForm({ ...form, brand: { ...form.brand, nameTr: e.target.value } })} dir="ltr" />
        </Field>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <SectionTitle icon={Users} title="بيانات التذييل" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="رقم الهاتف">
            <input className="input-field" value={form.footer.phone} onChange={(e) => setForm({ ...form, footer: { ...form.footer, phone: e.target.value } })} dir="ltr" />
          </Field>
          <Field label="البريد الإلكتروني">
            <input className="input-field" value={form.footer.email} onChange={(e) => setForm({ ...form, footer: { ...form.footer, email: e.target.value } })} dir="ltr" />
          </Field>
        </div>
        <Field label="العنوان الجغرافي">
          <input className="input-field" value={form.footer.address} onChange={(e) => setForm({ ...form, footer: { ...form.footer, address: e.target.value } })} />
        </Field>
        <Field label="نص حقوق النشر">
          <input className="input-field" value={form.footer.copyright} onChange={(e) => setForm({ ...form, footer: { ...form.footer, copyright: e.target.value } })} />
        </Field>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <SectionTitle icon={Network} title="روابط شبكات التواصل الاجتماعي" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="فيسبوك">
            <input className="input-field" value={form.footer.social.facebook} onChange={(e) => setForm({ ...form, footer: { ...form.footer, social: { ...form.footer.social, facebook: e.target.value } } })} dir="ltr" />
          </Field>
          <Field label="تويتر / X">
            <input className="input-field" value={form.footer.social.twitter} onChange={(e) => setForm({ ...form, footer: { ...form.footer, social: { ...form.footer.social, twitter: e.target.value } } })} dir="ltr" />
          </Field>
          <Field label="انستغرام">
            <input className="input-field" value={form.footer.social.instagram} onChange={(e) => setForm({ ...form, footer: { ...form.footer, social: { ...form.footer.social, instagram: e.target.value } } })} dir="ltr" />
          </Field>
          <Field label="يوتيوب">
            <input className="input-field" value={form.footer.social.youtube} onChange={(e) => setForm({ ...form, footer: { ...form.footer, social: { ...form.footer.social, youtube: e.target.value } } })} dir="ltr" />
          </Field>
        </div>
      </div>

      <SaveBar saved={saved} onReset={() => setForm(siteContent)} />
    </form>
  );
}

/* ---------- Hero ---------- */
function HeroTab() {
  const { siteContent, setSiteContent } = useApp();
  const [form, setForm] = useState(siteContent);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const h = form.hero;

  return (
    <form onSubmit={save} className="card space-y-5 p-6">
      <SectionTitle icon={Sparkles} title="القسم الترحيبي الرئيسي" />

      <Field label="نص الشارة (Badge)">
        <input className="input-field" value={h.badge} onChange={(e) => setForm({ ...form, hero: { ...h, badge: e.target.value } })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="العنوان الرئيسي">
          <input className="input-field" value={h.title} onChange={(e) => setForm({ ...form, hero: { ...h, title: e.target.value } })} />
        </Field>
        <Field label="العنوان الفرعي">
          <input className="input-field" value={h.subtitle} onChange={(e) => setForm({ ...form, hero: { ...h, subtitle: e.target.value } })} />
        </Field>
      </div>
      <Field label="الوصف">
        <textarea rows={3} className="input-field resize-none" value={h.description} onChange={(e) => setForm({ ...form, hero: { ...h, description: e.target.value } })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="زر رئيسي">
          <input className="input-field" value={h.primaryBtn} onChange={(e) => setForm({ ...form, hero: { ...h, primaryBtn: e.target.value } })} />
        </Field>
        <Field label="زر ثانوي">
          <input className="input-field" value={h.secondaryBtn} onChange={(e) => setForm({ ...form, hero: { ...h, secondaryBtn: e.target.value } })} />
        </Field>
        <Field label="زر ثالث">
          <input className="input-field" value={h.tertiaryBtn} onChange={(e) => setForm({ ...form, hero: { ...h, tertiaryBtn: e.target.value } })} />
        </Field>
      </div>
      <Field label="رابط صورة الواجهة">
        <div className="relative">
          <Image className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input className="input-field pr-10" dir="ltr" value={h.image} onChange={(e) => setForm({ ...form, hero: { ...h, image: e.target.value } })} />
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2 border-t border-gray-100 pt-4">
        <div className="rounded-xl border border-gray-100 p-4">
          <div className="mb-3 text-sm font-bold text-navy-900">البادج الأول</div>
          <Field label="الرقم">
            <input className="input-field" value={h.badge1.value} onChange={(e) => setForm({ ...form, hero: { ...h, badge1: { ...h.badge1, value: e.target.value } } })} />
          </Field>
          <Field label="الوصف">
            <input className="input-field" value={h.badge1.label} onChange={(e) => setForm({ ...form, hero: { ...h, badge1: { ...h.badge1, label: e.target.value } } })} />
          </Field>
        </div>
        <div className="rounded-xl border border-gray-100 p-4">
          <div className="mb-3 text-sm font-bold text-navy-900">البادج الثاني</div>
          <Field label="النسبة">
            <input className="input-field" value={h.badge2.value} onChange={(e) => setForm({ ...form, hero: { ...h, badge2: { ...h.badge2, value: e.target.value } } })} />
          </Field>
          <Field label="الوصف">
            <input className="input-field" value={h.badge2.label} onChange={(e) => setForm({ ...form, hero: { ...h, badge2: { ...h.badge2, label: e.target.value } } })} />
          </Field>
        </div>
      </div>

      <SaveBar saved={saved} onReset={() => setForm(siteContent)} />
    </form>
  );
}

/* ---------- Stats ---------- */
function StatsTab() {
  const { siteContent, setSiteContent } = useApp();
  const [form, setForm] = useState(siteContent);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateStat = (idx: number, field: 'value' | 'label' | 'icon', val: string | number) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) => i === idx ? { ...s, [field]: val } : s),
    }));
  };

  return (
    <form onSubmit={save} className="card space-y-5 p-6">
      <SectionTitle icon={TrendingUp} title="شريط الإحصائيات الأربعة" />
      <div className="grid gap-4 sm:grid-cols-2">
        {form.stats.map((s, idx) => (
          <div key={idx} className="rounded-xl border border-gray-100 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-900">
              {(() => {
                const Icon = iconOptions.find((o) => o.value === s.icon)?.Icon || Users;
                return <Icon className="h-4 w-4" />;
              })()}
              إحصائية {idx + 1}
            </div>
            <div className="space-y-3">
              <Field label="الرقم">
                <input type="number" className="input-field" value={s.value} onChange={(e) => updateStat(idx, 'value', Number(e.target.value))} />
              </Field>
              <Field label="المسمى">
                <input className="input-field" value={s.label} onChange={(e) => updateStat(idx, 'label', e.target.value)} />
              </Field>
              <Field label="الأيقونة">
                <select className="input-field" value={s.icon} onChange={(e) => updateStat(idx, 'icon', e.target.value)}>
                  {iconOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
            </div>
          </div>
        ))}
      </div>
      <SaveBar saved={saved} onReset={() => setForm(siteContent)} />
    </form>
  );
}

/* ---------- About ---------- */
function AboutTab() {
  const { siteContent, setSiteContent } = useApp();
  const [form, setForm] = useState(siteContent);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const a = form.about;
  const updateFeature = (idx: number, field: 'icon' | 'title' | 'desc', val: string) => {
    setForm((prev) => ({
      ...prev,
      about: { ...prev.about, features: prev.about.features.map((f, i) => i === idx ? { ...f, [field]: val } : f) },
    }));
  };

  return (
    <form onSubmit={save} className="card space-y-5 p-6">
      <SectionTitle icon={Target} title="قسم الرؤية والرسالة" />

      <Field label="شارة القسم">
        <input className="input-field" value={a.badge} onChange={(e) => setForm({ ...form, about: { ...a, badge: e.target.value } })} />
      </Field>
      <Field label="عنوان الفقرة">
        <input className="input-field" value={a.title} onChange={(e) => setForm({ ...form, about: { ...a, title: e.target.value } })} />
      </Field>
      <Field label="نص الرسالة">
        <textarea rows={4} className="input-field resize-none" value={a.description} onChange={(e) => setForm({ ...form, about: { ...a, description: e.target.value } })} />
      </Field>
      <Field label="رابط الصورة المرفقة">
        <div className="relative">
          <Image className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input className="input-field pr-10" dir="ltr" value={a.image} onChange={(e) => setForm({ ...form, about: { ...a, image: e.target.value } })} />
        </div>
      </Field>

      <div className="rounded-xl border border-gray-100 p-4">
        <div className="mb-3 text-sm font-bold text-navy-900">بادج الصورة</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="القيمة">
            <input className="input-field" value={a.imageBadge.value} onChange={(e) => setForm({ ...form, about: { ...a, imageBadge: { ...a.imageBadge, value: e.target.value } } })} />
          </Field>
          <Field label="الوصف">
            <input className="input-field" value={a.imageBadge.label} onChange={(e) => setForm({ ...form, about: { ...a, imageBadge: { ...a.imageBadge, label: e.target.value } } })} />
          </Field>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="mb-3 text-sm font-bold text-navy-900">الكروت الأربعة</div>
        <div className="grid gap-4 sm:grid-cols-2">
          {a.features.map((f, idx) => (
            <div key={idx} className="rounded-xl border border-gray-100 p-4">
              <div className="mb-3 text-xs font-bold text-gray-400">كرت {idx + 1}</div>
              <div className="space-y-3">
                <Field label="الأيقونة">
                  <select className="input-field" value={f.icon} onChange={(e) => updateFeature(idx, 'icon', e.target.value)}>
                    {iconOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
                <Field label="العنوان">
                  <input className="input-field" value={f.title} onChange={(e) => updateFeature(idx, 'title', e.target.value)} />
                </Field>
                <Field label="الوصف">
                  <input className="input-field" value={f.desc} onChange={(e) => updateFeature(idx, 'desc', e.target.value)} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SaveBar saved={saved} onReset={() => setForm(siteContent)} />
    </form>
  );
}

/* ---------- Events CMS ---------- */
function EventsCMSTab() {
  const { events, setEvents } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', category: 'workshop' as EventCategory, date: '', time: '16:00',
    location: '', description: '', capacity: 50, status: 'upcoming' as 'upcoming' | 'past',
    image: '', showOnHomepage: true,
  });

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', category: 'workshop', date: '', time: '16:00', location: '', description: '', capacity: 50, status: 'upcoming', image: '', showOnHomepage: true });
    setModalOpen(true);
  };

  const openEdit = (e: UEvent) => {
    setEditId(e.id);
    const d = new Date(e.date);
    setForm({
      title: e.title, category: e.category, date: e.date.slice(0, 10), time: d.toTimeString().slice(0, 5),
      location: e.location, description: e.description, capacity: e.capacity, status: e.status,
      image: e.image, showOnHomepage: e.showOnHomepage ?? false,
    });
    setModalOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    const iso = new Date(`${form.date}T${form.time}`).toISOString();
    const image = form.image || `https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200`;
    if (editId) {
      setEvents((prev) => prev.map((ev) => ev.id === editId ? { ...ev, title: form.title, category: form.category, date: iso, location: form.location, description: form.description, capacity: Number(form.capacity), status: form.status, image, showOnHomepage: form.showOnHomepage } : ev));
    } else {
      const newEvent: UEvent = { id: 'e' + Date.now(), title: form.title, category: form.category, date: iso, location: form.location, description: form.description, status: form.status, capacity: Number(form.capacity), registered: 0, image, showOnHomepage: form.showOnHomepage };
      setEvents((prev) => [newEvent, ...prev]);
    }
    setModalOpen(false);
  };

  const remove = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const toggleHomepage = (id: string) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, showOnHomepage: !e.showOnHomepage } : e));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle icon={CalendarDays} title="إدارة الفعاليات" />
        <button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" /> فعالية جديدة</button>
      </div>

      <div className="space-y-2">
        {events.map((e) => (
          <div key={e.id} className="card flex items-center gap-3 p-3">
            <img src={e.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold text-navy-900">{e.title}</div>
              <div className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString('ar-EG')} · {e.location}</div>
            </div>
            <button
              onClick={() => toggleHomepage(e.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                e.showOnHomepage ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title="عرض في الصفحة الرئيسية"
            >
              {e.showOnHomepage ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {e.showOnHomepage ? 'ظاهر' : 'مخفي'}
            </button>
            <button onClick={() => openEdit(e)} className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-600 hover:bg-navy-50"><Edit3 className="h-4 w-4" /></button>
            <button onClick={() => remove(e.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'تعديل فعالية' : 'إضافة فعالية'} maxWidth="max-w-xl">
        <form onSubmit={save} className="space-y-4">
          <Field label="عنوان الفعالية *">
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="التصنيف">
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as EventCategory })}>
                {(Object.keys(categoryLabels) as EventCategory[]).map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}
              </select>
            </Field>
            <Field label="السعة">
              <input type="number" className="input-field" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="التاريخ *">
              <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="الوقت">
              <input type="time" className="input-field" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </Field>
          </div>
          <Field label="المكان">
            <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </Field>
          <Field label="الوصف">
            <textarea rows={2} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="رابط الصورة">
            <input className="input-field" dir="ltr" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.showOnHomepage} onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })} className="h-4 w-4 accent-navy-700" />
            <span className="text-sm font-semibold text-navy-900">عرض في الصفحة الرئيسية</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary"><CheckCircle2 className="h-4 w-4" /> {editId ? 'حفظ' : 'إضافة'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ---------- News CMS ---------- */
function NewsCMSTab() {
  const { news, setNews } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', category: 'إنجازات', date: new Date().toISOString().slice(0, 10),
    excerpt: '', fullContent: '', image: '', pinnedOnHomepage: true,
  });

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', category: 'إنجازات', date: new Date().toISOString().slice(0, 10), excerpt: '', fullContent: '', image: '', pinnedOnHomepage: true });
    setModalOpen(true);
  };

  const openEdit = (n: NewsItem) => {
    setEditId(n.id);
    setForm({ title: n.title, category: n.category, date: n.date, excerpt: n.excerpt, fullContent: n.fullContent || '', image: n.image, pinnedOnHomepage: n.pinnedOnHomepage ?? false });
    setModalOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const image = form.image || `https://images.pexels.com/photos/3184320/pexels-photo-3184320.jpeg?auto=compress&cs=tinysrgb&w=1200`;
    if (editId) {
      setNews((prev) => prev.map((n) => n.id === editId ? { ...n, title: form.title, category: form.category, date: form.date, excerpt: form.excerpt, fullContent: form.fullContent, image, pinnedOnHomepage: form.pinnedOnHomepage } : n));
    } else {
      const newNews: NewsItem = { id: 'n' + Date.now(), title: form.title, category: form.category, date: form.date, excerpt: form.excerpt, fullContent: form.fullContent, image, pinnedOnHomepage: form.pinnedOnHomepage };
      setNews((prev) => [newNews, ...prev]);
    }
    setModalOpen(false);
  };

  const remove = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
      setNews((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const togglePin = (id: string) => {
    setNews((prev) => prev.map((n) => n.id === id ? { ...n, pinnedOnHomepage: !n.pinnedOnHomepage } : n));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle icon={Megaphone} title="إدارة الأخبار" />
        <button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" /> خبر جديد</button>
      </div>

      <div className="space-y-2">
        {news.map((n) => (
          <div key={n.id} className="card flex items-center gap-3 p-3">
            <img src={n.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold text-navy-900">{n.title}</div>
              <div className="text-xs text-gray-500">{n.date} · {n.category}</div>
            </div>
            <button
              onClick={() => togglePin(n.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                n.pinnedOnHomepage ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title="تثبيت في الصفحة الرئيسية"
            >
              {n.pinnedOnHomepage ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {n.pinnedOnHomepage ? 'مثبت' : 'غير مثبت'}
            </button>
            <button onClick={() => openEdit(n)} className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-600 hover:bg-navy-50"><Edit3 className="h-4 w-4" /></button>
            <button onClick={() => remove(n.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'تعديل خبر' : 'إضافة خبر'} maxWidth="max-w-xl">
        <form onSubmit={save} className="space-y-4">
          <Field label="عنوان الخبر *">
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="التصنيف">
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="إنجازات">إنجازات</option>
                <option value="إعلانات">إعلانات</option>
                <option value="شراكات">شراكات</option>
              </select>
            </Field>
            <Field label="التاريخ">
              <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
          </div>
          <Field label="ملخص الخبر">
            <textarea rows={2} className="input-field resize-none" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </Field>
          <Field label="النص الكامل">
            <textarea rows={4} className="input-field resize-none" value={form.fullContent} onChange={(e) => setForm({ ...form, fullContent: e.target.value })} />
          </Field>
          <Field label="رابط الصورة">
            <input className="input-field" dir="ltr" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.pinnedOnHomepage} onChange={(e) => setForm({ ...form, pinnedOnHomepage: e.target.checked })} className="h-4 w-4 accent-navy-700" />
            <span className="text-sm font-semibold text-navy-900">تثبيت في الصفحة الرئيسية</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary"><CheckCircle2 className="h-4 w-4" /> {editId ? 'حفظ' : 'إضافة'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ---------- Board Preview ---------- */
function BoardPreviewTab() {
  const { siteContent, setSiteContent } = useApp();
  const [form, setForm] = useState(siteContent);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const b = form.boardPreview;
  const toggleMember = (id: string) => {
    setForm((prev) => ({
      ...prev,
      boardPreview: {
        ...prev.boardPreview,
        memberIds: prev.boardPreview.memberIds.includes(id)
          ? prev.boardPreview.memberIds.filter((m) => m !== id)
          : [...prev.boardPreview.memberIds, id],
      },
    }));
  };

  return (
    <form onSubmit={save} className="card space-y-5 p-6">
      <SectionTitle icon={Crown} title="معاينة الهيئة التنفيذية" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="عنوان القسم">
          <input className="input-field" value={b.title} onChange={(e) => setForm({ ...form, boardPreview: { ...b, title: e.target.value } })} />
        </Field>
        <Field label="العنوان الفرعي">
          <input className="input-field" value={b.subtitle} onChange={(e) => setForm({ ...form, boardPreview: { ...b, subtitle: e.target.value } })} />
        </Field>
        <Field label="الوصف">
          <input className="input-field" value={b.description} onChange={(e) => setForm({ ...form, boardPreview: { ...b, description: e.target.value } })} />
        </Field>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="mb-3 text-sm font-bold text-navy-900">الأعضاء الظاهرون في الصفحة الرئيسية</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {committeeIdOptions.map((opt) => {
            const checked = b.memberIds.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                  checked ? 'border-navy-300 bg-navy-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleMember(opt.value)}
                  className="h-4 w-4 accent-navy-700"
                />
                <span className="text-sm font-semibold text-navy-900">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <SaveBar saved={saved} onReset={() => setForm(siteContent)} />
    </form>
  );
}

/* ---------- Shared UI ---------- */
function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-navy-600" />
      <h3 className="text-base font-bold text-navy-900">{title}</h3>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-field">{label}</label>
      {children}
    </div>
  );
}

function SaveBar({ saved, onReset }: { saved: boolean; onReset: () => void }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
      {saved && (
        <span className="flex items-center gap-2 text-sm font-bold text-emerald-600">
          <CheckCircle2 className="h-4 w-4" /> تم حفظ التغييرات بنجاح
        </span>
      )}
      <div className="mr-auto flex gap-2">
        <button type="button" onClick={onReset} className="btn-ghost">استعادة</button>
        <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> حفظ التغييرات</button>
      </div>
    </div>
  );
}

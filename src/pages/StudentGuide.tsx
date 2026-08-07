import { useState } from 'react';
import {
  BookOpen, Home, Bus, Library, GraduationCap, MapPin, Phone, Clock,
  ExternalLink, ChevronLeft, Info, Plus, Edit3, Trash2, Save, X,
  Phone as PhoneIcon, Link as LinkIcon, UtensilsCrossed,
  HeartPulse, ShoppingCart, Wallet, FileText, Building2, Car, Wifi,
  Coffee, Pill, BookMarked, Briefcase, Landmark, Mail, MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import type { GuideSectionData, GuideItem, GuideContact } from '../data/mockData';

const iconMap: Record<string, typeof BookOpen> = {
  BookOpen, Home, Bus, Library, GraduationCap, MapPin, Phone, Clock,
  ExternalLink, Info, UtensilsCrossed, HeartPulse, ShoppingCart, Wallet,
  FileText, Building2, Car, Wifi, Coffee, Pill, BookMarked, Briefcase,
  Landmark, Mail, MessageCircle,
};

const iconNames = Object.keys(iconMap);

const colorOptions = [
  { color: 'text-navy-700', bg: 'bg-navy-100' },
  { color: 'text-emerald-700', bg: 'bg-emerald-100' },
  { color: 'text-sky-700', bg: 'bg-sky-100' },
  { color: 'text-gold-700', bg: 'bg-gold-100' },
  { color: 'text-rose-700', bg: 'bg-rose-100' },
  { color: 'text-fuchsia-700', bg: 'bg-fuchsia-100' },
  { color: 'text-teal-700', bg: 'bg-teal-100' },
  { color: 'text-orange-700', bg: 'bg-orange-100' },
];

export default function StudentGuide() {
  const { currentUser, guideSections, setGuideSections } = useApp();
  const [activeSectionId, setActiveSectionId] = useState(guideSections[0]?.id ?? '');
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<GuideSectionData | null>(null);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GuideItem | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<GuideContact | null>(null);
  const [quickInfo, setQuickInfo] = useState(
    'أرضروم مدينة جامعية آمنة بمناخ قاري بارد شتاءً. يفضل إعداد ملابس شتوية دافئة قبل القدوم.'
  );
  const [editingQuickInfo, setEditingQuickInfo] = useState(false);

  const isPresidentOrMedia =
    currentUser &&
    ((currentUser.role === 'president') ||
     (currentUser.role === 'committee-head' && currentUser.committee === 'media'));

  const activeSection = guideSections.find((s) => s.id === activeSectionId) ?? guideSections[0];

  // Section form state
  const [sectionForm, setSectionForm] = useState({
    label: '', icon: 'BookOpen', color: 'text-navy-700', bg: 'bg-navy-100',
    title: '', intro: '',
  });

  // Item form state
  const [itemForm, setItemForm] = useState({
    heading: '', body: '', tips: [''],
  });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    label: '', value: '', type: 'phone' as 'phone' | 'link',
  });

  const openAddSection = () => {
    setEditingSection(null);
    setSectionForm({ label: '', icon: 'BookOpen', color: 'text-navy-700', bg: 'bg-navy-100', title: '', intro: '' });
    setSectionModalOpen(true);
  };

  const openEditSection = (s: GuideSectionData) => {
    setEditingSection(s);
    setSectionForm({ label: s.label, icon: s.icon, color: s.color, bg: s.bg, title: s.title, intro: s.intro });
    setSectionModalOpen(true);
  };

  const saveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.label.trim()) return;
    if (editingSection) {
      setGuideSections((prev) => prev.map((s) => s.id === editingSection.id ? { ...s, ...sectionForm } : s));
    } else {
      const newSection: GuideSectionData = {
        id: 'sec' + Date.now(), ...sectionForm, items: [], contacts: [],
      };
      setGuideSections((prev) => [...prev, newSection]);
      setActiveSectionId(newSection.id);
    }
    setSectionModalOpen(false);
  };

  const deleteSection = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم بكامل محتوياته؟')) {
      setGuideSections((prev) => prev.filter((s) => s.id !== id));
      if (activeSectionId === id) {
        const remaining = guideSections.filter((s) => s.id !== id);
        setActiveSectionId(remaining[0]?.id ?? '');
      }
    }
  };

  const openAddItem = () => {
    setEditingItem(null);
    setItemForm({ heading: '', body: '', tips: [''] });
    setItemModalOpen(true);
  };

  const openEditItem = (item: GuideItem) => {
    setEditingItem(item);
    setItemForm({ heading: item.heading, body: item.body, tips: item.tips.length ? [...item.tips] : [''] });
    setItemModalOpen(true);
  };

  const saveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.heading.trim()) return;
    const tips = itemForm.tips.filter((t) => t.trim());
    if (editingItem) {
      setGuideSections((prev) => prev.map((s) => s.id === activeSectionId ? {
        ...s, items: s.items.map((it) => it.id === editingItem.id ? { ...it, heading: itemForm.heading, body: itemForm.body, tips } : it),
      } : s));
    } else {
      const newItem: GuideItem = { id: 'item' + Date.now(), heading: itemForm.heading, body: itemForm.body, tips };
      setGuideSections((prev) => prev.map((s) => s.id === activeSectionId ? { ...s, items: [...s.items, newItem] } : s));
    }
    setItemModalOpen(false);
  };

  const deleteItem = (itemId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المعلومة؟')) {
      setGuideSections((prev) => prev.map((s) => s.id === activeSectionId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s));
    }
  };

  const moveItem = (itemId: string, dir: -1 | 1) => {
    setGuideSections((prev) => prev.map((s) => {
      if (s.id !== activeSectionId) return s;
      const items = [...s.items];
      const idx = items.findIndex((it) => it.id === itemId);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= items.length) return s;
      [items[idx], items[newIdx]] = [items[newIdx], items[idx]];
      return { ...s, items };
    }));
  };

  const openAddContact = () => {
    setEditingContact(null);
    setContactForm({ label: '', value: '', type: 'phone' });
    setContactModalOpen(true);
  };

  const openEditContact = (c: GuideContact) => {
    setEditingContact(c);
    setContactForm({ label: c.label, value: c.value, type: c.type });
    setContactModalOpen(true);
  };

  const saveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.label.trim() || !contactForm.value.trim()) return;
    if (editingContact) {
      setGuideSections((prev) => prev.map((s) => s.id === activeSectionId ? {
        ...s, contacts: s.contacts.map((c) => c.id === editingContact.id ? { ...c, ...contactForm } : c),
      } : s));
    } else {
      const newContact: GuideContact = { id: 'ct' + Date.now(), ...contactForm };
      setGuideSections((prev) => prev.map((s) => s.id === activeSectionId ? { ...s, contacts: [...s.contacts, newContact] } : s));
    }
    setContactModalOpen(false);
  };

  const deleteContact = (contactId: string) => {
    setGuideSections((prev) => prev.map((s) => s.id === activeSectionId ? { ...s, contacts: s.contacts.filter((c) => c.id !== contactId) } : s));
  };

  const ActiveIcon = activeSection ? iconMap[activeSection.icon] ?? BookOpen : BookOpen;

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-gray-50 pt-20 lg:pt-24">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-l from-navy-900 to-navy-950 py-16">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container-app relative">
          <div className="flex items-center gap-3 text-gold-400">
            <BookOpen className="h-6 w-6" />
            <span className="text-sm font-bold tracking-wide">دليل الطالب</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">دليلك الشامل للحياة في أرضروم</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">
            كل ما يحتاجه الطالب الجديد في مدينة أرضروم وجامعة أتاتورك، من التسجيل الجامعي إلى السكن والمواصلات والخدمات الأكاديمية.
          </p>
        </div>
      </div>

      <div className="container-app py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card overflow-hidden p-2">
              <nav className="space-y-1">
                {guideSections.map((section) => {
                  const Icon = iconMap[section.icon] ?? BookOpen;
                  return (
                    <div key={section.id} className="group relative">
                      <button
                        onClick={() => setActiveSectionId(section.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                          activeSectionId === section.id
                            ? 'bg-navy-800 text-white shadow'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${activeSectionId === section.id ? 'bg-white/20' : section.bg}`}>
                          <Icon className={`h-4 w-4 ${activeSectionId === section.id ? 'text-white' : section.color}`} />
                        </div>
                        {section.label}
                        {activeSectionId === section.id && <ChevronLeft className="mr-auto h-4 w-4" />}
                      </button>
                      {isPresidentOrMedia && (
                        <div className="absolute left-2 top-1/2 flex -translate-y-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditSection(section); }}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-navy-700 shadow-sm hover:bg-white"
                            title="تعديل القسم"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-rose-600 shadow-sm hover:bg-white"
                            title="حذف القسم"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
              {isPresidentOrMedia && (
                <button
                  onClick={openAddSection}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-navy-300 px-4 py-2.5 text-xs font-bold text-navy-600 transition-colors hover:bg-navy-50"
                >
                  <Plus className="h-4 w-4" /> إضافة قسم جديد
                </button>
              )}
            </div>
            {/* Quick info card */}
            <div className="mt-4 card bg-gradient-to-br from-navy-50 to-gold-50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-navy-900">
                  <Info className="h-5 w-5" />
                  <span className="text-sm font-bold">معلومة سريعة</span>
                </div>
                {isPresidentOrMedia && !editingQuickInfo && (
                  <button
                    onClick={() => setEditingQuickInfo(true)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/60 text-navy-600 hover:bg-white"
                    title="تعديل"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {editingQuickInfo ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs leading-relaxed text-gray-700 focus:border-navy-400 focus:outline-none"
                    value={quickInfo}
                    onChange={(e) => setQuickInfo(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingQuickInfo(false)}
                      className="inline-flex items-center gap-1 rounded-lg bg-navy-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-800"
                    >
                      <Save className="h-3 w-3" /> حفظ
                    </button>
                    <button
                      onClick={() => setEditingQuickInfo(false)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      <X className="h-3 w-3" /> إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs leading-relaxed text-gray-600">{quickInfo}</p>
              )}
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-6">
            {/* Section header */}
            <div className="card overflow-hidden">
              <div className={`flex items-center gap-4 ${activeSection.bg} p-6`}>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow ${activeSection.color}`}>
                  <ActiveIcon className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-navy-900">{activeSection.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{activeSection.intro}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            {activeSection.items.map((item, idx) => (
              <div key={item.id} className="card group relative p-6">
                {isPresidentOrMedia && (
                  <div className="absolute left-4 top-4 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => moveItem(item.id, -1)}
                      disabled={idx === 0}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-50 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                      title="تحريك لأعلى"
                    >
                      <ChevronLeft className="h-4 w-4 rotate-90" />
                    </button>
                    <button
                      onClick={() => moveItem(item.id, 1)}
                      disabled={idx === activeSection.items.length - 1}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-50 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                      title="تحريك لأسفل"
                    >
                      <ChevronLeft className="h-4 w-4 -rotate-90" />
                    </button>
                    <button
                      onClick={() => openEditItem(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-50 text-navy-700 hover:bg-navy-100"
                      title="تعديل"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-800 text-sm font-bold text-white">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-navy-900">{item.heading}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.body}</p>
                    {item.tips.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {item.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isPresidentOrMedia && (
              <button
                onClick={openAddItem}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-navy-200 px-4 py-4 text-sm font-bold text-navy-600 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <Plus className="h-5 w-5" /> إضافة معلومة/دليل جديد
              </button>
            )}

            {/* Contacts */}
            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-bold text-navy-900">
                  <Phone className="h-5 w-5 text-navy-600" />
                  جهات الاتصال المهمة
                </h3>
                {isPresidentOrMedia && (
                  <button
                    onClick={openAddContact}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-bold text-navy-700 hover:bg-navy-100"
                  >
                    <Plus className="h-3.5 w-3.5" /> إضافة جهة اتصال
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeSection.contacts.map((contact) => {
                  const Icon = contact.type === 'phone' ? PhoneIcon : LinkIcon;
                  return (
                    <div key={contact.id} className="group relative flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-100 text-navy-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-400">{contact.label}</div>
                        <div className="text-sm font-bold text-navy-900" dir="ltr">{contact.value}</div>
                      </div>
                      {isPresidentOrMedia && (
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => openEditContact(contact)}
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-navy-700 shadow-sm hover:bg-navy-50"
                            title="تعديل"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteContact(contact.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-rose-600 shadow-sm hover:bg-rose-50"
                            title="حذف"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {activeSection.contacts.length === 0 && (
                  <div className="col-span-2 py-6 text-center text-sm text-gray-400">لا توجد جهات اتصال لهذا القسم.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Modal */}
      <Modal open={sectionModalOpen} onClose={() => setSectionModalOpen(false)} title={editingSection ? 'تعديل القسم' : 'إضافة قسم جديد'} maxWidth="max-w-lg">
        <form onSubmit={saveSection} className="space-y-4">
          <div>
            <label className="label-field">اسم القسم *</label>
            <input className="input-field" value={sectionForm.label} onChange={(e) => setSectionForm({ ...sectionForm, label: e.target.value })} placeholder="مثال: المطاعم" />
          </div>
          <div>
            <label className="label-field">العنوان الرئيسي</label>
            <input className="input-field" value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} placeholder="مثال: دليل المطاعم" />
          </div>
          <div>
            <label className="label-field">النص التعريفي</label>
            <textarea rows={2} className="input-field resize-none" value={sectionForm.intro} onChange={(e) => setSectionForm({ ...sectionForm, intro: e.target.value })} />
          </div>
          <div>
            <label className="label-field">الأيقونة</label>
            <div className="flex flex-wrap gap-2">
              {iconNames.map((name) => {
                const Icon = iconMap[name];
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSectionForm({ ...sectionForm, icon: name })}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-colors ${
                      sectionForm.icon === name ? 'border-navy-600 bg-navy-50' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 text-navy-700" />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label-field">اللون</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setSectionForm({ ...sectionForm, color: c.color, bg: c.bg })}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 ${c.bg} ${c.color} ${
                    sectionForm.color === c.color ? 'border-navy-600 ring-2 ring-navy-200' : 'border-transparent'
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setSectionModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> حفظ
            </button>
          </div>
        </form>
      </Modal>

      {/* Item Modal */}
      <Modal open={itemModalOpen} onClose={() => setItemModalOpen(false)} title={editingItem ? 'تعديل المعلومة' : 'إضافة معلومة/دليل جديد'} maxWidth="max-w-lg">
        <form onSubmit={saveItem} className="space-y-4">
          <div>
            <label className="label-field">عنوان الكرت *</label>
            <input className="input-field" value={itemForm.heading} onChange={(e) => setItemForm({ ...itemForm, heading: e.target.value })} />
          </div>
          <div>
            <label className="label-field">الوصف الرئيسي</label>
            <textarea rows={2} className="input-field resize-none" value={itemForm.body} onChange={(e) => setItemForm({ ...itemForm, body: e.target.value })} />
          </div>
          <div>
            <label className="label-field">النقاط الفرعية</label>
            <div className="space-y-2">
              {itemForm.tips.map((tip, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="input-field"
                    value={tip}
                    onChange={(e) => setItemForm({ ...itemForm, tips: itemForm.tips.map((t, j) => j === i ? e.target.value : t) })}
                    placeholder={`نقطة ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => setItemForm({ ...itemForm, tips: itemForm.tips.filter((_, j) => j !== i) })}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setItemForm({ ...itemForm, tips: [...itemForm.tips, ''] })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-navy-300 px-3 py-1.5 text-xs font-bold text-navy-600 hover:bg-navy-50"
              >
                <Plus className="h-3.5 w-3.5" /> إضافة نقطة
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setItemModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> حفظ
            </button>
          </div>
        </form>
      </Modal>

      {/* Contact Modal */}
      <Modal open={contactModalOpen} onClose={() => setContactModalOpen(false)} title={editingContact ? 'تعديل جهة اتصال' : 'إضافة جهة اتصال'} maxWidth="max-w-md">
        <form onSubmit={saveContact} className="space-y-4">
          <div>
            <label className="label-field">الاسم *</label>
            <input className="input-field" value={contactForm.label} onChange={(e) => setContactForm({ ...contactForm, label: e.target.value })} placeholder="مثال: قسم شؤون الطلاب" />
          </div>
          <div>
            <label className="label-field">القيمة *</label>
            <input className="input-field" dir="ltr" value={contactForm.value} onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })} placeholder="+90 442 231 0000" />
          </div>
          <div>
            <label className="label-field">النوع</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setContactForm({ ...contactForm, type: 'phone' })}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-colors ${
                  contactForm.type === 'phone' ? 'border-navy-600 bg-navy-50 text-navy-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <PhoneIcon className="h-4 w-4" /> رقم هاتف
              </button>
              <button
                type="button"
                onClick={() => setContactForm({ ...contactForm, type: 'link' })}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-colors ${
                  contactForm.type === 'link' ? 'border-navy-600 bg-navy-50 text-navy-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LinkIcon className="h-4 w-4" /> رابط موقع
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setContactModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> حفظ
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

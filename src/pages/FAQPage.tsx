import { useState } from 'react';
import {
  HelpCircle, ChevronLeft, Plus, Minus, Users, ClipboardList, Shield,
  Edit3, Trash2, Save, Mail, BookOpen, Award, Heart, Megaphone, DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import type { FAQCategoryData, FAQItem } from '../data/mockData';

const iconMap: Record<string, typeof HelpCircle> = {
  Users, ClipboardList, Shield, HelpCircle, Mail, BookOpen, Award, Heart, Megaphone, DollarSign,
};
const iconNames = Object.keys(iconMap);

export default function FAQPage() {
  const { currentUser, faqCategories, setFaqCategories, setView } = useApp();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<FAQCategoryData | null>(null);
  const [catForm, setCatForm] = useState({ title: '', icon: 'HelpCircle', color: 'text-navy-700', bg: 'bg-navy-100' });

  // Question modal
  const [qModalOpen, setQModalOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<FAQItem | null>(null);
  const [qTargetCat, setQTargetCat] = useState<string>('');
  const [qForm, setQForm] = useState({ question: '', answer: '' });

  const isPresidentOrMedia =
    currentUser &&
    ((currentUser.role === 'president') ||
     (currentUser.role === 'committee-head' && currentUser.committee === 'media'));

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // === Category CRUD ===
  const openAddCat = () => {
    setEditingCat(null);
    setCatForm({ title: '', icon: 'HelpCircle', color: 'text-navy-700', bg: 'bg-navy-100' });
    setCatModalOpen(true);
  };

  const openEditCat = (cat: FAQCategoryData) => {
    setEditingCat(cat);
    setCatForm({ title: cat.title, icon: cat.icon, color: cat.color, bg: cat.bg });
    setCatModalOpen(true);
  };

  const saveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.title.trim()) return;
    if (editingCat) {
      setFaqCategories((prev) => prev.map((c) => c.id === editingCat.id ? { ...c, ...catForm } : c));
    } else {
      const newCat: FAQCategoryData = { id: 'faqcat' + Date.now(), ...catForm, items: [] };
      setFaqCategories((prev) => [...prev, newCat]);
    }
    setCatModalOpen(false);
  };

  const deleteCat = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفئة بكامل أسئلتها؟')) {
      setFaqCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // === Question CRUD ===
  const openAddQ = (catId: string) => {
    setQTargetCat(catId);
    setEditingQ(null);
    setQForm({ question: '', answer: '' });
    setQModalOpen(true);
  };

  const openEditQ = (catId: string, item: FAQItem) => {
    setQTargetCat(catId);
    setEditingQ(item);
    setQForm({ question: item.question, answer: item.answer });
    setQModalOpen(true);
  };

  const saveQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qForm.question.trim() || !qForm.answer.trim() || !qTargetCat) return;
    if (editingQ) {
      setFaqCategories((prev) => prev.map((c) => {
        if (c.id !== qTargetCat) return c;
        return { ...c, items: c.items.map((it) => it.id === editingQ.id ? { ...it, ...qForm } : it) };
      }));
    } else {
      const newItem: FAQItem = { id: 'faq' + Date.now(), ...qForm };
      setFaqCategories((prev) => prev.map((c) => {
        if (c.id !== qTargetCat) return c;
        return { ...c, items: [...c.items, newItem] };
      }));
    }
    setQModalOpen(false);
  };

  const deleteQ = (catId: string, itemId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      setFaqCategories((prev) => prev.map((c) => {
        if (c.id !== catId) return c;
        return { ...c, items: c.items.filter((it) => it.id !== itemId) };
      }));
    }
  };

  const colorOptions = [
    { color: 'text-navy-700', bg: 'bg-navy-100' },
    { color: 'text-emerald-700', bg: 'bg-emerald-100' },
    { color: 'text-gold-700', bg: 'bg-gold-100' },
    { color: 'text-sky-700', bg: 'bg-sky-100' },
    { color: 'text-rose-700', bg: 'bg-rose-100' },
    { color: 'text-amber-700', bg: 'bg-amber-100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-gray-50 pt-20 lg:pt-24">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-l from-navy-900 to-navy-950 py-16">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container-app relative">
          <div className="flex items-center gap-3 text-gold-400">
            <HelpCircle className="h-6 w-6" />
            <span className="text-sm font-bold tracking-wide">الأسئلة الشائعة</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">إجابات لأكثر أسئلتكم تكرارًا</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">
            تجد هنا إجابات شاملة للأسئلة المتعلقة بالانضمام للاتحاد، الاستفادة من الخدمات، والمشاركة في اللجان.
          </p>
        </div>
      </div>

      <div className="container-app py-10">
        <div className="mx-auto max-w-4xl space-y-10">
          {faqCategories.map((category) => {
            const CatIcon = iconMap[category.icon] ?? HelpCircle;
            return (
              <div key={category.id} className="group/cat">
                {/* Category header */}
                <div className="mb-5 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${category.bg} ${category.color}`}>
                    <CatIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-extrabold text-navy-900">{category.title}</h2>
                    <p className="text-xs text-gray-500">{category.items.length} أسئلة</p>
                  </div>
                  {isPresidentOrMedia && (
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover/cat:opacity-100">
                      <button
                        onClick={() => openEditCat(category)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-navy-700 shadow ring-1 ring-gray-200 hover:bg-navy-50"
                        title="تعديل الفئة"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCat(category.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-rose-600 shadow ring-1 ring-gray-200 hover:bg-rose-50"
                        title="حذف الفئة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Accordion items */}
                <div className="space-y-3">
                  {category.items.map((item, idx) => {
                    const key = `${category.id}-${item.id}`;
                    const isOpen = openItems.has(key);
                    return (
                      <div
                        key={item.id}
                        className={`card group/q relative overflow-hidden transition-all ${isOpen ? 'ring-2 ring-navy-200' : ''}`}
                      >
                        {isPresidentOrMedia && (
                          <div className="absolute left-3 top-3 z-10 flex gap-1 opacity-0 transition-opacity group-hover/q:opacity-100">
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditQ(category.id, item); }}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-navy-700 shadow ring-1 ring-gray-200 hover:bg-navy-50"
                              title="تعديل السؤال"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteQ(category.id, item.id); }}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-rose-600 shadow ring-1 ring-gray-200 hover:bg-rose-50"
                              title="حذف السؤال"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => toggleItem(key)}
                          className="flex w-full items-center justify-between gap-4 p-5 text-right"
                        >
                          <span className="flex items-center gap-3">
                            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isOpen ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {idx + 1}
                            </span>
                            <span className="text-sm font-bold text-navy-900 sm:text-base">{item.question}</span>
                          </span>
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${isOpen ? 'rotate-180 bg-navy-100 text-navy-700' : 'bg-gray-100 text-gray-400'}`}>
                            {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </div>
                        </button>
                        <div
                          className={`grid transition-all duration-300 ${
                            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                              <p className="pr-10 text-sm leading-relaxed text-gray-600">{item.answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isPresidentOrMedia && (
                  <button
                    onClick={() => openAddQ(category.id)}
                    className="mt-3 flex items-center gap-1.5 rounded-xl border border-dashed border-navy-300 px-3 py-2 text-xs font-bold text-navy-600 transition-colors hover:bg-navy-50"
                  >
                    <Plus className="h-3.5 w-3.5" /> إضافة سؤال جديد
                  </button>
                )}
              </div>
            );
          })}

          {isPresidentOrMedia && (
            <button
              onClick={openAddCat}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-navy-200 px-4 py-4 text-sm font-bold text-navy-600 transition-colors hover:border-navy-300 hover:bg-navy-50"
            >
              <Plus className="h-5 w-5" /> إضافة فئة أسئلة
            </button>
          )}

          {/* Contact CTA */}
          <div className="card overflow-hidden bg-gradient-to-l from-navy-800 to-navy-950 p-8 text-center">
            <HelpCircle className="mx-auto h-10 w-10 text-gold-400" />
            <h3 className="mt-4 text-xl font-bold text-white">لم تجد إجابة لسؤالك؟</h3>
            <p className="mt-2 text-sm text-gray-300">تواصل معنا وسنرد على استفسارك في أقرب وقت ممكن.</p>
            <button
              onClick={() => setView({ kind: 'contact' })}
              className="btn-gold mt-5 inline-flex"
            >
              تواصل معنا
            </button>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <Modal open={catModalOpen} onClose={() => setCatModalOpen(false)} title={editingCat ? 'تعديل الفئة' : 'إضافة فئة أسئلة جديدة'} maxWidth="max-w-md">
        <form onSubmit={saveCat} className="space-y-4">
          <div>
            <label className="label-field">عنوان الفئة *</label>
            <input className="input-field" value={catForm.title} onChange={(e) => setCatForm({ ...catForm, title: e.target.value })} placeholder="مثال: الأنشطة الرياضية" />
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
                    onClick={() => setCatForm({ ...catForm, icon: name })}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all ${
                      catForm.icon === name ? 'border-navy-600 bg-navy-50 text-navy-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label-field">اللون</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((opt) => (
                <button
                  key={opt.color}
                  type="button"
                  onClick={() => setCatForm({ ...catForm, color: opt.color, bg: opt.bg })}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${opt.bg} ${opt.color} border-2 transition-all ${
                    catForm.color === opt.color ? 'border-navy-600 ring-2 ring-navy-200' : 'border-transparent'
                  }`}
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setCatModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> حفظ
            </button>
          </div>
        </form>
      </Modal>

      {/* Question Modal */}
      <Modal open={qModalOpen} onClose={() => setQModalOpen(false)} title={editingQ ? 'تعديل السؤال' : 'إضافة سؤال جديد'} maxWidth="max-w-lg">
        <form onSubmit={saveQ} className="space-y-4">
          <div>
            <label className="label-field">نص السؤال *</label>
            <input className="input-field" value={qForm.question} onChange={(e) => setQForm({ ...qForm, question: e.target.value })} placeholder="اكتب السؤال هنا" />
          </div>
          <div>
            <label className="label-field">الإجابة *</label>
            <textarea rows={4} className="input-field resize-none" value={qForm.answer} onChange={(e) => setQForm({ ...qForm, answer: e.target.value })} placeholder="اكتب الإجابة هنا" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setQModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> حفظ
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

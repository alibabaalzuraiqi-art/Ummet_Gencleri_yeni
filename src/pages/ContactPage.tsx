import { useState } from 'react';
import {
  Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare,
  Edit3, Save, Navigation,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import type { ContactCardData } from '../data/mockData';

const iconMap: Record<string, typeof Mail> = {
  Mail, Phone, MapPin, Clock,
};

export default function ContactPage() {
  const { currentUser, addContactMessage, contactCards, setContactCards } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Card edit modal
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ContactCardData | null>(null);
  const [cardForm, setCardForm] = useState({ title: '', value: '', sub: '' });

  const isPresidentOrMedia =
    currentUser &&
    ((currentUser.role === 'president') ||
     (currentUser.role === 'committee-head' && currentUser.committee === 'media'));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'الرجاء إدخال الاسم';
    if (!form.email.trim()) errs.email = 'الرجاء إدخال البريد الإلكتروني';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'بريد إلكتروني غير صالح';
    if (!form.subject.trim()) errs.subject = 'الرجاء إدخال الموضوع';
    if (!form.body.trim()) errs.body = 'الرجاء كتابة الرسالة';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    addContactMessage(form);
    setForm({ name: '', email: '', subject: '', body: '' });
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const openEditCard = (card: ContactCardData) => {
    setEditingCard(card);
    setCardForm({ title: card.title, value: card.value, sub: card.sub });
    setCardModalOpen(true);
  };

  const saveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    setContactCards((prev) => prev.map((c) => c.id === editingCard.id ? { ...c, ...cardForm } : c));
    setCardModalOpen(false);
  };

  return (
    <div className="animate-fade-in pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 py-16 text-center lg:py-20">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="container-app relative">
          <span className="text-sm font-bold uppercase tracking-wider text-gold-300">تواصل معنا</span>
          <h1 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">اتصل بنا</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300">
            هل لديك سؤال أو اقتراح أو ترغب بالتعاون معنا؟ يسعدنا تواصلك معنا في أي وقت.
          </p>
        </div>
      </section>

      <section className="container-app py-14">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact info cards */}
          <div className="space-y-4">
            {contactCards.map((c) => {
              const Icon = iconMap[c.icon] ?? Mail;
              return (
                <div key={c.id} className="group/card card relative flex items-start gap-4 p-5 transition-all hover:shadow-md">
                  {isPresidentOrMedia && (
                    <button
                      onClick={() => openEditCard(c)}
                      className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-navy-700 opacity-0 shadow ring-1 ring-gray-200 transition-opacity hover:bg-navy-50 group-hover/card:opacity-100"
                      title="تعديل"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400">{c.title}</div>
                    <div className="mt-1 font-bold text-navy-900" dir={c.ltr ? 'ltr' : undefined}>{c.value}</div>
                    <div className="text-xs text-gray-500">{c.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-800 text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy-900">أرسل لنا رسالة</h2>
                  <p className="text-sm text-gray-500">سنرد عليك في أقرب وقت ممكن.</p>
                </div>
              </div>

              {sent && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 animate-fade-in-fast">
                  <CheckCircle2 className="h-5 w-5" />
                  تم إرسال رسالتك بنجاح! شكرًا لتواصلك معنا.
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-field">الاسم الكامل</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      placeholder="أدخل اسمك"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label-field">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="label-field">الموضوع</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input-field"
                    placeholder="موضوع الرسالة"
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                </div>
                <div>
                  <label className="label-field">الرسالة</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    rows={5}
                    className="input-field resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                  {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body}</p>}
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  <Send className="h-4 w-4" />
                  إرسال الرسالة
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Interactive map - Erzurum / Atatürk University */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-gray-100 shadow-md">
          <div className="flex items-center justify-between bg-navy-800 px-5 py-3">
            <div className="flex items-center gap-2 text-white">
              <Navigation className="h-4 w-4 text-gold-400" />
              <span className="text-sm font-bold">موقعنا - جامعة أتاتورك، أرضروم</span>
            </div>
            <a
              href="https://www.google.com/maps/place/Atat%C3%BCrk+%C3%9Cniversitesi/@39.9263,41.2678,15z"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-gold-300 hover:text-gold-200"
            >
              فتح في خرائط Google
            </a>
          </div>
          <iframe
            title="موقع الاتحاد - جامعة أتاتورك أرضروم"
            src="https://www.google.com/maps?q=Atat%C3%BCrk+%C3%9Cniversitesi,Erzurum&output=embed"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Card edit modal */}
      <Modal open={cardModalOpen} onClose={() => setCardModalOpen(false)} title="تعديل بطاقة التواصل" maxWidth="max-w-sm">
        <form onSubmit={saveCard} className="space-y-4">
          <div>
            <label className="label-field">العنوان</label>
            <input className="input-field" value={cardForm.title} onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })} />
          </div>
          <div>
            <label className="label-field">القيمة</label>
            <input className="input-field" dir={editingCard?.ltr ? 'ltr' : undefined} value={cardForm.value} onChange={(e) => setCardForm({ ...cardForm, value: e.target.value })} />
          </div>
          <div>
            <label className="label-field">الوصف الفرعي</label>
            <input className="input-field" value={cardForm.sub} onChange={(e) => setCardForm({ ...cardForm, sub: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setCardModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> حفظ
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

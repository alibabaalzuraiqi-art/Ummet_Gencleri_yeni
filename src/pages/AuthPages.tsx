import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, GraduationCap, CheckCircle2, AlertCircle, Users, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

type AuthError = string | null;

function passwordStrength(p: string): { ok: boolean; hint: string } {
  if (p.length < 6) return { ok: false, hint: '6 أحرف على الأقل' };
  if (!/[A-Z]/.test(p)) return { ok: false, hint: 'حرف كبير واحد على الأقل' };
  if (!/[a-z]/.test(p)) return { ok: false, hint: 'حرف صغير واحد على الأقل' };
  if (!/[0-9]/.test(p)) return { ok: false, hint: 'رقم أو رمز واحد على الأقل' };
  return { ok: true, hint: '' };
}

export function LoginPage() {
  const { login, setView } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('الرجاء إدخال البريد وكلمة المرور');
      return;
    }
    setLoading(true);
    setError('');
    const res = await login(email.trim(), password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <AuthShell title="تسجيل الدخول" subtitle="ادخل إلى بوابتك الخاصة">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <div>
          <label className="label-field">البريد الإلكتروني</label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="input-field pr-10"
              placeholder="student@ummet.org"
              dir="ltr"
            />
          </div>
        </div>
        <div>
          <label className="label-field">كلمة المرور</label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="input-field pr-10"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          <LogIn className="h-4 w-4" />
          {loading ? 'جارٍ الدخول...' : 'دخول'}
        </button>
        <p className="text-center text-sm text-gray-500">
          ليس لديك حساب؟{' '}
          <button type="button" onClick={() => setView({ kind: 'register' })} className="font-bold text-navy-700 hover:text-navy-900">
            أنشئ حسابًا
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { registerWithApplication, setView } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', university: '', major: '', year: 'السنة الأولى', phone: '', motivation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(form.password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('بريد إلكتروني غير صالح');
      return;
    }
    if (!/^[0-9]{10}$/.test(form.phone) || !form.phone.startsWith('05')) {
      setError('يرجى إدخال رقم تواصل صحيح يبدأ بـ 05 ويتكون من 10 أرقام');
      return;
    }
    if (!strength.ok) {
      setError(`كلمة المرور ضعيفة: ${strength.hint}`);
      return;
    }
    setLoading(true);
    setError('');
    const res = await registerWithApplication(
      form.name.trim(),
      form.email.trim(),
      form.password,
      form.university.trim() || 'غير محدد',
      form.major.trim() || 'غير محدد',
      form.year,
      form.phone.trim(),
      form.motivation.trim()
    );
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? 'تعذر إنشاء الحساب');
    }
  };

  return (
    <AuthShell title="إنشاء حساب جديد" subtitle="انضم إلى عائلة اتحاد شباب الأمة" wide>
      <div className="mb-4 rounded-xl border border-gold-200 bg-gold-50 p-3 text-xs text-gold-800">
        <span className="font-bold">ملاحظة:</span> بعد إنشاء الحساب، سيكون طلبك قيد المراجعة من قبل إدارة الاتحاد قبل الموافقة والمقابلة.
      </div>
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">الاسم الكامل *</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
        </div>
        <div>
          <label className="label-field">كلمة المرور *</label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }}
              className="input-field pr-10"
              placeholder="••••••••"
            />
          </div>
          <p className={`mt-1.5 text-xs ${form.password && !strength.ok ? 'text-rose-600' : 'text-gray-400'}`}>
            يجب أن تحتوي على 6 أحرف على الأقل، مع حرف كبير وحرف صغير ورقم/رمز.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">الجامعة</label>
            <div className="relative">
              <GraduationCap className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
                className="input-field pr-10"
                placeholder="اسم جامعتك"
              />
            </div>
          </div>
          <div>
            <label className="label-field">التخصص</label>
            <input
              type="text"
              value={form.major}
              onChange={(e) => setForm({ ...form, major: e.target.value })}
              className="input-field"
              placeholder="تخصصك"
            />
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
            <label className="label-field">رقم التواصل *</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); setForm({ ...form, phone: v }); setError(''); }}
                className="input-field pr-10"
                placeholder="0555 555 55 55"
                dir="ltr"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">يرجى كتابة الرقم بدءاً بـ 05 (مثال: 05551234567)</p>
          </div>
        </div>
        <div>
          <label className="label-field">دوافع الانضمام</label>
          <textarea
            rows={3}
            value={form.motivation}
            onChange={(e) => setForm({ ...form, motivation: e.target.value })}
            className="input-field resize-none"
            placeholder="اكتب باختصار لماذا ترغب في الانضمام إلى الاتحاد..."
          />
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
          <UserPlus className="h-4 w-4" />
          {loading ? 'جارٍ الإنشاء...' : 'تقديم طلب الانضمام'}
        </button>
        <p className="text-center text-sm text-gray-500">
          لديك حساب بالفعل؟{' '}
          <button type="button" onClick={() => setView({ kind: 'login' })} className="font-bold text-navy-700 hover:text-navy-900">
            سجّل الدخول
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children, wide }: { title: string; subtitle: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-50 via-gray-50 to-navy-100 pt-16 lg:pt-20">
      <div className={`w-full animate-slide-up px-4 py-10 ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="card overflow-hidden shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-l from-navy-800 to-navy-950 px-6 py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-white">{title}</h1>
            <p className="mt-1 text-sm text-gray-300">{subtitle}</p>
          </div>
          <div className="p-6 lg:p-8">{children}</div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          اتحاد شباب الأمة
        </div>
      </div>
    </div>
  );
}

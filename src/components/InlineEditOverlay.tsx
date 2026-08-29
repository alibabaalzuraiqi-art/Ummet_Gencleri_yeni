import { useState, type ReactNode } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import Modal from './Modal';

export interface InlineEditConfig {
  path: string;
  label: string;
  type?: 'text' | 'textarea' | 'image' | 'number' | 'icon';
  target: 'site' | 'about';
}

// Context to avoid prop-drilling the update functions into every edit button.
import { createContext, useContext } from 'react';

interface InlineEditContextValue {
  updateSiteField: (path: string, value: string | number) => void;
  updateAboutField: (path: string, value: string | string[]) => void;
}

const InlineEditContext = createContext<InlineEditContextValue | null>(null);

export function InlineEditProvider({ value, children }: { value: InlineEditContextValue; children: ReactNode }) {
  return <InlineEditContext.Provider value={value}>{children}</InlineEditContext.Provider>;
}

function useInlineEditContext() {
  const ctx = useContext(InlineEditContext);
  if (!ctx) throw new Error('useInlineEditContext must be used within InlineEditProvider');
  return ctx;
}

// Icon options for the icon selector
export const ICON_OPTIONS = [
  'Users', 'CalendarDays', 'GraduationCap', 'HeartHandshake', 'Target', 'TrendingUp',
  'Award', 'BookOpen', 'Sparkles', 'Eye', 'Heart', 'Handshake', 'ShieldCheck',
  'Crown', 'UserCog', 'Megaphone', 'Wallet', 'Network', 'Star', 'Zap',
  'Globe', 'Mail', 'Phone', 'MapPin', 'CheckCircle2', 'Clock', 'FileText',
] as const;

// Single-field edit button + centered modal
export function EditableField({
  config,
  currentValue,
  canEdit,
  children,
}: {
  config: InlineEditConfig;
  currentValue: string;
  canEdit: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(currentValue);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraft(currentValue);
    setOpen(true);
  };

  const { updateSiteField, updateAboutField } = useInlineEditContext();

  const save = () => {
    const val = config.type === 'number' ? Number(draft) || 0 : draft;
    if (config.target === 'site') {
      updateSiteField(config.path, val);
    } else {
      updateAboutField(config.path, String(val));
    }
    setOpen(false);
  };

  if (!canEdit) return <>{children}</>;

  return (
    <>
      <span className="group/edit relative inline-flex items-center">
        {children}
        <button
          type="button"
          onClick={openModal}
          className="absolute -top-1.5 -right-1.5 z-40 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-navy-700 opacity-0 shadow-md ring-1 ring-navy-200 transition-opacity hover:bg-navy-50 group-hover/edit:opacity-100 focus:opacity-100"
          title={`تعديل: ${config.label}`}
          aria-label={`تعديل ${config.label}`}
        >
          <Pencil className="h-3 w-3" />
        </button>
      </span>
      <Modal open={open} onClose={() => setOpen(false)} title={`تعديل: ${config.label}`} maxWidth="max-w-md">
        <div className="space-y-4">
          {config.type === 'textarea' ? (
            <textarea
              rows={5}
              className="input-field resize-none"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          ) : config.type === 'image' ? (
            <div className="space-y-3">
              {draft && (
                <img
                  src={draft}
                  alt="معاينة"
                  className="h-32 w-full rounded-lg object-cover ring-1 ring-gray-200"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <input
                type="url"
                dir="ltr"
                className="input-field"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="https://images.pexels.com/..."
                autoFocus
              />
            </div>
          ) : (
            <input
              type={config.type === 'number' ? 'number' : 'text'}
              className="input-field"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
              <X className="h-4 w-4" /> إلغاء
            </button>
            <button type="button" onClick={save} className="btn-primary">
              <Save className="h-4 w-4" /> حفظ التغييرات
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// Multi-field edit button + centered modal — for stats cards, brand, etc.
export interface MultiFieldConfig {
  label: string;
  target: 'site' | 'about';
  fields: { path: string; label: string; type?: 'text' | 'textarea' | 'image' | 'number' | 'icon' }[];
}

export function EditableCard({
  config,
  currentValues,
  canEdit,
  children,
  className,
}: {
  config: MultiFieldConfig;
  currentValues: Record<string, string>;
  canEdit: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>(currentValues);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraft(currentValues);
    setOpen(true);
  };

  const { updateSiteField, updateAboutField } = useInlineEditContext();

  const save = () => {
    for (const field of config.fields) {
      const val = field.type === 'number' ? Number(draft[field.path]) || 0 : draft[field.path];
      if (config.target === 'site') {
        updateSiteField(field.path, val);
      } else {
        updateAboutField(field.path, String(val));
      }
    }
    setOpen(false);
  };

  if (!canEdit) return <>{children}</>;

  return (
    <>
      <div className={`group/edit relative ${className ?? ''}`}>
        {children}
        <button
          type="button"
          onClick={openModal}
          className="absolute -top-2 -right-2 z-40 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-navy-700 opacity-0 shadow-md ring-1 ring-navy-200 transition-opacity hover:bg-navy-50 group-hover/edit:opacity-100 focus:opacity-100"
          title={`تعديل: ${config.label}`}
          aria-label={`تعديل ${config.label}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={`تعديل: ${config.label}`} maxWidth="max-w-lg">
        <div className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.path}>
              <label className="label-field">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  value={draft[field.path] ?? ''}
                  onChange={(e) => setDraft({ ...draft, [field.path]: e.target.value })}
                />
              ) : field.type === 'image' ? (
                <div className="space-y-2">
                  {draft[field.path] && (
                    <img
                      src={draft[field.path]}
                      alt="معاينة"
                      className="h-24 w-full rounded-lg object-cover ring-1 ring-gray-200"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <input
                    type="url"
                    dir="ltr"
                    className="input-field"
                    value={draft[field.path] ?? ''}
                    onChange={(e) => setDraft({ ...draft, [field.path]: e.target.value })}
                    placeholder="https://images.pexels.com/..."
                  />
                </div>
              ) : field.type === 'icon' ? (
                <IconSelector value={draft[field.path] ?? 'Users'} onChange={(v) => setDraft({ ...draft, [field.path]: v })} />
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  className="input-field"
                  value={draft[field.path] ?? ''}
                  onChange={(e) => setDraft({ ...draft, [field.path]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
              <X className="h-4 w-4" /> إلغاء
            </button>
            <button type="button" onClick={save} className="btn-primary">
              <Save className="h-4 w-4" /> حفظ التغييرات
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// Interactive Lucide icon selector grid
function IconSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2 rounded-xl border border-gray-200 p-3 sm:grid-cols-8">
      {ICON_OPTIONS.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
            value === name
              ? 'border-navy-600 bg-navy-50 text-navy-700 ring-2 ring-navy-200'
              : 'border-gray-200 text-gray-400 hover:border-navy-300 hover:text-navy-600'
          }`}
          title={name}
        >
          <IconByName name={name} />
        </button>
      ))}
    </div>
  );
}

// Dynamically render a Lucide icon by name from the ICON_OPTIONS set
import * as LucideIcons from 'lucide-react';
function IconByName({ name }: { name: string }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name] ?? LucideIcons.Circle;
  return <Icon className="h-5 w-5" />;
}

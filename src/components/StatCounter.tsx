import { useEffect, useRef, useState } from 'react';

export default function StatCounter({
  value,
  label,
  suffix = '',
  icon,
  duration = 1600,
}: {
  value: number;
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(Math.round(value * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <div
      ref={ref}
      className="card group flex flex-col items-center gap-2 p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {icon && (
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-700 transition-colors group-hover:bg-navy-800 group-hover:text-white">
          {icon}
        </div>
      )}
      <div className="text-3xl font-extrabold text-navy-900 lg:text-4xl">
        {display.toLocaleString('ar-EG')}
        {suffix}
      </div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
    </div>
  );
}

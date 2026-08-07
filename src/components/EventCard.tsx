import { CalendarDays, MapPin, Users, Clock, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categoryLabels, categoryColors, type UEvent } from '../data/mockData';

export default function EventCard({
  event,
  onRegister,
}: {
  event: UEvent;
  onRegister?: (e: UEvent) => void;
}) {
  const { currentStudent, registerForEvent, unregisterFromEvent, setView, myApplication } = useApp();
  const isRegistered = currentStudent?.registeredEvents.includes(event.id) ?? false;
  const isFull = event.registered >= event.capacity;
  const isAccepted = !myApplication || myApplication.status === 'accepted';
  const date = new Date(event.date);
  const dateStr = date.toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="card group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
        <span
          className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold ${categoryColors[event.category]}`}
        >
          {categoryLabels[event.category]}
        </span>
        {event.status === 'past' && (
          <span className="absolute top-3 left-3 rounded-full bg-navy-900/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            منتهية
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-navy-700">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {event.description}
        </p>

        <div className="mt-4 space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-navy-500" />
            <span>{dateStr}</span>
            <Clock className="h-4 w-4 text-navy-500" />
            <span>{timeStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-navy-500" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-navy-500" />
            <span>
              {event.registered} / {event.capacity} مسجل
            </span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${
              isFull ? 'bg-rose-500' : 'bg-navy-600'
            }`}
            style={{ width: `${(event.registered / event.capacity) * 100}%` }}
          />
        </div>

        <div className="mt-5 flex-1" />

        {event.status === 'upcoming' ? (
          isRegistered ? (
            <button
              onClick={() => unregisterFromEvent(event.id)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
            >
              <CheckCircle2 className="h-4 w-4" />
              تم التسجيل - إلغاء
            </button>
          ) : isFull ? (
            <button
              disabled
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-400"
            >
              <XCircle className="h-4 w-4" />
              اكتمل العدد
            </button>
          ) : !isAccepted ? (
            <button
              onClick={() => setView({ kind: 'student-dashboard' })}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gold-200 bg-gold-50 px-4 py-2.5 text-sm font-semibold text-gold-700 transition-colors hover:bg-gold-100"
            >
              <Lock className="h-4 w-4" />
              انتظار قبول العضوية
            </button>
          ) : currentStudent ? (
            <button
              onClick={() => registerForEvent(event.id)}
              className="btn-primary w-full"
            >
              سجل الآن
            </button>
          ) : (
            <button
              onClick={() => setView({ kind: 'login' })}
              className="btn-gold w-full"
            >
              سجل الآن
            </button>
          )
        ) : (
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            فعالية منتهية
          </span>
        )}
      </div>
    </article>
  );
}

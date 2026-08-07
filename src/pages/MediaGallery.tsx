import { useState } from 'react';
import {
  Images, Filter, Play, Calendar, MapPin, Camera, Video, X,
  Plus, Edit3, Trash2, Save, Link as LinkIcon, Image as ImageIcon, Film,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import type { GalleryAlbum, GalleryCategory, GalleryMedia } from '../data/mockData';

export default function MediaGallery() {
  const { currentUser, galleryAlbums, setGalleryAlbums, galleryCategories, setGalleryCategories } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [lightboxMedia, setLightboxMedia] = useState<GalleryMedia | null>(null);

  // Album modal
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [albumForm, setAlbumForm] = useState({
    title: '', categoryId: '', date: '', location: '',
    coverImage: '', photoCount: 0, videoCount: 0, description: '',
  });

  // Category modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({ label: '' });

  // Media modal (add media to album)
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaForm, setMediaForm] = useState({
    type: 'photo' as 'photo' | 'video',
    url: '', thumbnail: '', caption: '',
  });

  const isPresidentOrMedia =
    currentUser &&
    ((currentUser.role === 'president') ||
     (currentUser.role === 'committee-head' && currentUser.committee === 'media'));

  const filtered = filter === 'all' ? galleryAlbums : galleryAlbums.filter((a) => a.categoryId === filter);
  const selectedAlbum = galleryAlbums.find((a) => a.id === selectedAlbumId) ?? null;

  // === Album CRUD ===
  const openAddAlbum = () => {
    setEditingAlbum(null);
    setAlbumForm({
      title: '', categoryId: galleryCategories[0]?.id ?? '', date: new Date().toISOString().slice(0, 10),
      location: '', coverImage: '', photoCount: 0, videoCount: 0, description: '',
    });
    setAlbumModalOpen(true);
  };

  const openEditAlbum = (album: GalleryAlbum) => {
    setEditingAlbum(album);
    setAlbumForm({
      title: album.title, categoryId: album.categoryId, date: album.date,
      location: album.location, coverImage: album.coverImage,
      photoCount: album.photoCount, videoCount: album.videoCount, description: album.description,
    });
    setAlbumModalOpen(true);
  };

  const saveAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.title.trim() || !albumForm.categoryId) return;
    if (editingAlbum) {
      setGalleryAlbums((prev) => prev.map((a) => a.id === editingAlbum.id ? { ...a, ...albumForm } : a));
    } else {
      const newAlbum: GalleryAlbum = {
        id: 'album' + Date.now(), ...albumForm, media: [],
      };
      setGalleryAlbums((prev) => [newAlbum, ...prev]);
    }
    setAlbumModalOpen(false);
  };

  const deleteAlbum = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الألبوم بكامل محتوياته؟')) {
      setGalleryAlbums((prev) => prev.filter((a) => a.id !== id));
      if (selectedAlbumId === id) setSelectedAlbumId(null);
    }
  };

  // === Category CRUD ===
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ label: '' });
    setCategoryModalOpen(true);
  };

  const openEditCategory = (cat: GalleryCategory) => {
    setEditingCategory(cat);
    setCategoryForm({ label: cat.label });
    setCategoryModalOpen(true);
  };

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.label.trim()) return;
    if (editingCategory) {
      setGalleryCategories((prev) => prev.map((c) => c.id === editingCategory.id ? { ...c, ...categoryForm } : c));
    } else {
      const newCat: GalleryCategory = { id: 'cat' + Date.now(), label: categoryForm.label };
      setGalleryCategories((prev) => [...prev, newCat]);
    }
    setCategoryModalOpen(false);
  };

  const deleteCategory = (id: string) => {
    const albumsInCat = galleryAlbums.filter((a) => a.categoryId === id);
    if (albumsInCat.length > 0) {
      alert('لا يمكن حذف هذا التصنيف لأنه يحتوي على ألبومات. يرجى نقل أو حذف الألبومات أولاً.');
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      setGalleryCategories((prev) => prev.filter((c) => c.id !== id));
      if (filter === id) setFilter('all');
    }
  };

  // === Media CRUD ===
  const openAddMedia = () => {
    setMediaForm({ type: 'photo', url: '', thumbnail: '', caption: '' });
    setMediaModalOpen(true);
  };

  const saveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaForm.url.trim() || !selectedAlbumId) return;
    const newMedia: GalleryMedia = {
      id: 'media' + Date.now(),
      type: mediaForm.type,
      url: mediaForm.url,
      thumbnail: mediaForm.thumbnail || undefined,
      caption: mediaForm.caption || undefined,
    };
    setGalleryAlbums((prev) => prev.map((a) => {
      if (a.id !== selectedAlbumId) return a;
      const media = [...a.media, newMedia];
      return {
        ...a,
        media,
        photoCount: newMedia.type === 'photo' ? a.photoCount + 1 : a.photoCount,
        videoCount: newMedia.type === 'video' ? a.videoCount + 1 : a.videoCount,
      };
    }));
    setMediaModalOpen(false);
  };

  const deleteMedia = (mediaId: string) => {
    if (!selectedAlbum) return;
    if (confirm('هل أنت متأكد من حذف هذه الوسائط؟')) {
      setGalleryAlbums((prev) => prev.map((a) => {
        if (a.id !== selectedAlbum.id) return a;
        const media = a.media.find((m) => m.id === mediaId);
        if (!media) return a;
        return {
          ...a,
          media: a.media.filter((m) => m.id !== mediaId),
          photoCount: media.type === 'photo' ? a.photoCount - 1 : a.photoCount,
          videoCount: media.type === 'video' ? a.videoCount - 1 : a.videoCount,
        };
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-gray-50 pt-20 lg:pt-24">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-l from-navy-900 to-navy-950 py-16">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container-app relative">
          <div className="flex items-center gap-3 text-gold-400">
            <Images className="h-6 w-6" />
            <span className="text-sm font-bold tracking-wide">معرض الصور والذاكرة</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">لحظات من تاريخ الاتحاد</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">
            أرشيف بصري يحفظ ذكريات أنشطتنا وفعالياتنا المختلفة، من المباريات الرياضية إلى الرحلات والمؤتمرات الأكاديمية والأمسيات الاحتفالية.
          </p>
        </div>
      </div>

      <div className="container-app py-10">
        {/* Filter tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
            <Filter className="h-4 w-4" />
            تصفية:
          </div>
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              filter === 'all'
                ? 'bg-navy-800 text-white shadow-lg'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Images className="h-4 w-4" />
            الكل
          </button>
          {galleryCategories.map((cat) => (
            <div key={cat.id} className="group relative">
              <button
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  filter === cat.id
                    ? 'bg-navy-800 text-white shadow-lg'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Images className="h-4 w-4" />
                {cat.label}
              </button>
              {isPresidentOrMedia && (
                <div className="absolute -top-2 -left-2 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditCategory(cat); }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-navy-700 shadow ring-1 ring-gray-200 hover:bg-navy-50"
                    title="تعديل التصنيف"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-rose-600 shadow ring-1 ring-gray-200 hover:bg-rose-50"
                    title="حذف التصنيف"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {isPresidentOrMedia && (
            <button
              onClick={openAddCategory}
              className="flex items-center gap-1.5 rounded-xl border border-dashed border-navy-300 px-3 py-2 text-xs font-bold text-navy-600 transition-colors hover:bg-navy-50"
            >
              <Plus className="h-3.5 w-3.5" /> إضافة تصنيف
            </button>
          )}
        </div>

        {/* Albums grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((album) => (
            <div
              key={album.id}
              onClick={() => setSelectedAlbumId(album.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {isPresidentOrMedia && (
                <div className="absolute left-3 top-3 z-20 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditAlbum(album); }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy-700 shadow backdrop-blur-sm hover:bg-white"
                    title="تعديل الألبوم"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteAlbum(album.id); }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow backdrop-blur-sm hover:bg-white"
                    title="حذف الألبوم"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {album.videoCount > 0 && (
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    <Play className="h-3 w-3" />
                    {album.videoCount} فيديو
                  </div>
                )}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  <Camera className="h-3 w-3" />
                  {album.photoCount} صورة
                </div>
                <div className="absolute bottom-0 right-0 left-0 p-4">
                  <h3 className="text-lg font-bold text-white drop-shadow-lg">{album.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(album.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {album.location}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{album.description}</p>
              </div>
            </div>
          ))}
        </div>

        {isPresidentOrMedia && (
          <button
            onClick={openAddAlbum}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-navy-200 px-4 py-4 text-sm font-bold text-navy-600 transition-colors hover:border-navy-300 hover:bg-navy-50"
          >
            <Plus className="h-5 w-5" /> إضافة ألبوم جديد
          </button>
        )}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">لا توجد ألبومات في هذا التصنيف بعد.</div>
        )}
      </div>

      {/* Album detail modal */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedAlbumId(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAlbumId(null)}
              className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-video overflow-hidden rounded-t-2xl">
              <img src={selectedAlbum.coverImage} alt={selectedAlbum.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-6">
                <h2 className="text-2xl font-extrabold text-white drop-shadow-lg">{selectedAlbum.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-200">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedAlbum.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedAlbum.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed text-gray-600">{selectedAlbum.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-navy-50 px-4 py-2 text-sm font-bold text-navy-700">
                  <Camera className="h-4 w-4" />
                  {selectedAlbum.photoCount} صورة
                </div>
                {selectedAlbum.videoCount > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
                    <Video className="h-4 w-4" />
                    {selectedAlbum.videoCount} فيديو
                  </div>
                )}
                {isPresidentOrMedia && (
                  <button
                    onClick={openAddMedia}
                    className="mr-auto inline-flex items-center gap-1.5 rounded-xl bg-navy-700 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800"
                  >
                    <Plus className="h-4 w-4" /> إضافة صور/فيديوهات
                  </button>
                )}
              </div>

              {/* Media grid */}
              {selectedAlbum.media.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {selectedAlbum.media.map((m) => (
                    <div key={m.id} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                      {m.type === 'photo' ? (
                        <img
                          src={m.url}
                          alt={m.caption ?? ''}
                          onClick={() => setLightboxMedia(m)}
                          className="h-full w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div
                          onClick={() => setLightboxMedia(m)}
                          className="relative h-full w-full cursor-pointer"
                        >
                          <img src={m.thumbnail ?? m.url} alt={m.caption ?? ''} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                              <Play className="h-6 w-6 text-navy-800" />
                            </div>
                          </div>
                        </div>
                      )}
                      {m.caption && (
                        <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-xs text-white">{m.caption}</p>
                        </div>
                      )}
                      {isPresidentOrMedia && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMedia(m.id); }}
                          className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-rose-600 opacity-0 shadow transition-opacity group-hover:opacity-100 hover:bg-white"
                          title="حذف"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 py-8 text-center text-sm text-gray-400">لا توجد وسائط في هذا الألبوم بعد.</div>
              )}
              <p className="mt-4 text-center text-xs text-gray-400">اضغط على الصور لعرضها بالحجم الكامل</p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxMedia && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxMedia(null)}
        >
          <button
            onClick={() => setLightboxMedia(null)}
            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          {lightboxMedia.type === 'photo' ? (
            <img
              src={lightboxMedia.url}
              alt={lightboxMedia.caption ?? ''}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  src={lightboxMedia.url}
                  className="h-full w-full"
                  title={lightboxMedia.caption ?? 'video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Album Modal */}
      <Modal open={albumModalOpen} onClose={() => setAlbumModalOpen(false)} title={editingAlbum ? 'تعديل الألبوم' : 'إضافة ألبوم جديد'} maxWidth="max-w-lg">
        <form onSubmit={saveAlbum} className="space-y-4">
          <div>
            <label className="label-field">عنوان الألبوم *</label>
            <input className="input-field" value={albumForm.title} onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">التصنيف *</label>
              <select
                className="input-field"
                value={albumForm.categoryId}
                onChange={(e) => setAlbumForm({ ...albumForm, categoryId: e.target.value })}
              >
                <option value="">اختر تصنيفًا</option>
                {galleryCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">التاريخ</label>
              <input type="date" className="input-field" value={albumForm.date} onChange={(e) => setAlbumForm({ ...albumForm, date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label-field">المكان</label>
            <input className="input-field" value={albumForm.location} onChange={(e) => setAlbumForm({ ...albumForm, location: e.target.value })} />
          </div>
          <div>
            <label className="label-field">رابط صورة الغلاف</label>
            <input className="input-field" dir="ltr" placeholder="https://..." value={albumForm.coverImage} onChange={(e) => setAlbumForm({ ...albumForm, coverImage: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">عدد الصور</label>
              <input type="number" min="0" className="input-field" value={albumForm.photoCount} onChange={(e) => setAlbumForm({ ...albumForm, photoCount: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="label-field">عدد الفيديوهات</label>
              <input type="number" min="0" className="input-field" value={albumForm.videoCount} onChange={(e) => setAlbumForm({ ...albumForm, videoCount: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div>
            <label className="label-field">الوصف</label>
            <textarea rows={2} className="input-field resize-none" value={albumForm.description} onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })} />
          </div>
          {albumForm.coverImage && (
            <div className="overflow-hidden rounded-xl">
              <img src={albumForm.coverImage} alt="معاينة الغلاف" className="aspect-video w-full object-cover" />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setAlbumModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> حفظ
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} title={editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'} maxWidth="max-w-sm">
        <form onSubmit={saveCategory} className="space-y-4">
          <div>
            <label className="label-field">اسم التصنيف *</label>
            <input className="input-field" value={categoryForm.label} onChange={(e) => setCategoryForm({ label: e.target.value })} placeholder="مثال: الأنشطة الرياضية" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setCategoryModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> حفظ
            </button>
          </div>
        </form>
      </Modal>

      {/* Media Modal */}
      <Modal open={mediaModalOpen} onClose={() => setMediaModalOpen(false)} title="إضافة صور/فيديوهات للألبوم" maxWidth="max-w-md">
        <form onSubmit={saveMedia} className="space-y-4">
          <div>
            <label className="label-field">نوع الوسائط</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMediaForm({ ...mediaForm, type: 'photo' })}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-colors ${
                  mediaForm.type === 'photo' ? 'border-navy-600 bg-navy-50 text-navy-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ImageIcon className="h-4 w-4" /> صورة
              </button>
              <button
                type="button"
                onClick={() => setMediaForm({ ...mediaForm, type: 'video' })}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-colors ${
                  mediaForm.type === 'video' ? 'border-navy-600 bg-navy-50 text-navy-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Film className="h-4 w-4" /> فيديو
              </button>
            </div>
          </div>
          <div>
            <label className="label-field">رابط الوسائط *</label>
            <input
              className="input-field"
              dir="ltr"
              placeholder={mediaForm.type === 'photo' ? 'https://images.pexels.com/...' : 'https://www.youtube.com/embed/...'}
              value={mediaForm.url}
              onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
            />
          </div>
          {mediaForm.type === 'video' && (
            <div>
              <label className="label-field">رابط صورة مصغّرة (اختياري)</label>
              <input className="input-field" dir="ltr" placeholder="https://..." value={mediaForm.thumbnail} onChange={(e) => setMediaForm({ ...mediaForm, thumbnail: e.target.value })} />
            </div>
          )}
          <div>
            <label className="label-field">تعليق / وصف (اختياري)</label>
            <input className="input-field" value={mediaForm.caption} onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })} />
          </div>
          {mediaForm.url && mediaForm.type === 'photo' && (
            <div className="overflow-hidden rounded-xl">
              <img src={mediaForm.url} alt="معاينة" className="aspect-video w-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            <LinkIcon className="h-4 w-4 shrink-0" />
            <span>أدخل رابطًا مباشرًا للصورة، أو رابط تضمين YouTube/Vimeo للفيديو.</span>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setMediaModalOpen(false)} className="btn-ghost">إلغاء</button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> إضافة
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

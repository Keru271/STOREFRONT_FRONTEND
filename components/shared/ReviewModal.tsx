'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  editingReviewId: string | null;
  isAuthenticated?: boolean;
  currentUser?: { name?: string; email?: string } | null;
  initialForm: {
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
    imageUrl?: string;
  };
  onSubmit: (form: {
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
    imageUrl?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  productName,
  editingReviewId,
  isAuthenticated = false,
  currentUser = null,
  initialForm,
  onSubmit,
  isSubmitting,
}: ReviewModalProps) {
  const [form, setForm] = useState(initialForm);
  const [hoverRating, setHoverRating] = useState(0);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm, isOpen]);

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div
          className="rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border space-y-4 animate-scaleIn"
          style={{
            backgroundColor: 'var(--sf-bg)',
            borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl">
            🔒
          </div>
          <h3 className="font-bold text-lg" style={{ color: 'var(--sf-text)' }}>
            Sign In to Post a Review
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Only logged-in customers are able to share verified reviews.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border text-xs font-semibold hover:opacity-80 transition cursor-pointer"
              style={{
                borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                color: 'var(--sf-text)',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                }
              }}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow hover:opacity-90 transition cursor-pointer"
              style={{ backgroundColor: 'var(--sf-primary)' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('You must be signed in to post a review.');
      return;
    }
    const resolvedName = currentUser?.name || form.userName || 'Verified Customer';
    const resolvedEmail = currentUser?.email || form.userEmail || '';

    await onSubmit({
      ...form,
      userName: resolvedName,
      userEmail: resolvedEmail,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="rounded-3xl max-w-lg w-full p-6 shadow-2xl border space-y-5 animate-scaleIn max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--sf-bg)',
          borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
        }}
      >
        <div
          className="flex items-center justify-between pb-3 border-b"
          style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
        >
          <div>
            <h3 className="font-bold text-base" style={{ color: 'var(--sf-text)' }}>
              {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            <p
              className="text-xs truncate max-w-xs"
              style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}
            >
              {productName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--sf-text) 8%, var(--sf-bg))',
              color: 'var(--sf-text)',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* If authenticated: display user badge automatically. If not authenticated: show Name & Email inputs */}
          {isAuthenticated && currentUser ? (
            <div
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sf-primary) 6%, var(--sf-bg))',
                borderColor: 'color-mix(in srgb, var(--sf-primary) 18%, transparent)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white"
                style={{ backgroundColor: 'var(--sf-primary)' }}
              >
                {(currentUser.name?.[0] || currentUser.email?.[0] || 'U').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold truncate" style={{ color: 'var(--sf-text)' }}>
                    {currentUser.name || 'Verified Customer'}
                  </span>
                  <span
                    className="px-1.5 py-0.2 rounded text-[10px] font-semibold"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--sf-primary) 12%, transparent)',
                      color: 'var(--sf-primary)',
                    }}
                  >
                    Logged in
                  </span>
                </div>
                <p className="text-[11px] truncate opacity-60" style={{ color: 'var(--sf-text)' }}>
                  {currentUser.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div>
                <label className="block font-semibold mb-1" style={{ color: 'var(--sf-text)' }}>
                  Your Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.userName}
                  onChange={(e) => setForm({ ...form, userName: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="sf-input w-full py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: 'var(--sf-text)' }}>
                  Your Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.userEmail}
                  onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
                  placeholder="priya@example.com"
                  className="sf-input w-full py-2 px-3 text-xs"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Required to identify your review for future edit and delete privileges.
                </span>
              </div>
            </div>
          )}

          {/* Star picker */}
          <div>
            <label className="block font-bold mb-1" style={{ color: 'var(--sf-text)' }}>
              Overall Rating *
            </label>
            <div className="flex items-center gap-1 text-2xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setForm({ ...form, rating: star })}
                  className="transition-transform hover:scale-125"
                  style={{
                    color:
                      star <= (hoverRating || form.rating)
                        ? 'var(--sf-accent, #f59e0b)'
                        : 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                  }}
                >
                  ★
                </button>
              ))}
              <span
                className="ml-2 text-xs font-bold"
                style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}
              >
                {form.rating} of 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1" style={{ color: 'var(--sf-text)' }}>
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Amazing quality & fast delivery!"
              className="sf-input w-full py-2.5 px-3 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" style={{ color: 'var(--sf-text)' }}>
              Detailed Feedback *
            </label>
            <textarea
              required
              rows={3}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="What did you like or dislike? How was the fit, material, or usability?"
              className="sf-input w-full py-2 px-3 text-xs"
            />
          </div>

          {/* Review Image Attachment */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="block font-semibold" style={{ color: 'var(--sf-text)' }}>
                Add Photo / Proof of Purchase (Optional)
              </label>
              <div className="flex gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2 py-0.5 rounded-lg font-medium transition ${
                    imageTab === 'upload'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2 py-0.5 rounded-lg font-medium transition ${
                    imageTab === 'url'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  URL Link
                </button>
              </div>
            </div>

            {form.imageUrl ? (
              <div className="relative group w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageUrl}
                  alt="Review upload preview"
                  className="w-24 h-24 object-cover rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs shadow hover:bg-rose-600 transition"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div>
                {imageTab === 'upload' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      className="hidden"
                      id="review-image-upload"
                      onChange={handleImageFileChange}
                    />
                    <label
                      htmlFor="review-image-upload"
                      className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-dashed cursor-pointer transition hover:border-indigo-400 dark:hover:border-indigo-600 text-center"
                      style={{
                        borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
                      }}
                    >
                      <span className="text-base">📸</span>
                      <span className="font-semibold text-xs" style={{ color: 'var(--sf-text)' }}>
                        Click to attach a photo
                      </span>
                      <span className="text-[10px] text-gray-400">(PNG, JPG, WEBP up to 5MB)</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={form.imageUrl || ''}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      className="sf-input flex-1 py-2 px-3 text-xs"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-3 border-t" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold transition hover:opacity-80"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sf-text) 8%, var(--sf-bg))',
                color: 'var(--sf-text)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl text-white font-bold shadow-lg transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--sf-primary)' }}
            >
              {isSubmitting ? 'Submitting…' : editingReviewId ? 'Save Changes' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

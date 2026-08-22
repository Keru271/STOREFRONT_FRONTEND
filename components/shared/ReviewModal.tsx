'use client';

import React, { useState } from 'react';

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  editingReviewId: string | null;
  initialForm: {
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
  };
  onSubmit: (form: {
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  productName,
  editingReviewId,
  initialForm,
  onSubmit,
  isSubmitting,
}: ReviewModalProps) {
  const [form, setForm] = useState(initialForm);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="rounded-3xl max-w-md w-full p-6 shadow-2xl border space-y-5 animate-scaleIn"
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
          {/* Star picker */}
          <div>
            <label className="block font-bold mb-1" style={{ color: 'var(--sf-text)' }}>
              Overall Rating
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
                {form.rating} of 5
              </span>
            </div>
          </div>

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
              className="sf-input w-full py-2.5 px-3 text-xs"
            />
          </div>

          {!editingReviewId && (
            <div>
              <label className="block font-semibold mb-1" style={{ color: 'var(--sf-text)' }}>
                Email (Optional)
              </label>
              <input
                type="email"
                value={form.userEmail}
                onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
                placeholder="priya@example.com"
                className="sf-input w-full py-2.5 px-3 text-xs"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1" style={{ color: 'var(--sf-text)' }}>
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Amazing quality!"
              className="sf-input w-full py-2.5 px-3 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" style={{ color: 'var(--sf-text)' }}>
              Review *
            </label>
            <textarea
              required
              rows={4}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Share your experience..."
              className="sf-input w-full py-2 px-3 text-xs"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold"
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

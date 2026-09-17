"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Star,
  Upload,
  Send,
} from "lucide-react";
import { StorefrontForm, FormField, submitStorefrontForm } from "@/lib/api/forms";

interface Props {
  form: StorefrontForm;
  className?: string;
}

export const StorefrontFormRenderer: React.FC<Props> = ({ form, className = "" }) => {
  const fields: FormField[] = form.fields || (form.fieldsJson ? JSON.parse(form.fieldsJson) : []);
  const settings = form.settings || (form.settingsJson ? JSON.parse(form.settingsJson) : {});
  const accentColor = settings.theme?.accentColor || "var(--color-primary, #3b82f6)";

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        initial[f.name || f.id] = f.defaultValue;
      } else if (f.type === "checkbox" && f.options && f.options.length > 0) {
        initial[f.name || f.id] = [];
      } else if (f.type === "checkbox") {
        initial[f.name || f.id] = false;
      } else if (f.type === "rating") {
        initial[f.name || f.id] = 0;
      } else {
        initial[f.name || f.id] = "";
      }
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState<Record<string, number>>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxMultiChange = (fieldName: string, optionValue: string, checked: boolean) => {
    setFormData((prev) => {
      const current = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      if (checked) {
        if (!current.includes(optionValue)) current.push(optionValue);
      } else {
        const idx = current.indexOf(optionValue);
        if (idx > -1) current.splice(idx, 1);
      }
      return { ...prev, [fieldName]: current };
    });
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const isFieldVisible = (field: FormField) => {
    if (!field.conditionalRule || !field.conditionalRule.fieldName) return true;
    const targetVal = formData[field.conditionalRule.fieldName];
    const op = field.conditionalRule.operator;
    const expected = field.conditionalRule.value;

    if (op === "filled") return Boolean(targetVal && targetVal !== "");
    if (op === "equals") return String(targetVal) === String(expected);
    if (op === "not_equals") return String(targetVal) !== String(expected);
    if (op === "contains") return String(targetVal).toLowerCase().includes(String(expected).toLowerCase());
    return true;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (!isFieldVisible(field)) return;
      if (field.type === "heading" || field.type === "divider" || field.type === "paragraph") return;

      const key = field.name || field.id;
      const val = formData[key];

      if (field.required) {
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0) ||
          (field.type === "checkbox" && !field.options?.length && val === false) ||
          (field.type === "rating" && val === 0)
        ) {
          newErrors[key] = `${field.label || "This field"} is required.`;
          return;
        }
      }

      if (val && field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(val))) {
          newErrors[key] = "Please enter a valid email address.";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await submitStorefrontForm(form.slug || form.id, {
        data: formData,
      });

      setSubmitted(true);
      setSubmissionId(res.submissionId || null);

      if (res.successType === "redirect" && res.redirectUrl) {
        setTimeout(() => {
          window.location.href = res.redirectUrl!;
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`p-8 sm:p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${className}`}>
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {settings.successType === "redirect" ? "Redirecting..." : "Thank You!"}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-md mx-auto">
          {settings.successMessage || "Your submission has been received."}
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({});
          }}
          className="px-5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {form.title}
        </h1>
        {form.description && (
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {form.description}
          </p>
        )}
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-4 gap-y-5">
          {fields.map((field) => {
            if (!isFieldVisible(field)) return null;

            const key = field.name || field.id;
            const error = errors[key];
            const colSpanClass =
              field.width === "half"
                ? "sm:col-span-3"
                : field.width === "third"
                ? "sm:col-span-2"
                : "sm:col-span-6";

            if (field.type === "heading") {
              return (
                <div key={field.id} className="sm:col-span-6 pt-4 pb-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                    {field.label}
                  </h3>
                  {field.description && (
                    <p className="text-xs text-slate-500 mt-1">{field.description}</p>
                  )}
                </div>
              );
            }

            if (field.type === "divider") {
              return (
                <div key={field.id} className="sm:col-span-6 py-2">
                  <hr className="border-slate-200 dark:border-slate-800" />
                </div>
              );
            }

            if (field.type === "paragraph") {
              return (
                <div key={field.id} className="sm:col-span-6 text-sm text-slate-600 dark:text-slate-400">
                  {field.label || field.description}
                </div>
              );
            }

            return (
              <div key={field.id} className={`${colSpanClass} flex flex-col space-y-1.5`}>
                <label
                  htmlFor={key}
                  className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  {field.label}
                  {field.required && <span className="text-rose-500 ml-1">*</span>}
                </label>

                {field.type === "text" && (
                  <input
                    id={key}
                    type="text"
                    placeholder={field.placeholder || ""}
                    value={formData[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {field.type === "email" && (
                  <input
                    id={key}
                    type="email"
                    placeholder={field.placeholder || "name@example.com"}
                    value={formData[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {field.type === "phone" && (
                  <input
                    id={key}
                    type="tel"
                    placeholder={field.placeholder || "+1 (555) 000-0000"}
                    value={formData[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {field.type === "number" && (
                  <input
                    id={key}
                    type="number"
                    placeholder={field.placeholder || "0"}
                    value={formData[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    id={key}
                    rows={4}
                    placeholder={field.placeholder || "Type here..."}
                    value={formData[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  />
                )}

                {field.type === "select" && (
                  <select
                    id={key}
                    value={formData[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{field.placeholder || "Select an option..."}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "radio" && (
                  <div className="space-y-2 pt-1">
                    {field.options?.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                      >
                        <input
                          type="radio"
                          name={key}
                          value={opt.value}
                          checked={formData[key] === opt.value}
                          onChange={() => handleInputChange(key, opt.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === "checkbox" && field.options && field.options.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {field.options.map((opt) => {
                      const isChecked =
                        Array.isArray(formData[key]) && formData[key].includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              handleCheckboxMultiChange(key, opt.value, e.target.checked)
                            }
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {field.type === "rating" && (
                  <div className="flex items-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const currentVal = formData[key] || 0;
                      const hovered = hoverRating[key] || 0;
                      const isFilled = hovered ? star <= hovered : star <= currentVal;

                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleInputChange(key, star)}
                          onMouseEnter={() =>
                            setHoverRating((prev) => ({ ...prev, [key]: star }))
                          }
                          onMouseLeave={() =>
                            setHoverRating((prev) => ({ ...prev, [key]: 0 }))
                          }
                          className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                {field.type === "date" && (
                  <input
                    id={key}
                    type="date"
                    value={formData[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:outline-none"
                  />
                )}

                {field.type === "file" && (
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
                    <Upload className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Upload File
                    </p>
                    <input
                      type="file"
                      id={key}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleInputChange(key, file.name);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={key}
                      className="inline-block mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      {formData[key] ? `Selected: ${formData[key]}` : "Choose File"}
                    </label>
                  </div>
                )}

                {field.description && (
                  <p className="text-xs text-slate-500 mt-0.5">{field.description}</p>
                )}

                {error && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            style={{ backgroundColor: accentColor }}
            className="w-full py-3.5 px-6 text-white font-semibold rounded-xl shadow-md hover:opacity-90 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{settings.submittingButtonText || "Submitting..."}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{settings.submitButtonText || "Submit"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

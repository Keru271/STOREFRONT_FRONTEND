import { apiClient } from './client';

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  description?: string;
  name: string;
  required: boolean;
  defaultValue?: any;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  width?: "full" | "half" | "third";
  conditionalRule?: {
    fieldName: string;
    operator: "equals" | "not_equals" | "contains" | "filled";
    value?: string;
  };
}

export interface FormSettings {
  submitButtonText: string;
  submittingButtonText?: string;
  successType: "message" | "redirect";
  successMessage: string;
  redirectUrl?: string;
  emailNotifications?: boolean;
  theme?: {
    accentColor: string;
    borderRadius?: "none" | "sm" | "md" | "lg" | "full";
    cardStyle?: "bordered" | "elevated" | "flat" | "glass";
  };
  closedMessage?: string;
}

export interface StorefrontForm {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  status: string;
  category: string;
  fieldsJson: string;
  fields?: FormField[];
  settingsJson: string;
  settings?: FormSettings;
  createdAt: string;
}

function resolveFormsApiUrl(): string {
  const envSf = (process.env.NEXT_PUBLIC_STOREFRONT_API_URL || '').trim().replace(/\/+$/, '');
  const envCms = (process.env.NEXT_PUBLIC_CMS_API_URL || '').trim().replace(/\/+$/, '');

  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      if (envSf && !envSf.includes('localhost')) return envSf.endsWith('/api') ? envSf : `${envSf}/api`;
      if (envCms && !envCms.includes('localhost')) return envCms.endsWith('/api') ? envCms : `${envCms}/api`;
      return '/api';
    }
  }

  const base = envCms || envSf || 'http://localhost:5000/api';
  return base.endsWith('/api') ? base : `${base}/api`;
}

/**
 * Fetch a form by its slug or ID
 */
export async function getStorefrontForm(slugOrId: string): Promise<StorefrontForm | null> {
  const apiUrl = resolveFormsApiUrl();
  try {
    const res = await fetch(`${apiUrl}/forms/${slugOrId}`, {
      next: { revalidate: 60, tags: [`form-${slugOrId}`] },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch form: ${slugOrId}`, err);
    return null;
  }
}

/**
 * Submit form answers
 */
export async function submitStorefrontForm(
  slugOrId: string,
  payload: { data: Record<string, any>; submitterName?: string; submitterEmail?: string }
): Promise<{ message: string; submissionId?: string; successType?: string; redirectUrl?: string }> {
  const apiUrl = resolveFormsApiUrl();
  const res = await fetch(`${apiUrl}/forms/${slugOrId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit form');
  }
  return data;
}

// Form data persistence for guest users

const FORM_STORAGE_KEY = 'mailcraftus_form_draft';

export interface FormData {
  scenario: string;
  recipientRole: string;
  senderBackground: string;
  emailPurpose: string;
  tone: string;
  language: string;
}

export function saveFormData(data: FormData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
}

export function getFormData(): FormData | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(FORM_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as FormData;
  } catch {
    return null;
  }
}

export function clearFormData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FORM_STORAGE_KEY);
}

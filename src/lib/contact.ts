export const CONTACT_EMAIL = "dev@noeticompute.com";
export const LINKEDIN_URL = "https://www.linkedin.com/company/noetis-compute-lab";

export function mailTo(subject: string, body: string) {
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

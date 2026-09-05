import type { ChatGPTUser } from '@/app/chatgpt-auth';

function configuredAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: ChatGPTUser): boolean {
  const email = user.email.toLowerCase();
  if (configuredAdminEmails().includes(email)) return true;

  // Sites provides this account only in the local preview environment.
  return process.env.NODE_ENV !== 'production' && email.endsWith('@sites.test');
}

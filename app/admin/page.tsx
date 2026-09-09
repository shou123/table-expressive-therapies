/* oxlint-disable next/no-html-link-for-pages */
import { chatGPTSignOutPath, requireChatGPTUser } from '@/app/chatgpt-auth';
import { getAllContent } from '@/db/content';
import { isAdminUser } from '@/lib/admin-auth';
import AdminEditor from './admin-editor';
import './admin.css';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireChatGPTUser('/admin');

  if (!isAdminUser(user)) {
    return (
      <main className="admin-shell admin-access">
        <p className="admin-kicker">TABLE · ADMIN</p>
        <h1>This account does not have editing access.</h1>
        <p>Add <strong>{user.email}</strong> to <code>ADMIN_EMAILS</code>, then sign in again.</p>
        <div className="admin-access-actions">
          <a href="/">Return to website</a>
          <a href={chatGPTSignOutPath('/admin')}>Sign out</a>
        </div>
      </main>
    );
  }

  const rows = await getAllContent();
  return <AdminEditor user={user} initialRows={rows} signOutPath={chatGPTSignOutPath('/')} />;
}

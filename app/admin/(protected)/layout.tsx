import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminNav from '../AdminNav';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }

  return (
    <div style={styles.shell}>
      <AdminNav />
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: '100vh',
    backgroundColor: '#1a0f0a',
    fontFamily: "'Georgia', serif",
    color: '#F5F0E8',
  },
  main: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1rem 4rem',
  },
};

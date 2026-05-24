import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';
import { Toaster } from '@/components/ui/sonner';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects; defensive double-check.
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen flex bg-muted/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header email={user.email ?? ''} />
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

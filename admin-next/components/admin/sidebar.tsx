'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/', label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/journal', label: '비즈니스 저널', icon: BookOpen },
  { href: '/products', label: '제품', icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 border-r bg-background flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="font-semibold tracking-tight">Sangci CMS</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 text-xs text-muted-foreground border-t">
        <a
          href="https://b2b.sangcicompany.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          ↗ 사이트 보기
        </a>
      </div>
    </aside>
  );
}

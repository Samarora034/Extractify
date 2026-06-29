'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '◆' },
  { href: '/dashboard/extract', label: 'Extract', icon: '⬡' },
  { href: '/dashboard/history', label: 'History', icon: '◎' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '△' },
  { href: '/dashboard/settings', label: 'Settings', icon: '◈' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-[#0a0a0a]/80 backdrop-blur-2xl border-r border-white/[0.04] flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/[0.04]">
        <h1 className="text-base font-bold text-gradient tracking-wide">EXTRACTIFY</h1>
        <p className="text-[9px] text-gray-700 mt-1 uppercase tracking-widest">SGLang Engine</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link key={l.href} href={l.href} className="relative block" data-cursor>
              {active && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-white/[0.04] border border-white/[0.06] rounded-lg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
              )}
              <span className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <span className={`text-xs transition-transform duration-200 ${active ? 'scale-110' : ''}`}>{l.icon}</span>
                <span className="tracking-wide">{l.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/[0.04]">
        <p className="text-[10px] text-gray-700 truncate mb-2 tracking-wide">{session?.user?.email}</p>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-[10px] text-gray-600 hover:text-red-400 transition-colors uppercase tracking-wider" data-cursor>
          Logout →
        </button>
      </div>
    </aside>
  );
}

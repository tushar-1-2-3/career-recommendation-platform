import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen app-bg grain lg:flex">
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">
        <Sidebar />
      </div>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <div>
          <p className="font-display text-lg font-semibold text-ink">PathFinder</p>
          <p className="text-xs text-mist">Career guidance studio</p>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-md border border-cream bg-ink px-3 py-2 text-sm font-semibold text-paper shadow-card transition hover:bg-slate"
          aria-label="Open navigation"
        >
          Menu
        </button>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
          <div className="relative h-full">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import type { ReactNode } from 'react';
import '../../styles/global.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <main className="app-content">{children}</main>
    </div>
  );
}

import React from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';
import '../../styles/global.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">{children}</main>
    </div>
  );
}

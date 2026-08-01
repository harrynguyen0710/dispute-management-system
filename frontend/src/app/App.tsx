import React from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Dashboard } from '../features/dashboard/Dashboard';

export default function App() {
  return (
    <AppShell>
      <section className="hero" style={{ marginBottom: '24px' }}>
        <span className="eyebrow">Cases Explorer</span>
        <h1>Cases Management</h1>
      </section>

      <Dashboard />
    </AppShell>
  );
}

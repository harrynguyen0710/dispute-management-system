import React from 'react';
import { AppShell } from '../components/layout/AppShell';

export default function App() {

  return (
    <AppShell>
      <section className="hero">
        <span className="eyebrow">Frontend starter</span>
        <h1>FraudSystem Frontend</h1>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Components</h2>
          <p>Shared UI pieces live in <code>src/components</code>.</p>
        </article>
        <article className="card">
          <h2>Features</h2>
          <p>Feature-specific code stays isolated in <code>src/features</code>.</p>
        </article>
        <article className="card">
          <h2>Services</h2>
          <p>API calls and client setup go in <code>src/services</code>.</p>
        </article>
      </section>
    </AppShell>
  );
}
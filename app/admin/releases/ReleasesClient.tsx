'use client';

import { useState } from 'react';
import type { Release } from '@/lib/db';
import { s, inputStyle, selectStyle, btnStyle, dangerBtnStyle, secondaryBtnStyle } from '../adminStyles';

interface Props {
  releases: Release[];
  addRelease: (fd: FormData) => Promise<void>;
  updateRelease: (fd: FormData) => Promise<void>;
  deleteRelease: (fd: FormData) => Promise<void>;
}

const RELEASE_TYPES = ['Album', 'Special', 'Album & Special'];

export default function ReleasesClient({ releases, addRelease, updateRelease, deleteRelease }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await addRelease(new FormData(e.currentTarget));
    (e.currentTarget as HTMLFormElement).reset();
    setSubmitting(false);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await updateRelease(new FormData(e.currentTarget));
    setEditingId(null);
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this release? This cannot be undone.')) return;
    const fd = new FormData();
    fd.append('id', id);
    await deleteRelease(fd);
  }

  return (
    <div>
      <h1 style={s.pageTitle}>Releases</h1>

      {/* ── Add Release Form ── */}
      <section style={s.card}>
        <h2 style={s.sectionTitle}>Add New Release</h2>
        <ReleaseForm onSubmit={handleAdd} submitting={submitting} submitLabel="+ Add Release" />
      </section>

      {/* ── Releases List ── */}
      <section style={s.card}>
        <h2 style={s.sectionTitle}>Current Releases ({releases.length})</h2>
        {releases.length === 0 ? (
          <p style={s.empty}>No releases yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {releases.map((release) =>
              editingId === release.id ? (
                <div key={release.id} style={s.editCard}>
                  <ReleaseForm
                    defaultValues={release}
                    releaseId={release.id}
                    onSubmit={handleUpdate}
                    submitting={submitting}
                    submitLabel="Save Changes"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div key={release.id} style={s.releaseRow}>
                  <div style={s.releaseInfo}>
                    <strong style={{ color: '#F5F0E8' }}>{release.title}</strong>
                    <span style={s.releaseMeta}>{release.year} · {release.type}</span>
                    <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {release.youtubeUrl && <PlatformBadge label="YouTube" href={release.youtubeUrl} />}
                      {release.spotifyUrl && <PlatformBadge label="Spotify" href={release.spotifyUrl} />}
                      {release.appleMusicUrl && <PlatformBadge label="Apple Music" href={release.appleMusicUrl} />}
                      {release.amazonMusicUrl && <PlatformBadge label="Amazon" href={release.amazonMusicUrl} />}
                      {release.youtubeMusicUrl && <PlatformBadge label="YT Music" href={release.youtubeMusicUrl} />}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button onClick={() => setEditingId(release.id)} style={secondaryBtnStyle}>Edit</button>
                    <button onClick={() => handleDelete(release.id)} style={dangerBtnStyle}>Delete</button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function ReleaseForm({
  defaultValues,
  releaseId,
  onSubmit,
  submitting,
  submitLabel,
  onCancel,
}: {
  defaultValues?: Release;
  releaseId?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  submitting: boolean;
  submitLabel: string;
  onCancel?: () => void;
}) {
  return (
    <form onSubmit={onSubmit} style={s.formGrid}>
      {releaseId && <input type="hidden" name="id" value={releaseId} />}

      <div>
        <label style={s.label}>Title</label>
        <input name="title" placeholder="Reets" defaultValue={defaultValues?.title} required style={inputStyle} />
      </div>
      <div>
        <label style={s.label}>Year</label>
        <input name="year" placeholder="2024" defaultValue={defaultValues?.year} required style={inputStyle} />
      </div>
      <div>
        <label style={s.label}>Type</label>
        <select name="type" defaultValue={defaultValues?.type ?? 'Album'} style={selectStyle}>
          {RELEASE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={s.label}>YouTube URL</label>
        <input name="youtubeUrl" placeholder="https://youtube.com/watch?v=…" defaultValue={defaultValues?.youtubeUrl ?? ''} style={inputStyle} />
      </div>
      <div>
        <label style={s.label}>Spotify URL</label>
        <input name="spotifyUrl" placeholder="https://open.spotify.com/album/…" defaultValue={defaultValues?.spotifyUrl ?? ''} style={inputStyle} />
      </div>
      <div>
        <label style={s.label}>Apple Music URL</label>
        <input name="appleMusicUrl" placeholder="https://music.apple.com/…" defaultValue={defaultValues?.appleMusicUrl ?? ''} style={inputStyle} />
      </div>
      <div>
        <label style={s.label}>Amazon Music URL</label>
        <input name="amazonMusicUrl" placeholder="https://music.amazon.com/…" defaultValue={defaultValues?.amazonMusicUrl ?? ''} style={inputStyle} />
      </div>
      <div>
        <label style={s.label}>YouTube Music URL</label>
        <input name="youtubeMusicUrl" placeholder="https://music.youtube.com/…" defaultValue={defaultValues?.youtubeMusicUrl ?? ''} style={inputStyle} />
      </div>

      <div style={{ ...s.formActions, gridColumn: '1 / -1' }}>
        <button type="submit" disabled={submitting} style={btnStyle}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={secondaryBtnStyle}>Cancel</button>
        )}
      </div>
    </form>
  );
}

function PlatformBadge({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      padding: '0.2rem 0.5rem',
      backgroundColor: 'rgba(232,101,26,0.15)',
      border: '1px solid rgba(232,101,26,0.3)',
      borderRadius: '3px',
      color: '#E8651A',
      fontSize: '0.75rem',
      textDecoration: 'none',
      fontWeight: 600,
    }}>
      {label}
    </a>
  );
}

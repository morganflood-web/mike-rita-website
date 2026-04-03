'use client';

import { useState } from 'react';
import type { Release } from '@/lib/db';
import { s, inputStyle, selectStyle, btnStyle, dangerBtnStyle, secondaryBtnStyle } from '../../adminStyles';

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
  const [addFormKey, setAddFormKey] = useState(0);

  async function handleAdd(fd: FormData) {
    setSubmitting(true);
    await addRelease(fd);
    setAddFormKey((k) => k + 1);
    setSubmitting(false);
  }

  async function handleUpdate(fd: FormData) {
    setSubmitting(true);
    await updateRelease(fd);
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

      <section style={s.card}>
        <h2 style={s.sectionTitle}>Add New Release</h2>
        <ReleaseForm
          key={addFormKey}
          onSubmit={handleAdd}
          submitting={submitting}
          submitLabel="+ Add Release"
        />
      </section>

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
                    <strong style={{ color: '#F5F0E8' }}>
                      <span style={{ color: '#B8A898', fontWeight: 600, marginRight: '0.5rem' }}>#{release.sortOrder}</span>
                      {release.title}
                    </strong>
                    <span style={s.releaseMeta}>{release.year} · {release.type}</span>
                    <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {release.youtubeUrl && <PlatformBadge label="YouTube" href={release.youtubeUrl} />}
                      {release.spotifyUrl && <PlatformBadge label="Spotify" href={release.spotifyUrl} />}
                      {release.appleMusicUrl && <PlatformBadge label="Apple Music" href={release.appleMusicUrl} />}
                      {release.amazonMusicUrl && <PlatformBadge label="Amazon" href={release.amazonMusicUrl} />}
                      {release.youtubeMusicUrl && <PlatformBadge label="YT Music" href={release.youtubeMusicUrl} />}
                      {release.customLinks?.map((l) => (
                        <PlatformBadge key={l.url + l.label} label={l.label} href={l.url} />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button type="button" onClick={() => setEditingId(release.id)} style={secondaryBtnStyle}>Edit</button>
                    <button type="button" onClick={() => handleDelete(release.id)} style={dangerBtnStyle}>Delete</button>
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
  onSubmit: (fd: FormData) => Promise<void>;
  submitting: boolean;
  submitLabel: string;
  onCancel?: () => void;
}) {
  const [customLinks, setCustomLinks] = useState<{ label: string; url: string }[]>(() =>
    defaultValues?.customLinks?.length ? defaultValues.customLinks.map((l) => ({ ...l })) : []
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('customLinks', JSON.stringify(customLinks));
    await onSubmit(fd);
  }

  return (
    <form onSubmit={handleSubmit} style={s.formGrid}>
      {releaseId && <input type="hidden" name="id" value={releaseId} />}

      <div>
        <label style={s.label}>Order</label>
        <input
          type="number"
          name="sortOrder"
          min={0}
          step={1}
          defaultValue={defaultValues?.sortOrder ?? 0}
          required
          style={inputStyle}
        />
      </div>
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

      <div>
        <label style={s.label}>Album Art Filename</label>
        <input
          name="albumArt"
          placeholder="reets-album-art.jpg"
          defaultValue={defaultValues?.albumArt ?? ''}
          style={inputStyle}
        />
      </div>
      <div>
        <label style={s.label}>Hero Image Filename</label>
        <input
          name="heroImage"
          placeholder="reets-hero.jpg"
          defaultValue={defaultValues?.heroImage ?? ''}
          style={inputStyle}
        />
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

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={s.label}>Additional Links</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {customLinks.map((row, i) => (
            <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <input
                value={row.label}
                onChange={(e) => {
                  const v = e.target.value;
                  setCustomLinks((cl) => cl.map((r, j) => (j === i ? { ...r, label: v } : r)));
                }}
                placeholder="Label"
                style={{ ...inputStyle, flex: '1 1 120px' }}
              />
              <input
                value={row.url}
                onChange={(e) => {
                  const v = e.target.value;
                  setCustomLinks((cl) => cl.map((r, j) => (j === i ? { ...r, url: v } : r)));
                }}
                placeholder="https://…"
                style={{ ...inputStyle, flex: '2 1 200px' }}
              />
              <button
                type="button"
                onClick={() => setCustomLinks((cl) => cl.filter((_, j) => j !== i))}
                style={dangerBtnStyle}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCustomLinks((cl) => [...cl, { label: '', url: '' }])}
            style={secondaryBtnStyle}
          >
            Add Link
          </button>
        </div>
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

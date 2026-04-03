'use client';

import { useState } from 'react';
import type { Bio, Award } from '@/lib/db';
import { s, inputStyle, btnStyle, dangerBtnStyle } from '../../adminStyles';

interface Props {
  bio: Bio;
  awards: Award[];
  updateBio: (fd: FormData) => Promise<void>;
}

export default function BioClient({ bio, awards, updateBio }: Props) {
  const [bioText, setBioText] = useState(bio.text);
  const [awardRows, setAwardRows] = useState<{ id: string; text: string }[]>(
    awards.map((a) => ({ id: a.id, text: a.text }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  function addAward() {
    setAwardRows((prev) => [...prev, { id: `new_${Date.now()}`, text: '' }]);
  }

  function removeAward(idx: number) {
    setAwardRows((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateAward(idx: number, value: string) {
    setAwardRows((prev) => prev.map((row, i) => (i === idx ? { ...row, text: value } : row)));
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);

    const fd = new FormData();
    fd.append('text', bioText);
    awardRows.forEach((row, i) => {
      fd.append(`award_${i}`, row.text);
      fd.append(`awardId_${i}`, row.id);
    });

    await updateBio(fd);
    setSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <h1 style={s.pageTitle}>Bio</h1>

      <form onSubmit={handleSave}>
        {/* ── Bio Text ── */}
        <section style={s.card}>
          <h2 style={s.sectionTitle}>Bio Text</h2>
          <textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            rows={12}
            style={{
              ...inputStyle,
              width: '100%',
              resize: 'vertical',
              lineHeight: 1.7,
              fontFamily: 'inherit',
            }}
          />
          <p style={s.hint}>Separate paragraphs with a blank line (\n\n).</p>
        </section>

        {/* ── Awards ── */}
        <section style={s.card}>
          <h2 style={s.sectionTitle}>Awards &amp; Achievements</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {awardRows.map((row, idx) => (
              <div key={row.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  value={row.text}
                  onChange={(e) => updateAward(idx, e.target.value)}
                  placeholder="2024 — Award name"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeAward(idx)}
                  style={{ ...dangerBtnStyle, padding: '0.5rem 0.65rem', flexShrink: 0 }}
                  title="Remove award"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addAward}
            style={{ marginTop: '0.75rem', ...btnStyle, backgroundColor: 'transparent', border: '1px dashed #E8651A', color: '#E8651A' }}
          >
            + Add Award
          </button>
        </section>

        {/* ── Save ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" disabled={submitting} style={{ ...btnStyle, padding: '0.75rem 2rem' }}>
            {submitting ? 'Saving…' : 'Save All'}
          </button>
          {saved && <span style={{ color: '#5cba7d', fontWeight: 600 }}>✓ Saved!</span>}
        </div>
      </form>
    </div>
  );
}

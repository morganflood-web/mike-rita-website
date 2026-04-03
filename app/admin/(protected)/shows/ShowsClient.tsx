'use client';

import { useState } from 'react';
import type { Show } from '@/lib/db';
import { displayDateToIso } from '@/lib/showDateFormat';
import { s, inputStyle, btnStyle, dangerBtnStyle, secondaryBtnStyle } from '../../adminStyles';

const dateInputStyle = { ...inputStyle, colorScheme: 'dark' as const };

interface Props {
  shows: Show[];
  addShow: (fd: FormData) => Promise<void>;
  updateShow: (fd: FormData) => Promise<void>;
  deleteShow: (fd: FormData) => Promise<void>;
}

export default function ShowsClient({ shows, addShow, updateShow, deleteShow }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [addDate, setAddDate] = useState('');
  const [addVenue, setAddVenue] = useState('');
  const [addCity, setAddCity] = useState('');
  const [addTicketUrl, setAddTicketUrl] = useState('');

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await addShow(new FormData(e.currentTarget));
    setAddDate('');
    setAddVenue('');
    setAddCity('');
    setAddTicketUrl('');
    (e.currentTarget as HTMLFormElement).reset();
    setSubmitting(false);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await updateShow(new FormData(e.currentTarget));
    setEditingId(null);
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this show? This cannot be undone.')) return;
    const fd = new FormData();
    fd.append('id', id);
    await deleteShow(fd);
  }

  return (
    <div>
      <h1 style={s.pageTitle}>Shows</h1>

      {/* ── Add Show Form ── */}
      <section style={s.card}>
        <h2 style={s.sectionTitle}>Add New Show</h2>
        <form onSubmit={handleAdd} style={s.formGrid}>
          <div>
            <label style={s.label}>Date</label>
            <input
              type="date"
              name="date"
              value={addDate}
              onChange={(e) => setAddDate(e.target.value)}
              required
              style={dateInputStyle}
            />
          </div>
          <div>
            <label style={s.label}>Venue</label>
            <input
              type="text"
              name="venue"
              value={addVenue}
              onChange={(e) => setAddVenue(e.target.value)}
              placeholder="The Boardroom Comedy Club"
              autoComplete="off"
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={s.label}>City</label>
            <input
              type="text"
              name="city"
              value={addCity}
              onChange={(e) => setAddCity(e.target.value)}
              placeholder="Toronto, ON"
              autoComplete="off"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={s.label}>Ticket URL</label>
            <input
              type="text"
              name="ticketUrl"
              value={addTicketUrl}
              onChange={(e) => setAddTicketUrl(e.target.value)}
              placeholder="https://…"
              autoComplete="off"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="soldOut-add" name="soldOut" style={{ width: 16, height: 16 }} />
            <label htmlFor="soldOut-add" style={s.checkLabel}>Sold Out</label>
          </div>
          <div style={s.formActions}>
            <button type="submit" disabled={submitting} style={btnStyle}>
              {submitting ? 'Adding…' : '+ Add Show'}
            </button>
          </div>
        </form>
      </section>

      {/* ── Shows Table ── */}
      <section style={s.card}>
        <h2 style={s.sectionTitle}>Current Shows ({shows.length})</h2>
        {shows.length === 0 ? (
          <p style={s.empty}>No shows scheduled.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Date', 'Venue', 'City', 'Ticket URL', 'Sold Out', 'Actions'].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shows.map((show) =>
                  editingId === show.id ? (
                    <tr key={show.id} style={s.editRow}>
                      <td colSpan={6} style={{ padding: '1rem' }}>
                        <form onSubmit={handleUpdate} style={s.formGrid} key={`edit-${show.id}`}>
                          <input type="hidden" name="id" value={show.id} />
                          <div>
                            <label style={s.label}>Date</label>
                            <input
                              type="date"
                              name="date"
                              defaultValue={displayDateToIso(show.date)}
                              required
                              style={dateInputStyle}
                            />
                          </div>
                          <Field
                            label="Venue"
                            name="venue"
                            defaultValue={show.venue}
                            required
                            autoComplete="off"
                          />
                          <Field
                            label="City"
                            name="city"
                            defaultValue={show.city}
                            required
                            autoComplete="off"
                          />
                          <Field label="Ticket URL" name="ticketUrl" defaultValue={show.ticketUrl} required fullWidth autoComplete="off" />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="checkbox"
                              id={`soldOut-${show.id}`}
                              name="soldOut"
                              defaultChecked={show.soldOut}
                              style={{ width: 16, height: 16 }}
                            />
                            <label htmlFor={`soldOut-${show.id}`} style={s.checkLabel}>Sold Out</label>
                          </div>
                          <div style={s.formActions}>
                            <button type="submit" disabled={submitting} style={btnStyle}>
                              {submitting ? 'Saving…' : 'Save'}
                            </button>
                            <button type="button" onClick={() => setEditingId(null)} style={secondaryBtnStyle}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  ) : (
                    <tr key={show.id} style={s.tr}>
                      <td style={s.td}>{show.date}</td>
                      <td style={s.td}>{show.venue}</td>
                      <td style={s.td}>{show.city}</td>
                      <td style={{ ...s.td, maxWidth: '180px' }}>
                        <a href={show.ticketUrl} target="_blank" rel="noreferrer" style={s.link}>
                          {truncate(show.ticketUrl, 40)}
                        </a>
                      </td>
                      <td style={{ ...s.td, textAlign: 'center' }}>
                        {show.soldOut ? '✓' : '—'}
                      </td>
                      <td style={{ ...s.td, whiteSpace: 'nowrap' }}>
                        <button onClick={() => setEditingId(show.id)} style={secondaryBtnStyle}>
                          Edit
                        </button>{' '}
                        <button onClick={() => handleDelete(show.id)} style={dangerBtnStyle}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  defaultValue,
  required,
  fullWidth,
  autoComplete,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  fullWidth?: boolean;
  autoComplete?: string;
}) {
  return (
    <div style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
      <label style={s.label}>{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        autoComplete={autoComplete}
        style={inputStyle}
      />
    </div>
  );
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

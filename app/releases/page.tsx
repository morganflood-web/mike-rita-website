import { MailingListSection } from "@/components/MailingListSection";
import { SiteHeader } from "@/components/SiteHeader";
import { getReleases } from "@/lib/data";
import type { Release } from "@/lib/db";
import { allReleasePlatformLinks } from "@/lib/releasePlatforms";

export const dynamic = "force-dynamic";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const SOCIALS = {
  instagram: "https://www.instagram.com/ritathehuman/",
  facebook: "https://www.facebook.com/MikeRitaTheHuman",
  tiktok: "https://www.tiktok.com/@comedianmikerita",
  youtube: "https://www.youtube.com/c/MikeRita",
};

function albumArtSrc(r: Release): string {
  const f = r.albumArt?.trim();
  if (f) return `/images/${f}`;
  return "/images/reets-album-art.jpg";
}

function albumArtAlt(r: Release): string {
  return `Mike Rita — ${r.title} album art`;
}

// ─── ICONS ───────────────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ backgroundColor: "#1a0f0a", padding: "40px 32px", textAlign: "center", borderTop: "1px solid #3a2010" }}>
      <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginBottom: "16px" }}>
        <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#B8A898" }} aria-label="Instagram">
          <InstagramIcon />
        </a>
        <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" style={{ color: "#B8A898" }} aria-label="Facebook">
          <FacebookIcon />
        </a>
        <a href={SOCIALS.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: "#B8A898" }} aria-label="TikTok">
          <TikTokIcon />
        </a>
        <a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer" style={{ color: "#B8A898" }} aria-label="YouTube">
          <YouTubeIcon />
        </a>
      </div>
      <p style={{ color: "#B8A898", fontSize: "0.75rem", letterSpacing: "0.1em" }}>© 2026 Mike Rita</p>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function ReleasesPage() {
  const releases = await getReleases();

  return (
    <>
      <SiteHeader />
      <main style={{ backgroundColor: "#1a0f0a", minHeight: "80vh" }}>
        <div
          style={{
            padding: "60px 32px 32px",
            textAlign: "center",
            borderBottom: "1px solid #3a2010",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#E8651A",
              marginBottom: "12px",
            }}
          >
            Specials &amp; Albums
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#F5F0E8",
            }}
          >
            Releases
          </h1>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 32px 64px" }}>
          {releases.map((release, idx) => {
            const platforms = allReleasePlatformLinks(release);
            return (
              <div
                key={release.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "56px",
                  alignItems: "flex-start",
                  marginBottom: idx < releases.length - 1 ? "80px" : 0,
                  flexWrap: "wrap-reverse",
                  paddingBottom: idx < releases.length - 1 ? "80px" : 0,
                  borderBottom: idx < releases.length - 1 ? "1px solid #3a2010" : "none",
                }}
              >
                <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#B8A898",
                      margin: 0,
                    }}
                  >
                    {release.type} · {release.year}
                  </p>
                  <h2
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      margin: 0,
                      lineHeight: 1.05,
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#F5F0E8",
                    }}
                  >
                    {release.title}
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                    {platforms.map((btn) => (
                      <a
                        key={`${btn.label}-${btn.url}`}
                        href={btn.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="public-cta-link"
                        style={{
                          border: "1px solid #E8651A",
                          color: "#F5F0E8",
                          textAlign: "center",
                          padding: "10px 24px",
                          borderRadius: "999px",
                          fontSize: "0.85rem",
                          textDecoration: "none",
                          letterSpacing: "0.05em",
                          maxWidth: "320px",
                        }}
                      >
                        {btn.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div style={{ flex: "1 1 240px", maxWidth: "380px" }}>
                  <img
                    src={albumArtSrc(release)}
                    alt={albumArtAlt(release)}
                    style={{ width: "100%", borderRadius: "12px", display: "block" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <MailingListSection />
      <Footer />
    </>
  );
}

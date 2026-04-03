const MAILING_LIST_FORM_URL =
  "https://docs.google.com/forms/d/1vETkqHYm2x7gzqhngovlXTtxaFjjdYPklU3BjoR-oK8/edit";

export function MailingListSection() {
  return (
    <section style={{ backgroundColor: "#241408", padding: "64px 32px", textAlign: "center" }}>
      <p
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#E8651A",
          marginBottom: "12px",
          marginTop: 0,
        }}
      >
        Stay in the Loop
      </p>
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          marginBottom: "16px",
          fontFamily: "var(--font-playfair), Georgia, serif",
          color: "#F5F0E8",
        }}
      >
        Join the Mailing List
      </h2>
      <p style={{ color: "#B8A898", marginBottom: "32px", fontSize: "0.95rem" }}>
        Be the first to know about new shows, releases, and announcements.
      </p>
      <a
        href={MAILING_LIST_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#E8651A",
          color: "#1a0f0a",
          padding: "14px 40px",
          borderRadius: "999px",
          fontWeight: 700,
          fontSize: "0.85rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Sign Up
      </a>
    </section>
  );
}

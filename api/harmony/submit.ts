import nodemailer from "nodemailer";

function required(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function escapeHtml(s: string) {
  return (s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(req: any, res: any) {
  console.log("[Harmony] function hit:", req.method);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = req.body;

    if (!body?.email || typeof body.email !== "string") {
      return res.status(400).json({ error: "Missing email" });
    }

    // Confirm env vars exist (DON'T print values)
    const SMTP_HOST = required("SMTP_HOST", process.env.SMTP_HOST);
    const SMTP_PORT = Number(required("SMTP_PORT", process.env.SMTP_PORT));
    const SMTP_SECURE = (process.env.SMTP_SECURE ?? "true") === "true";
    const SMTP_USER = required("SMTP_USER", process.env.SMTP_USER);
    const SMTP_PASS = required("SMTP_PASS", process.env.SMTP_PASS);
    const HARMONY_TO = required("HARMONY_TO", process.env.HARMONY_TO);
    const HARMONY_FROM = required("HARMONY_FROM", process.env.HARMONY_FROM);

    console.log("[Harmony] env ok:", {
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      userSet: !!SMTP_USER,
      passSet: !!SMTP_PASS,
      to: HARMONY_TO,
      from: HARMONY_FROM,
    });

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    // This is a KEY diagnostic step:
    // If Zoho blocks the login, verify() will throw and we'll see why in logs.
    await transporter.verify();
    console.log("[Harmony] SMTP verify OK");

    const subject = `Harmony request — ${body.email}`;
    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; max-width:720px;">
        <h2 style="color:#2e2424;margin:0 0 8px;">New Harmony Request</h2>
        <p style="color:#6a5a5a;margin:0 0 16px;">Reply-to is set to the requester’s email.</p>
        <pre style="white-space:pre-wrap;background:#faf7f8;border:1px solid #eee;padding:12px;border-radius:12px;">${escapeHtml(
          JSON.stringify(body, null, 2)
        )}</pre>
        <div style="margin-top:14px;color:#6a5a5a;font-size:12px;">MoodDrop • Harmony</div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: HARMONY_FROM,
      to: HARMONY_TO,
      subject,
      html,
      replyTo: body.email,
    });

    console.log("[Harmony] sendMail OK:", info?.messageId || "(no messageId)");
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("[Harmony] submit failed:", err);

    // Return a helpful error message to the browser (safe summary)
    const msg =
      err?.response?.toString?.() ||
      err?.message ||
      "Unknown email error";

    return res.status(500).json({
      ok: false,
      error: "Email send failed",
      detail: msg,
    });
  }
}
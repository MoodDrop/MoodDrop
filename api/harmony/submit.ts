import { sendMail } from "../../server/lib/email";

export default async function handler(req: any, res: any) {
  // Allow preflight + JSON posts
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // ✅ Only allow POST for actual submit
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!body?.email || typeof body.email !== "string") {
      return res.status(400).json({ ok: false, error: "Missing email" });
    }

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; max-width: 720px;">
        <h2 style="color:#2e2424;margin:0 0 6px;">New Harmony Request</h2>
        <pre style="white-space:pre-wrap;background:#faf7f8;border:1px solid #eee;padding:12px;border-radius:12px;">
${JSON.stringify(body, null, 2)}
        </pre>
      </div>
    `;

    await sendMail({
      subject: `Harmony request — ${body.email}`,
      html,
      replyTo: body.email,
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("[Vercel Harmony] submit failed:", err);
    return res.status(500).json({ ok: false, error: err?.message || "Failed" });
  }
}
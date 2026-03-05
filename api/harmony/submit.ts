// api/harmony/submit.ts
import { sendMail } from "../../server/lib/email";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const body = req.body;

    if (!body?.email || typeof body.email !== "string") {
      return res.status(400).json({ ok: false, error: "Missing email" });
    }

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; max-width: 720px;">
        <h2 style="color:#2e2424;margin:0 0 6px;">New Harmony Request</h2>
        <div style="color:#6a5a5a;font-size:13px;margin-bottom:18px;">
          (Vercel) Reply-to is set to requester’s email.
        </div>
        <pre style="white-space:pre-wrap;background:#faf7f8;border:1px solid #eee;padding:12px;border-radius:12px;">
${JSON.stringify(body, null, 2)}
        </pre>
        <div style="margin-top:18px;color:#6a5a5a;font-size:12px;">
          MoodDrop • Harmony
        </div>
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
    return res.status(500).json({ ok: false, error: "Failed to submit" });
  }
}
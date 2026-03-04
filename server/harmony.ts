import type { Express, Request, Response } from "express";
import { sendMail } from "./lib/email";

type HarmonyPayload = {
  whoCategory: string;
  whoOther?: string;
  moment: string;

  qualities: string;
  memories: string;

  emotionalTone: string;
  soundStyle: string;

  voicePreference: string;
  includeName: "yes" | "no" | "";
  nameValue?: string;

  email: string;
};

function escapeHtml(s: string) {
  return (s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function line(label: string, value: string) {
  return `
    <div style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.08);">
      <div style="font-size:12px;color:#6a5a5a;margin-bottom:4px;">${escapeHtml(
        label
      )}</div>
      <div style="font-size:14px;color:#2e2424;white-space:pre-wrap;">${escapeHtml(
        value || "—"
      )}</div>
    </div>
  `;
}

function formatHarmonyEmail(p: HarmonyPayload) {
  const who =
    p.whoCategory === "Other" ? (p.whoOther ?? "").trim() : p.whoCategory;

  const nameIncluded =
    p.includeName === "yes" ? (p.nameValue ?? "").trim() || "Yes" : "No";

  return `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; max-width: 720px;">
      <h2 style="color:#2e2424;margin:0 0 6px;">New Harmony Request</h2>
      <div style="color:#6a5a5a;font-size:13px;margin-bottom:18px;">
        Reply-to is set to the requester’s email.
      </div>

      ${line("For", who || "—")}
      ${line("Moment", p.moment)}
      ${line("What feels most true", p.qualities)}
      ${line("Memories to weave in", p.memories)}
      ${line("Tone", p.emotionalTone)}
      ${line("Sound", p.soundStyle)}
      ${line("Voice preference", p.voicePreference)}
      ${line("Name included", nameIncluded)}
      ${line("Requester email", p.email)}

      <div style="margin-top:18px;color:#6a5a5a;font-size:12px;">
        MoodDrop • Harmony
      </div>
    </div>
  `;
}

export function registerHarmonyRoutes(app: Express) {
  app.post("/api/harmony/submit", async (req: Request, res: Response) => {

  console.log("[Harmony] ✅ /api/harmony/submit HIT");

  try {
      console.log("[Harmony] submission received");
      

      const body = req.body as HarmonyPayload;

      if (!body?.email || typeof body.email !== "string") {
        console.log("[Harmony] missing email");
        return res.status(400).json({ ok: false, error: "Missing email" });
      }

      const subject = `Harmony request — ${body.email}`;
      const html = formatHarmonyEmail(body);

      console.log("[Harmony] attempting to send email...");

      await sendMail({
        subject,
        html,
        replyTo: body.email,
      });

      console.log("[Harmony] email sent successfully ✅");

      return res.json({ ok: true });
    } catch (err: any) {
      console.error("[Harmony] email failed ❌", err);
      return res
        .status(500)
        .json({ ok: false, error: "Failed to submit Harmony request" });
    }
  });
}
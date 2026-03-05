import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const body = req.body;

    if (!body?.email) {
      return res.status(400).json({ error: "Missing email" });
    }

    console.log("Harmony request received:", body);

    // TEMP: just return success so we confirm the endpoint works
    return res.status(200).json({
      success: true,
      message: "Harmony request received",
    });

  } catch (error) {
    console.error("Harmony submit error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
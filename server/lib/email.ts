import nodemailer from "nodemailer";

function required(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export function getMailer() {
  const host = required("SMTP_HOST", process.env.SMTP_HOST);
  const port = Number(required("SMTP_PORT", process.env.SMTP_PORT));
  const secure = (process.env.SMTP_SECURE ?? "true") === "true";
  const user = required("SMTP_USER", process.env.SMTP_USER);
  const pass = required("SMTP_PASS", process.env.SMTP_PASS);

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendMail(opts: {
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const to = required("HARMONY_TO", process.env.HARMONY_TO);
  const from = required("HARMONY_FROM", process.env.HARMONY_FROM);

  const transporter = getMailer();

  await transporter.sendMail({
    from,
    to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  });
}
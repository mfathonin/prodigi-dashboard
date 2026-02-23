import nodemailer from "nodemailer";

type MailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP missing required env vars", {
      hasHost: Boolean(host),
      hasUser: Boolean(user),
      hasPass: Boolean(pass),
    });
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendMail(payload: MailPayload) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!transporter || !from) {
    console.warn("SMTP not configured, skipping email send", {
      to: payload.to,
      subject: payload.subject,
      hasFrom: Boolean(from),
    });
    return false;
  }

  await transporter.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });

  return true;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return sendMail({
    to,
    subject: "Reset your password",
    text: `Reset your password using this link: ${resetUrl}`,
    html: `<p>Reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
}

export async function sendInviteEmail(to: string, inviteUrl: string) {
  return sendMail({
    to,
    subject: "You are invited",
    text: `Set your password using this link: ${inviteUrl}`,
    html: `<p>You are invited. Set your password:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p>`,
  });
}

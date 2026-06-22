import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   ?? "smtp.gmail.com",
  port:   parseInt(process.env.SMTP_PORT ?? "587", 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBugAssignedEmail = async (opts: {
  to:        string;
  toName:    string;
  bugTitle:  string;
  bugId:     string;
  assignedBy: string;
}) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return; // silent skip if not configured

  const bugUrl = `${process.env.APP_URL ?? "http://localhost:5173"}/bugs/${opts.bugId}`;

  await transporter.sendMail({
    from:    `"BugFlow" <${process.env.SMTP_USER}>`,
    to:      opts.to,
    subject: `[BugFlow] Bug assigned to you: ${opts.bugTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#6366f1;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">🐛 BugFlow</h1>
        </div>
        <div style="background:#f8fafc;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">
          <p style="margin:0 0 16px;color:#334155;font-size:15px">Hi <strong>${opts.toName}</strong>,</p>
          <p style="margin:0 0 24px;color:#334155">
            <strong>${opts.assignedBy}</strong> assigned a bug to you:
          </p>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin-bottom:24px">
            <p style="margin:0;font-weight:600;color:#1e293b;font-size:15px">${opts.bugTitle}</p>
          </div>
          <a href="${bugUrl}"
             style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
            View Bug →
          </a>
          <p style="margin:24px 0 0;color:#94a3b8;font-size:12px">
            You're receiving this because a bug was assigned to your BugFlow account.
          </p>
        </div>
      </div>
    `,
  });
};

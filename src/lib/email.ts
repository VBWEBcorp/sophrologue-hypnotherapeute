import { siteConfig } from '@/lib/seo'

const API_KEY = process.env.RESEND_API_KEY
const FROM = process.env.NEWSLETTER_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || ''

/** True si l'envoi d'e-mails est configuré (clé Resend + adresse expéditrice). */
export const emailEnabled = Boolean(API_KEY && FROM)

interface SendArgs {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

/**
 * Envoi d'un e-mail via l'API REST de Resend — aucune dépendance npm.
 * - Retourne { sent: false } si l'envoi n'est pas configuré (pas de clé / expéditeur).
 * - Lève une erreur en cas d'échec réseau ou réponse non-2xx (à attraper par l'appelant).
 */
export async function sendEmail({ to, subject, html, text, replyTo }: SendArgs): Promise<{ sent: boolean }> {
  if (!emailEnabled) return { sent: false }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to,
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Resend ${res.status}: ${detail}`)
  }
  return { sent: true }
}

/** Mail de bienvenue (en français) envoyé au nouvel abonné à la newsletter. */
export async function sendNewsletterWelcome(to: string): Promise<{ sent: boolean }> {
  const brand = siteConfig.name
  const subject = `Bienvenue dans la newsletter de ${brand}`

  const text =
    `Bonjour,\n\n` +
    `Merci de votre inscription à la newsletter de ${brand} !\n` +
    `Vous recevrez désormais nos actualités, conseils et nouveautés directement par e-mail.\n\n` +
    `À très bientôt,\nL'équipe ${brand}\n\n` +
    `—\n` +
    `Vous recevez cet e-mail car cette adresse a été inscrite sur ${siteConfig.url}. ` +
    `Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement ce message.`

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
          <tr><td style="padding:32px 32px 8px;">
            <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#18181b;">Bienvenue ! 🎉</h1>
            <p style="margin:0;color:#71717a;font-size:13px;">Newsletter de ${brand}</p>
          </td></tr>
          <tr><td style="padding:16px 32px 8px;font-size:15px;line-height:1.6;color:#3f3f46;">
            <p style="margin:0 0 12px;">Bonjour,</p>
            <p style="margin:0 0 12px;">Merci de votre inscription à la newsletter de <strong>${brand}</strong> !</p>
            <p style="margin:0 0 12px;">Vous recevrez désormais nos actualités, conseils et nouveautés directement dans votre boîte mail.</p>
            <p style="margin:0 0 4px;">À très bientôt,</p>
            <p style="margin:0;">L'équipe ${brand}</p>
          </td></tr>
          <tr><td style="padding:16px 32px 28px;">
            <a href="${siteConfig.url}" style="display:inline-block;background:#6d28d9;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:10px;">Visiter le site</a>
          </td></tr>
          <tr><td style="padding:16px 32px;background:#fafafa;border-top:1px solid #f0f0f0;font-size:11px;line-height:1.5;color:#a1a1aa;">
            Vous recevez cet e-mail car cette adresse a été inscrite sur ${siteConfig.url}.
            Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement ce message.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`

  return sendEmail({ to, subject, html, text })
}

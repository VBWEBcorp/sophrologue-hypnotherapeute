import { NextRequest, NextResponse } from 'next/server'

import { emailEnabled, sendEmail } from '@/lib/email'
import { siteConfig } from '@/lib/seo'

/**
 * Formulaire de contact → e-mail via Resend.
 *
 * Tant que Resend n'est pas configuré (avant mise en ligne), la route répond
 * proprement `{ ok: true, configured: false }` : le front affiche alors un
 * message honnête invitant à appeler / réserver, sans prétendre qu'un e-mail
 * a été envoyé.
 */
export async function POST(req: NextRequest) {
  try {
    const { firstname, lastname, email, phone, message } = await req.json()

    if (!firstname || !email || !message) {
      return NextResponse.json(
        { error: 'Veuillez renseigner votre prénom, votre e-mail et votre message.' },
        { status: 400 }
      )
    }

    if (!emailEnabled) {
      return NextResponse.json({ ok: true, configured: false })
    }

    const to = process.env.CONTACT_TO_EMAIL || siteConfig.email
    const fullName = [firstname, lastname].filter(Boolean).join(' ')

    try {
      await sendEmail({
        to,
        replyTo: email,
        subject: `Nouveau message de ${fullName}`,
        text:
          `Nouveau message depuis le formulaire de contact :\n\n` +
          `Nom : ${fullName}\n` +
          `E-mail : ${email}\n` +
          `Téléphone : ${phone || '—'}\n\n` +
          `Message :\n${message}\n`,
        html:
          `<p>Nouveau message depuis le formulaire de contact :</p>` +
          `<p><strong>Nom :</strong> ${escapeHtml(fullName)}<br>` +
          `<strong>E-mail :</strong> ${escapeHtml(email)}<br>` +
          `<strong>Téléphone :</strong> ${escapeHtml(phone || '—')}</p>` +
          `<p><strong>Message :</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      })
      return NextResponse.json({ ok: true, configured: true })
    } catch (err) {
      // Resend configuré mais envoi refusé (ex. domaine pas encore vérifié) :
      // on n'affiche pas d'erreur au visiteur, on l'invite à appeler / réserver.
      console.error('Contact email failed:', err)
      return NextResponse.json({ ok: true, configured: false })
    }
  } catch {
    return NextResponse.json(
      { error: 'Requête invalide. Merci de réessayer.' },
      { status: 400 }
    )
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

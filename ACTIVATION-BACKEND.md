# 🚀 Activation du back-office & des services

> Runbook complet pour **activer le backend**, garantir que **tout ce qui est dans le front se retrouve dans l'espace admin**, et **connecter Resend, Cloudflare, Stripe et la base de données**.
>
> État au **15/06/2026** — Next.js 15.5.14 (App Router), MongoDB/Mongoose, JWT.

---

## 0. TL;DR — état actuel

| Brique | État | Action requise |
|---|---|---|
| **Base de données** (MongoDB) | ✅ Connectée — **base locale du template** (`localhost/template-cms`) | Garder en local pour le dev ; cluster distant pour la prod |
| **Authentification admin** (JWT) | ⚠️ Fonctionnelle mais **backdoor `demo-token` active** | Sécuriser avant prod (§3) |
| **Stockage médias** (Cloudflare R2) | ⚠️ Code prêt, **env manquantes** → fallback local | Renseigner les 5 variables R2 (§4) |
| **Emails** (Formspree *ou* Resend) | ❌ **Formulaire contact inerte** | Choisir une option + brancher · mails **en français** (§5) |
| **Paiements** (Stripe) | ❌ Aucun code, aucun cas d'usage | Définir le besoin puis intégrer (§6) |
| **Parité front ↔ admin** | 🟡 ~80 % couvert | Combler 3 zones statiques (§7) |

---

## 1. Architecture en bref

- **Front public** : pages dans [`src/app`](template-cms/src/app) (`/`, `/a-propos`, `/services`, `/contact`, `/blog`, `/gallery`, pages légales).
- **Espace admin** : [`src/app/admin`](template-cms/src/app/admin) (login JWT, dashboard, éditeurs de pages, blog, galerie, marketing).
- **Contenu éditable** : modèle unique [`SiteContent`](template-cms/src/models/SiteContent.ts) (`pageId` + `content` JSON), exposé par l'API [`/api/content/[pageId]`](template-cms/src/app/api/content/[pageId]/route.ts) et consommé côté front par le hook [`useContent`](template-cms/src/hooks/use-content.ts).
- **Le front lit les défauts** depuis [`lib/site-content.ts`](template-cms/src/lib/site-content.ts) et **les surcharge** avec ce que renvoie le CMS. Donc : éditer en admin → enregistré en base → affiché sur le front.

```
Front (useContent) ──GET /api/content/:pageId──► MongoDB (SiteContent)
Admin (PageEditor) ──PUT /api/content/:pageId──► MongoDB (SiteContent)
```

---

## 2. Variables d'environnement — fichier complet

Crée / complète [`.env.local`](template-cms/.env.local) à la racine de `template-cms`.
**Aujourd'hui seules les 2 premières sont définies.**

```bash
# ── Base de données (DÉJÀ DÉFINI) ───────────────────────────
# Actuel = base LOCALE du template (MongoDB local, base "template-cms")
MONGODB_URI="mongodb://localhost:27017/template-cms"
# Pour la prod, basculer sur un cluster distant (ex. Atlas) :
# MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/template-cms?retryWrites=true&w=majority"

# ── Auth JWT (DÉJÀ DÉFINI — à régénérer pour la prod) ────────
JWT_SECRET="<chaîne aléatoire longue, ex: openssl rand -base64 48>"

# ── Cloudflare R2 (stockage des médias) — À RENSEIGNER ──────
R2_ACCOUNT_ID="<account id Cloudflare>"
R2_ACCESS_KEY_ID="<access key du token R2>"
R2_SECRET_ACCESS_KEY="<secret key du token R2>"
R2_BUCKET_NAME="<nom du bucket>"
R2_PUBLIC_URL="https://<sous-domaine>.r2.dev"   # ou domaine custom

# ── Emails — formulaire contact (choisir UNE option, §5) ────
# Option A · Formspree (sans backend)
NEXT_PUBLIC_FORMSPREE_ENDPOINT="https://formspree.io/f/xxxxxxx"
# Option B · Resend (backend, contrôle total)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
CONTACT_TO_EMAIL="contact@tondomaine.fr"        # destinataire des messages
CONTACT_FROM_EMAIL="noreply@tondomaine.fr"      # expéditeur vérifié chez Resend

# ── Stripe (paiements) — À AJOUTER (si besoin) ──────────────
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxx"

# ── Divers ──────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL="https://tondomaine.fr"
```

> ⚠️ `.env.local` est **ignoré par git** ([.gitignore](template-cms/.gitignore)). En production, renseigner ces variables dans le panneau d'environnement de l'hébergeur (Cloudflare Pages / Vercel).

---

## 3. Base de données + Authentification

### 3.1 MongoDB (déjà connecté)
- **Base actuelle = celle du template, en local** : `mongodb://localhost:27017/template-cms` (base `template-cms`). Nécessite un **MongoDB local démarré** (service `mongod` ou Docker).
- ⚠️ `template-cms` **et** `site-clone` pointent sur la **même base locale `template-cms`** — ils partagent donc le contenu. Pour les isoler, changer le nom de base dans l'un des deux `.env.local` (ex. `.../site-clone`).
- Connexion gérée par [`lib/db.ts`](template-cms/src/lib/db.ts) (cache de connexion, pool 1→10).
- **Prod** : créer un cluster distant (ex. **MongoDB Atlas**), whitelister l'IP de l'hébergeur (ou `0.0.0.0/0` + user dédié), copier l'URI dans `MONGODB_URI`.
- Modèles existants : [`User`](template-cms/src/models/User.ts), [`SiteContent`](template-cms/src/models/SiteContent.ts), [`Blog`](template-cms/src/models/Blog.ts), [`Gallery`](template-cms/src/models/Gallery.ts), [`Marketing`](template-cms/src/models/Marketing.ts).

### 3.2 Créer le compte admin
1. Lancer l'app, aller sur **`/admin/register`** pour créer le premier utilisateur (mot de passe hashé bcrypt).
2. Se connecter via **`/admin/login`**.

### 3.3 🔒 Sécuriser avant la mise en prod (IMPORTANT)
Dans [`lib/auth.ts`](template-cms/src/lib/auth.ts) il existe une **backdoor de démo** :

```ts
// TODO: Retirer avant mise en production
if (token === 'demo-token') { return { authenticated: true, user: { role: 'admin' ... } } }
```

- [ ] **Supprimer ce bloc** `demo-token` dans [`lib/auth.ts`](template-cms/src/lib/auth.ts).
- [ ] **Supprimer le bouton "démo"** qui pose `demo-token` dans [`admin/login/page.tsx`](template-cms/src/app/admin/login/page.tsx) (~ligne 183).
- [ ] Régénérer un **`JWT_SECRET`** fort (`openssl rand -base64 48`).
- [ ] Optionnel : désactiver l'inscription publique `/admin/register` une fois l'admin créé.

---

## 4. Cloudflare R2 (stockage des médias)

Le code est **déjà écrit** ([`lib/r2.ts`](template-cms/src/lib/r2.ts)) et utilisé par la route d'upload [`/api/upload`](template-cms/src/app/api/upload/route.ts). Sans les variables, l'app bascule automatiquement en **stockage local** (`public/uploads/`, non versionné) — pratique en dev, **à éviter en prod**.

### Étapes
1. Cloudflare → **R2** → *Create bucket* (ex. `template-cms-media`).
2. **R2 → Manage API Tokens** → créer un token (Object Read & Write) → récupérer `Access Key ID` + `Secret`.
3. Activer l'accès public du bucket (r2.dev) **ou** brancher un domaine custom → c'est `R2_PUBLIC_URL`.
4. Renseigner les 5 variables `R2_*` (§2).
5. Vérifier que le hostname est autorisé dans [`next.config.ts`](template-cms/next.config.ts) → déjà OK pour `*.r2.dev` (ajouter le domaine custom si utilisé).

✅ Test : uploader une image dans **Admin → Galerie**. La réponse JSON doit indiquer `"storage": "cloudflare-r2"`.

> **Cloudflare** peut aussi servir d'**hébergeur** (Cloudflare Pages) et de **DNS/CDN**. Voir §8.

---

## 5. Emails — formulaire de contact

> ❌ **Aujourd'hui le formulaire de contact n'envoie rien** : dans [`contact-content.tsx`](template-cms/src/app/contact/contact-content.tsx) le `onSubmit` fait juste `e.preventDefault()`.
>
> 🇫🇷 **Exigence : tous les mails (notification + accusé de réception) doivent être en français.**

Deux options, au choix selon le niveau de contrôle souhaité :

| | **Option A — Formspree** | **Option B — Resend** |
|---|---|---|
| Backend à coder | ❌ Aucun | ✅ Helper + route API |
| Personnalisation | Limitée (templates Formspree) | Totale (HTML/texte sur-mesure) |
| Coût | Gratuit jusqu'à ~50 envois/mois | Gratuit jusqu'à 3 000/mois |
| Mails en français | Via `_subject` + autoresponse FR | 100 % maîtrisé dans le code |
| Idéal pour | Mise en ligne rapide | Contrôle total + emails Stripe (§6) |

> 👉 **Recommandation** : Formspree pour démarrer vite, Resend dès qu'il faut des emails sur-mesure (confirmation visiteur, reçus de paiement, etc.).

---

### Option A — Formspree (sans backend)

1. Créer un compte Formspree → nouveau formulaire → récupérer l'endpoint `https://formspree.io/f/xxxxxxx`.
2. Le mettre dans `.env.local` :
   ```bash
   NEXT_PUBLIC_FORMSPREE_ENDPOINT="https://formspree.io/f/xxxxxxx"
   ```
3. Brancher le formulaire dans [`contact-content.tsx`](template-cms/src/app/contact/contact-content.tsx) — remplacer `onSubmit={(e) => e.preventDefault()}` par :
   ```tsx
   async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
     e.preventDefault()
     const form = e.currentTarget
     const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT!, {
       method: 'POST',
       headers: { Accept: 'application/json' },
       body: new FormData(form),
     })
     // gérer loading / succès / erreur
   }
   ```
4. **Mails en français** — ajouter ces champs cachés dans le `<form>` :
   ```tsx
   <input type="hidden" name="_subject" value="Nouveau message depuis le site" />
   <input type="hidden" name="_language" value="fr" />   {/* messages de validation en FR */}
   ```
5. **Accusé de réception au visiteur (en français)** : dans le dashboard Formspree → *Settings → Autoresponse* → rédiger le message **en français** (objet + corps).
6. Vérifier l'email destinataire dans Formspree (par défaut = celui du compte).

> ℹ️ Le champ d'email du visiteur doit s'appeler `name="email"` pour que le **Reply-To** fonctionne.

---

### Option B — Resend (backend, contrôle total)

**5.B.1 Installer**
```bash
npm i resend
```

**5.B.2 Helper `lib/resend.ts` — contenu 100 % en français**
```ts
// src/lib/resend.ts
import { Resend } from 'resend'

const API_KEY = process.env.RESEND_API_KEY
export const resendEnabled = !!API_KEY
const resend = API_KEY ? new Resend(API_KEY) : null

// 1) Notification interne (à toi) — en français
export async function sendContactEmail(data: {
  name: string; email: string; message: string; phone?: string
}) {
  if (!resend) throw new Error('Resend non configuré')
  return resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: data.email,
    subject: `Nouveau message de ${data.name}`,
    text:
      `Nouveau message reçu depuis le formulaire de contact :\n\n` +
      `Nom : ${data.name}\n` +
      `Email : ${data.email}\n` +
      `Téléphone : ${data.phone ?? '—'}\n\n` +
      `Message :\n${data.message}\n`,
  })
}

// 2) Accusé de réception au visiteur — en français
export async function sendContactConfirmation(data: { name: string; email: string }) {
  if (!resend) return
  return resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: data.email,
    subject: 'Nous avons bien reçu votre message',
    text:
      `Bonjour ${data.name},\n\n` +
      `Merci de nous avoir contactés. Nous avons bien reçu votre message ` +
      `et nous reviendrons vers vous dans les meilleurs délais.\n\n` +
      `Bien cordialement,\nL'équipe`,
  })
}
```

**5.B.3 Route API `/api/contact` (messages d'erreur en français)**
```ts
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, sendContactConfirmation } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, phone } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs obligatoires.' }, { status: 400 })
    }
    await sendContactEmail({ name, email, message, phone })
    await sendContactConfirmation({ name, email })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "L'envoi a échoué, veuillez réessayer." }, { status: 500 })
  }
}
```

**5.B.4 Brancher le formulaire**
Dans [`contact-content.tsx`](template-cms/src/app/contact/contact-content.tsx), remplacer `onSubmit={(e) => e.preventDefault()}` par un handler qui `POST` vers `/api/contact` (états *loading / succès / erreur*, messages **en français**).

**5.B.5 Configurer Resend**
1. Compte Resend → **API Keys** → `RESEND_API_KEY`.
2. **Domains** → ajouter & vérifier ton domaine (SPF/DKIM via DNS Cloudflare) → `CONTACT_FROM_EMAIL` doit appartenir à ce domaine.
3. Renseigner `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` (§2).

> 💡 Avec Resend tu peux aussi envoyer en français : reçu de paiement Stripe (§6), accusé blog/newsletter, etc.

---

## 6. Stripe (paiements)

> ⚠️ **Aucun cas d'usage e-commerce n'existe dans le template** (pas de produits, panier, ni prix). Avant d'intégrer Stripe, **définir le besoin** :
> - (A) Boutique / produits → Stripe Checkout + webhooks + modèle `Order`.
> - (B) Prise de RDV / acompte / devis payant → Payment Link ou Checkout simple.
> - (C) Abonnement → Stripe Billing.

### Mise en place générique (Checkout)
```bash
npm i stripe @stripe/stripe-js
```

```ts
// src/lib/stripe.ts
import Stripe from 'stripe'
const KEY = process.env.STRIPE_SECRET_KEY
export const stripeEnabled = !!KEY
export const stripe = KEY ? new Stripe(KEY) : null
```

Routes à créer ensuite :
- `POST /api/checkout` → crée une `Checkout Session` et renvoie l'URL de redirection.
- `POST /api/stripe/webhook` → vérifie la signature (`STRIPE_WEBHOOK_SECRET`), traite `checkout.session.completed` (enregistrer la commande, envoyer l'email Resend).

Côté admin, prévoir un onglet **Commandes** (nouveau modèle `Order`) si cas (A).

📌 **À cadrer avec toi avant de coder** : quel est le produit/service vendu et le tunnel attendu ?

---

## 7. Parité front ↔ admin

### ✅ Déjà éditable dans l'admin
| Section front | `pageId` | Éditeur admin |
|---|---|---|
| Accueil (hero, services, story, FAQ, galerie, CTA) | `home` / `services` | [/admin/pages/accueil](template-cms/src/app/admin/pages/accueil/page.tsx) |
| À propos | `about` | [/admin/pages/a-propos](template-cms/src/app/admin/pages/a-propos/page.tsx) |
| Services | `services` | [/admin/pages/services](template-cms/src/app/admin/pages/services/page.tsx) |
| Contact (textes) | `contact` | [/admin/pages/contact](template-cms/src/app/admin/pages/contact/page.tsx) |
| Témoignages | `testimonials` | [/admin/pages/temoignages](template-cms/src/app/admin/pages/temoignages/page.tsx) |
| Galerie | modèle `Gallery` | [/admin/gallery](template-cms/src/app/admin/gallery/page.tsx) |
| Blog | modèle `Blog` | [/admin/blog](template-cms/src/app/admin/blog/page.tsx) |
| Popup / Bannière | modèle `Marketing` | [/admin/marketing](template-cms/src/app/admin/marketing/page.tsx) |

### 🟡 Encore statique (à rendre éditable pour une parité 100 %)
1. **Footer & coordonnées** (nom, email, téléphone, adresse, réseaux sociaux) → codés en dur dans [`lib/seo.ts`](template-cms/src/lib/seo.ts) (`siteConfig`). → Créer un `pageId: "settings"` + éditeur **Réglages du site**.
2. **Marquee de valeurs** ([`values-marquee.tsx`](template-cms/src/components/sections/values-marquee.tsx)) → valeurs statiques depuis `lib/site-content.ts`. → Ajouter au CMS `home`.
3. **Pages légales** (mentions légales, confidentialité, cookies, CGV) → 100 % statiques. → Optionnel : `pageId` dédiés si tu veux les éditer sans toucher au code.

> Pattern à suivre pour chacune : créer le `pageId`, ajouter une page sous `admin/pages/...` qui rend `<PageEditor pageId="..." .../>`, puis remplacer les valeurs statiques du front par `useContent('<pageId>', defaults)`.

---

## 8. Déploiement / mise en production

- [ ] Renseigner **toutes** les variables (§2) chez l'hébergeur (Cloudflare Pages ou Vercel).
- [ ] **MongoDB Atlas** prod + accès réseau autorisé.
- [ ] **R2** prod + `R2_PUBLIC_URL` (idéalement domaine custom).
- [ ] **Emails** : Formspree (endpoint + autoresponse FR) **ou** Resend (domaine vérifié DNS) — mails **en français**.
- [ ] Sécurité auth : backdoor `demo-token` retirée, `JWT_SECRET` régénéré (§3.3).
- [ ] `npm run build` sans erreur.
- [ ] Vérifier `NEXT_PUBLIC_SITE_URL` + les `remotePatterns` images ([`next.config.ts`](template-cms/next.config.ts)).
- [ ] (Optionnel) Lancer le **seed** initial : `POST /api/seed` connecté en admin (remplit galerie + blog de démo).

---

## 9. Commandes utiles

```bash
npm run dev      # dev (localhost:3000, ou 3001 si occupé)
npm run build    # build de prod
npm run start    # serveur de prod
npm run lint     # lint
```

---

## 10. Checklist d'activation (résumé)

- [ ] **DB** : URI Atlas prod renseignée et testée
- [ ] **Admin** : compte créé via `/admin/register`
- [ ] **Sécurité** : `demo-token` retiré, `JWT_SECRET` fort
- [ ] **R2** : 5 variables + test upload = `cloudflare-r2`
- [ ] **Emails** : option choisie (Formspree *ou* Resend), formulaire branché, **mails + accusé de réception en français**
- [ ] **Stripe** : cas d'usage défini → intégration ciblée
- [ ] **Parité** : footer/coordonnées, marquee, (légales) passés au CMS
- [ ] **Deploy** : variables d'env chez l'hébergeur + `npm run build` OK
```

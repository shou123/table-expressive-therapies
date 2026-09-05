# Table Expressive Therapies, Inc.

A warm, bilingual editorial website for Table Expressive Therapies, Inc., inspired by the pacing and interaction patterns of Psyche Guides. The site brings together public Table content from Instagram and Facebook, removes duplicate event coverage, and presents the full archive in chronological order.

## What is included

- Responsive English/Traditional Chinese homepage
- Original-color images with uncropped `contain` presentation
- Expanded horizontal “Ideas around the table” reading rail
- Full date-sorted social archive with lightweight initial loading
- Accessible story dialogs sized for both images and long text
- Protected `/admin` studio for editing homepage copy and stories
- New-story publishing and original-image uploads
- D1-backed content storage and R2-backed media storage

## Local preview

Use Node.js 22.13 or newer, then:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The local Sites sign-in account is `seedy@sites.test`.

## Admin access

Copy `.env.example` to `.env.local` and add the email addresses that may edit the site:

```bash
ADMIN_EMAILS=your-email@example.com
```

Then open [http://localhost:3000/admin](http://localhost:3000/admin). Admin authorization is checked on the server for every save and upload request. Images can be JPG, PNG, WebP, or GIF up to 8 MB.

## Quality checks

```bash
pnpm lint
pnpm build
```

The current project is prepared for local preview only and has not been deployed.

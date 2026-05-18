# Jay Ganga Associates — Project Guide

This guide provides a comprehensive overview of the Jay Ganga Associates digital platform, including verified company details, project architecture, and administrative workflows.

---

## 🏛️ Company Profile

**Jay Ganga Associates** is a leading exhibition stall fabricator and designer based in Coimbatore, Tamil Nadu, India.

| Detail | Info |
|---|---|
| **Specialization** | Stall Fabrication & Designing |
| **Location** | Coimbatore, Tamil Nadu |
| **Founded** | 2009 |
| **Principal Designer** | Ajith Balaji S |
| **Justdial Rating** | ⭐ 4.9 / 5 (13 Reviews) |
| **Official Website** | [jaygangastallfabrication.in](https://www.jaygangastallfabrication.in) |

### Contact Information
| Type | Details |
|---|---|
| **Phone** | [+91 93633 33040](tel:+919363333040) |
| **WhatsApp** | [Chat Now](https://wa.me/919363333040) |
| **Email** | [info.jayganga@gmail.com](mailto:info.jayganga@gmail.com) |
| **Address** | Do.No 31, Nanjammal Illam, 3rd St, Pari Nagar, Edayarpalayam, Coimbatore — 641025 |

---

## 📈 Growth Trajectory

| Year | Stalls Delivered |
|---|---|
| 2023 | 6 |
| 2024 | ~24 |
| 2025 | 40+ |

This rapid growth demonstrates the company's commitment to quality and on-time delivery, earning them a 4.9-star rating across their client base.

---

## 🛠️ Services Offered

1. **3D Stall Design & Planning** — Photorealistic renders before fabrication begins.
2. **Custom Stall Fabrication** — Wooden, Octanorm, mezzanine & metal structures built in-house.
3. **Brand Activations & Kiosks** — Pop-up counters and branded retail zones.
4. **Graphic Printing & Branding** — Large-format printing for backdrops, fascia, standees.
5. **End-to-End Event Management** — Transport, installation, and dismantling.

---

## 🤝 Known Clients

- Bioaltus
- Vibcare
- Kavitha Poly Pack
- Harvest
- Arruthra Food Machines
- Sigma
- Ibery
- Salem PrintPack
- Micron

---

## 🚀 Technical Stack

| Component | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Database** | Supabase (PostgreSQL) |
| **Media Storage** | Cloudinary |
| **Styling** | Vanilla CSS |
| **Deployment** | Vercel |

### Project Structure
```
/src/app          → Pages and API routes
/src/components   → Reusable UI (Footer, Navbar, Toast)
/src/lib          → Supabase client, Auth helpers
/public           → Static assets and global CSS
```

---

## 🔑 Admin Access

| Setting | Value |
|---|---|
| **Login URL** | `/admin/login` |
| **Username** | `admin` |
| **Password** | `jayganga2024` |
| **Session Duration** | 24 hours (cookie-based) |

### Admin Sections
- **`/admin/blog`** — Create & manage blog posts (title, slug, cover image, content)
- **`/admin/gallery`** — Upload project photos/videos via Cloudinary
- **`/admin/comments`** — Moderate user comments on blog posts
- **`/admin/contacts`** — View & manage lead form submissions

---

## 💻 Developer Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Edit .env.local with your Supabase & Cloudinary credentials

# 3. Run the dev server
npm run dev
# → Open http://localhost:3000

# 4. Production build
npm run build
```

### Required Environment Variables (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=jayganga2024
```

---

*Last Updated: April 2026*

# Dental Scheduler Frontend — Architecture & Documentation

## Table of Contents

1. [Overview & Assumptions](#overview--assumptions)
2. [Pages & Features Checklist](#pages--features-checklist)
3. [System Architecture](#system-architecture)
4. [Tech Stack & Tools](#tech-stack--tools)
5. [Component Layout & Directory Structure](#component-layout--directory-structure)
6. [Deployment Steps](#deployment-steps)
7. [Further Reading & References](#further-reading--references)

---

## Overview & Assumptions

- **Purpose**: A Next.js app (client-side navigation) for patients to view dentists, book appointments.
- **Assumptions**:
  - **PROJECT PRIORITY**: Focused on trying to build as much as functionality as possible as described on the test instructions sent of the PDF. A lot of improvements required.
  - Auth: JWT stored in localStorage, sent on each request in the Authorization header.
  - Backend API is available at `https://<CF_DIST>.cloudfront.net/api`.
  - No SSR; purely client-side rendering.

---

## Pages & Features Checklist

- [x] **Home Page**: Displays the dental office’s information, services, and a call to action to schedule an appointment.
- [x] **Booking Page**: Allows a user to select a dentist, view available slots, and schedule an appointment.
- [x] **User Dashboard**: After logging in, a user can view their upcoming appointments, reschedule or cancel them.

## System Architecture

```plaintext
┌───────────────┐        HTTPS         ┌──────────────────────┐
│  Frontend App │◀───────────────────▶│      CloudFront       │
│ (Netlify/Vercel)│                    │                       │
└───────────────┘                      └──────────────────────┘
                                           │
                                           │ HTTPS
                                           ▼
                             ┌────────────────────────────┐
                             │   EKS Cluster (Express)    │
                             │ ┌────────────────────────┐ │
                             │ │ Pods:                  │ │
                             │ │ - auth-service         │ │
                             │ │ - dentist-service      │ │
                             │ │ - appointment-service  │ │
                             │ └────────────────────────┘ │
                             └────────────────────────────┘
                                           │
                                           │ Prisma over TCP
                                           ▼
                               ┌──────────────────────────┐
                               │   Amazon RDS (Postgres)  │
                               └──────────────────────────┘
```

## Tech Stack & Tools

- **Framework:** React (via Next.js)
- **Language:** TypeScript
- **Styling & Components:**
  - [ShadCN UI](https://shadcn.com/) for reusable, accessible components
  - Tailwind CSS for utility-first styling
- **Data Fetching:**
  - React Query for server state, caching, and mutations
- **Routing:** Next.js App Router
- **Forms & Validation:** React Hook Form
- **Icons & Illustrations:** Lucide-React, Heroicons
- **Environment:**
  - `.env` files for local development
  - Netlify Environment Variables for production

## Component Layout & Directory Structure

<details> <summary>Directory Structure</summary>

src/
├─ components/ # Reusable UI (Button, Input, Modal…)
│ ├─ Button.tsx
│ ├─ Input.tsx
│ └─ …
├─ features/ # Domain features
│ ├─ auth/ # Login, Register, ProtectedRoute
│ ├─ dentists/ # DentistList, DentistCard
│ └─ appointments/# BookingForm, AppointmentList
├─ hooks/ # Custom hooks (useAuth, useFetchDentists…)
├─ services/ # API client + React Query setup
│ ├─ api.ts
│ └─ queries.ts
├─ styles/ # Global CSS, Tailwind config
├─ App.tsx # Layout + Route definitions
└─ main.tsx # ReactDOM render + QueryClient provider

</details>

## Deployment Steps

- Connect GitHub → Netlify on main branch.
- Set Netlify Project environment variable.
- Deploy project

## Further Reading & References

- **React Query**: [Official Docs & Guides](https://tanstack.com/query/latest)
- **ShadCN UI**: [Component Library Guide](https://shadcn.com/)
- **Netlify**: [File-Based Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- **Tailwind CSS**: [Utility-First Framework Docs](https://tailwindcss.com/docs)

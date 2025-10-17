# ALS Shipping Website - Next.js Recreation Plan

## 1. WEBSITE ANALYSIS

### Current State
- **Platform**: WordPress with Elementor page builder
- **Domain**: https://alsshipping.com/
- **Title**: "ALS Shipping New – Your Global Cargo Journey Starts Here"
- **Type**: International shipping/logistics company website

### Key Pages Identified
1. **Home** - Hero section, services overview, features, testimonials, CTA
2. **About** - Company information, mission, team
3. **Services** - Detailed service offerings (cargo shipping, logistics, etc.)
4. **Contact** - Contact form, location information
5. **Blog/News** - Articles and updates
6. **FAQ** - Frequently asked questions
7. **Tracking** - Shipment tracking functionality

### Key Components
- Header with logo and navigation menu
- Hero banner with background image and CTA
- Service cards/grid
- Testimonials section
- Contact form
- Footer with links and information
- Mobile-responsive navigation (hamburger menu)

---

## 2. CURRENT PROJECT TECH STACK

### Existing Setup (dandeal)
- **Framework**: Next.js 15.2.4
- **React**: v19
- **Styling**: Tailwind CSS + CSS Modules
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Themes**: next-themes (dark mode support)
- **Notifications**: Sonner (toast notifications)

### Advantages
- Modern, performant setup
- Excellent component library ready to use
- Built-in form validation
- Dark mode support
- Responsive design capabilities

---

## 3. PROPOSED ARCHITECTURE

### Directory Structure
```
app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Home page
├── globals.css               # Global styles
├── (pages)/
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── contact/page.tsx
│   ├── blog/page.tsx
│   ├── faq/page.tsx
│   └── tracking/page.tsx

components/
├── layout/
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── MobileNav.tsx
├── sections/
│   ├── HeroSection.tsx
│   ├── ServicesSection.tsx
│   ├── FeaturesSection.tsx
│   ├── TestimonialsSection.tsx
│   └── CTASection.tsx
├── forms/
│   ├── ContactForm.tsx
│   ├── QuoteForm.tsx
│   └── TrackingForm.tsx
└── ui/                       # shadcn/ui components (existing)

lib/
├── constants.ts              # Navigation, services data
├── types.ts                  # TypeScript interfaces
└── utils.ts                  # Utility functions

public/
├── images/
│   ├── hero-bg.jpg
│   ├── services/
│   └── testimonials/
└── icons/
```

### Routing Strategy
- Use Next.js App Router (already in place)
- Route groups for organization: `(pages)` for main pages
- Dynamic routes for blog posts if needed

### Styling Approach
- **Primary**: Tailwind CSS (already configured)
- **Components**: shadcn/ui for consistency
- **Custom**: CSS modules for page-specific styles if needed
- **Responsive**: Mobile-first approach with Tailwind breakpoints

### Data Management
- Static data in `lib/constants.ts` for initial launch
- Can be extended with CMS integration later (Contentful, Strapi, etc.)
- Contact form submissions to email service (Nodemailer, SendGrid, etc.)

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Core Layout & Navigation
- [ ] Update root layout with proper metadata
- [ ] Create Header component with logo
- [ ] Create Navigation component (desktop + mobile)
- [ ] Create Footer component
- [ ] Create MobileNav/Hamburger menu
- [ ] Set up color scheme and typography

### Phase 2: Home Page
- [ ] Hero section with background image
- [ ] Services overview section
- [ ] Features/benefits section
- [ ] Testimonials carousel
- [ ] CTA section
- [ ] Newsletter signup

### Phase 3: Additional Pages
- [ ] About page
- [ ] Services detail page
- [ ] Contact page with form
- [ ] FAQ page with accordion
- [ ] Blog listing page
- [ ] Tracking page

### Phase 4: Forms & Interactivity
- [ ] Contact form with validation
- [ ] Quote request form
- [ ] Tracking form
- [ ] Newsletter subscription
- [ ] Form submission handling

### Phase 5: Polish & Optimization
- [ ] Responsive design testing
- [ ] Image optimization
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Accessibility improvements

---

## 5. KEY FEATURES TO IMPLEMENT

1. **Navigation**: Sticky header, mobile hamburger menu
2. **Forms**: Contact, quote request, tracking with validation
3. **Sections**: Hero, services, testimonials, CTA, FAQ
4. **Responsive**: Mobile, tablet, desktop layouts
5. **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
6. **Performance**: Image optimization, lazy loading, code splitting

---

## 6. NEXT STEPS

1. Start with Phase 1: Set up core layout and navigation
2. Create reusable components for common sections
3. Implement home page with all sections
4. Add remaining pages
5. Implement forms with validation
6. Test and optimize


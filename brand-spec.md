# Rosales Brand Specification

## Design Read

| Dial | Decision |
|---|---|
| Artifact | Premium, conversion-focused contractor website |
| Audience | Homeowners and commercial property owners in Napa, Vallejo, and the North Bay seeking high-quality exterior work |
| Visual language | Cultivated California craftsmanship: editorial, architectural, tactile, and grounded in real project photography |
| Mode | Redesign · Overhaul |
| Visual variance | 7/10 — a recognizable, tailored composition rather than a generic contractor template |
| Motion intensity | 3/10 — restrained photo reveals and tactile hover feedback only |
| Information density | 4/10 — generous whitespace, clear service paths, and concise proof points |
| Asset dependence | 9/10 — real Rosales work is the primary visual evidence |
| Brand fidelity | 10/10 — use the approved Rosales logo and its green identity, never a replacement mark |

## Narrative and experience intent

The home page must establish that Rosales is a craft-led outdoor construction partner before it asks for an estimate. The hero is a full-bleed, real project photograph with a quiet dark overlay, a compact credibility line, and two deliberate actions: request an estimate or explore work. Service pages must give visitors at phone distance a fast path to the correct specialty; at laptop distance they must feel like polished project portfolios with proof, process, and visual materiality.

## Design Decisions

| Layer | System decision |
|---|---|
| Palette | Rosales logo green `#5E8B52`; accessible interface green `#47793E`; Deep Pine `#17231A`; Limestone `#F2EEE5`; accessible Clay `#9D5036`. Colors are tested at WCAG-compliant contrast pairings. |
| Typography | Instrument Serif for expressive editorial headlines; Manrope for navigation, body, forms, and utility text. |
| Spacing | 8 px base grid, with large section breathing room at desktop and controlled vertical rhythm on mobile. |
| Layout | Editorial asymmetric hero; modular project grid; service pathways; concise proof band; mobile-first conversion rails. |
| Radius | 2 px for editorial image frames and controls; no soft, generic pill-card interface. |
| Elevation | Minimal shadow; depth comes from photography, layers, grain, and tonal contrast rather than floating cards. |
| Motion | `cubic-bezier(0.23, 1, 0.32, 1)`; 140–240 ms controls; reveals use opacity/transform only and disable with `prefers-reduced-motion`. |
| Atoms | High-contrast primary/secondary buttons, text links, language switch, service chip, form field, consent checkbox, and project tag. |
| Organisms | Responsive navigation, premium hero, service index, project storytelling module, credibility strip, estimate form, and footer. |

## Approved source assets

The approved logo source is `/home/ubuntu/rosales_discovery/assets/originals/124_Diseno-sin-titulo-3-e1729819973975.png`. The new site will use a curatorial set of real Rosales project photography from `/home/ubuntu/rosales_discovery/assets/originals/` and will exclude stock/template imagery identified in the discovery package. All production-bound visual files will be copied to `/home/ubuntu/webdev-static-assets/` and referenced only through managed asset URLs.

### Selected project photography

| Subject | Source file | Planned role |
|---|---|---|
| Paver driveway and landscape approach | `244_Pavers-e1763091483640.jpg` | Home hero or pavers service page. |
| Synthetic turf and stepping-stone garden | `236_10-1.jpg` | Synthetic turf service page and project index. |
| Stone retaining wall | `385_Granite-Stone-Walls-768x514-1.jpg` | Retaining walls service page. |
| Concrete circular patio process | `200_d0b50ef0-cd50-4617-8d15-3768c781c6c7.webp` | Concrete service page and craftsmanship proof. |
| Cinder-block retaining wall | `245_Cinder-Block-Retaining-Walls.png` | Retaining walls project evidence. |
| Flagstone patio transformation | `209_4bf2e5d0-ae9a-422e-a2d3-79264ce55430.webp` | Stonework service page. |
| Outdoor kitchen and masonry | `211_7579fa85-a37e-4d88-99fb-a8337440db8a.webp` | Projects page and outdoor living proof. |
| Deck and entry stairs | `239_8-2.jpg` | Decks service page. |
| Wood fence | `240_2-2.jpg` | Fences and gates service page. |
| Landscape path and planting | `238_1-2.jpg` | Landscaping service page. |
| Drainage trench in progress | `235_f4ab67a5-5ce3-4c97-a93a-043d7a9f7b9e.jpg` | Drainage and irrigation service page. |
| Walkway and mature garden | `202_WhatsApp-Image-2023-09-25-at-3.45.51-PM-1.webp` | Landscaping / projects page. |

These assets are documentary proof of work rather than implied testimonials or unverified project statistics. The new design will use them with descriptive, service-specific alt text.

## Quality boundaries

The site will not fabricate review quotes, project counts, years of experience, certifications, or awards. Each credibility statement will be sourced from approved company data or public records, and social proof will link to the relevant verified external profile when used.

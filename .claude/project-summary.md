# Project Progress Summary - The Creed

## Core Concept
A non-linear knowledge base and digital manuscript designed as a "Creed." The project focuses on a high-aesthetic, classical "manuscript" feel using a specific color palette and typography.

## Visual Identity
- **Palette:** 
  - Background: Off-white (`#faebd7`)
  - Primary Accent: Maroon (`#57001b`)
  - Secondary Accent: Emerald Green (`#00563b`)
  - Pastels: Pastel Green (`#d6faea`), Pastel Purple (`#ead6fa`)
- **Typography:** Cormorant Garamond (Serif) for a classical feel.
- **Atmosphere:** 
  - Tiled `swirls_background.jpg` for a tactile, paper-like texture.
  - "Rugged" (Right-aligned) and "Smooth" (Left-aligned) text flow.
  - Ornamental framing and decorative dividers.

## Architecture
- **Content Store:** Filesystem-based Markdown files located in `content/[book]/chapters/[chapter].md`.
- **Metadata:** Uses YAML Frontmatter to store `title`, `section`, `x`, and `y` coordinates.
- **Navigation Flow:**
  - **Home Page:** Introduction with an immersive, atmospheric layout.
  - **Library:** A curated gallery of available "Books."
  - **Catalogue (Index):** A flat list of chapters for a specific book.
  - **Reader:** Sequential reading experience with "Previous" and "Next" navigation.
- **Writing Studio (Admin):**
  - Protected by a secret key.
  - Ability to create/edit/delete Books and Chapters.
  - Local filesystem fallback for saving content when GitHub API tokens are absent.

## Current Status & Recent Fixes
- **Fixed:** Transitioned from "Knowledge Map" (coordinates) to a "Catalogue" (sequential list).
- **Fixed:** Implemented a local write fallback in the commit API to bypass GitHub config requirements during dev.
- **Fixed:** Resolved "Untitled" chapter issues by correctly implementing Frontmatter wrapping in the commit route.
- **Fixed:** Resolving a bug where Frontmatter tags (`---`) are appearing in the reader view instead of being parsed as metadata.

## Key Files
- `lib/content.ts`: Core data fetching and parsing logic.
- `app/api/commit/route.ts`: Handles saving content to disk/GitHub.
- `app/edit/page.tsx`: The Writing Studio dashboard.
- `app/globals.css`: The source of the visual identity and theme.

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Painting, ArtistProfile } from './types';

const oilCoastalCliff = '/src/assets/images/oil_coastal_cliff_1780040646808.png';
const watercolorForest = '/src/assets/images/watercolor_forest_1780040664097.png';
const abstractAcrylic = '/src/assets/images/abstract_acrylic_1780040680856.png';
const stillLifePears = '/src/assets/images/still_life_pears_1780040699474.png';
const artistPortrait = '/src/assets/images/artist_portrait_1780040737746.png';

export const INITIAL_PROFILE: ArtistProfile = {
  name: "Elara Vance",
  title: "Contemporary Fine Artist",
  bio: "Elara Vance is an award-winning contemporary landscape and abstract artist active in the Pacific Northwest. Her paintings seek to capture the fleeting transitions of light, atmosphere, and form in nature. Balancing classical chiaroscuro oil techniques with fluid, experimental acrylics and fine watercolors, her work responds directly to the wild vistas, serene coastlines, and internal mindscapes of the modern world.",
  statement: "I believe that painting is a process of translating light into weight. Each canvas is a dialogue between the tactile density of pure pigments and the weightless, transparent quality of light. Whether framing a coastal cliff in thick, textured oils or layering washes of watercolor, my goal is to distill the energy of a place and invite the viewer to linger.",
  avatarUrl: artistPortrait,
  instagram: "@elaravancestudio",
  email: "elara@vancestudio.com",
};

export const INITIAL_PAINTINGS: Painting[] = [
  {
    id: "painting-1",
    title: "Crashing Tides at Cape Meares",
    medium: "Oil on Linen Canvas",
    category: "Landscape",
    year: 2025,
    dimensions: "24 x 36 inches",
    description: "An expressive coastal study catching the late afternoon sun breaking through heavy clouds. Modeled with thick impasto knife-work representing the violent and gorgeous action of the surf against the basalt column cliffs.",
    imageUrl: oilCoastalCliff,
    price: 3400,
    status: "Available",
    createdAt: "2025-10-15T12:00:00Z"
  },
  {
    id: "painting-2",
    title: "Misty Birches in November",
    medium: "Watercolor on Archival Paper",
    category: "Landscape",
    year: 2026,
    dimensions: "18 x 24 inches",
    description: "A soft, quiet watercolor composition exploring negative space, bleeding atmospheric mist, and the stark linear elegance of silver birch trees in late autumn. Perfect for capturing stillness.",
    imageUrl: watercolorForest,
    price: 1800,
    status: "Available",
    createdAt: "2026-02-12T14:30:00Z"
  },
  {
    id: "painting-3",
    title: "Ochre & Charcoal Dialogue No. 5",
    medium: "Mixed Media & Acrylic on Wood Panel",
    category: "Abstract",
    year: 2026,
    dimensions: "40 x 40 inches",
    description: "An expressive abstract piece using highly-textured heavy body acrylic sweeps. Contrasts deep navy and carbon overlays with warm golden ochres and delicate hand-veined gold leafing, reflecting mental landscapes of shadow and hope.",
    imageUrl: abstractAcrylic,
    price: 4200,
    status: "Reserved",
    createdAt: "2026-04-05T09:15:00Z"
  },
  {
    id: "painting-4",
    title: "Studio Still Life with Pears",
    medium: "Oil on Belgian Linen Panel",
    category: "Still Life",
    year: 2025,
    dimensions: "12 x 16 inches",
    description: "A classical realism study in light and shade. Focuses on the subtle textures and delicate variations of green, amber, and deep gold on ripe Bartlett pears situated in a hand-thrown ceramic bowl.",
    imageUrl: stillLifePears,
    price: 1200,
    status: "Sold",
    createdAt: "2025-12-01T16:45:00Z"
  }
];

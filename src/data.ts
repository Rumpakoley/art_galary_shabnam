/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Painting, ArtistProfile } from './types';

import oilCoastalCliff from './assets/images/oil_coastal_cliff.jpg';
import watercolorForest from './assets/images/watercolor_forest.jpg';
import abstractAcrylic from './assets/images/abstract_acrylic.jpg';
import stillLifePears from './assets/images/still_life_pears.jpg';
import artistPortrait from './assets/images/artist_portrait.jpg';

export const INITIAL_PROFILE: ArtistProfile = {
  name: "Husne Shabnam",
  title: "Surrealist Abstract Artist",
  bio: "I am a surrealist abstract artist.\n\nI do not sketch before I begin.\nI do not plan what will emerge.\nI do not start with a destination.\n\nMy work arrives as a conversation with the unknown. Every line, form, and texture appears through intuition rather than intention. I often discover the artwork at the same time as the viewer. The process feels less like creating and more like receiving—a message, a memory, a symbol, or a fragment from a place beyond language.\n\nMy hand moves freely, but something deeper guides it. The worlds that emerge in my work are surreal, abstract, and open-ended. They are not meant to provide answers. They are invitations into reflection.\n\nIn a time that demands speed, certainty, and immediate understanding, my art asks for something different:\nPause.\nSilence.\nPatience.\n\nMany of my works reveal themselves slowly. They are not designed to be consumed in a glance. They ask the viewer to stay, to observe, and to listen.\n\nBecause art speaks differently to every person. What you see is often a reflection of what already exists within you:\nA shape that feels familiar.\nA forgotten memory.\nA hidden fear.\nA longing.\nA dream.\nA question.\n\nThe same artwork may tell entirely different stories to different people, because each viewer brings their own subconscious to the encounter.\n\nI believe that art is not complete when it leaves the artist’s hand. It becomes complete when it meets the inner world of another human being.\n\nThis website is a home for those conversations. A collection of messages from the unknown, waiting to find their meaning in you.",
  statement: "My work arrives as a conversation with the unknown. Every line, form, and texture appears through intuition rather than intention. I believe that art is not complete when it leaves the artist’s hand. It becomes complete when it meets the inner world of another human being.",
  avatarUrl: artistPortrait,
  instagram: "@husne.shabnam",
  email: "husneshabnam@gmail.com",
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

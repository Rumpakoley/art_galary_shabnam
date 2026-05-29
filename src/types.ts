/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Painting {
  id: string;
  title: string;
  medium: string;
  category: string;
  year: number;
  dimensions: string;
  description: string;
  imageUrl: string;
  price: number | null;
  status: 'Available' | 'Sold' | 'Reserved';
  createdAt: string;
}

export interface ArtistProfile {
  name: string;
  title: string;
  bio: string;
  statement: string;
  avatarUrl: string;
  instagram: string;
  email: string;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Painting } from '../types';
import { X, Upload, Check, Image as ImageIcon, SlidersHorizontal, Sliders, DollarSign, Plus } from 'lucide-react';

interface PostWorkModalProps {
  onClose: () => void;
  onPost: (painting: Painting) => void;
}

// Preset artwork style mockups for quick testing
const STYLE_PRESETS = [
  {
    name: "Pacific Shoreline",
    genre: "Oil on Linen",
    url: "https://picsum.photos/seed/shoredream/1200/900",
    description: "An atmospheric exploration of moving seawater, coastal sea spray, and grey granite cliffs. Hand-layered with cold wax."
  },
  {
    name: "Golden Wheatfields",
    genre: "Mixed Media",
    url: "https://picsum.photos/seed/goldfield/1200/900",
    description: "A golden-hued, textural study of rolling crop fields basking in midday amber light, using fine marble dust and thick acrylics."
  },
  {
    name: "Crimson Bloom",
    genre: "Acrylic on Panel",
    url: "https://picsum.photos/seed/crimsonbloom/1200/900",
    description: "An expressive floral abstraction centered around heavy cadmium red and crimson brushwork, contrasting sharply with charcoal overlays."
  },
  {
    name: "Celestial Void",
    genre: "Oil & Gilded Gold",
    url: "https://picsum.photos/seed/celestialvoid/1200/900",
    description: "A cosmic, meditative circlescape painted in ultra-matte carbon black, framed by hand-applied 23k genuine metal gold leaf detail."
  },
  {
    name: "Misty Woodlands",
    genre: "Watercolor",
    url: "https://picsum.photos/seed/mistywoods/1200/900",
    description: "A soft, bleeding forest watercolor exploration using mineral cobalt blue and burnt sienna pigments on heavy cold-press cotton."
  }
];

export default function PostWorkModal({ onClose, onPost }: PostWorkModalProps) {
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState('Oil on Canvas');
  const [category, setCategory] = useState('Landscape');
  const [year, setYear] = useState(2026);
  const [dimensions, setDimensions] = useState('24 x 36 inches');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('1200');
  const [status, setStatus] = useState<'Available' | 'Sold' | 'Reserved'>('Available');
  
  // Image handling
  const [customUrl, setCustomUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0); // Default to first preset
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const localUrl = URL.createObjectURL(file);
      setUploadedImageUrl(localUrl);
      setSelectedPresetIndex(null); // Clear preset if file is selected
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const localUrl = URL.createObjectURL(file);
      setUploadedImageUrl(localUrl);
      setSelectedPresetIndex(null);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handlePresetSelect = (idx: number) => {
    setSelectedPresetIndex(idx);
    setUploadedImageUrl(null);
    setCustomUrl('');
    // Auto-fill some fields based on preset to feel polished!
    const preset = STYLE_PRESETS[idx];
    setTitle(`Study: ${preset.name}`);
    setDescription(preset.description);
  };

  const handleCustomUrlFocus = () => {
    setSelectedPresetIndex(null);
    setUploadedImageUrl(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    // Determine final image URL
    let finalImageUrl = 'https://picsum.photos/seed/defaultart/1200/900';
    if (uploadedImageUrl) {
      finalImageUrl = uploadedImageUrl;
    } else if (customUrl) {
      finalImageUrl = customUrl;
    } else if (selectedPresetIndex !== null) {
      finalImageUrl = STYLE_PRESETS[selectedPresetIndex].url;
    }

    const priceNum = price ? parseFloat(price) : null;

    const newPainting: Painting = {
      id: `painting-custom-${Date.now()}`,
      title,
      medium,
      category,
      year: Number(year),
      dimensions,
      description: description || "An original work created in the artist's studio.",
      imageUrl: finalImageUrl,
      price: priceNum,
      status,
      createdAt: new Date().toISOString()
    };

    onPost(newPainting);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white border border-stone-200 shadow-2xl rounded-xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh]"
      >
        {/* Header bar */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Left Column: Visual Canvas Selection (4 cols) */}
        <div className="md:col-span-5 bg-stone-50 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 bg-amber-50 text-amber-800 font-sans text-[10px] font-semibold tracking-wider rounded-sm border border-amber-200/50 uppercase">
                Studio Mode
              </span>
              <h3 className="font-serif text-lg font-semibold text-stone-950">Artwork Canvas</h3>
            </div>

            {/* Preview of active visual */}
            <div className="relative aspect-3/4 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shadow-inner flex items-center justify-center">
              {uploadedImageUrl ? (
                <img src={uploadedImageUrl} alt="Uploaded painting" className="w-full h-full object-cover" />
              ) : customUrl ? (
                <img src={customUrl} alt="Custom URL painting" className="w-full h-full object-cover" />
              ) : selectedPresetIndex !== null ? (
                <img src={STYLE_PRESETS[selectedPresetIndex].url} alt="Preset painting" className="w-full h-full object-cover" />
              ) : (
                <div className="text-stone-400 text-center p-4">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="font-sans text-xs">No Canvas Selected</p>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 text-[10px] text-white px-2 py-0.5 rounded-sm backdrop-blur-xs font-mono">
                LIVE CANVAS PREVIEW
              </div>
            </div>

            {/* Preset Selection Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider font-sans">
                OR Select Studio Preset:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {STYLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(idx)}
                    title={`${preset.name} (${preset.genre})`}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all cursor-pointer ${
                      selectedPresetIndex === idx ? 'border-amber-700 shadow-md scale-102' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    {selectedPresetIndex === idx && (
                      <div className="absolute inset-0 bg-amber-900/35 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200">
            <p className="font-sans text-[10px] text-stone-400 italic">
              Posting a work adds it instantly to the main portfolio collection and commits it to local storage.
            </p>
          </div>
        </div>

        {/* Right Column: Data Entry Form (7 cols) */}
        <form onSubmit={handleFormSubmit} className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight">Post New Painting</h2>
              <p className="font-sans text-xs text-stone-500 mt-1">
                Elegantly archive your latest creation to make it immediately discoverable by collectors visiting the studio website.
              </p>
            </div>

            {/* Core Artwork Metadata */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Artwork Title <span className="text-amber-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dawn Breaks Over Cape Kiwanda"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm font-sans bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Medium / Materials
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oil on Canvas"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    className="w-full text-sm font-sans bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Physical Dimensions
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18 x 24 inches"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full text-sm font-sans bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Category List
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm font-sans bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors"
                  >
                    <option value="Landscape">Landscape</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Still Life">Still Life</option>
                    <option value="Seascape">Seascape</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Creative Year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2030"
                    required
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full text-sm font-sans bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Pricing (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-stone-400 font-sans text-xs">$</span>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full text-sm font-sans pl-6 bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Custom URL */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-sm font-sans bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors"
                  >
                    <option value="Available">Available for Purchase</option>
                    <option value="Sold">Sold / Private Collection</option>
                    <option value="Reserved">Reserved for Exhibition</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Or Paste Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={customUrl}
                    onFocus={handleCustomUrlFocus}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full text-[11px] font-sans bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors"
                  />
                </div>
              </div>

              {/* Image Upload Drag-and-drop integrated */}
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Or Upload Canvas File (Drag & Drop)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-lg p-3.5 text-center transition-all cursor-pointer ${
                    isDragOver 
                      ? 'border-amber-700 bg-amber-50/20' 
                      : uploadedImageUrl 
                        ? 'border-emerald-500 bg-emerald-50/10'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className={`w-5 h-5 mx-auto mb-1 ${uploadedImageUrl ? 'text-emerald-600' : 'text-stone-400'}`} />
                  {uploadedImageUrl ? (
                    <span className="font-sans text-xs font-medium text-emerald-700 block">
                      ✓ Real Artwork File Selected
                    </span>
                  ) : (
                    <>
                      <span className="font-sans text-xs font-medium text-stone-700 block">
                        Drag and drop your painting photo here
                      </span>
                      <span className="font-sans text-[10px] text-stone-400 block mt-0.5">
                        or click to browse local files (jpg, png)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description curator statement */}
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Artist Commentary / Description
                </label>
                <textarea
                  placeholder="Share details about the inspiration behind this canvas, the brushwork, color theories, or frame setups..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full text-sm font-sans bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-stone-150 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-md font-sans text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-stone-900 hover:bg-amber-800 text-white rounded-md font-sans text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Canvas</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

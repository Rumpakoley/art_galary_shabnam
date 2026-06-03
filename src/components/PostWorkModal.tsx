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
  theme?: 'light' | 'dark' | 'funky';
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

export default function PostWorkModal({ onClose, onPost, theme = 'dark' }: PostWorkModalProps) {
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
        className={`relative border overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] transition-all duration-300 rounded-xl ${
          theme === 'dark'
            ? 'bg-[#0E0D0C] border-stone-850 text-stone-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)]' :
          theme === 'funky'
            ? 'bg-[#150d2c] border-purple-900/60 text-purple-200 shadow-[0_25px_50px_-12px_rgba(127,0,255,0.4)]'
            : 'bg-white border-stone-200 shadow-2xl text-stone-900'
        }`}
      >
        {/* Header bar close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className={`p-2 rounded-full cursor-pointer transition-colors border ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-800' :
              theme === 'funky'
                ? 'bg-purple-955/80 border-purple-800 text-fuchsia-400 hover:text-fuchsia-200 hover:bg-purple-900/90'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border-stone-200/60'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Left Column: Visual Canvas Selection (4 cols) */}
        <div className={`md:col-span-5 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#121110] border-stone-850' :
          theme === 'funky' ? 'bg-[#0a0418] border-purple-900/40' :
          'bg-stone-50 border-stone-200'
        }`}>
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className={`p-1 px-2.5 font-sans text-[10px] font-semibold tracking-wider rounded-sm border uppercase ${
                theme === 'dark' ? 'bg-stone-900 text-amber-450 border-stone-850' :
                theme === 'funky' ? 'bg-purple-950/60 text-fuchsia-400 border-purple-800/40 text-glow-neon' :
                'bg-amber-50 text-amber-800 border-amber-200/50'
              }`}>
                Studio Mode
              </span>
              <h3 className={`font-serif text-lg font-semibold ${
                theme === 'dark' ? 'text-stone-100' :
                theme === 'funky' ? 'text-purple-100 font-bold' :
                'text-stone-950'
              }`}>Artwork Canvas</h3>
            </div>

            {/* Preview of active visual */}
            <div className={`relative aspect-3/4 rounded-lg overflow-hidden border shadow-inner flex items-center justify-center transition-colors duration-300 ${
              theme === 'dark' ? 'bg-stone-900 border-stone-850' :
              theme === 'funky' ? 'bg-purple-950/40 border-purple-900/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]' :
              'bg-stone-100 border-stone-200'
            }`}>
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
              <label className={`block text-xs font-semibold uppercase tracking-wider font-sans ${
                theme === 'funky' ? 'text-purple-300' : 'text-stone-500'
              }`}>
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
                      selectedPresetIndex === idx 
                        ? theme === 'funky' 
                          ? 'border-fuchsia-500 shadow-md scale-102'
                          : 'border-amber-700 shadow-md scale-102' 
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    {selectedPresetIndex === idx && (
                      <div className={`absolute inset-0 flex items-center justify-center ${
                        theme === 'funky' ? 'bg-fuchsia-950/40' : 'bg-amber-900/35'
                      }`}>
                        <Check className="w-4 h-4 text-white stroke-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`mt-6 pt-4 border-t ${theme === 'dark' ? 'border-stone-850' : theme === 'funky' ? 'border-purple-900/30' : 'border-stone-200'}`}>
            <p className={`font-sans text-[10px] italic ${theme === 'funky' ? 'text-purple-400' : 'text-stone-400'}`}>
              Posting a work adds it instantly to the main portfolio collection and commits it to local storage.
            </p>
          </div>
        </div>

        {/* Right Column: Data Entry Form (7 cols) */}
        <form onSubmit={handleFormSubmit} className={`md:col-span-7 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#131211] text-stone-250' :
          theme === 'funky' ? 'bg-[#12072b] text-purple-200' :
          'bg-white text-stone-900'
        }`}>
          <div className="space-y-5">
            <div>
              <h2 className={`font-serif text-2xl font-bold leading-tight ${
                theme === 'dark' ? 'text-stone-100' :
                theme === 'funky' ? 'text-cyan-400 text-glow-cyan' :
                'text-stone-900'
              }`}>Post New Painting</h2>
              <p className={`font-sans text-xs mt-1 ${
                theme === 'funky' ? 'text-purple-305' : 'text-stone-500'
              }`}>
                Elegantly archive your latest creation to make it immediately discoverable by collectors visiting the studio website.
              </p>
            </div>

            {/* Core Artwork Metadata */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className={`block font-sans text-xs font-semibold uppercase tracking-wider ${
                  theme === 'funky' ? 'text-purple-300' : 'text-stone-700'
                }`}>
                  Artwork Title <span className={theme === 'funky' ? 'text-fuchsia-400' : 'text-amber-705'}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dawn Breaks Over Cape Kiwanda"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors ${
                    theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:bg-stone-950 focus:border-amber-500' :
                    theme === 'funky' ? 'bg-[#150d2c] border-purple-800/80 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                    'bg-stone-55 focus:bg-white border-stone-200 focus:border-amber-700'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`block font-sans text-xs font-semibold uppercase tracking-wider ${
                    theme === 'funky' ? 'text-purple-300' : 'text-stone-700'
                  }`}>
                    Medium / Materials
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oil on Canvas"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors ${
                      theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:bg-stone-950 focus:border-amber-500' :
                      theme === 'funky' ? 'bg-[#150d2c] border-purple-800/80 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                      'bg-stone-55 focus:bg-white border-stone-200 focus:border-amber-700'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`block font-sans text-xs font-semibold uppercase tracking-wider ${
                    theme === 'funky' ? 'text-purple-300' : 'text-stone-700'
                  }`}>
                    Physical Dimensions
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18 x 24 inches"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors ${
                      theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:bg-stone-950 focus:border-amber-500' :
                      theme === 'funky' ? 'bg-[#150d2c] border-purple-800/80 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                      'bg-stone-55 focus:bg-white border-stone-200 focus:border-amber-700'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className={`block font-sans text-xs font-semibold uppercase tracking-wider ${
                    theme === 'funky' ? 'text-purple-300' : 'text-stone-700'
                  }`}>
                    Category List
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors ${
                      theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:bg-stone-950 focus:border-amber-500' :
                      theme === 'funky' ? 'bg-[#150d2c] border-purple-800/80 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                      'bg-stone-55 focus:bg-white border-stone-200 focus:border-amber-700'
                    }`}
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
                  <label className={`block font-sans text-xs font-semibold uppercase tracking-wider ${
                    theme === 'funky' ? 'text-purple-300' : 'text-stone-700'
                  }`}>
                    Creative Year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2030"
                    required
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors ${
                      theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:bg-stone-950 focus:border-amber-500' :
                      theme === 'funky' ? 'bg-[#150d2c] border-purple-800/80 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                      'bg-stone-55 focus:bg-white border-stone-200 focus:border-amber-700'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`block font-sans text-xs font-semibold uppercase tracking-wider ${
                    theme === 'funky' ? 'text-purple-300' : 'text-stone-700'
                  }`}>
                    Pricing (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-stone-400 font-sans text-xs">$</span>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full text-sm font-sans pl-6 border focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors ${
                        theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:bg-stone-950 focus:border-amber-500' :
                        theme === 'funky' ? 'bg-[#150d2c] border-purple-800/80 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                        'bg-stone-55 focus:bg-white border-stone-200 focus:border-amber-700'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Status and Custom URL */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`block font-sans text-xs font-semibold uppercase tracking-wider ${
                    theme === 'funky' ? 'text-purple-300' : 'text-stone-700'
                  }`}>
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors ${
                      theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:bg-stone-950 focus:border-amber-500' :
                      theme === 'funky' ? 'bg-[#150d2c] border-purple-800/80 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                      'bg-stone-55 focus:bg-white border-stone-200 focus:border-amber-700'
                    }`}
                  >
                    <option value="Available">Available for Purchase</option>
                    <option value="Sold">Sold / Private Collection</option>
                    <option value="Reserved">Reserved for Exhibition</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`block font-sans text-xs font-semibold uppercase tracking-wider ${
                    theme === 'funky' ? 'text-purple-300' : 'text-stone-700'
                  }`}>
                    Or Paste Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={customUrl}
                    onFocus={handleCustomUrlFocus}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className={`w-full text-[11px] font-sans border focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors ${
                      theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:bg-stone-950 focus:border-amber-500' :
                      theme === 'funky' ? 'bg-[#150d2c] border-purple-800/80 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                      'bg-stone-55 focus:bg-white border-stone-200 focus:border-amber-700'
                    }`}
                  />
                </div>
              </div>

              {/* Image Upload Drag-and-drop integrated */}
              <div className="space-y-1">
                <label className={`block font-sans text-xs font-semibold uppercase tracking-wider ${
                  theme === 'funky' ? 'text-purple-300' : 'text-stone-700'
                }`}>
                  Or Upload Canvas File (Drag & Drop)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-lg p-3.5 text-center transition-all cursor-pointer ${
                    isDragOver 
                      ? theme === 'funky' ? 'border-fuchsia-500 bg-fuchsia-955/20' : 'border-amber-700 bg-amber-55/20' 
                      : uploadedImageUrl 
                        ? 'border-emerald-500 bg-emerald-50/10'
                        : theme === 'dark' ? 'border-stone-800 bg-stone-900/50 hover:bg-stone-900' :
                        theme === 'funky' ? 'border-purple-900/60 bg-[#150d2c] hover:bg-purple-950/20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]' :
                        'border-stone-200 bg-stone-50 hover:bg-stone-100/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className={`w-5 h-5 mx-auto mb-1 ${uploadedImageUrl ? 'text-emerald-605' : theme === 'funky' ? 'text-fuchsia-400' : 'text-stone-400'}`} />
                  {uploadedImageUrl ? (
                    <span className="font-sans text-xs font-medium text-emerald-700 block">
                      ✓ Real Artwork File Selected
                    </span>
                  ) : (
                    <>
                      <span className={`font-sans text-xs font-medium block ${theme === 'funky' ? 'text-purple-200' : 'text-stone-700'}`}>
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
                <label className={`block font-sans text-xs font-semibold uppercase tracking-wider ${
                  theme === 'funky' ? 'text-purple-300' : 'text-stone-700'
                }`}>
                  Artist Commentary / Description
                </label>
                <textarea
                  placeholder="Share details about the inspiration behind this canvas, the brushwork, color theories, or frame setups..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-md shadow-2xs transition-colors resize-none ${
                    theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:bg-stone-955 focus:border-amber-505' :
                    theme === 'funky' ? 'bg-[#150d2c] border-purple-800/80 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                    'bg-stone-55 focus:bg-white border-stone-200 focus:border-amber-700'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className={`mt-8 pt-5 border-t flex items-center justify-end gap-3 transition-colors duration-300 ${
            theme === 'dark' ? 'border-stone-850' :
            theme === 'funky' ? 'border-purple-900/30' :
            'border-stone-150'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2 border rounded-md font-sans text-sm transition-colors cursor-pointer ${
                theme === 'dark' ? 'border-stone-800 text-stone-300 hover:text-stone-100 hover:bg-stone-800' :
                theme === 'funky' ? 'border-purple-800 text-purple-300 hover:text-purple-100 hover:bg-purple-900/40' :
                'border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-md font-sans text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer border-0 ${
                theme === 'dark' ? 'bg-amber-500 hover:bg-amber-400 text-stone-950' :
                theme === 'funky' ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]' :
                'bg-stone-900 hover:bg-amber-800 text-white'
              }`}
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

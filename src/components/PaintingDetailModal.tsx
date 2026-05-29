/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Painting } from '../types';
import { X, Calendar, SlidersHorizontal, ArrowRight, CheckCircle2, Mail, Info } from 'lucide-react';

interface PaintingDetailModalProps {
  painting: Painting | null;
  onClose: () => void;
}

export default function PaintingDetailModal({ painting, onClose }: PaintingDetailModalProps) {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!painting) return null;

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMsg) return;

    setIsSubmitting(true);
    // Simulate a classy inquiry submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMsg('');
    }, 1200);
  };

  const isAvailable = painting.status === 'Available';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-zoom-out"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-stone-50 border border-stone-200/80 rounded-xl overflow-hidden shadow-2xl max-w-5xl w-full text-stone-900 grid grid-cols-1 md:grid-cols-12 min-h-[500px]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-stone-100/90 text-stone-700 hover:text-stone-900 hover:bg-stone-200/90 rounded-full transition-all border border-stone-200 cursor-pointer shadow-xs"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Panel: Fine Art Frame Showcase (8 cols on lg) */}
          <div className="md:col-span-7 bg-stone-100 p-6 md:p-10 flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-200/70 relative">
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 shadow-[inset_0_0_40px_rgba(0,0,0,0.04)]" />

            {/* Simulated Floating Art Plinth Frame */}
            <div className="relative shadow-2xl border-8 border-stone-200 bg-white p-3 rounded-xs max-w-full max-h-[550px] overflow-hidden flex items-center justify-center">
              <img
                src={painting.imageUrl}
                alt={painting.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[460px] object-contain"
              />
              {/* Simulated reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
              {/* Inner frame shadow */}
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/15 shadow-[inset_0_2px_15px_rgba(0,0,0,0.12)]" />
            </div>
          </div>

          {/* Right Panel: Curatorial Info & Interactive Commission / Inquiry (5 cols) */}
          <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[650px] bg-white">
            <div>
              {/* Category Breadcrumb */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-amber-800 bg-stone-100 px-2 py-1 rounded-sm border border-stone-200/50">
                  {painting.category}
                </span>
                <span className="text-stone-300 font-sans">•</span>
                <span className="text-[11px] font-sans text-stone-500 font-medium">
                  Catalog ID: {painting.id.toUpperCase()}
                </span>
              </div>

              {/* Title & Metadata */}
              <h2 className="font-serif text-2xl md:text-3xl text-stone-900 font-semibold tracking-tight leading-tight">
                {painting.title}
              </h2>

              <p className="font-serif italic text-stone-600 text-sm mt-1">
                {painting.medium}, {painting.year}
              </p>

              <div className="flex items-center gap-4 mt-4 py-2.5 px-3 bg-stone-50 border border-stone-150/60 rounded-md">
                <div className="flex items-center gap-1.5 text-xs text-stone-600 font-sans">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
                  <span>{painting.dimensions}</span>
                </div>
                <div className="w-px h-4 bg-stone-200" />
                <div className="flex items-center gap-1.5 text-xs text-stone-600 font-sans">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Acquired in {painting.year}</span>
                </div>
              </div>

              {/* Painting description */}
              <div className="mt-5 space-y-3">
                <h4 className="text-[11px] uppercase font-sans font-semibold tracking-wider text-stone-400 flex items-center gap-1">
                  <Info className="w-3 h-3 text-stone-300" />
                  Curatorial Commentary
                </h4>
                <p className="font-sans text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                  {painting.description}
                </p>
              </div>
            </div>

            {/* Bottom Section: Acquisition Panel */}
            <div className="mt-8 pt-6 border-t border-stone-150">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs text-stone-500 font-sans">Status</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-amber-600 animate-pulse' : 'bg-stone-300'}`} />
                  <span className="font-sans text-sm font-semibold text-stone-800 uppercase tracking-wider">{painting.status}</span>
                </div>
              </div>

              {painting.price !== null ? (
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs text-stone-500 font-sans">Acquisition Price</span>
                  <span className="font-serif text-2xl text-stone-950 font-semibold">${painting.price.toLocaleString()} USD</span>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-5 font-sans">
                  <span className="text-xs text-stone-500">Acquisition Price</span>
                  <span className="text-stone-600 italic text-sm">NFS (Not For Sale) / Private Collection</span>
                </div>
              )}

              {/* Inquiry Form */}
              <div className="bg-stone-50 border border-stone-200/60 p-4 rounded-lg">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-4"
                  >
                    <CheckCircle2 className="w-10 h-10 text-amber-600 mb-2" />
                    <h5 className="font-serif font-semibold text-stone-900 text-sm">Inquiry Sent Successfully</h5>
                    <p className="font-sans text-xs text-stone-600 mt-1 max-w-[280px]">
                      Your inquiry regarding <strong>{painting.title}</strong> has been cataloged. Evelyn Vance's studio will contact you promptly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="text-amber-800 hover:text-amber-950 font-sans font-semibold text-[11px] underline mt-3 cursor-pointer"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-3">
                    <h5 className="font-serif font-semibold text-stone-900 text-sm flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-stone-400" />
                      Inquire About This Work
                    </h5>
                    <p className="font-sans text-[11px] text-stone-500">
                      Submit an inquiry to receive custom shipping options, authentication papers, or discuss commission variants.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="Your Name"
                        className="font-sans text-xs bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2 rounded-sm w-full shadow-2xs"
                      />
                      <input
                        type="email"
                        required
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="Your Email"
                        className="font-sans text-xs bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2 rounded-sm w-full shadow-2xs"
                      />
                    </div>

                    <textarea
                      required
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      placeholder={`I am interested in acquiring/viewing "${painting.title}"...`}
                      rows={3}
                      className="font-sans text-xs bg-white border border-stone-200 focus:border-amber-700 focus:outline-hidden p-2 rounded-sm w-full block shadow-2xs resize-none"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-stone-900 hover:bg-amber-900 text-white font-sans text-xs font-medium tracking-wider uppercase py-2 px-4 rounded-sm flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      {isSubmitting ? (
                        <span>Transmitting inquiry...</span>
                      ) : (
                        <>
                          <span>Transmit Studio Inquiry</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

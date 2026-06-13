import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crop, Sparkles, Smile, ZoomIn, ZoomOut, Trash2, Check, RefreshCw } from "lucide-react";
import { OPENMOJI_STICKERS } from "../../utils/stickers";

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSave: (editedBlob: Blob) => Promise<void>;
}

interface StickerInstance {
  id: number;
  url: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const FILTER_PRESETS = [
  { name: "None", value: "none", style: "none" },
  { name: "Grayscale", value: "grayscale", style: "grayscale(1)" },
  { name: "Sepia", value: "sepia", style: "sepia(1)" },
  { name: "Warm", value: "warm", style: "sepia(0.2) saturate(1.4) hue-rotate(-10deg)" },
  { name: "Cool", value: "cool", style: "saturate(1.2) hue-rotate(10deg) brightness(1.05)" },
  { name: "Vintage", value: "vintage", style: "sepia(0.5) contrast(1.2) saturate(1.2)" },
  { name: "Brighten", value: "brighten", style: "brightness(1.3)" },
  { name: "Contrast", value: "contrast", style: "contrast(1.5)" },
];

export default function ImageEditorModal({
  isOpen,
  onClose,
  imageSrc,
  onSave,
}: ImageEditorModalProps) {
  const [activeTab, setActiveTab] = useState<"crop" | "filter" | "stickers">("crop");
  
  // Image layout state
  const [zoom, setZoom] = useState(1);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [stickers, setStickers] = useState<StickerInstance[]>([]);
  const [activeStickerId, setActiveStickerId] = useState<number | null>(null);
  
  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"image" | "sticker" | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartOffset = useRef({ x: 0, y: 0 });
  
  const viewportRef = useRef<HTMLDivElement>(null);
  const [processing, setProcessing] = useState(false);
  
  // Image properties
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0, aspect: 1 });

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setImgDimensions({
          width: img.width,
          height: img.height,
          aspect: img.width / img.height,
        });
        // Reset states
        setZoom(1);
        setImageOffset({ x: 0, y: 0 });
        setSelectedFilter("none");
        setStickers([]);
        setActiveStickerId(null);
      };
    }
  }, [imageSrc]);

  const activeSticker = stickers.find((s) => s.id === activeStickerId);

  // Dragging handlers
  const handleStartDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    
    // Get client coordinates
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    // Get coordinates relative to the viewport
    const rect = viewportRef.current.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    
    // Check if we clicked on a sticker (traverse backwards to select topmost sticker)
    let clickedStickerId: number | null = null;
    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];
      const radius = 30 * s.scale; // Approximate sticker radius in the 200px viewport
      const distance = Math.sqrt(Math.pow(mx - s.x, 2) + Math.pow(my - s.y, 2));
      if (distance < radius) {
        clickedStickerId = s.id;
        break;
      }
    }
    
    if (clickedStickerId !== null) {
      // Start dragging sticker
      setActiveStickerId(clickedStickerId);
      setDragMode("sticker");
      setIsDragging(true);
      const s = stickers.find((st) => st.id === clickedStickerId)!;
      dragStartPos.current = { x: clientX, y: clientY };
      dragStartOffset.current = { x: s.x, y: s.y };
      setActiveTab("stickers");
    } else {
      // Start dragging background image (for cropping)
      setDragMode("image");
      setIsDragging(true);
      dragStartPos.current = { x: clientX, y: clientY };
      dragStartOffset.current = { x: imageOffset.x, y: imageOffset.y };
    }
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !dragMode) return;
    
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - dragStartPos.current.x;
    const dy = clientY - dragStartPos.current.y;
    
    if (dragMode === "image") {
      setImageOffset({
        x: dragStartOffset.current.x + dx,
        y: dragStartOffset.current.y + dy,
      });
    } else if (dragMode === "sticker" && activeStickerId !== null) {
      setStickers((prev) =>
        prev.map((s) =>
          s.id === activeStickerId
            ? { ...s, x: dragStartOffset.current.x + dx, y: dragStartOffset.current.y + dy }
            : s
        )
      );
    }
  };

  const handleStopDrag = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  const addSticker = (url: string) => {
    const newSticker: StickerInstance = {
      id: Date.now(),
      url,
      x: 100, // center of the 200px container
      y: 100,
      scale: 1,
      rotation: 0,
    };
    setStickers((prev) => [...prev, newSticker]);
    setActiveStickerId(newSticker.id);
  };

  const updateSticker = (changes: Partial<StickerInstance>) => {
    if (activeStickerId === null) return;
    setStickers((prev) =>
      prev.map((s) => (s.id === activeStickerId ? { ...s, ...changes } : s))
    );
  };

  const deleteActiveSticker = () => {
    if (activeStickerId === null) return;
    setStickers((prev) => prev.filter((s) => s.id !== activeStickerId));
    setActiveStickerId(null);
  };

  // Compile final image onto Canvas
  const handleApply = async () => {
    setProcessing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create 2D canvas context");

      // Draw background image with selected filter
      const filterObj = FILTER_PRESETS.find((f) => f.value === selectedFilter);
      ctx.filter = filterObj ? filterObj.style : "none";

      const baseImg = new Image();
      baseImg.src = imageSrc;
      await new Promise((resolve, reject) => {
        baseImg.onload = resolve;
        baseImg.onerror = reject;
      });

      // Cover calculations for 500x500 destination size
      let drawWidth = 500;
      let drawHeight = 500;
      if (imgDimensions.aspect > 1) {
        drawWidth = 500 * imgDimensions.aspect;
      } else {
        drawHeight = 500 / imgDimensions.aspect;
      }

      ctx.save();
      ctx.translate(250, 250);
      ctx.translate(imageOffset.x * 2.5, imageOffset.y * 2.5); // coordinates scale 2.5x from 200 viewport to 500 canvas
      ctx.scale(zoom, zoom);
      ctx.drawImage(baseImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      // Reset filter for stickers so stickers retain original color
      ctx.filter = "none";

      // Draw stickers
      for (const sticker of stickers) {
        const sImg = new Image();
        sImg.src = sticker.url;
        await new Promise((resolve, reject) => {
          sImg.onload = resolve;
          sImg.onerror = reject;
        });

        ctx.save();
        ctx.translate(sticker.x * 2.5, sticker.y * 2.5); // coordinates scale 2.5x
        ctx.rotate((sticker.rotation * Math.PI) / 180);
        const baseStickerSize = 150 * sticker.scale; // 60px in 200px container maps to 150px in 500px canvas
        ctx.drawImage(sImg, -baseStickerSize / 2, -baseStickerSize / 2, baseStickerSize, baseStickerSize);
        ctx.restore();
      }

      // Convert to Blob and Save
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            await onSave(blob);
          } else {
            throw new Error("Canvas compilation failed");
          }
        },
        "image/jpeg",
        0.9
      );
    } catch (err) {
      console.error(err);
      alert("Failed to render and save image.");
      setProcessing(false);
    }
  };

  const selectedFilterStyle = FILTER_PRESETS.find((f) => f.value === selectedFilter)?.style ?? "none";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md max-h-[92vh] md:max-h-[95vh] overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-base-300 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-primary" /> Edit Profile Photo
              </h2>
              <button
                onClick={onClose}
                disabled={processing}
                className="p-1.5 rounded-full hover:bg-base-200 text-base-content/60 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Editing Canvas Viewport Container */}
            <div className="p-4 md:p-6 flex flex-col items-center justify-center bg-base-200/30 border-b border-base-300 relative">
              <div
                ref={viewportRef}
                onMouseDown={handleStartDrag}
                onMouseMove={handleDrag}
                onMouseUp={handleStopDrag}
                onMouseLeave={handleStopDrag}
                onTouchStart={handleStartDrag}
                onTouchMove={handleDrag}
                onTouchEnd={handleStopDrag}
                className="w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-primary/20 bg-black relative select-none cursor-move shadow-inner"
              >
                {/* Background Image with CSS Transform & CSS Filters */}
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt=""
                    draggable="false"
                    className="absolute pointer-events-none select-none max-w-none origin-center"
                    style={{
                      width: imgDimensions.aspect > 1 ? `${200 * imgDimensions.aspect}px` : "200px",
                      height: imgDimensions.aspect > 1 ? "200px" : `${200 / imgDimensions.aspect}px`,
                      top: "50%",
                      left: "50%",
                      marginLeft: imgDimensions.aspect > 1 ? `${-100 * imgDimensions.aspect}px` : "-100px",
                      marginTop: imgDimensions.aspect > 1 ? "-100px" : `${-100 / imgDimensions.aspect}px`,
                      transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${zoom})`,
                      filter: selectedFilterStyle,
                    }}
                  />
                )}

                {/* Stickers rendered on top */}
                {stickers.map((s) => (
                  <div
                    key={s.id}
                    className={`absolute pointer-events-none select-none origin-center ${
                      activeStickerId === s.id ? "ring-2 ring-primary rounded-lg" : ""
                    }`}
                    style={{
                      left: `${s.x}px`,
                      top: `${s.y}px`,
                      width: "60px",
                      height: "60px",
                      marginLeft: "-30px",
                      marginTop: "-30px",
                      transform: `scale(${s.scale}) rotate(${s.rotation}deg)`,
                    }}
                  >
                    <img
                      src={s.url}
                      alt="sticker"
                      draggable="false"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider mt-2 md:mt-3 select-none">
                Drag to align photo • Tap stickers to modify
              </p>
            </div>
             {/* Mode Selector Tabs */}
            <div className="flex border-b border-base-300">
              <button
                onClick={() => setActiveTab("crop")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === "crop"
                    ? "border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 bg-red-500/5 dark:bg-red-400/5"
                    : "border-transparent text-base-content/60 hover:text-base-content hover:bg-base-200/50"
                }`}
              >
                <Crop size={14} /> Crop
              </button>
              <button
                onClick={() => setActiveTab("filter")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === "filter"
                    ? "border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 bg-red-500/5 dark:bg-red-400/5"
                    : "border-transparent text-base-content/60 hover:text-base-content hover:bg-base-200/50"
                }`}
              >
                <Sparkles size={14} /> Filters
              </button>
              <button
                onClick={() => setActiveTab("stickers")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === "stickers"
                    ? "border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 bg-red-500/5 dark:bg-red-400/5"
                    : "border-transparent text-base-content/60 hover:text-base-content hover:bg-base-200/50"
                }`}
              >
                <Smile size={14} /> Stickers
              </button>
            </div>

            {/* Control Panel Area */}
            <div className="p-4 md:p-5 flex-1 min-h-0 md:min-h-[160px] max-h-[220px] overflow-y-auto bg-base-200/10">
              {/* CROP MODE */}
              {activeTab === "crop" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-base-content/60 flex items-center gap-1">
                      <ZoomOut size={12} /> Size
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="range range-xs range-primary flex-1"
                    />
                    <span className="text-xs font-bold text-base-content/60 flex items-center gap-1">
                      <ZoomIn size={12} />
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setZoom(1);
                      setImageOffset({ x: 0, y: 0 });
                    }}
                    className="btn btn-xs btn-outline btn-ghost w-full rounded-lg font-bold text-[10px] uppercase tracking-wider gap-1.5"
                  >
                    <RefreshCw size={10} /> Reset Position
                  </button>
                </div>
              )}

              {/* FILTER MODE */}
              {activeTab === "filter" && (
                <div className="grid grid-cols-4 gap-2">
                  {FILTER_PRESETS.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setSelectedFilter(filter.value)}
                      className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl border-2 transition-all w-full select-none ${
                        selectedFilter === filter.value
                          ? "border-primary bg-primary/5 text-primary scale-102"
                          : "border-transparent text-base-content/75 hover:bg-base-200/50"
                      }`}
                    >
                      <div
                        className="w-11 h-11 rounded-lg bg-base-300 overflow-hidden relative"
                        style={{ filter: filter.style }}
                      >
                        <img src={imageSrc} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="text-[9px] font-bold truncate w-full text-center mt-1">
                        {filter.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* STICKERS MODE */}
              {activeTab === "stickers" && (
                <div className="space-y-4">
                  {/* Sticker controls (shown when a sticker is active) */}
                  {activeSticker ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border border-base-300 rounded-2xl p-3 bg-base-200/50 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-base-300/40 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-base-content/50">
                          Modify Selected Sticker
                        </span>
                        <button
                          onClick={deleteActiveSticker}
                          className="btn btn-ghost btn-circle btn-xs text-error hover:bg-error/10"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      
                      {/* Scale Slider */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-base-content/60 w-12 uppercase">
                          Scale
                        </span>
                        <input
                          type="range"
                          min="0.3"
                          max="2.5"
                          step="0.05"
                          value={activeSticker.scale}
                          onChange={(e) => updateSticker({ scale: parseFloat(e.target.value) })}
                          className="range range-xs range-primary flex-1"
                        />
                      </div>

                      {/* Rotate Slider */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-base-content/60 w-12 uppercase">
                          Rotate
                        </span>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="5"
                          value={activeSticker.rotation}
                          onChange={(e) => updateSticker({ rotation: parseInt(e.target.value) })}
                          className="range range-xs range-primary flex-1"
                        />
                      </div>
                    </motion.div>
                  ) : null}

                  {/* Stickers picker grid */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-base-content/50 mb-2">
                      Add a Sticker
                    </p>
                    <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1 border border-base-300/30 rounded-xl p-2 bg-base-200/30">
                      {OPENMOJI_STICKERS.map((url, i) => (
                        <button
                          key={i}
                          onClick={() => addSticker(url)}
                          className="p-1 hover:bg-base-200 rounded-lg transition-colors aspect-square flex items-center justify-center select-none"
                        >
                          <img
                            src={url}
                            alt="Sticker"
                            loading="lazy"
                            className="w-full h-full object-contain hover:scale-110 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-base-300 flex gap-3">
              <button
                onClick={onClose}
                disabled={processing}
                className="btn btn-sm flex-1 bg-base-200 hover:bg-base-300 text-base-content border-none rounded-xl h-10 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={processing}
                className="btn btn-sm flex-1 bg-[#1D4ED8] hover:bg-blue-800 text-white border-none rounded-xl h-10 font-black shadow-lg shadow-primary/20"
              >
                {processing ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                {processing ? "Processing…" : "Apply & Save"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

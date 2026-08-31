import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import api from "../lib/api";

// Drag-and-drop / tap-to-upload image picker. Uploads immediately to
// Cloudinary via POST /api/upload and hands the resulting permanent URL
// back through onUploaded — the parent just stores that URL string and
// sends it along with the rest of its form (imageUrl field on MenuItem
// and Waiter). `value` is the current imageUrl (for edit flows).
export default function ImageUploader({ value, onUploaded, label = "Photo", shape = "square" }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded(res.data.url);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Try again.");
      setPreview(value || "");
    } finally {
      setUploading(false);
    }
  }

  function clear() {
    setPreview("");
    onUploaded("");
  }

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-2xl";

  return (
    <div>
      {label && <p className="text-xs font-medium text-ink/50 dark:text-paper/50 mb-1.5">{label}</p>}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative w-28 h-28 ${shapeClass} border-3 border-dashed cursor-pointer overflow-hidden flex items-center justify-center transition-colors ${
          dragOver ? "border-copper bg-copper/10" : "border-ink/25 bg-paper-dim dark:bg-ink hover:border-ink dark:border-ink-line dark:hover:border-paper"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.img
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: uploading ? 0.5 : 1 }}
              exit={{ opacity: 0 }}
              src={preview}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1 text-ink/35 dark:text-paper/35"
            >
              <Camera size={20} strokeWidth={1.75} />
              <span className="text-[10px] font-medium">Add photo</span>
            </motion.div>
          )}
        </AnimatePresence>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/20">
            <Loader2 size={20} className="text-paper animate-spin" />
          </div>
        )}

        {preview && !uploading && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            aria-label="Remove photo"
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/70 text-paper flex items-center justify-center hover:bg-ink"
          >
            <X size={12} />
          </motion.button>
        )}

        {!preview && !uploading && (
          <div className="absolute bottom-1 right-1 text-ink/25 dark:text-paper/25">
            <Upload size={12} />
          </div>
        )}
      </div>
      {error && <p className="text-danger text-xs mt-1 max-w-28">{error}</p>}
    </div>
  );
}

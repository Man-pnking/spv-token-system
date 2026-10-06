"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Avatar from "./Avatar";

export default function AvatarUpload({ userId, currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || null);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File must be under 2 MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Must be an image");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const ext = file.name.split(".").pop();
      const fileName = userId + "/" + Date.now() + "." + ext;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      setPreviewUrl(publicUrl);
      if (onUploaded) onUploaded(publicUrl);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar url={previewUrl} size={64} />
      <div className="flex-1">
        <label className="btn-ghost text-xs cursor-pointer inline-block">
          {uploading ? "Uploading..." : "Choose image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <div className="text-[10px] text-warm-mute mt-2">
          JPG, PNG, or GIF. Max 2 MB.
        </div>
        {error && <div className="text-[10px] text-red-400 mt-1">{error}</div>}
      </div>
    </div>
  );
}

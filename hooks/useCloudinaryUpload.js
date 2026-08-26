"use client";

import { useState, useCallback } from "react";

/**
 * Hook for uploading files to Cloudinary via signed upload.
 * Handles: signature fetching → client validation → direct upload → returns secure URL.
 *
 * @param {object} options
 * @param {"avatar"|"token-logo"|"token-banner"|"task-image"} options.type - Upload type
 * @param {string} options.walletAddress - Connected wallet address for auth
 */
export function useCloudinaryUpload({ type, walletAddress }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const upload = useCallback(
    async (file) => {
      if (!file || !walletAddress) return null;
      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        // Step 1: Get signed upload credentials from our API
        const sigRes = await fetch("/api/upload/signature", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-wallet-address": walletAddress,
          },
          body: JSON.stringify({ type }),
        });

        if (!sigRes.ok) {
          const sigErr = await sigRes.json();
          throw new Error(sigErr.message || "Failed to get upload signature");
        }

        const { signature, timestamp, apiKey, cloudName, folder, maxFileSize, allowedFormats } =
          await sigRes.json();

        // Step 2: Client-side validation
        if (file.size > maxFileSize) {
          throw new Error(`File too large. Max size: ${Math.round(maxFileSize / 1024 / 1024)}MB`);
        }

        const ext = file.name.split(".").pop()?.toLowerCase();
        if (allowedFormats && allowedFormats.length > 0 && ext && !allowedFormats.includes(ext)) {
          throw new Error(`Invalid format. Allowed: ${allowedFormats.join(", ")}`);
        }

        // Step 3: Upload directly to Cloudinary
        // CRITICAL: Only include params that were part of the signature hash
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folder);

        const uploadRes = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
          );

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              try {
                const errData = JSON.parse(xhr.responseText);
                reject(new Error(errData.error?.message || "Upload failed"));
              } catch {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          };

          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.send(formData);
        });

        setProgress(100);
        return uploadRes.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        setError(err.message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [type, walletAddress]
  );

  return { upload, isUploading, progress, error };
}

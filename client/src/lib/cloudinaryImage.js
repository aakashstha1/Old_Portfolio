// Cloudinary lets you resize/compress an already-uploaded image just by
// editing its URL — no re-upload needed. This inserts a transformation
// segment right after "/upload/".
//
// f_auto  -> serves WebP/AVIF to browsers that support it (much smaller than JPEG)
// q_auto  -> automatic quality compression (visually lossless, way smaller file)
// w_/h_   -> resizes server-side so you're not downloading a 4000px photo for a 500px circle
// c_fill,g_face -> crops to fill the box, centered on the detected face
export const optimizeCloudinaryUrl = (
  url,
  { width, height, crop = "fill", gravity = "auto" } = {},
) => {
  if (!url || !url.includes("/upload/")) return url; // not a Cloudinary URL, leave as-is

  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  // "limit" just caps the size without cropping (use for object-contain images);
  // "fill"/"fill+gravity" crops to exactly fill the box (use for object-cover images)
  if (width || height) {
    transforms.push(`c_${crop}`);
    if (crop === "fill") transforms.push(`g_${gravity}`);
  }

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
};

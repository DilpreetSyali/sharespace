const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function getImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
}
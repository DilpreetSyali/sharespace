import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import PageShell from "../components/PageShell.jsx";

const CATEGORIES = ["Books", "Electronics", "Furniture", "Clothing", "Sports", "Other"];
const CONDITIONS = [
  { label: "Like New", value: "like-new" },
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
  { label: "Poor", value: "poor" },
];
const LOCATIONS = ["Library", "Dorm", "Campus Center", "Gym", "Other"];

export default function CreateItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "good",
    isFree: false,
    price: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const previewUrl = useMemo(() => {
    if (!image) return "";
    return URL.createObjectURL(image);
  }, [image]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onChange = (e) => {
    setErr("");
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "isFree" && checked ? { price: "" } : {}),
    }));
  };

  const onImageChange = (e) => {
    setErr("");
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErr("Please upload a valid image file");
      return;
    }

    setImage(file);
  };

  const removeImage = () => {
    setImage(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.title.trim()) return setErr("Title required");
    if (!form.category) return setErr("Category required");
    if (!form.location) return setErr("Location required");
    if (!form.isFree && (form.price === "" || Number(form.price) < 0)) {
      return setErr("Valid price required");
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("category", form.category);
      fd.append("condition", form.condition);
      fd.append("location", form.location);
      fd.append("isFree", String(form.isFree));
      fd.append("price", form.isFree ? "0" : String(Number(form.price)));

      if (image) {
        fd.append("images", image, image.name);
      }

      await api.post("/api/items", fd);

      navigate("/dashboard");
    } catch (error) {
      console.error("Create item failed:", error);
      setErr(error?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Post Item</h1>
          <p className="text-sm text-slate-500 mb-6">Share items with your campus community</p>

          {err && (<div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg sm:rounded-xl mb-6 text-sm flex items-start gap-3">
            <span>⚠️</span>
            <span>{err}</span>
          </div>)}

          <form onSubmit={submit} className="space-y-5" encType="multipart/form-data">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Item Title *</label>
              <input
                name="title"
                placeholder="e.g., Used Calculus Textbook, Desk Lamp..."
                value={form.title}
                onChange={onChange}
                className="w-full border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea
                name="description"
                placeholder="Describe your item, condition, features..."
                value={form.description}
                onChange={onChange}
                className="w-full border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition text-sm min-h-28 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="w-full border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition text-sm"
                  required
                >
                  <option value="">Choose category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Condition *</label>
                <select
                  name="condition"
                  value={form.condition}
                  onChange={onChange}
                  className="w-full border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition text-sm"
                  required
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location *</label>
              <select
                name="location"
                value={form.location}
                onChange={onChange}
                className="w-full border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition text-sm"
                required
              >
                <option value="">Choose location</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isFree" checked={form.isFree} onChange={onChange} className="w-4 h-4" />
                <span className="text-sm font-medium text-slate-700">Free item</span>
              </label>

              {!form.isFree && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.price}
                    onChange={onChange}
                    className="w-full border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition text-sm"
                    required
                  />
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-5">
              <label className="block text-xs font-semibold text-slate-700 mb-3">Photo (Optional)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition cursor-pointer">
                <input
                  type="file"
                  name="images"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={onImageChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="text-2xl mb-2">📸</div>
                  <div className="text-sm font-medium text-slate-700">Click to upload</div>
                  <div className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP (max 5MB)</div>
                </label>
              </div>

              {previewUrl && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="h-32 w-32 object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 text-sm font-bold transition flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-lg font-semibold disabled:opacity-60 transition shadow-sm hover:shadow-md mt-6"
            >
              {loading ? "Posting... " : "Post Item"}
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
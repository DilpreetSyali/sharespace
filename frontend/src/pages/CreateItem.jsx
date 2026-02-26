import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import PageShell from "../components/PageShell.jsx";

export default function CreateItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "books",
    condition: "good",
    isFree: true,
    price: 0,
    location: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onPickImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImages(files);

    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("condition", form.condition);
      fd.append("isFree", String(form.isFree));
      fd.append("price", String(form.isFree ? 0 : form.price));
      fd.append("location", form.location);

      images.forEach((img) => fd.append("images", img));

      await api.post("/api/items", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/dashboard");
    } catch (error) {
      setErr(error?.response?.data?.message || error?.message || "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900">Post an item</h1>
          <p className="text-sm text-slate-500 mt-1">Add up to 5 photos.</p>

          {err && (
            <div className="mt-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-2xl p-3">
              {err}
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <input
              className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={onChange}
              required
            />

            <textarea
              className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={onChange}
              rows={3}
            />

            <div className="grid sm:grid-cols-2 gap-3">
              <select
                className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
                name="category"
                value={form.category}
                onChange={onChange}
              >
                <option value="books">Books</option>
                <option value="electronics">Electronics</option>
                <option value="stationery">Stationery</option>
                <option value="hostel">Hostel</option>
                <option value="other">Other</option>
              </select>

              <select
                className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
                name="condition"
                value={form.condition}
                onChange={onChange}
              >
                <option value="like-new">Like new</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <input
              className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
              name="location"
              placeholder="Location (e.g. Hostel A)"
              value={form.location}
              onChange={onChange}
              required
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFree"
                checked={form.isFree}
                onChange={onChange}
              />
              <span className="text-sm text-slate-700 font-semibold">This item is free</span>
            </div>

            {!form.isFree && (
              <input
                className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
                name="price"
                type="number"
                min="0"
                placeholder="Price (₹)"
                value={form.price}
                onChange={onChange}
              />
            )}

            {/* ✅ Image uploader */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onPickImages}
                className="block w-full text-sm"
              />
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border bg-slate-50">
                      <img src={src} alt={`preview-${i}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full rounded-2xl p-3 font-extrabold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 transition"
            >
              {loading ? "Posting..." : "Post item"}
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
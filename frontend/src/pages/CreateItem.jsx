import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import PageShell from "../components/PageShell.jsx";

const CATEGORIES = ["Books", "Electronics", "Furniture", "Clothing", "Sports", "Other"];
const CONDITIONS = ["New", "Like new", "Good", "Fair", "Poor"];
const LOCATIONS = ["Library", "Dorm", "Campus Center", "Gym", "Other"];

export default function CreateItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "Good",
    isFree: false,
    price: "",
    location: "",
  });

  const [images, setImages] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setErr(""); // Clear error when user starts typing
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setErr("Maximum 5 images allowed");
      return;
    }
    setImages((p) => [...p, ...files]);
  };

  const removeImage = (idx) => {
    setImages((p) => p.filter((_, i) => i !== idx));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    // Validation
    if (!form.title.trim()) {
      setErr("Title is required");
      return;
    }
    if (!form.category) {
      setErr("Category is required");
      return;
    }
    if (!form.location) {
      setErr("Location is required");
      return;
    }
    if (images.length === 0) {
      setErr("At least 1 photo is required");
      return;
    }
    if (!form.isFree && !form.price) {
      setErr("Price is required for non-free items");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      formData.append("isFree", String(form.isFree));
      formData.append("price", String(form.price || 0));
      formData.append("location", form.location);

      // Append all image files
      images.forEach((img) => {
        formData.append("images", img);
      });

      console.log("Form state before sending:", form);
      console.log("Images count:", images.length);

      // Don't manually set Content-Type - axios will handle it with proper boundary
      const res = await api.post("/api/items", formData);

      navigate(`/items/${res.data._id}`);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      const msg = error?.response?.data?.message || error?.message || "Create item failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">Post an item for sale</h2>
          <p className="text-sm text-slate-500 mt-1">Fill in the details below.</p>

          {err && (
            <div className="mt-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-2xl p-3">
              {err}
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <Input
              label="Title *"
              name="title"
              placeholder="What are you selling?"
              value={form.title}
              onChange={onChange}
            />

            <Textarea
              label="Description"
              name="description"
              placeholder="Condition, brand, features..."
              value={form.description}
              onChange={onChange}
            />

            <Select
              label="Category *"
              name="category"
              options={CATEGORIES}
              value={form.category}
              onChange={onChange}
            />

            <Select
              label="Condition"
              name="condition"
              options={CONDITIONS}
              value={form.condition}
              onChange={onChange}
            />

            <Select
              label="Location *"
              name="location"
              options={LOCATIONS}
              value={form.location}
              onChange={onChange}
            />

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Price</label>
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={form.isFree}
                  onChange={onChange}
                  className="mt-3"
                />
                <label className="text-sm text-slate-600 mt-3">Free item</label>
              </div>
              {!form.isFree && (
                <Input
                  name="price"
                  type="number"
                  placeholder="Price in $"
                  value={form.price}
                  onChange={onChange}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Photos (max 5) *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onImageChange}
                className="w-full border border-slate-200 rounded-2xl p-3"
              />
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl p-3 font-extrabold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 transition"
            >
              {loading ? "Publishing..." : "Publish item"}
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}

function Input({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2">{label}</label>
      <input
        className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function Textarea({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2">{label}</label>
      <textarea
        className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="4"
      />
    </div>
  );
}

function Select({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2">{label}</label>
      <select
        className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
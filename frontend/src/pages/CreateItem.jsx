import { useMemo, useState } from "react";
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
        fd.append("images", image);
      }

      for (const [key, value] of fd.entries()) {
        console.log(key, value);
      }

      await api.post("/api/items", fd);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Post Item</h1>

        {err && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">{err}</div>}

        <form onSubmit={submit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={onChange}
            className="w-full border p-3 rounded-xl"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={onChange}
            className="w-full border p-3 rounded-xl min-h-28"
          />

          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            name="condition"
            value={form.condition}
            onChange={onChange}
            className="w-full border p-3 rounded-xl"
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            name="location"
            value={form.location}
            onChange={onChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Select location</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFree" checked={form.isFree} onChange={onChange} />
            Free item
          </label>

          {!form.isFree && (
            <input
              name="price"
              type="number"
              min="0"
              placeholder="Price"
              value={form.price}
              onChange={onChange}
              className="w-full border p-3 rounded-xl"
            />
          )}

          <div>
            <p className="text-sm text-gray-600 mb-2">Image (optional)</p>
            <input type="file" accept="image/*" onChange={onImageChange} />
          </div>

          {previewUrl && (
            <div className="relative w-24">
              <img
                src={previewUrl}
                alt="preview"
                className="h-20 w-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
              >
                ×
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-xl disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post Item"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
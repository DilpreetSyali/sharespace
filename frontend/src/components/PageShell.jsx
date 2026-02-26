import AppBar from "./AppBar.jsx";

export default function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <AppBar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
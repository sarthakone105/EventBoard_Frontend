
// Main utilities: theme toggle, base URL
const BASE = "https://eventboard-backend.onrender.com";

// Theme toggle
const themeToggle = () => {
  const t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
};
document.addEventListener("DOMContentLoaded", ()=>{
  // Attach toggle buttons
  document.querySelectorAll("#themeToggle").forEach(b=> b.addEventListener("click", themeToggle));
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
});
async function fetchJSON(path, opts){ 
  const res = await fetch(BASE + path, opts);
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

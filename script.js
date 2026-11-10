const looks = [
  {
    name: "The coffee run",
    tag: "Everyday",
    bg: "#e8e5da",
    top: "#e5d5ba",
    bottom: "#667b90",
    bag: "#693e2e",
    shoe: "#4b3327",
    type: "knit",
    items: [
      "Oatmeal relaxed knit",
      "Straight-leg blue jeans",
      "Chocolate ankle boots",
      "Small structured brown bag",
    ],
    note: "Soft oatmeal keeps the look light, while repeated chocolate accessories bring the blue denim and warm knit together.",
  },
  {
    name: "A softer kind of Monday",
    tag: "City",
    bg: "#e8dfd5",
    top: "#bca287",
    bottom: "#363b35",
    bag: "#6c322f",
    shoe: "#34352e",
    type: "coat",
    items: [
      "Camel longline coat",
      "Charcoal tailored trousers",
      "Dark ankle boots",
      "Burgundy shoulder bag",
    ],
    note: "The long coat creates a clear vertical line. A burgundy bag adds one deliberate colour accent to a quiet, tailored base.",
  },
  {
    name: "Meet me after dark",
    tag: "Evening",
    bg: "#d9ded8",
    top: "#633039",
    bottom: "#2f3033",
    bag: "#c1ac7c",
    shoe: "#282b2c",
    type: "knit",
    skirt: true,
    items: [
      "Burgundy fitted knit",
      "Black midi skirt",
      "Black ankle boots",
      "Gold-toned evening bag",
    ],
    note: "A rich burgundy top becomes the focal point against black. A small gold-toned bag adds contrast without introducing another strong colour.",
  },
  {
    name: "Sunday, unhurried",
    tag: "Weekend",
    bg: "#e8d9ca",
    top: "#667059",
    bottom: "#d4c8b2",
    bag: "#8c5337",
    shoe: "#f3eee3",
    type: "knit",
    items: [
      "Olive relaxed jumper",
      "Ecru wide-leg trousers",
      "Cream ankle boots",
      "Tan crossbody bag",
    ],
    note: "Olive and ecru build a soft, natural palette. Wide-leg trousers balance the relaxed knit, with light boots keeping the finish casual.",
  },
  {
    name: "The city in blue",
    tag: "City",
    bg: "#dce3e6",
    top: "#8197a9",
    bottom: "#3f4d5c",
    bag: "#563c2f",
    shoe: "#483226",
    type: "coat",
    items: [
      "Dusty-blue long coat",
      "Dark navy trousers",
      "Chocolate boots",
      "Brown shoulder bag",
    ],
    note: "Two shades of blue create a tonal story. Warm brown accessories add a little contrast and stop the palette feeling too uniform.",
  },
  {
    name: "A weekend in cream",
    tag: "Weekend",
    bg: "#e8e5d5",
    top: "#ede2cc",
    bottom: "#92715a",
    bag: "#413e32",
    shoe: "#413e32",
    type: "knit",
    skirt: true,
    items: [
      "Cream textured jumper",
      "Caramel midi skirt",
      "Dark ankle boots",
      "Compact olive-brown bag",
    ],
    note: "Cream and caramel create a gentle contrast. Dark accessories frame the outfit, while the midi skirt gives the relaxed jumper a defined silhouette.",
  },
];
let saved;
try {
  saved = JSON.parse(localStorage.getItem("style-notes-board") || "[]");
  if (!Array.isArray(saved)) saved = [];
} catch {
  saved = [];
}
let filter = "All",
  board = false;
// Change these filenames to replace the outfit photographs.
const photos = [
  "coffee-run",
  "soft-monday",
  "after-dark",
  "slow-sunday",
  "city-blue",
  "weekend-cream",
];
function art(l, i) {
  return `<img src="images/${photos[i]}.png" alt="${l.items.join(", ")} — AI-generated outfit concept" width="1122" height="1402" loading="lazy">`;
}
function render() {
  document.querySelector(".saved span").textContent = saved.length;
  document.querySelector(".saved").style.borderColor = board
    ? "var(--orange)"
    : "var(--line)";
  let list = looks
    .map((l, i) => ({ l, i }))
    .filter(
      ({ l, i }) =>
        (filter === "All" || l.tag === filter) && (!board || saved.includes(i)),
    );
  document.querySelector("#count").textContent =
    `${String(list.length).padStart(2, "0")} ${board ? "SAVED" : "CURATED"} LOOKS`;
  document.querySelector("#grid").innerHTML = list.length
    ? list
        .map(
          ({ l, i }) =>
            `<article class="card"><button class="heart ${saved.includes(i) ? "on" : ""}" aria-label="${saved.includes(i) ? "Unsave" : "Save"} ${l.name}" aria-pressed="${saved.includes(i)}" onclick="toggle(${i})">${saved.includes(i) ? "♥" : "♡"}</button><button class="art" onclick="openLook(${i})" aria-label="Explore ${l.name}">${art(l, i)}</button><div class="cardmeta"><div><h3>${l.name}</h3><small>${l.tag} / 4 pieces</small></div><button class="arrow" aria-label="View ${l.name}" onclick="openLook(${i})">↗</button></div><div class="dots">${[l.top, l.bottom, l.bag].map((c) => `<span style="background:${c}"></span>`).join("")}</div></article>`,
        )
        .join("")
    : '<div class="empty"><h2>Your next favourite is waiting.</h2><p>Tap a heart on an outfit to add it to your board.</p><button class="primary" onclick="reset()">Explore all looks</button></div>';
}
function reset() {
  board = false;
  filter = "All";
  document
    .querySelectorAll(".filter")
    .forEach((b) => b.classList.toggle("active", b.dataset.filter === "All"));
  render();
}
function toggle(i) {
  saved = saved.includes(i) ? saved.filter((n) => n !== i) : [...saved, i];
  try {
    localStorage.setItem("style-notes-board", JSON.stringify(saved));
  } catch {}
  render();
  const t = document.querySelector(".toast");
  t.textContent = saved.includes(i)
    ? "Saved to your board"
    : "Removed from your board";
  t.classList.add("show");
  clearTimeout(window.tt);
  window.tt = setTimeout(() => t.classList.remove("show"), 1800);
  const b = document.querySelector("#modalSave");
  if (b)
    b.textContent = saved.includes(i)
      ? "♥ Saved — remove"
      : "♡ Save to my board";
}
function openLook(i) {
  let l = looks[i];
  document.querySelector("#modal").innerHTML =
    `<div class="modalgrid"><div class="modalart">${art(l, i)}</div><div class="modalcopy"><span class="eyebrow">Styling notes / ${l.tag}</span><h2>${l.name}</h2><ul>${l.items.map((a) => `<li>${a}</li>`).join("")}</ul><p>${l.note}</p><button class="primary" id="modalSave" onclick="toggle(${i})">${saved.includes(i) ? "♥ Saved — remove" : "♡ Save to my board"}</button><p style="font-size:11px">AI-generated personal concept. No retailer affiliation.</p></div></div>`;
  document.querySelector("#detail").showModal();
}
document.querySelectorAll(".filter").forEach(
  (b) =>
    (b.onclick = () => {
      filter = b.dataset.filter;
      document
        .querySelectorAll(".filter")
        .forEach((x) => x.classList.toggle("active", x === b));
      render();
    }),
);
document.querySelector("#saved").onclick = () => {
  board = !board;
  filter = "All";
  document
    .querySelectorAll(".filter")
    .forEach((x) => x.classList.toggle("active", x.dataset.filter === "All"));
  render();
  document.querySelector("#outfits").scrollIntoView({ behavior: "smooth" });
};
document.querySelector(".close").onclick = () =>
  document.querySelector("#detail").close();
document.querySelector("#detail").onclick = (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
};
render();

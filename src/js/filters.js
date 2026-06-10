export function initFilters({ listEl, onSelect }) {
  listEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    const category = button.dataset.category || "All";
    onSelect(category);
  });
}


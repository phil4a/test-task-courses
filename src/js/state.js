export const state = {
  courses: [],
  categories: [],
  currentCategory: "All",
  searchQuery: "",
  visibleCount: 9,
  step: 3
};

export function resetPagination(nextVisibleCount = 9) {
  state.visibleCount = nextVisibleCount;
}

export function setCourses(courses) {
  state.courses = Array.isArray(courses) ? courses : [];
}

export function setCategories(categories) {
  state.categories = Array.isArray(categories) ? categories : [];
}

export function setCurrentCategory(category) {
  state.currentCategory = category || "All";
}

export function setSearchQuery(query) {
  state.searchQuery = typeof query === "string" ? query : "";
}

export function increaseVisibleCount() {
  state.visibleCount += state.step;
}

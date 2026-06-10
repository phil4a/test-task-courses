export async function fetchCourses() {
  try {
    const response = await fetch("./data/courses.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load courses: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid courses payload");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

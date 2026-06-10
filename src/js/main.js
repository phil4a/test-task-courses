import { fetchCourses } from './api.js';
import { initFilters } from './filters.js';
import { initSearch } from './search.js';
import {
	increaseVisibleCount,
	resetPagination,
	setCategories,
	setCourses,
	setCurrentCategory,
	setSearchQuery,
	state,
} from './state.js';
import {
	getFilteredCourses,
	getCategoryCounts,
	renderCourses,
	renderFilters,
	setEmptyState,
	updateLoadMore,
} from './render.js';

const CATEGORY_ORDER = ['Marketing', 'Management', 'HR & Recruiting', 'Design', 'Development'];

function getUniqueCategories(courses) {
	const set = new Set();
	for (const course of courses) {
		if (course && typeof course.category === 'string' && course.category.trim()) {
			set.add(course.category.trim());
		}
	}

	const unknown = Array.from(set)
		.filter((c) => !CATEGORY_ORDER.includes(c))
		.sort((a, b) => a.localeCompare(b));
	const ordered = CATEGORY_ORDER.filter((c) => set.has(c));
	return ['All', ...ordered, ...unknown];
}

function getElements() {
	const filtersListEl = document.querySelector('[data-filters-list]');
	const searchInputEl = document.querySelector('[data-search-input]');
	const gridEl = document.querySelector('[data-courses-grid]');
	const loadMoreBtn = document.querySelector('[data-load-more]');
	const emptyEl = document.querySelector('[data-empty]');

	const filterTemplate = document.querySelector('#filter-template');
	const cardTemplate = document.querySelector('#course-card-template');

	if (
		!filtersListEl ||
		!searchInputEl ||
		!gridEl ||
		!loadMoreBtn ||
		!emptyEl ||
		!filterTemplate ||
		!cardTemplate
	) {
		throw new Error('Missing required DOM elements');
	}

	return {
		filtersListEl,
		searchInputEl,
		gridEl,
		loadMoreBtn,
		emptyEl,
		filterTemplate,
		cardTemplate,
	};
}

function renderAll({ elements }) {
	const categoryCounts = getCategoryCounts({
		courses: state.courses,
		categories: state.categories,
		searchQuery: state.searchQuery,
	});

	renderFilters({
		container: elements.filtersListEl,
		template: elements.filterTemplate,
		categories: state.categories,
		currentCategory: state.currentCategory,
		counts: categoryCounts,
	});

	const filtered = getFilteredCourses(state);
	const visible = filtered.slice(0, state.visibleCount);

	renderCourses({ container: elements.gridEl, template: elements.cardTemplate, courses: visible });

	const isEmpty = filtered.length === 0;
	setEmptyState({
		emptyEl: elements.emptyEl,
		isVisible: isEmpty,
		title: 'No courses found',
		text: 'Try changing the query or filter.',
	});

	updateLoadMore({
		button: elements.loadMoreBtn,
		totalCount: filtered.length,
		visibleCount: visible.length,
	});
}

async function init() {
	const elements = getElements();

	initFilters({
		listEl: elements.filtersListEl,
		onSelect: (category) => {
			setCurrentCategory(category);
			resetPagination();
			renderAll({ elements });
		},
	});

	initSearch({
		inputEl: elements.searchInputEl,
		onChange: (value) => {
			setSearchQuery(value);
			resetPagination();
			renderAll({ elements });
		},
	});

	elements.loadMoreBtn.addEventListener('click', () => {
		increaseVisibleCount();
		renderAll({ elements });
	});

	try {
		const courses = await fetchCourses();
		setCourses(courses);
		setCategories(getUniqueCategories(courses));
		renderAll({ elements });
	} catch (error) {
		setCourses([]);
		setCategories(['All']);
		renderAll({ elements });
		setEmptyState({
			emptyEl: elements.emptyEl,
			isVisible: true,
			title: 'Failed to load data',
			text: 'Please try refreshing the page.',
		});
		updateLoadMore({ button: elements.loadMoreBtn, totalCount: 0, visibleCount: 0 });
	}
}

init();

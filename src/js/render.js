const CATEGORY_MODIFIERS = {
	Marketing: 'marketing',
	Management: 'management',
	'HR & Recruiting': 'hr-recruiting',
	Design: 'design',
	Development: 'development',
};

export function getFilteredCourses({ courses, currentCategory, searchQuery }) {
	const category = currentCategory || 'All';
	const query = (searchQuery || '').trim().toLowerCase();

	return (courses || []).filter((course) => {
		const matchesCategory = category === 'All' ? true : course.category === category;
		if (!matchesCategory) return false;

		if (!query) return true;
		return String(course.title || '')
			.toLowerCase()
			.includes(query);
	});
}

export function getCategoryCounts({ courses, categories, searchQuery }) {
	const query = (searchQuery || '').trim().toLowerCase();
	const matchesQuery = (course) => {
		if (!query) return true;
		return String(course?.title || '')
			.toLowerCase()
			.includes(query);
	};

	const counts = Object.create(null);
	for (const category of categories || []) {
		counts[category] = 0;
	}
	if (!Object.prototype.hasOwnProperty.call(counts, 'All')) counts.All = 0;

	for (const course of courses || []) {
		if (!course || !matchesQuery(course)) continue;

		counts.All += 1;

		const category =
			typeof course.category === 'string' && course.category.trim()
				? course.category.trim()
				: 'Unknown';
		if (!Object.prototype.hasOwnProperty.call(counts, category)) counts[category] = 0;
		counts[category] += 1;
	}

	return counts;
}

export function renderFilters({ container, template, categories, currentCategory, counts }) {
	container.textContent = '';

	const fragment = document.createDocumentFragment();

	for (const category of categories) {
		const button = template.content.firstElementChild.cloneNode(true);
		button.dataset.category = category;

		const isSelected = category === (currentCategory || 'All');
		button.setAttribute('aria-selected', String(isSelected));

		const labelEl = button.querySelector('.filters__label');
		if (labelEl) labelEl.textContent = category;

		const countEl = button.querySelector('.filters__count');
		if (countEl) countEl.textContent = String(counts?.[category] ?? 0);

		if (category === 'All') {
			button.dataset.hasCaret = 'true';
		}

		fragment.append(button);
	}

	container.append(fragment);
}

export function renderCourses({ container, template, courses }) {
	container.textContent = '';

	const fragment = document.createDocumentFragment();
	for (const course of courses) {
		const card = template.content.firstElementChild.cloneNode(true);

		const image = card.querySelector('.card__image');
		const tag = card.querySelector('.card__tag');
		const title = card.querySelector('.card__title');
		const price = card.querySelector('.card__price');
		const author = card.querySelector('.card__author');

		image.src = course.image || '';
		image.alt = course.title || 'Course';

		const categoryText = course.category || 'Unknown';
		tag.textContent = categoryText;
		const modifier = CATEGORY_MODIFIERS[categoryText];
		if (modifier) tag.classList.add(`card__tag_${modifier}`);

		title.textContent = course.title || '';
		price.textContent = formatPrice(course.price);
		author.textContent = course.author || '';

		fragment.append(card);
	}

	container.append(fragment);
}

export function setEmptyState({ emptyEl, isVisible, title, text }) {
	emptyEl.hidden = !isVisible;

	const titleEl = emptyEl.querySelector('[data-empty-title], .courses__empty-title');
	const textEl = emptyEl.querySelector('[data-empty-text], .courses__empty-text');

	if (titleEl && typeof title === 'string') titleEl.textContent = title;
	if (textEl && typeof text === 'string') textEl.textContent = text;
}

export function updateLoadMore({ button, totalCount, visibleCount }) {
	const shouldShow = totalCount > 0 && visibleCount < totalCount;
	button.hidden = !shouldShow;
	button.disabled = !shouldShow;
}

function formatPrice(value) {
	const number = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(number)) return '$0';
	return `$${number}`;
}

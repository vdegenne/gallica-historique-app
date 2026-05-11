/* vite only */
export const DEV = import.meta.env.DEV

export const availablePages = ['main', 'search'] as const
// true as AllValuesPresent<Page, typeof availablePages>

export const sortMethods = [
	'alphabet',
	'createdAt',
	'updatedAt',
	'visitedCount',
	'activityCount',
	'publicationDate',
] as const

export type SortMethod = (typeof sortMethods)[number]

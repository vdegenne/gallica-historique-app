declare global {
	namespace gallica {
		interface BookInfo {
			title: string
			author: string
			publicationDate: number
			editionDate: number
			pagesCount: number
		}

		interface HistoryEntry {
			/**
			 * Because the id is generated from Date.now()
			 * it can also be used as createdAt
			 */
			id: number
			// createdAt: number
			url: string
			/**
			 * Current page
			 */
			page: number
			/**
			 * Page with the highest number ever read in the book.
			 */
			forthPage?: number
			bookInfo: Partial<BookInfo>
			updatedAt: number
			visitedCount: number
			activityCount: number

			/**
			 * @default false
			 */
			favorite?: boolean
		}
	}
}

export {}

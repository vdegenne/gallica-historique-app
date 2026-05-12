export function onUrlChange(callback: (url: string) => void): () => void {
	const originalPushState = history.pushState
	const originalReplaceState = history.replaceState

	function notify() {
		callback(window.location.href)
	}

	history.pushState = function (
		this: History,
		...args: Parameters<typeof history.pushState>
	): void {
		const result = originalPushState.apply(this, args as any)
		notify()
		return result
	}

	history.replaceState = function (
		this: History,
		...args: Parameters<typeof history.replaceState>
	): void {
		const result = originalReplaceState.apply(this, args as any)
		notify()
		return result
	}

	window.addEventListener('popstate', notify)

	notify()

	return function cleanup() {
		history.pushState = originalPushState
		history.replaceState = originalReplaceState
		window.removeEventListener('popstate', notify)
	}
}

export function parseGallicaUrl(
	input: string,
): {url: string; page: number | null} | null {
	try {
		const u = new URL(input)

		// Match /ark:/.../f<number>
		const match = u.pathname.match(/^(\/ark:\/[^/]+\/[^/]+)(?:\/f(\d+))?/)

		if (!match) return null

		const basePath = match[1] // /ark:/12148/bpt6k105095j
		const page = match[2] ? parseInt(match[2], 10) : null

		return {
			url: `${u.origin}${basePath}`,
			page,
		}
	} catch {
		return null
	}
}

function getPagseCounts1() {
	const span = document.querySelector('.textNbPageEtTailleDoc2')
	if (span) {
		return parseInt(span.textContent)
	}
}
function getPagesCount2() {
	const allSpans = document.querySelectorAll<HTMLSpanElement>('.aboutList span')
	const pagesCountContainer = [...allSpans].find((span) => {
		return span.textContent.includes('Nombre total de vues')
	})
	if (pagesCountContainer) {
		const match = pagesCountContainer.textContent.match(/\d+/)
		if (match) {
			return parseInt(match[0], 10)
		}
	}
}

export function getBookInformation(): gallica.BookInfo {
	const info: Partial<gallica.BookInfo> = {}
	const titleEl = document.querySelector<HTMLSpanElement>('.title')
	const title = titleEl?.textContent?.trim()
	if (title) info.title = title

	const authorEl = document.querySelector<HTMLSpanElement>('.author')
	const author = authorEl?.textContent?.trim().replace('. Auteur du texte', '')
	if (author) info.author = author

	const allBs = document.querySelectorAll('b')
	const publicationB = [...allBs].find((el) =>
		el.textContent.includes('Publication date'),
	)
	if (publicationB) {
		const publicationDate =
			publicationB.parentElement!.nextElementSibling!.textContent?.trim()
		if (publicationDate) {
			info.publicationDate = parseInt(publicationDate)
		}
	}

	const editionB = [...allBs].find((el) =>
		el.textContent.includes("Date d'édition"),
	)
	if (editionB) {
		const editionDate =
			editionB.parentElement!.nextElementSibling!.textContent?.trim()
		if (editionDate) {
			info.editionDate = parseInt(editionDate)
		}
	}
	// Pages count
	let pagesCount = getPagseCounts1() ?? getPagesCount2()
	if (pagesCount) {
		info.pagesCount = pagesCount
	}

	return info as gallica.BookInfo
}

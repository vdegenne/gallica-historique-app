import {Debouncer} from '@vdegenne/debouncer'
import {getBookInformation, onUrlChange, parseGallicaUrl} from './utils.js'
import {api} from '../api.js'

const executeDebouncer = new Debouncer(async (fullUrl) => {
	const parsed = parseGallicaUrl(fullUrl)
	if (!parsed) return

	const {page, url} = parsed
	if (!page) return

	const bookInfo = getBookInformation()

	console.log(page, url, bookInfo)

	try {
		const {ok} = await api.post('/update', {url, page, bookInfo})
		if (ok) {
		}
	} catch {}
}, 500)

onUrlChange(async (url) => {
	try {
		await executeDebouncer.call(url)
	} catch {}
})

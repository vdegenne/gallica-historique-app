import {config} from '@vdegenne/koa'
import {API} from './api.js'
import {PORT} from './constants.js'
import {data} from './data.js'

config<API>({
	apiVersion: 'api',

	port: PORT,

	useCors: true,

	get: {
		'/ping': () => 'pong',
	},

	post: {
		async '/update'({guard}) {
			const {bookInfo, url, page} = guard({
				// fields: ['url', 'page', 'bookInfo'],
				required: ['url', 'page', 'bookInfo'],
			})
			console.log(url, page, bookInfo)

			const entries = await data.getData()
			const existing = entries.find((e) => e.url === url)

			if (existing) {
				if (page >= (existing.forthPage ?? -1)) {
					existing.forthPage = page
				}
				existing.page = page
				Object.assign(existing.bookInfo, bookInfo)
				existing.updatedAt = Date.now()
				existing.activityCount ??= 0
				existing.activityCount++
				// console.log('EXISTING')
				// console.log(existing)
			} else {
				const id = Date.now()
				const entry = {
					id,
					url,
					bookInfo,
					page,
					forthPage: page,
					favorite: false,
					updatedAt: id,
					visitedCount: 1, // first visit
					activityCount: 1,
				}
				// console.log('NEW ENTRY')
				// console.log(entry)
				data.push(entry, {save: false})
			}

			data.save()

			return ''
		},

		'/entries/touch/:id'({params}) {
			const entry = data.getItemFromId(Number(params.id))
			if (entry) {
				entry.visitedCount++
				data.save()
			}
		},
	},

	delete: {
		'/entries/:id'({params}) {
			const id = Number(params.id)
			if (!isNaN(id) && data.itemExistsFromId(id)) {
				data.deleteItem(id)
			}
			return ''
		},
	},
})

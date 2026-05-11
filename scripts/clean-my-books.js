import data from '../my-books.json' with {type: 'json'}
import {writeFileSync} from 'fs'

for (const e of data) {
	if (e.createdAt) {
		e.id = e.createdAt
		delete e.createdAt
	}
	if (e.forthPage === undefined) {
		e.forthPage = e.page
	}
}

writeFileSync('./my-books.json', JSON.stringify(data, null, 2))

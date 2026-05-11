import {Rest, type Endpoint} from '@vdegenne/mini-rest'

export interface API {
	get: {
		'/ping': Endpoint<void, 'pong'>
	}
	post: {
		'/update': Endpoint<
			{url: string; page: number; bookInfo: Partial<gallica.BookInfo>},
			any
		>
	}
}

export function getApi(origin = 'http://localhost:41845/api') {
	return new Rest<API>(origin)
}

import {Rest, type Endpoint} from '@vdegenne/mini-rest'

export interface API {
	get: {
		'/ping': Endpoint<void, 'pong'>
		'/touch/:id': Endpoint<void, any>
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

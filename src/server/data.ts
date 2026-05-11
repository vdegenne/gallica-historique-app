import {ArrayWithIdsJSONDataFile} from '@vdegenne/server-helpers'

export const data = new ArrayWithIdsJSONDataFile<gallica.HistoryEntry>(
	'./my-books.json',
	{
		createIfNotExist: true,
		beautifyJson: '\t',
		saveDebouncerTimeoutMs: 500,
	},
)

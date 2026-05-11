import {ArrayWithIdsJSONDataFile, JSONDataFile} from '@vdegenne/server-helpers'

export const data = new ArrayWithIdsJSONDataFile<gallica.HistoryEntry>(
	'./my-books.json',
	{
		createIfNotExist: true,
		beautifyJson: true,
		saveDebouncerTimeoutMs: 500,
	},
)

// import '@material/web/textfield/filled-text-field.js'
// import '@material/web/textfield/outlined-text-field.js';
// import '@material/web/iconbutton/icon-button.js'
// import '@material/web/chips/chip-set.js'
// import '@material/web/chips/input-chip.js'
import {MdIconButton} from '@material/web/iconbutton/icon-button.js'
import {MdListItem} from '@material/web/list/list-item.js'
import {withController} from '@snar/lit'
import {css, html} from 'lit'
import {withStyles} from 'lit-with-styles'
import {customElement, query, queryAll, state} from 'lit/decorators.js'
import {repeat} from 'lit/directives/repeat.js'
import {unsafeHTML} from 'lit/directives/unsafe-html.js'
import toast from 'toastit'
import _history from '../../my-books.json' with {type: 'json'}
import {sortMethods} from '../constants.js'
import {confirmDialog} from '../dialogs/confirm.js'
import {openSettingsDialog} from '../imports.js'
import {store} from '../store.js'
import {copyToClipboard, createHighlightedHtml} from '../utils.js'
import {PageElement} from './PageElement.js'
// import '@material/web/chips/chip-set.js'
import '@material/web/chips/input-chip.js'
import '@material/web/menu/menu.js'
import '@material/web/menu/menu-item.js'

const history: gallica.HistoryEntry[] = _history

declare global {
	interface HTMLElementTagNameMap {
		'page-main': PageMain
	}
}

@customElement('page-main')
@withController(store)
@withStyles(css`
	:host {
	}
	md-list-item[selected] {
		background-color: var(--md-sys-color-surface-container-highest);
	}
	md-list-item[completed] {
		opacity: 50%;
	}
	.highlight {
		background-color: var(--md-sys-color-secondary);
		color: var(--md-sys-color-on-secondary);
	}

	span[important] {
		background-color: var(--md-sys-color-primary);
		color: var(--md-sys-color-on-primary);
		display: inline-block;
		padding: 3px 4px;
	}

	[slot='overline'] span {
		font-size: 120%;
	}
	[slot='overline'] span[important] {
		font-size: 150%;
	}
`)
export class PageMain extends PageElement {
	@state() history = history

	@queryAll('md-list-item') itemElements!: MdListItem[]
	@query('md-list-item[selected]') selectedItem?: MdListItem

	render() {
		if (this.history.length === 0) {
			return html`<!-- -->
				<div class="m-5 text-center flex flex-col gap-4 text-xl">
					<p>
						Pas encore d'historique.<br />Commencez à lire des livres sur
						Gallica pour développer un historique.
					</p>
					<div class="flex items-center justify-center gap-2">
						<md-filled-button href="https://gallica.bnf.fr/"
							><md-icon slot="icon">book_2</md-icon>Go to
							Gallica</md-filled-button
						>
						${this.#renderImportButton()}
					</div>
				</div>
				<!-- -->`
		}

		const history = this.history
			.slice(0)
			.filter((i) =>
				(i.bookInfo.title ?? '')
					.toLowerCase()
					.includes(store.search.toLowerCase()),
			)

		switch (store.sortMethod) {
			case 'alphabet':
				history.sort((e1, e2) =>
					(e1.bookInfo?.title ?? '').localeCompare(e2.bookInfo?.title ?? ''),
				)
				break
			case 'createdAt':
				history.sort((e1, e2) => e2.id - e1.id)
				break
			case 'updatedAt':
				history.sort((e1, e2) => e2.updatedAt - e1.updatedAt)
				break
			case 'visitedCount':
				history.sort((e1, e2) => e2.visitedCount - e1.visitedCount)
				break
			case 'activityCount':
				history.sort((e1, e2) => e2.activityCount - e1.activityCount)
				break
			case 'publicationDate':
				history.sort(
					(e1, e2) =>
						(e2.bookInfo.publicationDate ?? e2.bookInfo.editionDate ?? 0) -
						(e1.bookInfo.publicationDate ?? e1.bookInfo.editionDate ?? 0),
				)
				break
		}

		return html`<!-- -->
			<div class="flex justify-between items-center gap-3 p-4">
				<div></div>
				${store.F.CHIPSELECT('Sort by', 'sortMethod', sortMethods as any)}
			</div>
			<md-list>
				${history.length === 0
					? html`<!-- -->
							<md-list-item>No result</md-list-item>
							<!-- -->`
					: null}
				${repeat(
					history,
					(entry) => entry.id,
					(entry) => {
						let highlight
						if (entry.bookInfo.title && store.search) {
							highlight = createHighlightedHtml(
								entry.bookInfo.title,
								store.search,
							)
						}
						let progress: number | undefined
						if (entry.forthPage && entry.bookInfo.pagesCount) {
							progress = entry.forthPage / entry.bookInfo.pagesCount
						}
						return html`<!-- -->
							<md-list-item
								@click="${() => this.#visitLink(entry)}"
								type="button"
								?selected="${entry.id === store.selectedIndexId}"
								data-id="${entry.id}"
								?completed="${progress === 1}"
							>
								<md-icon-button
									slot="start"
									toggle
									?selected=${entry.favorite}
									@click="${(event: Event) => {
										event.preventDefault()
										event.stopPropagation()
									}}"
									@pointerdown="${(event: Event) => {
										event.stopPropagation()
									}}"
									@change="${(event: Event) => {
										const button = event.target as MdIconButton
										entry.favorite = button.selected
										this.history = [...this.history]
									}}"
								>
									<md-icon class="opacity-30">star</md-icon>
									<md-icon slot="selected" filled>star</md-icon>
								</md-icon-button>
								<div slot="start" class="opacity-20 hidden">#${entry.id}</div>
								<div slot="headline">
									${highlight ? unsafeHTML(highlight) : entry.bookInfo.title}
								</div>
								<div slot="trailing-supporting-text" class="">
									<md-text-button inert>
										<md-icon slot="icon">bookmark</md-icon>
										page ${entry.page} (${entry.forthPage}) /
										${entry.bookInfo.pagesCount}
									</md-text-button>
								</div>
								<div slot="overline">
									<span ?important=${store.sortMethod === 'publicationDate'}
										>${entry.bookInfo.publicationDate ??
										entry.bookInfo.editionDate}</span
									>
								</div>
								<div slot="supporting-text">${entry.bookInfo.author}</div>

								${[
									'createdAt',
									'updatedAt',
									'visitedCount',
									'activityCount',
								].includes(store.sortMethod)
									? html`<!-- -->
											<div slot="end" class="text-sm">
												<span important>
													${store.sortMethod === 'createdAt'
														? html`<!-- -->
																<time-element time=${entry.id}></time-element>
																<!-- -->`
														: store.sortMethod === 'updatedAt'
															? html`<!-- -->
																	<time-element
																		time=${entry.updatedAt}
																	></time-element>
																	<!-- -->`
															: store.sortMethod === 'visitedCount'
																? html`<!-- -->
																		${entry.visitedCount ?? 0}
																		<!-- -->`
																: store.sortMethod === 'activityCount'
																	? html`<!-- -->
																			${entry.activityCount ?? 0}
																			<!-- -->`
																	: null}</span
												>
											</div>
											<!-- -->`
									: null}
								<div slot="end" class="flex items-end gap-1">
									<md-icon-button
										@click="${(e: Event) => {
											e.preventDefault()
											e.stopPropagation()
											this.deleteEntry(entry)
										}}"
										@pointerdown="${(e: Event) => e.stopPropagation()}"
									>
										<md-icon>delete</md-icon>
									</md-icon-button>
								</div>
							</md-list-item>
							${progress
								? html`<!-- -->
										<md-linear-progress
											value="${progress}"
										></md-linear-progress>
										<!-- -->`
								: null}
							<md-divider></md-divider>
							<!-- -->`
					},
				)}
			</md-list>

			<div class="flex items-center justify-center gap-2 py-12">
				<md-filled-button
					@click="${() => {
						copyToClipboard(JSON.stringify(this.history))
						toast('Copied')
					}}"
				>
					<md-icon slot="icon">content_copy</md-icon>
					Copy data
				</md-filled-button>

				${this.#renderImportButton()}
			</div>

			<div class="text-right p-2">
				<md-icon-button @click=${openSettingsDialog}>
					<md-icon>settings</md-icon>
				</md-icon-button>
			</div>
			<!-- -->`
	}

	#renderImportButton() {
		return html`<!-- -->
			<md-filled-button
				@click=${() => {
					const data = prompt('paste json data in this field')
					if (data) {
						try {
							const json = JSON.parse(data)
							this.history = json
						} catch {
							toast("Couldn't parse the JSON data")
						}
					}
				}}
			>
				<md-icon slot="icon">download</md-icon>
				Import data
			</md-filled-button>

			<md-filled-tonal-button
				@click=${() => {
					toast('soon')
				}}
			>
				<md-icon slot="icon">folded_hands</md-icon>
				Support
			</md-filled-tonal-button>
			<!-- -->`
	}

	#visitLink(entry: gallica.HistoryEntry) {
		const fullUrl = `${entry.url}${entry.page ? `/f${entry.page}` : ''}`
		entry.visitedCount ??= 0
		entry.visitedCount++
		this.history = [...this.history] // force update to save data
		// visit link
		// window.location.href = fullUrl;
		window.open(fullUrl, '_blank')
	}

	async deleteEntry(entry: gallica.HistoryEntry) {
		try {
			await confirmDialog(
				html`<!-- -->
					<div>Vous êtes sur le point de supprimer cette entrée:</div>
					<p><b>${entry.bookInfo?.title}</b></p>
					<div>Procéder à la suppression ?</div>
					<!-- -->`,
			)
			const index = this.history.indexOf(entry)
			if (store.selectedIndexId === entry.id) {
				// Trying to select the next or previous item on the UI before deletion
				// if the current select item is the one we want to delete.
				if (!this.selectNextIndex()) {
					this.selectPreviousIndex()
				}
			}
			this.history.splice(index >>> 0, 1)
			this.history = [...this.history]
		} catch {
			// cancel
		}
	}

	selectPreviousIndex() {
		const items = this.itemElements
		const selected = this.selectedItem
		const index = selected ? [...items].indexOf(selected) : 1
		const previous = index - 1
		try {
			const previousId = parseInt(items[previous]!.dataset.id!)
			if (previousId !== undefined) {
				store.selectedIndexId = previousId
				return true
			}
		} catch {}
		return false
	}
	selectNextIndex() {
		const items = this.itemElements
		const selected = this.selectedItem
		const index = selected ? [...items].indexOf(selected) : -1
		const next = index + 1
		try {
			const nextId = parseInt(items[next]!.dataset.id!)
			if (nextId !== undefined) {
				store.selectedIndexId = nextId
				return true
			}
		} catch {}
		return false
	}
}

// export const pageMain = new PageMain();

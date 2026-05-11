import {PropertyValues, ReactiveController, state} from '@snar/lit'
import {FormBuilder} from '@vdegenne/forms/FormBuilder.js'
import {saveToLocalStorage} from 'snar-save-to-local-storage'
import toast from 'toastit'
import {app} from './app-shell/app-shell.js'
import {availablePages, SortMethod, sortMethods} from './constants.js'
import {Page} from './pages/index.js'
import {isInViewport} from './utils.js'

@saveToLocalStorage('gallica-historique-app:store')
export class AppStore extends ReactiveController {
	@state() search = ''
	@state() sortMethod: SortMethod = 'visitedCount'
	@state() selectedIndexId = -1
	@state() page: Page = 'main'

	F = new FormBuilder(this)

	protected firstUpdated(_changedProperties: PropertyValues): void {
		// this.search = '';
		this.selectedIndexId = -1
	}

	protected async updated(changed: PropertyValues<this>) {
		// const {hash, router} = await import('./router.js')
		if (changed.has('page')) {
			// import('./router.js').then(({router}) => {
			// 	router.hash.$('page', this.page)
			// })
			const page = availablePages.includes(this.page) ? this.page : '404'
			import(`./pages/page-${page}.ts`)
				.then(() => {
					console.log(`Page ${page} loaded.`)
				})
				.catch(() => {})
		}

		if (changed.has('selectedIndexId')) {
			// const {mainPage} = await import('./pages/page-main.js')
			if (
				app.mainPage?.selectedItem &&
				!isInViewport(app.mainPage.selectedItem)
			) {
				app.mainPage.selectedItem.scrollIntoView()
			}
		}
	}

	jumpToNextSortingMethod() {
		const curr = sortMethods.indexOf(this.sortMethod)
		this.sortMethod = sortMethods[(curr + 1) % sortMethods.length] as SortMethod
	}
}

export const store = new AppStore()

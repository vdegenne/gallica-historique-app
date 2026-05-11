import {ago} from '@vdegenne/ago'
import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'

@customElement('time-element')
export class TimeElement extends LitElement {
	@property({type: Number}) time = 0

	constructor() {
		super()
		setInterval(() => this.requestUpdate())
	}

	render() {
		return html`<!-- -->
			${ago(this.time)}
			<!-- -->`
	}
}

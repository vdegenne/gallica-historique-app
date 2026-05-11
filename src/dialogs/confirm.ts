import {html, type TemplateResult} from 'lit'
import {Dialog} from './dialogs.js'

export function confirmDialog(
	message: string | TemplateResult,
	confirmLabel = 'Ok',
) {
	return new Promise<void>((resolve, reject) => {
		new Dialog(
			'Are you sure',
			message,
			// () => message
			// 	html`<!-- -->
			// 		${message}
			// 		<!-- -->`,
			{
				closeButton: undefined,
				actions(dialog) {
					return html`<!-- -->
						<md-text-button
							@click=${() => {
								reject()
								dialog.close()
							}}
							>Cancel</md-text-button
						>
						<md-filled-button
							@click=${() => {
								resolve()
								dialog.close()
							}}
							autofocus
							>${confirmLabel}</md-filled-button
						>
						<!-- -->`
				},
			},
		)
	})
}

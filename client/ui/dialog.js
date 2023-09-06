import {DialogAction, DialogFacade} from "../../js/dialog.js";

export function init(window) {
	const dialogFacade = new DialogFacade();

	class NuiDialogAction extends DialogAction {
		data;

		constructor(key, label) {
			super(key, label, () => {
				NuiDialogAction.callback(this);
			});
		}

		static parse(data) {
			const o = new NuiDialogAction(data.code, data.description ?? data.label);
			o.data = data;
			return o;
		}

		static callback(o) {
			window.nuiCallbackInstance.invokeCallback(o.data);
		}
	}

	function mapActions(actions) {
		const out = [];
		for (const rawAction of actions) {
			out.push(NuiDialogAction.parse(rawAction));
		}
		return out;
	}

	function onDialogMessage(data) {
		const type = data.type;

		if (!type) {
			throw new Error("Expected type to be defined");
		}


		dialogFacade.show(type.toLowerCase(), mapActions(data.actions), data.description);
	}

	registerMessageHandler("dialog", onDialogMessage);
}

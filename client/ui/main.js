import {init} from "./dialog.js";

(async function () {
	window.nuiCallbackInstance = await constructNuiCallbacksInstance();
	init(window);
})();

const toastElement = document.getElementById("toast");
const toastIconElement = document.getElementById("toastIcon");
const toastTextElement = document.getElementById("toastText");
const toastSound = new Audio("assets/toast.mp3");
const toastStack = [];

function onToastMessage(data) {
	toastStack.push(() => {
		toastElement.style.display = "flex";
		toastSound.play();
		data.timeout ??= 5;
		if (data.icon) {
			toastIconElement.src = data.icon;
			toastIconElement.style.display = "block";
		} else {
			toastIconElement.style.display = "none";
		}
		setTimeout(() => {
			toastStack.shift();
			toastElement.style.display = "none";
			if (toastStack.length > 0) {
				toastStack[0]();
			}
		}, data.timeout * 1000);
		toastTextElement.innerHTML = txtiful.txtiful(data.text);
	});

	if (toastStack.length === 1) {
		toastStack[0]();
	}
}


(function () {
	registerMessageHandler("toast", onToastMessage);
})();

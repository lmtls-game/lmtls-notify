const toastElement = document.getElementById("toast");
const toastTextElement = document.getElementById("toastText");
const toastStack = [];

function onToastMessage(data) {
    toastStack.push(() => {
        toastElement.style.display = "block";
        data.timeout ??= 5;
        setTimeout(() => {
            toastStack.shift();
            toastElement.style.display = "none";
            if (toastStack.length > 0) {
                toastStack[0]();
            }
        }, data.timeout * 1000);
        toastTextElement.textContent = data.text;
    });

    if (toastStack.length === 1) {
        toastStack[0]();
    }
}


(function () {
    registerMessageHandler("toast", onToastMessage);
})();

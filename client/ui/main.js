const dialog = document.getElementById("dialog");
const dialogTitle = dialog.querySelector("#dialogTitle");
const dialogDescription = dialog.querySelector("#dialogDescription");
const dialogActions = dialog.querySelector("#dialogActions");

let registeredActions = {};

document.onkeyup = function (e) {
    if (!registeredActions) {
        return;
    }

    const registeredAction = registeredActions[e.code.toLowerCase()];
    if (!registeredAction) {
        return;
    }
    triggerCallback(registeredAction);
};

function triggerCallback(action) {
    //todo
}

function createActionElement(key, description) {
    const actionElement = document.createElement("action");
    actionElement.innerHTML = `
        <div class="action">
            <div class="action__key">[${key}]</div>
            <div class="action__description">${description}</div>
        </div>
    `;
    return actionElement;
}

function setDialog(title, description, actions) {
    dialogTitle.textContent = title;
    dialogDescription.textContent = description;
    dialogActions.innerHTML = "";
    if (!Array.isArray(actions)) {
        return;
    }
    registeredActions = {};
    for (const action of actions) {
        let actionElement = createActionElement(action.code, action.description);
        registeredActions[action.code.toLowerCase()] = action;
        dialogActions.appendChild(actionElement);
    }
}

function setDialogAsInformation(description, actions) {
    dialog.className = "dialog information";
    setDialog("INFORMATION", description, actions);
}

function setDialogAsError(description, actions) {
    dialog.className = "dialog error";
    setDialog("ERROR", description, actions);
}

function setDialogAsSuccess(description, actions) {
    dialog.className = "dialog success";
    setDialog("SUCCESS", description, actions);
}

(function () {
    setDialogAsSuccess("This is a message", [
        { code: "ESCAPE", description: "CLOSE" },
        { code: "R", description: "Reload" },
        { code: "ENTER", description: "CONTINUE" }
    ]);
})();

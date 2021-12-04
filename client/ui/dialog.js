const dialogElement = document.getElementById("dialog");
const dialogTitleElement = dialogElement.querySelector("#dialogTitle");
const dialogDescriptionElement = dialogElement.querySelector("#dialogDescription");
const dialogActionsElement = dialogElement.querySelector("#dialogActions");

let registeredActions = {};
const dialogQueue = [];

if (!window.GetParentResourceName) {
    function GetParentResourceName() {
        return "mocked-resource-name";
    }
}

function triggerNuiCallback(callback, data) {
    return fetch(`https://${GetParentResourceName()}/${callback}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    }).then(r => {
        return r.json();
    });
}

function triggerDialogCallback(data) {
    return triggerNuiCallback("dialog-callback", data);
}

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
    triggerDialogCallback(action);

    dialogQueue.shift();

    if (dialogQueue.length === 0) {
        dialogElement.style.display = "none";
        triggerNuiCallback("disable-focus-callback")
            .then(enableCustomizedFrame);
    } else
        dialogQueue[0]();
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
    dialogTitleElement.textContent = title;
    dialogDescriptionElement.textContent = description;
    dialogActionsElement.innerHTML = "";
    if (!Array.isArray(actions)) {
        return;
    }
    registeredActions = {};
    for (const action of actions) {
        let actionElement = createActionElement(action.key, action.description);
        registeredActions[action.code.toLowerCase()] = action;
        dialogActionsElement.appendChild(actionElement);
    }
    dialogElement.style.display = "block";
}

function setDialogAsInformation(description, actions) {
    dialogElement.className = "dialog information";
    setDialog("INFORMATION", description, actions);
}

function setDialogAsError(description, actions) {
    dialogElement.className = "dialog error";
    setDialog("ERROR", description, actions);
}

function setDialogAsSuccess(description, actions) {
    dialogElement.className = "dialog success";
    setDialog("SUCCESS", description, actions);
}

function onDialogMessage(data) {
    const type = data.type;

    if (!type) {
        throw new Error("Expected type to be defined");
    }

    const dialogHandlers = {
        success: setDialogAsSuccess,
        information: setDialogAsInformation,
        error: setDialogAsError
    };

    const dialogTypeHandler = dialogHandlers[type.toLowerCase()];

    if (!dialogTypeHandler) {
        throw new Error(`Invalid dialog type ${type}`);
    }


    dialogQueue.push(() => {
        dialogTypeHandler(data.description, data.actions);
        disableCustomizedFrame();
    });

    if (dialogQueue.length === 1) {
        dialogQueue[0]();
    }
}

(function () {
    registerMessageHandler("dialog", onDialogMessage);
})();

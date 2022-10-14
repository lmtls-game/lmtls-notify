export class DialogAction
{
    /**
     * @param {string} keyCode
     * @param {string} label
     * @param {function(): boolean} [callback]
     */
    constructor(keyCode, label, callback) {
        if (typeof keyCode != "string") {
            throw Error("Expected key code to be a string.");
        }
        if (typeof label != "string") {
            throw Error("Expected label to be a string.");
        }
        if (callback && typeof callback != "function") {
            throw Error("Expected callback to be a function.");
        }

        this.code = keyCode;
        this.label = label;
        this.callback = callback;
    }
}

/**
 * @class
 * @constructor
 * @public
 * @member {DialogAction} actions
 * @member {string} description
 */
export class Dialog
{
    /**
     * @type {DialogAction[]}
     */
    actions = [];

    /**
     * @type {string}
     */
    description;

    /**
     * @type {{description: string|undefined}|undefined}
     */
    meta;

    /**
     * @type {DocumentFragment}
     */
    template;

    /**
     * @type {string}
     */
    type;

    /**
     * @param {string} type
     * @param {{description: string|undefined}} [meta]
     */
    constructor(type, meta) {
        this.meta = meta;
        if (typeof type != "string") {
            throw Error("Expected type to be a string.");
        }
        this.description = meta?.description ?? "";
        this.template = document.getElementById("dialog-template");
        this.type = type;
    }

    /**
     * @param {DialogAction} action
     */
    addAction(action) {
        this.actions[action.code] = action;
    }

    _buildDialogUI() {
        const dialogRoot = document.createElement("div");
        dialogRoot.className = "dialog";
        const innerElement = document.createElement("div");
        innerElement.className = `dialog ${this.type}`;
        const dialogContainer = this._buildDialogContainer();
        innerElement.append(dialogContainer);
        dialogRoot.append(innerElement);
        return dialogRoot;
    }

    _buildDialogContainer() {
        const container = document.createElement("div");

        container.className = "dialog__container";
        const actions = this._buildDialogActions();
        container.append(actions);

        const content = this._buildDialogContent();

        container.append(content);

        return container;
    }


    _buildDialogActions() {
        const element = document.createElement("div");
        element.className = "dialog__actions";
        for (const actionsKey in this.actions) {
            const action = this.actions[actionsKey];
            const actionElement = this._buildDialogAction(action);
            element.append(actionElement);
        }
        return element;
    }

    _buildDialogContent() {
        const element = document.createElement("div");
        element.className = "dialog__content";
        element.innerHTML = `
        <div class="dialog__icon"></div>
        <div id="dialogTitle" class="dialog__title">
           ${this.type}
        </div>

        <div id="dialogDescription" class="dialog__description">
           ${this.description}
        </div>
        `;
        return element;
    }

    _buildDialogAction(action) {
        const actionElement = document.createElement("div");
        actionElement.className = "action";
        actionElement.innerHTML = `
            <div class="action__key">[${action.code}]</div>
            <div class="action__description">${action.label}</div>
        `;
        return actionElement;
    }

    /**
     * Render and show the dialog.
     */
    render() {
        this.element = this._buildDialogUI();
        document.body.append(this.element);
    }

    /**
     * Handle action and execute action's callback
     * @param {string} key
     */
    handle(key) {
        const action = this.actions[key];
        if (!action) {
            return;
        }
        if (action.callback) {
            action.callback();
        }
        this.destroy();
        return true;
    }

    /**
     * Destroy the element from dom.
     */
    destroy() {
        if (this.element) {
            document.body.removeChild(this.element);
        }
    }

}

export class DialogManager
{
    /**
     * @type {Dialog[]}
     */
    dialogs = [];

    /**
     * @type Dialog
     */
    renderedDialog;

    /**
     * Add dialog to the stack
     * @param {Dialog} dialog
     */
    addDialog(dialog) {
        this.dialogs.push(dialog);
        this.render();
    }

    /**
     * Signal dialog
     * @param {string} signal
     */
    process(signal) {
        if (!this.renderedDialog) {
            return;
        }

        if (this.renderedDialog.handle(signal)) {
            this.renderedDialog = null;
        }
    }

    /**
     * Render dialog from the stack.
     */
    render() {
        if (this.renderedDialog) {
            return;
        }
        const dialog = this.dialogs.shift();
        if (!dialog) {
            return;
        }
        this.renderedDialog = dialog;
        dialog.render();
    }
}

export class DialogFacade
{
    dialogManager = new DialogManager();

    constructor() {
        document.onkeyup = (e) => {
            this.dialogManager.process(e.key);
            this.dialogManager.render();
        };
    }

    showError(actions) {
        const dialog = new Dialog("error");
        for (const action of actions) {
            dialog.addAction(action);
        }
        this.dialogManager.addDialog(dialog);
        this.dialogManager.render();
    }

    showSuccess(actions) {
        const dialog = new Dialog("success");
        for (const action of actions) {
            dialog.addAction(action);
        }
        this.dialogManager.addDialog(dialog);
        this.dialogManager.render();
    }

    showInformation(actions) {
        const dialog = new Dialog("information");
        for (const action of actions) {
            dialog.addAction(action);
        }
        this.dialogManager.addDialog(dialog);
        this.dialogManager.render();
    }
}

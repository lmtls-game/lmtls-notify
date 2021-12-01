const APP_URL = "http://localhost:7788";

const mockDialog = {
    id: "mock-id",
    type: "information",
    description: "This is mocked message",
    actions: [
        {
            key: "ESCAPE",
            code: "escape",
            description: "TO ESCAPE",
            instanceId: "mock-id"
        }
    ]
};

function sendNuiMessage(message, data) {
    cy.window().then(w => w.dispatchEvent(new CustomEvent("message", {
        detail: {
            message,
            data
        }
    })));
}

describe("init", () =>
{
    beforeEach(() => {
        cy.visit(APP_URL);
    });

    it("should have a display none when loading", () =>
    {
        cy.get("#dialog").should("have.css", "display")
            .and("equals", "none");
    });

    it("should have only one class", () =>
    {
        cy.get("#dialog").should("have.class", "dialog");
    });
});


describe("message invoked", () =>
{
    beforeEach(() => {
        cy.visit(APP_URL);
        cy.intercept("POST", "https://mocked-resource-name/dialog-callback", { body: "{}" }).as("nuiDialogCallback");
        cy.intercept("POST", "https://mocked-resource-name/disable-focus-callback", { body: "{}" }).as("nuiDisableFocusCallback");
    });

    it("should change the display when getting a message", () =>
    {
        sendNuiMessage("dialog", mockDialog);

        cy.get("#dialog").should("have.css", "display")
            .and("equals", "block");
    });

    it("should add the class of the given type", () =>
    {
        mockDialog.type = "success";
        sendNuiMessage("dialog", mockDialog);

        cy.get("#dialog").should("have.class", "success");
    });

    it("should make display none when action is invoked", () =>
    {
        sendNuiMessage("dialog", mockDialog);
        cy.document().trigger("keyup", { code: mockDialog.actions[0].code });
        cy.get("#dialog").should("have.css", "display")
            .and("equals", "none");
    });

    it("should not make display none when wrong key is invoked", () =>
    {
        sendNuiMessage("dialog", mockDialog);
        cy.document().trigger("keyup", { code: "wrong-key" });
        cy.get("#dialog").should("have.css", "display")
            .and("equals", "block");
    });

    it("should invoke nui callback api call", () =>
    {
        sendNuiMessage("dialog", mockDialog);
        cy.document().trigger("keyup", { code: mockDialog.actions[0].code });
        cy.wait("@nuiDialogCallback")
            .its("request.url")
            .should("include", "dialog-callback");
    });

    it("should able to queue multiple dialogs", () =>
    {
        sendNuiMessage("dialog", mockDialog);
        sendNuiMessage("dialog", mockDialog);
        cy.document().trigger("keyup", { code: mockDialog.actions[0].code });
        cy.get("#dialog").should("have.css", "display")
            .and("equals", "block");
        cy.document().trigger("keyup", { code: mockDialog.actions[0].code });
        cy.get("#dialog").should("have.css", "display")
            .and("equals", "none");
    });

    it("should invoke nui dialog callback for each dialog", () =>
    {
        sendNuiMessage("dialog", mockDialog);
        sendNuiMessage("dialog", mockDialog);
        cy.document().trigger("keyup", { code: mockDialog.actions[0].code });
        cy.wait("@nuiDialogCallback");
        cy.document().trigger("keyup", { code: mockDialog.actions[0].code });
        cy.wait("@nuiDialogCallback");
        cy.get("@nuiDialogCallback.all").should("have.length", 2);
    });

    it("should invoke nui disable focus for last dialog action", () =>
    {
        sendNuiMessage("dialog", mockDialog);
        sendNuiMessage("dialog", mockDialog);
        cy.document().trigger("keyup", { code: mockDialog.actions[0].code });
        cy.document().trigger("keyup", { code: mockDialog.actions[0].code });
        cy.wait("@nuiDisableFocusCallback").its("request.url").should("include", "disable-focus-callback");
        cy.get("@nuiDisableFocusCallback.all").should("have.length", 1);
    });

    it("should invoke dialog callback with the dialog instance", () =>
    {
        sendNuiMessage("dialog", mockDialog);
        cy.document().trigger("keyup", { code: mockDialog.actions[0].code });
        cy.wait("@nuiDialogCallback").its("request.body").should("have.property", "instanceId", mockDialog.id);
    });
});

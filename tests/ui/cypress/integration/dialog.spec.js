const APP_URL = "http://localhost:8080/lmtls-notify/client/ui/index.html?_ijt=hk62kdha99tuf2lja51tgnosve&_ij_reload=RELOAD_ON_SAVE";

window.fetch = function (url, options) {
    console.log("TRIGGERING CALLBACK", url, options);
    return Promise.resolve({
        json: () => {
        }
    });
};
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
    console.log("SENDING_NUI_EVENT", message, data);
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
});

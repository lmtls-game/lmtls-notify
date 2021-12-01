const APP_URL = "http://localhost:7788";

function sendNuiMessage(message, data) {
    cy.window().then(w => w.dispatchEvent(new CustomEvent("message", {
        detail: {
            message,
            data
        }
    })));
}


describe("toast", () =>
{
    beforeEach(() => {
        cy.clock();
        cy.visit(APP_URL);
    });

    it("expects [cy-test='toast'] to exist", () =>
    {
        cy.get("[cy-test='toast']").should("exist");
    });

    it("expects toast's display to be none", () =>
    {
        cy.get("[cy-test='toast']").should("have.css", "display", "none");
    });

    it("should change the display to block when we invoke message handler", () =>
    {
        sendNuiMessage("toast", { text: "hello world" });
        cy.get("[cy-test='toast']").should("have.css", "display", "block");
    });

    it("should change display to none after specified seconds", () =>
    {
        sendNuiMessage("toast", { text: "hello world", timeout: 2 });
        cy.get("[cy-test='toast']").should("have.css", "display", "block");
        cy.tick(2001);
        cy.get("[cy-test='toast']").should("have.css", "display", "none");
    });

    it("should change display to none after a default timeout when data.timeout is undefined", () =>
    {
        sendNuiMessage("toast", { text: "hello world" });
        cy.get("[cy-test='toast']").should("have.css", "display", "block");
        cy.tick(5000);
        cy.get("[cy-test='toast']").should("have.css", "display", "none");
    });

    it("should able to add custom text", () =>
    {
        sendNuiMessage("toast", { text: "hello world" });
        cy.get("[cy-test='toast-text']").should("have.text", "hello world");
    });

    it("should be able to stack multiple toast", () =>
    {
        sendNuiMessage("toast", { text: "hello 1" });
        sendNuiMessage("toast", { text: "hello 2" });
        cy.get("[cy-test='toast-text']").should("have.text", "hello 1");
        cy.tick(5001);
        cy.get("[cy-test='toast-text']").should("have.text", "hello 2");
    });
});

// noinspection JSCheckFunctionSignatures

import {jest} from "@jest/globals";
import * as dialogModule from "../js/dialog";
import {Dialog} from "../js/dialog";

/*
For each Dialog we need
1. Type (error, information, success, warning)
2. Title (can use type ?)
3.
* @jest-environment jsdom
 */

describe("DialogAction", () =>
{
    it("is class", () => {
        expect(dialogModule.DialogAction).toBeInstanceOf(Function);
    });

    it("should throws when keyCode is not a string", () => {
        expect(() => new dialogModule.DialogAction(null, "l", jest.fn())).toThrow("Expected key code to be a string.");
    });

    it("should throws when callback is not a function", () => {
        expect(() => new dialogModule.DialogAction("k", "l")).toThrow("Expected callback to be a function.");
    });

    it("should throws when label is not a string", () => {
        expect(() => new dialogModule.DialogAction("k", null, jest.fn())).toThrow("Expected label to be a string.");
    });

    it("should assign all properties", () => {
        const callback = jest.fn();
        const action = new dialogModule.DialogAction("k", "l", callback);
        expect(action.code).toBe("k");
        expect(action.label).toBe("l");
        expect(action.callback).toBe(callback);
    });
});

describe("Dialog", () =>
{
    beforeEach(() => {
        document.body.innerHTML = `
            <template id="dialog-template"><p>Hi</p></template>
        `;
    });

    it("is class", () => {
        expect(dialogModule.Dialog).toBeInstanceOf(Function);
    });

    it("should throw when type is not provided", () => {
        expect(() => new dialogModule.Dialog(null)).toThrow("Expected type to be a string.");
    });

    describe(".actions", () =>
    {
        let instance;
        beforeEach(() => {
            instance = new dialogModule.Dialog("success");
        });

        it("should be empty array", () => {
            expect(instance.actions).toBeInstanceOf(Array);
            expect(instance.actions).toBeEmpty();
        });
    });

    describe(".type", () =>
    {
        it("should returns the given type", () => {
            expect(new Dialog("xx").type).toBe("xx");
        });
    });

    describe(".description", () =>
    {
        it("should assign description", () => {
            const instance = new dialogModule.Dialog("success", { description: "xxx" });
            expect(instance.description).toBe("xxx");
        });

        it("should empty string when description not provided", () => {
            const instance = new dialogModule.Dialog("success", {});
            expect(instance.description).toBe("");
        });
    });

    describe(".addAction", () =>
    {
        let instance;
        beforeEach(() => {
            instance = new dialogModule.Dialog("success");
        });

        it("exist as method", () => {
            expect(instance.addAction).toBeInstanceOf(Function);
        });

        it("expected to add action to .actions", () => {
            instance.addAction(new dialogModule.DialogAction("Escape", "Leave The Game", jest.fn()));
            expect(instance.actions["Escape"]).not.toBeNull();
            expect(instance.actions["Escape"]).toBeInstanceOf(dialogModule.DialogAction);
        });

        it("should be able to add multiple actions", () => {
            instance.addAction(new dialogModule.DialogAction("Escape", "Leave The Game", jest.fn()));
            instance.addAction(new dialogModule.DialogAction("Enter", "Accept", jest.fn()));
            expect(instance.actions["Escape"]).not.toBeNull();
            expect(instance.actions["Enter"]).not.toBeNull();
        });

        it("should be able to override an action", () => {
            instance.addAction(new dialogModule.DialogAction("Escape", "Leave The Game", jest.fn()));
            instance.addAction(new dialogModule.DialogAction("Escape", "Accept", jest.fn()));
            expect(instance.actions["Escape"].label).toBe("Accept");
        });
    });

    describe(".template", () =>
    {
        it("should be the element that has id of dialogModule-template", () => {
            const instance = new dialogModule.Dialog("success");
            expect(instance.template.innerHTML).toBe(`<p>Hi</p>`);
        });
    });

    describe(".render", () =>
    {
        let instance;
        beforeEach(() => {
            instance = new dialogModule.Dialog("success");
        });

        it("exists", () => {
            expect(instance.render).toBeInstanceOf(Function);
        });
    });

    describe(".handle", () =>
    {
        let instance;
        beforeEach(() => {
            instance = new dialogModule.Dialog("success");
        });

        it("exist", () => {
            expect(instance.handle).toBeInstanceOf(Function);
        });

        it("invoke the callback", () => {
            const callback = jest.fn();

            instance.addAction(new dialogModule.DialogAction("Escape", "", callback));

            instance.handle("Escape");

            expect(callback).toBeCalled();
        });

        it("should ignore unknown key code and return falsy", () => {
            const callback = jest.fn();

            instance.addAction(new dialogModule.DialogAction("Escape", "", callback));

            expect(() => {
                instance.handle("not-exist");
            }).not.toThrow();

            expect(callback).not.toBeCalled();
            expect(instance.handle("not-exist")).toBeFalsy();
        });

        it("should be able to handle multiple keys", () => {
            const callback = jest.fn();

            instance.addAction(new dialogModule.DialogAction("Escape", "", callback));
            instance.addAction(new dialogModule.DialogAction("Enter", "", callback));

            instance.handle("Escape");
            instance.handle("Enter");

            expect(callback).toHaveBeenCalledTimes(2);
        });

        it("should return true when action invoked", () => {
            const callback = jest.fn();

            instance.addAction(new dialogModule.DialogAction("Escape", "", callback));

            expect(instance.handle("Escape")).toBeTruthy();
        });

        it("should invoke destroy if when match any action", () => {
            const callback = jest.fn();

            const instanceDestroySpy = jest.spyOn(instance, "destroy")

            instance.addAction(new dialogModule.DialogAction("Escape", "", callback));

            instance.handle("Escape");

            expect(instanceDestroySpy).toHaveBeenCalledOnce();
        });
    });
});

describe("DialogManager", () =>
{
    it("exists", () => {
        expect(dialogModule.DialogManager).toBeInstanceOf(Function);
    });

    describe(".dialogs", () =>
    {
        it("should be empty array on creation", () => {
            const m = new dialogModule.DialogManager();
            expect(m.dialogs).toBeInstanceOf(Array);
            expect(m.dialogs).toBeEmpty();
        });
    });

    describe(".addDialog", () =>
    {
        let instance;
        beforeEach(() => {
            instance = new dialogModule.DialogManager();
        });

        it("exists", () => {
            expect(instance.addDialog).toBeInstanceOf(Function);
        });

        it("should able to add dialogModule", () => {
            jest.spyOn(instance, "render").mockImplementation();
            instance.addDialog(new dialogModule.Dialog("Success"));
            expect(instance.dialogs).toHaveLength(1);
        });

        it("should invoke render after adding", () => {
            const instanceRenderSpy = jest.spyOn(instance, "render");
            instance.addDialog(new dialogModule.Dialog("Success"));
            expect(instanceRenderSpy).toHaveBeenCalledOnce();
        });
    });

    describe(".process", () =>
    {
        let instance;
        beforeEach(() => {
            instance = new dialogModule.DialogManager();
        });

        it("exist", () => {
            expect(instance.process).toBeInstanceOf(Function);
        });

        it("should not throw when there is no dialog", () => {
            expect(() => instance.process("X")).not.toThrow();
        });

        it("expect .renderDialog to be null when dialog.handle returns true", () => {
            instance.renderedDialog = new dialogModule.Dialog("success");
            jest.spyOn(instance.renderedDialog, "handle").mockReturnValue(true);
            instance.process("x");
            expect(instance.renderedDialog).toBeNull();
        });

        it("expect .renderDialog not to be null when dialog.handle returns false", () => {
            instance.renderedDialog = new dialogModule.Dialog("success");
            jest.spyOn(instance.renderedDialog, "handle").mockReturnValue(false);
            instance.process("x");
            expect(instance.renderedDialog).not.toBeNull();
        });
    });


    describe(".render", () =>
    {
        /**
         * @type dialogModule.DialogManager
         */
        let instance;
        beforeEach(() => {
            instance = new dialogModule.DialogManager();
        });

        it("exist", () => {
            expect(instance.render).toBeFunction();
        });

        it("should invoke dialog.render", () => {
            const dialog = new dialogModule.Dialog("success");
            const dialogRenderSpy = jest.spyOn(dialog, "render");
            instance.addDialog(dialog);
            instance.render();
            expect(dialogRenderSpy).toHaveBeenCalledOnce();
        });

        it("should not throw when there is no dialog", () => {
            expect(() => instance.render()).not.toThrow();
        });
    });

    describe("handle only rendered dialog", () =>
    {
        /**
         * @type dialogModule.DialogManager
         */
        let instance;
        beforeEach(() => {
            instance = new dialogModule.DialogManager();
        });


        it("should handle the showing dialog", () => {
            const dialog = new dialogModule.Dialog("success");
            const dialogHandleSpy = jest.spyOn(dialog, "handle");
            instance.addDialog(dialog);
            instance.render();
            instance.process("x");
            expect(dialogHandleSpy).toHaveBeenCalledOnce();
        });

        it("should not render something if .renderedDialog is not falsy", () => {
            const dialog1 = new dialogModule.Dialog("success");
            const dialog2 = new dialogModule.Dialog("success");
            const dialogRenderSpy1 = jest.spyOn(dialog1, "render");
            const dialogRenderSpy2 = jest.spyOn(dialog2, "render");
            instance.addDialog(dialog1);
            instance.addDialog(dialog2);
            instance.render();
            instance.render();
            expect(dialogRenderSpy1).toHaveBeenCalledOnce();
            expect(dialogRenderSpy2).not.toHaveBeenCalledOnce();
        });
    });
});

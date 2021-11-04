"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nt = require("../NumTs/NumTs");
const LEFT_BUTTON = 0;
const RIGHT_BUTTON = 2;
var Mode;
(function (Mode) {
    Mode[Mode["None"] = 0] = "None";
    Mode[Mode["Pressed"] = 1] = "Pressed";
    Mode[Mode["Drag"] = 2] = "Drag";
})(Mode || (Mode = {}));
/**
 * Keeps track of the mouse state eg. press, click, move etc
 */
class MouseController {
    constructor() {
        this.pressed = new Array(3).fill(false);
        this.pressedPosition = null;
        this.pressedButton = 0;
        this.mode = Mode.None;
        this.mousePosition = { x: 0, y: 0 };
    }
    get currentMousePosition() {
        return this.mousePosition;
    }
    mouseLeave(event) {
        if (this.onMouseLeave) {
            this.onMouseLeave(event);
        }
    }
    mouseDown(event) {
        switch (event.button) {
            case LEFT_BUTTON:
                this.pressed[LEFT_BUTTON] = true;
                this.pressedPosition = { x: event.offsetX, y: event.offsetY };
                this.pressedButton = LEFT_BUTTON;
                break;
            case RIGHT_BUTTON:
                this.pressed[RIGHT_BUTTON] = true;
                this.pressedPosition = { x: event.offsetX, y: event.offsetY };
                this.pressedButton = RIGHT_BUTTON;
                break;
        }
        this.mode = Mode.Pressed;
    }
    mouseUp(event) {
        if (this.mode == Mode.Drag) {
            this.mode = Mode.None;
            if (this.onDragEnd) {
                this.onDragEnd(event, this.pressedButton);
            }
            return;
        }
        switch (event.button) {
            case LEFT_BUTTON:
                this.pressed[LEFT_BUTTON] = false;
                if (this.mode == Mode.Pressed) {
                    if (this.onContext) {
                        this.onContext(event, LEFT_BUTTON);
                    }
                    this.mode = Mode.None;
                }
                break;
            case RIGHT_BUTTON:
                this.pressed[RIGHT_BUTTON] = false;
                if (this.mode == Mode.Pressed) {
                    if (this.onContext) {
                        this.onContext(event, RIGHT_BUTTON);
                    }
                    this.mode = Mode.None;
                }
                break;
        }
    }
    mouseMove(event) {
        let mousePosition = { x: event.offsetX, y: event.offsetY };
        this.mousePosition = mousePosition;
        if (this.mode == Mode.Drag) {
            if (this.onDragMove) {
                this.onDragMove(event, this.pressedButton);
            }
        }
        else {
            if (this.onMouseMove) {
                this.onMouseMove(event);
            }
        }
        if (this.mode == Mode.Pressed && this.pressedPosition && nt.euclideanDistanceVec(this.pressedPosition, mousePosition) > 4) {
            if (this.onDragStart) {
                this.onDragStart(event, this.pressedButton, this.pressedPosition);
                this.mode = Mode.Drag;
            }
        }
    }
}
exports.MouseController = MouseController;

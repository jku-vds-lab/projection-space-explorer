import * as nt from '../NumTs/NumTs'

const LEFT_BUTTON = 0
const RIGHT_BUTTON = 2


enum Mode {
    None,
    Pressed,
    Drag
}

/**
 * Keeps track of the mouse state eg. press, click, move etc
 */
export class MouseController {
    pressed = new Array<boolean>(3).fill(false)
    pressedPosition: { x: number, y: number } = null
    pressedButton = 0
    mode: Mode = Mode.None

    onDragStart: (event: MouseEvent, button: number) => void
    onDragEnd: (event: MouseEvent, button: number) => void
    onDragMove: (event: MouseEvent, button: number) => void
    onContext: (event: MouseEvent, button: number) => void
    onMouseUp: (event: MouseEvent) => void

    constructor() {
        
    }

    mouseDown(event: MouseEvent) {
        switch (event.button) {
            case LEFT_BUTTON:
                this.pressed[LEFT_BUTTON] = true
                this.pressedPosition = { x: event.clientX, y: event.clientY }
                this.pressedButton = LEFT_BUTTON
                break;
            case RIGHT_BUTTON:
                this.pressed[RIGHT_BUTTON] = true
                this.pressedPosition = { x: event.clientX, y: event.clientY }
                this.pressedButton = RIGHT_BUTTON
                break;
        }

        this.mode = Mode.Pressed
    }

    mouseUp(event: MouseEvent) {
        if (this.mode == Mode.Drag) {
            this.mode = Mode.None
            if (this.onDragEnd) {
                this.onDragEnd(event, this.pressedButton)
            }
            return;
        }

        switch (event.button) {
            case LEFT_BUTTON:
                this.pressed[LEFT_BUTTON] = false

                if (this.mode == Mode.Pressed) {
                    if (this.onContext) {
                        this.onContext(event, LEFT_BUTTON)
                    }

                    this.mode = Mode.None
                }
                break;
            case RIGHT_BUTTON:
                this.pressed[RIGHT_BUTTON] = false

                if (this.mode == Mode.Pressed) {
                    if (this.onContext) {
                        this.onContext(event, RIGHT_BUTTON)
                    }

                    this.mode = Mode.None
                }
                break;
        }
    }

    mouseMove(event: MouseEvent) {
        let mousePosition = { x: event.clientX, y: event.clientY }

        if (this.mode == Mode.Drag) {
            if (this.onDragMove) {
                this.onDragMove(event, this.pressedButton)
            }
        }

        if (this.mode == Mode.Pressed && this.pressedPosition && nt.euclideanDistanceVec(this.pressedPosition, mousePosition) > 4) {
            if (this.onDragStart) {
                this.onDragStart(event, this.pressedButton)
                this.mode = Mode.Drag
            }
        }
    }
}
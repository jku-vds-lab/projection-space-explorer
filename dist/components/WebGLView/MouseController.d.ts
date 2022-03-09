import * as nt from '../NumTs/NumTs';
declare enum Mode {
    None = 0,
    Pressed = 1,
    Drag = 2
}
/**
 * Keeps track of the mouse state eg. press, click, move etc
 */
export declare class MouseController {
    pressed: boolean[];
    pressedPosition: nt.VectorType;
    pressedButton: number;
    mode: Mode;
    private mousePosition;
    onDragStart: (event: MouseEvent, button: number, initial: nt.VectorType) => void;
    onDragEnd: (event: MouseEvent, button: number) => void;
    onDragMove: (event: MouseEvent, button: number) => void;
    onContext: (event: MouseEvent, button: number) => void;
    onMouseDown: (event: MouseEvent) => void;
    onMouseUp: (event: MouseEvent) => void;
    onMouseMove: (event: MouseEvent) => void;
    onMouseLeave: (event: MouseEvent) => void;
    constructor();
    get currentMousePosition(): nt.VectorType;
    mouseLeave(event: MouseEvent): void;
    mouseDown(event: MouseEvent): void;
    mouseUp(event: MouseEvent): void;
    mouseMove(event: MouseEvent): void;
}
export {};

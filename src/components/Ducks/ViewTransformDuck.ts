import { Camera } from "three";
import { CameraTransformations } from "../WebGLView/CameraTransformations";

const SET = "ducks/viewTransform/SET"
const INVALIDATE = "ducks/viewTransform/INVALIDATE"

export const setViewTransform = (camera, width, height) => ({
    type: SET,
    camera: camera,
    width: width,
    height: height
});

export const invalidateTransform = () => ({
    type: INVALIDATE
})

type ViewTransformType = {
    camera: Camera,
    width: number,
    height: number
}

const initialState: ViewTransformType = {
    camera: null,
    width: 0,
    height: 0
}

export const viewTransform = (state = initialState, action): ViewTransformType => {
    switch (action.type) {
        case SET:
            return {
                camera: action.camera,
                width: action.width,
                height: action.height
            }
        case INVALIDATE:
            return {
                camera: state.camera,
                width: state.width,
                height: state.height
            }
        default:
            return state
    }
}
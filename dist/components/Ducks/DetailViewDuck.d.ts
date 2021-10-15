export declare function setDetailVisibility(open: boolean): {
    type: string;
    open: boolean;
};
declare const initialState: {
    open: boolean;
    active: string;
};
export default function detailView(state: {
    open: boolean;
    active: string;
}, action: any): typeof initialState;
export {};

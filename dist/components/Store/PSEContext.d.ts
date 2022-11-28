import { PropsWithChildren } from 'react';
import { API } from './API';
type PSEContextProps = {
    context?: API<any>;
    onStateChanged?: (values: any, keys: any) => void;
};
export declare function PSEContextProvider({ context, children, onStateChanged }: PropsWithChildren<PSEContextProps>): JSX.Element;
export {};

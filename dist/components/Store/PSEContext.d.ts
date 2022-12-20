import { PropsWithChildren } from 'react';
import type { RootState } from '.';
import { API } from './API';
type PSEContextProps<T extends RootState> = {
    context?: API<T>;
    onStateChanged?: (values: any, keys: any) => void;
};
export declare function PSEContextProvider({ context, children, onStateChanged }: PropsWithChildren<PSEContextProps<any>>): JSX.Element;
export {};

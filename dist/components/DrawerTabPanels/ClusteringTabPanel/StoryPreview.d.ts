import { EntityId } from '@reduxjs/toolkit';
import { ConnectedProps } from 'react-redux';
import { IBook } from '../../../model/Book';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    stories: import("../../Ducks/StoriesDuck copy").IStorytelling;
} & {
    setActiveStory: (book: EntityId) => any;
    deleteStory: (book: EntityId) => any;
    addStory: (book: IBook) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux;
export declare const StoryPreview: import("react-redux").ConnectedComponent<({ stories, setActiveStory, deleteStory, addStory }: Props) => JSX.Element, Pick<{
    stories: import("../../Ducks/StoriesDuck copy").IStorytelling;
} & {
    setActiveStory: (book: EntityId) => any;
    deleteStory: (book: EntityId) => any;
    addStory: (book: IBook) => any;
}, never>>;
export {};

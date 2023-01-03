import { EntityId } from '@reduxjs/toolkit';
import { ConnectedProps } from 'react-redux';
import { IBook } from '../../../model/Book';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    stories: import("../../Ducks/StoriesDuck").IStorytelling;
} & {
    setActiveStory: (book: EntityId) => any;
    deleteStory: (book: EntityId) => any;
    addStory: (book: IBook) => any;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
export declare const StoryPreview: import("react-redux").ConnectedComponent<({ stories, setActiveStory, deleteStory, addStory }: Props) => JSX.Element, import("react-redux").Omit<{
    stories: import("../../Ducks/StoriesDuck").IStorytelling;
} & {
    setActiveStory: (book: EntityId) => any;
    deleteStory: (book: EntityId) => any;
    addStory: (book: IBook) => any;
}, "stories" | "addStory" | "setActiveStory" | "deleteStory">>;
export {};
//# sourceMappingURL=StoryPreview.d.ts.map
import { ConnectedProps } from 'react-redux';
import { IBook } from '../../../model/Book';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    stories: import("../../Ducks/StoriesDuck").StoriesType;
} & {
    setActiveStory: (activeStory: any) => any;
    deleteStory: (story: any) => any;
    addStory: (story: IBook) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {};
export declare const StoryPreview: import("react-redux").ConnectedComponent<({ stories, setActiveStory, deleteStory, addStory }: Props) => JSX.Element, Pick<{
    stories: import("../../Ducks/StoriesDuck").StoriesType;
} & {
    setActiveStory: (activeStory: any) => any;
    deleteStory: (story: any) => any;
    addStory: (story: IBook) => any;
}, never>>;
export {};

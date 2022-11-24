import * as React from 'react';
import { ComponentConfig } from '../../../BaseConfig';
import Split from 'react-split';
type DetailViewChooserProps = {
    overrideComponents: ComponentConfig;
    splitRef: React.LegacyRef<Split>;
};
export declare function ViewsTabPanel({ overrideComponents, splitRef }: DetailViewChooserProps): JSX.Element;
export {};

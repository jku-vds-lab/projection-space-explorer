import * as React from 'react';
import Split from 'react-split';
import { ComponentConfig } from '../../../BaseConfig';
import { GlobalLabelsState } from '../../Ducks';
type DetailViewChooserProps = {
    overrideComponents: ComponentConfig;
    splitRef: React.LegacyRef<Split>;
    globalLabels: GlobalLabelsState;
};
export declare function ViewsTabPanel({ overrideComponents, splitRef, globalLabels }: DetailViewChooserProps): JSX.Element;
export {};
//# sourceMappingURL=ViewsTabPanel.d.ts.map
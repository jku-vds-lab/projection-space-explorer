/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import SVG from 'react-inlinesvg';
import { SvgIcon } from '@mui/material';
// @ts-ignore
import PseDataset from '../../textures/icons/pse-icon-dataset.svg';
// @ts-ignore
import PseClusters from '../../textures/icons/pse-icon-clusters.svg';
// @ts-ignore
import PseSelection from '../../textures/icons/pse-icon-selection.svg';
// @ts-ignore
import PseEncoding from '../../textures/icons/pse-icon-encoding.svg';
// @ts-ignore
import PseProject from '../../textures/icons/pse-icon-project.svg';
// @ts-ignore
import PseLineup from '../../textures/icons/pse-icon-lineup.svg';

/**
 * Makes the inlined base64 icons accessible in apps that use PSE as a library.
 */
export const PSEIcons = {
  Dataset: () => <SVG src={PseDataset} />,
  Clusters: () => <SVG src={PseClusters} />,
  Details: () => <SVG src={PseSelection} />,
  Encoding: () => <SVG src={PseEncoding} />,
  Project: () => <SVG src={PseProject} />,
  PseLineup: () => <SVG src={PseLineup} />,
};

export function PSESvgIcon ({ component }: { component: React.ElementType }) {
  return <SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={component} />;
}
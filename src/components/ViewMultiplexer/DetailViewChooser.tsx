import * as React from 'react';
import { ConnectedComponent, useSelector } from 'react-redux';
import { ComponentConfig } from '../../BaseConfig';
import type { RootState } from '../Store';

function instantiateElement(view: JSX.Element | (() => JSX.Element) | ConnectedComponent<any, any>) {
  return React.isValidElement(view) ? view : React.createElement(view as React.FunctionComponent, {});
}

export function DetailViewChooser({ overrideComponents }: { overrideComponents: ComponentConfig }) {
  const detailView = useSelector((state: RootState) => state.detailView);

  if (!overrideComponents || !overrideComponents.detailViews || overrideComponents.detailViews.length === 0) {
    return null;
  }

  const { view, alwaysRender } = overrideComponents.detailViews[detailView.active];

  // If alwaysRender is set to true, this allows the view to remain mounted even when resizing.
  if (!detailView.open && !alwaysRender) {
    return null;
  }

  return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{instantiateElement(view)}</div>;
}

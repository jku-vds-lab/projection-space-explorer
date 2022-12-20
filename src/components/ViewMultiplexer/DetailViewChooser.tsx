import * as React from 'react';
import { ConnectedComponent, useDispatch, useSelector } from 'react-redux';
import { ComponentConfig } from '../../BaseConfig';
import { DetailViewActions } from '../Ducks';
import type { RootState } from '../Store';

type DetailViewChooserProps = {
  overrideComponents: ComponentConfig;
};

function instantiateElement(view: JSX.Element | (() => JSX.Element) | ConnectedComponent<any, any>) {
  return React.isValidElement(view) ? view : React.createElement(view as React.FunctionComponent, {});
}

export function DetailViewChooser({ overrideComponents }: DetailViewChooserProps) {
  const detailView = useSelector((state: RootState) => state.detailView);

  if (!overrideComponents || !overrideComponents.detailViews || !detailView.open || overrideComponents.detailViews.length === 0) {
    return null;
  }

  const { view } = overrideComponents.detailViews[detailView.active];

  return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{instantiateElement(view)}</div>;
}

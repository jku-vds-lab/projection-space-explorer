import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Handler } from 'vega-tooltip';
import TrrackScatter from './TrrackScatter';
import { IVector } from '../../../model/Vector';
import type { RootState } from '../../../components/Store/Store';
import { DefaultLegend } from '../../../components/legends/DefaultLegend';

function getScatter(vectors) {
  // init empty "data" array
  const data = [];
  // iterate vectors v
  vectors.forEach((v) => {
    // parse v to array
    const parsed = JSON.parse(v.selectedCoordsNorm.replace(/'/g, '"'));
    // concat parsed v to data
    data.push(...parsed);
  });

  return (
    <div style={{ width: '100%', maxHeight: '100%' }}>
      <div
        style={{
          justifyContent: 'center',
          display: 'flex',
          width: '100%',
          overflow: 'auto',
        }}
      >
        <TrrackScatter data={{ values: data }} actions={false} tooltip={new Handler().call} />
      </div>
    </div>
  );
}

const mapState = (state: RootState) => {
  return {
    dataset: state.dataset,
  };
};

const mapDispatch = () => ({});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  aggregate: boolean;
  selection: IVector[];
};

export const TrrackLegend = connector(({ selection }: Props) => {
  if(selection.length <= 0){
    return <DefaultLegend></DefaultLegend>
  }
  return getScatter(selection);
});

var d3 = require('d3')
import * as React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Handler } from 'vega-tooltip';
import TrrackScatter from './TrrackScatter.js';
import { Vect } from "../../Utility/Data/Vect";
import { RootState } from '../../Store/Store.js';


function getScatter(vectors, dataset) {
  console.log('Trrack: vectors :>> ', vectors);

  // init empty "data" array
  const data = []
  // iterate vectors v
  vectors.forEach(v => {
    // parse v to array
    var parsed = JSON.parse((v['selectedCoordsNorm'].replace(/'/g,'\"')))
    // concat parsed v to data
    data.push(...parsed)    
  });

  return (
    <div style={{ width: "100%", maxHeight: '100%' }}>
      <div style={{
        width: "100%",
        overflow: "auto"
      }}>
        <TrrackScatter data={{'values': data}} actions={false} tooltip={new Handler().call}/>
      </div>
    </div>
  );

}

const mapState = (state: RootState) => {
  return ({
    dataset: state.dataset
  })
}

const mapDispatch = dispatch => ({})

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    aggregate: boolean
    selection: Vect[]
}

export var TrrackLegend = connector(({ selection, dataset }: Props) => {
  return getScatter(selection, dataset)
})
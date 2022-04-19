/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { Card } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';
import ReactDOM = require('react-dom');
import { GenericLegend } from '../legends/Generic';
import { setHoverWindowMode, WindowMode } from '../Ducks/HoverSettingsDuck';

import { MyWindowPortal } from './WindowPortal';
import { isVector } from '../../model/Vector';
import type { RootState } from '../Store/Store';

function HoverItemPortal(props) {
  return ReactDOM.createPortal(props.children, document.getElementById('HoverItemDiv'));
}

const mapStateToProps = (state: RootState) => ({
  currentAggregation: state.currentAggregation,
  hoverState: state.hoverState,
  dataset: state.dataset,
  hoverSettings: state.hoverSettings,
});

const mapDispatchToProps = (dispatch) => ({
  setHoverWindowMode: (value) => dispatch(setHoverWindowMode(value)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const SelectionClustersFull = function ({ dataset, currentAggregation, hoverState, hoverSettings, setHoverWindowMode }: Props) {
  if (!dataset) {
    return null;
  }

  const [vectors, setVectors] = React.useState(currentAggregation.aggregation.map((i) => dataset.vectors[i]));

  React.useEffect(() => {
    setVectors(currentAggregation.aggregation.map((i) => dataset.vectors[i]));
  }, [currentAggregation]);

  // const genericAggregateLegend =
  //   currentAggregation.aggregation && currentAggregation.aggregation.length > 0 ? (
  //     <GenericLegend aggregate type={dataset.type} vectors={vectors} />
  //   ) : (
  //     <Box paddingLeft={2}>
  //       <Typography color="textSecondary">Select Points in the Embedding Space to show a Summary Visualization.</Typography>
  //     </Box>
  //   );
  const genericAggregateLegend = <GenericLegend aggregate type={dataset.type} vectors={vectors} />;

  return (
    <div
      style={{
        width: '18rem',
        height: '100px',
        flex: '1 1 auto',
      }}
    >
      {hoverState && hoverState.data && isVector(hoverState.data) && (
        <HoverItemPortal>
          <Card
            elevation={24}
            style={{
              width: 300,
              maxHeight: '50vh',
              minHeight: 300, // 360 interferes with lineup
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GenericLegend aggregate={false} type={dataset.type} vectors={[hoverState.data]} />
          </Card>
        </HoverItemPortal>
      )}

      {hoverSettings.windowMode === WindowMode.Extern ? (
        <MyWindowPortal
          onClose={() => {
            setHoverWindowMode(WindowMode.Embedded);
          }}
        >
          <div className="portalSummary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            {genericAggregateLegend}
          </div>
        </MyWindowPortal>
      ) : (
        <div
          style={{
            display: 'flex',
            flexShrink: 0,
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {genericAggregateLegend}
        </div>
      )}
    </div>
  );
};

export const SelectionClusters = connector(SelectionClustersFull);

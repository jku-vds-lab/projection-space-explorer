import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import { EntityId, EntityState } from '@reduxjs/toolkit';
import { IconButton, Typography } from '@mui/material';
import { WebGLView } from '../WebGLView/WebGLView';
import { ViewSelector, ViewActions, SingleMultiple } from '../Ducks/ViewDuck';
import { IPosition, IProjection } from '../../model/ProjectionInterfaces';
import type { RootState } from '../Store';
import { Dataset } from '../../model/Dataset';

function selectPositions(dataset: Dataset, projection: IProjection) {
  if (projection.xChannel || projection.yChannel) {
    return dataset.vectors.map((vector) => ({
      x: projection.xChannel ? vector[projection.xChannel] : 0,
      y: projection.yChannel ? vector[projection.yChannel] : 0,
    }));
  }

  return projection.positions;
}

function WebView({
  id,
  multiples,
  overrideComponents,
  onCloseView,
}: {
  multiples: {
    multiples: EntityState<SingleMultiple>;
    active: EntityId;
    projections: EntityState<IProjection>;
  };
  id: EntityId;
  overrideComponents;
  onCloseView;
}) {
  const value = multiples.multiples.entities[id];

  const dataset = useSelector((state: RootState) => state.dataset);
  const dispatch = useDispatch();

  const projection =
    typeof value.attributes.workspace === 'string' || typeof value.attributes.workspace === 'number'
      ? multiples.projections.entities[value.attributes.workspace]
      : value.attributes.workspace;

  const [positions, setPositions] = React.useState<IPosition[]>();

  React.useEffect(() => {
    setPositions(selectPositions(dataset, projection));
  }, [projection.xChannel, projection.yChannel, dataset, projection]);

  const active = value.id === multiples.active;
  const boxShadow = '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)';

  return (
    <div
      style={{
        flexGrow: 1,
        height: 0,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${active ? '#007dad' : 'rgba(0.12, 0.12, 0.12, 0.12)'}`,
        borderRadius: active ? '' : '0.25rem',
        boxShadow: active ? boxShadow : '',
        overflow: 'hidden',
      }}
      key={id}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '16px',
          background: active ? 'lavender' : 'aliceblue',
        }}
      >
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Typography variant="button" component="span">
            {projection.metadata?.method}
          </Typography>

          {projection.name ? (
            <Typography variant="body1" component="span">
              {` - "${projection.name}"`}
              {projection.xChannel || projection.yChannel ? ` [x: ${projection.xChannel}, y: ${projection.yChannel}]` : null}
            </Typography>
          ) : null}
        </div>

        <div style={{ display: 'flex' }}>
          {value.id === multiples.multiples.ids[0] ? (
            <IconButton
              size="small"
              onClick={() => dispatch(ViewActions.addView(dataset))}
              style={{ visibility: value.id === multiples.multiples.ids[0] ? 'visible' : 'hidden' }}
            >
              <SplitscreenIcon />
            </IconButton>
          ) : null}

          <IconButton disabled={value.id === multiples.multiples.ids[0]} size="small" onClick={() => onCloseView(value.id)}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <div style={{ flexGrow: 1 }}>
        {positions ? <WebGLView overrideComponents={overrideComponents} multipleId={id} {...value.attributes} workspace={positions} /> : null}
      </div>
    </div>
  );
}

export function ViewMultiplexer({ overrideComponents }) {
  const multiples = useSelector(ViewSelector.selectAll);
  const dispatch = useDispatch();

  const count = multiples.multiples.ids.length;

  const onCloseView = (id: EntityId) => {
    dispatch(ViewActions.deleteView(id));
  };

  return (
    <div style={{ width: '100%', height: 'calc(100% - 8px)', display: 'flex', gap: '4px', margin: '4px' }}>
      {count > 0 ? (
        <div style={{ flexGrow: 1, display: 'flex', width: 0, flexDirection: 'column' }}>
          <WebView id={multiples.multiples.ids[0]} multiples={multiples} overrideComponents={overrideComponents} onCloseView={onCloseView} />
        </div>
      ) : null}

      {count > 1 ? (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px', width: 0 }}>
          {multiples.multiples.ids.slice(1).map((id) => {
            return <WebView key={id} id={id} multiples={multiples} overrideComponents={overrideComponents} onCloseView={onCloseView} />;
          })}
        </div>
      ) : null}
    </div>
  );
}

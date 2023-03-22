import * as React from 'react';
import { ConnectedComponent, useDispatch, useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarIcon from '@mui/icons-material/Star';
import Split from 'react-split';
import type { RootState } from '../../Store/Store';
import { DetailViewActions } from '../../Ducks/DetailViewDuck';
import { ComponentConfig } from '../../../BaseConfig';
import { Box, Tooltip, Typography } from '@mui/material';
import { GlobalLabelsState } from '../../Ducks';
import { StarBorder } from '@mui/icons-material';
import { toSentenceCase } from '../../../utils';

type DetailViewChooserProps = {
  overrideComponents: ComponentConfig;
  splitRef: React.LegacyRef<Split>;
  globalLabels: GlobalLabelsState
};

function instantiateElement(view: JSX.Element | (() => JSX.Element) | ConnectedComponent<any, any>, splitRef: React.LegacyRef<Split>) {
  if (!view) return null;

  return React.isValidElement(view) ? view : React.createElement(view as () => JSX.Element, { splitRef });
}

export function ViewsTabPanel({ overrideComponents, splitRef, globalLabels }: DetailViewChooserProps) {
  const dispatch = useDispatch();

  const detailView = useSelector((state: RootState) => state.detailView);

  if (!overrideComponents || !overrideComponents.detailViews || overrideComponents.detailViews.length === 0) {
    return null;
  }

  const view = overrideComponents.detailViews[detailView.active].settings;

  const onViewChange = (view: string) => {
    dispatch(DetailViewActions.setDetailView(overrideComponents.detailViews.findIndex((e) => e.name === view)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Box paddingX={2} paddingTop={2} paddingBottom={1}>
        <Typography variant="subtitle2" gutterBottom>
          Tabular view of {globalLabels.itemLabelPlural}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Choose a tabular view from the list below to show it.
        </Typography>
      </Box>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} aria-label="tableviews">
        {overrideComponents.detailViews.map((dv, i) => {
          return (
            <ListItem disablePadding key={dv.name}>
              <Tooltip placement="right" title={<Typography variant="subtitle2">Activate {dv.name} view.</Typography>}>
                <ListItemButton selected={detailView.active === i} onClick={() => onViewChange(dv.name)}>
                  {detailView.active === i ? (
                    <ListItemIcon>
                      <StarIcon />
                    </ListItemIcon>
                  ) : (<ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>)}
                  <ListItemText primary={dv.name} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      {instantiateElement(view, splitRef)}
    </div>
  );
}

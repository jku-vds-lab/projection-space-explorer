import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '..';
import { capitalizeFirstLetter } from '../../utils/helpers';

const mapStateToProps = (state: RootState) => ({
  globalLabels: state.globalLabels,
});

const mapDispatch = (dispatch) => ({});

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

export var DefaultLegend = connector(({ globalLabels }: Props) => {
  return (
    <Box paddingLeft={2}>
      <Typography color="textSecondary">
        Select {capitalizeFirstLetter(globalLabels.itemLabel)} in the Embedding Space to show a Summary Visualization.
      </Typography>
    </Box>
  );
});

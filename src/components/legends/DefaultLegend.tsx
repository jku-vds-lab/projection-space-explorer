import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';
import { capitalizeFirstLetter } from '../../utils/helpers';
import { RootState } from '../Store/Store';

const mapStateToProps = (state: RootState) => ({
  globalLabels: state.globalLabels,
});

const mapDispatch = () => ({});

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

export const DefaultLegend = connector(({ globalLabels }: Props) => {
  return (
    <Box paddingLeft={2}>
      <Typography color="textSecondary">
        Select {capitalizeFirstLetter(globalLabels.itemLabel)} in the Embedding Space to show a Summary Visualization.
      </Typography>
    </Box>
  );
});

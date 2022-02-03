import { Grid, List, ListItem, ListItemText, ListSubheader, ListItemIcon, SvgIcon } from '@mui/material';
import React = require('react');
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShareIcon from '@mui/icons-material/Share';
import WidgetsIcon from '@mui/icons-material/Widgets';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { connect, ConnectedProps } from 'react-redux';
import { DatasetType } from '../../../model/DatasetType';
import type { RootState } from '../../Store';
import { DatasetEntriesAPI } from '../../Ducks/DatasetEntriesDuck';

export function TypeIcon({ type }) {
  switch (type) {
    case DatasetType.Neural:
      return (
        <ListItemIcon>
          <ShareIcon />
        </ListItemIcon>
      );
    case DatasetType.Story:
      return (
        <ListItemIcon>
          <MenuBookIcon />
        </ListItemIcon>
      );
    case DatasetType.Chess:
      return (
        <ListItemIcon>
          <SvgIcon viewBox="0 0 45 45">
            <g
              style={{
                opacity: 1,
                fill: 'none',
                fillRule: 'evenodd',
                fillOpacity: 1,
                stroke: '#000000',
                strokeWidth: 1.5,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeMiterlimit: 4,
                strokeDasharray: 'none',
                strokeOpacity: 1,
              }}
            >
              <g style={{ fill: '#000000', stroke: '#000000', strokeLinecap: 'butt' }}>
                <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z" />
                <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
                <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" />
              </g>
              <path
                d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"
                style={{ fill: 'none', stroke: '#ffffff', strokeLinejoin: 'miter' }}
              />
            </g>
          </SvgIcon>
        </ListItemIcon>
      );
    case DatasetType.Rubik:
      return (
        <ListItemIcon>
          <WidgetsIcon />
        </ListItemIcon>
      );
    default:
      return (
        <ListItemIcon>
          <HelpOutlineIcon />
        </ListItemIcon>
      );
  }
}

const mapStateToProps = (state: RootState) => ({
  datasetEntries: state.datasetEntries,
});

const mapDispatchToProps = () => ({});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & {
  onChange: any;
};

export const PredefinedDatasets = connector(({ onChange, datasetEntries }: Props) => {
  const types = DatasetEntriesAPI.getTypes(datasetEntries);

  const handleClick = (entry) => {
    onChange(entry);
  };

  return (
    <Grid item style={{ overflowY: 'auto', height: '100px', flex: '1 1 auto' }}>
      <List subheader={<li />} style={{ backgroundColor: 'white' }}>
        {types.map((type) => {
          return (
            <li key={type} style={{ backgroundColor: 'inherit' }}>
              <ul style={{ backgroundColor: 'inherit', paddingInlineStart: '0px' }}>
                <ListSubheader>{Object.keys(DatasetType)[Object.values(DatasetType).indexOf(type)].replaceAll('_', ' ')}</ListSubheader>
                {Object.values(datasetEntries.values.byId)
                  .filter((value) => value.type === type)
                  .map((entry) => {
                    return (
                      <ListItem
                        key={entry.path}
                        button
                        onClick={() => {
                          handleClick(entry);
                        }}
                      >
                        <TypeIcon type={entry.type} />
                        <ListItemText primary={entry.display} />
                      </ListItem>
                    );
                  })}
              </ul>
            </li>
          );
        })}
      </List>
    </Grid>
  );
});

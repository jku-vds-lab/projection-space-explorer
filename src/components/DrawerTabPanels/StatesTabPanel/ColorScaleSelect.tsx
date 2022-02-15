import React = require('react');
import { List, ListItem, Menu, MenuItem } from '@mui/material';
import { connect, useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../Store';
import { ANormalized, NormalizedDictionary } from '../../Utility';
import { ColorScalesActions } from '../../Ducks/ColorScalesDuck';
import { BaseColorScale } from '../../../model/Palette';
import { APalette } from '../../../model/palettes';

export function ColorScaleMenuItem({ scale }: { scale: BaseColorScale }) {
  if (!scale) {
    return null;
  }

  const palette = typeof scale.palette === 'string' ? APalette.getByName(scale.palette) : scale.palette;

  if (scale.type === 'sequential') {
    return (
      <div
        style={{ width: '100%', minWidth: '15rem', height: '1rem', backgroundImage: `linear-gradient(to right, ${palette.map((stop) => stop.hex).join(',')})` }}
      />
    );
  }
  return (
    <div
      style={{
        width: '100%',
        minWidth: '15rem',
        height: '1rem',
        backgroundImage: `linear-gradient(to right, ${palette
          .map((stop, index) => `${stop.hex} ${(index / palette.length) * 100.0}%, ${stop.hex} ${((index + 1) / palette.length) * 100.0}%`)
          .join(',')})`,
      }}
    />
  );
}

/**
 * Component that lets user pick from a list of color scales.
 */
export function ColorScaleSelectFull({ channelColor }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const scales = useSelector<RootState, NormalizedDictionary<BaseColorScale>>((state) => state.colorScales.scales);
  const active = useSelector<RootState, BaseColorScale>((state) => ANormalized.get(state.colorScales.scales, state.colorScales.active));

  const dispatch = useDispatch();

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!channelColor || !scales) {
    return null;
  }

  return (
    <div>
      <List component="nav" aria-label="Device settings">
        <ListItem button aria-haspopup="true" aria-controls="lock-menu" aria-label="when device is locked" onClick={handleClickListItem}>
          <ColorScaleMenuItem scale={active} />
        </ListItem>
      </List>
      <Menu id="lock-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {ANormalized.entries(scales)
          .filter(([, value]) => value.type === channelColor.type)
          .map(([key, value]) => (
            <MenuItem
              key={key}
              selected={active === value}
              onClick={() => {
                dispatch(ColorScalesActions.pickScale(key));
                handleMenuItemClick();
              }}
            >
              <ColorScaleMenuItem scale={value} />
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}

const mapStateToProps = (state) => ({
  channelColor: state.channelColor,
});

const mapDispatchToProps = () => ({});

export const ColorScaleSelect = connect(mapStateToProps, mapDispatchToProps)(ColorScaleSelectFull);

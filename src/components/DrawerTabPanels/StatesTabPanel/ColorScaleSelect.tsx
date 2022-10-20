import * as React from 'react';
import { Button, List, ListItem, Menu, MenuItem, Slider, TextField } from '@mui/material';
import { connect, useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Store';
import { styled } from '@mui/material/styles';
import { ANormalized, ContinuousMapping, DivergingMapping, isNumericMapping, Mapping, mapValueToColor, NormalizedDictionary } from '../../Utility';
import { BaseColorScale } from '../../../model/Palette';
import { APalette } from '../../../model/palettes';
import { clone } from 'lodash';
import * as d3v5 from 'd3v5';
import { PointColorScaleActions } from '../../Ducks';
import { CategoryOption } from '../../WebGLView/CategoryOptions';
import { ViewActions, ViewSelector } from '../../Ducks/ViewDuck';
import { Dataset } from '../../../model/Dataset';
import { getMinMaxOfChannel } from '../../WebGLView/UtilityFunctions';

const SVG_ID = 'mapping_svghistogram';

export const ThumbSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
  height: 2,
  padding: '15px 0',
  position: 'absolute',
  top: 3,
  pointerEvents: 'none',
  '& .MuiSlider-thumb': {
    pointerEvents: 'auto',
  },
  '& .MuiSlider-track': {
    display: 'none',
  },
  '& .MuiSlider-rail': {
    display: 'none',
  },
  '& .MuiSlider-mark': {
    display: 'none',
  },
  '& .MuiSlider-thumb:before': {
    width: 1,
    height: 62,
    backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
    borderRadius: 0,
    top: -64,
  },
}));

export function ColorScaleMenuItem({ scale, skew }: { scale: BaseColorScale; skew?: number }) {
  if (!scale) {
    return null;
  }

  const palette = typeof scale.palette === 'string' ? APalette.getByName(scale.palette) : scale.palette;

  if (scale.type === 'sequential') {
    return <div style={{ width: '100%', height: '1rem', backgroundImage: `linear-gradient(to right, ${palette.map((stop) => stop.hex).join(',')})` }} />;
  }

  if (scale.type === 'diverging') {
    return (
      <div
        style={{
          width: '100%',
          minWidth: 200,
          height: '1rem',
          backgroundImage: `linear-gradient(to right, ${palette
            .map((stop, i) => `${stop.hex} ${i === 1 ? (skew ? skew : 50) : i === 0 ? 0 : 100}%`)
            .join(',')})`,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: '100%',
        minWidth: 200,
        height: '1rem',
        backgroundImage: `linear-gradient(to right, ${palette
          .map((stop, index) => `${stop.hex} ${(index / palette.length) * 100.0}%, ${stop.hex} ${((index + 1) / palette.length) * 100.0}%`)
          .join(',')})`,
      }}
    />
  );
}

export default function NumberInput({ value, setValue, label }: { value: number; setValue: (_: number) => void; label: string }) {
  return (
    <TextField
      type="number"
      value={value}
      InputProps={{ inputProps: { min: -100000, max: 100000 } }}
      onChange={(e) => {
        var value = parseFloat(e.target.value);

        if (!Number.isNaN(value)) {
          setValue(value);
        }
      }}
      variant="standard"
      size="small"
      label={label}
    />
  );
}

function DivergingInput({
  scale,
  mapping,
  setMapping,
}: {
  scale: BaseColorScale;
  mapping: [number, number, number] | [number, number];
  setMapping: (value) => void;
}) {
  const alterMapping = (index: number, value: number) => {
    const newVal = clone(mapping);
    newVal[index] = value;
    setMapping(newVal);
  };

  return (
    <div style={{ width: '100%', display: 'flex', gap: 4, justifyContent: 'center' }}>
      <NumberInput value={mapping[0]} setValue={(value) => alterMapping(0, value)} label="min" />
      {mapping.length === 3 ? <NumberInput value={mapping[1]} setValue={(value) => alterMapping(1, value)} label="center" /> : null}
      <NumberInput value={mapping[mapping.length - 1]} setValue={(value) => alterMapping(mapping.length - 1, value)} label="max" />
    </div>
  );
}

/**
 * Component that lets user pick from a list of color scales.
 */
export function ColorScaleSelectFull({ channelColor, active }: { channelColor: CategoryOption; active }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const dataset = useSelector<RootState, Dataset>((state) => state.dataset);
  const scales = useSelector<RootState, NormalizedDictionary<BaseColorScale>>((state) => state.colorScales.scales);
  const mapping = useSelector(ViewSelector.defaultSelector).attributes.pointColorMapping as Mapping;

  const [tempMapping, setTempMapping] = React.useState<[number, number, number]>([0, 0, 0]);
  let min = 0,
    max = 0,
    mid = 0;
  if (tempMapping.length === 3) {
    [min, mid, max] = tempMapping;
  } else {
    [min, max] = tempMapping;
  }

  const height = 50;

  React.useEffect(() => {
    if (isNumericMapping(mapping)) {
      setTempMapping(clone(mapping.range));
    }
  }, [mapping]);

  React.useEffect(() => {
    var svg = d3v5.select(`#${SVG_ID}`);
    if (!(channelColor && active && isNumericMapping(mapping))) {
      svg.selectAll('*').remove();

      return;
    }

    var x = d3v5
      .scaleLinear()
      .domain([min, max])
      .range([0, 288 - 32]);

    var histogram = d3v5
      .histogram()
      .value(function (d) {
        return d[channelColor.key];
      })
      .domain(x.domain())
      .thresholds(x.ticks(70));

    var bins = histogram(dataset.vectors);

    var y = d3v5.scaleLinear().range([height, 0]);
    y.domain([
      0,
      d3v5.max(bins, function (d) {
        return d.length;
      }),
    ]);

    svg
      .selectAll('rect')
      .data(bins)
      .join('rect')
      //.append('rect')
      .attr('x', 1)
      .attr('transform', function (d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
      })
      .attr('width', function (d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr('height', function (d) {
        return 100 - y(d.length);
      });
  }, [min, max, channelColor, mapping]);

  React.useEffect(() => {
    if (!(channelColor && active && isNumericMapping(mapping))) {
      return;
    }

    var svg = d3v5.select(`#${SVG_ID}`);
    const newMapping = clone(mapping) as DivergingMapping | ContinuousMapping;

    if (mapping.type === 'diverging') {
      newMapping.range = [min, mid, max];
    } else {
      newMapping.range = [min, max];
    }

    svg.selectAll('rect').style('fill', (d) => {
      return mapValueToColor(newMapping, d.x0).hex;
    });
  }, [min, mid, max]);

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

  const scaleFilter =
    channelColor.type === 'categorical'
      ? (value: BaseColorScale) => value.type === 'categorical'
      : (value: BaseColorScale) => value.type === 'diverging' || value.type === 'sequential';

  return (
    <>
      {isNumericMapping(mapping) ? (
        <svg id={SVG_ID} width={288 - 32} height={height} style={{ marginRight: 16, marginLeft: 16, marginBottom: 4, marginTop: 8 }} />
      ) : null}

      <div style={{ position: 'relative', marginRight: 16, marginLeft: 16 }}>
        <List component="nav" style={{ padding: 0, marginBottom: 16 }}>
          <ListItem button onClick={handleClickListItem} style={{ padding: 0 }}>
            <ColorScaleMenuItem scale={active} skew={((mid - min) / (max - min)) * 100} />
          </ListItem>
        </List>
        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} style={{ width: 288 }}>
          {ANormalized.entries(scales)
            .filter(([, value]) => scaleFilter(value))
            .map(([key, value]) => (
              <MenuItem
                key={key}
                selected={active === value}
                onClick={() => {
                  dispatch(PointColorScaleActions.pickScale(key));
                  handleMenuItemClick();
                }}
              >
                <ColorScaleMenuItem scale={value} />
              </MenuItem>
            ))}
        </Menu>

        {mapping?.type == 'diverging' ? (
          <ThumbSlider
            min={min}
            max={max}
            value={tempMapping[1]}
            onChange={(_, newValue: number) => {
              setTempMapping([min, newValue, max]);
            }}
          />
        ) : null}

        {isNumericMapping(mapping) ? (
          <>
            <DivergingInput scale={active} setMapping={setTempMapping} mapping={tempMapping} />

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  dispatch(ViewActions.changeDivergingRange(tempMapping));
                }}
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  const bounds = getMinMaxOfChannel(dataset, channelColor.key);

                  if (mapping?.type === 'diverging') {
                    dispatch(ViewActions.changeDivergingRange([bounds.min, (bounds.min + bounds.max) / 2, bounds.max]));
                  } else if (mapping?.type === 'sequential') {
                    dispatch(ViewActions.changeDivergingRange([bounds.min, bounds.max]));
                  }
                }}
              >
                Reset
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = () => ({});

export const ColorScaleSelect = connect(mapStateToProps, mapDispatchToProps)(ColorScaleSelectFull);

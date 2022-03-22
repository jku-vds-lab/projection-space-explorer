/* eslint-disable react-hooks/rules-of-hooks */
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import * as React from 'react';
import { Grid, Typography, Box, Accordion, AccordionSummary, AccordionDetails, createFilterOptions, Autocomplete, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import { ShapeLegend } from './ShapeLegend';
import { setVectorByShapeAction } from '../../Ducks/VectorByShapeDuck';
import type { RootState } from '../../Store/Store';
import { setSelectedLineBy } from '../../Ducks/SelectedLineByDuck';
import { setChannelBrightnessSelection } from '../../Ducks/ChannelBrightnessDuck';
import { setGlobalPointBrightness } from '../../Ducks/GlobalPointBrightnessDuck';
import { BrightnessSlider } from './BrightnessSlider';
import { setChannelSize } from '../../Ducks/ChannelSize';
import { setGlobalPointSize } from '../../Ducks/GlobalPointSizeDuck';
import { SizeSlider } from './SizeSlider';
import { ColorScaleSelect } from './ColorScaleSelect';
import { AdvancedColoringPopover } from './AdvancedColoringPopover';
import { setChannelColor } from '../../Ducks/ChannelColorDuck';
import { setAdvancedColoringSelectionAction } from '../../Ducks/AdvancedColoringSelectionDuck';
import { PathLengthFilter } from './PathLengthFilter';
import { PathBrightnessSlider } from './PathBrightnessSlider';
import { CategoryOptionsAPI } from '../../WebGLView/CategoryOptions';
import { PointDisplayActions } from '../../Ducks/PointDisplayDuck';
import { EncodingChannel, BaseColorScale } from '../../../model';
import { SingleMultipleAttributes, ViewSelector } from '../../Ducks/ViewDuck';
import { PointColorScaleActions } from '../../Ducks';
import { ANormalized } from '../..';

const mapStateToProps = (state: RootState) => ({
  selectedLineBy: state.selectedLineBy,
  dataset: state.dataset,
});

const mapDispatchToProps = (dispatch) => ({
  setVectorByShape: (vectorByShape) => dispatch(setVectorByShapeAction(vectorByShape)),
  setSelectedLineBy: (lineBy) => dispatch(setSelectedLineBy(lineBy)),
  setChannelBrightness: (value) => dispatch(setChannelBrightnessSelection(value)),
  setGlobalPointBrightness: (value) => dispatch(setGlobalPointBrightness(value)),
  setChannelSize: (value) => dispatch(setChannelSize(value)),
  setGlobalPointSize: (value) => dispatch(setGlobalPointSize(value)),
  setAdvancedColoringSelection: (value) => dispatch(setAdvancedColoringSelectionAction(value)),
});

const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  encodings: EncodingChannel[];
};

export function SelectFeatureComponent({ label, default_val, categoryOptions, onChange, column_info }: any) {
  let autocomplete_options = [{ value: 'None', inputValue: 'None', group: null }];
  let autocomplete_filterOptions = null;
  if (categoryOptions != null) {
    autocomplete_options = autocomplete_options.concat(
      categoryOptions.attributes.map((attribute) => {
        let group = null;
        if (column_info != null && attribute.key in column_info) {
          group = column_info[attribute.key].featureLabel;
        }
        return {
          value: attribute.key,
          inputValue: attribute.name,
          group,
        };
      }),
    );
    autocomplete_filterOptions = createFilterOptions({
      stringify: (option: any) => {
        return option.group + option.value;
      },
    });
  }

  return (
    <Autocomplete
      id={`vectorBySelect_${label}`}
      filterOptions={autocomplete_filterOptions}
      onChange={(event, newValue) => {
        if (newValue) onChange(newValue.value);
      }}
      options={autocomplete_options.sort((a, b) => {
        if (a.value === 'None') return -1;
        if (b.value === 'None') return 1;

        if (a.group === b.group) {
          return -b.value.localeCompare(a.value);
        }
        return -b.group.localeCompare(a.group);
      })}
      size="small"
      groupBy={(option: any) => option.group}
      getOptionLabel={(option: any) => option.inputValue}
      isOptionEqualToValue={(option: any, value) => {
        return option.value === value.value;
      }}
      // defaultValue={channelColor ? autocomplete_color_options.filter((option:any) => option.value == channelColor.key)[0] : {value:"", inputValue:""}}
      value={default_val ? autocomplete_options.filter((option: any) => option.value === default_val.key)[0] : autocomplete_options[0]}
      renderInput={(params) => <TextField {...params} label={`${label} by`} />}
    />
  );
}
const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  heading: {
    // fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    // fontSize: theme.typography.pxToRem(15),
    // color: theme.palette.text.secondary,
  },
  details: {
    padding: '0px',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export function StatesTabPanelFull({
  dataset,
  setVectorByShape,
  setChannelBrightness,
  setGlobalPointBrightness,
  setChannelSize,
  setGlobalPointSize,
  encodings,
  setAdvancedColoringSelection,
}: Props) {
  if (dataset == null) {
    return null;
  }

  const activeMultiple = useSelector(ViewSelector.defaultSelector);
  const {
    vectorByShape,
    channelBrightness,
    channelSize,
    channelColor,
    pointColorMapping,
    pointColorScale,
    lineBrightness,
    pathLengthRange,
    globalPointSize,
    globalPointBrightness,
  } = activeMultiple.attributes;
  const active = useSelector<RootState, BaseColorScale>((state) => ANormalized.get(state.colorScales.scales, pointColorScale as string));

  const dispatch = useDispatch();

  const classes = useStyles();

  const [expanded, setExpanded] = React.useState<boolean | string>(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const categoryOptions = dataset?.categories;

  const points_box = (
    <Box
      sx={{
        '& .MuiAutocomplete-root': { p: 2, width: '100%', boxSizing: 'border-box' },
      }}
    >
      {(!encodings || encodings.includes(EncodingChannel.Shape)) && categoryOptions != null && CategoryOptionsAPI.hasCategory(categoryOptions, 'shape') ? (
        <SelectFeatureComponent
          column_info={dataset?.columns}
          label="shape"
          default_val={vectorByShape}
          categoryOptions={CategoryOptionsAPI.getCategory(categoryOptions, 'shape')}
          onChange={(newValue) => {
            let attribute = CategoryOptionsAPI.getCategory(categoryOptions, 'shape').attributes.filter((a) => a.key === newValue)[0];

            if (attribute === undefined) {
              attribute = null;
            }
            setVectorByShape(attribute);
          }}
        />
      ) : (
        <div />
      )}

      {(!encodings || encodings.includes(EncodingChannel.Shape)) && vectorByShape && (
        <Grid item style={{ padding: '0 16px' }}>
          <ShapeLegend
            dataset={dataset}
            category={vectorByShape}
            onChange={(checkboxes) => {
              dispatch(PointDisplayActions.setCheckedShapes(checkboxes));
            }}
          />
        </Grid>
      )}

      {categoryOptions != null && CategoryOptionsAPI.hasCategory(categoryOptions, 'transparency') ? (
        <SelectFeatureComponent
          column_info={dataset?.columns}
          label="brightness"
          default_val={channelBrightness}
          categoryOptions={CategoryOptionsAPI.getCategory(categoryOptions, 'transparency')}
          onChange={(newValue) => {
            let attribute = CategoryOptionsAPI.getCategory(categoryOptions, 'transparency').attributes.filter((a) => a.key === newValue)[0];

            if (attribute === undefined) {
              attribute = null;
            }

            const pointBrightness = attribute ? [0.25, 1] : [1];

            setGlobalPointBrightness(pointBrightness);
            setChannelBrightness(attribute);
          }}
        />
      ) : (
        <div />
      )}

      <BrightnessSlider globalPointBrightness={globalPointBrightness} />

      {categoryOptions != null && CategoryOptionsAPI.hasCategory(categoryOptions, 'size') ? (
        <SelectFeatureComponent
          column_info={dataset?.columns}
          label="size"
          default_val={channelSize}
          categoryOptions={CategoryOptionsAPI.getCategory(categoryOptions, 'size')}
          onChange={(newValue) => {
            let attribute = CategoryOptionsAPI.getCategory(categoryOptions, 'size').attributes.filter((a) => a.key === newValue)[0];
            if (attribute === undefined) {
              attribute = null;
            }

            const pointSize = attribute ? [1, 2] : [1];

            setGlobalPointSize(pointSize);

            setChannelSize(attribute);
          }}
        />
      ) : (
        <div />
      )}

      <SizeSlider globalPointSize={globalPointSize} />

      {categoryOptions != null && CategoryOptionsAPI.hasCategory(categoryOptions, 'color') ? (
        <SelectFeatureComponent
          column_info={dataset?.columns}
          label="color"
          default_val={channelColor}
          categoryOptions={CategoryOptionsAPI.getCategory(categoryOptions, 'color')}
          onChange={(newValue) => {
            let attribute = null;
            if (newValue && newValue !== '') {
              attribute = CategoryOptionsAPI.getCategory(categoryOptions, 'color').attributes.filter((a) => a.key === newValue)[0];
            }
            if (attribute === undefined) {
              attribute = null;
            }

            setAdvancedColoringSelection(new Array(10000).fill(true));
            dispatch(setChannelColor(attribute));

            if (attribute) {
              dispatch(PointColorScaleActions.initScaleByType(attribute.type));
            }
          }}
        />
      ) : (
        <div />
      )}

      <Grid item>
        <ColorScaleSelect channelColor={channelColor} active={active} />
      </Grid>

      <Grid item style={{ padding: '16px 0px' }}>
        {channelColor != null && channelColor.type === 'categorical' ? <AdvancedColoringPopover pointColorMapping={pointColorMapping} /> : <div />}
      </Grid>
    </Box>
  );

  const accordion = (
    <div style={{}}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography className={classes.heading}>Lines</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          {dataset && dataset.isSequential && (
            <div>
              <Grid container justifyContent="center" alignItems="stretch" direction="column" style={{ padding: '0 16px' }}>
                {
                  // <Legend
                  //   ref={this.legend}
                  //   onLineSelect={this.onLineSelect}></Legend>
                }

                <Box p={1} />

                {/** <LineTreePopover
                            webGlView={webGLView}
                            dataset={dataset}
                        colorScale={lineColorScheme} />* */}
              </Grid>

              <div style={{ margin: '8px 0px' }} />

              <PathLengthFilter pathLengthRange={pathLengthRange} />
              <PathBrightnessSlider lineBrightness={lineBrightness} />
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography className={classes.heading}>Points</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>{points_box}</AccordionDetails>
      </Accordion>
    </div>
  );

  return <div>{dataset && dataset.isSequential ? accordion : points_box}</div>;
}

export const StatesTabPanel = connector(StatesTabPanelFull);

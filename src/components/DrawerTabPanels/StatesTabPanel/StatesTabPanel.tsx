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
import { setChannelBrightnessAction } from '../../Ducks/ChannelBrightnessDuck';
import { setGlobalPointBrightness } from '../../Ducks/GlobalPointBrightnessDuck';
import { BrightnessSlider } from './BrightnessSlider';
import { setChannelSize } from '../../Ducks/ChannelSize';
import { setGlobalPointSize } from '../../Ducks/GlobalPointSizeDuck';
import { SizeSlider } from './SizeSlider';
import { ColorScaleSelect } from './ColorScaleSelect';
import { setChannelColor } from '../../Ducks/ChannelColorDuck';
import { setAdvancedColoringSelectionAction } from '../../Ducks/AdvancedColoringSelectionDuck';
import { PathLengthFilter } from './PathLengthFilter';
import { PathBrightnessSlider } from './PathBrightnessSlider';
import { CategoryOptionsAPI } from '../../WebGLView/CategoryOptions';
import { PointDisplayActions } from '../../Ducks/PointDisplayDuck';
import { BaseColorScale, DefaultFeatureLabel, EncodingChannel } from '../../../model';
import { ViewSelector } from '../../Ducks/ViewDuck';
import { ANormalized } from '../../Utility/NormalizedState';
import { PointColorScaleActions } from '../../Ducks/PointColorScaleDuck';

const mapStateToProps = (state: RootState) => ({
  selectedLineBy: state.selectedLineBy,
  dataset: state.dataset,
});

const mapDispatchToProps = (dispatch) => ({
  setVectorByShape: (vectorByShape) => dispatch(setVectorByShapeAction(vectorByShape)),
  setSelectedLineBy: (lineBy) => dispatch(setSelectedLineBy(lineBy)),
  setChannelBrightness: (value) => dispatch(setChannelBrightnessAction(value)),
  setGlobalPointBrightness: (value) => dispatch(setGlobalPointBrightness(value)),
  setChannelSize: (value) => dispatch(setChannelSize(value)),
  setGlobalPointSize: (value) => dispatch(setGlobalPointSize(value)),
  setAdvancedColoringSelection: (value) => dispatch(setAdvancedColoringSelectionAction(value)),
});

function SelectFeatureComponent({ label, default_val, categoryOptions, onChange, column_info, datacy }) {
  let autocomplete_options = [];
  let autocomplete_filterOptions = null;
  if (categoryOptions != null) {
    autocomplete_options = autocomplete_options.concat(
      categoryOptions.attributes.map((attribute) => {
        let group = DefaultFeatureLabel;
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
      data-cy={datacy}
      filterOptions={autocomplete_filterOptions}
      onChange={(event, newValue) => {
        onChange(newValue?.value ?? null);
      }}
      options={autocomplete_options.sort((a, b) => {
        if (a.value === 'None') return -1;
        if (b.value === 'None') return 1;

        if (a.group === b.group) {
          return -b.value.localeCompare(a.value);
        }
        return -b.group.localeCompare(a.group);
      })}
      multiple={false}
      size="small"
      groupBy={(option: any) => option.group}
      getOptionLabel={(option: any) => option.inputValue}
      isOptionEqualToValue={(option: any, value) => {
        return option.value === value.value;
      }}
      value={autocomplete_options.find((option: any) => option.value === default_val?.key) ?? null}
      renderInput={(params) => <TextField {...params} label={`${label} by`} />}
    />
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  encodings: EncodingChannel[];
};

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
          datacy="shape-encoding-select"
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
          datacy="brightness-encoding-select"
          label="opacity"
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
          datacy="size-encoding-select"
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
          datacy="color-encoding-select"
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

      {/* TODO: This feature is broken {channelColor != null ? (
        <Grid item style={{ padding: '16px 0px' }}>
          {channelColor.type === 'categorical' ? <AdvancedColoringPopover pointColorMapping={pointColorMapping} /> : null}
        </Grid>
      ) : null} */}
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
                <Box p={1} />
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

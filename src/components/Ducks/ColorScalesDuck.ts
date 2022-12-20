import { ANormalized, NormalizedDictionary } from '../Utility/NormalizedState';
import { BaseColorScale } from '../../model/Palette';

/**
 * Type for embedding state slice
 */
export type ColorScalesType = {
  scales: NormalizedDictionary<BaseColorScale>;
};

/**
 * Initial state
 */
const initialState: ColorScalesType = (function () {
  const state = {
    scales: ANormalized.create<BaseColorScale>(),
  };

  ANormalized.add(state.scales, {
    palette: 'dark2',
    type: 'categorical',
    dataClasses: 8,
  });

  ANormalized.add(state.scales, {
    palette: 'accent',
    type: 'categorical',
  });

  ANormalized.add(state.scales, {
    palette: 'paired',
    type: 'categorical',
  });

  ANormalized.add(state.scales, {
    palette: 'YlOrRd',
    type: 'sequential',
  });

  ANormalized.add(state.scales, {
    palette: 'Greys',
    type: 'sequential',
  });

  ANormalized.add(state.scales, {
    palette: 'Viridis',
    type: 'sequential',
  });

  ANormalized.add(state.scales, {
    palette: 'BrBG',
    type: 'diverging',
  });

  ANormalized.add(state.scales, {
    palette: 'PRGn',
    type: 'diverging',
  });

  ANormalized.add(state.scales, {
    palette: 'SHAP',
    type: 'diverging',
  });

  return state;
})();

export default function colorScales(state = initialState, action?: any): ColorScalesType {
  switch (action?.type) {
    default:
      return state;
  }
}

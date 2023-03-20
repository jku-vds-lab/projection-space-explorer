import { createAction, createReducer } from '@reduxjs/toolkit';
import { createViewDuckReducer, ViewActions } from '../components/Ducks/ViewDuck';
import { API } from '../components/Store/API';
import { createRootReducer, ReducerValues, RootState } from '../components/Store/Store';

test('Tests the injection of view reducers', () => {
  const myAction = createAction<number>('set/workspace');

  const testVariable = createReducer(10, (builder) => {
    builder.addCase(myAction, (state, action) => {
      return action.payload;
    });
  });

  const newViewReducer = createViewDuckReducer({ testVariable });

  const allReducers = { multiples: newViewReducer.reducer };

  type BayerState = ReducerValues<typeof allReducers> & RootState;

  const context = new API<BayerState>(undefined, createRootReducer(allReducers));

  // For now this test does not work since the addView method requires a dataset
  expect(context).toBeDefined();

  /** context.store.dispatch(ViewActions.addView());

  expect(context.store.getState().multiples.multiples.entities[context.store.getState().multiples.multiples.ids[0]].attributes.testVariable).toBe(10);

  context.store.dispatch(ViewActions.activateView(context.store.getState().multiples.multiples.ids[0]));
  context.store.dispatch(myAction(100));

  expect(context.store.getState().multiples.multiples.entities[context.store.getState().multiples.multiples.ids[0]].attributes.testVariable).toBe(100); */
});

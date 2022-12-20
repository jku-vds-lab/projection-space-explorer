import { Reducer, Store, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { v4 as uuidv4 } from 'uuid';
import { RootState, createRootReducer } from './Store';
import { getStoreDiff } from './PluginScript';
import { RootActions } from './RootActions';
import { UtilityActions } from './Utility';

/**
 * Main api class for PSE.
 */
export class API<T extends RootState> {
  store: Store<T>;

  onStateChanged: (newState: T, difference: Partial<T>, action: any) => void;

  id: string;

  /**
   * Creates a PSE API (store).
   *
   * @param dump the dump which contains parts of store state
   * @param reducer the root reducer of the store, MUST be created with PSE´s inbuilt createRootReducer method.
   */
  constructor(dump: any, reducer: Reducer, middleware?: any[]) {
    this.id = uuidv4();

    if (dump) {
      this.store = configureStore({
        reducer: reducer || createRootReducer(),
        preloadedState: dump,
        middleware: middleware ? [this.differenceMiddleware, thunk, ...middleware] : [this.differenceMiddleware, thunk],
      });
    } else {
      this.store = configureStore({
        reducer: reducer || createRootReducer(),
        middleware: middleware ? [this.differenceMiddleware, thunk, ...middleware] : [this.differenceMiddleware, thunk],
      });
    }
  }

  /**
   * Performs a partial store change.
   * This operation can have side effects depending on which parts you change that can break the app
   * (for example changing the dataset when there are still clusters)
   */
  partialHydrate(dump: any) {
    this.store.dispatch(RootActions.hydrate(dump));
  }

  reset() {
    this.store.dispatch(RootActions.reset());
  }

  serialize() {
    return JSON.stringify(this.store.getState());
  }

  /**
   * Creates a partial dump which excludes a list of columns.
   */
  partialDump(excluded: string[]): any {
    return UtilityActions.partialDump(this.store.getState(), excluded);
  }

  differenceMiddleware = (store) => (next) => (action) => {
    const oldState = store.getState();

    const newState = next(action);

    const diff = getStoreDiff(oldState, store.getState());

    if (this.onStateChanged) {
      this.onStateChanged(newState, diff, action);
    }

    return newState;
  };

  generateImage(
    width: number,
    height: number,
    padding: number,
    options: any,
    ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  ): Promise<string> {
    return UtilityActions.generateImage(this.store.getState(), width, height, padding, options, ctx);
  }
}

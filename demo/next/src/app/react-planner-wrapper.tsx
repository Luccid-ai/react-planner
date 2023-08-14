import React, { useState, useEffect, useRef } from 'react';

import { Map } from 'immutable';
import { AnyAction, Store, createStore } from 'redux';
import { Provider } from 'react-redux';

import "../../../src/styles/react-planner.css";

//download this demo catalog https://github.com/cvdlab/react-planner/tree/master/demo/src/catalog
import catalog from '../../../src/catalog/mycatalog-next';

import ToolbarScreenshotButton from '../../../src/ui/toolbar-screenshot-button';

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlanner,
  Plugins as PlannerPlugins,
} from '../../../../src/';

//define state
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

const AppState = Map({
  'react-planner': new PlannerModels.State()
});

const _reducer = (state: Map<string, any> = AppState, action: any) => {
  state = state || AppState;
  state = state.update('react-planner', plannerState => PlannerReducer(plannerState, action));
  return state;
};


export default function ReactPlannerWrapper() {
  const [store, setStore] = useState<Store<any, AnyAction> | undefined>();
  const [plugins, setPlugins] = useState<any[]>([]);
  const [toolbarButtons, setToolbarButtons] = useState<(typeof ToolbarScreenshotButton)[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const width = parentRef.current?.offsetWidth || 0;
    const height = parentRef.current?.offsetHeight || 0;
    setWidth(width);
    setHeight(height);

    if (typeof window !== 'undefined') {
      const _store = createStore(_reducer, undefined, window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);
      setStore(_store);
    } else {
      const _store = createStore(_reducer);
      setStore(_store);
    }

    setPlugins([
      PlannerPlugins.Keyboard(),
      PlannerPlugins.Autosave('react-planner_v0'),
      PlannerPlugins.ConsoleDebugger(),
    ]);

    setToolbarButtons([
      ToolbarScreenshotButton,
    ]);
  }, []);

  // Pass all props to ReactPlanner
  return (
    <div style={{ width: '100%', height: '100%' }} ref={parentRef}>
      {
        width && height && store && plugins && toolbarButtons &&
        <Provider store={store}>
          <ReactPlanner
            store={store}
            catalog={catalog}
            width={width}
            height={height}
            plugins={plugins}
            stateExtractor={(state: any) => state.get('react-planner')}
            toolbarButtons={toolbarButtons}
          />
        </Provider>
      }
    </div>
  );
}
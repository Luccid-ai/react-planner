import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Translator from './translator/translator';
import Catalog from './catalog/catalog';
import actions from './actions/export';
import { objectsMap } from './utils/objects-utils';
import {
  ToolbarComponents,
  Content,
  SidebarComponents,
  FooterBarComponents,
  CustomContextMenuComponents
} from './components/export';
import { VERSION } from './version';
import ReactPlannerContext from './utils/react-planner-context';
import Overlays from './components/overlays';
import {
  MODE_DRAGGING_HOLE,
  MODE_DRAGGING_ITEM,
  MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX,
  MODE_IDLE
} from './utils/constants';
import { menuWidth } from './components/custom-context-menu/custom-context-menu';

const { Toolbar } = ToolbarComponents;
const { Sidebar } = SidebarComponents;
const { FooterBar } = FooterBarComponents;
const { CustomContextMenu } = CustomContextMenuComponents;

const footerBarH = 20;

const wrapperStyle = {
  display: 'flex',
  flexFlow: 'row nowrap',
  height: '100%'
};

function ReactPlannerContent(props) {
  const { width, height, state, stateExtractor, ...otherProps } = props;

  const contentH = height - footerBarH;

  const extractedState = stateExtractor(state);
  const contextValue = useContext(ReactPlannerContext); // Step 3: Access the context value using useContext

  useEffect(() => {
    let { store } = contextValue;
    let { projectActions, catalog, stateExtractor, plugins } = props;
    plugins.forEach(plugin => plugin(store, stateExtractor));
    projectActions.initCatalog(catalog);
  }, []);

  useEffect(() => {
    const { stateExtractor, state, projectActions, catalog } = props;
    const plannerState = stateExtractor(state);
    const catalogReady = plannerState.getIn(['catalog', 'ready']);
    if (!catalogReady) {
      projectActions.initCatalog(catalog);
    }
  }, [props]);


  // custom context menu on right click in 2D mode
  const [clicked, setClicked] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const getMenuCoords = (e) => {
    const offsetClickMenu = 10;
    const x = e.clientX;
    const y = e.clientY;
    const menuElement = document.getElementById('custom-context-menu');
    const menuHeight = parseInt(menuElement.style['height'].replace('px', ''));
    const buffer = 10;
    const toolbarH = 70;
    const sidebarW = 300;
    const windowWidth = window.innerWidth - buffer - sidebarW;
    const windowHeight = window.innerHeight - buffer - footerBarH - toolbarH;

    // calculate coords so menu stays inside window and doesn't bump into any of the bars
    const menuX = (x + menuWidth + offsetClickMenu) > windowWidth
      ? windowWidth - menuWidth - offsetClickMenu
      : x + offsetClickMenu
    ;

    const menuY = (y + menuHeight + offsetClickMenu) > windowHeight
      ? windowHeight - menuHeight - offsetClickMenu
      : y + offsetClickMenu
    ;

    return ({x: menuX, y: menuY});
  }

  let mode = extractedState.get('mode');
  let customContextMenuAllowed = (mode === MODE_IDLE || mode === MODE_DRAGGING_LINE ||
    mode === MODE_DRAGGING_VERTEX || mode === MODE_DRAGGING_ITEM || mode === MODE_DRAGGING_HOLE);
  const [numberOfElementsSelected, setNumberOfElementsSelected] = useState(0);
  const [numberOfElementsInClipboard, setNumberOfElementsInClipboard] = useState(0);

  const getNumberOfElementsSelected = () => {
    let selectedLayer = extractedState.getIn(['scene', 'selectedLayer']);
    let selected = extractedState.getIn(['scene', 'layers', selectedLayer, 'selected']);

    return selected.holes.size + selected.items.size + selected.lines.size;
  }

  const getNumberOfElementsInClipboard = () => {
    let inClipboard = extractedState.getIn(['clipboardElements']);

    return inClipboard.holes.size + inClipboard.items.size + inClipboard.lines.size;
  }

  const handleRightClick = (e) => {
    e.preventDefault();
    setClicked(true);
    setCoords(getMenuCoords(e));
    setNumberOfElementsSelected(getNumberOfElementsSelected);
    setNumberOfElementsInClipboard(getNumberOfElementsInClipboard);
  }

  useEffect(() => {
    const handleClick = () => {
      setClicked(false);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    }
  }, []);


  return (
    <div style={{ ...wrapperStyle }}
      onContextMenu={event => customContextMenuAllowed && handleRightClick(event)}
    >
      <Overlays width={width} height={contentH} state={extractedState} {...otherProps} />
      <Toolbar state={extractedState} {...otherProps} />
      <Content width={width} height={contentH} state={extractedState} {...otherProps} onWheel={event => event.preventDefault()} />
      <Sidebar state={extractedState} {...otherProps} />
      <FooterBar width={width} height={footerBarH} state={extractedState} {...otherProps} />
      <CustomContextMenu clicked={clicked} setClicked={setClicked} coords={coords}
                         state={extractedState} {...otherProps}
                         numberOfElementsSelected={numberOfElementsSelected}
                         numberOfElementsInClipboard={numberOfElementsInClipboard}
      />
    </div>
  );
}

ReactPlannerContent.propTypes = {
  translator: PropTypes.instanceOf(Translator),
  catalog: PropTypes.instanceOf(Catalog),
  allowProjectFileSupport: PropTypes.bool,
  plugins: PropTypes.arrayOf(PropTypes.func),
  autosaveKey: PropTypes.string,
  autosaveDelay: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stateExtractor: PropTypes.func.isRequired,
  toolbarButtons: PropTypes.array,
  sidebarComponents: PropTypes.array,
  footerbarComponents: PropTypes.array,
  customContents: PropTypes.object,
  customOverlays: PropTypes.arrayOf(PropTypes.object),
  customActions: PropTypes.object,
  softwareSignature: PropTypes.string,
  customContextMenuItems: PropTypes.array,
  clicked: PropTypes.bool.isRequired,
  setClicked: PropTypes.func.isRequired,
  coords: PropTypes.object.isRequired,
  numberOfElementsSelected: PropTypes.number.isRequired,
  numberOfElementsInClipboard: PropTypes.number.isRequired,
};

// Step 3: Wrap the component tree with the Provider component
function ReactPlanner(props) {
  const { state, translator, catalog, projectActions, sceneActions, linesActions, holesActions, verticesActions, itemsActions, areaActions, viewer2DActions, viewer3DActions, groupsActions, ...customActions } = props;

  return (
    <ReactPlannerContext.Provider value={{
      state, translator, catalog, 
      projectActions, sceneActions, linesActions, 
      holesActions, verticesActions, itemsActions, 
      areaActions, viewer2DActions, viewer3DActions, 
      groupsActions, ...customActions, store: props.store
    }}>
      <ReactPlannerContent {...props} />
    </ReactPlannerContext.Provider>
  );
}

// Step 4: Define defaultProps directly on the component function
ReactPlanner.defaultProps = {
  translator: new Translator(),
  catalog: new Catalog(),
  plugins: [],
  allowProjectFileSupport: true,
  toolbarButtons: [],
  sidebarComponents: [],
  footerbarComponents: [],
  customContents: {},
  customOverlays: [],
  customActions: {},
  softwareSignature: `React-Planner ${VERSION}`,
  customContextMenuItems: [],
};

//redux connect
function mapStateToProps(reduxState) {
  return {
    state: reduxState
  };
}

function mapDispatchToProps(dispatch) {
  return objectsMap(actions, actionNamespace => bindActionCreators(actions[actionNamespace], dispatch));
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactPlanner);

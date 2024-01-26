import React, {memo, useContext} from 'react';
import PropTypes from 'prop-types';
import ReactPlannerContext from "../../utils/react-planner-context";
import CustomContextMenuItem from "./custom-context-menu-item";
import If from "../../utils/react-if";
import * as SharedStyle from "../../styles/shared-style";
import {liHeight} from "./custom-context-menu-item";

export const menuWidth = 150;

const CUSTOM_CONTEXT_MENU_SHOW = {
  padding: 0,
  backgroundColor: SharedStyle.COLORS.black,
  color: SharedStyle.COLORS.white,
  fontSize: '12px',
  width: menuWidth + 'px',
};

const CUSTOM_CONTEXT_MENU_HIDE = {
  display: 'none',
};

const CUSTOM_CONTEXT_MENU_LIST = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
};


const sortMenuItemsCb = (a, b) => {
  if (a.index === undefined || a.index === null) {
    a.index = Number.MAX_SAFE_INTEGER;
  }

  if (b.index === undefined || b.index === null) {
    b.index = Number.MAX_SAFE_INTEGER;
  }

  return a.index - b.index;
};

const mapMenuItemsCb = (el, ind) => {
  return (
    <If
      key={ind}
      condition={el.condition}
      style={{ position: 'relative' }}
    >
      {el.dom}
    </If>
  );
};

const CustomContextMenu = (props) => {
  const { state, customContextMenuItems, clicked, setClicked, coords, numberOfElementsSelected, numberOfElementsInClipboard } = props;
  const { projectActions, translator } = useContext(ReactPlannerContext);

  const deleteLabel = numberOfElementsSelected > 1
    ? translator.t("Delete elements")
    : translator.t("Delete element")
  ;

  const copyLabel = numberOfElementsSelected > 1
    ? translator.t("Copy elements")
    : translator.t("Copy element")
  ;

  const pasteLabel = numberOfElementsInClipboard > 1
    ? translator.t("Paste elements")
    : translator.t("Paste element")
  ;

  const copyDisabled = !numberOfElementsSelected;
  const deleteDisabled = !numberOfElementsSelected;
  const pasteDisabled = !numberOfElementsInClipboard;

  const handleCopyClick = () => {
    if (!copyDisabled) {
      projectActions.copyElements();
      setClicked(false);
    }
  }

  const handlePasteClick = () => {
    if (!pasteDisabled) {
      projectActions.pasteElements();
      setClicked(false);
    }
  }

  const handleDeleteClick = () => {
    if (!deleteDisabled) {
      projectActions.remove();
      setClicked(false);
    }
  }

  let sorter = [
    {
      index: 0,
      condition: true,
      dom:
        <CustomContextMenuItem
          disabled={copyDisabled}
          onClick={event => handleCopyClick()}
        >
          {copyLabel}
        </CustomContextMenuItem>
    },
    {
      index: 1,
      condition: true,
      dom:
        <CustomContextMenuItem
          disabled={pasteDisabled}
          onClick={event => handlePasteClick()}
        >
          {pasteLabel}
        </CustomContextMenuItem>
    },
    {
      index: 2,
      condition: true,
      dom:
        <CustomContextMenuItem
          disabled={deleteDisabled}
          onClick={event => handleDeleteClick()}
        >
          {deleteLabel}
        </CustomContextMenuItem>
    },
    // Add your menu items here
    // {
    //   index: 3,
    //   condition: true,
    //   dom:
    //     <CustomContextMenuItem
    //       disabled={false}
    //       onClick={event => console.log("Click on 'Your menu item'")}
    //     >
    //       Your menu item
    //     </CustomContextMenuItem>
    // }
  ];

  sorter = sorter.concat(customContextMenuItems.map((Component, key) => {
    return Component.prototype ? //if is a react component
      {
        condition: true,
        dom: React.createElement(Component, { mode, state, key })
      } :
      {                           //else is a sortable custom context menu item
        index: Component.index,
        condition: Component.condition,
        dom: React.createElement(Component.dom, { mode, state, key })
      };
  }));


  const CUSTOM_CONTEXT_MENU = clicked ? CUSTOM_CONTEXT_MENU_SHOW : CUSTOM_CONTEXT_MENU_HIDE;
  const menuHeight = liHeight * sorter.length;

  return (
    <div
      id="custom-context-menu"
      style={{ ...CUSTOM_CONTEXT_MENU, height: menuHeight, position: 'absolute', left: coords.x, top: coords.y }}
    >
      <ul style ={CUSTOM_CONTEXT_MENU_LIST}>
        {sorter.sort(sortMenuItemsCb).map(mapMenuItemsCb)}
      </ul>
    </div>
  );
}

CustomContextMenu.propTypes = {
  state: PropTypes.object.isRequired,
  customContextMenuItems: PropTypes.array,
  clicked: PropTypes.bool.isRequired,
  setClicked: PropTypes.func.isRequired,
  coords: PropTypes.object.isRequired,
  numberOfElementsSelected: PropTypes.number.isRequired,
  numberOfElementsInClipboard: PropTypes.number.isRequired
};


export default memo(CustomContextMenu, (prevProps, nextProps) => {
  return prevProps.state.hashCode() === nextProps.state.hashCode()
});

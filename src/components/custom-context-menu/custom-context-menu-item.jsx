import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from "../../styles/shared-style";

export const liHeight = 30;

const CUSTOM_CONTEXT_MENU_LIST_ITEM_ENABLED = {
  padding: '8px 10px',
  height: liHeight + 'px',
  cursor: 'pointer',
  transition: 'all 300ms ease-in-out',
};

const CUSTOM_CONTEXT_MENU_LIST_ITEM_DISABLED = {
  backgroundColor: SharedStyle.MATERIAL_COLORS[500].grey,
  padding: '8px 10px',
  height: liHeight + 'px',
  cursor: 'default',
  transition: 'all 300ms ease-in-out',
};

const CUSTOM_CONTEXT_MENU_LIST_ITEM_ENABLED_HOVER = {
  padding: '8px 10px',
  height: liHeight + 'px',
  cursor: 'pointer',
  transition: 'all 300ms ease-in-out',
  backgroundColor: SharedStyle.MATERIAL_COLORS[500].indigo,
};


export default function CustomContextMenuItem(props) {
  const [state, setState] = useState({active: false});

  const CUSTOM_CONTEXT_MENU_LIST_ITEM = props.disabled
    ? CUSTOM_CONTEXT_MENU_LIST_ITEM_DISABLED
    : (state.active
        ? CUSTOM_CONTEXT_MENU_LIST_ITEM_ENABLED_HOVER
        : CUSTOM_CONTEXT_MENU_LIST_ITEM_ENABLED
    )
  ;

  return (
      <li
        onClick={props.onClick}
        onMouseOver={event => setState({active: true})}
        onMouseOut={event => setState({active: false})}
        style={CUSTOM_CONTEXT_MENU_LIST_ITEM}
      >
        {props.children}
      </li>
  );
}

CustomContextMenuItem.propTypes = {
  disabled: PropTypes.bool.isRequired
};

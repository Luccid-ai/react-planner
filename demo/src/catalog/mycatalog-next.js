import {Catalog} from 'react-planner';

let catalog = new Catalog();

// Use Webpack's require.context to dynamically import all planner-element.jsx files
const areasContext = require.context('./areas', true, /planner-element\.jsx$/);
const Areas = areasContext.keys().map(areasContext);

const linesContext = require.context('./lines', true, /planner-element\.jsx$/);
const Lines = linesContext.keys().map(linesContext);

const holesContext = require.context('./holes', true, /planner-element\.jsx$/);
const Holes = holesContext.keys().map(holesContext);

const itemsContext = require.context('./items', true, /planner-element\.jsx$/);
const Items = itemsContext.keys().map(itemsContext);

for( let x in Areas ) catalog.registerElement( Areas[x] );
for( let x in Lines ) catalog.registerElement( Lines[x] );
for( let x in Holes ) catalog.registerElement( Holes[x] );
for( let x in Items ) catalog.registerElement( Items[x] );

catalog.registerCategory('windows', 'Windows', [Holes.window, Holes.sashWindow, Holes.venetianBlindWindow, Holes.windowCurtain] );
catalog.registerCategory('doors', 'Doors', [Holes.door, Holes.doorDouble, Holes.panicDoor, Holes.panicDoorDouble, Holes.slidingDoor] );

export default catalog;

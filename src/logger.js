import l0g from 'l0g/dist/Logger';

//Screw this. Because of static class properties I'm forced to transpile my code. 
//I don't want to change my source code as it reads way cleaner using static properties
//I need to bundle it for the web any way but using react that should happen automatically

const {
    Logger,
    formatters: {Color},
    transports: {ChromeTransport}
} = l0g;

// static colors = {
//     type: {
//       string: 'lime',
//       number: 'yellow',
//       // object: 'white'
//     },
//     key: {
//       scope: 'blue',
//       ts: 'green',
//       level: {
//         info: 'green',
//         warning: 'orange',
//         error: 'red',
//         debug: 'blue',
//       },
//     },
//     highlight: 'lime.black',
//     default: 'white'
//   };

Color.colors.type.string = 'green';
Color.colors.type.object = 'green';
Color.colors.key.level.warning = 'red';
Color.colors.key.level.info = 'blue';
const formatter = new Color((options) => {
    const {ts, level, scope, message} = options;
    return `${ts} ${scope} ${level}: ${message}`
});

// if (LOG_LEVEL === 'debug') {
    // }
    window.Color = Color;
Color.formatMap.get(Color.isArray).unshift((v) => v && `Array[${v.length}]`);
Color.formatMap.get(Color.isObject).unshift((v) => v && `${v.constructor.name}[${Object.keys(v)}]`);

const transports = [
    new ChromeTransport({formatter}),
];

export const orgLogger = new Logger('debug', {transports}).scope('state-less');
export const packageLogger = orgLogger.scope('react-client');
const windowLogger = orgLogger.scope('browser-console');

window.Logger = Logger;
window.logger = windowLogger;

export default packageLogger;
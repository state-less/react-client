import l0g from 'l0g';

declare global {
    interface Window {
        logger: any;
    }
}

const {
    Logger,
    formatters: { Color },
    transports: { ChromeTransport },
} = l0g;

Color.colors.type.string = 'green';
Color.colors.type.object = 'green';
Color.colors.key.level.warning = 'red';
Color.colors.key.level.info = 'blue';
const formatter = new Color((options) => {
    const { ts, level, scope, message } = options;
    return `${ts} ${scope} ${level}: ${message}`;
});

Color.formatMap.get(Color.isArray).unshift((v) => v && `Array[${v.length}]`);
Color.formatMap
    .get(Color.isObject)
    .unshift((v) => v && `${v.constructor.name}[${Object.keys(v)}]`);

const transports = [new ChromeTransport({ formatter })];

export const orgLogger = new Logger('debug', { transports }).scope(
    'state-less'
);
export const packageLogger = orgLogger.scope('react-client');
const windowLogger = orgLogger.scope('browser-console');

if (typeof window !== 'undefined') {
    window.logger = windowLogger;
}

export default packageLogger;

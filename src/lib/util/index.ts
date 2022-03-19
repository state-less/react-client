/* eslint-disable no-void */

import ReconnectingWebSocket from "reconnecting-websocket";

/**
 * Truncates the middle of a string.
 * @param str - The string to truncate
 * @param n - The number of characters to preserver
 * @returns
 */
export const truncateMid = (str: string, n = 3) => {
    return `${str.slice(0, n)}...${str.slice(-n)}`;
};

export const noopSync = () => {
    // Make sure undefined is not overridden
    return void 0;
};

type Hosts = Record<string, string>;
type Sockets = Record<string, ReconnectingWebSocket>;

export const isSingleHost = (hosts: Sockets) => Object.keys(hosts).length === 1;
export const getSingleHost = (hosts: Sockets | Hosts) => Object.keys(hosts)[0];
export const assertGetSingleHost = (sockets: Sockets, host: string) => {
    if (host === null) {
        if (isSingleHost(sockets)) {
            host = getSingleHost(sockets);
        } else {
            throw new Error(
                `Missing required prop 'host' when using multiple hosts.`
            );
        }
    }
    return host;
};

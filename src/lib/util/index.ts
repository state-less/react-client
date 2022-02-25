/**
 * Truncates the middle of a string.
 * @param str - The string to truncate
 * @param n - The number of characters to preserver
 * @returns
 */
export const truncateMid = (str: string, n = 3) => {
    return `${str.slice(0, n)}...${str.slice(-n)}`;
};

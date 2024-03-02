import { createContext } from 'react';
import React from 'react';

export const ssrContext = createContext<{
  req: Request;
}>({
  req: null,
});

export const SSRProvider = ({ req, children }) => {
  return <ssrContext.Provider value={{ req }}>{children}</ssrContext.Provider>;
};

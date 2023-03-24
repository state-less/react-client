import { getApolloContext, gql } from '@apollo/client';
import { createContext, useContext } from 'react';
import { useLocalStorage } from '..';
import React from 'react';

export const authContext = createContext({
  id: null,
  signed: null,
  authenticate: null,
});

export const AUTHENTICATE = gql`
  mutation MyMutation($strategy: String!, $data: JSON!) {
    authenticate(strategy: $strategy, data: $data) {
      id
      signed
      tokens
    }
  }
`;

export const AuthProvider = ({ children, client }) => {
  const context = getApolloContext();
  const { client: apolloClient } = useContext(context);

  const actualClient = client || apolloClient;

  const [auth, setAuth] = useLocalStorage('session', {
    id: null,
    signed: null,
    tokens: null,
  });

  const authenticate = async ({ strategy, data }) => {
    const {
      data: { authenticate },
    } = await actualClient.mutate({
      mutation: AUTHENTICATE,
      variables: {
        strategy,
        data,
      },
    });

    setAuth(authenticate);
  };

  return (
    <authContext.Provider value={{ authenticate, ...auth }}>
      {children}
    </authContext.Provider>
  );
};

import { ApolloClient, getApolloContext, gql } from '@apollo/client';
import { createContext, PropsWithChildren, ReactNode, useContext } from 'react';
import { useLocalStorage } from '..';
import React from 'react';
import { initialSession } from '../lib/instances';

export const authContext = createContext({
  session: initialSession,
  authenticate: null,
  logout: null,
});

export const AUTHENTICATE = gql`
  mutation MyMutation($strategy: String!, $data: JSON!) {
    authenticate(strategy: $strategy, data: $data) {
      id
      strategy
      strategies
      token
    }
  }
`;

export const AuthProvider = ({
  children,
  client,
}: PropsWithChildren<{ client?: ApolloClient<any> }>) => {
  const context = getApolloContext();
  const { client: apolloClient } = useContext(context);

  const actualClient = client || apolloClient;

  const [auth, setAuth] = useLocalStorage('session', initialSession);

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

  const logout = () => {
    setAuth(initialSession);
  };

  return (
    <authContext.Provider value={{ authenticate, session: auth, logout }}>
      {children}
    </authContext.Provider>
  );
};

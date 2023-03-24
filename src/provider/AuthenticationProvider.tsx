import { gql } from '@apollo/client';
import { createContext } from 'react';
import { useLocalStorage } from '..';

export const authContext = createContext({
  id: null,
  signed: null,
});

export const AUTHENTICATE = gql`
  mutation MyMutation($strategy: String!, $data: JSON!) {
    setState(strategy: $strategy, data: $data) {
      id
      signed
    }
  }
`;

export const AuthProvider = ({ client }) => {
  const [auth, setAuth] = useLocalStorage('session', {
    id: null,
    signed: null,
  });
  const authenticate = async ({ strategy, data }) => {
    const {
      data: { authenticate },
    } = await client.mutate({
      mutation: AUTHENTICATE,
      variables: {
        strategy,
        data,
      },
    });

    setAuth(authenticate);
  };

  return (
    <authContext.Provider
      value={{ ...auth, authenticate }}
    ></authContext.Provider>
  );
};
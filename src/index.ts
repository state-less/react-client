import { gql, getApolloContext, ApolloError } from '@apollo/client';
import { ApolloClient } from '@apollo/client/core';
import { useQuery, useSubscription } from '@apollo/client/react';
import React, { useEffect, useMemo, useState } from 'react';

export const UPDATE_STATE = gql`
  subscription MyQuery($key: ID!, $scope: String!) {
    updateState(key: $key, scope: $scope) {
      id
      value
    }
  }
`;

export const GET_STATE = gql`
  query MyQuery($key: ID!, $scope: String!) {
    getState(key: $key, scope: $scope) {
      id
      value
    }
  }
`;

export const SET_STATE = gql`
  mutation MyMutation($key: ID!, $scope: String!, $value: JSON) {
    setState(key: $key, scope: $scope, value: $value) {
      key
      id
      value
      scope
    }
  }
`;
type UseServerStateOptions = {
  /** The *unique* serverside key of the state. */
  key: string;
  /** The scope of the state. A state with the same key can exist in different scopes */
  scope: string;
  initialValue?: any;
  client?: ApolloClient<any>;
};

export const useServerState = <ValueType>(
  initialValue: ValueType,
  options: UseServerStateOptions
): [ValueType, (value: ValueType) => void, ApolloError] => {
  const { key, scope, client, initialValue: initialServerValue } = options;
  const { client: providedClient = null } = React.useContext(
    getApolloContext()
  );

  const actualClient = providedClient || client;

  if (!actualClient) {
    throw new Error(
      'No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.'
    );
  }
  const [optimisticValue, setOptimisticValue] = useState<ValueType | null>(
    null
  );
  const { data: queryData, error } = useQuery<{
    getState: { value: { props: any; children: any[] } };
  }>(GET_STATE, {
    client: actualClient,
    variables: {
      key,
      scope,
    },
  });
  const { data: subscriptionData } = useSubscription(UPDATE_STATE, {
    client: actualClient,
    variables: {
      key,
      scope,
    },
  });

  useEffect(() => {
    setOptimisticValue(null);
    actualClient.cache.modify({
      fields: {
        getState() {
          return { ...queryData.getState, ...subscriptionData?.updateState };
        },
      },
    });
  }, [subscriptionData?.updateState?.value]);

  const setValue = useMemo(() => {
    return (value: ValueType) => {
      setOptimisticValue(value);
      (async () => {
        await actualClient.mutate({
          mutation: SET_STATE,
          variables: {
            key,
            scope,
            value,
          },
        });
        setOptimisticValue(null);
      })();
    };
  }, [key, scope, actualClient]);

  if (optimisticValue !== null) {
    return [optimisticValue, setValue, error];
  }

  return [
    (queryData?.getState?.value as ValueType) || initialValue,
    setValue,
    error,
  ];
};

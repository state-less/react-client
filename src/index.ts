import { gql } from '@apollo/client';
import { ApolloClient } from '@apollo/client/core';
import { useQuery, useSubscription } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';

const UPDATE_STATE = gql`
  subscription MyQuery($key: ID!, $scope: String!) {
    updateState(key: $key, scope: $scope) {
      id
      value
    }
  }
`;

const STATE = gql`
  query MyQuery($key: ID!, $scope: String!) {
    getState(key: $key, scope: $scope) {
      id
      value
    }
  }
`;

const SET_STATE = gql`
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
): [ValueType, (value: ValueType) => void] => {
  const { key, scope, client, initialValue: initialServerValue } = options;
  const [optimisticValue, setOptimisticValue] = useState<ValueType | null>(
    null
  );
  const { data: queryData } = useQuery<{
    getState: { value: { props: any; children: any[] } };
  }>(STATE, {
    client,
    variables: {
      key,
      scope,
    },
  });
  const { data: subscriptionData } = useSubscription(UPDATE_STATE, {
    client: client,
    variables: {
      key,
      scope,
    },
  });

  useEffect(() => {
    if (!client) {
      console.warn(
        'No client provided to useServerState. Check your provider.'
      );
      return;
    }
    setOptimisticValue(null);
    client.cache.modify({
      fields: {
        getState() {
          return { ...queryData.getState, ...subscriptionData?.updateState };
        },
      },
    });
  }, [subscriptionData?.updateState?.value]);

  const setValue = useMemo(() => {
    return (value: ValueType) => {
      if (!client) {
        console.warn(
          'No client provided to useServerState. Check your provider.'
        );
        setOptimisticValue(value);
        return;
      }

      setOptimisticValue(value);
      (async () => {
        client.mutate({
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
  }, [key, scope, client]);

  if (optimisticValue !== null) {
    return [optimisticValue, setValue];
  }

  return [(queryData?.getState?.value as ValueType) || initialValue, setValue];
};

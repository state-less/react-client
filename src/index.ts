import { gql } from '@apollo/client';
import { ApolloClient } from '@apollo/client/core';
import { useQuery, useSubscription } from '@apollo/client/react';
import { useEffect } from 'react';

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

type UseServerStateOptions = {
  key: string;
  scope: string;
  client?: ApolloClient<any>;
};

export const useServerState = (
  initialValue: any,
  options: UseServerStateOptions
) => {
  const { key, scope, client } = options;
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
    // Update the cache with the subscription data
    client.cache.modify({
      fields: {
        getState() {
          return { ...queryData.getState, ...subscriptionData?.updateState };
        },
      },
    });
  }, [subscriptionData?.updateState?.value]);

  return [
    queryData?.getState?.value || initialValue,
    () => {
      throw new Error('Not implemented yet!');
    },
  ];
};

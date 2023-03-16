import { gql, getApolloContext, ApolloError } from '@apollo/client';
import { ApolloClient } from '@apollo/client/core';
import { useQuery, useSubscription } from '@apollo/client/react';
import React, { useEffect, useMemo, useState } from 'react';

export const RENDER_COMPONENT = gql`
  query MyQuery($key: ID!, $scope: String!, $props: JSON) {
    renderComponent(key: $key, props: $props) {
      rendered {
        __typename
        __typename
        ... on Server {
          version
          children {
            __typename
            ... on ServerSideProps {
              props
              children
            }
          }
        }
      }
    }
  }
`;

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

type UseComponentOptions = {
  /** The *unique* serverside key of the component. */
  key: string;
  client?: ApolloClient<any>;
  props?: any;
};

type UseServerStateInfo = {
  error: ApolloError;
  loading: boolean;
};

export const useComponent = (
  key: string,
  options: UseComponentOptions
): [any, { error: ApolloError; loading: boolean }] => {
  const { client } = options;
  const { client: providedClient = null } = React.useContext(
    getApolloContext()
  );

  const actualClient = providedClient || client;

  if (!actualClient) {
    throw new Error(
      'No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.'
    );
  }

  const {
    data: queryData,
    error,
    loading,
  } = useQuery<{
    renderComponent: { rendered: any };
  }>(RENDER_COMPONENT, {
    client: actualClient,
    variables: {
      key,
      props: options.props,
    },
  });

  return [queryData?.renderComponent?.rendered || {}, { error, loading }];
};

export const useServerState = <ValueType>(
  initialValue: ValueType,
  options: UseServerStateOptions
): [ValueType, (value: ValueType) => void, UseServerStateInfo] => {
  const { key, scope, client } = options;
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

  const {
    data: queryData,
    error,
    loading,
  } = useQuery<{
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
    return [optimisticValue, setValue, { error, loading }];
  }

  return [
    (queryData?.getState?.value as ValueType) || initialValue,
    setValue,
    { error, loading },
  ];
};

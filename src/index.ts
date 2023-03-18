import { gql, getApolloContext, ApolloError } from '@apollo/client';
import { ApolloClient } from '@apollo/client/core';
import { useQuery, useSubscription } from '@apollo/client/react';
import React, { useEffect, useMemo, useState } from 'react';

export const RENDER_COMPONENT = gql`
  query MyQuery($key: ID!, $props: JSON) {
    renderComponent(key: $key, props: $props) {
      rendered {
        ... on ServerSideProps {
          props
          children
        }
        __typename
        ... on Server {
          version
          uptime
          platform
          components: children {
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

export const CALL_FUNCTION = gql`
  mutation MyMutation($key: ID!, $prop: String!, $args: JSON) {
    callFunction(key: $key, prop: $prop, args: $args)
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
): [any, { error: ApolloError | Error; loading: boolean }] => {
  const { client } = options;
  const { client: providedClient = null } = React.useContext(
    getApolloContext()
  );

  const actualClient = client || providedClient;

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

  const inlined = inlineFunctions(
    queryData?.renderComponent?.rendered || { props: {}, children: [] },
    actualClient
  );
  return [inlined, { error, loading }];
};

const inlineFunctions = (obj: { props: Record<string, any> }, actualClient) => {
  const inlined = JSON.parse(JSON.stringify(obj));
  for (const [key, val] of Object.entries(obj.props)) {
    if (val.__typename === 'FunctionCall') {
      inlined.props[key] = async (...args) => {
        console.log('Hello from the client!');

        await actualClient.mutate({
          mutation: CALL_FUNCTION,
          variables: {
            key: val.component,
            prop: val.name,
            args,
          },
        });
        // setOptimisticValue(null);
      };
    }
  }
  return inlined;
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
    error: apolloError,
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

  console.log('Err', queryData, apolloError);
  const error =
    queryData?.getState && !apolloError
      ? new ApolloError({ errorMessage: 'No data' })
      : apolloError;
  const { data: subscriptionData } = useSubscription(UPDATE_STATE, {
    client: actualClient,
    variables: {
      key,
      scope,
    },
  });

  useEffect(() => {
    actualClient.cache.modify({
      fields: {
        getState() {
          return { ...queryData.getState, ...subscriptionData?.updateState };
        },
      },
    });
    setTimeout(setOptimisticValue, 0, null);
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
        // setOptimisticValue(null);
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

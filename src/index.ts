import { gql, getApolloContext, ApolloError } from '@apollo/client';
import { ApolloClient, FetchResult, Observable } from '@apollo/client/core';
import { useQuery, useSubscription } from '@apollo/client/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { v4 } from 'uuid';

export const RENDER_COMPONENT = gql`
  query MyQuery($key: ID!, $props: JSON) {
    renderComponent(key: $key, props: $props) {
      rendered {
        ... on ServerSideProps {
          key
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

export const UPDATE_COMPONENT = gql`
  subscription MyQuery($key: ID!, $scope: String!) {
    updateComponent(key: $key, scope: $scope) {
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
  client?: ApolloClient<any>;
  props?: any;
};

type UseServerStateInfo = {
  error: ApolloError;
  loading: boolean;
};

export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

export const useComponent = (
  key: string,
  options?: UseComponentOptions
): [any, { error: ApolloError | Error; loading: boolean }] => {
  const { client } = options || {};
  const { client: providedClient = null } = React.useContext(
    getApolloContext()
  );
  const [lastMutationResult, setLastMutationResult] =
    useState<FetchResult>(null);
  const actualClient = client || providedClient;

  if (!actualClient) {
    throw new Error(
      'No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.'
    );
  }
  const [id] = useLocalStorage('id', v4());

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
    fetchPolicy: 'cache-first',
    context: {
      headers: {
        'X-Unique-Id': id,
      },
    },
  });

  /**
   * This needs to be done manually because we don't have the key of the component before the query above finished.
   * useSubscription doesn't work because it doesn't resubscribe if the key changes.
   */
  useEffect(() => {
    (async () => {
      const sub = await actualClient.subscribe({
        query: UPDATE_COMPONENT,
        variables: {
          key: queryData?.renderComponent?.rendered?.key,
          scope: 'global',
        },
      });
      console.log('SUBSCRIBED', queryData?.renderComponent?.rendered?.key);
      sub.subscribe((subscriptionData) => {
        console.log(
          'Writing to kache',
          key,
          subscriptionData?.data?.updateComponent
        );
        const data = client.cache.readQuery({
          query: RENDER_COMPONENT,
          variables: { key, props: options.props },
        }) as any;

        Object.assign(
          data?.renderComponent?.rendered,
          subscriptionData?.data?.updateComponent?.rendered
        );
        actualClient.cache.writeQuery({
          query: RENDER_COMPONENT,
          variables: {
            key,
            props: options.props,
          },
          data,
        });
        // actualClient.cache.modify({
        //   fields: {
        //     renderComponent() {
        //       return {
        //         ...queryData.renderComponent,
        //         ...subscriptionData?.data?.updateComponent,
        //       };
        //     },
        //   },
        // });
      });
    })();
  }, [queryData?.renderComponent?.rendered?.key]);

  const inlined = inline({
    data: queryData?.renderComponent?.rendered,
    actualClient,
    setLastMutationResult,
  });

  const anyError = error || lastMutationResult?.errors?.[0];

  return [inlined, { error: anyError, loading }];
};

const inline = ({ data, actualClient, setLastMutationResult }) => {
  let inlined: { props: Record<string, any>; children: any[] } = data;
  if (data?.props) {
    inlined = JSON.parse(JSON.stringify(data));

    for (const [key, val] of Object.entries(inlined.props)) {
      if (val?.__typename === 'FunctionCall') {
        inlined.props[key] = async (...args) => {
          try {
            const response = await actualClient.mutate({
              mutation: CALL_FUNCTION,
              variables: {
                key: val.component,
                prop: val.name,
                args,
              },
            });
            setLastMutationResult(response);
          } catch (e) {
            setLastMutationResult({ errors: [e] });
          }
        };
      }
    }

    const children = inlined.children || [];
    for (let i = 0; i < children.length; i++) {
      inlined.children[i] = inline({
        data: children[i],
        actualClient,
        setLastMutationResult,
      });
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
  const ref = useRef(new AbortController());
  if (!actualClient) {
    throw new Error(
      'No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.'
    );
  }
  const [optimisticValue, setOptimisticValue] = useState<ValueType | null>(
    null
  );
  const [id] = useLocalStorage('id', v4());

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
    context: {
      headers: {
        'X-Unique-Id': id,
      },
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
  }, [subscriptionData?.updateState?.value]);

  const setValue = useMemo(() => {
    return (value: ValueType) => {
      setOptimisticValue(value);
      (async () => {
        ref.current.abort();
        ref.current = new AbortController();
        const response = actualClient.mutate({
          mutation: SET_STATE,
          variables: {
            key,
            scope,
            value,
          },
          context: {
            fetchOptions: {
              signal: ref.current.signal,
            },
          },
        });
        await response;
        if (ref.current.signal.aborted) return;
        setTimeout(setOptimisticValue, 0, null);
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

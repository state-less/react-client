import { gql, getApolloContext, ApolloError } from '@apollo/client';
import {
  ApolloClient,
  ApolloQueryResult,
  FetchResult,
  Observable,
  OperationVariables,
} from '@apollo/client/core';
import { useQuery, useSubscription } from '@apollo/client/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { cloneDeep } from '@apollo/client/utilities';
import { useAtom } from 'jotai';
import { atom } from 'jotai';
import {
  Atom,
  PrimitiveAtom,
  SetStateAction,
  WritableAtom,
} from 'jotai/vanilla';
import { initialSession } from './lib/instances';

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
  data?: any;
  props?: any;
};

type UseServerStateInfo = {
  error: ApolloError;
  loading: boolean;
};

const atoms: Record<string, PrimitiveAtom<unknown>> = {};

const getInitialValue = (key, initialValue) => {
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
};
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (val: T) => void] => {
  const keyAtom =
    (atoms[key] as PrimitiveAtom<T>) ||
    (atoms[key] = atom(getInitialValue(key, initialValue)) as PrimitiveAtom<T>);
  const [storedValue, setStoredValue] = useAtom(keyAtom as PrimitiveAtom<T>);

  const setValue = (value: T) => {
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

export const renderComponent = async (
  key: string,
  options: UseComponentOptions
) => {
  const { client } = options || {};

  const { data, error } = await client.query({
    query: RENDER_COMPONENT,
    variables: {
      key,
      props: options.props,
    },
    fetchPolicy: 'network-only',
    context: {
      // headers: {
      //   'X-Unique-Id': id,
      //   Authorization: session.token ? `Bearer ${session.token}` : undefined,
      // },
    },
  });

  return { data: data?.renderComponent?.rendered, error };
};

export const useComponent = (
  key: string,
  options: UseComponentOptions = {}
): [
  any,
  {
    error: ApolloError | Error;
    loading: boolean;
    refetch: (variables?: Partial<OperationVariables>) => Promise<
      ApolloQueryResult<{
        renderComponent: {
          rendered: any;
        };
      }>
    >;
  }
] => {
  const { client } = options || {};
  const { client: providedClient = null } = React.useContext(
    getApolloContext()
  );
  const [lastMutationResult, setLastMutationResult] =
    useState<FetchResult>(null);

  const [skip, setSkip] = useState(!!options?.data?.key);
  const actualClient = client || providedClient;

  if (!actualClient) {
    throw new Error(
      'No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.'
    );
  }
  const [id] = useLocalStorage('id', v4());
  const [session] = useLocalStorage('session', initialSession);

  const {
    data: queryData,
    error,
    loading,
    refetch,
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
        Authorization: session.token ? `Bearer ${session.token}` : undefined,
      },
    },
    skip: skip,
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
        actualClient.cache.writeQuery({
          query: RENDER_COMPONENT,
          variables: {
            key,
            props: options.props,
          },
          data: {
            renderComponent: {
              rendered: {
                ...queryData?.renderComponent?.rendered,
                ...subscriptionData?.data?.updateComponent?.rendered,
              },
            },
          },
        });
        setSkip(false);
      });
    })();
  }, [queryData?.renderComponent?.rendered?.key]);

  /**
   * This needs to be done manually because we don't have the key of the component before the query above finished.
   * useSubscription doesn't work because it doesn't resubscribe if the key changes.
   */
  useEffect(() => {
    (async () => {
      const sub = await actualClient.subscribe({
        query: UPDATE_COMPONENT,
        variables: {
          key: options?.data?.key,
          scope: 'global',
        },
      });
      console.log('SUBSCRIBED Hydrated', options?.data?.key);
      sub.subscribe((subscriptionData) => {
        actualClient.cache.writeQuery({
          query: RENDER_COMPONENT,
          variables: {
            key,
            props: options.props,
          },
          data: {
            renderComponent: {
              rendered: {
                ...queryData?.renderComponent?.rendered,
                ...subscriptionData?.data?.updateComponent?.rendered,
              },
            },
          },
        });
      });
    })();
  }, [options?.data?.key]);

  const inlineData =
    options?.data && !queryData?.renderComponent?.rendered
      ? options?.data
      : queryData?.renderComponent?.rendered;

  const inlined = inline({
    data: inlineData,
    actualClient,
    setLastMutationResult,
  });

  const anyError = error || lastMutationResult?.errors?.[0];

  return [inlined, { error: anyError, loading, refetch }];
};

const inline = ({
  data,
  actualClient,
  setLastMutationResult,
}: {
  data: { props: Record<string, any>; children: any[] };
  actualClient: ApolloClient<any>;
  setLastMutationResult: (val: any) => void;
}) => {
  let inlined: { props: Record<string, any>; children: any[] } = data;
  if (data?.props) {
    inlined = cloneDeep(inlined);
    for (const [key, val] of Object.entries(data.props)) {
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
      let actualValue = value;
      if (typeof value === 'function') {
        actualValue = value(
          (queryData?.getState?.value as ValueType) || initialValue
        );
      }
      setOptimisticValue(actualValue);
      (async () => {
        ref.current.abort();
        ref.current = new AbortController();
        const response = actualClient.mutate({
          mutation: SET_STATE,
          variables: {
            key,
            scope,
            value: actualValue,
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
  }, [key, scope, actualClient, queryData?.getState?.value]);

  if (optimisticValue !== null) {
    return [optimisticValue, setValue, { error, loading }];
  }

  return [
    (queryData?.getState?.value as ValueType) || initialValue,
    setValue,
    { error, loading },
  ];
};

export * from './provider/AuthenticationProvider';

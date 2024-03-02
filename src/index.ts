import { gql, getApolloContext, ApolloError } from '@apollo/client';
import {
  ApolloClient,
  ApolloQueryResult,
  FetchResult,
  OperationVariables,
} from '@apollo/client/core';
import { useQuery, useSubscription } from '@apollo/client/react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { cloneDeep } from '@apollo/client/utilities';
import { useAtom } from 'jotai';
import { atom } from 'jotai';
import { PrimitiveAtom } from 'jotai/vanilla';
import { initialSession } from './lib/instances';
import { Session, Strategies } from './lib/types';
import { wrapPromise } from './lib/util/SSR';
import { ssrContext } from './provider/SSRProvider';
import cookie from 'cookie';

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

export const UNMOUNT_COMPONENT = gql`
  query MyQuery($key: ID!) {
    unmountComponent(key: $key)
  }
`;
export const MOUNT_COMPONENT = gql`
  query MyQuery($key: ID!, $props: JSON) {
    mountComponent(key: $key, props: $props)
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
  subscription MyQuery(
    $key: ID!
    $scope: String!
    $id: String!
    $bearer: String
  ) {
    updateComponent(key: $key, scope: $scope, id: $id, bearer: $bearer) {
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
  skip?: boolean;
  preventUnload?: boolean;
  sendUnmount?: boolean;
  suspend?: boolean;
};

type UseServerStateInfo = {
  error: ApolloError;
  loading: boolean;
};

const atoms: Record<string, PrimitiveAtom<unknown>> = {};

const getInitialValue = (key, initialValue, { cookie }) => {
  try {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    const item = window.localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialValue));
      if (cookie) {
        document.cookie = `${cookie}=${initialValue}`;
      }
      return initialValue;
    }
    if (cookie) {
      document.cookie = `${cookie}=${item}`;
    }
    return JSON.parse(item);
  } catch (error) {
    console.log(error);
    return initialValue;
  }
};

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  { cookie = null } = {}
): [T, (val: T) => void] => {
  const keyAtom =
    (atoms[key] as PrimitiveAtom<T>) ||
    (atoms[key] = atom(
      getInitialValue(key, initialValue, { cookie })
    ) as PrimitiveAtom<T>);
  const [storedValue, setStoredValue] = useAtom(keyAtom as PrimitiveAtom<T>);

  const setValue = (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      if (cookie) {
        console.log('SETTING COOKIE', cookie, JSON.stringify(valueToStore));
        document.cookie = `${cookie}=${JSON.stringify(valueToStore)}`;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

export const renderCache: Record<
  string,
  () => Promise<ApolloQueryResult<any>>
> = {};

export const renderComponent = (key: string, options: UseComponentOptions) => {
  const { client } = options || {};

  let prom;

  if (renderCache[key]) {
    prom = renderCache[key];
  } else {
    const res = client.query({
      query: RENDER_COMPONENT,
      variables: {
        key,
        props: options.props,
      },
      fetchPolicy: 'cache-first',
      context: {
        // headers: {
        //   'X-Unique-Id': id,
        //   Authorization: session.token ? `Bearer ${session.token}` : undefined,
        // },
      },
    });
    prom = wrapPromise(res);
    renderCache[key] = prom;
  }

  console.log('RENDERING SSR', key, prom);

  return renderCache[key];
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

  const [skip, setSkip] = useState(
    options?.skip || !!options?.data?.key || options?.suspend
  );
  const [subscribed, setSubcribed] = useState<any | null>(null);
  const actualClient = client || providedClient;

  if (!actualClient) {
    throw new Error(
      'No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.'
    );
  }

  let _initialSession: Session = initialSession;
  let serverId = v4();
  const { req } = useContext(ssrContext);

  if ((req?.headers as any)?.cookie) {
    const parsed = cookie.parse((req?.headers as any)?.cookie);
    serverId = parsed['x-react-server-id'];
    _initialSession = {
      id: serverId,
      token: parsed.token,
      strategy: null,
      strategies: null,
    };
  }

  const [id] = useLocalStorage('id', serverId, { cookie: 'x-react-server-id' });

  const [session] = useLocalStorage('session', _initialSession);

  console.log('SERVER SESSION ID', id, session);
  let ssrResponse;

  if (options.suspend) {
    ssrResponse = renderComponent(key, {
      ...options,
      client: actualClient,
    })();
    console.log('RENDERING SSR NOT THROWING');
  } else {
    ssrResponse = null;
  }

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
    if (
      !queryData?.renderComponent?.rendered?.key ||
      subscribed?._state === 'ready'
    )
      return;
    let can;
    (async () => {
      const sub = await actualClient.subscribe({
        query: UPDATE_COMPONENT,
        variables: {
          key: queryData?.renderComponent?.rendered?.key,
          scope: 'global',
          bearer: session.token ? `Bearer ${session.token}` : undefined,
          id,
        },
        context: {
          headers: {
            'X-Unique-Id': id,
            Authorization: session.token
              ? `Bearer ${session.token}`
              : undefined,
          },
        },
      });

      can = sub.subscribe((subscriptionData) => {
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
      setSubcribed(can);
    })();
    return () => {
      can?.unsubscribe?.();
    };
  }, [queryData?.renderComponent?.rendered?.key, queryData]);

  /**
   * This needs to be done manually because we don't have the key of the component before the query above finished.
   * useSubscription doesn't work because it doesn't resubscribe if the key changes. ASD
   */
  useEffect(() => {
    if (!options?.data?.key || queryData?.renderComponent?.rendered?.key)
      return;
    let can;
    (async () => {
      const sub = await actualClient.subscribe({
        query: UPDATE_COMPONENT,
        variables: {
          key: options?.data?.component,
          scope: 'global',
          bearer: session.token ? `Bearer ${session.token}` : undefined,
          id,
        },
        context: {
          headers: {
            'X-Unique-Id': id,
            Authorization: session.token
              ? `Bearer ${session.token}`
              : undefined,
          },
        },
      });

      can = sub.subscribe((subscriptionData) => {
        if (!options.skip) setSkip(false);
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

      setSubcribed(can);
    })();
    return () => {
      can?.unsubscribe?.();
    };
  }, [options?.data?.key, JSON.stringify(options.props)]);

  // useEffect(() => {
  //   if (!subscribed) return;
  //   console.log('Component mounted', subscribed);
  //   if (actualClient) {
  //     (async () => {
  //       const cleaned = await actualClient.query({
  //         query: MOUNT_COMPONENT,
  //         variables: {
  //           key,
  //           props: options?.props,
  //         },
  //         fetchPolicy: 'network-only',
  //         context: {
  //           headers: {
  //             'X-Unique-Id': id,
  //             Authorization: session.token
  //               ? `Bearer ${session.token}`
  //               : undefined,
  //           },
  //         },
  //       });
  //       console.log('Unmounted', cleaned);
  //     })();
  //   }

  const unload = function (e) {
    if (unloading) return;
    // Cancel the event
    e.preventDefault();
    (async () => {
      unloading = true;
      await actualClient.query({
        query: UNMOUNT_COMPONENT,
        variables: {
          key,
        },
        fetchPolicy: 'network-only',
        context: {
          headers: {
            'X-Unique-Id': id,
            Authorization: session.token
              ? `Bearer ${session.token}`
              : undefined,
          },
        },
      });

      window.location.reload();
    })();

    return 'Just press ok, we only need to send a message to the server.';
  };
  let unloading = false;
  if (options.preventUnload) {
    window.addEventListener('pagehide', unload);
    window.addEventListener('unload', unload);
    window.addEventListener('beforeunload', unload);
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('pagehide', unload);
      window.removeEventListener('unload', unload);
      window.removeEventListener('beforeunload', unload);
      if (!subscribed) return;

      if (options.sendUnmount && actualClient) {
        (async () => {
          const cleaned = await actualClient.query({
            query: UNMOUNT_COMPONENT,
            variables: {
              key,
            },
            fetchPolicy: 'network-only',
            context: {
              headers: {
                'X-Unique-Id': id,
                Authorization: session.token
                  ? `Bearer ${session.token}`
                  : undefined,
              },
            },
          });
        })();
      }
    };
  }, [subscribed]);

  const inlineData = ssrResponse
    ? ssrResponse.data?.renderComponent?.rendered
    : options?.data && !queryData?.renderComponent?.rendered
    ? options?.data
    : queryData?.renderComponent?.rendered;

  const inlined = inline({
    data: inlineData,
    actualClient,
    setLastMutationResult,
    id,
    session,
  });

  console.log('RENDERING SSR RENDER', inlineData);

  const anyError = error || lastMutationResult?.errors?.[0];

  return [inlined, { error: anyError, loading, refetch }];
};

const inline = ({
  data,
  actualClient,
  setLastMutationResult,
  id,
  session,
}: {
  data: { props: Record<string, any>; children: any[] };
  actualClient: ApolloClient<any>;
  setLastMutationResult: (val: any) => void;
  id: string;
  session: Session;
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
              context: {
                headers: {
                  'X-Unique-Id': id,
                  Authorization: session.token
                    ? `Bearer ${session.token}`
                    : undefined,
                },
              },
            });
            setLastMutationResult(response);
            return response.data.callFunction;
          } catch (e) {
            setLastMutationResult({ errors: [e] });
            throw e;
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
        id,
        session,
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
  const [id] = useLocalStorage('id', v4(), { cookie: 'x-react-server-id' });
  const cacheId = `GetData:${key}:${scope}`;
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
      customCacheKey: cacheId,
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
    if (!subscriptionData?.updateState?.value) return;
    actualClient.cache.writeQuery({
      query: GET_STATE,
      variables: {
        key,
        scope,
      },
      data: {
        getState: {
          ...queryData?.getState,
          ...subscriptionData?.updateState,
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

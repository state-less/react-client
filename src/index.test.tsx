import React from 'react';
import { GET_STATE, SET_STATE, UPDATE_STATE, useServerState } from './index.js';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';

const mocks = [
  {
    request: {
      query: SET_STATE,
      variables: { key: 'hello-world', scope: 'global', value: 'Hello World' },
    },
    result: {
      data: {
        setState: { id: '1', value: 'Hello World' },
      },
    },
  },
  {
    request: {
      query: GET_STATE,
      variables: { key: 'hello-world', scope: 'global' },
    },
    result: {
      data: {
        getState: { id: '1', value: 'Hello World' },
      },
    },
  },
  {
    request: {
      query: UPDATE_STATE,
      variables: { key: 'hello-world', scope: 'global' },
    },
    result: {
      data: {
        updateState: { id: '1', value: 'Hello World' },
      },
    },
  },
];

const initialValue = 'Hello World';
const Mock = () => {
  const [value] = useServerState(initialValue, {
    key: 'hello-world',
    scope: 'global',
  });
  return <div>{value}</div>;
};
const SetValueMock = () => {
  const [value, setValue] = useServerState(initialValue, {
    key: 'hello-world',
    scope: 'global',
  });
  return (
    <div>
      <div id="value">{value}</div>
      <button data-testid="button" onClick={() => setValue('Hello World')}>
        Click
      </button>
    </div>
  );
};
describe('React Client', () => {
  it('throws an error if no client is found', () => {
    expect(() => render(<Mock />)).toThrow(
      'No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.'
    );
  });

  it('renders without crashing', () => {
    render(
      <MockedProvider mocks={mocks}>
        <Mock />
      </MockedProvider>
    );
  });

  it('renders the initial state value', () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks}>
        <Mock />
      </MockedProvider>
    );
    expect(getByText(initialValue)).toBeInTheDocument();
  });

  it('updates the state value', async () => {
    const { getByText, getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <SetValueMock />
      </MockedProvider>
    );
    expect(await getByText(initialValue)).toBeInTheDocument();
    act(() => {
      getByTestId('button').click();
    });
    expect(await getByText('Hello World')).toBeInTheDocument();
  });
});

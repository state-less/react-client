import React from 'react';
import { useServerState } from '.';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

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
  it('renders without crashing', () => {
    render(
      <MockedProvider>
        <Mock />
      </MockedProvider>
    );
  });

  it('renders the initial state value', () => {
    const { getByText } = render(
      <MockedProvider>
        <Mock />
      </MockedProvider>
    );
    expect(getByText(initialValue)).toBeInTheDocument();
  });

  it('updates the state value', () => {
    const { getByText, getByTestId } = render(
      <MockedProvider>
        <SetValueMock />
      </MockedProvider>
    );
    expect(getByText(initialValue)).toBeInTheDocument();
    getByTestId('button').click();
    expect(getByText('Hello World')).toBeInTheDocument();
  });
});

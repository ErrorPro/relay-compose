import React from 'react';
import {
  QueryRenderer,
  createFragmentContainer,
  commitMutation,
  createRefetchContainer,
  createPaginationContainer,
} from 'react-relay';

let environment;

const invariant = () => {
  if (!environment) {
    throw new Error('Relay environment has not been declared.');
  }
};

export const setEnviroment = env => environment = env;

export const queryRenderer = (rootQuery, variables) =>
  Component => class RelayRoot extends React.Component {
    static displayName = `RelayRoot(${Component.displayName})`

    render() {
      invariant();

      const vars = typeof variables === 'function' ? variables(this.props) : variables;

      return (
        <QueryRenderer
          environment={environment}
          query={rootQuery}
          variables={vars}
          render={({ error, props }) => {
            if (!props && !error) {
              return null;
            }

            return (
              <Component
                {...props}
                {...this.props}
                error={error}
              />
            );
          }}
        />
      );
  }
};

export const fragmentContainer = query => Component => createFragmentContainer(
  props => <Component {...props} />,
  query,
);

export const paginationContainer = (query, connectionConfig) => Component => createPaginationContainer(
  Component,
  query,
  connectionConfig,
);

export const refetchContainer = (renderVariables, query) => Component => createRefetchContainer(
  Component,
  renderVariables,
  query,
);

export const createMutation = (
  mutation,
  variables,
  optimisticResponse,
  optimisticUpdater,
  updater,
) => new Promise((res, rej) => {
  invariant();

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: res,
      onError: rej,
      optimisticResponse,
      optimisticUpdater,
      updater,
    },
  );
});

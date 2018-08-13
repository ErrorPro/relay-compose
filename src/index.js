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

// leave this one because by the time we found this typo the lib had been installed by many people.
// So to not break peoples' apps just leave this for noe.
export const setEnviroment = env => environment = env;
export const setEnvironment = env => environment = env;

export const fragment = query => Component => createFragmentContainer(
  props => <Component {...props} />,
  query,
);

export const paginationContainer = (query, connectionConfig) => Component => createPaginationContainer(
  Component,
  query,
  connectionConfig,
);

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

export const refetchContainer = (renderVariables, query) => Component => createRefetchContainer(
  Component,
  renderVariables,
  query,
);

export const createMutation = (
  mutation,
  config,
) => new Promise((res, rej) => {
  invariant();

  commitMutation(
    environment,
    {
      mutation,
      onCompleted: (result, errors) => {
        if (errors) {
          return rej(errors);
        }

        res(result);
      },
      onError: rej,
      ...config,
    },
  );
});

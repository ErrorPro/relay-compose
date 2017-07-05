import React from 'react';
import {
  QueryRenderer,
  createFragmentContainer,
  commitMutation,
} from 'react-relay';

let environment;

const invariant = () => {
  if (!environment) {
    throw new Error('Relay environment has not been declared.');
  }
};

export const setEnviroment = env => environment = env;

export const fragment = query => Component => createFragmentContainer(
  props => <Component {...props} />,
  query,
);

export const queryRenderer = (rootQuery, variables) =>
  Component => class RelayRoot extends React.Component {
    static displayName = `RelayRoot(${Component.displayName})`

    render() {
      invariant();

      return (
        <QueryRenderer
          environment={environment}
          query={rootQuery}
          variables={variables}
          render={({ error, props }) => <Component {...props} error={error} />}
        />
      );
  }
};

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

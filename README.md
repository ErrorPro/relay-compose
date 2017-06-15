# Relay-compose

This is a HOC for relay modern to work with сomposable react components.

You probably want to use this when you work with smart and dumb components and you need to compose relay data fetching in your smart component and pass it down to dumb component.

# Setup
    npm install --save relay-compose

Set relay [environment](https://facebook.github.io/relay/docs/relay-environment.html) using `setEnvironment` in your enty point. For example in `client.js`

    import { setEnviroment } from 'relay-compose';
    import relayEnv from './createRelayEnvironment'

    setEnviroment(relayEnv);

And now you are ready to use it.

# Examples
## Fragment

    import {
      graphql,
    } from 'react-relay';
    import { fragment } from 'relay-compose';

    import Persons from './Persons';

    export default compose(
      fragment(graphql`
        fragment PersonsContainerDesc on Person @relay(plural: true) {
          id
          title
        }
      `),
      connect(mapProps, mapDispatch, mergeProps),
    )(Persons);

## Query renderer(root)

    import {
      graphql,
    } from 'react-relay';
    import { queryRenderer } from 'relay-compose';

    import PersonsInfoPage from './PersonsInfoPage';
    import { PersonsContainer } from '../Persons';

    export default compose(
      queryRenderer(graphql`
        query PersonsInfoPageContainerQuery {
          Person {
            ...PersonsContainerDesc
          }
        }
      `),
      mapProps(props => ({
        persons: <PersonsContainer data={props.Person} />,
      })),
    )(PersonsInfoPage);

## Mutations

    import { createMutation } from 'relay-compose';

    export default compose(
      mapProps(props => ({
        onSubmit: (data) => {
          createMutation(graphql`
            mutation MyComponentContainerMutation($input: MyInput!) {
              createUser(input: $input) {
                clientMutationId
              }
            }
          `, { input: data }).then(res => console.log(res);
        },
      })),
      reduxForm({
        form: 'MyForm',
      }),
    )(MyForm);

# Information
This project is still in WIP. You are welcome to participate to it.
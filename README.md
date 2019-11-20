# react-native-root-portal

React portal support for react-native based on react-native-root-siblings.
Can create components for modals, toasts, loading bars, cover layers etc. to anywhere in your project.

## Installation

```
npm i react-native-root-portal
```
OR

```
yarn add react-native-root-portal
```

## Usage

### Portal.Exit

Create a way out for the react nodes put in a `Portal.Entry`

```
import Portal from 'react-native-root-portal';

function ExitDemo(props) {
  return (
    <>
      <OneOfYourComponent />
      {/* React nodes those put in a `Portal.Entry` named `portkey` will transport to here */}
      <Portal.Exit name={'portkey'} />
    </>
  );
}

```

### Portal.Entry

Put react nodes into the children, and transport them to the `Portal.Exit`.

```
import { StyleSheet, View } from 'react-native';
import Portal from 'react-native-root-portal';

function EntryDemo(props) {
  return (
    <Portal.Entry target={'portkey'}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]} />
    </Portal.Entry>
  );
}
```

### Portal.enter

Transport a react node outside react lifecycle.

```
import Portal from 'react-native-root-portal';

setTimeout(() => {
  Portal.enter(
    'portkey',
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]} />,
    () => {
      console.log('Rendered');
    }
  );
}, 2000);

```

### Portal.isExisted

Check if the name for Portal.Exit is existed in the project, in case of conflicts.

```
import Portal from 'react-native-root-portal';

// If a Portal.Exit has been rendered in the project it will returns `true`
console.log(Portal.isExisted('portkey'));

```

# React HOC promises

![Travis](https://travis-ci.org/matthis-d/react-hoc-promises.svg?branch=master)
## Usage

Write a component that will receive several props :
- `loading`: a boolean to insdicate if promises are done.
- `error`: an error thrown if any of the promises fails
- Your promises names.

```js
// MyComponent.js

const MyComponent = ({ loading, error, promiseData, anotherPromise }) => {
  if (loading) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>Oups! Something went wrong</span>
  }

  return <div>
    <span>{promiseData.id}</span>
    <span>{anotherPromise}</span>
  </div>
}
```

Then write a wrapper that will inject the promises thanks to the `withPromises` helper.

`withPromises` take an object as a first argument. This object's keys are the name of the props that will be injected into the wrapped component and their values are the promises that are to be resolved.

```js
// WithPromiseComponent.js

// import the lib
import withPromises from 'react-hoc-promises';

// import your component
import MyComponent from './MyComponent';

const WrappedComponent = withPromises({
  // `promiseData` will be injected as prop into MyComponent
  // when all promises will be resolved.
  promiseData: fetch('/data').then(res => res.json()),

  // Same for `anotherPromiseData`
  anotherPromiseData: Promise.resolve('random data'),
})(MyComponent);
```

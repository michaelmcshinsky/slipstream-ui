<p align="center">
  <a href="https://slipstream-ui.netlify.app">
    <img src="slipstream.svg" height="75">
  </a>
</p>
<h3 align="center">
  <b>Slipstream UI</b>
</h3>
<p align="center">
  A component library combining React with Tailwindcss built with TypeScript.
</p>
<hr/>

## Installation

```
npm i slipstream-ui
# or
yarn add slipstream-ui
```

## Usage

Slipstream UI is a wrapper for tailwind as well as a component library used in react. You will first need to add the wrapper to your tailwind.config.js file.

```
const slipstream = require('slipstream-ui/config')
module.exports = slipstream({
  purge: [],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
})
```

You know have access to all `Slipstream` components inside your React app.

### Example

``` jsx
import { Button } from 'slipstream-ui';

function Example () {
  return (
    <Button>Click me!</Button>
  )
}
```

## Development

Want to contribute? Check out the project roadmap! To get started, clone down the repo and start working on a given component. Make a pull request with detailed information about the component created, and options that exist. Ideally, add it to the Storybook stories as well.

Storybook makes it easy to see your component in action as your develop it. To use Storybook, run `yarn storybook` to spin up the local server. Add a story matching your component to see a live demo of the component and you are good to go!.
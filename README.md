<p align="center">
  <a href="slipstream-ui.netlify.app">
    <img src="slipstream.svg" height="75">
  </a>
</p>
<h3 align="center">
  <b>SlipStream UI</b>
</h3>
<p align="center">
  A component library combining React with Tailwindcss.
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
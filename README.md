<p align="center">
  <a href="https://slipstream-ui.netlify.app">
    <img src="https://github.com/michaelmcshinsky/slipstream-ui/raw/main/slipstream-banner-2.png" alt="Slipstream UI">
  </a>
</p>
<p align="center">
  Component library combining React and Tailwindcss, built with TypeScript
</p>
<p align="center">
  <a href="https://slipstream-ui.netlify.app">Storybook</a> | <a href="https://github.com/michaelmcshinsky/slipstream-ui">Github</a> | <a href="https://github.com/michaelmcshinsky/slipstream-ui/projects/1">Roadmap</a>
</p>
<p align="center">
  <img src="https://img.shields.io/npm/v/slipstream-ui?style=flat-square"/>
</p>
<hr/>

## Installation

```
npm i slipstream-ui
# or
yarn add slipstream-ui
```

## Usage

Slipstream UI is a wrapper for Tailwindcss as well as a component library built using React. You will first need to add the wrapper to your tailwind.config.js file.

```javascript
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

You now have access to all `Slipstream` components inside your React app.

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

Want to contribute? Check out the <a href="https://github.com/michaelmcshinsky/slipstream-ui/projects/1">project roadmap</a>! To make a contribution, follow these general steps:

1. Pull <small>(contributors)</small> or Fork <small>(guests)</small> repository.
2. Create component(s) in `src` folder structure with proper exports.
3. Create Storybook story with examples.
4. Submit pull request detailing out component implementation and usage.

Bonus points:
* Tests added for component.
* RTL and TTB features for language support if appropriate.
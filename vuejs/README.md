# Vue.js, the progressive JavaScript framework

## Overview of Vue.js

Vue.js is a JavaScript framework for building user interfaces and single-page applications. It builds on top of standard web technology — HTML, CSS and JavaScript — to allow incremental adoption, or the ability to add it seamlessly on top of vanilla websites without changing existing code (much). It's best known for its component-based architecture, allowing you to use the existing component style of HTML with what feel like custom elements.

### Key concepts

Vue.js provides two key improvements over vanilla HTML/JS:

- **Reactivity**: Vue.js automatically changes the DOM (the actual document displayed to the user) in response to JavaScript state changes, without having to explicitly 
  dispatch updates.
- **Declarativeness**: Vue.js allows for declarative rendering and building of components — the say-what-you-want style, as opposed to the say-how-to-make-it.

### Components

Vue.js talks about "components" a lot — they're simply reusable pieces of an app (think HTML elements that you can slot in anywhere). They're slightly more flexible than HTML elements, and interoperate with Vue.js much better and most importantly you can define completely custom ones. They're used like any other HTML element, however, with HTML-style tags within the HTML section of a component file.

> Vue.js has two different APIs for defining custom components — Options and Composition. This guide uses Options, since it's generally considered more beginner friendly 
> — the Composition API will still be mentioned throughout the guide.

## Getting Started

### Devtools and IDE Setup

TODO

### Building an app

While Vue.js was originally designed around incremental adoption, it's very common to build complete applications in it, which is what we'll be doing here. A number of tools
exist to streamline this process — not least the various npm scripts. After you've [installed NodeJS and NPM](TODO!!!), running `npm create vue@latest` will create a blank Vue.js app we can use as a template to build upon.  

You'll want to enable [TypeScript](TYPESCRIPT HACKPACK HERE), the Router (we'll go into this later!), and optionally ESLint and Prettier. The name doesn't matter yet, we'll just be looking at the example here before starting from scratch properly, so keep the example code, since we want to observe the resultant directory structure:

- `public/`: Anything in this directory will be served statically. Use this for assets that don't change, like images or icons (here, it contains the favicon) that you don't 
  want to use directly in your code.
- `src/assets/`: Much like `public/`, files that aren't intended to change are stored here, but you can import files from here. Use this for elements that you might need to use within your app directly, like stylesheets — in the example, `src/assets/main.css` is imported within `src/main.ts`
- `src/components/`: This directory holds the components that you define.
- `src/router/`:  This directory holds files relevant to the routing of your app — essentially how URLs map to components or pages. 
- `src/views/`: This directory holds your views (analogous to pages). While components are intended to be reusable, pages should not be, so this directory creates a purely
  semantic distinction.
- `src/main.ts`: This file contains the "bootstrapping" of the app — you can see it just mounts an App component (`src/App.vue`) to a `<div>` with id `app`.
- `index.html`: This is the only file that's truly fixed in location apart from `public/` — everything else is imported (directly or indirectly) from this. You can see
  how all it really does is define an empty `<div>` with id `app`, and then import `src/main.ts` (which mounts the app to said `<div>`).
- `vite.config.ts`: This file configures how [Vite](https://vite.dev/) (the default build tool for Vue.js) turns our code into HTML for actual viewing in a browser. It's pretty minimal, but we can see it alias `@` to the `./src/` URL — which is then used within `src/App.vue` for example.
- `tsconfig.json`, `tsconfig.app.json` and `tsconfig.node.json`: These files configure how [TypeScript](TYPESCRIPT HACKPACK HERE) is setup within this project.

> You can rejig almost all of this (save for `index.html` and `public/`) by updating where things are imported from — however, for beginners, this isn't recommended, since the provided file structure helps to organize things.

There's an awful lot of pre-existing code in here, most of which we don't really care about. We're going to remember how these directories are set up, and delete the old 
project. Run `npm create vue@latest` again with the same settings, but choose a relevant name here and don't include the example code. Now is also a good time to set-up [Git](GIT HACKPACK HERE). 

### Running your app

In order to run it this project, first run `npm install` to fetch required dependencies. After this completes, you should be able to run `npm run dev` to run a development 
version of your app. Visiting the URL it displays, you should get a minimal welcome page congratulating you on doing it. Because it's in development mode, you'll get things like hot-reloading when you edit code in your editor.

> When you're done with your project and want to host it somewhere, potentially, just run `npm run build` — you'll get a load of HTML, CSS and JS files in the `dist/` directory of your project, which you can simply host from the root of your site.

### Your First Component

Now that we've got something running, let's explore the first aspect of Vue.js — reactivity, or the ability to dynamically update the DOM when JavaScript/TypeScript state is changed. We'll make a simple counter component, that increments a number when a button is pressed.

Within `src/components/` (create the directory if it doesn't exist), let's make a new component: `Counter.vue`.

> `.vue` files are called "single-file components" (i.e. everything for one component is within one file). It's possible to split them up, but again, this is not recommended for beginners due to the added complexity.

`Counter.vue` needs some skeleton code, so here's the most minimal definition of any Vue.js component:

```vue
<script lang="ts">
export default {}
</script>

<template>
</template>

<style scoped>
</style>
```

This is already a fair amount of code, so let's break it down line-by-line before we proceed:

- `<script lang="ts">` and `</script>`: in HTML style, this defines an inline portion of code, where we set the language to TypeScript.
- `export default {}`: Because we're using the Options API, we should export an object that defines aspects of our component — here, we simply export an empty object.
- `<template>` and `</template>`: This section of the file contains the actual HTML(-esque) code that makes up the visual aspect of the template — again, left blank.
- `<style scoped>` and `</style>`: This section is optional, but allows us to define CSS limited to this component only.

> If we were using the Composition API instead of Options, we'd have `<script setup lang="ts">` instead of `<script lang="ts">`, where the `setup` label tells Vue that this is a special kind of `<script>`, and it would automatically import various things for us. Composition allows for more powerful code patterns, but removes the explicitness in exporting one comprehensive object that beginners generally benefit from.
> 
> You can mix-and-match APIs within the same project, just not within the same component.

Now that we know what's going on, let's proceed. Let's add a button that we can click to update some number. Within the `<template>` section, add:

```html
<button>Count is:</button>
```

#### Using a component

Now that we have a component, we need to use it somewhere. Within `App.vue`, we can reference the component by name - insert a `<Counter />` (or `<Counter></Counter>`, they're equivalent) tag somewhere within the `<template>` section. Vue won't know what we're talking about currently, and won't actually display any button - we need to first import the Counter component. 

Inside the `<script>`, import it as such:

```typescript
import Counter from './components/Counter.vue';
```

When you revisit your rendered website, you should find (wherever you put the component in `App.vue`) a button!

#### Reactive state, and using values in HTML

It's now time to use one of the underpinning features of Vue.js — reactivity. In order to define some sort of state upon our component that can be used from the HTML, we need to add to the exported object. Specifically, we define a `data()` function which returns the reactive state of our object:

```typescript
export default {
  data() {
    return {
      count: 0
    }
  },
}
```

The object returned from `data()` is merged with the component, so we can now access `this.count`. Importantly, updating this from the code-side will dynamically update any DOM elements that use the data.

<blockquote>
Vue's reactive state uses reactive proxies under-the-hood. The only important thing to keep in mind is non-reactive things do not become reactive when copied. In the following case:

```typescript
export default {
  data() {
    return {
      someData: {}
    }
  },
}

let newObject = {someVariable: "someValue"}
this.someData = newObject
```

`newObject` does not become reactive, and while updating `newObject` will update `someData`, it won't trigger components that depend upon `someData` to re-compute their state. Always use `this` to update reactive state.
</blockquote>

In order to have a DOM element that does this, we can use template syntax - Vue.js uses a Handlebars style. Writing double-braces in the HTML results in the contained TypeScript code being executed, and the result spliced into the DOM where the braces were.

To achieve this, change the text in the `<button>` to something like `Count is: {{ count }}`, and you should see the button's text become `Count is: 0`.

#### Vue directives, component methods, and updating values from HTML

In order to update the count when the button is pressed, we need to get the button to do something on a click. While the classic HTML `onclick` attribute works for classic HTML, it fails in Vue due to how Vue needs to track reactive state. In order to run code "under Vue" within a directive, we use Vue.js directives.

Vue directives are HTML attributes used by Vue. There are [very, very many of these](https://vuejs.org/api/built-in-directives.html), ranging from event handling to conditional rendering to memoization. We're interested in `v-on`, the event listener directive. By attaching something to the `click` event, we can achieve the desired behaviour — `<button v-on:click="something here">`.

> If you've read the `v-on` section of the docs page, you might notice it can be aliased as `@` — this just means instead of `v-on:click=` we can write `@click=` as shorthand.

Directives like this can take multiple values — inline TypeScript is often the simplest option (`v-on:click="count++"`) Adding this, you should see the value on your button update when you click it.

Congratulations! You've successfully made your first component in Vue.js. We'll now try and make something a bit more complex and involved using similar principles — a full app (albeit a very simple one).

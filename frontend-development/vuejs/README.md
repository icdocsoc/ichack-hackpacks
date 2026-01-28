# Vue.js, the progressive JavaScript framework

## Table of Contents

<!-- TOC -->

- [Vue.js, the progressive JavaScript framework](#vuejs-the-progressive-javascript-framework)
  - [Table of Contents](#table-of-contents)
  - [Overview of Vue.js](#overview-of-vuejs)
    - [Key concepts](#key-concepts)
    - [Components](#components)
  - [Getting Started](#getting-started)
    - [Devtools and IDE Setup](#devtools-and-ide-setup)
    - [Building an app](#building-an-app)
    - [Running your app](#running-your-app)
    - [Your First Component](#your-first-component)
      - [Using a component](#using-a-component)
      - [Reactive state, and using values in HTML](#reactive-state-and-using-values-in-html)
      - [Vue directives, component methods, and updating values from HTML](#vue-directives-component-methods-and-updating-values-from-html)
  - [The Todo App: A Whirlwind Tour](#the-todo-app-a-whirlwind-tour)
    - [Props, events and the task component](#props-events-and-the-task-component)
    - [The About page](#the-about-page)
    - [The Home page](#the-home-page)
    - [The Router](#the-router)
    - [The App itself](#the-app-itself)
  - [Other useful resources](#other-useful-resources)

<!-- /TOC -->

## Overview of Vue.js

Vue.js is a JavaScript framework for building user interfaces and single-page applications. It builds on top of standard web technology — HTML, CSS and JavaScript — to allow incremental adoption, or the ability to add it seamlessly on top of vanilla websites without changing existing code (much). It's best known for its component-based architecture, allowing you to use the existing component style of HTML with what feel like custom elements.

### Key concepts

Vue.js provides two key improvements over 'vanilla' HTML/JS:

- **Reactivity**: Vue.js automatically changes the DOM (the actual document displayed to the user) in response to JavaScript state changes, without having to explicitly dispatch updates.
- **Declarativeness**: Vue.js allows for declarative rendering and building of components — you can say what you want and brush over the implementation details, letting Vue.js handle the nitty-gritty of webdev.

### Components

Vue.js talks about "components" a lot — they're simply reusable pieces of an app (think HTML elements that you can slot in anywhere). They're slightly more flexible than HTML elements, and interoperate with Vue.js much better. Most importantly, you can define completely custom ones. They're used like any other HTML element, however, with HTML-style tags within the HTML section of a component file.

> [!IMPORTANT]
> Vue.js has two different APIs for defining custom components — *Options* and *Composition*. This guide uses Options, since it's generally considered more beginner friendly — the Composition API will still be mentioned throughout the guide.

## Getting Started

### Devtools and IDE Setup

TODO

### Building an app

While Vue.js was originally designed around incremental adoption, it's very common to build complete applications in it, which is what we'll be doing here. A number of tools exist to streamline this process — not least the various npm scripts. After you've [installed NodeJS and NPM](/getting-started/README.md#javascript--typescript), running `npm create vue@latest` will create a blank Vue.js app we can use as a template to build upon.  

You'll want to enable TypeScript, the *Router* (we'll go into this later!), and optionally *ESLint* and *Prettier*. The name of the project doesn't matter yet as we'll just be looking at the example here before starting from scratch properly (so you can enter anything you like). Make sure you keep the example code, since we want to observe the resultant directory structure. You can refer to [our example project](/frontend-development/vuejs/vue-project/) for more detail.

- `public/`: Anything in this directory will be served **statically**. Use this for assets that don't change, like images or icons (here, it contains [the favicon](/vuejs/vue-project/public/favicon.ico)) that you don't want to use directly in your code.
- `src/assets/`: Much like `public/`, files that aren't intended to change are stored here, but you can import files from here. Use this for static elements that you might need to use within your app directly, like stylesheets. In the example, `src/assets/main.css` is imported within `src/main.ts`
- `src/components/`: This directory holds the **components** that you define.
- `src/router/`:  This directory holds files relevant to the routing of your app — essentially how URLs map to components or pages.
- `src/views/`: This directory holds your **views** (analogous to pages). While components are intended to be reusable, pages should not be, so this directory creates a purely semantic distinction.
- `src/main.ts`: This file contains the "bootstrapping" of the app — you can see it just mounts an App component (`src/App.vue`) to a `<div>` with id `app`.
- `index.html`: This is the only file that's truly fixed in location apart from `public/` — everything else is imported (directly or indirectly) from this. All it really does is define an empty `<div>` with id `app`, and then import `src/main.ts` (which mounts the app to said `<div>`).
- `vite.config.ts`: This file configures how [Vite](https://vite.dev/) (the default build tool for Vue.js) turns our code into HTML for actual viewing in a browser. It's pretty minimal, but we can see it alias `@` to the `./src/` URL — which is then used within `src/App.vue` for example.
- `tsconfig.json`, `tsconfig.app.json` and `tsconfig.node.json`: These files configure how [TypeScript](TYPESCRIPT HACKPACK HERE) is setup within this project.

> [!NOTE]
> You can rejig almost all of these files and directories (save for `index.html` and `public/`) by updating where things are imported from — however, for beginners, this isn't recommended, since the provided file structure helps to organize things.

There's an awful lot of pre-existing code in here, most of which we don't really care about. We're going to remember how these directories are set up, and **delete the old project**. Run `npm create vue@latest` again with the same settings, but choose a relevant name here and *don't include the example code*. Now is also a good time to [set-up Git](/git-&-github/README.md).

### Running your app

In order to **run** this project, first run `npm install` to fetch all required dependencies. After this completes, you should be able to run `npm run dev` to run a development version of your app. Visiting the URL displayed in your terminal, you should see a minimal welcome page congratulating you on doing so. Because it's in development mode, you'll get things like hot-reloading when you edit code in your editor.

>[!TIP]
> When you're done with your project and want to host it somewhere, just run `npm run build` — you'll get a load of HTML, CSS and JS files in the `dist/` directory of your project, which can simply be moved to the root of your site.

### Your First Component

Now that we've got something running, let's explore the first aspect of Vue.js — *reactivity*, or the ability to dynamically update the DOM when JavaScript/TypeScript state is changed. We'll make a simple counter component, that increments a number when a button is pressed.

Within `src/components/` (create the directory if it doesn't exist), let's make a new component: `Counter.vue`.

> [!NOTE]
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

- `<script lang="ts">` and `</script>`: in HTML style, this defines an inline portion of code, where we set the language to TypeScript. This can be omitted. Code in here is the "constructor code", and is run once when the component is first loaded. You can use [lifecycle hooks](https://vuejs.org/guide/essentials/lifecycle) to control when specifically code is run over the lifetime of a component.
- `export default {}`: Because we're using the *Options API*, we should export an object that defines aspects of our component — here, we simply export an empty object.
- `<template>` and `</template>`: This section of the file contains the actual HTML(-esque) code that makes up the visual aspect of the template — again, left blank.
- `<style scoped>` and `</style>`: This section is optional, but allows us to define CSS limited to this component only.

> If we were using the Composition API instead of Options, we'd have `<script setup lang="ts">` instead of `<script lang="ts">`, where the `setup` label tells Vue that this is a special kind of `<script>`, and it would automatically import various things for us, and set certain behaviours. Composition allows for more powerful code patterns, but removes the explicitness in exporting one comprehensive object that beginners generally benefit from.
>
> You can mix-and-match APIs within the same project, just not within the same component.

Now that we know what's going on, let's proceed. Let's **add a button** that we can click to update some number. Within the `<template>` section, add:

```html
<button>Count is:</button>
```

#### Using a component

Now that we have a component, we need to use it somewhere. Within `App.vue`, we can reference the component by name - insert a `<Counter />` (or `<Counter></Counter>`, they're equivalent) tag somewhere within the `<template>` section. Vue won't know what we're talking about currently, and won't actually display any button - we need to first import the `Counter` component.

Inside the `<script>` (in `App.vue`), import it as such:

```typescript
import Counter from './components/Counter.vue';
```

We should also tell Vue that we're using the Counter component in our App component (still in `App.vue`). Via the Options API, we export it as part of the exported object (note the script is not marked setup!):

```vue
<script lang="ts">
import Counter from './components/Counter.vue';

export default {
    components: { Counter }
}
</script>
```

> [!WARNING]
> If you leave this snippet out, then Vue won't know what to use when you talk about the Counter component. The Composition API handles this exporting automatically when you import a component, but we're using Options here because it makes things more explicit.

When you revisit your rendered website, you should find (wherever you put the component in `App.vue`) **a button**!

#### Reactive state, and using values in HTML

It's now time to use one of the underpinning features of Vue.js — *reactivity*. In order to define some sort of state for our component that can be used from the HTML, we need to add to the exported object. Specifically, we define a `data()` function (within the exported object, in `Counter.vue`) which returns the reactive state of our object:

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

Vue's reactive state uses something called reactive proxies under-the-hood. The specific implementation details aren't too important here, but can be found [on the Vue.js docs](https://vuejs.org/guide/extras/reactivity-in-depth). The only important thing to keep in mind is non-reactive things (things that don't update when things they depend on do) do not become reactive when copied. In the following case:

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

To have a DOM element that does this, we can use template syntax (a way of writing "template HTML" such that it's used to generate real HTML) - Vue.js uses a Handlebars style. Writing double-braces in the HTML results in the contained TypeScript code being executed, and the result spliced into the DOM where the braces were.

To achieve this, change the text in the `<button>` to something like `Count is: {{ count }}`, and you should see the button's text become `Count is: 0`.

#### Vue directives, component methods, and updating values from HTML

In order to update the count when the button is pressed, we need to get the button to do something on a click. While the classic HTML `onclick` attribute works for classic HTML, it fails in Vue due to how Vue needs to track reactive state. In order to run code "under Vue" within a directive, we use Vue.js directives.

Vue directives are HTML attributes used by Vue. There are [very, very many of these](https://vuejs.org/api/built-in-directives.html), ranging from event handling to conditional rendering to memoization. We're interested in `v-on`, the event listener directive. By attaching something to the `click` event, we can achieve the desired behaviour — `<button v-on:click="something here">`.

> [!NOTE]
> If you've read the `v-on` section of the docs page, you might notice it can be aliased as `@` — this just means instead of `v-on:click=` we can write `@click=` as shorthand.

Directives like this can take multiple values — inline TypeScript is often the simplest option (`v-on:click="count++"`) Adding this, you should see the value on your button update when you click it.

You can also call TypeScript methods within the `<template>` block, but only specific ones. Exporting or defining methods within the `methods` block of the exported object allows this — we'll see more of this later.

Congratulations! You've successfully made your first component in Vue.js. We'll now try and make something a bit more complex and involved using similar principles — a full app (albeit still a very simple one).

## The Todo App: A Whirlwind Tour

We're going to build a *very, very simple* todo app, that has a list of tasks, allows you to complete them, and add new tasks. There'll be a little bit of *Router* in there too, for good measure.

If you want to follow along, you'll need the standard basic Vue.js project setup that we used in the last example.

You might also want to style this slightly; play around with [the CSS compatible with the class names used here](TODO), which should go in [`src/assets/main.css`](/vuejs/todo-app/src/assets/main.css) and imported from [`src/main.ts`](/vuejs/todo-app/src/main.ts) with `import "./assets/main.css"`.

### Props, events and the [task component](/vuejs/todo-app/src/components/Task.vue)

```html
<!-- src/components/Task.vue -->
<script lang="ts">
export default {
  props: {
    name: String,
    description: String,
  }
}
</script>

<template>
  <div class="row box">
    <div class="columnl">
      <button class="box" v-on:click="$emit('task_completed')">Done</button>
    </div>
    <div class="columnr">
      <h4>{{ name }}</h4>
      <p>{{ description }}</p>
    </div>
  </div>
</template>
```

This component uses concepts we've seen before, and two we havent: *Props* and *Events*. Props are parameters passed to a component, similar to how `<a>` tags take a `href` — you could think of the `href` being a "prop" for the `<a>` tag. Props can then be accessed through `this`, but *cannot be used as reactive state*. Prop updates are not propagated to the parent, so you should use events for this.

> [!INFO]
> `v-model` is usable on component props, but this requires some logic within the component containing the update event — see [Component v-model](https://vuejs.org/guide/components/v-model.html) for details.

To allow your component to take props, simply add the `props` field to the exported object, containing the name of the prop and its corresponding type (technically, the constructor function of the corresponding type).

The other new thing here are Events. Events already exist in HTML (see the `click` event, or `input`). Vue allows us to create custom events and listen for them using the `v-on` directive.

> [!WARNING]
> `v-on` will only catch custom events in a custom component, not a regular HTML element.

We can emit events (cause one to happen and be subsequently processed, probably somewhere else) using `this.$emit(event_name, event_data)`. The `event_data` parameter is optional. In the `<template>` body, you can use just `$emit(...)` since `this` is implied there.

We'd then catch this using `... v-on:event_name = "some_function_using($event)" ...` where `$event` is a built-in variable within `v-on` clauses that is the event data, if provided. Most native events have data; see [the MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Event) for details.

### [The About page](/vuejs/todo-app/src/views/AboutView.vue)

```html
<!-- src/views/AboutView.vue -->
<template>
  <h4 class="padded">About</h4>
  <p class="padded">This is a trivial Vue application</p>
</template>
```

There's nothing interesting at all here, apart from the lack of a `<script>` tag — like the `<style>` tag, this is optional.

### [The Home page](/vuejs/todo-app/src/views/HomeView.vue)

```html
<!-- src/views/HomeView.vue -->
<script lang="ts">
import Task from "../components/Task.vue"

export default {
  components: {
    Task
  },
  data() {
    return {
      tasks: [
        { id: 0, name: "The Night Circus", description: "(Erin Morgenstern)" },
        { id: 1, name: "The Starless Sea", description: "(Erin Morgenstern)" },
        { id: 2, name: "The Ten Thousand Doors of January", description: "(Alix E. Harrow)" },
        { id: 3, name: "The Girl with the Dragon Tattoo", description: "(Stieg Larsson)" },
      ],
      new_open: false,
      new_name: "",
      new_description: "",
      form_invalid: false,
      last_used_id: 3,
    }
  },

  methods: {
    open_modal() {
      this.new_name = "";
      this.new_description = "";
      this.form_invalid = false;
      this.new_open = true;
    },
    submit_task() {
      if (this.new_name == "") {
        this.form_invalid = true;
      } else {
        this.new_open = false;
        this.tasks.push({ id: ++this.last_used_id, name: this.new_name, description: this.new_description })
      }
    },
    cancel_task() {
      this.new_open = false;
    },
    complete_task(task_id: number) {
      let idx = this.tasks.findIndex(({ id }) => id == task_id)
      this.tasks.splice(idx, 1)
    }
  }
}
</script>

<template>
  <button class="box" id="new_task" v-on:click="open_modal">New Task</button>
  <Task v-for="task in tasks" v-on:task_completed="complete_task(task.id)" v-bind:name="task.name"
    v-bind:description="task.description" />
  <Teleport to="body" v-if="new_open">
    <div class="modal-bg" />
    <div class="modal box">
      <h4 class="padded with-margin">Add Task</h4>
      <input class="box" v-model="new_name" placeholder="Name" /><br />
      <input class="box" v-model="new_description" placeholder="Description" /><br />
      <p class="with-margin" v-if="form_invalid">Invalid Submission!</p>
      <button class="box" v-on:click="submit_task">Submit</button>
      <button class="box" v-on:click="cancel_task">Cancel</button>
    </div>
  </Teleport>
</template>

<style scoped>
h4 {
  padding: 5px;
  margin: 5px;
}
</style>

```

It looks like there's a lot going on here, but there's very little new — just `v-if`, `v-for` and the `<Teleport>` component.

`v-if` is a directive that takes an **expression value**, and conditionally renders the tag it's attached to. It creates and destroys the component upon the variable updating from true to false, and vice versa. Here, it's used to only show the modal (popup) if the variable `new_open` is true (which is updated in the `open_modal` function).

`v-for` is a directive that, attached to a tag, duplicates the tag over some sort of list. Here, we're iterating over the `tasks` list, and binding the specific task to the `task` variable, which is then accessible from TypeScript snippets on DOM elements within the `v-for`-ed element.

The `<Teleport>` component is a built-in component from Vue.js. It takes a DOM element that logically belongs somewhere (here, the modal logically belongs within the Home page), but should be rendered somewhere else — the most common use is to move modals to the `<body>` tag, as done here (and [documented on the Vue.js docs](https://vuejs.org/guide/built-ins/teleport.html)).

### [The Router](/vuejs/todo-app/src/router/index.ts)

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: () => import("../views/HomeView.vue"), },
    { path: "/about", name: "about", component: () => import("../views/AboutView.vue") }
  ],
})

export default router
```

This is pretty similar to the pre-provided Router file. We've just registered two paths, Home and About, using the lazy-load syntax.

Since we've specified the components as lambdas that return the components needed, instead of just providing the components, Vue.js Router will lazy-load those components in when needed — potentially slowing navigation very slightly, but greatly improving initial page load speed.

### [The App](/vuejs/todo-app/src/App.vue) itself

```html
<!-- src/App.vue -->
<template>
  <ul class="navbar">
    <li>
      <RouterLink to="/">Tasks</RouterLink>
    </li>
    <li>
      <RouterLink to="/about">About</RouterLink>
    </li>
  </ul>
  <main>
    <RouterView />
  </main>
</template>
```

Again, there's not much new here, just Router components. Using `<RouterView to...>` instead of `<a href...>` enables the router to switch components fluidly, enabling the SPA feel (single-page application) and preventing janky page loads in the browser itself, which is the hallmark of non-SPA apps.

`<RouterView />` is where the router outputs the current view, as defined by the current URL. Since it's in a component, we can move it around as we like — here we've defined a navbar first, then the page beneath.

## Other useful resources

While using Vue.js like this is useful sometimes, it's often nice to use component libraries — these build more complex components with consistent styling for you. Commonly used ones include [Vuetify](https://vuetifyjs.com) and [Nuxt UI](https://ui.nuxt.com/).

[Nuxt](https://nuxt.com/) is a fullstack framework using Vue, which integrates backend and frontend into the same project.

Fetching data can either be done [pre- or post-navigation](https://router.vuejs.org/guide/advanced/data-fetching), and common JS http request libraries include [Axios](https://github.com/axios/axios), which is compatible with the RESTful backends discussed in the [Backend hackpacks](/backend-development/), or [VueFire](https://vuefire.vuejs.org/) for [Firebase](/api-design/README.md#firebase-cloud-functions) integration.

# Android Development with Kotlin

In this guide, we will cover the basics of Android development, using **Kotlin**, Google's preferred language for Android mobile development since 2019, and **Jetpack Compose**, Android's modern UI toolkit.

We will assume a basic working knowledge of Kotlin, and general object-oriented programming (OOP) concepts, but if you need some further guidance on this, don't worry! The [official Kotlin documentation](https://kotlinlang.org/docs/home.html) is a very useful tool.

To follow along, you'll probably also want to download **Android Studio**, the official IDE for Android app development. Use the [detailed installation instructions](https://developer.android.com/codelabs/basic-android-kotlin-compose-install-android-studio) for Windows, macOS, and Linux on the Android Developers website.

## An IC Hack Greeting App

For our first demo, we'll build a simple app that allows us to greet IC Hack attendees!

It'll display a simple "Welcome to IC Hack!" message with a customisable tagline.

### Basic Set-up

Follow the instructions below to initialise the empty project we'll be able to build off:

- Open Android Studio.
- Create a new *Empty Activity* and name it how you like (I personally named my app 'Welcome to IC Hack'). An **Activity** represents a single screen in your app — we're creating an empty one to build from scratch.
- You can leave the other settings (*Minimum SDK*, *Build configuration language*) as the default.
- Once Android Studio has created and built your project, you should be able to click the green ▶️ *Run* button next to 'app' in the top toolbar. Your app should display as follows:

![Screenshot with 'Hello Android!' text.](assets/hello-android.png)

> **Having trouble?** If Gradle sync fails or you see "No devices available", grab one of the mentors — they'll help you get set up!

### Understanding the generated code

Before we start making changes, let's understand what Android Studio created for us in `MainActivity.kt`:

- **`MainActivity`** is the entry point of your app — it's the Activity that runs when your app launches
- **`onCreate()`** is called when the Activity starts; think of it as your starting point
- **`setContent { }`** is where we define our UI using Compose
- **`WelcomeToICHackTheme { }`** wraps our content in a consistent theme (colours, typography, etc.)
- **`Surface`** is a container that applies the theme's background colour

Now let's talk about **composable functions**, the building blocks of your UI.

### Composable Functions

These are the basic building block of a UI in Jetpack Compose.

A composable function describes some part of your UI and is otherwise like any regular function in Kotlin, except for the fact that it doesn't return anything. Instead, it takes some input (its function parameters) and generates what's shown on the screen.

Composable functions are identified by the `@Composable` **annotation** before the function declaration. It informs the Compose compiler that this function is intended to convert data into UI.

#### Examples of composable functions

Take a look at the `MainActivity.kt` file in our generated project.

You should see two composable functions at the bottom: `Greeting()` and `GreetingPreview()`.

Both of these represent UI elements within our app, as desired: `Greeting()` encompasses a simple text box that displays a basic message, and `GreetingPreview()` uses the extra `@Preview` annotation to display this text box within a preview window in our IDE (which can be opened from the `Split` or `Design` views in the top-right).

Try toggling the `showBackground = true` parameter of the Preview annotation. You could even add `showSystemUI` and `name` parameters to customise your preview further.

---

Before we dive into the code further, we need to learn about a few more Compose concepts.

#### Layout Composables

So far, we've seen `Text()` — a composable that displays text on screen. But what if we want to display *multiple* pieces of text? And control how they're arranged?

This is where **layout composables** come in. These are special composables that don't display content themselves, but instead control how their *children* (the composables inside them) are positioned.

The three most common layout composables are:

- **`Column`**: arranges children vertically (stacked top to bottom)
- **`Row`**: arranges children horizontally (side by side)
- **`Box`**: stacks children on top of each other (like layers)

For our greeting card, we want a main message at the top and a "from" line below it. This is a perfect use case for `Column`!

#### Units: dp and sp

When specifying sizes in Compose, we use special units that adapt to different screen densities:

- **`dp`** (density-independent pixels) — used for spacing, padding, and layout dimensions. A button that's `48.dp` wide will appear roughly the same physical size on any device.
- **`sp`** (scalable pixels) — used specifically for text sizes. These respect the user's font size preferences in their device settings, making your app more accessible.

#### Modifiers: Styling and Layout

You may have noticed that `Greeting()` has a `modifier` parameter. **Modifiers** are how we style and position composables in Jetpack Compose — think of them as a chain of instructions that describe how a composable should look and behave.

Modifiers can be chained together:

```kotlin
Modifier
    .padding(16.dp)       // Add space around the element
    .fillMaxWidth()       // Make it as wide as its parent
    .align(Alignment.End) // Position it to the right
```

Each modifier in the chain is applied in order, which can affect the result — for example, adding padding *before* a background colour gives a different effect than adding it *after*.

---

Now we're ready to update our code! We'll make these changes step by step.
> Android Studio should prompt you to add imports automatically as you type (just press `Alt+Enter` when you see a red underline).

#### Step 1: Wrap your `Text` in a `Column`

Find your `Greeting()` function. Currently it just contains a single `Text` composable. Wrap that `Text` inside a `Column { }` block:

```kotlin
Column {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}
```

Remember, `Column` arranges its children vertically — so anything we add inside will stack top to bottom.

#### Step 2: Add a second `Text` for the "from" line

Inside your `Column`, after the first `Text`, add another `Text` composable. This one will display who the greeting is from. What text should it show? What parameters might you pass to it?

Try it yourself first, then check the example project if you get stuck!

#### Step 3: Update the function parameters

Currently `Greeting()` takes a `name` parameter, but now we want to display two different pieces of text: a message and a "from" line.

Update the function signature to take `message: String` and `from: String` instead of `name: String`. Then update your two `Text` composables to use these new parameters.

#### Step 4: Style your text

Plain text works, but let's make it look more like a greeting card! Try adding these parameters to your `Text` composables:

- `fontSize` — how large should your text be? Try something like `72.sp` for the main message and `36.sp` for the "from" line
- `lineHeight` — controls spacing when text wraps. Try `90.sp` for the main message
- `textAlign` — try `TextAlign.Center` for centred text

For the "from" text, can you use `Modifier.padding()` and `Modifier.align()` to add some spacing and push it to the right side?

#### Step 5: Update your call sites

Now that `Greeting()` has different parameters, you'll see errors where it's called. Update the call in `onCreate()` and in `GreetingPreview()` to pass your new `message` and `from` arguments.

What message do you want to display? Don't forget to add your own name!

#### Step 6: Run your app

Click *Run `app`* again in the top toolbar. You should now see your personalised IC Hack greeting displayed on screen!

Mine looks like this:

![Screenshot of example app.](assets/welcome-to-ic-hack.png)

> **Stuck?** The complete example is available in the `welcome-to-ic-hack` folder of this repository. Compare your code to `MainActivity.kt` if you need a hint!

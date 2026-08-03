**onRokuDev** is an "in-progress" sample channel which hopes to show an example of how a fast, familiar, and failure-tolerant structure could be implemented in a roku application.  It does this through patterns which prefer composition over inheritance, prevent and catch exceptions, and provide the tools to easily create modern and performant UI elements.


The world of roku makes it difficult for a programmer, who's new to the ecosystem, to know what to do, what not to do, and most importantly, how to do it. This results in applications which can quickly become unwieldly layers of abstraction lasagna with a side of spaghetti hell.  There are attempts out there which attempt bring some structure, but don't necessarily address all of the following problems:

## Over-abstraction

Roku does not allow creation of custom interfaces akin to `ifAssociativeArray` or `ifToStr` and usage of them in user-defined objects.  This forces the developer to either create shared function files, the structure and rules of which are nebulous, or rely on inheritance to share code between components, often leading to over-abstraction.  **onRokuDev** tackles that problem with psudo-interfaces organized as `traits`, which expose functions encapsulated to their responsibilities with the help from brighterscript's `classes`.

## Application flow

Programmers can often start out feeling confident about their architecture until they encounter requirements demanding the tracking of every single user action that result in a cascade of procedures making calls to various analytics, tracking, and back-end services.  **onRokuDev** solves this problem with a trait `eventable`.

Dispatch an event from any view or controller:

```brs
sub onButtonSelected()
    dispatch(events.TOGGLE_BUTTON, { content: m.content })
end sub
```

Subscribe to an event in any number of controllers:

```brs
sub init()
    subscribe({
        [events.BUTTON_TOGGLED]: onButtonToggled
        [events.TOGGLE_BUTTON]: toggleButton
    })
end sub


sub onButtonToggled(options = {})
    options.content.active = options.active
end sub


sub toggleButton(options = {})
    task = createObject("roSGNode", "UserTask")
    task.options = options
    task.control = "RUN"
end sub
```

Publish an event from a Task:

```brs
function runUserTask()
    options = m.top.options
    response = makeAPIRequest(options)

    publish(events.BUTTON_TOGGLED, {
        active: response.data?.active,
        content: options.content
    })

    return true
end sub
```

Under the hood, `dispatch`, `subscribe`, and `publish` use [roRenderThreadQueue](https://developer.roku.com/dev/docs/rorenderthreadqueue) which allows the transfer of assocarrays from Task thread nodes to Render thread nodes with no rendezvous penalty.  `dispatch` uses a separate, long-lived Task to `publish` events, with every handler function protected with `try catch` using `safeable#exec` function.

Using these methods, it's easy to create a coherent workflow that doesn't rely on bubbling of events or random observed or functional fields.  Each event name is unique, facilitating search, and in development, each event prints out in the console log making the app easy to follow and debug.

## Application stability

There are a lot of roku apps out there with a crash rate well above 1%.  It's not easy to make sure that every callstack entrypoint function is protected.  You could have a rigid ruleset with mandatory `try catch` blocks and typechecking everywhere, but that increases the cognitive load on the developer as well as creating mountains of boilerplate code which needs to be maintained.  **onRokuDev's** `safeable` trait provides several methods to alleviate this burden.

The `init` and `onKeyEvent` functions, functional and observed field's handler functions, and the Task's `functionName` function.

## Focus handling nightmare

Oh how easy is it to get into the weeds when it comes to focus handling in roku development. `onKeyEvent` and `focusedChildChange` functions everywhere with their own logic, `node.setFocus(true)` scattered all over the place, and God forbid `node.setFocus(false)`, which means you REALLY have a problem.  **onRokuDev's** `focusable` trait unwinds this mess by taking over every

## View stack management

**onRokuDev** uses the very excellent [**sgRouter**](https://github.com/rokucommunity/sgRouter/tree/master) view manager, which handles your view stack, provides detailed internal router state data, has a plethora of view lifecycle hooks, and has very smart set of features such as route guards and checkpoints. Big-ups to [Tyler Smith](https://github.com/iObject) for this absolute time-saver.



## State confustion


## Animation boilerplate


## No stylesheets, theme sharing, or live updates


## Poor configuration file support


## Components with dubious customizability


## No back-end dev or video server



## Installation

### Prerequisites

Before getting started, make sure you have:

- Node.js and npm installed
- Visual Studio Code with the BrightScript extension installed
- A Roku device in developer mode on the same network as your computer

## Install dependencies

From the project directory, run:

```bash
npm install
```

## Configure the app

Copy the included environment template:

```bash
cp .env.example .env
```

Then open `.env` and update:

- `ROKU_IP` and `ROKU_PASS` with your Roku's developer-mode credentials
- `LOCAL_DEV_SERVER` and `LOCAL_SOCKET_SERVER` with your computer's local network address
- The user and API values for the environment you want to run

Do not use `localhost` for the local server addresses, because the Roku needs to connect to your computer over the network. The `.env` file is ignored by Git, so credentials and local settings remain on your machine.

## Launch the app

Start the local development services and leave them running:

```bash
npm run dev
```

Then, in Visual Studio Code:

1. Open **Run and Debug**.
2. Select **Deploy and Debug**.
3. Press **F5**.

The launch configuration builds the project, deploys it to the configured Roku, and starts the app. Use `Ctrl+C` in the terminal when you want to stop the local development services.

If deployment cannot connect, confirm that the Roku is in developer mode, `ROKU_IP` and `ROKU_PASS` are correct, and both devices are on the same network.

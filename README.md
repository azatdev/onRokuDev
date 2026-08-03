**onRokuDev** is an "in-progress" sample channel with framework ambitions, which hopes to show an example of how a fast, familiar, and failure-tolerant structure could be implemented in a roku application.  It does this through patterns which prefer composition over inheritance, prevent and catch exceptions, and provide the tools needed to easily create custom, modern, and performant UI elements.

- [Abstraction hell alternative](#over-abstraction)
- [Thwarting crashes and stability issues](#application-stability)
- [Flow management](#application-flow)
- [Focus management](#focus-handling-nightmare)
- [View stack management](#view-stack-management)
- [State consolidation](#state-confusion)
- [Easy animations](#animation-boilerplate)
- [Style support](#no-stylesheets-theme-sharing-or-live-updates)
- [Config support](#poor-configuration-file-support)
- [Full stack dev env](#no-back-end-dev-or-video-server)
- [Install](#installation)

The world of Roku Development makes it difficult for a programmer, who's new to the ecosystem, to know what to do, what not to do, and most importantly, how to do it. This results in applications which can quickly become unwieldy layers of abstraction lasagna with a side of spaghetti hell.  There are attempts out there which attempt bring some structure, but don't necessarily address all of the following problems:

## Over-abstraction

Roku does not allow creation of custom interfaces akin to `ifAssociativeArray` or `ifToStr` and usage of them in user-defined objects.  This forces the developer to either create shared function files, the structure and rules of which are nebulous, or rely on inheritance to share code between components, often leading to over-abstraction.  **onRokuDev** tackles that problem with psudo-interfaces organized as `traits`, which expose functions encapsulated to their responsibilities with the help from brighterscript's `classes`.

## Application stability

There are a lot of Roku apps out there with a crash rate well above 1%.  It's not easy to make sure that every callstack entrypoint function is protected.  There could be a rigid development ruleset with mandatory `try catch` blocks and typechecking everywhere, but that increases the cognitive load on the developer as well as creating mountains of boilerplate code which needs to be maintained.  **onRokuDev's** `safeable` trait provides several methods to alleviate this burden.

The `init` and `onKeyEvent` functions, functional and observed field's handler functions, `roRenderQueue` handler functions, and the Task's `functionName` function are the entrypoints that all have to be protected from a possible exception.

`safeable`'s `exec` function provides a single catch-all function that's used behind the scenes for all other tools. Functions passed into `exec` are expected to receive a single assocarray argument.

In any component, other than Task:

```brs
import "pkg:/components/_ord/init.bs"

' init is the only function that needs to explicitly be wrapped in the exec function.
' onKeyEvent is handled with exec through focusable.
sub init()
    exec(sub(_options = {})
        ' Functions replace functional fields
        safeFunctions({
            "getVariables": getVariables
        })
        ' Replaces observeFieldScoped and observeFieldScopedEx
        safeObserve("data", onDataSet)
    end sub)
end sub


function getVariables(options = {})
    fields = options.fields ?? []
    variables = {}

    for each field in fields
        variables[field] = m.content[field]
    end for

    return variables
end function


' Options assocarray {
'    data: event.getData(),
'    field: event.getField(),
'    info: event.getInfo(),
'    node: event.getRoSGNode(),
'    nodeId: event.getNode()
' }
sub onDataSet(options = {})
    m.content = options.data?.content
    setTitle({ data: m.content.title })
    ' Function also takes a node (default is m.top)
    ' And info fields
    safeObserve("title", setTitle, m.content, ["titleColor"])
end sub


sub setTitle(options = {})
    m.label.text = options.data
    m.label.color = options.info?.titleColor
end sub
```

In a second node:

```brs
function getModelVariables()
    ' Passing a string as a function expects that function name to exist in the target node's safeFunctions
    modelVariables = exec("getVariables", ["id", "type"], m.firstNode)
    return modelVariables
end function
```

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
        [events.BUTTON_TOGGLED]: onButtonToggled ' || [array of functions]
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

Under the hood, `dispatch`, `subscribe`, and `publish` use [roRenderThreadQueue](https://developer.roku.com/dev/docs/rorenderthreadqueue) which allows the transfer of assocarrays from Task thread nodes to Render thread nodes with no rendezvous penalty.  `dispatch` uses a separate, long-lived Task to `publish` events, with every handler function protected by `try catch` using `safeable#exec` function.

Using these methods, it's easy to create a coherent workflow that doesn't rely on bubbling of events or random observed or functional fields.  Each event name is unique, facilitating search, and in dev env, each event prints out in the console log making the app easy to follow and debug.

## Focus handling nightmare

Oh how easy is it to get into the weeds when it comes to focus handling in Roku development. `onKeyEvent` and `focusedChildChange` functions everywhere with their own logic, `node.hasFocus()` and `node.setFocus(true)` scattered all over the place, and God forbid `node.setFocus(false)`, which is pure chaos.  **onRokuDev's** `focusable` trait unwinds this mess by taking over the `onKeyEvent` and `focusedChildChange` in every component that imports `pkg:/components/_ord/init.bs` and utilizes `safable#exec` function to initialize the component.

```brs
import "pkg:/components/_ord/init.bs"

sub init()
    exec(sub(_options = {})
        m.sidebar = m.top.findNode("sidebar")
        m.header = m.top.findNode("header")
        m.container = m.top.findNode("container")
        setFocusMap({
            ' Fires only when focusedChild = m.top
            ' Accepts node, "nodeId", or function
            ' Functions should return invalid
            "onFocus": m.header,
            ' Fires only when focusedChild = invalid
            ' Same rules as "onFocus"
            "onUnfocus": sub(options = {})
                doStuff()
            end sub,
            ' "onKey map" fires when m.top.hasFocus() and a key is pressed
            ' Accepts a map of keys with nodes to focus, functions to run, or handled boolean
            ' Functions should return true or false the same way as in onKeyEvent to mark event as handled or allow it to bubble up.
            "onKey": {
                ' If any key not specified is pressed.
                "default": true,
                "left": m.sidebar
            },
            "header": {
                "default": true,
                ' Allow the left key to bubble up and open the sidebar
                "left": false,
                "down": scrollPage
            },
            ' If no default is specified, all keys other than ones specified will return false
            "container": {
                "left": navigateContainer,
                "right": navigateContainer,
                "up": scrollUp
            },
            "onKey": handleScrollKey
        })
    end sub)
end sub


' Key events will come with their key in options
function navigateContainer(options = {})
    key = options.key
    nextFocusNode = findFocusNode(key)
    ' Return false to bubble up event and potentially open the sidebar
    if nextFocusNode = invalid then return false
    ' nextFocusNode.setFocus(true), but use container node's focus map.
    setFocus(nextFocusNode, m.container)
    return true
end function


function scrollDown(options = {})
    ' Do stuff
    runAnimation(options.key)
    ' setFocus also saves the focused node in case the component is unfocused and then focused again
    setFocus(m.container)
    return true
end function


function scrollUp(options = {})
    runAnimation(options.key)
    setFocus(m.header)
    return true
end function
```

## View stack management

There are no native Roku tools to handle view navigation, lifecycle management, and view stack organization.  Developers often develop their own systems which require iterative refactors as requirements change and never end up feeling quite complete.  Thankfully, there is a fantastic solution!  **onRokuDev** uses the very excellent [**sgRouter**](https://github.com/rokucommunity/sgRouter/tree/master) view manager, which handles your view stack, provides detailed internal router state change data, has a plethora of view lifecycle hooks, and has a very smart set of features such as route guards and checkpoints. Big-ups to [Tyler Smith](https://github.com/iObject) for this absolute time-saver.



## State confusion

How to store local state data?  Create `m.top` fields for everything?  This gets messy, ugly, and slow with the additional cost of accessing `m.top`.  Do you store thing in `m.` fields?  Before you know it the codebase is littered with `m.isActive` and various other various `m.` fields that, to dismay of everyone, seem to hold the structure of your logic.  What if there is one `m.state` object and everything goes there?  Hmm, but then, what if you want that data to be accessed from an external node?  `m.state` for private and `m.top` for public, which leads to the philosophical battle of "outside of tooling why private at all?"  Embrace the Roku "public everything" ways!  **onRokuDev's** `stateable` opens up the doors to a fun, but measured and responsible, public policy.

In any component outside of a Task:
```brs
import "pkg:/components/_ord/init.bs"

sub init()
    exec(sub(_options = {})
        ' By convention, m. fields are only for nodes.
        m.video = m.top.findNode("video")

        set({
            "catalogUIHidden": false,
            "videoActive": false
        })
        someFunction()
    end sub)
end sub


sub someFunction()
    if get("contentUIHidden") then return
    ' Set it and forget it! 🍗
    set({ "videoActive": true })
end sub
```

Then from any other non-Task node:

```brs
sub externalNodeFunction()
    if get("videoActive", m.videoPlayer) then return
    showModal()
end sub
```

`stateable` works by setting a single assocarray `m.top` field and using `setRef` and `getRef` to access data with absolute minimal performance penalties.   This is in part why Tasks are not supported, since those methods are not supported in a Task, but also because life is easier when Tasks are nothing but stateless workers.


## Animation boilerplate

Where do you put them?  XML?  Instantiate them in the script file?  Oh the bloat.  So many functions and nodes that need to be created and configured.  What if some animations are somewhat similar?  Do you then create a folder of animations with some runtime configuration options? It all such a schlep and it feels like a lot of developers try to avoid working with animations as a result.  **onRokuDev** completely transforms that relationship with `animatable` trait's `morph` function.  Supply it a simple config object and it will create all the animation nodes and the appropriate interpolators on its own automatically.


```brs
import "pkg:/components/_ord/init.bs"

sub init()
    exec(sub(_options = {})
        m.videoPlayer = m.top.findNode("videoPlayer")
        m.screenContainer = m.top.findNode("screenContainer")
    end sub)
end sub


sub simpleMorph()
    ' Will animate from m.screenContainer's current translation to the one specified
    morph({
        "screenContainer": {
            "fields": {
                translation: [0, 330]
            }
        }
    })
end sub


sub comboMorph()
    morph({
        "screenContainer": {
            "fields": {
                opacity: 0
            }
        },
        "videoPlayer": {
            "fields" {
                "height": 1080,
                "width": 1920,
                "translation": [0, 0]
            }
        }
    })
end sub


sub shorthandMorphs()
    ' Using animatable's other helpers.
    fadeOut(m.videoPlayer, { duration: 0.3 })
    ' With a callback and callback options
    fadeIn(m.screenContainer, { duration: 0.5, callback: onContainerFadeIn, callbackOptions: { data: getSomeData() } })
end sub


sub onContainerFadeIn(options = {})
    afterContainerFadeIn(options)
end sub


sub deferredMorph()
    deferredAnimation = morph({
        "videoPlayer": {
            "fields: {
                "opacity": 1
            }
        }
    }, { deferred: true })

    ' animatable helper function
    floatFieldInterp = getFloatFieldInterpolator(deferredAnimation)

    safeObserve("fraction", onAnimationFraction, floatFieldInterp)

    runAnimation(deferredAnimation)
end sub


sub onAnimationFraction(options = {})
    ?"Animation percentage: " options.data
end sub


' Morph objects can be stored as part of the styles
sub comboMorph()
    morph("<%- o(STYLES.ViewItem.fadeMorph) %>")
end sub
```

' Then in a style file:

```js
const mixins = require("../mixins");
const viewport = dimensions["viewport"]

module.exports = {
    "ViewItem": {
        "fadeMorph": {
            "screenContainer": {
                "fields": {
                    opacity: 0
                }
            },
            "videoPlayer": {
                "fields" {
                    "height": viewport.height,
                    "width": viewport.width,
                    "translation": [0, 0]
                }
            }
        }
    }
};
```

## No stylesheets, theme sharing, or live updates

It's difficult to overstate how annoying this is.  Some fields populated in XML, other fields strewn all over in BRS, having to edit multiple files to keep things consistent, the bugs, time spent constantly reloading the application, it's all so very tedious.  **onRokuDev** puts an end to this tom foolery with the `styleable` trait.

The idea is simple.  What if you had a JSON style config file for each unique component that initiates onRokuDev (and its children)?  What if these config files had the ability to import other files like color palette, dimensions, assets paths, and share them across one another?  And what if there was a task which compiles and concatenates them in a single JSON object that is then injected in the project through a precompile build step using EJS?  Well, that's exactly that **onRokuDev** does with its build tools.

A typical style file might look something like this: [ToastItem.js](https://github.com/azatdev/onRokuDev/blob/main/app/styles/layout/ToastItem.js).  When a `ToastItem` component initializes, it automatically applies the styles object to itself and its children.  The children are looked up by their `node.subType()` name and differentiated with either an `id` or a `class` field.  The class fields are used with `animatable`'s `addClass` and `removeClass` to change nodes' visual fields.  By nature of children being rendered first, a hierarchical structure of styles can be created to differentiate the visual styles of the same component being parented in different nodes.  It's nowhere near as powerful as CSS or its precompilers, but it's so much better than nothing!

To add a cherry on top, the build tools listen to file changes in style files and automatically send them to the Roku device with the help of `ord_socketTask` and apply them to the target node or its children.  It doesn't eliminate the need to reload the app on XML or script changes, however, but again, better than nothing.


## Poor configuration file support

It's the same issue as with styles.  I have a preference for components that are driven by homogenous content data, alongside a configuration object which changes how the component behaves, how it looks, and what does with the content data.  Naturally, lots of these configuration objects start to accrue.  Also, what if I wanted my `.env` configuration in there for development purposes or graphql queries?  And I don't want them scattered all over the BRS files, obfuscating the actual logic code with their mere presence?  Well, **onRokuDev's** `configable` trait has it covered

Just like `styleable`'s build scripts, it will watch and compile all configuration files in the `configs` folder and with`ord_socketTask` let the device know to download new config.  The configuration objects can then be appended to assocarray fields on a node and observed for changes, if need be.

```brs
sub init()
    ' Loads the configuration object into the config field of m.scrollGroup
    liveConfig({ field: "config", keyPath: "ScrollGroup" }, m.scrollGroup)
    ' Waits for updates to the config object
    safeObserve("config", onScrollGroupConfigChange, m.scrollGroup)
end sub


sub onScrollGroupConfigChange(options = {})
    newConfig = options.data
    processConfig(newConfig)
end sub
```

## Components with dubious customizability

Roku has a ton of built-in components that, frankly, look and behave like crap.  Trying to customize these components with a professional standard of being pixel-perfect to the designs is often impossible outside of building a fully custom component.  **onRokuDev** facilitates creation of custom components with traits like `positionable` alongside 2 powerful components that meet the vast majority of needs when building out a custom UI.

`ord_flexList` is the ultimate tool for building out list components.  Carousels, menus, buttons, toasters, forms, etc, can be easily built and customized with very little effort.  The secret is Roku's only cool native component `TargetGroup` and having a process which programatically generates the `TargetSet`s and their `targetRects` from a configuration file such as:

```js
module.exports = {
    "PortraitCarousel": {
        animationDuration: 0.3,
        clip: true,
        defaultVisibleIndex: 0,
        focusType: "fixed",
        itemComponentName: "CarouselItem",
        visibleTiles: 7,
        wrap: true,
        wrapFirstToLast: false,
        bigSquare: [242, 363],
        gutterSize: [153, 0],
        smallSquare: [210, 315],
        squareMargins: [9, 0]
    }
};
```

This generates something like this:


While a config such as:

```js
module.exports = {
    "CTACarousel": {
        carouselType: "dynamicSize",
        clip: false,
        focusType: "floating",
        horizAlign: "center",
        itemComponentName: "ButtonItem",
        maxWidth: 1500,
        squareMargins: [0, 16, 0, 0],
        useUnfocusedTargetSet: true
    }
};
```

Will generate something like:


A lot of the nitty-gritty logic happens in the itemComponent in regards to how it looks, how it acts when it's focused, the group is focused, etc, but realistically, it's about 100 lines of code for a standard itemComponent and maybe 200 lines of code for fancy itemComponent with dynamic sizing and multiple animation sequences.  [SidebarItem.bs](https://github.com/azatdev/onRokuDev/blob/main/app/components/views/SidebarItem/SidebarItem.bs) is as complicated as it gets in this project with only ~170 lines.

The flexibility of `flexList` is unparallelled and documentation for it is under way.

`ord_scrollGroup` is another component in **onRokuDev's** toolkit that fills a certain void.  If you want a scrolling hero, fade in and out slideshows/elements, scrollable regions with scrollbars, triggered by either key press or an automatic timer, give `ord_scrollGroup` a go.

There is also the `positionable` trait which helps dealing with elements inside a group.  It has helpers like `getVisibleHeight`, `getVisibleWidth`, `centerComponent`, and `stackChildren` (`LayoutGroup` be damned!).  This trait can and will be expanded to fulfill many other usecases.

## No back-end dev or video server

The Roku development ecosystem doesn't make it easy for you to get fully up and running with a cutomizable channel of your own.  The usual story is that you download some code, maybe you even find a "framework" of some sort, now what?  You have no data, no cms, no server api, no video server. You wouldn't believe it, but **onRokuDev** has that covered too.

By default, the app will use URLs to a hosted instance of the cms, see `.env.example` for details.  Very soon, a forked version of [strapi cms](https://github.com/strapi) will be made available.  It is lightly modified and has support for a local video server, as well as a simple download script to pull some public domain content into a folder that the video server will access.  [nginx-vod-live-hls](https://github.com/gdomod/nginx-vod-live-hls) is used for the video server.

**onRokuDev** also uses the following open source software from `rokucommunity`:

- [BrightScript Language](https://marketplace.visualstudio.com/items?itemName=RokuCommunity.brightscript) extension for VSCode.
- [BrighterScript](https://github.com/rokucommunity/brighterscript) superset language and compiler.
- [Rodash](https://github.com/TKSS-Software/rodash) utility library.
- [roku-requests](https://github.com/rokucommunity/roku-requests) package.
- [promises](https://github.com/rokucommunity/promises) for use with the aforementioned [**sgRouter**](https://github.com/rokucommunity/sgRouter/tree/master) view manager.
- [bslint](https://github.com/rokucommunity/bslint) linter for brs.

Thank you all for your hard work!

There is still lots to do on this project and its progress will be on-going.  Having said that, it's ready for its core concepts to be scrutinzed and critiqued.  So please, if you have the time or the need, please check it out!

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

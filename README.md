# onRokuDev
<img width="1920" height="603" alt="ord-banner" src="https://github.com/user-attachments/assets/319baaca-71da-4172-8115-90cc057b411f" />

### 3930RW - Popular Mainstream Device

https://github.com/user-attachments/assets/3bce5c44-628c-4749-95ec-1ea45dad4e79

**onRokuDev** is a work-in-progress sample channel with framework ambitions. It demonstrates how a fast, familiar, and failure-tolerant structure could be implemented in a Roku application. It uses patterns that favor composition over inheritance, prevent and catch exceptions, and provide the tools needed to easily create custom, modern, and performant UI elements.

- [Abstraction hell alternative](#over-abstraction)
- [Thwarting crashes and stability issues](#application-stability)
- [Flow management](#application-flow)
- [Focus management](#focus-handling-nightmare)
- [View stack management](#view-stack-management)
- [State consolidation](#state-confusion)
- [Easy animations](#animation-boilerplate)
- [Style support](#no-stylesheets-theme-sharing-or-live-updates)
- [Config support](#poor-configuration-file-support)
- [Full-stack development environment](#no-back-end-dev-or-video-server)
- [Video Demos](#video-examples)
- [Install](#installation)

The world of Roku development makes it difficult for a programmer who is new to the ecosystem to know what to do, what not to do, and, most importantly, how to do it. This can result in applications that quickly become unwieldy layers of abstraction lasagna with a side of spaghetti hell. Other projects try to bring structure to Roku development, but they do not necessarily address all of the following problems:

## Over-abstraction

Roku does not allow developers to create custom interfaces akin to `ifAssociativeArray` or `ifToStr` and use them in user-defined objects. This forces developers either to create shared function files, whose structure and rules are nebulous, or to rely on inheritance to share code between components, often leading to over-abstraction. **onRokuDev** tackles that problem with pseudo-interfaces organized as `traits`. With help from BrighterScript classes, these traits expose functions scoped to specific responsibilities.

## Application stability

There are many Roku apps with crash rates well above 1%. It is not easy to ensure that every call-stack entry point is protected. A rigid development ruleset could require `try/catch` blocks and type checking everywhere, but that would increase the developer's cognitive load and create mountains of boilerplate code that must be maintained. **onRokuDev's** `safeable` trait provides several methods to alleviate this burden.

The `init` and `onKeyEvent` functions, handlers for functional and observed fields, `roRenderThreadQueue` handlers, and a Task's `functionName` entry point must all be protected from possible exceptions.

`safeable`'s `exec` function provides a single catch-all used behind the scenes by all other tools. In production, it executes every function inside a `try/catch` block; in development, it runs the function directly to support debugging. Functions passed to `exec` are expected to receive a single assocarray argument.

In any component other than a Task:

```brs
import "pkg:/components/_ord/init.bs"

' init is the only function that must be explicitly wrapped in exec.
' onKeyEvent is handled by exec through focusable.
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
    ' The function also takes a node (the default is m.top) and info fields.
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
    modelVariables = exec("getVariables", { fields: ["id", "type"]}, m.firstNode)
    return modelVariables
end function
```

For cross-node `safeFunctions` calls to work, add a single functional field to the target component's XML:

```xml
<function name="safeFunc" />
```

## Application flow

Programmers often start out feeling confident about their architecture until they encounter requirements to track every user action, resulting in a cascade of procedures that call various analytics, tracking, and back-end services. **onRokuDev** solves this problem with the `eventable` trait.

Dispatch an event from any view or controller:

```brs
sub onButtonSelected()
    dispatch(events.TOGGLE_BUTTON, { content: m.content })
end sub
```

Subscribe to an event in any number of controllers:

```brs
import "pkg:/components/_ord/init.bs"

sub init()
    exec(sub(_options = {})
        subscribe({
            [events.BUTTON_TOGGLED]: onButtonToggled,
            [events.TOGGLE_BUTTON]: toggleButton
        })
    end sub)
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
end function
```

Under the hood, `dispatch`, `subscribe`, and `publish` use [roRenderThreadQueue](https://developer.roku.com/dev/docs/rorenderthreadqueue), which allows assocarrays to be transferred from Task-thread nodes to render-thread nodes without a rendezvous penalty. `dispatch` uses a separate, long-lived Task to `publish` events, with every handler function protected by `try/catch` through the `safeable#exec` function.

These methods make it easy to create a coherent workflow that does not rely on event bubbling or arbitrary observed or functional fields. Unique event names make searches easier, and, in the development environment, each event is printed to the console, making the app easy to follow and debug.

## Focus handling nightmare

Oh, how easy it is to get into the weeds when handling focus in Roku development. `onKeyEvent` and `focusedChildChange` functions appear everywhere with their own logic, `node.hasFocus()` and `node.setFocus(true)` are scattered throughout the code, and God forbid `node.setFocus(false)`, which is pure chaos. **onRokuDev's** `focusable` trait unwinds this mess by taking over `onKeyEvent` and `focusedChildChange` in every component that imports `pkg:/components/_ord/init.bs` and uses `safeable#exec` to initialize the component.

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
            ' Accepts a map of keys with nodes to focus, functions to run, or a handled Boolean
            ' Functions should return true or false the same way as in onKeyEvent to mark event as handled or allow it to bubble up.
            "onKey": {
                ' If any key not specified is pressed.
                "default": true,
                "left": m.sidebar
            },
            ' Node ID-specific onKey events.
            "header": {
                "default": true,
                ' Allow the left key to bubble up and open the sidebar
                "left": false,
                "down": scrollDown
            },
            ' If no default is specified, all keys other than those specified will return false
            "container": {
                "left": navigateContainer,
                "right": navigateContainer,
                "up": scrollUp
            }
        })
    end sub)
end sub


' Key events include their key in options.
function navigateContainer(options = {})
    key = options.key
    nextFocusNode = findFocusNode(key)
    ' Return false to bubble up the event and potentially open the sidebar.
    if nextFocusNode = invalid then return false
    ' nextFocusNode.setFocus(true), but use container node's focus map.
    setFocus(nextFocusNode, m.container)
    return true
end function


function scrollDown(options = {})
    ' Do stuff
    runAnimation(options.key)
    ' setFocus also saves the focused node in case the component is unfocused and then refocused.
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

There are no native Roku tools for view navigation, lifecycle management, and view-stack organization. Developers often build their own systems, which require iterative refactoring as requirements change and never feel quite complete. Thankfully, there is a fantastic solution! **onRokuDev** uses the excellent [**sgRouter**](https://github.com/rokucommunity/sgRouter/tree/master) view manager, which handles the view stack, provides detailed internal router-state data, offers a plethora of view-lifecycle hooks, and includes smart features such as route guards and checkpoints. Big ups to [Tyler Smith](https://github.com/iObject) for this absolute time-saver.

## State confusion

How should local state data be stored? Should you create `m.top` fields for everything? That gets messy, ugly, and slow because of the additional cost of copying fields in and out of `m.top`. Should you store things in `m.` fields? Before long, the codebase is littered with `m.isActive` and various other `m.` fields that, to everyone's dismay, seem to define the structure of the logic. What if there were one `m.state` object and everything went there? Hmm, but what if that data must be accessed from an external node? Using `m.state` for private data and `m.top` for public data leads to the philosophical question, "Outside of tooling, why make anything private at all?" Embrace Roku's "public everything" ways! **onRokuDev's** `stateable` opens the door to a fun but measured and responsible public policy.

In any component other than a Task:

```brs
import "pkg:/components/_ord/init.bs"

sub init()
    exec(sub(_options = {})
        ' By convention, m. fields are only for nodes.
        m.video = m.top.findNode("video")

        set({
            "contentUIHidden": false,
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

`stateable` works by setting a single assocarray field on `m.top` and using `setRef` and `getRef` to access data with minimal performance penalties. This is partly why Tasks are not supported: those methods are unavailable in a Task, and life is easier when Tasks are nothing but stateless workers.


## Animation boilerplate

Where do you put animations? In XML? Do you instantiate them in the script file? Oh, the bloat. So many functions and nodes must be created and configured. What if some animations are similar? Do you create a folder of animations with runtime configuration options? It is all such a schlep, and many developers seem to avoid working with animations as a result. **onRokuDev** completely transforms that relationship with the `animatable` trait's `morph` function. Supply it with a simple configuration object, and it automatically creates all the animation nodes and appropriate interpolators.


```brs
import "pkg:/components/_ord/init.bs"

sub init()
    exec(sub(_options = {})
        m.videoPlayer = m.top.findNode("videoPlayer")
        m.screenContainer = m.top.findNode("screenContainer")
    end sub)
end sub


sub simpleMorph()
    ' Animates from m.screenContainer's current translation to the specified translation.
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
                "opacity": 0
            }
        },
        "videoPlayer": {
            "fields": {
                "height": 1080,
                "width": 1920,
                "translation": [0, 0]
            }
        }
    })
end sub


sub shorthandMorphs()
    ' Use animatable's other helpers.
    fadeOut(m.videoPlayer, { duration: 0.3 })
    ' Use a callback and callback options.
    fadeIn(m.screenContainer, { duration: 0.5, callback: onContainerFadeIn, callbackOptions: { data: getSomeData() } })
end sub


sub onContainerFadeIn(options = {})
    afterContainerFadeIn(options)
end sub


sub deferredMorph()
    deferredAnimation = morph({
        "videoPlayer": {
            "fields": {
                "opacity": 1
            }
        }
    }, { deferred: true })

    ' animatable helper function.
    floatFieldInterp = getFloatFieldInterpolator(deferredAnimation)

    safeObserve("fraction", onAnimationFraction, floatFieldInterp)

    runAnimation(deferredAnimation)
end sub


sub onAnimationFraction(options = {})
    ?"Animation percentage: " options.data
end sub


' Morph objects can be stored as part of the styles
sub comboMorph()
    morph("{{%- o(STYLES.ViewItem.fadeMorph) %}}")
end sub
```

Then in a style file:

```js
const mixins = require("../mixins");
const dimensions = mixins["Dimensions"];
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
                "fields": {
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

It is difficult to overstate how annoying this is. Some fields are populated in XML, while others are strewn throughout BRS files. Editing multiple files to keep everything consistent, dealing with the resulting bugs, and constantly reloading the application are all incredibly tedious. **onRokuDev** puts an end to this tomfoolery with the `styleable` trait.

The idea is simple. What if you had a JavaScript style configuration file for each unique component that initializes the onRokuDev traits, as well as for its children? What if these configuration files could import and share other files, such as a color palette, dimensions, and asset paths? And what if a build script could compile and concatenate them into a single JSON object that could then be injected into the project through a precompile step using EJS? Well, that is exactly what **onRokuDev** does with its build tools.

A typical style file might look like [ToastItem.js](app/styles/layout/ToastItem.js). When a `ToastItem` component initializes, it automatically applies the style object to itself and its children. Children are identified by their `node.subType()` names and differentiated by either an `id` or a `class` field. The class fields work with `styleable`'s `addClass` and `removeClass` functions to change nodes' visual fields. Because children are rendered first, styles can use a hierarchical structure to give the same component different visual styles under different parent nodes. It is nowhere near as powerful as CSS or its preprocessors, but it is so much better than nothing!

To add a cherry on top, the build tools listen for changes to style files, automatically send those changes to the Roku device with the help of `ord_socketTask`, and apply them to the target node or its children. This does not eliminate the need to reload the app after XML or script changes, but, again, it is better than nothing.

## Poor configuration file support

It is the same issue as with styles. I prefer components driven by homogeneous content data alongside a configuration object that changes how the component behaves, how it looks, and what it does with the content data. Naturally, these configuration objects start to accumulate. What if I also want to include my `.env` configuration for development or my GraphQL queries without scattering them throughout the BRS files and obscuring the actual application logic? **onRokuDev's** `configable` trait has it covered.

Like `styleable`'s build scripts, it watches and compiles all configuration files in the `configs` folder, then uses `ord_socketTask` to tell the device to download the new configuration. The configuration objects can then be assigned to assocarray fields on a node and observed for changes if necessary.

```brs
sub init()
    ' Loads the configuration object into m.scrollGroup's config field.
    liveConfig({ field: "config", keyPath: "ScrollGroup" }, m.scrollGroup)
    ' Waits for updates to the configuration object.
    safeObserve("config", onScrollGroupConfigChange, m.scrollGroup)
end sub


sub onScrollGroupConfigChange(options = {})
    newConfig = options.data
    processConfig(newConfig)
end sub
```

## Components with dubious customizability

Roku has a ton of built-in components that, frankly, look and behave like crap. Customizing these components to a pixel-perfect professional standard is often impossible without building a fully custom component. **onRokuDev** facilitates the creation of custom components with traits like `positionable`, alongside two powerful components that meet the vast majority of needs when building a custom UI.

`ord_flexList` is the ultimate tool for building list components. Carousels, menus, buttons, toasters, forms, and more can be easily built and customized with very little effort. The secret is Roku's only cool native component, `TargetGroup`, and a process that programmatically generates the `TargetSet`s and their `targetRects` from a configuration file such as this:

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

https://github.com/user-attachments/assets/2f2f7318-4d21-431f-bc28-2865d3c1a20d

Another configuration looks like this:

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

It generates something like this:

https://github.com/user-attachments/assets/e1e1a018-8c64-4fed-90e5-a0f558533150



Much of the nitty-gritty logic lives in the `itemComponent` and controls how it looks and behaves when either the item or its group is focused. Realistically, a standard `itemComponent` requires about 100 lines of code, while a fancy one with dynamic sizing and multiple animation sequences may require about 200. [SidebarItem.bs](app/components/views/SidebarItem/SidebarItem.bs) is as complicated as it gets in this project, at only about 170 lines.

The flexibility of `ord_flexList` is unparalleled, and its documentation is underway.

`ord_scrollGroup` is another component in **onRokuDev's** toolkit that fills a certain void. If you want a scrolling hero, slideshows or elements that fade in and out, or scrollable regions with scrollbars triggered by either a key press or an automatic timer, give `ord_scrollGroup` a go.

There is also the `positionable` trait, which helps manage elements inside a group. It provides helpers such as `getVisibleHeight`, `getVisibleWidth`, `centerComponent`, and `stackChildren` (`LayoutGroup` be damned!). This trait can and will be expanded to fulfill many other use cases.

## No back-end dev or video server

The Roku development ecosystem does not make it easy to get a customizable channel of your own fully up and running. The usual story is that you download some code and maybe even find a "framework" of some sort, but now what? You have no data, CMS, API server, or video server. You would not believe it, but **onRokuDev** has that covered too.

By default, the app uses URLs for a hosted CMS instance; see `.env.example` for details. To install the CMS and video server locally, please check out the companion repository [onRokuDev CMS](https://github.com/azatdev/onRokuDev-cms). The setup is very easy!


**onRokuDev** also uses the following open-source software from the Roku developer community:

- The [BrightScript Language](https://marketplace.visualstudio.com/items?itemName=RokuCommunity.brightscript) extension for VS Code.
- [BrighterScript](https://github.com/rokucommunity/brighterscript), a superset of BrightScript and its compiler.
- [Rodash](https://github.com/TKSS-Software/rodash), a utility library.
- The [roku-requests](https://github.com/rokucommunity/roku-requests) package.
- [promises](https://github.com/rokucommunity/promises), used with the aforementioned [**sgRouter**](https://github.com/rokucommunity/sgRouter/tree/master) view manager.
- [bslint](https://github.com/rokucommunity/bslint), a linter for BrightScript.

Thank you all for your hard work!

There is still much to do on this project, and development is ongoing. That said, its core concepts are ready to be scrutinized and critiqued. If you have the time or the need, please check it out!

## Video Examples

### 4660X - Typical High-End Device
https://github.com/user-attachments/assets/99d50015-3b6e-44f8-a764-19fcf058303f

### 3700X - Lowest Supported Device
https://github.com/user-attachments/assets/1e13e46f-12d8-45e5-8feb-96c5e37766ec

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

- `ROKU_IP` and `ROKU_PASS` with your Roku device's developer-mode credentials
- `LOCAL_DEV_SERVER` and `LOCAL_SOCKET_SERVER` with your computer's local network address

If you plan on using a local CMS instance, uncomment the "Local api info" keys, and comment out the "Hosted api info"/

Please see [onRokuDev CMS](https://github.com/azatdev/onRokuDev-cms) documentation for the `SERVER_API_TOKEN` value.

## Launch the app

Open VSCode and "Deploy and Debug"

Start the local development services and leave them running:

```bash
npm run dev
```


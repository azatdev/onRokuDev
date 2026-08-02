onRokuDev is an "in-progress" sample channel which hopes to show an example of how a fast, familiar, and failure-tolerant structure could be implemented in a roku application.  It does this through patterns which prefer composition over inheritance, prevent and catch exceptions, and provide the tools to easily create modern and performant UI elements.


The world of roku makes it difficult for a programmer, who's new to the ecosystem, to know what to do, what not to do, and most importantly, how to do it. This results in applications which can quickly become unwieldly layers of abstraction lasagna with a side of spaghetti hell.  There are attempts out there which attempt bring some structure, but don't necessarily address all of the following problems:

## Over-abstraction

Roku does not allow creation of custom interfaces akin to `ifAssociativeArray` or `ifToStr` and usage of them in user-defined objects.  This forces the developer to either create shared function files, the structure and rules of which are nebulous, or rely on inheritance to share code between components, often leading to over-abstraction.  onRokuDev tackles that problem with psudo-interfaces organized as `traits`, which expose functions encapsulated to their responsibilities with the help from brighterscript's `classes`.

## Application flow

Programmers can often start out feeling confident about their architecture until they encounter requirements demanding the tracking of every single user action that result in a cascade of procedures making calls to various analytics, tracking, and back-end services.  onRokuDev solves this problem with a trait `eventable`.

Send an event from a view:
```brs
sub onCTASelected()
    dispatch(events.TOGGLE_WATCHLIST, { content: m.content })
end sub
```

Listen to events in any number of controllers:

```brs
sub init()
    exec(sub(_options = {})
        subscribe({
            [events.TOGGLE_WATCHLIST]: toggleWatchlist
        })
    end sub)
end sub


sub toggleWatchlist(options = {})
    
end sub
```



# Roku App

## Prerequisites

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

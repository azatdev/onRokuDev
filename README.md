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

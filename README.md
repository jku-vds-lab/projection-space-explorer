# Projection Path Explorer

This is the documentation for the demonstrator including the installation process.

## Installation

Use a git tool to clone this repository to your computer.

```bash
git clone https://github.com/JKU-ICG/projection-path-explorer
```

Then navigate to this folder in a terminal using

```bash
cd projection-path-explorer
```

and run the command to install the required packages

```bash
npm install
```

## Starting the application

To run the application simply navigate to the cloned folder and enter

```bash
npm run frontend
```

This will start a local webserver. You can then enter the URL that is displayed which
is most likely 'localhost:8080'

## Preselect a set using a link

You can share a link that automatically preselects a set when opened. For this the 'set' parameter can be one (1) neural (2) chess (3) rubik. So for instance the URL localhost:8080?set=neural will automatically open the application with the neural network data set.

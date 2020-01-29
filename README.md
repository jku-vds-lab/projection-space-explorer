# Projection Path Explorer

This is the documentation for the demonstrator including the installation process.

## Controls

- Use the **mouse** to **drag** around the visualization
- Pressing the **alt** key while dragging the mouse will select multiple states for an **aggregation**
- Use the **mouse wheel** to **zoom** in and out

## Data Format

This section describes how the .csv data has to be formatted in order to be readable by this application.

### File type

The file name is irrelevant, however the data needs to be formatted as **csv** file. The seperator used is the normal comma **,**.

### Columns

The minimal columns a file needs are

 - **x**: the x coordinates of the coordinates (floating point format)
 - **y**: the y coordinates of the coordinates (floating point format)
 - **line**: the unique identifier for one line (string format)
 - **algo**: the unique identifier for the algorithm/linegroup (string format)

An example file could looke like this

|x|y|line|algo|
|--|--|--|--|
|1|1|L0|A0
|-1|-1|L0|A0
|1|-1|L1|A0
|-1|1|L1|A0

which will be displayed like this

![Sample](https://github.com/JKU-ICG/projection-path-explorer/tree/develop/textures/minimalcsv.png)

Note that **L0** and **L1** are the same identifiers in each row corresponding to a line whereas **A0** is the algorithm identifier and determines the coloring of the lines (in this case, only 1 color is needed).


### Additional Columns
Additional columns might exist in the source file. If this is the case the tool will display meaningful options to change visualization properties in respect to these attributes.



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
npm start
```

This will start a local webserver. You can then enter the URL that is displayed which
is most likely 'localhost:8080'

## Preselect a set using a link

You can share a link that automatically preselects a set when opened. For this the 'set' parameter can be one (1) neural (2) chess (3) rubik. So for instance the URL localhost:8080?set=neural will automatically open the application with the neural network data set.

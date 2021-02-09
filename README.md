# Projection Space Explorer

This is the documentation for the demonstrator including the installation process.

## Controls

- On the bottom right there is a tool list which let you select one of the predefined tools (select, move, etc). Hovering over them will show you a description of what they do.
- Use the **mouse wheel** to **zoom** in and out

## Data Format

This section describes how the .csv data has to be formatted in order to be readable by this application.

### File type

The file name needs to end with **.csv** and the data needs to be formatted as a correct **csv** file including a header row. The seperator used is the normal comma **,** (instead of the **;** which is used sometimes). We use the .csv reader provided by **d3** in this application. (You can read exact specifications like how spaces in data fields are handled in their API).

### Columns

The minimal columns a file needs are

 - **x**: the x value of the coordinates (floating point format)
 - **y**: the y value of the coordinates (floating point format)


An example file could looke like this

|x|y|
|--|--|
|1|1|
|-1|-1|
|1|-1|
|-1|1|

which will be displayed like this

![Sample](https://github.com/JKU-ICG/projection-path-explorer/blob/develop/readme/minimalcsv.PNG)

### Other Predefined Columns

The columns **x** and **y** are necessary for the file to load, but there other columns which are **optional** and only help you to explore the data. This includes:
 - **line** an attribute that specifies a sequence along the data, this attribute can be numerical or categorical, but it has to be distinct for every line. The line index of the current line is inferred automatically by the order of the data points in the csv file.
 - **algo** the group this data point belongs to. This attribute can also be categorical or numerical.
 - If the attributes **line** and **algo** are omitted, the data is projected as points without lines.

### Additional Columns
Additional columns might exist in the source file. If this is the case the tool will display meaningful options to change visualization properties in respect to these attributes.

Possible visualization properties that can be changed are:

 - **color** (by categorical and sequential/diverging attributes)
 - **brightness** (by sequential/diverging attributes)
 - **transparency** (by sequential/diverging attributes)
 - **size** (by sequential/diverging attributes)

Currently there is a distinction between **categorical**, **sequential** and **diverging** attributes. The information is infered from the csv header and the value range.

An attribute is **categorical** if:
 - It has at most 8 different distinct values in its value range
 - It has at least 1 non-floating point number in its value range

An attribute is **sequential** if:
 - It has only floating point numbers in its value range
 - It has a **range annotation** in its header (see below)

An attribute is **diverging** if:
 - It has only floating point numbers in its value range or
 - It has a **range annotation** in its header (see below)

Range annotations are a way to set the value range of attributes directly in the csv header. For example lets say we have a header that looks like this:

**x,y,line,algo,metadata[0;10]**

Now **metadata** is an additional attribute with a range annotation that sets the value range to 0-10 and makes this attribute sequential. The value range is important for the correct mapping to the color scale (since the minimum and maximum values might not be the true value range).


## Meta Columns
Some columns can be set to provide additional metadata that can be displayed in the explorer.

### Changes Column

The column 'changes' can be supplied with text values that will be displayed with the line selection tool. It should annotate the change from the last state. For example a good value for 'changes' for the Rubik data would be the move that lead to this state (R, U...).

### Multiplicity Column

The column 'multiplicity' can be supplied to denote how often this state occurs in the dataset (with the exact same position). This is sometimes necessary if you want to project the data without any duplicates, but need it in the explorer to display the lines correctly (since only single edges are allowed). For example if the same state occurs in 3 lines, it would have a multiplicity of 3 in each row.

### Test Datasets

There are some test datasets available in this repository under **datasets/test** which are small examples of how the files should look like.



## Installation

Use a git tool to clone this repository to your computer.

```bash
git clone https://github.com/JKU-ICG/projection-space-explorer
```

Then navigate to this folder in a terminal using

```bash
cd projection-space-explorer
```

and run the command to install the required packages

```bash
npm install
```

## Building the application

There is always a valid build in the repository, but in case you want to make changes, you can use the local build server. Start it with the command

```
npm run webpack:dev
```

Whenever a file is changed while this server is running, it will automatically build a new version and deploy it in the /dist folder.

## Starting the application

To start the application you just need to start the index.html locally. The easiest way to this is by using the live server provided by either Atom or Visual Studio Code.

## Starting the backend

To start the backend you need to install python's "bottle" and "RDKit" frameworks. The requirements.txt contains a conda dump of the environment that I use for development. 
The server can be started with "python backend-chemvis.py". If you are using VSC live server, make sure that the "/backend/temp-files" folder is not watched, since there will be files stored temporarilly, which should not prompt the server to reload.

## Preselect a set using a link

You can share a link that automatically preselects a set when opened. For this the 'set' parameter can be one (1) neural (2) chess (3) rubik. So for instance the URL localhost:8080?set=neural will automatically open the application with the neural network data set.


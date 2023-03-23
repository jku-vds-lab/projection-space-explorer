# Projection Space Explorer

This is the documentation for the Projection Space Explorer.

## Controls

- On the bottom right there is a tool list which let you select one of the predefined tools (select, move, etc). Hovering over them will show you a description of what they do.
- Use the **mouse wheel** to **zoom** in and out
- Hold the **right mouse button** pressed while moving the mouse (**dragging**) on the context view to move the projection around
- **Right click** the **context** to open a context-agnostic menu (has different actions when pressing on a cluster for example)



## UI Components

This section describes the individual UI components of the main view.

### Center Contxt
Shows the current projection and allows the user to do selections, and show contextual menus and information by clicking the items shown.

### Left Menu Drawer
Shows different groups of actions that can be set.

### Top App Bar
Shows the Toolbar selection and the logo of the application.









## Data Format

This section describes how the .csv data has to be formatted in order to be readable by this application.

### File type

The file name needs to end with **.csv** and the data needs to be formatted as a correct **csv** file including a header row. The seperator used is the normal comma **,** (instead of the **;** which is used sometimes). We use the .csv reader provided by **d3** in this application. (You can read exact specifications like how spaces in data fields are handled in their API).

### Columns

The minimal columns a file needs are

 - **x**: the x value of the coordinates (floating point format)
 - **y**: the y value of the coordinates (floating point format)


An example file could look like this

|x|y|
|--|--|
|1|1|
|-1|-1|
|1|-1|
|-1|1|

which will be displayed like this

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

The column 'multiplicity' can be supplied to denote how often this state occurs in the dataset (with the exact same position). This is sometimes necessary if you want to project the data without any duplicates, but need it in the explorer to display the lines correctly (since only single edges are allowed). For example if the same state occurs in 3 lines, it would have a multiplicity of 3 in each row occurence.

### Toy Datasets

There are some toy datasets available in this repository under **datasets/toy** which are small examples of how the files should look like. They also provide a playground for testing different projection methods.



## Installation

Install NodeJS Version 16

### Install npm packages

Use a git tool to clone this repository to your computer.

```bash
git clone https://github.com/JKU-ICG/projection-path-explorer
```

Then navigate to this folder in a terminal using

```bash
cd projection-path-explorer
```

and run the command to install the required dependencies

```
npm i --legacy-peer-deps
```

### Build the application

There is always a valid build in the repository, but in case you want to make changes, you can use the local build server. Start it with the command

```
npm run build
```

### Using the library in an application

To use the library we provided a template as a starting point. Please visit the repo [projection-space-explorer-app](https://github.com/jku-vds-lab/projection-space-explorer-app) for more information.





## Credits

For the projection algorithms, we use the following libraries:

### t-SNE

https://github.com/karpathy/tsnejs

### UMAP

https://github.com/PAIR-code/umap-js

### ForceAtlas2

https://www.npmjs.com/package/graphology-layout-forceatlas2



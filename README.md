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

### Install npm packages

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

### Build the application

There is always a valid build in the repository, but in case you want to make changes, you can use the local build server. Start it with the command

```
npm run webpack:dev
```

Whenever a file is changed while this server is running, it will automatically build a new version and deploy it in the /dist folder.

### Starting the application

To start the application you just need to start the index.html locally. The easiest way to this is by using the live server provided by either Atom or Visual Studio Code.





## Credits

For the projection algorithms, we use the following libraries:

### t-SNE

https://github.com/karpathy/tsnejs

### UMAP

https://github.com/PAIR-code/umap-js

### ForceAtlas2

https://www.npmjs.com/package/graphology-layout-forceatlas2




# Documentation CIME
The ChemInformatics Model Explorer (short CIME) extension of the Projection Space Explorer allows users to interactively explore a fixed subspace of chemical compounds.
Users can apply a 2D projection to the provided data, and additionally show the high-dimensional data in a LineUp table.
Furthermore, users can select datapoints and show the 2D compound structures of all selected items, aligned to each other, in a side-view.
If provided in the data, users can change the representation in the side-view to show atom-level attributions in the 2D compound structure. 
This could be used for comparing neighbors for example to check if machine learning model explanations - generated for those datapoints - make sense.
Using the grouping tool allows for easier interaction with item neighborhoods.

Instructions for installing the application are provided at the end of this documentation.

## General/Controls
This section explains the general layout of the tool and the basic controls with which you can interact with the tool.

### View Components
- Left Menu Drawer (orange): Shows tabs that contain different groups of actions
- Center View (yellow): Shows the current projection and allows the user to interact with the low dimensional projection of the data items
- Table Component (blue): Can be dragged up from the bottom of the window to show a LineUp (https://lineup.js.org/) table of the high dimensional space of the data items

<img src="https://user-images.githubusercontent.com/45741696/112500382-9d5b3100-8d88-11eb-9b2e-8229ea1daf4c.png" width="700">

### Controls
The following describes a list of controls:
- hover over item: shows a detailed view of the item
- hover over group center: shows group label
- left-click on item: select this item
- left-click + shift on item: toggle the selection status (i.e. if the item is selected, it is removed from selection; if the item is not selected, it is added to the selection)
- left-click on group-center: select the whole group
- left-click + shift on group-center: add the group to the selection
- left-click + drag on group-center: draw a storytelling arrow to another group center
- left-click + drag: new selection of items
- left-click + shift + drag: toggles the selection (i.e. unselected points that are within the lasso are added to the selection and selected points that are within the lasso are deselected)
- right-click + drag: allows you to move the whole scatterplot
- mouse wheel: zoom in and out to get a more/less detailed view of the items in the scatterplot
- right-click on background or item: opens a context menu that allows to create a group from the selected points
- right-click on group center: opens group context menu that allows to delete a group or start the storytelling feature
## Dataset
When loading the website there is a default dataset loaded, which is called "test.sdf".
Additionally, users can load datasets that were already uploaded previously or they can upload their own custom dataset.
The list of uploaded files includes all SDF files that are available in the backend (from any user!) and can be deleted with the delete button next to the filename.
The list can also be manually refreshed with the refresh button next to "Uploaded Files" (this is only necessary if another user uploads a file during a simultaneous session and the current user needs this exact file).

If a user wants to upload a custom file they have to use the file format that is described in the “Data Format” subsection.

### Data Format
Data is handed to the system using a Structure-Data File (SDF) (https://en.wikipedia.org/wiki/Chemical_table_file#SDF) that contains a collection of chemical compounds and additional properties that can be customized.
New files are first uploaded to the python backend that runs with Bottle (https://bottlepy.org/docs/dev/) and then processed with the help of the RDKit framework (https://www.rdkit.org/).
For big files, the initial upload and preprocessing can take several minutes. If the files are already uploaded, it is much faster.

Properties can be compound-specific (i.e. for the whole datapoint) or atom-specific (i.e. one value for each atom in the compound). Details are described in the next subsections.

An example can be found in “backend/test.sdf”.

#### Compound Properties
These properties can be used for projection and can be shown in the LineUp table (like solubility, atom weight, or any other property that is important to the user). 
Properties without semantic meaning like fingerprints or the embedding space of a compound can be used for projection, but are not shown in the table to reduce unnecessary information and loading times. Such properties can be specified with the “fingerprint” modifier as described in the “Modifiers” subsection. 

Compound-specific properties can contain arbitrary values, however the naming should be consistent for all compounds (i.e. each property should be present for each compound).

There are special properties that are handled differently by the system:
- Including properties **x** and **y** tells the system to initialize the scatterplot according to these values.
- The property **groupLabel** specifies the group each compound belongs to. 
 
#### Atom Properties 
Atom-specific properties are recognized by the backend if the property starts with **atom.dprops**. Those properties are interpreted as attribution scores and shown on top of the compound structure with a heatmap and contour lines (see section “Details” for more information.

Atom properties must contain one value for each atom of the compound. They can be easily generated with RDKit: https://www.rdkit.org/docs/RDKit_Book.html#atom-properties-and-sdf-files. 

In the frontend there is an autocomplete user input that groups atom properties. Values for the autocomplete are extracted as follows (e.g. example property "atom.dprop.rep_0"):
- atom.dprop is dropped because it is just a modifier that is needed by the backend
- group name: substring that includes everything before the last underscore (e.g. "rep")
- value: substring after the last underscore (e.g. "0")

### Modifiers
Modifiers are used to group compound properties. This enables the system to provide features that enhance usability (e.g. when projecting the data users can choose, which properties should be used for the projection; with grouping, users are allowed to (de-)select entire groups, which is important if a group consists of hundreds of properties as in the case of fingerprints).
Some modifiers have special functions, which will be explained later in this section.

By default the system recognizes the following modifiers: "fingerprint", "rep", "pred", "predicted", "measured", "smiles".
When choosing a file a dialog window opens where users can specify custom modifiers in addition to the default set of modifiers.

To decorate a property with a modifier, the modifier has to be prepended to the property name and separated by an underscore (e.g. “fingerprint_1”, “fingerprint_2” etc).

The predefined **smiles** modifier has a special function: if a property is decorated with "smiles_*" the system will recognize the property as a SMILES string and thus show the compound structure in the LineUp table.

If there is no **fingerprint** modifier in the properties of a dataset, the system will create them automatically using the built-in RDKit function: https://rdkit.readthedocs.io/en/latest/GettingStartedInPython.html#morgan-fingerprints-circular-fingerprints. 


## Project
When the data is loaded the x and y properties are used as initial positions for the scatterplot. If x and y are not specified they will be randomly initialized. 
The values for x and y can then be calculated with a projection method. 

Currently, only UMAP projection is available for CIME. To implement the projection we used this library: https://github.com/PAIR-code/umap-js. 
The JavaScript library code is a reimplementation of this python library https://github.com/lmcinnes/umap, with the difference that the JS library uses random seed points as initialization by default. 

<img src="https://user-images.githubusercontent.com/45741696/112500515-be238680-8d88-11eb-82a0-be61b1f77697.png" width="300">

### Parameters (orange)
Before calculating the projection, users can choose the features which should be used for the projection. This can be done by selecting and deselecting the corresponding checkboxes. To select or deselect whole semantic groups of features, users can interact with the checkboxes next to the group name. Clicking on a group-row collapses/expands the list of items in this group.

Users are also able to choose, if a numerical feature should be normalized, which applies standardization to all values of this feature (i.e. subtract by mean and divide by standard deviation). 

The range value indicates the minimum and maximum values of the feature.

Furthermore, users can adjust hyperparameters used for the projection. Noteworthy here is the checkbox **Seed Position**, which tells the system to initialize the projection with the current positions of the items instead of using a random initialization.

Parameters that can not be defined by the user are set to the defaults suggested in https://umap-learn.readthedocs.io/en/latest/api.html. 

### Progress (yellow)
The “Project” tab panel includes a view that shows the progress of a projection as soon as the projection starts to calculate. Here, the calculations can be paused and continued. 

### Settings (blue)
If there are item groups specified, the movement (trail) of the group centers during the projection can be visualized by enabling the **Show Group Trail** toggle.

Users also have the possibility to save current projections and change between the projection states of those savepoints.



## Encoding
In the "Encoding" tab panel users can change the marks and channels of the displayed data.
- shape by: select a categorical attribute and encode each value as a different mark 
- brightness by: select a numerical attribute and scale the brightness (opacity) of each point by that value; the upper and lower limit of the brightness can be adjusted with the scale below; if nothing is selected, the slider can be adjusted to set the general brightness value of all points
- size by: select a numerical attribute and scale the size of each point by that value; the upper and lower limit of the size can be adjusted with the scale below; if nothing is selected, the slider can be adjusted to set the general size value of all points
- color by: select a categorical or numerical attribute that defines the color of the points; the colormap can be chosen below and depends on whether the attribute is numerical or categorical
- advanced coloring: if you color by a categorical attribute, this allows you to hide/show items with certain values



## Groups
In the "Groups" tab panel users can adjust group settings, automatically define groups by clustering and select different stories.

<img src="https://user-images.githubusercontent.com/45741696/112500597-d09dc000-8d88-11eb-85a0-56bd378dd801.png" width="300">

### Group Settings (orange)
One toggle allows users to show or hide items in the scatterplot. The other one allows users to show or hide group centers (grey diamonds).

Users can choose, how the items of a selected group should look like. If a user clicks on a group center (grey diamond), all items belonging to that group are highlighted. If **Contour Plot** is selected, the items belonging to that group are surrounded by contour lines. If **Star Visualization** is selected, there are lines drawn from the group center to each item. If **None** is selected, the points belonging to the group are just highlighted.

<img src="https://user-images.githubusercontent.com/45741696/112500760-f3c86f80-8d88-11eb-90fc-c2cd2b9301ca.gif" width="300">

### Define Groups by Clustering (yellow)
Automatic Clustering of the projected features can be done in this panel. The algorithm used for clustering is HDBSCAN (https://hdbscan.readthedocs.io/en/latest/index.html). 
Parameters can be changed either by adjusting the slider (few clusters...many clusters), or by enabling the **Advanced**-Mode. Chosen parameters are always synchronized with the values in the advanced user inputs. Any other possible parameters that could be used for HDBSCAN are set to the default parameters that can be retrieved from the HDBSCAN docs.

<img src="https://user-images.githubusercontent.com/45741696/112500865-0b075d00-8d89-11eb-8484-fc1a5a148221.png" width="400">

### Groups and Stories (blue)
A storybook is a set of groups and possible connections between those groups that were either created automatically or manually composed. This way, users can view different groupings by just switching between stories.

A new storybook can be created by clicking **Add Empty**. 
Users can manually add groups to a new or existing storybook by selecting points in the scatter plot and choosing "Create Group from Selection" from the context menu that opens with a right-click on the scatter plot.

The groups in a storybook are listed below the user select. Each item in the list represents one group. If a user clicks on a group, the corresponding points are highlighted in the scatter plot.
Holding CTRL adds a group to the selection.
Next to each group label there is a settings button where users can adjust group names, delete a group or filter the LineUp table by this group.

<img src="https://user-images.githubusercontent.com/45741696/112500941-1d819680-8d89-11eb-8049-0e36f56caf8d.gif" width="250">

## Details
In this tab panel summary visualizations of selected points are shown. The user can choose to show this in an external window by clicking the corresponding toggle.

<img src="https://user-images.githubusercontent.com/45741696/112501006-2c684900-8d89-11eb-8fbd-43087150db93.png" width="400">

When points are selected users can see the 2D compound structure of the selected items, aligned to each other according to their maximum common substructure.
Users can select compounds from this view if they check the corresponding checkboxes and filter by the selected compounds by clicking on **Confirm Selection** (green).

There is a user input that allows to choose among all provided representations (yellow). 
The available representations are specified in the dataset and contain atom-level attribution scores for each compound.
To choose a representation users can either scroll through the list, or they can filter the list by typing in the auto-complete text field. 
Representations are organized by groups that can be specified manually as described in the "Atom Properties" chapter.

The **Settings** button allows users to manually refresh the representation list (blue). Furthermore, users can adjust settings that are used in the backend. Especially important is the **Align Structure** toggle, since the alignment might distort the compound structure. By disabling this feature, the compound structures are not aligned to each other anymore. However, the structures will be shown as expected again.

Clicking on **Add View** (orange) places an additional view of the selected compounds next to the existing view and enables the user to choose and compare several representations at once.
Additional views can be removed again using the **Delete**-symbol button.
It is recommended to use this feature in the external window only because there is more space.



## LineUp
For high-dimensional data exploration, we included a LineUp table (https://lineup.js.org/) that can be viewed on-demand. 
To show the table you need to drag the component from the bottom of the window to increase the size of the table. 

<img src="https://user-images.githubusercontent.com/45741696/112501102-3e49ec00-8d89-11eb-9b1c-513e49321cae.gif" width="600">

The table shows all properties that were included in the provided dataset except properties that have the "fingerprint" modifier. Fingerprints were excluded because their values usually do not contain semantic meaning and would take a lot of space in the table, which causes higher loading times and makes the table more complex.

All LineUp functionalities are included like filtering, searching, sorting, etc.
The grouping functionality can be performed in all columns, especially relevant is group by selected items and group by group labels, which actively uses features of the Projection Space Explorer.

### LineUp Settings
The **Load All** button automatically makes the table component visible - if it was not shown yet - and removes all filters. 

The **Load Selection** button automatically makes the table component visible - if it was not shown yet - and filters the table by the selected items. 

The **Show Cell Values** toggle can be enabled to show values in numerical table cells. If it is disabled, the values are only shown for highlighted rows.

The **Export CSV** downloads the table in its current state as .csv file. Current filters, ordering, and custom annotations are contained in this file.

### SMILES
Using the "smiles" modifier, users can manually specify, which properties represent SMILES strings. For each column that contains SMILES, there is an additional "structure" column created that shows the 2D structure next to the SMILES column.
The SMILES columns have some additional features:
- Users can filter those columns by substructure (a valid SMILES string must be provided in the filter input).
- Changing the width of those columns dynamically adapts row heights, which provides a better view of the 2D structures.
- When grouping several rows, this column displays the maximum common substructure of all compounds in the group.

### Interaction
The table can be used interactively with the scatter plot that represents the projected space and the summary view that shows selected items:
- Hovering items in the table highlights the corresponding items in the other views as well and vice versa.
- Users can select items in the table, which are also selected in the other views and vice versa.
# Installation
## Install npm packages
Use a git tool to clone this repository to your computer.
```bash
git clone https://github.com/jku-vds-lab/projection-space-explorer/tree/chemVis
```
Then navigate to this folder in a terminal using
```bash
cd projection-space-explorer
```
and run the command to install the required packages
```bash
npm install
```
## Build the application
There is always a valid build in the repository, but in case you want to make changes, you can use the local build server. Start it with the command
```bash
npm run webpack:dev
```
Whenever a file is changed while this server is running, it will automatically build a new version and deploy it in the /dist folder.
## Starting the application
To start the application you just need to start the index.html locally. The easiest way to this is by using the live server provided by either Atom or Visual Studio Code.

## Backend
In the backend, a Python server runs with the Bottle Framework (https://bottlepy.org/docs/dev/). Many features that relate to the “Chem” aspects of the Projection Space Explorer are only available if the backend is running. Also, the feature to derive groups from clustering is only available in the backend.

To start the server you need to create a conda environment with the following dependencies:
- bottle=0.12.18
- rdkit=2020.09.5
- hdbscan=0.8.27
- joblib=0.17.0
- bottle-beaker=0.1.3

A requirements.txt is provided in the folder “backend”.

Using this environment you only have to start the server by running 
```bash
python backend-cime-dist.py
```

## Run Application with Docker
To combine frontend and backend in a docker image we provide a Dockerfile. 
Before creating the image you have to adjust some settings:
- In the “backend/backend-cime-dist.py” the “response_header_origin_localhost” constant needs to be set to “http://localhost:8080”
- In the “backend/backend-cime-dist.py” the line that starts the server needs to be replaced by “run(app=app, host='0.0.0.0', port=8080)”
- In the “src/utils/backend-connect.ts” the “BASE_URL” constant needs to be set to an empty string (i.e. “”)
- In the “src/utils/frontend-connect.ts” the “BASE_PATH” constant needs to be set to an empty string (i.e. “”)

In the root folder of the project, you can create the docker image by running
```bash
docker build -f Dockerfile -t cime .
```
and run the image with
```bash
docker run -d -p 8080:8080 --detach cime
```
The application will be available on ‘localhost:8080’.

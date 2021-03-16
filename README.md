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


An example file could looke like this

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
Users are able to aply a 2D projection to the provided data, and additionally show the high-dimensional data in a LineUp table.
Furthermore, users can select datapoints and show the 2D structures of all selected items, aligned to each other, in a side-view.
If provided in the data, users can change the representation in the side-view to show atom-level attributions in the 2D structure. 
This could be used for comparing point neighbors for example to check, if machine learning model explanations generated for those datapoints make sense.
Using the clustering tool allows for easier interaction with point neighborhoods.

The documentation is mainly organized according to the tabs that can be opened on the left side of the website.

## Dataset
When loading the website there is a default dataset loaded, which is called "test.sdf".
Additionally, users can load datasets that were already uploaded previously or they can upload their own custom dataset.
The list of uploaded files includes all SDF files that are available in the backend (from any user!) and can be deleted with the delete button next to the filename.
The list can also be manually refreshed with the refresh button next to "Uploaded Files" (this is only necessary, if another user uploads a file during a simultaneous session and the current user needs this exact file).

If a user wants to upload a custom file they have to use the file format that is described in the next subsection.

### Data Format
TODO: make whole sentences.... TODO RDKit Ref
Data is handed to the system using a Structure-Data File (SDF) https://en.wikipedia.org/wiki/Chemical_table_file#SDF that contains a collection of chemical compounds and additional properties that can be customized.


properties: 
    - compound specific properties 
        -> can be used for projection and can be shown in lineup (like solubility, atom weight or any other property that is important to the user; can also include fingerprints or embedding space of compound, which can then be used for projection)
        -> can contain arbitrary values (the naming should be consistent for all compounds)
        -> including properties "x" and "y" tells the system to use these for the projection
        -> user can specify a "modifier"-term that specifies a certain group that properties belong to. if there are properties that semantically belong together. e.g. an embedding consists of 10 values -> properties can be named embedding_val0, embedding_val1 ... embedding_val9, which tells the system that all of them belong to the group "embedding". this grouping is for usability purposes and allows the user to collapse, expand and select group properties together for the projection
        -> by default the system recognizes the following modifiers: ["fingerprint", "rep", "pred", "predicted", "measured", "smiles"]
        -> if there is no "fingerprint" modifier in the properties of a dataset, the system will create them automatically https://rdkit.readthedocs.io/en/latest/GettingStartedInPython.html#morgan-fingerprints-circular-fingerprints
        -> custom modifiers can be added in a dialog input that shows when uploading a dataset
        -> the pre-defined "smiles" modifier has a special function: if a property is decorated with "smiles_*" the system will recognize the property as SMILES string and thus show the compound structure in the lineup table
        
    - atom specific properties 
        -> only atom.dprops are handled which are interpreted as attribution scores and shown on the compound structure with heatmap and contour lines
        -> must contain one value for each atom of the compound
        -> generate with RDKit: https://www.rdkit.org/docs/RDKit_Book.html#atom-properties-and-sdf-files
        -> the frontend has an autocomplete userinput that groups atom properties
            -> values for the autocomplete are extracted as follows (e.g. example property "atom.dprop.rep_0"):
            -> group name: substring that includes everything before the last underscore (e.g. "rep")
            -> value: substring after the last underscore (e.g. "0")



--> here is a snippet of an example compound:

1
     RDKit          2D

 26 28  0  0  0  0  0  0  0  0999 V2000
   -3.8971  -10.3573    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -3.8971   -8.8573    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.5981   -8.1073    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   (...)
  1  2  1  0
  2  3  1  0
  3  4  1  0
   (...)
M  END
>  <x>  (1) 
1

>  <y>  (1) 
-1

>  <fingerprint_0>  (1) 
1

>  <fingerprint_1>  (1) 
-1

>  <fingerprint_2>  (1) 
-0.93295186758041382

(...)

>  <smiles_test1>  (1) 
CCC(C)

>  <predicted_LOD>  (1) 
7.2908949851989746

>  <predicted_LOA>  (1) 
6.8278293609619141

>  <predicted_LOM>  (1) 
6.9404010772705078

(...)

>  <atom.dprop.rep_0>  (1) 
0.27710943999999998 0.27710943999999998 2.0140631 2.0140631 1.2363203999999999 (...)

>  <atom.dprop.rep_1>  (1) 
2.3923867000000003 1.2477521999999999 0.14004986999999999 0.14004986999999999 (...)

>  <atom.dprop.rep_2>  (1) 
-0.51998469999999997 -0.19284870000000001 -0.51998469999999997 -0.51998469999999997 (...)


## Project
Currently only UMAP projection is available for CIME. To implement the projection we use this library: https://github.com/PAIR-code/umap-js. 
The JavaScript library code is a reimplementation of this python library https://github.com/lmcinnes/umap, with the difference that the JS library uses random seedpoints as initialization. 

TODO...
umap default parameters like suggested in https://umap-learn.readthedocs.io/en/latest/api.html 
normalization
distance metric
grouping
seed projection
projection settings
saved projections



## Encoding
In the "Encoding" tab panel users can change the marks and channels of the displayed data.
TODO: line by??
TODO: shape by??
TODO: need explanation??


## Clusters --> Groups
TODO: groups vs clusters?
In the "Clusters" tab panel users can adjust cluster settings, automatically calculate clusters and selecting different cluster stories.

### Group Settings TODO: rename?
One toggle allows users to show or hide items (points). The other one allows users to show or hide cluster centers (grey diamonds).

### Cluster Settings TODO: rename?
Automatic Clustering of the projected features can be clicking "Projection-Based Clustering". The algorithm used for clustering is HDBSCAN https://hdbscan.readthedocs.io/en/latest/index.html.
Parameters can be changed either by adjusting the slider (few clusters...many clusters), or by enabling the "Advanced"-Mode. Chosen parameters are always synchronized with the values in the "Advanced" user inputs. Any other possible parameters that could be used for HDBSCAN are set to the default paramters that can be retrieved from the HDBSCAN docs.

### Groups and Stories TODO: rename?
A story book is a set of clusters that were either created automatically (e.g. by "Projection-Base Clustering") or manually composed. 
A new story book can be created by clicking "Add Empty". 
Users can manually add clusters to a new or existing story book by selecting points in the scatter plot and choosing "Create Cluster from Selection" from the context menu that opens by a right click on the scatter plot.
TODO: open story editor?!
TODO: create from selection also in cluster tab?

The clusters in a story book are listed below. Each item in the list represents one cluster. If a user clicks on a cluster, the corresponding points are highlighted in the scatter plot.
Holding CTRL adds a cluster to the selection.
Next to each cluster label there is a settings button where users can adjust cluster names, delete a cluster or filter the lineup table by this cluster.



## Details



## Lineup
https://lineup.js.org/ 





TODO: buttons on right top corner?
TODO: main view description: hover,...
TODO: general controls (left-click + drag = new selection; left-click + shift + drag = toggle selection; right-click + drag = pan; mousewheel = zoom; right-click: context-menu; right-click on cluster: cluster context menu;)


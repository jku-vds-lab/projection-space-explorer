# Projection Space Explorer (React Library)
This repository includes:
* The implementation of the Projection Space Explorer React Library
* [Getting Started](#getting-started)
* [Documentation](#documentation)
* [How to cite?](#how-to-cite)

Check out our original [Projection Path Explorer paper](https://dl.acm.org/doi/10.1145/3387165) for details about design choices and use cases. 

Check out our paper on [Visual Exploration of Relationships and Structure in Low-Dimensional Embeddings](https://ieeexplore.ieee.org/document/9729550) for how we adapted the Projection Space Explorer to accommodate the analysis of relationships in data. 

Check out the [ChemInformatics Model Explorer](https://jcheminf.biomedcentral.com/articles/10.1186/s13321-022-00600-z) to see how we adapted the PSE to explainable cheminformatics.

Check out our [PSE landing page](https://jku-vds-lab.at/pse/), which includes all applications that we built upon the PSE.

Check out the [Projection Space Explorer App repository](https://github.com/jku-vds-lab/projection-space-explorer-app) to see how the PSE library can be used in a project.

# Getting Started
You can use the [projection-space-explorer-app repository](https://github.com/jku-vds-lab/projection-space-explorer-app) as a starting point for your own project.

If you want to include the library in an existing React project, you can install it with npm:
```bash
npm install react react-dom react-redux redux @emotion/react @emotion/styled @mui/material @mui/styles --legacy-peer-deps
npm install git+https://github.com/jku-vds-lab/projection-space-explorer.git --legacy-peer-deps
```

or yarn:
```bash
yarn use react react-dom react-redux redux @emotion/react @emotion/styled @mui/material @mui/styles
yarn use git+https://github.com/jku-vds-lab/projection-space-explorer.git
```

The PSE react component can then be added using:
```
const api = new API(null, createRootReducer({}));
<PSEContextProvider context={api}>
    <Application/>
</PSEContextProvider>
```

To add datasets, you can use the API and update the dataset entries in the store:

```
export const DATASETCONFIG = [{
  display: "Toy: Iris",
  path: "iris.csv",
  type: DatasetType.None,
}]
api.store.dispatch(setDatasetEntriesAction(DATASETCONFIG));
```


Installations were tested for Node versions 16 to 18.

## Build the library from source
### Install npm packages
Use a git tool to clone this repository to your computer.
```bash
git clone https://github.com/jku-vds-lab/projection-space-explorer.git
```
Then navigate to the Application folder in a terminal using
```bash
cd projection-space-explorer
```
and run the command to install the required packages
```bash
npm install
```
### Build the code
There is always a valid build in the repository, but in case you want to make changes, you can use the local build server. Start it with the command
```bash
npm run webpack:dev
```

## How to contribute?
You are welcome to contribute to the PSE library. 
To that end, create a new branch that is based on the **develop** branch. You can use the instructions above to build the source code locally.
When you finished the implementation, create a PR to **develop** with details of the new functionality and make sure that all tests pass.


# Documentation
which parts are customizable
installation at the end (how to use the library)
dataset structure

the two main ui components (menu drawers -> can have additional drawers, and projection view -> can have several layers)
additional components: tabular view

## Data Format
Files must either be in CSV or JSON format. You can add arbitrarily named features, however, there are a few special names that are recognized by the system:
- **x** and **y** tells the system to initialize the projection view with the given values. If not provided, the coordinates are randomly initialized.
- **groupLabel** specifies a group each point belongs to.
- **line** specifies a sequence within the data. Each datapoint with the same **line** character belongs to the same sequence. The order of the sequence is defined by the order in which the datapoints occur in the dataset. If **line** is omitted, the data is not treated as trajectories and no lines are drawn between the points.
- **algo** TODO: is this still used? what is the difference to groupLabel?
- **changes** can be supplied with text values that will be displayed with the line selection tool. These values are used to annotate changes between states.
- **multiplicity** can be used to denote how often the exact same state occurs in the dataset. This is sometimes necessary if you want to project the data without any duplicates, but need it in the explorer to display the lines correctly (since only single edges are allowed). For example if the same state occurs in 3 lines, it would have a multiplicity of 3 in each row occurence.

Meta information can be added to columns in a CSV file by adding a JSON object to the column name. Currently the following JSON attributes are available:
- **domain** tells the system that this feature is quantitative and defines the domain of the values. For example: **Age{"domain": [0,100]}** specifies that all values lie between 0 and 100. If we add another number as the center of the domain (e.g., **Rating{"domain": [-5,0,5]}**) the feature is identified as **diverging**.
- **dtype** explicitly tells the system, which type the feature has. Valid values are "quantitative", "categorical", "date", and "array".
- **featureLabel** tells the system, which category a feature belongs to. Features with the same category are grouped together in certain UI elements (e.g., when selecting which columns to use for projection). For example: **PetalLengthCm{"featureLabel": "Features"},PetalWidthCm{"featureLabel": "Features"},Species** --- here we specify the columns **PetalLengthCm** and **PetalWidthCm** and add the meta attribute **"featureLabel": "Features"** for both columns.  The column **Species** did not receive a **featureLabel** and gets assigned to a default label instead.
- **project** is a boolean flag that tells the system if this feature should be projected by default. If **{"project": false}** is included, the checkbox for selecting which features to project is not checked. If **{"project": true}** is included, or the attribute is omitted entirely, the checkbox will be checked.
- **edges** assigned to the **groupLabel** column can specify connections between groups.


If no explicit information about the data type is given in the meta information, it is infered from the feature values:

A feature is **categorical** if:
 - it has at most 8 different distinct values in its value range and
 - it has at least 1 non-floating point number in its value range

A feature is **quantitative** if:
 - it has only floating point numbers in its value range


There are some toy datasets available in the [Projection Space Explorer App repository](https://github.com/jku-vds-lab/projection-space-explorer-app) under **datasets/toy** which are small examples of how the files should look like. They also provide a playground for testing different projection methods.


## Changing and adding components
The PSE library interface allows developers to create custom components and plug it into the existing structure, or change settings for existing components.
Most configurations can be set using parameters of the Application component. The API for the configuration options is defined in **src/BaseConfig.tsx**.
There are three parameters that can be set: **config**, **features**, and **overrideComponents**, each providing a different set of configuration options.
With these, you can define custom projection methods, add new layers to the projection view, add mouse event hooks for the projection view, define custom tab menues, add an additional view to a reserved spot at the bottom of the application, and much more.

Minor changes, like renaming labels, can be directly done by updating the store using the PSE API (similar to updating the dataset entries shown before):
```
api.store.dispatch(setItemLabel({ label: 'experiment', labelPlural: 'experiments'}));
```


## Controls
This section explains the general layout of the tool and the basic controls with which you can interact with the tool.
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



# How to cite?

You may cite the PSE using the following bibtex:

```bibtex
@software{heckmann2023pse,
  author = {Heckmann, Moritz and Humer, Christina and Steinparz, Christian A. and Pühringer, Michael and Eckelt, Klaus and Streit, Marc},
  month = {07},
  title = {{Projection Space Explorer}},
  url = {https://github.com/jku-vds-lab/projection-space-explorer/},
  version = {1.0.0...tagging a version?}, 
  year = {2023}
}
```

You may also cite the original Projection Path Explorer paper:

```bibtex
@article{2020_tiis_pathexplorer,
    title = {Projection Path Explorer: Exploring Visual Patterns in Projected Decision-Making Paths},
    author = {Hinterreiter, Andreas and Steinparz, Christian A. and Heckmann, Moritz and Stitz, Holger and Streit, Marc},
    journal = {ACM Transactions on Interactive Intelligent Systems},
    doi = {10.1145/3387165},
    url = {https://dl.acm.org/doi/10.1145/3387165},
    volume = {11},
    number = {3–4},
    pages = {Article 22},
    year = {2021}
}
```

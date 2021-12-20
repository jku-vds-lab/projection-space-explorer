from setuptools import setup

setup(
    name='projection-space-explorer',
    packages=['projection_space_explorer'],
    include_package_data=True,
    install_requires=[
        'flask',
        'sklearn',
        'hdbscan',
        'numpy'
    ],
)
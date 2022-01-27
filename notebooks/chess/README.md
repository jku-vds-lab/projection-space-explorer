In addition to the packages listed in requirements.txt, [pgn2gif](https://github.com/dn1z/pgn2gif) needs to be installed. This is, of course, already taken care of in the dockerfile.

Building and running the docker for cuda/GPU, jupyter, and chess relevant packages:
```
docker build -t gpu-jupyter-icg . -f gpu-jupyter.Dockerfile
docker run -it --gpus all -p 8888:8888 -v "{path to projection space explorer}:/pse" gpu-jupyter-icg
```

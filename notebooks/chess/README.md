Building and running the docker for cuda/GPU, jupyter, and chess relevant packages:
```
docker build -t gpu-jupyter-icg . -f gpu-jupyter.Dockerfile
docker run -it --gpus all -p 8888:8888 -v "{path to projection space explorer}:/pse" gpu-jupyter-icg
```
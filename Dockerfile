
# define our environment
#FROM jcrist/alpine-conda:4.6.8
FROM continuumio/miniconda3:4.6.14

# install rdkit and bottle
RUN /opt/conda/bin/conda install --yes --freeze-installed -c conda-forge rdkit bottle hdbscan && /opt/conda/bin/conda clean -afy
RUN pip install bottle-beaker

# define target folder
WORKDIR /app

# copy everything from our backend to our app folder
COPY backend /app/

# copy the pre-built front-end
#TODO the docker could build and copy
COPY dist/ /app/dist/ 

EXPOSE 8080

# run server
CMD ["python", "-u", "backend-chemvis-dist.py"] # "-u" is needed such that there will be console output provided by docker

# Running
# docker build -f Dockerfile -t chem-vis .
# docker run -d -p 8080:8080 --detach chem-vis
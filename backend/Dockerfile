FROM ubuntu:14.04
MAINTAINER Christina Humer <christina.humer@jku.at>

## install miniconda
ENV PATH="/root/miniconda3/bin:${PATH}"
ARG PATH="/root/miniconda3/bin:${PATH}"
RUN apt-get update

RUN apt-get install -y wget && rm -rf /var/lib/apt/lists/*

RUN wget \
    https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
    && mkdir /root/.conda \
    && bash Miniconda3-latest-Linux-x86_64.sh -b \
    && rm -f Miniconda3-latest-Linux-x86_64.sh 
RUN conda --version
###

RUN apt-get update && apt-get install -y python-pip python-dev && apt-get clean

RUN conda install -c conda-forge rdkit
RUN pip install bottle


WORKDIR /app
ADD . /app

EXPOSE 5000

CMD ["python", "backend-chemvis.py"]
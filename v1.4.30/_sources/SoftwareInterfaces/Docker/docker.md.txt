# Docker: Getting started
For a general introduction to the Docker software container technology please have a look at the [official Docker documentation website](https://docs.docker.com/get-started/).

This will guide you to your fist steps on how to get started with Docker, that is:
+ Build and run an image as a container
+ Share images using Docker Hub
+ Deploy Docker applications using multiple containers with a database
+ Run applications using Docker Compose

For the O3R system specifics please see / follow the documentation provided below.
This documentation includes:
+ How to build and run Docker containers on the O3R platform
+ Configuring logging on edge devices such as the O3R VPU (additional document)
+ Deploying on the O3R VPU (additional document)
+ Autostart Docker containers (additional document)
+ Utilizing the GPU on the O3R VPU device (additional document)

# Build and run a Docker container for the O3R platform

In this document we guide you through building a container from scratch. We start by building a small container. This container will increase in size and complexity the further we go. We will use a Python base image and install the ifm3d (ifm3dpy) library.

If you want to use any of our available Docker images or directly build on top of our Dockerfiles, you can jump directly to [this section](#building-on-top-of-the-ifm-base-image) or check out the list of [Docker images officially supported by ifm](https://github.com/ifm/ifm3d/pkgs/container/ifm3d).

Note that the O3R VPU (Video Processing Unit) is based on an NVIDIA Jetson system (TX2), which is arm64/aarch64 based.
Building containers without the right base image will not run on the VPU, an arm64/aarch64 base image is needed. 
To build the container for an architecture different than the host's, [QEMU](https://www.qemu.org/) can be used.

## A basic container

Every Docker container image is built by Docker using a Dockerfile.
A Dockerfile contains all the necessary information for building a container image. Most of the Dockerfiles are starting with a base image that is retrieved from the Docker Hub during the build process. Docker will automatically fetch the image for the architecture hosting the build (arm64/aarch64). When building a container for an architecture other than the hosts', the destination architecture needs to be specified in the Dockerfile.
The Dockerfile is just a text file named `Dockerfile` without any file extension (watch out, it is case sensitive). You can use `docker build [path to Dockerfile]` to start the build process.

Our first container will use `arm64v8/python:3.9.6-slim-buster` as the base image. Let's build the first container with that base image.

Dockerfile:

```Docker
#arm64v8 is the pre-requisite for running the container on the VPU.
FROM arm64v8/python:3.9.6-slim-buster
```
### Build the container
Building:
To build a container use `docker build [path/to/Dockerfile]`. If an image tag (name) is needed, you can specify it within the `docker build` command.

```Docker
# Assuming the Dockerfile is located within the same directory:
$ docker build . -t ifm3d
```

>Note: For further information about `docker build` refer to the official [Docker documentation](<https://docs.docker.com/engine/reference/commandline/build/>)

Build process:

```bash
$ docker build . -t ifm3d
Sending build context to Docker daemon  2.048kB
Step 1/1 : FROM arm64v8/python:3.9.6-slim-buster
 ---> 4770e646d0be
Successfully built 4770e646d0be
Successfully tagged ifm3d:latest
```

If the build was successful, you should be able to use `docker image ls` to display all built images:

```bash
$ docker image ls
REPOSITORY                TAG                 IMAGE ID       CREATED         SIZE
ifm3d                     latest              4770e646d0be   5 weeks ago     108MB
```


#### Troubleshooting: proxies

Depending on the network infrastructure, Docker might need the proxy information for building the container. You can input them directly when running the command:

```Docker
#$HTTP_PROXY & $HTTPS_PROXY are variables containing the proxy address. for example: HTTPS_PROXY=https//[PROXY ADDRESS]
$ docker image build --build-arg http_proxy=$HTTP_PROXY --build-arg https_proxy=$HTTPS_PROXY -t jupyter .
```

You can also define the proxies in the `config.json` file. You should find the file within the home directory of the user executing Docker, in a directory called `.docker`, which contains `config.json`. For example `~/.docker/config.json`. If not available, create and save a `config.json` file containing the following:

```json
{
 "proxies":
 {
   "default":
   {
     "httpProxy": "http://192.168.1.12:3128",
     "httpsProxy": "http://192.168.1.12:3128",
     "noProxy": "*.test.example.com,.example2.com,127.0.0.0/8"
   }
 }
}
```

### Run a container

>Note: To run a container built for another chip architecture than the host system, you need to use [QEMU](https://www.qemu.org/) to handle the virtualization. For further information see: [Docker multi-CPU architecture](https://docs.docker.com/desktop/multi-arch/)

To run the container, we use `docker run`. We can specify the run command through several arguments: we want to start the container interactively (`-it`) and with a bash interface (`/bin/bash`), so we can play around inside the container.

```bash
$ docker run -it ifm3d /bin/bash
WARNING: The requested image’s platform (linux/arm64) does not match the detected host platform (linux/amd64) and no specific platform was requested
root@ee24eff3c797:/#
```

>Note: For further information about `docker run`, refer to the [official documentation](<https://docs.docker.com/engine/reference/run/>)

Now we are within the container. The warning tells us that the base image was build for an arm64/aarch64 architecture, which is different from the architecture of the host (amd64).

We should be able to ask for the Python version and start a REPL:

```bash
root@ee24eff3c797:/$ python --version
Python 3.9.6
```

```bash
root@ee24eff3c797:/$ python
Python 3.9.6 (default, Jun 29 2021, 19:34:26)
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> print("hello")
hello
>>>
```

### Save a container

The container is working, let's save it so we can share it around. Docker already provides us with the right tool: `docker save`.

```bash
$ docker save ifm3d > ifm3d.tar
```

## Load and start a container

To reload the content of a previously saved image, use:

```console
$ docker load < ifm3d.tar
```

Start the Docker container like this on every other device:

```console
$ docker run ifm3d
```

>Note: The image name might be different than the saved container name. After `docker load`, Docker will show the name of the loaded image



## Add features to the container

Until now, our container is not really useful. Let's update the container's kernel, install Python packages and create a user (this will improve security). To do that, we need to improve the Dockerfile:

Dockerfile:

```Docker
# This Dockerfile is a documentation example and might not build after a copy/paste process

#arm64v8 is the pre-requisite for running the container on the VPU.
FROM arm64v8/python:3.9.6-slim-buster

#Security updates
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get -y update && apt-get -y upgrade

#Create and activate virtual environment. This is not needed right now, but useful for multistage builds.
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Your normal pip installation, within the venv. We also update pip.
RUN pip install -U pip && pip install numpy

#For security reasons, using a "user" is recommended
RUN useradd --create-home pythonuser
USER pythonuser

#Easier to debug the container if issues are happening
ENV PYTHONFAULTHANDLER=1
```

Build process:

```bash
$ docker build . -t ifm3d
Sending build context to Docker daemon  113.1MB
Step 1/9 : FROM arm64v8/python:3.9.6-slim-buster
 ---> 4770e646d0be
...
Step 6/9 : RUN pip install -U pip && pip install numpy
 ---> [Warning] The requested image's platform (linux/arm64) does not match the detected host platform (linux/amd64) and no specific platform was requested
 ---> Running in bb51c405bbdb
Requirement already satisfied: pip in /opt/venv/lib/python3.9/site-packages (21.1.3)
Collecting pip
  Downloading pip-21.2.2-py3-none-any.whl (1.6 MB)
Installing collected packages: pip
  Attempting uninstall: pip
    Found existing installation: pip 21.1.3
    Uninstalling pip-21.1.3:
      Successfully uninstalled pip-21.1.3
Successfully installed pip-21.2.2
...
Step 9/9 : ENV PYTHONFAULTHANDLER=1
 ---> [Warning] The requested image's platform (linux/arm64) does not match the detected host platform (linux/amd64) and no specific platform was requested
 ---> Running in 4ea430894bc7
Removing intermediate container 4ea430894bc7
 ---> 14db5d89303f
Successfully built 14db5d89303f
Successfully tagged ifm3d:latest
```

>Note: For easier readability, the build process output was shortened.

The build process  contains several layers and `intermediate` container builds (that we use for debugging). You can start the container with the typical commands and check if NumPy was installed:

```bash
$ docker run -it ifm3d:latest /bin/bash
WARNING: The requested image’s platform (linux/arm64) does not match the detected host platform (linux/amd64) and no specific platform was requested
pythonuser@319eb5ea67e0:/$ pip freeze
numpy==1.21.1
```

## Install ifm3d in the container

`ifm3dpy` is the Python binding for the ifm3d library. You can install it from source (download it [here](https://github.com/ifm/ifm3d)) or use the [Docker image](https://github.com/ifm/ifm3d/pkgs/container/ifm3d) provided by ifm which can be used on the VPU and contains the ifm3d and ifm3dpy libraries.

The Dockerfile could look similar to this:

```Docker
# This Dockerfile is a documentation example and might not be build after a copy/paste process

FROM ubuntu:20.04 AS build

# if defined, we run unit tests when building ifm3d
ARG run_tests

# if you are running unit tests against a camera at
# a different IP, set it here.
ENV IFM3D_IP 192.168.0.69
ENV DEBIAN_FRONTEND noninteractive

WORKDIR /home/ifm
RUN apt-get update && apt-get -y upgrade
RUN apt-get update && \
    apt-get install -y libboost-all-dev \
                       git \
                       libcurl4-openssl-dev \
                       libgtest-dev \
                       libgoogle-glog-dev \
                       libxmlrpc-c++8-dev \
                       libopencv-dev \
                       libpcl-dev \
                       libproj-dev \
                       python3-dev \
                       python3-pip \
                       build-essential \
                       coreutils \
                       findutils \
                       cmake \
                       locales \
                       ninja-build
RUN apt-get clean

# install python
RUN apt-get -y install --no-install-recommends build-essential \
    python3-dev

#install(Update) python packages and dependencies separate - improves Docker caching etc.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# build pybind11 with cmake - but first clone from the official github repo
RUN git clone --branch v2.3.0 https://github.com/pybind/pybind11.git && \
    cd /home/ifm/pybind11 && \
    mkdir -p build && \
    cd build && \
    cmake -DPYBIND11_TEST=OFF .. && \
    make && \
    make install

# First clone ifm3d repo via username and personal access token into the container and than build the ifm3d
# this build include ifm3d pybind for a python access via pybind11
ARG IFM3D_CLONE_REPO
RUN mkdir src && \
    cd src && \
    git clone --branch o3r/main ${IFM3D_CLONE_REPO} && \
    cd ifm3d && \
    echo "Building from current branch" && \
    mkdir build && \
    cd build && \
    cmake -GNinja -DCMAKE_INSTALL_PREFIX=/usr -DBUILD_MODULE_OPENCV=ON -DBUILD_MODULE_PCICCLIENT=ON -DBUILD_MODULE_PYBIND11=ON -DPYTHON_EXECUTABLE=/usr/bin/python3 .. && \
    ninja && \
    ninja package && \
    ninja repackage
RUN ls -1 /home/ifm/src/ifm3d/build/*.deb | grep -iv 'unspecified' | xargs dpkg -i

# multistage to reduce image size, hide secrets and add ifm user
FROM ubuntu:20.04

COPY --from=build /usr /usr

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y && apt-get clean
```

>Note: You should leverage the layering from Docker to improve the build speed if you need to build again. QEMU emulates a ARM64 CPU in software on a x86 System which is slow. In case you are planning to build large application from source please consider to run this on a ARM64 based host.

We provide up-to-date images containing the ifm3d library, both on the DockerHub [here](https://hub.docker.com/r/ifmrobotics/ifm3d) and on GitHub [here](https://github.com/ifm/ifm3d/pkgs/container/ifm3d).
We recommend using the image available on GitHub, as it does not come with rate limits. You can simply pull it like so:

```bash
$ docker pull ghcr.io/ifm/ifm3d:stable
stable: Pulling from ifm/ifm3d
...
Digest: sha256:f54a5890d75618c5bd21535dfa71e1cd9b1a8515902fb8e1912e6f586e0685a3
Status: Downloaded newer image for ghcr.io/ifm/ifm3d:stable
ghcr.io/ifm/ifm3d:stable

```

>Note: Due to easier readability, the pull process output was shortened

Let's try the image and see if we can connect to a (physically connected) VPU:

```bash
$ docker run -it ghcr.io/ifm/ifm3d:stable
ifm@1f21eb1f98d2:/$ ifm3d dump
{
  "device": {
    "clock": {
      "currentTime": 1581111542490926304,
      ...
```

If this is working, we can also try the ifm3dpy implementation:

```bash
ifm@8a167fde9edc:/$ python3
Python 3.6.9 (default, Apr 18 2020, 01:56:04)
[GCC 8.4.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import ifm3dpy
>>> o3r = ifm3dpy.O3RCamera()
>>> o3r.to_json()
{'device': {'clock': {'currentTime': ...
```

## Building on top of the ifm base image

Now you want your own container, with your Python script to run. Base your Dockerfile simply on the `ghcr.io/ifm/ifm3d:stable` image:

```Dockerfile
FROM ghcr.io/ifm/ifm3d:stable
```

You can now include your application code.

Once the image is built, you can deploy it to the VPU. Read more [here](deployVPU.md).

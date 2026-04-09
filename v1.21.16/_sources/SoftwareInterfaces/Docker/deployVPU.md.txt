# Deploying a container to the VPU

To load a container multiple alternative solutions apply:
1. Using SCP: good solution for testing and small scale deployment.
2. Using a Docker registry: for production and larger scale deployment.

The user has access to the `oem` user for deploying all custom application code.

## Using SCP
This option is mainly for testing purposes, where a Docker container has been built on a laptop for the O3Rs ARM64v8 architecture and now needs to be transferred directly to the VPU.
This requires an SSH connection between the laptop and the VPU device.
To connect to the VPU via SSH, follow the instructions in the [SSH documentation](../../Technology/VPU/ssh.md).

Once SSH connection configured, you can copy the Docker image using the following command (assuming an `ifm3d.tar` image saved in the working directory):

```bash
$ scp ifm3d.tar oem@192.168.0.69:/home/oem/
ifm3d.tar                                                                       100%  108MB  51.5MB/s   00:02
```

You might be prompted to enter the password to access the authorized SSH key.

When copying large containers to the VPU, we recommend using the following command in order to avoid requiring double space:
```bash
$ docker save <image> | ssh -C oem@192.168.0.69 docker load
```
Once you copied the container, you can load and start it (see [instructions](docker.md#load-and-start-a-container)).


## Using a Docker registry

We recommend this approach as a deployment strategy:
+ During production,
+ As an advanced testing application where Docker images are built through a CI pipeline and deployed directly to test beds, or
+ Other advanced applications where strict measures are taken to ensure the identity of the Docker image.

To allow the user to download Docker images from a Docker registry, there are several steps to consider:
1. Is the VPU able to access the Internet? This is necessary if Docker images are to be downloaded directly from the official Dockerhub, GHCR, etc.
2. Does the VPU need to reach a locally hosted Docker registry only?

Due to the fact that proxy servers can sometimes be difficult to deal with, it may be useful to run a Docker registry on your local network where you have full control over firewalls and proxy setups. We therefore suggest to use a locally hosted registry.


### Configuration
:::{note}
This feature was added in FW 1.1
:::

To allow access to insecure registries, the Docker daemon configuration need to be updated through the O3R JSON configuration.

```json
{
  "device":{
    "docker": {
      "insecure-registries": []
    }
  }
}
```

The respective configuration parameters can be found in the JSON schema:
```json
"docker": {
  "additionalProperties": false,
  "attributes": [
    "persistent"
  ],
  "description": "Docker configuration",
  "properties": {
    "insecure-registries": {
      "default": [],
      "items": {
        "type": "string"
      },
      "maxItems": 3,
      "type": "array",
      "uniqueItems": true
    }
  },
  "type": "object"
}
```

The insecure registry feature allows the configuration of up to 3 insecure registry URIs. A configuration of a fourth element will replace the first element.

These insecure registry URIs are directly applied to the Docker daemon configuration JSON and are therefore persistent over reboots and power cycles without the need for a explicit `save_init` command call.

To get a better understanding of how to use and configure an insecure registry please see the [official Docker documentation for registries](https://docs.docker.com/registry/).


### Create a local Docker registry

The local Docker registry is created by using and hosting the container images provided by Docker itself.
On the host system (not the VPU), enable a local Docker registry with the following commands

```bash
$ docker pull registry:latest
# Run the registry and bind the container ports to the host ports
$ docker run -d -p 5000:5000 --name registry registry:latest
```

To stop the registry:

```bash
$ docker container stop registry && docker container rm -v registry
```

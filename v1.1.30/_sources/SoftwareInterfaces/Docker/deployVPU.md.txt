# Deploying a container to the VPU

To load a container multiple alternative solutions apply:
1. Easy: transfer a Docker container image via SSH / SCP
2. Advanced: load a container from a registry

Every VPU has two users:

- `root` - ifm user with all rights
- `oem` - customer user, this is the only one you have access to.

The first step to access the VPU is to connect to it via SSH.
## Option 1 - Easy: transfer a Docker container image via SSH / SCP
This option is mainly for testing purposes, where a Docker container has been built on a laptop for the O3Rs ARM64 architecture and now needs to be transferred directly to the VPU:

This requires a "local connection" between the laptop and the VPU device, that is the laptop must be able to address the VPU's SSH port 22 in its network configuration.

To connect to the VPU via ssh, follow these steps:

1. Generate an ssh key-pair
2. Upload the public key to the VPU
3. Connect to the VPU using the passphrase

### 1. Generate ssh key-pair

All user specific ssh keys are located at `~/.ssh`. This is the place where the private key for the connection to the VPU should be stored.

To generate an ssh key-pair, use `ssh-keygen`:

```console
$ cd ~/.ssh/
~/.ssh$ ssh-keygen -t rsa -b 4096 -C "[email-address]"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/devoegse/.ssh/id_rsa): id_o3r
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
...
```

A passphrase is also needed. After that command, two new keys are generated within the `~/.ssh` directory. With the example above it would be: `id_o3r` & `id_o3r.pub`.

### 2. Upload the public key to the VPU

Uploading the public (`.pub`) ssh key to the VPU is achieved via the ifm3d library.
The device configuration includes a parameter for authorized keys: `authorized_keys`.

```json
"network": {
      "authorized_keys": "",
      "ipAddressConfig": 0,
      "macEth0": "00:04:4B:EA:95:FB",
      "macEth1": "00:02:01:23:33:36",
      "networkSpeed": 1000,
      "staticIPv4Address": "192.168.0.69",
      "staticIPv4Gateway": "192.168.0.201",
      "staticIPv4SubNetMask": "255.255.255.0",
      "useDHCP": false
    },
```

To add a new key, the VPU configuration needs to be changed. This can be done with several ways (see [configuring the camera](https://api.ifm3d.com/stable/examples/o3r/configuration/configuration.html)). The easiest way in this case is to use the `jq` command:

```console
$ ifm3d dump | jq --arg id "$(< ~/.ssh/id_o3r.pub)" '.device.network.authorized_keys=$id' | ifm3d config
```

- `ifm3d dump` - This command receives the current configuration from the VPU.
- `jq --arg id "$(< ~/.ssh/id_o3r.pub)"` - This loads the public key into the variable `id` and provides it to the `jq` command
- `'.device.network.authorized_keys=$id'` - Here the JSON value from `authorized_keys` is changed for the public key within the variable `id`
- `ifm3d config` - The new JSON is now used to change the configuration of the VPU via `ifm3d config`

### 3. Connect to the VPU using the passphrase

After the key is uploaded, it is possible to connect with `ssh` and the username `oem` to the VPU:

```console
$ ssh oem@192.168.0.69
The authenticity of host '192.168.0.69 (192.168.0.69)' can't be established.
ECDSA key fingerprint is SHA256:8gjC9za45TTRZNz5JCMwaNJ27BLfsPyDtjBaBQ2vyHw.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.0.69' (ECDSA) to the list of known hosts.
o3r-vpu-c0:~$
```

There will be a prompt for the passphrase, configured during step 1.

### SCP

The first way to transfer a container to the VPU is to copy a saved container via `scp`.

```bash
path/to/container/folder$ scp ifm3d.tar oem@192.168.0.69:/home/oem/
oem@192.168.0.69’s password:
ifm3d.tar                                                                       100%  108MB  51.5MB/s   00:02
```

The system will ask for a password: `oem`

To verify if the copy process worked, use the command `sync` on the VPU after the copying the container.

> Note: Use ssh to connect to the VPU - see [SSH connection](#option-1---easy-transfer-a-docker-container-image-via-ssh--scp).

> Note: The OEM user has no write rights outside of his/her home directory. Therefore use `/home/oem/` for saving files etc. It is possible to create folders within the `oem` directory.

When copying large containers to the VPU, we recommend using the following command in order to avoid requiring double space:
```bash
docker save <image> | ssh -C oem@192.168.0.69 docker load
```
Once you copied the container, you can load and start it (see [instructions](docker.md#load-and-start-a-container)).


## Option 2. - Advanced: load a container from a Docker registry

We recommend this approach as a deployment strategy:
+ A Docker container deployment during production, or
+ An advanced testing application where Docker images are built through a CI pipeline and deployed directly to test beds,
+ Other advanced applications where strict measures are taken to ensure the identity of the Docker image.

To allow the user to download Docker images from a Docker registry, there are several steps to consider:
1. Is the VPU setup able to access the Internet - this is necessary if Docker images are to be downloaded directly from the official Dockerhub, GHCR, etc.?
2. Does the VPU setup need to reach a locally hosted Docker registry only?

Due to the fact that proxy servers can sometimes be difficult to deal with, it may be useful to run a Docker registry on your local network where you have full control over firewalls and proxy setups. We therefore suggest option 2.


### VPU configuration to access insecure registries:
:::{note}
This feature was added in FW 1.1
:::

To allow access to insecure registries, the Docker daemon configuration JSON file typically needs to be manually updated.
In the case of the O3R system, this can be accomplished using the JSON parameter fields in the default configuration JSON:

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
  "description": "Docker configuration",
  "attributes": ["persistant"],
  "properties": {
    "insecure-registries": {
      "items": {
        "type": "string"
      },
      "type": "array",
      "default": [],
      "maxItems": 3,
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

```console
docker pull registry:latest
# Run the registry and bind the container ports to the host ports
$ docker run -d -p 5000:5000 --name registry registry:latest
```
:::{note}
A local registry may seem complicated at first. See the [official documentation](https://docs.docker.com/registry/deploying/) for more information.
:::

To stop the registry:

```console
docker container stop registry && docker container rm -v registry
```

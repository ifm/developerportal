# Deploying a container to the VPU

There are several ways for deploying a container. This documentation focuses on the following two:

- Using `scp`
- Using a local docker registry

Every VPU has two users:

- root - ifm user with all rights
- oem - customer user, this is the only one you have access to.

The first step to access the VPU is to connect to it via SSH.
## SSH connection

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
- `'.device.network.authorized_keys=$id'` - Here the json value from `authorized_keys` is changed for the public key within the variable `id`
- `ifm3d config` - The new json is now used to change the configuration of the VPU via `ifm3d config`

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

## SCP

The first way to transfer a container to the VPU is to copy a saved container via scp.

```bash
path/to/container/folder$ scp ifm3d.tar oem@192.168.0.69:/home/oem/
oem@192.168.0.69’s password:
ifm3d.tar                                                                       100%  108MB  51.5MB/s   00:02
```

The system will ask for a password: `oem`

To verify if the copy process worked, use the command `sync` on the VPU after the copying the container.

> Note: Use ssh to connect to the VPU - see [SSH connection](#ssh-connection)

> Note: The `oem` user has no write rights outside of his/her home directory. Therefore use `/home/oem/` for saving files etc. It is possible to create folders within the oem directory.

When copying large containers to the VPU, we recommend using the following command in order to avoid requiring double space:
```bash
docker save <image> | ssh -C oem@192.168.0.69 docker load
```
Once you copied the container, you can load and start it (see [instructions](docker.md:#load-and-start-a-container))

## Local docker registry

Due to the fact that proxy servers are sometimes hard to deal with and that disk resources on the VPU is also limited, it might come handy to run a Docker registry in your local network.

### Create a local Docker registry

The local Docker registry is created by using the container images provided by Docker itself and host them.
On the host system (not the VPU) activate a local Docker registry with following commands:

```console
$ docker pull registry:latest
# Start the registry and bind the container ports to the host ports
$ docker run -d -p 5000:5000 --name registry registry:latest
```

> Note: A local registry might seem complicated at first. For further information refer to the [official documentation](<https://docs.docker.com/registry/deploying/>).

### Push a container to your local registry

To push a container to the registry, it is recommended to first tag the image differently. E.g. if the registry is run on the localhost with port 5000, the image tag could be named:

```Docker
docker tag ifm3d localhost:5000/ifm3d
```

Use the normal push command for uploading to the local registry:

```Docker
docker push localhost:5000/ifm3d
```

### Pull a container from the local registry - host

If a local Docker registry is running, use `docker pull` to pull the image:

```console
docker pull localhost:5000/ifm3d
```

### Pull a container from the local registry - VPU

*Coming soon*

### Stop the registry

To stop the registry:

```console
docker container stop registry && docker container rm -v registry
```
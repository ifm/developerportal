# SSH setup

To connect to the VPU through SSH or deploy code to the VPU with SCP, it is necessary to setup a list of authorized keys .

## Generate an SSH key-pair
>Note: the following instructions are tailored towards a bash (Unix shell). When deploying on a Windows based architecture, please modify the instructions sets for your shell accordingly.
All user specific SSH keys are located at `~/.ssh`. This is the place where the private key for the connection to the VPU should be stored.

To generate an SSH key-pair, use `ssh-keygen`:

```bash
$ cd ~/.ssh/
$ ssh-keygen -t rsa -b 4096 -C "<Some comment to remember what the key is for>"
Generating public/private rsa key pair.
Enter file in which to save the key (~/.ssh/id_rsa): id_o3r
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
...
```

A passphrase is also needed. After that command, two new keys are generated within the `~/.ssh` directory. With the example above it would be `id_o3r` and `id_o3r.pub`.

## Upload the public key to the VPU

Uploading the public (`.pub`) ssh key to the VPU is achieved via the ifm3d library.
The device configuration includes a parameter for authorized keys: `authorized_keys`. It is empty by default.

```bash
$ ifm3d dump | jq .device.network
{
  "authorized_keys": "",
  "interfaces": {
    "eth0": {
      "ipv4": {
        "address": "192.168.0.69",
        "dns": "0.0.0.0",
        "gateway": "192.168.0.201",
        "mask": 24
      },
      "mac": "48:B0:2D:54:F9:46",
      "networkSpeed": 1000,
      "useDHCP": false
    },
    "eth1": {
      "mac": "00:02:01:42:DE:94",
      "networkSpeed": 10,
      "useDHCP": true
    }
  }
}
```

To add a new key, the VPU configuration needs to be changed. This can be done with several ways (see [configuring the camera](https://api.ifm3d.com/stable/examples/o3r/configuration/configuration.html)). The easiest way in this case is to use the `jq` command along with the ifm3d API CLI:

```bash
$ echo {} | jq --arg id "$(< ~/.ssh/id_o3r.pub)" '.device.network.authorized_keys=$id' | ifm3d config
```

- `jq --arg id "$(< ~/.ssh/id_o3r.pub)"` - This loads the public key into the variable `id` and provides it to the `jq` command
- `'.device.network.authorized_keys=$id'` - Here the JSON value from `authorized_keys` is changed for the public key within the variable `id`
- `ifm3d config` - The new JSON is now used to change the configuration of the VPU via `ifm3d config`

Now, the content of the `authorized_keys` should look something like:
```bash
$ ifm3d dump | jq .device.network.authorized_keys
"ssh-rsa AAAAB3NzaC.....wZ9l3iSUaPPWOeFVz+xwlw== Some comment"
```

Note that the `authorized_keys` is a persistent parameter: it does not require a call to [`save_init`](../configuration.md#persistent-settings-without-save_init) to be persistent over reboots.

## Connect to the VPU using the passphrase

After the key is uploaded, it is possible to connect with `ssh` and the username `oem` to the VPU:

```bash
$ ssh oem@192.168.0.69
The authenticity of host '192.168.0.69 (192.168.0.69)' can't be established.
ECDSA key fingerprint is SHA256:8gjC9za45TTRZNz5JCMwaNJ27BLfsPyDtjBaBQ2vyHw.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.0.69' (ECDSA) to the list of known hosts.
o3r-vpu-c0:~$
```

There will be a prompt for the passphrase, configured during step 1.

You should now be able to SSH into the VPU using your customer SSH key and passphrase.
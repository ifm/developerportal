# Ethernet interfaces

The O3R has two Ethernet ports, `eth0` and `eth1`. These ports can both be used to communicate with the platform or with external devices (other sensors or computing platforms, displays, etc).

By default, both `eth0` and `eth1` are configured to a static IP, respectively `192.168.0.69`, and `192.168.42.69`.

With the current network setup, we expect `eth0` to be used for communication to and fro a complex network. `eth1` is expected to be used for bringing in external devices and other sensors. You might encounter networking issues if using `eth1` as your primary communication interface, due to the underlying network setting in the O3R VPU linux-based OS.

## Set a static IP

If DHCP is activated (only an option for `eth0`), to set a static IP to a port, you first need to switch the use of DHCP to false. This can be done for example using the `ifm3d` CLI (or with a similar process in the Vision Assistant or ifm3dpy):

```bash
$ echo {} | jq '.device.network.interfaces.eth0.useDHCP=false' | ifm3d config
```

An IP address will be automatically assigned to the port:
```bash
$ ifm3d dump | jq .device.network.interfaces.eth0
{
  "ipv4": {
    "address": "192.168.0.69",
    "dns": "0.0.0.0",
    "gateway": "192.168.0.201",
    "mask": 24
  },
  "mac": "48:B0:2D:54:F9:46",
  "networkSpeed": 1000,
  "useDHCP": false
}
```
:::{note}
New network settings will only be applied after reboot. Use for instance `ifm3d reboot`.
:::

To change the IP address manually once DHCP is disabled, you can for instance do the following:
```bash
echo {} | jq '.device.network.interfaces.eth0.ipv4.address="192.254.2.69"|.device.network.interfaces.eth0.ipv4.gateway="192.254.2.201"|.device.network.interfaces.eth0.ipv4.mask=24' | ifm3d config
```

:::{warning}
Make sure that the netmask of the address matches the one of the gateway.
:::

:::{note}
DHCP is not supported for `eth1`.
:::

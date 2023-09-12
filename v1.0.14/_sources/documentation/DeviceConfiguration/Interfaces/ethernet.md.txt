# Ethernet interfaces

The O3R has two ethernet ports, `eth0` and `eth1`. These ports can both be used to communicate with the platform or with external devices (other sensors or computing platforms, displays, etc).

By default, `eth0` is configured to the static IP `192.168.0.69`, and `eth1` to DHCP with automatic IP assignment. 

With the current network setup, we expect `eth0` to be used for communication to and fro a complex network. `eth1` is expected to be used for bringing in external devices and other sensors. You might encounter networking issues if using `eth1` as your primary communication interface, due to the underlying network setting in the O3R VPU linux-based OS.

## Set a static IP

To set a static IP to a port, you need to switch the use of DHCP to false. This can be done using the `ifm3d` CLI:

```bash
$ ifm3d dump | jq '.device.network.interfaces.eth1.useDHCP=false' | ifm3d config
```

An IP address will be automatically assigned to the port:
```bash
$ ifm3d dump | jq .device.network.interfaces.eth1
{
  "ipAddressConfig": 1,
  "ipv4": {
    "address": "192.254.1.69",
    "dns": "192.254.1.255",
    "gateway": "192.254.1.201",
    "mask": 24
  },
  "mac": "00:02:01:23:41:59",
  "networkSpeed": 10,
  "useDHCP": false
}
```
> Note: new network settings will only be applied after reboot. Use for instance `ifm3d reboot`.

To change the IP address manually once DHCP is disabled, you can for instance do the following:
```bash
$ ifm3d dump | jq '.device.network.interfaces.eth1.ipv4.address="192.254.2.69"' | ifm3d config
$ ifm3d dump | jq '.device.network.interfaces.eth1.ipv4.dns="192.254.2.255"' | ifm3d config
$ ifm3d dump | jq '.device.network.interfaces.eth1.ipv4.address="192.254.2.201"' | ifm3d config
```


# Ports overview

Within the O3R platform, several kinds of ports are used. This document clarifies what these different ports refer to and how to use them.

## Hardware ports
- There are the 6 hardware ports on the VPU, where the O3R heads are connected.
- These ports are mapped to TCP/IP communication ports, that are referred to as PCIC ports. PCIC is an ifm-specific communication protocol.

While it is good practice to check the PCIC port directly for the requested hardware port (see [below](#how-to-retrieve-the-pcic-port-number) how to do this), here the correspondence between hardware ports and PCIC ports for reference:

   | Hardware port | PCIC port |
   | ------------: | :-------- |
   |        Port 0 | 50010     |
   |        Port 1 | 50011     |
   |        Port 2 | 50012     |
   |        Port 3 | 50013     |
   |        Port 4 | 50014     |
   |        Port 5 | 50015     |

## IMU port

Besides the hardware ports mentioned above, there is an additional non-configurable hardware port, Port 6, which is specific to the IMU on board the VPU. 
The PCIC port mapped to Port 6 is 50016 (only used when [configuring ODS](../../ODS/Configuration/configuration.md)). 

:::{note} 
It is not possible to receive any data from the IMU at the moment.
:::

## Application ports

When the user creates an application instance, the application output can be received from the application instance's dedicated communication port. Each application instance has one unique communication port for sending data.

The TCP/IP ports for applications increment from 51010.
For reference, below is the application number to PCIC port correspondence.

   | Application number | TCP/IP port |
   | -----------------: | :---------- |
   |              App 0 | 51010       |
   |              App 1 | 51011       |
   |              App x | 5101x       |
   
For more information on instantiating ODS applications, refer to the [ODS getting started documentation](../../ODS/getting_started.md).

![Reference image for the hardware/application port correspondence to PCIC port](resources/ports.png) 

## How to: retrieve the PCIC port number

To retrieve the PCIC port number for any port, one can use the ifm3d API. The following code snippet serves as an example to retrieve the TCP/IP port for Port 2:

```python
from ifm3dpy.device   import O3R
o3r = O3R()
pcic_port = o3r.port("port2").pcic_port
>>>50012
```
The following code snippet shows how to retrieve the TCP/IP port of the first application instance:

```python
from ifm3dpy.device import O3R
o3r = O3R()
app_port = o3r.port("app0")
>>>51010
```


:::{note} With firmware versions 0.16.23 or higher, it is possible to receive the list of all available ports on the O3R platform. Use the ifm3d helper function `ports` [in Python](https://api.ifm3d.com/html/_autosummary/ifm3dpy.device.O3R.html#ifm3dpy.device.O3R.ports) or [c++](https://api.ifm3d.com/html/cpp_api/classifm3d_1_1O3R.html#ab82367443890c0526f2da7c79147e6b5).
:::


# Technology

:::{toctree}
    :maxdepth: 2
    :hidden:
2D Cameras <2D/2d>
3D Cameras <3D/index_3d>
VPU <VPU/index_vpu>
System Verification <SystemVerification/index_system_verification>
:::
## Available hardware and specifications.

| Hardware                         | Specification                               | Link to Hardware on ifm website                    |
| -------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| OVP800                           | Series product without ODS License          | [OVP800](https://www.ifm.com/us/en/product/OVP800) |
| M04239                           | Pre-Series product with ODS license         | Contact Sales Engineer for availability            |
| O3R222                           | Opening angle of 60 by 45°                  | [O3R222](https://www.ifm.com/us/en/product/O3R222) |
| O3R225                           | Opening angle of 105° by 78°                | [O3R225](https://www.ifm.com/us/en/product/O3R225) |
| HFM Cable (Highspeed Fakra Mini) | Connecting camera heads to VPU              | [E3R101](https://www.ifm.com/us/en/product/E3R101) |
| M12 Connector Cable              | Connector cable for power supply/CAN to VPU | [EVC948](https://www.ifm.com/us/en/product/EVC948) |

## CAD drawings of VPU and camera heads
The following table includes the links to find the CAD files of mentioned hardware products which will be required during the mechanical installation of VPU and camera heads.

| Hardware | CAD Drawings                                             |
| -------- | -------------------------------------------------------- |
| OVP800   | <https://www.ifm.com/us/en/product/OVP800?tab=documents> |
| O3R222   | <https://www.ifm.com/us/en/product/O3R222?tab=documents> |
| O3R225   | <https://www.ifm.com/us/en/product/O3R225?tab=documents> |


## Camera Heads

The camera heads mentioned above differ in their field of view, which has to be considered when selecting the correct hardware. The operational conditions and application use case are the two important factors to be considered for choosing a camera head.

### Operational Conditions

The `O3R2XX` camera heads are theoretically not limited by their capabilities to only indoor environments.

These camera heads fullfil `IP54` rating standards which in the addition of regular maintenance and cleaning these can also be used partly for harsher environments, e.g. dusty conditions and mixed indoor - outdoor conditions. In all operation conditions, the cameras have to be cleaned regularly to avoid dust or particle accumulation over the camera head's surface which will results in gradual deterioration of the camera's measurement performance.

Please keep in mind that all O3R camera heads (O3R222 and O3R225) are designed with an indoor use case in mind. Outdoor conditions may work depending on the applications requirements, but have to be benchmarked by the customer.
Mixed indoor - outdoor conditions are understood by ifm to be conditions which are mainly indoors but may include bright illumination pattern of overhead skylights and windows on the floor and objects.


### Application use-case

Two application use cases can be differentiated depending on the O3R camera heads:
The O3R222 has a narrow field of view which is ideal for applications focussing on detecting smaller objects and objects at longer ranges.
Whereas, the O3R225 camera head has a wider field of view which is ideal for the applications focussing on perceiving the larger areas and minimizing dead zones due to non-adjacent or non-overlapping field of views.

### Port(s) overview

Within the ODS configuration and reception of data, several kinds of `port`s are used.

- There are the 6 hardware ports, where the O3R heads (e.g. O3R225) are connected
- There are communication ports (TCP/IP), which are partly mapped to the hardware ports. Depending on the actual head to port configuration, it might be useful to get the communication ports from the config. (Head1 @ port2, Head2 @ Port3 -> Used TCP/IP ports: 50012 & 50013)

To retrieve the PCIC port number for a physical port, one can use `ifm3dpy`, for instance see below for port 0:
```python
from ifm3dpy import O3R
o3r = O3R()
pcic_port = o3r.get(["/ports/port2/data/pcicTCPPort"])["ports"]["port2"]["data"]["pcicTCPPort"]
```

:::{note}
    Note that the `o3r.get` command shown above is provided a subset of the json configuration.
    We do this to optimize the `get` process: we only retrieve the information we need instead of the whole configuration.
:::

While it is good practice to check the PCIC port directly for the requested hardware port, we list below the correspondence between hardware ports and PCIC ports for reference.

   |Hardware port| TCP/IP port|
   |-:|:-|
   |Port 0|50010|
   |Port 1|50011|
   |Port 2|50012|
   |Port 3|50013|
   |Port 4|50014|
   |Port 5|50015|

- Additionally, running applications have their own dedicated communication ports too, which can be retrieved similarly as the PCIC ports:

```python
from ifm3dpy import O3R
o3r = O3R()
app_port = o3r.get(["/applications/instances/app1/data/pcicTCPPort"])["applications"]["instances"]["app1"]["data"]["pcicTCPPort"]
```

For reference, below is the application number to PCIC port correspondence.

   |Application number| TCP/IP port|
   |-:|:-|
   |App 0|51010|
   |App 1|51011|
   |App ..|5101..|

:::{note} "Receive TCP/IP ports in config"
    With firmware versions `0.16.6` or higher, it is possible to receive the TCP/IP port bound to the hardware port or application. Use the ifm3d(py) helper function `ports` [in python](https://api.ifm3d.com/html/_autosummary/ifm3dpy.device.O3R.html#ifm3dpy.device.O3R.ports) or [c++](https://api.ifm3d.com/html/cpp_api/classifm3d_1_1O3R.html#ab82367443890c0526f2da7c79147e6b5).
:::

<!-- TODOOO fix mermaid -->
```mermaid
flowchart TB
    subgraph M04239
        subgraph Default function
        end
        subgraph App0
        end
        subgraph App1
        end
        subgraph AppX
        end
    end
    M04239 --port2--> p1[Port 50010]
    M04239 --Port1--> p2[Port 50011]
    M04239 --PortX--> p3[Port 5001X]
    App0 --> p4[Port 51010]
    App1 --> p5[Port 51011]
    AppX --> p6[Port 5101X]
``` 

:::{note}
    The `IMU` of the system has its own hardware port `port6` and therefore also a TCP/IP communication port. You can extract the port from the config JSON.

    ```python
    from ifm3dpy import O3R
    o3r = O3R()
    config = o3r.get()
    config["ports"]["port6"]["data"]["pcicTCPPort"]
    >>>50016
    ```

    It is not possible to receive any data from the `IMU` at the moment.
:::

:::{note}
    The communication ports of the applications might change depending on the application itself. ODS has one communication port to forward ODS information.
:::

:::{note}
    It is possible to connect to application ports and the head ports at the same time. However, if your head connection is not fast enough in receiving data, it might slow down the framerate on the O3R device. This might lead to issues with running applications.
:::

:::{warning}
    It is possible to change several parameters of ports who are referenced by an ODS application. This is meant for debugging and the user must not change this parameters.
:::
<!-- TODOOO? smooth out transition here? -->




# Instantiation

## Extrinsic calibration

If no extrinsic calibration is provided, for example the extrinsic calibration parameters are set to their default values, the ODS application will not work!
This would mean the camera head is inside the floor (`transZ == 0`) and looking towards to ceiling, which is not a valid ODS extrinsic calibration use case.


:::{note}
Always forward all 6 extrinsic calibration values at the same time. You can edit the full configuration in a file and provide this file to the `ifm3d config` command.

```json
{
    "ports": {
        <port_number>: {
            "processing": {
                "extrinsicHeadToUser": {
                    "rotX": <rotX_value>,
                    "rotY": <rotY_value>,
                    "rotZ": <rotZ_value>,
                    "transX": <transX_value>,
                    "transY": <transY_value>,
                    "transZ": <transZ_value>
                }
            }
        }
    }
}
```
:::

:::{note}
The rotation is in rad (radians) - instead of 90°, you provide Pi/2
:::

For one camera, connected to `port2`, facing forward (+x) with label up (+z) and shifted 20 cm vertically, the calibration can be set with:

```python
from ifm3dpy.device import O3R
o3r = O3R()
ext_calib =
{
    "ports": {
        "port2": {
            "processing": {
                "extrinsicHeadToUser": {
                    "rotX": 0.0,
                    "rotY": 1.57,
                    "rotZ": -1.57,
                    "transX": 0.0,
                    "transY": 0.0,
                    "transZ": 0.2
                }
            }
        }
    }
}
o3r.set(ext_calib)
```

Using the viewer of your choice, for example the ifmVisionAssistant, you can see the difference before and after the calibration.

## Ports selection

A VPU (OVP8XX) can connect up to 6 3D imager, ranging from `port0` to `port5`. The `ports` attribute  in the ODS configuration defines which of these ports are available for the ODS application. These ports cannot be changed dynamically and require a transition to the configuration `CONF` state for modifications.

:::{warning}
    The current ODS version do not support more than 4 used heads within an ODS application.
:::

```json
"ports": [
            "port2",
            "port3",
            "port4",
            "port5",
            "port6"
          ],
```

Any connected heads that are not included in the `ports` list can still be used independently alongside the ODS application.

`port6` is the Inertial Measurement Unit (IMU) and is used by ODS. **`port6` *must always* be provided to an ODS application.**

:::{note} To optimize system performance and conserve resources, it's recommended to switch all unused camera heads, especially RGB heads, to `CONF` state.
:::

## Active ports

The `activePorts` list defines which of the pre-configured `ports` will be used by the ODS application. Unlike the `ports` list, `activePorts` can be modified on the fly without requiring a transition to the configuration `CONF` state. This allows for dynamic adjustments while keeping the system in the running `RUN` state.

Each port in the `activePorts` list must also be included in the `ports` list to ensure it is recognized by the ODS application.

The ODS application processes the data specified in the `activePorts` list. The maximum number of active ports allowed is determined by the `maxNumSimultaneousCameras` attribute.

:::{note}
    From the firmware version 1.20.29 and above, if the `activePorts` is set to empty list that is (`activePorts`=[]) then the 3D ports defined in `ports` will be set to `IDLE` mode and a diagnostic message `ODS_IDLE_MODE` with group severity `critical` is flagged because no objects will be detected during this phase.
:::

## Visual odometry

Visual odometry is an algorithmic approach that, in combination with the IMU, provides ego-motion data to the ODS algorithm. Images from the cameras used for visual odometry are used alongside IMU data to continuously refine the ODS ego-motion estimation. It is required that the selected camera head(s) capture a significant portion of the floor in their images.  

The `vo` parameter expects a list of ports suitable for visual odometry. Visual odometry will be performed using one port that is present in both the `voPorts` list and the `activePorts` list.

```json
"vo": {
    "voPorts": ["port2", "port3"]
}
```

:::{note}
Visual odometry might be unavailable because of insufficient texture on the floor, ambient light, for example sun light, or because only a small portion of the floor is visible, for example when an object covers a large part of the field of view. Short-term outages of visual odometry (up to tens of seconds) should usually be overcome while the vehicle is still moving. In this case, ego motion becomes available again shortly after the first valid visual odometry updates. Long-term outages (of several minutes) probably require the vehicle to be at standstill for the ego motion to become available again.
:::

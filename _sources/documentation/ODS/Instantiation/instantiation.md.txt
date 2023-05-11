# Instantiation

## Extrinsic calibration

If no extrinsic calibration is provided, e.g. the extrinsic calibration parameters are set to their default values, the ODS application will not work!
This would mean the camera head is inside the floor (`transZ == 0`) and looking towards to ceiling, which is not a valid ODS extrinsic calibration use case.


:::{note}
Always forward all 6 extrinsic calibration values at the same time. You can edit the full configuration in a file and provide this file to the `ifm3d config` command.

```JSON
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

For one camera, connected to port 2, facing forward (+x) with label up (+z) and shifted 20 cm vertically, the calibration can be set with:
```python
from ifm3dpy.device import O3R
o3r = O3R()
ext_calib =
{
    "ports": {
        "port2": {
            "processing": {
                "extrinsicHeadToUser": {
                    "rotX": -1.57,
                    "rotY": 1.57,
                    "rotZ": 0.0,
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

A VPU (OVP800) can connect up to 6 3D imager, ranging from `Port 0` to `Port 5`. Providing the port information to the ODS configuration tells the system which heads should be used for the ODS application itself.

:::{warning}
    The ODS pre-release versions do not support more than 2 used heads within an ODS application.
:::

```JSON
"ports": [
            "port2",
            "port3",
            "port6"
          ],
```
Connected heads, which are not defined within the ODS JSON can be used separately/parallel to the ODS application.
`port6` is the `IMU` (Inertial Measurement Unit) and is used by ODS. **`port6` *must always* be provided to an ODS application.**


## Visual odometry 

`vo` - Visual Odometry - is an algorithmic approach to provide - together with the IMU - ego motion data to the ODS algorithm. Images from one head are used together with the IMU data to continuously improve the ODS ego-motion estimation. The best performance is achieved by using a head with (the most) floor data visible in its images. The floors distance range needs to be at least between 1.00m and 1.50m.

Provide the port number (head with floor data in the images) to the `vo` attribute.

```JSON title="Visual odometry - vo"
"vo": {
    "portNumber": 2
}
```

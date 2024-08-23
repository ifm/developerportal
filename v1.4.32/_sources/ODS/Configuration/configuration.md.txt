# Configuration

| Parameter   | Description |
 ------------ | ----------  |
| `name`      | Providing a custom name for the ODS application|
| `ports`     | The ports that can be used by the application (camera heads and `IMU`)|
| `state`     | The current app state and dependent camera hardware sates - "RUN" or "CONF"|
| `configuration/activePorts` | The list of camera ports that are active and being used by the application at one time. The number cannot exceed `maxNumSimultaneousCameras`. |
| `configuration/maxNumSimultaneousCameras` | The maximum number of cameras used simultaneously by ODS. This parameter requires a change to "CONF." |
| `grid/maxHeight`                          | Ceiling value above which all obstacles are ignored. Applies to the occupancy grid and all zones.|
| `grid/overhangingLoads` | A static region defined in the vehicle coordinate system which is excluded from the obstacle detection region (see [the overhanging loads documentation](../OverhangingLoads/overhanging_loads.md)). |
| `grid/temporalConsistencyConstraint` | Ensures that artifacts caused by dust particles are ignored (see [the dust mitigation documentation](../DustMitigation/dust_mitigation.md)). |
| `portX/acquisition/channelValue` | The camera channel value [-100, 100] used for a specific port to mitigate interference. Channel values should differ of at least 2.|
| `portX/negObst/enableNegativeObstacles` | Enable or disable the negative obstacle detection (see [the negative obstacle documentation](../NegativeObstacles/negative_obstacles.md)).|
| `portX/seg/minObjectHeight`                       | Minimum object height in [m], for example 0.025 [m]. This does not mean that any objects of this height will always be detected, but that objects below this height will be excluded from any detection. |
| `vo/voPorts`| Visual odometry - define a port which is the main camera stream for the visual odometry feature. Define multiple ports if a single reference port for visual odometry will not always be active, for example when switching between forward and backward looking cameras.|
| `zones`| Define protection zones to be used - [See `ods zone definition` for a complete description](../Zones/zones.md)|


:::{warning}
All connected heads have their own specific configuration. However, all heads referenced by the ODS are also configured by the application itself. **Only `channelValue` and `minObjectHeight` can be changed by the user and for each port separately**. The general configuration of ports (`{"ports":{"port2":...}}`) must not be changed by the user.
:::

## Channel value

The 3D imagers use the `iToF` - [indirect Time of Flight](https://en.wikipedia.org/wiki/Time-of-flight_camera) - technology to estimate 3D data.
Due to this technical approach, it might happen that two heads are interfering with each other. Providing different channel values (that is, slightly different modulation frequencies), from -100 up to 100 channel value, for each head helps mitigate this issue. Pick channel values at least two digits apart of each other.

```JSON title="Channel value"
{
    "applications":{
        "instances":{
            "appX":{
                "configuration": {
                    "port2": {
                        "acquisition": {
                            "channelValue": -10
                            }
                    },
                    "port3": {
                        "acquisition": {
                            "channelValue": 10
                        }
                    }
                }
            }
        }
    }
}
```
:::{note}
Since the application takes ownership of the ports that it uses and is able to reset their parameters, the port parameters relevant to the application have to be set within the port section of the application configuration, and not directly in the top level port settings.
:::

## Minimum object height

It is possible to change the minimum object height to improve ODS for certain conditions. ODS can use several heads for detecting obstacles. The heads themselves might be different (opening angle of 105° or 60°), and the mounting position of the heads can vary. Therefore the `minObjectHeight` might be different per connected head. The height is provided in [m].
Increasing this value might prevent false positives caused by the floor and/or smaller objects on the ground.

:::{note}
    Note that this parameter is not the only factor defining whether an object will be detected or not: switching `minObjectHeight` to zero does not mean that every object will be detected. This is especially true for small objects on the floor, where point cloud artifacts are the most pronounced.
:::

```JSON title="minObjectHeight"
"configuration": {
    "port2": {
        "acquisition": {
            "seg": {
                "minObjectHeight": 0.025
            }
        }
    },
    "port3": {
        "acquisition": {
            "seg": {
                "minObjectHeight": 0.040
            }
        }
    }
}
```


## State

To activate/deactivate the application use the following definition:

- Active: "RUN"
- Inactive: "CONF" 

:::{note}
To ensure that restarting the data stream is as quick as possible, we recommend keeping the application always in "RUN" state. For an inactive application, set the `activePorts` list to an empty list `[]`.
:::
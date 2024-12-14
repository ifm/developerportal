# Configuration
                                                                                                                                                                                                            |
| Property                                                | Type    | Description                                                                                                                                                                                                                                                                 | Default                     | Minimum | Maximum |
| :------------------------------------------------------ | :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------- | :------ | :------ |
| `configuration/activePorts`                               | array   | List of active ports. At least one port listed in vo/ports must be in the list.                                                                                                                                                                                             | ['port2', 'port3']          | N/A     | N/A     |
| `configuration/grid/maxHeight`                            | number  | Maximum detection height in [m].                                                                                                                                                                                                                                            | 2.0                         | 0.25    | 10.0    |
| `configuration/grid/overhangingLoads`                     | array   | The overhanging loads are ignored during object detection. For more details, please refer [overhanging loads](../OverhangingLoads/overhanging_loads.md)                                                                                                                     | []                          | N/A     | N/A     |
| `configuration/grid/rangeOfInterest`<sup>new</sup>        | number  | Maximum range of vision in [m] (given in robot coordinates). This parameter affects the grid shape. The grid shape is always quadratic with at least (rangeOfInterest/0.05)*2 cells for the default resolution of 5cm.                                                      | 5.0                         | 1.0     | 10.0    |
| `configuration/grid/temporalConsistencyConstraint`        | number  | Increase number of frames needed for valid object by the factor. Use factors > 1 for dusty conditions.                                                                                                                                                                      | 1.0                         | 1.0     | 5.0     |
| `configuration/maxNumSimultaneousCameras`                 | integer | The maximum number of simultaneously cameras in activePorts. Increase this setting if your ODS application uses 3 cameras at the same time.                                                                                                                                 | 2                           | 1       | 3       |
| `configuration/port**X**/acquisition/channelValue`        | integer | N/A                                                                                                                                                                                                                                                                         | 4                           | -100    | 100     |
| `configuration/port**X**/negObst/enableNegativeObstacles` | boolean | Enable the detection of negative obstacles                                                                                                                                                                                                                                  | False                       | N/A     | N/A     |
| `configuration/port**X**/seg/minObjectHeight`             | number  | minimum height above ground in [m] for segmented object pixels                                                                                                                                                                                                              | 0.025                       | 0.0     | 1.0     |
| `configuration/version/major`                             | integer | Major part of the version number.                                                                                                                                                                                                                                           | N/A                         | 0       | N/A     |
| `configuration/version/minor`                             | integer | Minor part of the version number.                                                                                                                                                                                                                                           | N/A                         | 0       | N/A     |
| `configuration/version/patch`                             | integer | Patch part of the version number.                                                                                                                                                                                                                                           | N/A                         | 0       | N/A     |
| `configuration/vo/voPorts`                                | array   | List of ports suitable for visual odometry. VO will be applied with the first active port in the list.                                                                                                                                                                      | ['port2', 'port3', 'port4'] | N/A     | N/A     |
| `configuration/zones/zoneConfigID`                        | integer | Will be looped through to the output and can be used to identify zone configurations.                                                                                                                                                                                       | 0                           | N/A     | N/A     |
| `configuration/zones/zoneCoordinates`                     | array   | The coordinates of the configured zones.                                                                                                                                                                                                                                    | []                          | N/A     | N/A     |
| `configuration/zones/zoneType`<sup>new</sup>              | string  | If set to convexHull, the zone is defined as the convex hull of the given list of points. If set to polygon, the zone is defined as a filled polygon. In all cases, cells are considered to be part of the zone if and only if the center of the cell is inside the region. | convexHull                  | N/A     | N/A     |
| name                                                    | string  | User-defined application name                                                                                                                                                                                                                                               | N/A                         | N/A     | N/A     |
| `ports`                                                   | array   | The ports that can be used by the application (camera heads and `IMU`)                                                                                                                                                                                                      | ['port6', 'port0']          | N/A     | N/A     |
| `presets/command`<sup>new</sup>                           | string  | Preset command to be executed. For more details, please refer [presets documentation](../Presets/presets.md#command)                                                                                                                                                                                                                                               | nop                         | N/A     | N/A     |
| `presets/definitions`<sup>new</sup>                       | object  | Preset definitions                                                                                                                                                                                                                                                          | {}                          | N/A     | N/A     |
| `presets/load/identifier`<sup>new</sup>                   | integer | Preset identifier to be applied                                                                                                                                                                                                                                             | 0                           | 0       | 127     |
| `presets/location`<sup>new</sup>                          | string  | Location at which presets are applied                                                                                                                                                                                                                                       | N/A                         | N/A     | N/A     |
| `state`                                                   | string  | Application state                                                                                                                                                                                                                                                           | CONF                        | N/A     | N/A     |

:::{warning}
- All connected heads have their own specific configuration. However, all heads referenced by the ODS are also configured by the application itself. **Only `channelValue` and `minObjectHeight` can be changed by the user and for each port separately**. 
- From the FW 1.10.13, the default channel values will be set to 2*<Port Number>.
- The general configuration of ports (`{"ports":{"port2":...}}`) must not be changed by the user.
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
{
    "applications":{
        "instances":{
            "appX":{
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
            }
        }
    }
}
```


## State

To activate/deactivate the application use the following definition:

- Active: `RUN`
- Inactive: `CONF`

:::{note}
To ensure that restarting the data stream is as quick as possible, we recommend keeping the application always in "RUN" state. For an inactive application, set the `activePorts` list to an empty list `[]`.
:::
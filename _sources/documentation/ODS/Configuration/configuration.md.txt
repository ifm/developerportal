# Configuration

| Parameter                                         | Description                                                                                                                                                                         |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                                            | Providing a custom name for the ODS application                                                                                                                                     |
| `ports`                     | The used ports (camera heads and imu) - ["port2","port3","port6"]                                                                                                                   |
| `grid/overhangingLoads` |A static region defined in vehicle coordinate system which is excluded from ODS|
| `portX/acquisition/channelValue` | The channel [-100, 100] to use for a specific port to mitigate interference. Channel values should differ of at least 2.                                                            |
| `portX/seg/minObjectHeight`                       | Minimum object height in [m] e.g. 0.025[m]. This does not mean that any objects of this height will always be detected, but that object below this height will *never* be detected. |
| `vo`                          | Visual Odometry - define a port which is the main head for visual odometry (e.g. `2 for "port2"`)                                                                                   |
| `state`                     | The current state - "RUN"/"CONF"                                                                                                                                                    |
| `zones`                 | Define the used zones - [See `ods zone definition` for a complete description](../Zones/zones.md)                                                                                       |
| `zones/maxHeight`                                 | Ceiling value above which all obstacles are ignored. Applies to all zones and to the occupancy grid.                                                                                |


:::{warning}
All connected heads have their own specific configuration. However, all heads referenced by ODS are also configured by the application itself. **Only `channelValue` and `minObjectHeight` shall be changed by the user and for each port separately**. The general configuration of ports (`{"ports":{"port2":...}}`) must not be changed by the user.
:::

## Channel value

The 3D imagers use the `TOF` - [TimeOfFlight](https://en.wikipedia.org/wiki/Time-of-flight_camera) - technology to calculate 3D data.
Due to this technical approach, it might happen that two heads are interfering with each other. Providing different channel values (i.e. slightly different modulation frequencies), from -100 up to 100, for each head helps mitigate this issue. Pick channel values at least two digits apart of each other.

```JSON title="Channel value"
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
```

## Minimum object height

It is possible to change the minimum object height to improve ODS for certain conditions. ODS can use several heads for detecting obstacles. The heads themselves might be different (opening angle of 105° or 60°), and the mounting position of the heads can vary. Therefore the `minObjectHeight` might be different per connected head. The height is provided in [m].
Increasing this value might prevent more false positives caused by the floor and/or smaller objects on the ground.

:::{note}
    Note that this parameter is not the only factor defining whether an object will be detected or not: switching `minObjectHeight` to zero does not mean that every object will be detected. This is especially true for small objects on the floor, where pointcloud artifacts are the most pronounced.
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

Provide this information to the system to change the state of ODS.

```JSON title="RUN/CONF"
"state": "RUN"
```

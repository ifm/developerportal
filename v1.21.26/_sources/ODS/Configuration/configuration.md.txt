# Configuration

:::{include} ../../generated_docs/ods.md
:::

```{include} ../../notices/conf_attribute_note.md
```

:::{warning}

- All connected heads have their own specific configuration. However, all heads referenced by the ODS are also configured by the application itself. **Only `channelValue`, `minObjectHeight` and `enableNegativeObstacles` can be changed by the user and for each port separately**.
- From the FW 1.10.13, the default channel values will be set to 2*`portNumber`. For more details about inter-camera interference refer to [the interference mitigation documentation](../Interference/cross-talk.md).
- The general configuration of ports (`{"ports":{"port2":...}}`) must not be changed by the user.
:::

## Channel values

:::{warning}
The channel value documentation was moved to [the interference mitigation documentation](../Interference/cross-talk.md).
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

## Negative obstacles

For more information regarding the negative obstacles, please refer to this [document](../NegativeObstacles/negative_obstacles.md#negative-obstacles)

## Predominant motion direction

From the firmware versions >= 1.20.29, a new diagnostic about the decalibration is introduced to notify the users of any decalibrated cameras and the suggest the estimated extrinsic calibration parameters. To perform this the user has to define the predominant motion direction of the vehicle.

This parameter is used not only for decalibration detection but also in visual odometry. By default, the ODS application assumes the driving direction is parallel to the x-axis of the user's coordinate system. However, users can specify `y` as the predominant direction if the vehicle primarily moves along the y-axis.

## State

To activate/deactivate the application use the following definition:

- Active: `RUN`
- Inactive: `CONF`

:::{note}
To ensure that restarting the data stream is as quick as possible, we recommend keeping the application always in "RUN" state. For an inactive application, set the `activePorts` list to an empty list `[]`.
:::
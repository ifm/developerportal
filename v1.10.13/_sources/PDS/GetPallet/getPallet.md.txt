# `getPallet`

The `getPallet` functionality of PDS is designed to detect the position and orientation of up to 10 pallets in the vicinity of autonomous and semi-autonomous pallet handling vehicles. 
Typically, such a system has a priori knowledge from warehouse management, such as the approximate distance to the pallet and the type of pallet.

`getPallet` supports the picking operation by determining the exact location and orientation of the pallet.

## Usage guidelines
The typical use cases for `getPallet` are pallets with two pockets, either with broad blocks or thin stringers as vertical support structures.

By default, PDS is able to detect pallets with the following characteristics:

| Pallet name                                     | Dimensions                                             | Image                                                 |
| ----------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------- |
| Block pallet (`palletIndex=0`)                  | The pockets width should be between 0.24 and 0.44 m,   | ![Block pallet](./resources/block_pallet.png)         |
|                                                 | The pockets height should be between 0.05 and 0.15 m,  |                                                       |
|                                                 | The blocks should be between 0.05 and 0.40 m.          |                                                       |
| EPAL side pallet (`palletIndex = 2`)            | The pockets width should be between 0.23 and 0.44 m,   | ![EPAL side pallet](./resources/EPAL_side_pallet.png) |
|                                                 | The pockets height should be between 0.10 and 0.15 m,  |                                                       |
|                                                 | The blocks should be between 0.10 and 0.16 m.          |                                                       |
| Stringer pallet<sup>*</sup> (`palletIndex = 1`) | The pockets width should be between 0.40 and 0.55 m,   | ![Stringer pallet](./resources/stringer_pallet.png)   |
|                                                 | The pockets height should be between 0.0.5 and 0.15 m, |                                                       |
|                                                 | The stringers should be between 0.02 and 0.08 m.       |                                                       |

<sup>*</sup> Stringer pallets generally have thin vertical structures and wider pockets.

### Best Practices

- The range for the pocket dimensions are designed to detect large range of pallets. It is always recommended to lower the interval of to your specific pallets for more robust detections and lower the risk of false-positive detections.
- Even the `palletIndex == 2` is standardized for `EPAL_SIDE`, it can also be used for the other pallets without a bottom board if the dimensions are matching to `EPAL_SIDE`.
- Note that only the dimensions of the center block are important. The size of the side blocks can be different from the one specified above and can be parametrized under `configuration/parameter/getPallet/<palletIndex>/stringer`.
- Two pocket pallets with different dimensions than the ones stated above will require specific configuration of the algorithm. To adjust the dimensions of the pockets or the stringers, edit the predefined templates from [3 .... 10] as [0,1,2] are reserved for standard pallets and set the pocket and stringer sizes. See more details at [Custom pallet templates](#custom-pallet-templates).

## Configuration

To execute the `getPallet` command, the `command` parameter of the JSON configuration has to be set to `getPallet`. 
Additionally, extra parameters can be provided such as the estimated distance to the pallet, `depthHint`, the type of pallet, `palletIndex`, and the order in which the results should be displayed in the list of detected pallets, `palletOrder`. 
An example is provided below in JSON, assuming an instantiated PDS application `app0`. 
Note that when using the ifm Vision Assistant, the same structure is reflected in the application parameters.
```json
    {
        "applications": {
            "instances": {
                "app0": {
                    "configuration": {
                        "customization": {
                            "command": "getPallet",
                            "getPallet": {
                                "depthHint": 1.5, 
                                "palletIndex": 0, 
                                "palletOrder": "scoreDescending"
                            },
                        }
                    }
                }
            }
        }
    }
```
:::{note}
Only the `command` parameter has to be provided. The other parameters are optional.
If they are left blank, the algorithm will use the parameters from most recent execution of that command will be applied, or the set of saved settings for the application, if they exist.
:::

### Customization parameters at `configuration/customization`

| Property                | Type    | Description                                                                                                             | Default         | Minimum | Maximum | Enumeration                                        |
| :---------------------- | :------ | :---------------------------------------------------------------------------------------------------------------------- | :-------------- | :------ | :------ | :------------------------------------------------- |
| `getPallet.depthHint`   | number  | Estimated distance between pallet and calibrated coordinate system center in meters. Set to <=0 for automatic detection | 1.5             | N/A     | N/A     | N/A                                                |
| `getPallet.palletIndex` | integer | Index of the parameter set between 0 and 9. Currently configured IDs:                                                   | 0               | 0       | 9       | N/A                                                |
| `getPallet.palletOrder` | string  | Set the order in the list of detected pallets                                                                           | scoreDescending | N/A     | N/A     | `['scoreDescending', 'zDescending', 'zAscending']` |


:::{note}
When detecting multiple pallets simultaneously, the system allows only one `palletIndex` value to be specified, meaning that all pallets must be of the same type.
This means that all the pallets should have the same pocket and stringer dimensions. 
Alternatively, a relaxed parameter set can be used to encompass multiple types of pallets, using [a custom template](#custom-pallet-templates). This will ensure finding pallets of different dimensions, but will increase the necessary processing time.
:::

The default values for each parameter can be different depending on the firmware version used. We recommend to check the current default, min and max values for each parameter using [the schema](../../Technology/configuration.md#json-schema).

:::{note}
Other variants of pallets, having three or more pockets for example, require adjustments of the PDS settings. Reach out to your ifm representative or to the support team for more details.
:::

### Custom pallet templates

By default, PDS provides three pallet templates: block (`palletIndex = 0`), stringer (`palletIndex = 1`), and EPAL side (`palletIndex = 2`).
It is possible for the user to define custom pallet templates for any two pocket pallet by modifying the parameters at `configuration/parameter/X`, where `X` is the index chosen for the template number (up to 9).

Once the template is defined, the corresponding `palletIndex` can be chosen when triggering the `getPallet` command.


| Property                                           | Type    | Description                                                                                                       | Default     | Minimum | Maximum | Enumeration                      |
| :------------------------------------------------- | :------ | :---------------------------------------------------------------------------------------------------------------- | :---------- | :------ | :------ | :------------------------------- |
| `getPallet.X.depthEstimation.fallbackDepthHint`    | number  | default value for Depth Hint, if auto-discovery fails                                                             | 1.5         | 0.1     | N/A     | N/A                              |
| `getPallet.X.depthEstimation.minNumPixels`         | integer | minimum number of valid pixels in the VOI                                                                         | 10          | 1       | N/A     | N/A                              |
| `getPallet.X.depthEstimation.voi.xMax`             | number  | Maximum x-coordinate to estimate depth hint (meters)                                                              | 5           | N/A     | N/A     | N/A                              |
| `getPallet.X.depthEstimation.voi.xMin`             | number  | Minmum x-coordinate to estimate depth hint (meters)                                                               | 0.5         | N/A     | N/A     | N/A                              |
| `getPallet.X.depthEstimation.voi.yMax`             | number  | Maximum y-coordinate to estimate depth hint (meters)                                                              | 0.4         | N/A     | N/A     | N/A                              |
| `getPallet.X.depthEstimation.voi.yMin`             | number  | Minmum y-coordinate to estimate depth hint (meters)                                                               | -0.4        | N/A     | N/A     | N/A                              |
| `getPallet.X.depthEstimation.voi.zMax`             | number  | Maximum y-coordinate to estimate depth hint (meters)                                                              | 0.4         | N/A     | N/A     | N/A                              |
| `getPallet.X.depthEstimation.voi.zMin`             | number  | Minmum z-coordinate to estimate depth hint (meters)                                                               | -0.1        | N/A     | N/A     | N/A                              |
| `getPallet.X.detectionPipeline`                    | string  | Pipeline type for detecting pallet features                                                                       | findCorners | N/A     | N/A     | `['findCorners', 'findPockets']` |
| `getPallet.X.localizePallets.allowPitchEstimation` | boolean | Whether this pallet template can reliably estimate pitch. Intended for machined, high-quality calibration targets | False       | N/A     | N/A     | N/A                              |
| `getPallet.X.localizePallets.yawTol`               | number  | Maximum absolute yaw angle in radians                                                                             | 0.4         | 0       | N/A     | N/A                              |
| `getPallet.X.name`                                 | string  | Descriptive name of the recipe. Note that the name will be truncated to PDS_MAX_PALLET_NAME_STRLEN.               | Block       | N/A     | N/A     | N/A                              |
| `getPallet.X.orthoProjection.voi.xMax`             | number  | Maximum x-coordinate for projection, relative to the depth hint (meters)                                          | 0.3         | -0.5    | 0.5     | N/A                              |
| `getPallet.X.orthoProjection.voi.xMin`             | number  | Minmum x-coordinate for projection, relative to the depth hint (meters)                                           | -0.3        | -0.5    | 0.5     | N/A                              |
| `getPallet.X.orthoProjection.voi.yMax`             | number  | Maximum y-coordinate for projection in calibrated coordinate system (meters)                                      | 1           | -2      | 2       | N/A                              |
| `getPallet.X.orthoProjection.voi.yMin`             | number  | Minmum y-coordinate for projection in calibrated coordinate system (meters)                                       | -1          | -2      | 2       | N/A                              |
| `getPallet.X.orthoProjection.voi.zMax`             | number  | Maximum y-coordinate for projection in calibrated coordinate system (meters)                                      | 0.6         | -2      | 2       | N/A                              |
| `getPallet.X.orthoProjection.voi.zMin`             | number  | Minmum z-coordinate for projection in calibrated coordinate system (meters)                                       | -0.6        | -2      | 2       | N/A                              |
| `getPallet.X.pocket.maxHeight`                     | number  | Maximum pocket height in meters (ignored when finding whole pockets)                                              | 0.15        | N/A     | N/A     | N/A                              |
| `getPallet.X.pocket.maxWidth`                      | number  | Maximum pocket width in meters (ignored when finding whole pockets)                                               | 0.44        | N/A     | N/A     | N/A                              |
| `getPallet.X.pocket.minHeight`                     | number  | Minimum pocket height in meters                                                                                   | 0.05        | N/A     | N/A     | N/A                              |
| `getPallet.X.pocket.minWidth`                      | number  | Minimum pocket width in meters                                                                                    | 0.24        | N/A     | N/A     | N/A                              |
| `getPallet.X.stringer.maxWidthCenter`              | number  | Maximum width of the center stringer in meters                                                                    | 0.4         | N/A     | N/A     | N/A                              |
| `getPallet.X.stringer.minWidthCenter`              | number  | Minimum width of the center stringer in meters                                                                    | 0.05        | N/A     | N/A     | N/A                              |

#### Detection pipeline
When defining a custom pallet template, the user has to chose the proper detection pipeline. 
Two options are available: `findPockets` and `findCorners`. Depending on the use case, one option might be more suitable than the other.

`findPocket` relies on a strict pocket dimension. In this case, only the `minWidth` and `minHeight` pocket parameters are used, and the `maxWidth` and `maxHeight` are ignored.
It offers limited flexibility in terms of pocket size, but it is the most robust option when shrink wrap is partially covering a pocket. It is also able to detect open pockets, for example in the case of the EPAL side.

`findCorners` can handle a wider variety of pocket sizes, as it relies on finding four corners, rather than a pocket shape. However, it cannot handle open pockets. It will also be typically slower to produce a result.

![`localizePallet` and `detectionPipeline` parameters](./resources/pallet_params_1.png)

![`pocket` and `stringer` parameters](./resources/pallet_params_5.png)

#### Volumes of interest

When searching for a pallet, the PDS algorithm does not explore the entire space, but focuses the search on the `orthoProjection` volume.
This is done to reduce processing time by limiting the search area.

The `orthoProjection` volume is defined in the parameters (at `/applications/instances/appX/configuration/parameter/getPallet/n/orthoProjection`, where `n` is the pallet template number), or automatically if using the automatic depth hint feature (`depthHint = -1`).

When using the ifm Vision Assistant, the`orthoProjection` volume, and the `depthHint` search volume can be displayed as shown below, where the green box represents the projection volume and the blue box represents the depth estimation volume.
![volumes](./resources/pds_volumes_of_interest.png)

##### Depth estimation volume
The depth estimation volume, `depthEstimationVoi`, defines the volume of interest for automatic depth estimation. 
Within this volume, a search will be conducted to estimate the distance of the pallet's front face from the reference coordinate system.

In most cases, we recommend using a predefined depth hint, in which case this volume will not be used.
Alternatively, the depth estimation volume can be adjusted in the parameters, at `/applications/instances/appX/configuration/parameter/getPallet/n/depthEstimation/voi`.

![`depthEstimation` parameters](./resources/pallet_params_2.png)
![`depthEstimation` parameters](./resources/pallet_params_3.png)

##### Ortho-projection volume
The projection volume, `orthoProjection/voi`, defines the volume of interest for detecting the pose of the pallet pockets and center beam. 
This volume is centered around the `depthHint`, estimated or provided by the user, which represents the estimated distance to the front face of the pallet.

Using the default values for the projection volume is typically sufficient.
However, to achieve optimal processing speed, it is recommended to tighten 

![`orthoProjection` parameters](./resources/pallet_params_4.png)

## Workflow

The `getPallet` command expects the pallet to be in front of the forks and in the field of view of the camera, as illustrated below. 

![expected](resources/expected.drawio.svg)

The `getPallet` command works as follows:
1. If the `depthHint` is set to a positive value (this is the recommended option), the user is expected to have a priori knowledge about where the pallet is with respect to the forks coordinate system. In this case, the pallet's pose estimation is performed inside the ortho-projection volume.
2. If the `depthHint` is set to zero or a negative value, then the pallet will be searched for in the depth estimation volume. The majority of the pixels inside the depth estimation volume should be on the plane of the front face of the pallet. Once the distance to the pallet is estimated, the projection volume is set at this distance including a buffer in X direction on each side. The pixels in the projection volume will be used to estimate the position of the pallet. 
3. The algorithm searches for a pallet that fits the template corresponding to the chosen `palletIndex`. If not pallet is found, the user should attempt to relax the settings, to avoid a failed detection and calling for rescue.


For further details of a typical `getPallet` trigger sequence see the flowchart below.

![flowchart](./resources/getPallet_flowchart.drawio.svg)

## Results

The output of a `getPallet` command is formatted in JSON. 
An example JSON result, where the position of one pallet was identified, is shown below:
```json
"getPallet": {
    "pallet": [
        {
            "angles": {
                "rotX": -0.0016640322282910347,
                "rotY": 0,
                "rotZ": -0.02186517044901848
            },
            "center": {
                "height": 0.10177253931760788,
                "position": {
                    "x": 1.405822515487671,
                    "y": -0.08359906077384949,
                    "z": 0.07647071033716202
                },
                "width": 0.12625007331371307
            },
            "left": {
                "height": 0.10320165008306503,
                "position": {
                    "x": 1.4106969833374023,
                    "y": 0.13937455415725708,
                    "z": 0.07622720301151276
                },
                "width": 0.320925772190094
            },
            "right": {
                "height": 0.10034343600273132,
                "position": {
                    "x": 1.4009480476379395,
                    "y": -0.30657267570495605,
                    "z": 0.07671421766281128
                },
                "width": 0.3186997175216675
            }
        }
    ],
    "depthEstimationVoi": {
        "xMax": 3,
        "xMin": 1,
        "yMax": 0.4000000059604645,
        "yMin": -0.4000000059604645,
        "zMax": 0.4000000059604645,
        "zMin": -0.10000000149011612
    },
    "projectionVoi": {
        "xMax": 1.600000023841858,
        "xMin": 1.1999999284744263,
        "yMax": 1,
        "yMin": -1,
        "zMax": 0.6000000238418579,
        "zMin": -0.6000000238418579
    }
},
```
The output has three main components: `pallet`, `depthEstimationVoi` and `projectionVoi`.

### `pallet`
This component of the JSON result lists all the detected pallets (up to 10). 
For each pallet, the following information is provided:
| Name                         | Description                                                                                                                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `angles`                     | Rotations components `rotX`, `rotY` and `rotZ` of the pallet, along the three axis of the calibrated coordinate system, in radians.                                                                                                |
| `center`, `left` and `right` | Position and size of the center beam, the left pocket and the right pocket respectively. <br>For each, the width and height is provided, as well as the coordinates of the center of the pocket or beam along the X, Y and Z axis. |

:::{note}
Per default the pitch estimation `rotY` is disabled and will always display `0`.
:::

### `depthEstimationVoi` and `projectionVoi`

The `depthEstimationVoi` and `projectionVoi` components provide the volumes that were used internally to detect the pallet:
| Name                 | Description                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `depthEstimationVoi` | Volume used in the algorithm to approximate the position of the front face of the pallet. |
| `projectionVoi`      | Volume where the detection takes place. The pixels outside this area are discarded.       |

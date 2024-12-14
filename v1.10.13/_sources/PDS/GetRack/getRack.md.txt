# `getRack`

The `getRack` functionality of PDS is designed to help an AGV safely place a pallet or load into a standard racking system. The `getRack` function has two phases:
   1. Detection of the position of the rack, 
   2. Detection of any obstacle present within a specified volume.

![`getRack`](resources/getRack_result_array.png)

In the above picture, the vertical blue line represents the estimated inner edge of the upright structure, and the horizontal green line represents the estimated upper edge of the horizontal beam, constituting the shelf on which the pallet will be placed.

## Coordinate system

The origin of the rack coordinate system is the intersection of the detected upright and the beam, on the plane formed by the beam and the upright's front faces.
If the detected upright and beam do not intersect, the origin of the rack coordinate will be placed at the intersection of the horizontal beam and the line which is orthogonal to both the beam and the upright.
If the left upright is segmented then the Y-axis of the established rack coordinate system points to the right and if the right upright is segmented then the Y-axis will point towards the left.

## Configuration

### Command customization
The parameters listed below can be adjusted when triggering the `getRack` command, to define for example the distance to the rack (`depthHint`), or the drop position (`horizontalDropPosition`). 
These parameters are described in the list below:

| Property                         | Type   | Description                                                            | Default  | Minimum | Maximum | Enumeration                   |
| :------------------------------- | :----- | :--------------------------------------------------------------------- | :------- | :------ | :------ | :---------------------------- |
| `getRack.clearingVolume.xMax`    | number | Bounding box dimension of VOI along X-axis - Maximum                   | 1.2      | N/A     | N/A     | N/A                           |
| `getRack.clearingVolume.xMin`    | number | Bounding box dimension of VOI along X-axis - Minimum                   | -0.1     | N/A     | N/A     | N/A                           |
| `getRack.clearingVolume.yMax`    | number | Bounding box dimension of VOI along Y-axis - Maximum                   | 1.3      | N/A     | N/A     | N/A                           |
| `getRack.clearingVolume.yMin`    | number | Bounding box dimension of VOI along Y-axis - Minimum                   | 0.1      | N/A     | N/A     | N/A                           |
| `getRack.clearingVolume.zMax`    | number | Bounding box dimension of VOI along Z-axis - Maximum                   | 0.4      | N/A     | N/A     | N/A                           |
| `getRack.clearingVolume.zMin`    | number | Bounding box dimension of VOI along Z-axis - Minimum                   | 0.1      | N/A     | N/A     | N/A                           |
| `getRack.depthHint`              | number | Estimated distance between rack and coordinate system center in meters | 1.8      | 0       | N/A     | N/A                           |
| `getRack.horizontalDropPosition` | string | Selection of the horizontal drop setting                               | left     | N/A     | N/A     | `['left', 'center', 'right']` |
| `getRack.verticalDropPosition`   | string | Selection of the vertical drop setting                                 | interior | N/A     | N/A     | `['interior', 'floor']`       |
| `getRack.zHint`                  | number | Estimated z-coordinate of the rack shelf in meters                     | -0.4     | N/A     | N/A     | N/A                           |

### Custom rack parameters

In typical scenarios, using the default parameters at `configuration/parameters/getRack` will be sufficient. 
However, in some cases they need to be adjusted, for example to handle a custom type of rack. In this case, specific dimensions can be provided for the beam height, the upright width, etc. 
See the list below for the details of the available parameters.

| Property                                    | Type    | Description                                                                                 | Default | Minimum | Maximum | Enumeration |
| :------------------------------------------ | :------ | :------------------------------------------------------------------------------------------ | :------ | :------ | :------ | :---------- |
| `getRack.beam.freeSpaceBelow`               | number  | Minimum free space required for a valid beam below the bottom edge in meters                | 0.05    | 0       | N/A     | N/A         |
| `getRack.beam.histWidthThresh`              | number  | Width threshold in meters along y-axis for histogram to be considered as beam candidates    | 1       | N/A     | N/A     | N/A         |
| `getRack.beam.maxHeight`                    | number  | Maximum height for beam validation in meters                                                | 0.15    | N/A     | N/A     | N/A         |
| `getRack.beam.minHeight`                    | number  | Minimum height for beam validation in meters                                                | 0.06    | N/A     | N/A     | N/A         |
| `getRack.beam.voi.xMax`                     | number  | Bounding box dimension of VOI along X-axis - Maximum                                        | 0.23    | N/A     | N/A     | N/A         |
| `getRack.beam.voi.xMin`                     | number  | Bounding box dimension of VOI along X-axis - Minimum                                        | -0.23   | N/A     | N/A     | N/A         |
| `getRack.beam.voi.yMax`                     | number  | Bounding box dimension of VOI along Y-axis - Maximum                                        | 1.2     | N/A     | N/A     | N/A         |
| `getRack.beam.voi.yMin`                     | number  | Bounding box dimension of VOI along Y-axis - Minimum                                        | -1.2    | N/A     | N/A     | N/A         |
| `getRack.beam.voi.zMax`                     | number  | Bounding box dimension of VOI along Z-axis - Maximum                                        | 0.4     | N/A     | N/A     | N/A         |
| `getRack.beam.voi.zMin`                     | number  | Bounding box dimension of VOI along Z-axis - Minimum                                        | -0.4    | N/A     | N/A     | N/A         |
| `getRack.floorDrop.yRackOriginLeft`         | number  | Expected `y_val` of the rack origin for the HPOS = left drop                                  | 0.61    | N/A     | N/A     | N/A         |
| `getRack.floorDrop.yRackOriginRight`        | number  | Expected `y_val` of the rack origin for the HPOS = right drop                                 | -0.61   | N/A     | N/A     | N/A         |
| `getRack.floorDrop.yRackOriginTol`          | number  | Tolerance for difference in expected and computed rack origin                               | 0.3     | N/A     | N/A     | N/A         |
| `getRack.rackVolCheck.obstThresh`           | integer | Threshold for number of pixels in the rack shelf to be considered for obstacle flag         | 10      | N/A     | N/A     | N/A         |
| `getRack.transform.beamOnlyObstThresh`      | integer | Number of obstacle pixels threshold during beam-only localization sweep                     | 5       | 1       | N/A     | N/A         |
| `getRack.transform.voi.xMax`                | number  | Bounding box dimension of VOI along X-axis - Maximum                                        | 1.2     | N/A     | N/A     | N/A         |
| `getRack.transform.voi.xMin`                | number  | Bounding box dimension of VOI along X-axis - Minimum                                        | -0.3    | N/A     | N/A     | N/A         |
| `getRack.transform.voi.yMax`                | number  | Bounding box dimension of VOI along Y-axis - Maximum                                        | 1.2     | N/A     | N/A     | N/A         |
| `getRack.transform.voi.yMin`                | number  | Bounding box dimension of VOI along Y-axis - Minimum                                        | -1.2    | N/A     | N/A     | N/A         |
| `getRack.transform.voi.zMax`                | number  | Bounding box dimension of VOI along Z-axis - Maximum                                        | 0.6     | N/A     | N/A     | N/A         |
| `getRack.transform.voi.zMin`                | number  | Bounding box dimension of VOI along Z-axis - Minimum                                        | -0.3    | N/A     | N/A     | N/A         |
| `getRack.transform.yRackOriginLeft`         | number  | Expected `y_val` of the rack origin for the HPOS = left drop                                  | 0.61    | N/A     | N/A     | N/A         |
| `getRack.transform.yRackOriginRight`        | number  | Expected `y_val` of the rack origin for the HPOS = right drop                                 | -0.61   | N/A     | N/A     | N/A         |
| `getRack.transform.yRackOriginTol`          | number  | Tolerance for difference in expected and computed rack origin                               | 0.3     | N/A     | N/A     | N/A         |
| `getRack.upright.histHeightThresh`          | number  | Height threshold in meters along z-axis for histogram to be considered as upright candidates | 0.7     | N/A     | N/A     | N/A         |
| `getRack.upright.maxWidth`                  | number  | Maximum width for upright validation in meters                                              | 0.12    | N/A     | N/A     | N/A         |
| `getRack.upright.minWidth`                  | number  | Minimum width for upright validation in meters                                              | 0.03    | N/A     | N/A     | N/A         |
| `getRack.upright.protrusionAboveBeamThresh` | number  | Threshold for Protrusion above beam edge in meters to be considered for upright candidates  | 0.05    | N/A     | N/A     | N/A         |
| `getRack.upright.voi.xMax`                  | number  | Bounding box dimension of VOI along X-axis - Maximum                                        | 0.23    | N/A     | N/A     | N/A         |
| `getRack.upright.voi.xMin`                  | number  | Bounding box dimension of VOI along X-axis - Minimum                                        | -0.23   | N/A     | N/A     | N/A         |
| `getRack.upright.voi.yMax`                  | number  | Bounding box dimension of VOI along Y-axis - Maximum                                        | 1.2     | N/A     | N/A     | N/A         |
| `getRack.upright.voi.yMin`                  | number  | Bounding box dimension of VOI along Y-axis - Minimum                                        | -1.2    | N/A     | N/A     | N/A         |
| `getRack.upright.voi.zMax`                  | number  | Bounding box dimension of VOI along Z-axis - Maximum                                        | 0.6     | N/A     | N/A     | N/A         |
| `getRack.upright.voi.zMin`                  | number  | Bounding box dimension of VOI along Z-axis - Minimum                                        | -0.6    | N/A     | N/A     | N/A         |

For a visual representation of the available parameters, refer to the images below:

![`depthHint`, `zHint` and `dropPosition`](./resources/rack_params_1.png)
![`clearingVolume`](./resources/rack_params_2.png)
![center drop](./resources/rack_params_3.png)
![`beam` parameters](./resources/rack_params_4.png)
![`beam` parameters](./resources/rack_params_5.png)
![`floorDrop` parameters](./resources/rack_params_6.png)
![`rackVolCheck`](./resources/rack_params_7.png)
![`transform`](./resources/rack_params_8.png)
![`upright` parameters](./resources/rack_params_9.png)
![`upright` parameters](./resources/rack_params_10.png)


## Results

The output of a `getRack` command is formatted in JSON.
An example JSON result, where the position of the rack was identified is shown below:
```json
"getRack": {
   "angles": {
      "rotX": 0.00089085,
      "rotY": 0.00410702,
      "rotZ": 0.0177895
   },
   "flags": 0,
   "horBeamVoi": {
      "xMax": 1.63,
      "xMin": 1.17,
      "yMax": 1,
      "yMin": -1,
      "zMax": -0.105,
      "zMin": -0.805
   },
   "numPixels": 0,
   "position": {
      "x": 1.46194,
      "y": 0.636352,
      "z": 0.491981
   },
   "flagDescription": [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
   ]
   "side": "left",
   "uprightVoi": {
      "xMax": 1.63,
      "xMin": 1.17,
      "yMax": 1.2,
      "yMin": 0,
      "zMax": 1.3,
      "zMin": -0.3
   }
}
```
### `angles`, `position` and `side`

| Name       | Description                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `angles`   | Three rotation components, `rotX`, `rotY` and `rotZ` of the rack coordinates system in radians. |
| `position` | The `x`, `y` anx `z` coordinates of the origin of the rack coordinate system.                   |
| `side`     | Type of the rack coordinate system. Either "right" for right-handed or "left" for left-handed.  |

### `flags` and `flagDescription`

The `flags` provides a bitmask with debugging information for `getRack`.

| Bit No. | Name                | Description                                                                                                                                   |
| ------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 0       | `NO_BEAM`           | The horizontal beam of the rack grid location could not be segmented.                                                                         |
| 1       | `MULTIPLE_BEAMS`    | Multiple horizontal beam candidates were segmented, the most plausible was selected.                                                          |
| 2       | `BEAM_COVERAGE`     | The threshold of pixel coverage over the surface area of the beam was not met.                                                                |
| 3       | `NO_UPRIGHT`        | A vertical upright was not detected, the rack frame was established based on the segmented beam, sweeping volume, and (optionally) the floor. |
| 4       | `MULTIPLE_UPRIGHTS` | Multiple upright candidates (on the anchor side of interest) were segmented, the most plausible was selected.                                 |
| 5       | `UPRIGHT_COVERAGE`  | The threshold of pixel coverage over the surface area of the upright was not met.                                                             |
| 6       | `NO_JOIN`           | The relative position of the upright candidate and the horizontal beam is implausible.                                                        |
| 7       | `BAD_TRANSFORM`     | The origin of the computed rack frame is outside of an expected tolerance (indicative of a beam-only localization anchoring to an obstacle).  |
| 8       | `SHELF_OBSTACLE`    | An obstacle was detected within the shelf sweeping volume with respect to the established rack frame.                                         |

The resultant flag value is a decimal value representing which flags are activated or not.
For example, if the value of the flag is set to 384 then the resultant binary value is `11000000`, that is, bit numbers 7 and 8 were set to 1 (`BAD_TRANSFORM` and `SHELF_OBSTACLE`).

The `flagDescription` parameter is a list of strings that correspond to the active `flags`. For example, if the `flags` value is `384`, the `flagDescription` list will be `["", "", "", "", "", "", "", "BAD_TRANSFORM", "SHELF_OBSTACLE"]`

In the below section, the possible reasons why the flags are set are discussed in detail.

#### `NO_BEAM`

The horizontal beam of the rack grid location could not be segmented (this is a critical error). Possible reasons are:
   - Incorrect `depthHint`: the algorithm looks for the beams around the given depth hint. The default tolerance for depth hint is 0.23 m,
   - Incorrect Z-hint: the algorithm looks for beams around the provided Z-hint. The default tolerance is 0.4 m,
   - No beam candidate meets the minimum length requirement: the algorithm looks for beams with a default minimum length of 1.0 m,
   - No beam candidate meets min or max height requirement: the algorithm looks for beams with a minimum or maximum height of respectively 6 and 15 cm.
   - A space of at least 0.05 m is expected below the beam to avoid considering the top of another loaded pallet as a beam.

#### `MULTIPLE_BEAMS`

Multiple horizontal beam candidates were segmented, and the one with the largest extent in the Y-direction was selected. This does not mean that the detection was unsuccessful. If multiple beams are not expected, then the user can abort the operation.
Possible reasons are:
   - Presence of a loaded pallet or other obstacle above or below the beam,
   - Presence of a true second beam in the scene,
   - More than one beam candidate meets the minimum length and minimum or maximum height requirements.

#### `BEAM_COVERAGE`

A threshold of pixel coverage over the surface area of the beam was not met. Possible reasons are:
   - The segmented beam has lots of non-planar points,
   - The segmented beam does not meet the minimum coverage requirement.

#### `NO_UPRIGHT`

A vertical upright was not detected, and the rack frame was established based on the segmented beam, sweeping volume, and (optionally) the floor. Possible reasons are:
   - Incorrect `horizontalDropPosition`: the algorithm looks to either the right side or left side, not to both sides except `horizontalDropPosition = center`,
   - No upright close to the beam,
   - No upright candidate meets the minimum length requirement: the algorithm looks for uprights with a minimum length of 0.7 m,
   - No upright candidate meets the minimum or maximum width requirement: the algorithm looks for uprights with a minimum or maximum width of respectively 3 or 12 cm by default.

#### `MULTIPLE_UPRIGHTS`

Multiple upright candidates (on the anchor side of interest) were segmented. The leftmost or the rightmost was selected, depending on the `horizontalDropPosition`. 
This does not mean that the detection was unsuccessful. 
If multiple uprights are not expected, then the user can abort the operation. 
Possible reasons are:
   - Loaded pallet or other obstacle above or below the beam,
   - True second upright in the scene,
   - More than one upright candidate meets the minimum length and minimum or maximum width requirements.

#### `UPRIGHT_COVERAGE`

A threshold of pixel coverage over the surface area of the upright was not met. Possible reasons are:
   - The segmented upright has lots of non-planar points,
   - The segmented upright does not meet the minimum coverage requirement (after 3D plane fit).

:::{note}
   If `NO_UPRIGHT` flag is set, then `UPRIGHT_COVERAGE` is also set. 
:::

#### `NO_JOIN`

The relative position of the upright candidate with respect to the horizontal beam is implausble.
Possible reasons are:
   - The segmented beam and segmented upright do not intersect.
   - The upright detection failed, most likely because it is not visible.

:::{note} 
   If `NO_UPRIGHT` flag is set, then `NO_JOIN` is also set.
:::

#### `BAD_TRANSFORM`

The origin of the computed rack frame is outside of an expected tolerance (indicative of a beam-only localization anchoring to an obstacle). Possible reasons are:
   - Position of selected upright deviates from expected position (only Y-coordinate is considered): the algorithm expects the upright to be within tolerance on either the left side or right side.

#### `SHELF_OBSTACLE`

An obstacle was detected within the shelf sweeping volume with respect to the established rack frame. Possible reasons are:
   - The maximum number of pixels within the clearing volume was exceeded (default: 10).


### `horBeamVoi` and `uprightVoi`
| Name         | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| `horBeamVoi` | Volume in which the algorithm searches for an horizontal beam. |
| `uprightVoi` | Volume in which the algorithm searches for a vertical upright. |

### `numPixels`

| Name        | Description                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `numPixels` | The number of pixels in the volume of interest. Typically, this is used to verify that the rack is empty before dropping a load. |

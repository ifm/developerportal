# Occupancy grid

## Output

| Name                      | Type           | Description                                                                              |
| ------------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| `timestamp_ns`              | uint64         | timestamp of occupancy grid in nanoseconds - NTP time if NTP server is synchronized             |
| `width`                     | uint16         | number of grid cells - width (x)                                                         |
| `height`                    | uint16         | number of grid cells - height (y)                                                        |
| `transformCellCenterToUser` | float[2][3]    | affine mapping between grid cells and user coordinate system                             |
| `image`              | uint8[200*200] | uint8 array of width x height pixels; 0: object probability 0; 255: object probability 1 |

### Timestamp

Every ODS data package (chunk) also contains a timestamp[ns]. If a `NTP-server` is provided, the timestamp[ns] is synchronized.

### Width & Height

Width[int] and height[int] of the occupancy grid (amount of cells within the grid).

### Image

The occupancy grid information is an array[width*height], containing the probability of the cell being occupied. Every ODS application forwards one single occupancy grid. All connected heads are publishing their information into this single grid. The center of the grid corresponds to the center of the reference coordinate frame, that is the robot's coordinate frame defined during the calibration.

We recommend using a probability threshold of 0.5 (127) to assess whether a cell is occupied or not.


### transformCellCenterToUser - transformation parameters

Affine mapping between grid cells and user coordinate system. Multiplying the matrix with [0,0,1] gives the user coordinate of the center of the upper left cell.

Below an example of the transformation instruction from occupancy grid (affine) coordinates to the Robot Coordinate System (RCS) is documented.

#### Transformation matrix parameters
This matrix allows to transform the occupancy grid into the user frame. It is a two dimensional array like:

```json title="Transformation parameters: affine mapping"
[
    [0,1,1],
    [1,0,1],
]
```
#### Occupancy grid transformation example

By default the parsed occupancy grid is oriented in such a way that:

+ (pixel coordinates) rows correspond to Y-coordinates in the ODS coordinates system
+ (pixel coordinates) columns correspond to X-coordinates in the ODS coordinates system
+ the occupancy grid image origin (pixel coordinates: r=0, c=0) corresponds to `c_0 = min(X)`, `r_0 = max(Y)`.

If you require the orientation of the occupancy grid to be flipped; this can be achieved via a transposition of the occupancy grid matrix. Please also consider axis dependency and zone dependency when transposing.

For more details on the mathematical relation, that is transformation chains, please see the example code below:

```{literalinclude} /ifm3d-examples/ovp8xx/python/ovp8xxexamples/ods/transform_cell_to_user.py
    :language: python
```
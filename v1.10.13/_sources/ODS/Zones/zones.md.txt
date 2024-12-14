
# Zones

A zone is a user-defined region within the ODS’s detection field where obstacle presence is continuously monitored. Zones are geometric areas that can be configured based on the operational requirements of the AGV or AMR.

Each zone has a simple binary state:

- **1 (True):** Indicates that an obstacle has been detected in the zone.
- **0 (False):** Indicates the zone is clear of obstacles.

:::{important}
  The zone output is influenced not only by the defined zone boundaries but also by `grid` parameters such as `maxHeight`, `overHangingLoads`.

  Additionally, the `minObjectHeight` parameter allows editing the expected minimum object height above the ground (`Z==0` plane) per camera port. The `minObjectHeight` parameter is handled on a per-camera basis to allow fine-tuning for multi-camera setups with different camera mounting heights. For higher mounted cameras the `minObjectHeight` can be lower compared to lower mounted cameras to allow the user to see further away and lower objects relative to the floor plane.
:::

## Parameters

### `zoneConfigID`

The user-defined ID for the currently used zone configuration. This information is passed as an output info so that user can know which zone configuration is currently used by ODS.

### `zoneCoordinates`

The `ODS` offers the flexibility to define up to three distinct zones for monitoring. These zones are configured using polygonal coordinates, offering versatility in shape and size. To define a zone, a minimum of three points is required (forming a triangle), while the maximum number of points depends on the firmware version: up to 16 points for firmware versions 1.10.13 or higher, and up to 6 points for earlier versions.

### `zoneType`

From the firmware versions 1.10.13 or higher, user can choose the zone type from `convexHull` or `polygon`.

When configured as `convexHull`, the zone is automatically defined as the convex hull encompassing the provided list of points, forming the smallest convex boundary that includes all specified points. When set to `polygon`, the zone is defined as a filled polygon precisely shaped by the given coordinates.

:::{important}
  Irrespective of `zoneType`, a grid cell is considered part of the zone only if the center of the cell lies within the defined region, ensuring accurate and consistent detection boundaries.
:::

![Zone Configuration](img/set_example_zones.gif)

## Output

The Output of the Zones is contained in `buffer_id.O3R_ODS_INFO`, which is formatted as follows:

| Name           | Type    | Description                                                                         |
| -------------- | ------- | ----------------------------------------------------------------------------------- |
| `timestamp_ns` | uint64  | timestamp of occupancy grid in nanoseconds - NTP time if NTP server is synchronized |
| `zoneOccupied` | int8[3] | a flag for each zone describing whether it is occupied or free                      |
| `zoneConfigID` | uint32  | the user-defined ID for the zone configuration                                      |

The output of the zones can be easily deserialized, for more information please visit [the ifm3d deserializer documentation](https://api.ifm3d.com/stable/examples/o3r/deserialize/deserialize.html).

You can also view the zones' output at the bottom left corner of the `Application` window as shown in the below figure.

![Zone Output](img/zone_output_iVA.png)

### Timestamp

Every ODS frame also contains a timestamp in nanoseconds. If a `NTP-server` is provided, the timestamp is synchronized. Learn more about timestamps in [the timestamps documentation](../../Technology/VPU/Timestamps/timestamps.md).

## Examples

### Only one zone

```json
{
  "zoneCoordinates": [[[1.0,1.0], [1.0,0.0], [-1.0, 0.0], [-1.0, 1.0]]]
}
```

The JSON shown here is the convex hull of one zone, the red zone presented in the image above (2D on the ground plane).
The width (lateral size, that is in Y-direction) is 2 m. The length (longitudinal size, that is in X-direction) is 1 m.

### Three zones

```json
{
  "zoneCoordinates": [
    [[0,1],[1,1],[1,-1],[0,-1]],
    [[1,1],[2,1],[2,-1],[1,-1]],
    [[2,1],[3,1],[3,-1],[2,-1]]
  ]
}
```

### Example output

In current FW versions the configuration and output of zones is limited to three.
Trying to set 4 zones in the JSON configuration will result in a JSON schema error: ifm3d / ifm3dpy custom error.

The zone evaluation output is also limited to three zones. Independently of how many zones are configured, one zone output is a vector of three elements.
The first element pertains to the first zone, the second element to the second zone, etc.

The example array below shows the output of 10 consecutive frames buffered into one array.

```python
array([[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], dtype=uint8)

```

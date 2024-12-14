# Inertial Measurement Unit (IMU)

The VPU includes a built-in Inertial Measurement Unit (IMU) which is always mapped to the virtual port `port 6`. The IMU measures the rotation rates - gyroscope `[rad/sec]` and acceleration - accelerometer `[m/sec]` in three-dimensional space w.r.t to the VPU coordinate frame (extrinsic calibration). The IMU sample rate is `1 KHz` per default.

Users can access the IMU data in firmware versions 1.4.30 and higher.

## Configuration

| Parameter                  | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `state`                    | Configure the IMU state.                           |
| `mode`                     | Only one mode is available: `imu_1_khz`            |
| `acquisition/pollrate`     | The rate at which the data is polled from the IMU. |
| `data/availablePCICOutput` | The `buffer_id` of the PCIC output.                |

Changing the `pollrate` parameter to a higher value may affect the CPU load. Configuring this value lower than `8` can lead to diagnostic `RECEIVED_IMPLAUSIBLE_IMU_DATA`.

:::{note}
To check the minimum and maximum limits, as well as the default value for each parameter, the user can refer to the schema. 

For example, use the ifm3d API with:
```bash
$ ifm3d jsonschema | jq .properties.ports.properties.port6.properties.acquisition.properties.pollrate
{
  "attributes": [
    "conf"
  ],
  "default": 20,
  "description": "Pollrate of the IMU",
  "maximum": 200,
  "minimum": 1,
  "multipleOf": 1,
  "readOnly": false,
  "type": "integer"
}

```
:::

## Output

Each frame received from the `IMU` contains the following output.

| Description                                                                    | Type                            |
| ------------------------------------------------------------------------------ | ------------------------------- |
| The current version of IMU                                                     | `int`                           |
| The list of IMU samples. The number of elements in list depends on `pollrate`. | `Array`                         |
| The IMU sample data                                                            | `IMUSample`                     |
| Number of samples received                                                     | `int`                           |
| Extrinsic calibration parameters IMU with respect to `User`                    | `ExtrinsicCalibrationStructure` |
| Extrinsic calibration parameters IMU with respect to `VPU`                     | `ExtrinsicCalibrationStructure` |
| Receive timestamp                                                              | `int`                           |

### IMUSample

| Description                                                    | Type      |
| -------------------------------------------------------------- | --------- |
| The hardware timestamp, as reported by the IMU                 | `uint16`  |
| Acquisition timestamp: hardware timestamps scaled to OVP time. | `uint64`  |
| IMU temperature                                                | `float32` |
| Linear acceleration along X-Axis (m/sec²)                      | `float32` |
| Linear acceleration along Y-Axis (m/sec²)                      | `float32` |
| Linear acceleration along Z-Axis (m/sec²)                      | `float32` |
| Angular velocity along X-Axis    (rad/sec)                     | `float32` |
| Angular velocity along Y-Axis    (rad/sec)                     | `float32` |
| Angular velocity along Z-Axis    (rad/sec)                     | `float32` |

### ExtrinsicCalibrationStructure
| Description                           | Type      |
| ------------------------------------- | --------- |
| Translation parameter along X-Axis(m) | `float32` |
| Translation parameter along Y-Axis(m) | `float32` |
| Translation parameter along Z-Axis(m) | `float32` |
| Rotation parameter along X-Axis   (m) | `float32` |
| Rotation parameter along Y-Axis   (m) | `float32` |
| Rotation parameter along Z-Axis   (m) | `float32` |

## Example

Accessing the IMU data is possible with the ifm3d API version 1.5.3 and above. As of ifm3d API 1.5.3, a custom deserializer has to be implemented and only a Python example is available.

Please find the Python example code that accesses and prints the IMU data at [ifm3d-examples](https://github.com/ifm/ifm3d-examples/blob/main/ovp8xx/python/ovp8xxexamples/core/imu_data.py)

The output looks like:

```shell
$ python3 imu_data.py 
IMU version: 1

Number of Samples: 51

First sample:
    Hardware timestamp: 19591
    Acquisition timestamp: 1651191293281612492
    Temperature: 32.729469299316406
    Acceleration: 
        x: -0.07661445438861847 
        y: -0.17717093229293823 
        z: -9.770736694335938
    Gyroscope: 
        x: 0.008788431994616985 
        y: -0.006391586735844612 
        z: -0.001065264455974102

Extrinsic IMU to User: 
 rot_x: 0.0 
 rot_y: 3.1415927410125732 
 rot_z: 3.1415927410125732 
 trans_x: 0.05280037596821785 
 trans_y: 0.01630011759698391 
 trans_z: 0.020900148898363113 
 
Extrinsic IMU to VPU: 
 rot_x: 0.0 
 rot_y: 3.1415927410125732 
 rot_z: 3.1415927410125732 
 trans_x: 0.052799999713897705 
 trans_y: 0.016300000250339508 
 trans_z: 0.020899999886751175 
 
Receive Timestamp: 1651191293330924608
```
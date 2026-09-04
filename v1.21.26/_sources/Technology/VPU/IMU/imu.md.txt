# Inertial Measurement Unit (IMU)

The VPU includes a built-in Inertial Measurement Unit (IMU) which is always mapped to the port `port 6`.
The IMU measures the rotation rates - gyroscope `[rad/sec]` and acceleration - accelerometer `[m/sec²]` in three-dimensional space. 
The IMU is IIM-42652, and [the full datasheet can be found on the official TDK website](https://invensense.tdk.com/download-pdf/iim-42652-datasheet/). 
Users can access the IMU data in firmware versions 1.4.30 and higher and ifm3d API version 1.5.3.

## Configuration

A few of the IMU parameters can be configured in the JSON configuration:

| Parameter                  | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `state`                    | Configure the IMU state.                           |
| `mode`                     | Only one mode is available: `imu_1_khz`            |
| `data/availablePCICOutput` | The `buffer_id` of the PCIC output.                |

The default mode, `imu_1_khz`, configures the IMU with the following settings, which cannot be edited by the user:
- The output rate is `1 KHz` for both the gyroscope and acceleration.
- The full-scale range is set to ± 4 g for accelerometer and to ± 500 degrees per second for gyroscope. 
- For both accelerometer and gyroscope, the low-noise mode is enabled. 
- The timestamp resolution is set to 16 µs.

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

The IMU output is unfiltered.
Additionally, the IMU data is not impacted by the extrinsic calibration set for `port6`. Any transformation to a custom coordinate system has to be performed by the user.


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

Accessing the IMU data is possible with ifm3d API version >= 1.5.3. As of ifm3d API 1.5.3, a custom deserializer has to be implemented and only a Python example is available.

Please find the Python example code that accesses and prints the IMU data at [ifm3d-examples](https://github.com/ifm/ifm3d-examples/blob/main/ovp8xx/python/core/imu_data.py)

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
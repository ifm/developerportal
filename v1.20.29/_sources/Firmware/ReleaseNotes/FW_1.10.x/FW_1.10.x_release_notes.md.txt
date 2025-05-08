# Firmware 1.10.13 release notes
The following release note provides an overview of the features of the **Firmware 1.10.13** version.

The firmware update file for the OVP81x devices is available on [ifm.com](https://www.ifm.com).

## Compatibility
### Previous releases
The previous version is v1.4.30.

### Compatible software versions
This firmware release works with the following software package versions.

| Software                 | Version  |
| ------------------------ | -------- |
| ifmVisionAssistant       | >= 2.9.9 |
| ifm3d library            | 1.5.3    |
| ifm3d-ros ROS(1) wrapper | >= 1.1.2 |
| ifm3d-ros2 ROS2 wrapper  | >= 1.2.0 |

### Compatible processing platforms
:::{warning}
FW 1.10.13 does not support the OVP80x family at the moment.
**Do not update an OVP80x with this firmware. Such a FW update will fail, and the device will reboot to the previous FW version installed.**
:::

This firmware release can be applied to the following ifm video processing platforms:

| Article | Description                                                                 |
| ------- | --------------------------------------------------------------------------- |
| OVP810  | Series product with TX2-NX NVIDIA board.                                    |
| OVP811  | Series product with TX2-NX NVIDIA board, including an ODS license.          |
| OVP812  | Series product with TX2-NX NVIDIA board, including a PDS license.          |
| OVP813  | Series product with TX2-NX NVIDIA board, including ODS and PDS licenses.   |

### Supported camera articles
This firmware release supports the following ifm camera articles:

| Camera Article | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| O3R222         | 3D: 38k 224x172, 60°x45° IP50 <br> 2D: 1280x800, 127°x80° |
| O3R225         | 3D: 38k 224x172, 105°x78° IP50 <br> 2D: 1280x800, 127°x80° |

## Base device
### Changed
- The default `channelValue` for 3D port number X [0..5] is changed to 2*X.
- The L4T kernel version is updated to r32.7.5.

## ODS application
### Added
- **Diagnostics for decalibrated camera ports:** A new error, `ERROR_ODSAPP_CAMERA_DECALIBRATED`, is raised if any active camera port is likely to be decalibrated. In this case, the camera calibration should be verified.
- A new parameter, `rangeOfInterest`, allows users to define the maximum range of vision in meters (in robot coordinates). This setting directly impacts the grid shape, which is always square with each dimension containing (`rangeOfInterest`/0.05) × 2 cells at the default resolution of 5 cm.
- ODS supports polygons on the zone interface, allowing for the definition of both convex and concave shapes.
- A preset feature is implemented where the user can load a predefined zone configuration.

### Changed
- The maximum number of points to define a zone is increased from 6 to 16.
- The ODS diagnosis sources are now attached to the specific camera port rather than the overall ODS application, for the following diagnostic messages:
  - `ERROR_ODSAPP_FOV_INSUFFICIENT_FOR_NEGATIVE_OBSTACLES`
  - `ERROR_ODSAPP_CAMERA_DECALIBRATED`
  - `ERROR_ODSAPP_EXTR_DI_CALIB_IMPLAUSIBLE`
  - `ERROR_ODSAPP_VO_EXTR_DI_CALIB_IMPLAUSIBLE`
- A maximum of one ODS instance is allowed. It is expected to use a single ODS application, which is always in `RUN` mode, and to switch the `activePorts` to change which cameras are used.
- The conditions for raising the `ERROR_ODSAPP_VO_EXTR_DI_CALIB_IMPLAUSIBLE` diagnostic message were relaxed.

### Known issues
- The diagnostics activated by the ODS application during the `RUN` state will not be deactivated when the application is set to the `CONF` or `IDLE` state.
- If the negative obstacle feature is enabled, it may happen that the diagnostic message `ERROR_ODSAPP_FOV_INSUFFICIENT_FOR_NEGATIVE_OBSTACLES` is raised even thought the field of view conditions are fulfilled. In this case, negative obstacles will not be properly detected. To fix this, the application should be set to `CONF`, and then to `RUN` again.

## PDS application

- A new Pick and Drop System (PDS) application is added. This is a new feature with firmware 1.10.13. Refer to [the PDS documentation](../../../PDS/index_pds.md) for an overview of the available features.



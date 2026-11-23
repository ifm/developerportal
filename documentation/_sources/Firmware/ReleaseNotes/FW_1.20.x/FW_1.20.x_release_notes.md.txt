# Firmware 1.20.29 release notes
The following release note provides an overview of the features of the firmware 1.20.29.

The firmware update file for the OVP81x devices is available on [ifm.com](https://www.ifm.com).

## Compatibility

### Previous releases

The previous version is v1.10.13

### Compatible software versions

This firmware release works with the following software package versions.

| Software           | Version                 |
| ------------------ | ----------------------- |
| ifmVisionAssistant | >= 2.10.9               |
| ifm3d library      | >= 1.6.8                |

### Compatible processing platforms

:::{warning}
FW 1.20.29 does not support the OVP80x family at the moment.
**Do not update an OVP80x with this firmware. Such a FW update will fail, and the device will reboot to the previous FW version installed.**
:::

This firmware release can be applied to the following ifm video processing platforms:

| Article | Description                                                              |
| ------- | ------------------------------------------------------------------------ |
| OVP810  | Series product with TX2-NX NVIDIA board.                                 |
| OVP811  | Series product with TX2-NX NVIDIA board, including an ODS license.       |
| OVP812  | Series product with TX2-NX NVIDIA board, including a PDS license.        |
| OVP813  | Series product with TX2-NX NVIDIA board, including ODS and PDS licenses. |

### Supported camera articles

This firmware release supports the following ifm camera articles:

| Camera Article | Description                                                |
| -------------- | ---------------------------------------------------------- |
| O3R222         | 3D: 38k 224x172, 60°x45° IP54 <br> 2D: 1280x800, 127°x80°  |
| O3R225         | 3D: 38k 224x172, 105°x78° IP54 <br> 2D: 1280x800, 127°x80° |
| O3R252         | 3D: VGA 640x480, 64°x50° IP54 <br> 2D: 1280x800, 127°x80°  |

## Base device

### Added

- Added the capability to support VGA camera heads(**O3R252**).
- The following features are added to the diagnostic system:
  - A severity field ["info", "minor", "major", "critical"]. Refer to the [the diagnostic documentation](../../../SoftwareInterfaces/ifmDiagnostic/diagnostic.md#events).
  - Group status that reports the general health status of an application or a port,
  - The JSON structure of the diagnostic message was updated to include the new fields (severity, target, etc). Refer to [the diagnostic documentation](../../../SoftwareInterfaces/ifmDiagnostic/index_diagnostic.md) for more details.
- Added the diagnostic `ERROR_DI_GLOBAL_REFLECTOR_HEURISTICS_ACTIVE` to the port when high amplitude object detected and invalidate the corresponding pixels.  
- Added the diagnostic `ERROR_PORT_UNSTABLE_FRAMERATE` when framedrops detected.

### Changed

- Updated diagnostic descriptions and reaction strategies.
- Configuration of ports under `/ports/portX` used by active applications (ODS, PDS, SCC, MCC) is prohibited.
- The L4T kernel version is updated to r32.7.6.

## SCC application

- The Static Camera Calibration (SCC) for extrinsic calibration of cameras is introduced as an embedded application. A wizard is available in the Vision Assistant to simplify its usage.

## ODS application

### Added

- Added possibility to run ODS application with 4 cameras simultaneously.
- Added possibility to determine the application health based on the group severity ["info", "minor", "major", "critical"]. It is recommended to handle the vehicle behavior for example stopping the vehicle if the severity is `critical`, `major` or `not available`.
- Addition of the polar occupancy grid data stream: a compressed version of the occupancy grid using polar coordinates.
- Decalibration warning added: The system now issues a diagnostic message (`ERROR_ODSAPP_CAMERA_DECALIBRATED`) when it detects that a camera’s actual position differs from the expected one. For more details, please refer to the [decalibration documentation](../../../ODS/Decalibration/decalibration_feature.md).
- New driving direction parameter: Added a configurable parameter for the predominant driving direction `predominantMotionDirection` under `applications/instances/app<x>/configuration`. This is used to enhance visual odometry accuracy and detect the decalibration of camera heads.

### Changed

- If the `activePorts` list is empty then `ERROR_ODSAPP_IDLE_MODE` diagnostic will be raised.
- When the activePorts list changes, it needs some time for the occupancy grid to build up correct probabilities. During this time `ERROR_ODSAPP_PORT_SWITCHING_TRANSIENT` diagnostic message will be raised.
- If the framerate of at least one sub-component of the ODS application is unstable for a unusually long time then `ERROR_ODSAPP_UNSTABLE_FRAMERATES_LONGTERM` will be raised.
- Improvements to the crosstalk mitigation: a framerate jitter feature was added, which reduces the probability of crosstalk between vehicles. This feature can be enabled in the application parameters.

### Known issues

- Changing the ports used by an application under the parameter path `/applications/instances/appX/ports` will reset the presets located at `/applications/instances/appX/presets`.
- The configuration data mirrored to the PLC application from an ODS application (zones, zoneConfigID ..) is sourced from `/applications/instances/appX/configuration`. After loading a preset, do not modify the ODS application's configuration to ensure it remains consistent with the loaded parameters.

## PDS application

### Added

- PDS supports a RUN mode for all the commands running per default at a framerate of 10 Hz.
- Added support for single pocket pallets.
- The results can be sorted left to right or right to left, in addition to the existing sorting parameters.

## PLC Application

### Added

- Added support for the PLC application, enabling data exchange between a PLC and ODS and/or PDS applications over TCP/IP.

:::{important}
  This is a beta release and will be followed by an official release soon. In case of any issues, please contact ifm support team at support.efector.object-ident@ifm.com
:::

### Known issues

- VGA camera heads are not yet supported by applications.

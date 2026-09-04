# Firmware 1.21.16 release notes

The following release note provides an overview of the features of the firmware 1.21.16.

The firmware update file for the OVP81x devices is available on [ifm.com](https://www.ifm.com).

## Compatibility

### Previous releases

The previous version is v1.21.6

### Compatible software versions

This firmware release works with the following software package versions.

| Software           | Version   |
| ------------------ | --------- |
| ifmVisionAssistant | >= 2.10.12 |
| ifm3d API          | >= 1.6.12  |

### Compatible processing platforms

:::{warning}
FW 1.21.16 does not support the OVP80x family.
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
| O3R252*        | 3D: VGA 640x480, 64°x50° IP54 <br> 2D: 1280x800, 127°x80°  |

> * `O3R252` is not supported by any embedded applications.

## Base Device
### Added
- Added support for 800k baudrate for CAN.

### Fixed
- Increased the stability of the communication between camera and VPU.
- Increased the stability of the O3R222 at extreme temperatures.
- Fixed 2D timestamp calculation.

## SCC Application

### Fixed
- Fixed an Issue with calibrating the O3R225 cameras using the SCC application.


## PDS Application

### Fixed
- Use the camera-frame distance for the sanity check, so PDS still detects pallets when the origin is moved to the fork tips.

## ODS Application

### Fixed
- Relaxed VO pixel selection by using the true 3D distance (instead of ground-projected distance), so VO still runs when the camera is far from the user-frame origin.

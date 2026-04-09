
# FIRMWARE 1.4.32 RELEASE NOTES
The following release note provides an overview of the features of the Firmware **1.4.32** version.

The firmware update file for the OVP80x devices is available on [ifm.com](https://www.ifm.com). Find the product page, OVP800 or OVP801, and go to the download section. You will need to create an account to download the firmware.

## Description 
This version is the last release for the OVP80x series. The OVP80x devices are discontinued, and OVP81x devices should be used instead.

When used in mixed fleets using both OVP80x and OVP81x hardware, the OVP80x hardware should use firmware version 1.4.32, and the OVP81x should use firmware version 1.4.30.

The algorithm embedded in this version is equivalent to the version 1.4.30, which means there are no changes to the ODS and MCC applications.

Minor changes on the embedded software side are due to the use of the updated hardware OVP81x series, instead of OVP80x. The full list of changes is listed below.


## Compatibility
All new hardware is shipped with the latest version of the firmware at the time of building. Always verify the firmware version currently installed on your device.

### Previous Releases
The previous release is 1.1.30. Backward compatibility with firmware 1.1.30 is ensured.
Backward compatibility with firmware version 1.0.14 and below is untested.

### OVP80x vs. OVP81x series
The OVP80x and OVP81x VPUs correspond to different hardware but we provide functionally equivalent firmware versions. The corresponding versions are listed below for your reference:

|                | OVP80x | OVP81x | Comment                                         |
| -------------- | ------ | ------ | ----------------------------------------------- |
| Firmware 1.1.x | 1.1.30 | 1.1.41 | All OVP80x will be shipped with firmware 1.1.30 |
| Firmware 1.4.x | 1.4.32 | 1.4.30 |                                                 |

:::{note}
Firmware version 1.4.32 is the last release for the OVP80x series.
:::

### Compatible software versions
It is required to use this firmware release with the following software package versions.
| Software                 | Version      |
| ------------------------ | ------------ |
| ifmVisionAssistant       | >= 2.8.5     |
| ifm3d library            | >= 1.4.3     |
| ifm3d-ros ROS(1) wrapper | >= 1.1.2     |
| ifm3d-ros2 ROS2 wrapper  | >= 1.1.0     |

### Compatible processing platforms
:::{warning}
FW 1.4.32 does not support the OVP81x family at the moment.
**Do not update an OVP81x with this firmware. Such a FW update will fail. The device will reboot to the previous FW version installed.**
:::

This firmware release can be applied to the following ifm video processing platforms:

| Article | Description                                                            |
| ------- | ---------------------------------------------------------------------- |
| OVP800  | Series product with NVIDIA Jetson TX2 board.                           |
| OVP801  | Series product with NVIDIA Jetson TX2 board, including an ODS license. |

### Supported Camera Articles
This firmware release supports the following ifm camera articles:
| Camera Article | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| O3R222       | 3D: 38k 224x172, 60°x45° IP54 <br>  2D: 1280x800, 127°x80°  |
| O3R225       | 3D: 38k 224x172, 105°x78° IP54 <br>  2D: 1280x800, 127°x80° |

:::{note}
Using another camera article than mentioned in the table above is not recommended.
:::

## Changes
The changes between previous firmware version 1.1.30 and firmware version 1.4.32 are identical to the ones listed in [the release notes for firmware 1.4.30](../FW_1.4.x/FW_1.4.x_release_notes.md). Also make sure to carefully read the [FW 1.4.30 migration guide](../FW_1.4.x/FW_1.4.x_migration_guide.md), as changes in available processing resources were implemented.

We list below the changes between firmwares version 1.4.30 and 1.4.32.

- The following version differences exist between firmwares 1.4.30 and 1.4.32. This means that incompatibility might exist between Docker containers from one firmware to the other.
  - The embedded OS is Yocto 3.1 (Dunfell). In firmware 1.4.30, Yocto 4.0 is used.
  - JetPack version is 4.4.0. In firmware 1.4.30, Jetpack 4.6.3 is used
  - L4T version is 32.4.3. In firmware 1.4.30, L4T 32.7.3 is used.
  - CUDA version is 10.2.89. In firmware 1.4.30, CUDA 10.2.300 is used.
  - TensorRT version is 7.1.3. In firmware 1.4.30, TensorRT 8.2.1 is used.



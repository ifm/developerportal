# FIRMWARE 1.1.41 RELEASE NOTES
The following release note provides an overview of the features of the Firmware **1.1.41** version.

The firmware update file for the OVP811 devices is available on [ifm.com](https://www.ifm.com). Find the product page, OVP811, and go to the download section. You will need to create an account to download the firmware.

## Description 
:::{warning}
This firmware version is only intended to be used for existing fleets, that use ODS, where vehicles are already outfitted with OVP801 using firmware 1.1.30 and cannot be updated. In this case, new vehicles can be added with the new hardware series, OVP811, and firmware version 1.1.41, and be functionally equivalent in terms of ODS capabilities.

In all other cases, firmware 1.4.x series should be used.
:::

The algorithm embedded in this version is equivalent to the version 1.1.30, which means ODS and MCC applications behave similar to the previous version. 

Software changes have been made due to the use of the updated OVP811 series hardware instead of OVP801. The full list of changes can be found below.

## Compatibility
### Previous Releases
This firmware version provides an equivalent to the firmware version 1.1.30 for the OVP811 series of hardware. The version preceding 1.1.30, for the OVP801 series is version 1.0.14. There is no firmware version 1.0.x for the OVP811 series.

### OVP80x vs. OVP81x series
The OVP80x and OVP81x VPUs correspond to different hardware but we provide functionally equivalent firmware versions. The corresponding versions are listed below for your reference:

|                | OVP80x | OVP81x | Comment         |
| -------------- | ------ | ------ | --------------- |
| Firmware 1.1.x | 1.1.30 | 1.1.41 | Only for OVP8x1 |
| Firmware 1.4.x | 1.4.32 | 1.4.30 |                 |

:::{warning}
A JSON configuration valid in firmware 1.1.41 for an OVP811 *cannot* be applied to an OVP801. The reverse, however, is possible.
:::

### Compatible software versions
It is required to use this firmware release with the following software package versions.
| Software                 | Version   |
| ------------------------ | --------- |
| ifmVisionAssistant       | >= 2.6.24 |
| ifm3d library            | >= 1.4.3  |
| ifm3d-ros ROS(1) wrapper | 1.1.2     |
| ifm3d-ros2 ROS2 wrapper  | 1.1.2     |

### Compatible processing platforms
This firmware release can be applied to the following ifm video processing platforms:

| Article | Description                                                                              |
| ------- | ---------------------------------------------------------------------------------------- |
| OVP811  | Series product including ODS license with TX2-NX NVIDIA board, including an ODS license. |

### Supported Camera Articles
This firmware release supports the following ifm camera articles:
| Camera Article | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| O3R222 AB      | 3D: 38k 224x172, 60°x45° IP50 <br>  2D: 1280x800, 127°x80°  |
| O3R222 AC      | 3D: 38k 224x172, 60°x45° IP50 <br>  2D: 1280x800, 127°x80°  |
| O3R225 AB      | 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° |
| O3R225 AC      | 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° |
| O3R225 AD      | 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° |

## Base device
The changes listed below compare firmware version 1.1.30 with firmware version 1.1.41.
## Changes
- The OEM password was removed. Login with SSH keys is required.
- The gateway for the Ethernet interface `eth1` is now read-only. The default IPv4 address is 192.168.42.69, the netmask is 255.255.255.0 and the gateway 0.0.0.0.
- The timestamps format was changed from int to string. This is done to palliate limitations of the JSON format which lead to some parsers being unable to handle long numbers.
- SNTP is disabled by default. It needs to be activated in `device/clock/sntp/active`. This is done to avoid triggering the new diagnostic message warning the user of unavailable SNTP server when no server is configured.
- The time necessary to switch a camera to "RUN" or "CONF" was reduced from multiple seconds to below one second.
- The bootup time has increased.
- The JetPack version is 4.6.3, which comes with L4T 32.7.3, TensorRT 8.2.1 and CUDA 10.2. In firmware 1.1.30, JetPack version 4.4 is used.

## New features
- The CAN interface was added to the network configuration in `/device/network/interfaces/can0`. The interface can be activated or deactivated, and the bitrate can be set. A reboot is necessary when enabling or disabling the interface.
- Diagnostic messages inform the user when configured NTP servers are unavailable.
- Some parameters are persistent over a firmware update. This is the case for: `/device/clock/sntp`, `/device/docker`, `/device/log/storage/`,  all of the `/device/network/interfaces/` parameters
- Experimental feature: the service report can be downloaded by connecting to the IP address of the device in a browser. Read more in [the service report documentation](../../../SoftwareInterfaces/ifmDiagnostic/ServiceReport/service_report.md).

## Known Issues
- Repeatedly changing the exposure time of the 3D camera, when only the 3D cable is connected, leads to the diagnostic message `ERROR_HEAD_VCSEL_SHUTDOWN`.
- It is possible to permanently save a port in `ERROR` state with the `save_init` function. When this happens, the port will boot up in `ERROR` state and has to be manually switched to `RUN`.
- After updating the firmware, diagnostic messages may be displayed. These should disappear after the second reboot.
- When using DHCP, the default route is not updated, which makes it impossible to access the internet, or any routed network, on the OVP81x.

## ODS Application
### Known Issues
- The dynamic amplitude filter, which handles the impact of very bright objects in the scene, invalidates too many pixels in some cases. If decreased true positive performances are observed after updating to firmware version 1.1.41, please reach out to ifm support to receive updated parameters that will mitigate this issue.

## MCC Application
### Knows issues
- Activating the MCC application lead to intermittent error messages `ERROR_VPU_NO_FREE_IMAGE_BUFFERS`. These messages can be safely ignored.

## ifm3d
For ifm3d-specific known issues, please refer to [the issue tracker on GitHub](https://github.com/ifm/ifm3d/issues/).

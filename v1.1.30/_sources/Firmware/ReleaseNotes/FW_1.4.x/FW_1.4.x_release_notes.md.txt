# Firmware 1.4.30 pre-release release notes
The following release note provides an overview of the features of the Firmware **1.4.30** version.
This firmware is a pre-release intended only for early adopters of the OVP81x. It is expected that users will update to the final firmware version of the 1.4 series when it is available.

The firmware update file for the OVP81x devices is available upon request to the ifm sales or support team.

:::{admonition} News!
The firmware 1.4.30 is released along with a new hardware version for the OVP processing platform. This new platform, OVP81x, is built with the NVIDIA TX2 NX board instead of the TX2 board that was used for the OVP80x series.
This change brings in the latest software improvements from NVIDIA, as well as some additional 16GB of flash memory (for more details refer to the [NVIDIA specifications](https://developer.nvidia.com/embedded/jetson-modules)).

The OVP80x series of devices are being phased out and will no longer be available for purchase. Refer to the migration guide to understand the changes brought by this update.
:::

## Compatibility
### Previous Releases
This is the first firmware release for the OVP81x series. The release notes below details the changes between firmware 1.1.30 (for OVP80x series) and firmware 1.4.30 (for OVP81x series).

### Compatible software versions
It is required to use this firmware release with the following software package versions.
| Software | Version |
| -------- | ------- |
| ifmVisionAssistant | >= 2.8.5|
| ifm3d library | 1.4.3, 1.5.3 |
| ifm3d-ros ROS(1) wrapper | >= 1.1.2 |
| ifm3d-ros2 ROS2 wrapper | >= 1.1.0 |

### Compatible processing platforms
:::{warning}
FW 1.4.30 does not support the OVP80x family at the moment. A respective FW release is in preparation.
**Do not update an OVP80x with this firmware. Such a FW update will fail. The device will reboot to the previous FW version installed.**
:::

This firmware release can be applied to the following ifm video processing platforms:

| Article | Description |
| ------- | ----------- |
| OVP810 | Series product with TX2-NX NVIDIA board. |
| OVP811 | Series product with TX2-NX NVIDIA board, including an ODS license. |
| M04308 | Pre-series sample with TX2-NX NVIDIA board. |


### Supported Camera Articles
This firmware release supports the following ifm camera articles:
| Camera Article | Description |
| -------------- | ----------- |
| O3R222 AB | 3D: 38k 224x172, 60°x45° IP50 <br>  2D: 1280x800, 127°x80° |
| O3R222 AC | 3D: 38k 224x172, 60°x45° IP50 <br>  2D: 1280x800, 127°x80° |
| O3R225 AB | 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° |
| O3R225 AC | 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° |
| O3R225 AD | 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° |

## Base device
### Added
- The IMU data can be accessed at port 6. See [the IMU documentation](../../../Technology/VPU/IMU/imu.md) for further details.
- Processing the 3D data using CUDA can be enabled or disabled with the JSON parameter `/ports/portX/processing/diParam/useCuda`. CUDA processing is enabled by default. See [the CUDA documentation](../../../Technology/3D/ProcessingParams/processing_params.md) for further details.
- The CAN interface was added to the network configuration in `/device/network/interfaces/can0`. The interface can be activated or deactivated, and the bitrate can be set. A reboot is necessary when enabling or disabling the interface.
- Diagnostic messages inform the user when configured NTP servers are unavailable.
- Some parameters are persistent over a firmware update. This is the case for: `/device/clock/sntp`, `/device/docker`, `/device/log/storage/`,  all of the `/device/network/interfaces/` parameters
- Experimental feature: the service report can be downloaded by connecting to the IP address of the device in a browser. Read more in [the service report documentation](../../../SoftwareInterfaces/ifmDiagnostic/ServiceReport/service_report.md).

### Changed
- The available resources (CPU, GPU and RAM) available for running OEM applications are different: see [the migration guide](./FW_1.4.x_migration_guide.md) for details.
- The OEM password was removed. Login with SSH keys is required.
- The gateway for the Ethernet interface `eth1` is now read-only. The default IPv4 address is 192.168.42.69, the netmask is 255.255.255.0 and the gateway 0.0.0.0.
- The timestamps format was changed from int to string. This is done to palliate limitations of the JSON format which lead to some parsers being unable to handle long numbers.
- Algo-debug read-only parameters are now removed from the JSON configuration to improve readability.
- The base OS shipped with the NVIDIA Jetson TX2 NX was updated to Yocto 4.0 (kirkstone). This version comes with updated versions of Docker and Python:
  - The Docker daemon version was updated from v19.03.8 to v20.10.25.
  - Embedded Python version updated from 3.8.2 to 3.10.9
- JetPack was updated which led to updates of L4T-based containers, CUDA and TensorRT:
  - JetPack was updated from version 4.4.0 to version 4.6.3.
  - CUDA and TensorRT-based Docker images were updated to use L4T 32.7.3 (previously L4T 32.4.3). Corresponding CUDA version is 10.2.300 (previously 10.2.89) and TensorRT is 8.2.1 (previously 7.1.3).
- SNTP is disabled by default. It needs to be activated in `device/clock/sntp/active`. This is done to avoid triggering the new diagnostic message warning the user of unavailable SNTP server when no server is configured.
- Additional 16GB of flash memory is available. It is mounted to `/var/lib/docker` and can be used to store custom Docker containers.
- The time necessary to switch a camera to "RUN" or "CONF" was reduced from multiple seconds to below one second.
- The bootup time has increased.

### Fixed
- Fixed an issue where the `eth0` interface was not available if the device boot up with only `eth1` active.
- The framerate of the RGB camera correctly displays the fixed 20fps. The framerate is not adjustable.

### Known issues
- The CAN interface is limited to 5V.
- Performing five or more software reboots (for example with `ifm3d reboot`) of the OVP8xx without power cycle in between will result in a device unreachable on the network. This is fixed by power cycling.

## ODS application
### Added
- It is possible to run additional data stream along with ODS, thanks to the usage of the GPU. The maximum is of three 38k cameras used in ODS, plus an additional two RGB cameras at 20 Hz, or an additional three 38k cameras at 20 Hz. Refer to the updated [resource availability in the migration guide](./FW_1.4.x_migration_guide.md#resources-availability-for-user-code).

### Changed
- The filtering pipeline for highly reflective surfaces was updated:
the detection range in the presence of reflective surfaces is increased. For example, the detection of the fork tines of a fork truck covered with large metal surfaces, directly facing the camera is improved.

### Fixed
- It is now possible to configure more than one ODS application. Only one active application is allowed at a time. We still recommend that only one ODS application will be used and using the `activePorts` parameter to switch between cameras.
- The dynamic amplitude filter has been tuned to not invalidate large areas of the scene when highly reflective surfaces are present.
- Fix sporadic occurring of `ERROR_ODSAPP_ALGO_INTERNAL`.
- Continual improvement on false positive mitigation: reduced number of false positives due to floor types (shiny, bright, etc).

### Known issues
- When deleting an application while in RUN state, re-creating an application of the same class will set it in RUN state instead of CONF.

## MCC application
### Changed
- The diagnostic messages were updated to be flexible regarding the direction of motion: "backward calibration failed" is now "motion no in straight line."
### Fixed
- Activating MCC leads to `ERROR_ODSAPP_ALGO_INTERNAL`.
# Changelog

## v1.21.16

### Added

- [Base Device] Added support for the CAN bitrate of **800 kBaud**.

### Fixed

- [Base Device] Stabilized the communication between camera and VPU.
- [Base Device] Fixed an issue where the **O3R222** camera could stop working at low temperatures.
- [Base Device] Fixed the 2D timestamp calculation.
- [SCC Application] Fixed an issue with calibrating **O3R225** camera heads using the SCC application.
- [PDS Application] The sanity check now uses the camera-frame distance, allowing PDS to continue detecting pallets when the origin is moved to the fork tips.
- [ODS Application] Relaxed VO pixel selection by using the true 3D distance instead of the ground-projected distance, allowing VO to continue running when the camera is far from the user-frame origin.

## v1.21.6

### Added

- [Base Device] Enhanced device security by introducing **password protection** feature, allowing users to restrict unauthorized access to critical configurations.  
  For details, refer to the [Security Overview](../../Technology/VPU/security.md) document.
- [Base Device] A built-in firewall has been added to control inbound traffic. When enabled, the firewall **blocks all inbound traffic**, allowing only explicitly defined ports necessary for communication.
  - **Default behavior:** The firewall is disabled by default.
  - To enable it, set the parameter `/device/network/firewall/active` to `true` and reboot the device.
  - **Outbound traffic** remains unrestricted for both Ethernet interfaces. For more details, please refer to the [default firewall rules](../../Technology/VPU/security.md#default-firewall-rules) section.

> **ℹ️ Important**
> - Password protection is persisted across firmware upgrades and downgrades starting from firmware version 1.21.6 and above.

- [PLC Application] Added support for the **EtherNet/IP interface** in the PLC application. For setup and integration, refer to the [EtherNet/IP Documentation](../../PLC/ethernet-ip.md).

### Known Issues

- **VGA camera heads** are currently not supported by any embedded applications.

## v1.20.29

### Added

- [Base Device] Added the capability to support VGA camera heads(**O3R252**).
- [Base Device] The following features are added to the diagnostic system:
  - A severity field ["info", "minor", "major", "critical"]. Refer to the [the diagnostic documentation](../../SoftwareInterfaces/ifmDiagnostic/diagnostic.md#events).
  - Group status that reports the general health status of an application or a port,
  - The JSON structure of the diagnostic message was updated to include the new fields (severity, target, etc). Refer to [the diagnostic documentation](../../SoftwareInterfaces/ifmDiagnostic/index_diagnostic.md) for more details.
- [Base Device] Added the diagnostic `ERROR_DI_GLOBAL_REFLECTOR_HEURISTICS_ACTIVE` to the port when high amplitude object detected and invalidate the corresponding pixels.  
- [Base Device] Added the diagnostic `ERROR_PORT_UNSTABLE_FRAMERATE` when framedrops detected.

- [ODS Application] Added possibility to run ODS application with 4 cameras simultaneously.
- [ODS Application] Added possibility to determine the application health based on the group severity ["info", "minor", "major", "critical"]. It is recommended to handle the vehicle behavior for example stopping the vehicle if the severity is `critical`, `major` or `not available`.
- [ODS Application] Addition of the polar occupancy grid data stream: a compressed version of the occupancy grid using polar coordinates.
- [ODS Application] Decalibration warning added: The system now issues a diagnostic message (`ERROR_ODSAPP_CAMERA_DECALIBRATED`) when it detects that a camera’s actual position differs from the expected one. For more details, please refer to the [decalibration documentation](../../ODS/Decalibration/decalibration_feature.md).
- [ODS Application] New driving direction parameter: Added a configurable parameter for the predominant driving direction `predominantMotionDirection` under `applications/instances/app<x>/configuration`. This is used to enhance visual odometry accuracy and detect the decalibration of camera heads.

- [PDS Application] PDS supports a RUN mode for all the commands running per default at a framerate of 10 Hz.
- [PDS Application] Added support for single pocket pallets.
- [PDS Application] The results can be sorted left to right or right to left, in addition to the existing sorting parameters.

- [PLC Application] Added support for the PLC application, enabling data exchange between a PLC and ODS and/or PDS applications over TCP/IP.

> **ℹ️ Important**
>  This is a beta release and will be followed by an official release soon. In case of any issues, please contact ifm support team at support.efector.object-ident@ifm.com


### Changed

- [Base Device] Updated diagnostic descriptions and reaction strategies.
- [Base Device] Configuration of ports under `/ports/portX` used by active applications (ODS, PDS, SCC, MCC) is prohibited.
- [Base Device] The L4T kernel version is updated to r32.7.6.

- [SCC Application] The Static Camera Calibration (SCC) for extrinsic calibration of cameras is introduced as an embedded application. A wizard is available in the Vision Assistant to simplify its usage.

- [ODS Application] If the `activePorts` list is empty then `ERROR_ODSAPP_IDLE_MODE` diagnostic will be raised.
- [ODS Application] When the activePorts list changes, it needs some time for the occupancy grid to build up correct probabilities. During this time `ERROR_ODSAPP_PORT_SWITCHING_TRANSIENT` diagnostic message will be raised.
- [ODS Application] If the framerate of at least one sub-component of the ODS application is unstable for a unusually long time then `ERROR_ODSAPP_UNSTABLE_FRAMERATES_LONGTERM` will be raised.
- [ODS Application] Improvements to the crosstalk mitigation: a framerate jitter feature was added, which reduces the probability of crosstalk between vehicles. This feature can be enabled in the application parameters.

### Fixed

- Changing the ports used by an application under the parameter path `/applications/instances/appX/ports` will reset the presets located at `/applications/instances/appX/presets`.
- The configuration data mirrored to the PLC application from an ODS application (zones, zoneConfigID ..) is sourced from `/applications/instances/appX/configuration`. After loading a preset, do not modify the ODS application's configuration to ensure it remains consistent with the loaded parameters.

### Known Issues

- **VGA camera heads** are currently not supported by any embedded applications.

## v1.10.13

### Added

- [Base Device] The default `channelValue` for 3D port number X [0..5] is changed to 2*X.
- [Base Device] The L4T kernel version is updated to r32.7.5.

- [ODS Application] **Diagnostics for decalibrated camera ports:** A new error, `ERROR_ODSAPP_CAMERA_DECALIBRATED`, is raised if any active camera port is likely to be decalibrated. In this case, the camera calibration should be verified.
- [ODS Application] A new parameter, `rangeOfInterest`, allows users to define the maximum range of vision in meters (in robot coordinates). This setting directly impacts the grid shape, which is always square with each dimension containing (`rangeOfInterest`/0.05) × 2 cells at the default resolution of 5 cm.
- [ODS Application] ODS supports polygons on the zone interface, allowing for the definition of both convex and concave shapes.
- [ODS Application] A preset feature is implemented where the user can load a predefined zone configuration.

- [PDS Application] A new Pick and Drop System (PDS) application is added. This is a new feature with firmware 1.10.13. Refer to [the PDS documentation](../../PDS/index_pds.md) for an overview of the available features.

### Changed

- [ODS Application ]The maximum number of points to define a zone is increased from 6 to 16.
- [ODS Application ]The ODS diagnosis sources are now attached to the specific camera port rather than the overall ODS application, for the following diagnostic messages:
  - `ERROR_ODSAPP_FOV_INSUFFICIENT_FOR_NEGATIVE_OBSTACLES`
  - `ERROR_ODSAPP_CAMERA_DECALIBRATED`
  - `ERROR_ODSAPP_EXTR_DI_CALIB_IMPLAUSIBLE`
  - `ERROR_ODSAPP_VO_EXTR_DI_CALIB_IMPLAUSIBLE`
- [ODS Application ]A maximum of one ODS instance is allowed. It is expected to use a single ODS application, which is always in `RUN` mode, and to switch the `activePorts` to change which cameras are used.
- [ODS Application ]The conditions for raising the `ERROR_ODSAPP_VO_EXTR_DI_CALIB_IMPLAUSIBLE` diagnostic message were relaxed.

### Known Issues

- The diagnostics activated by the ODS application during the `RUN` state will not be deactivated when the application is set to the `CONF` or `IDLE` state.
- If the negative obstacle feature is enabled, it may happen that the diagnostic message `ERROR_ODSAPP_FOV_INSUFFICIENT_FOR_NEGATIVE_OBSTACLES` is raised even thought the field of view conditions are fulfilled. In this case, negative obstacles will not be properly detected. To fix this, the application should be set to `CONF`, and then to `RUN` again.

## v1.4.30

- This is the first firmware release for the OVP81x series. The release notes below details the changes between firmware 1.1.30 (for OVP80x series) and firmware 1.4.30 (for OVP81x series).

> **⚠️ Warning**
> - FW 1.4.30 does not support the OVP80x family at the moment. A respective FW release is in preparation.
> - **Do not update an OVP80x with this firmware. Such a FW update will fail. The device will reboot to the previous FW version installed.**


### Added

- [Base Device] The IMU data can be accessed at port 6. See [the IMU documentation](../../Technology/VPU/IMU/imu.md) for further details.
- [Base Device] Processing the 3D data using CUDA can be enabled or disabled with the JSON parameter `/ports/portX/processing/diParam/useCuda`. CUDA processing is enabled by default. See [the CUDA documentation](../../Technology/3D/ProcessingParams/processing_params.md) for further details.
- [Base Device] The CAN interface was added to the network configuration in `/device/network/interfaces/can0`. The interface can be activated or deactivated, and the bitrate can be set. A reboot is necessary when enabling or disabling the interface.
- [Base Device] Diagnostic messages inform the user when configured NTP servers are unavailable.
- [Base Device] Some parameters are persistent over a firmware update. This is the case for: `/device/clock/sntp`, `/device/docker`, `/device/log/storage/`,  all of the `/device/network/interfaces/` parameters
- [Base Device] Experimental feature: the service report can be downloaded by connecting to the IP address of the device in a browser. Read more in [the service report documentation](../../../SoftwareInterfaces/ifmDiagnostic/ServiceReport/service_report.md).

- [ODS Application] It is possible to run additional data stream along with ODS, thanks to the usage of the GPU. The maximum is of three 38k cameras used in ODS, plus an additional two RGB cameras at 20 Hz, or an additional three 38k cameras at 20 Hz. Refer to the updated [resource availability in the migration guide](./FW_1.4.x_migration_guide.md#resources-availability-for-user-code).

- 

### Changed

- [Base Device] The available resources (CPU, GPU and RAM) available for running OEM applications are different: see [the migration guide](../ReleaseNotes/FW_1.4.x/FW_1.4.x_migration_guide.md) for details.
- [Base Device] The OEM password was removed. Login with SSH keys is required.
- [Base Device] The gateway for the Ethernet interface `eth1` is now read-only. The default IPv4 address is 192.168.42.69, the netmask is 255.255.255.0 and the gateway 0.0.0.0.
- [Base Device] The timestamps format was changed from int to string. This is done to palliate limitations of the JSON format which lead to some parsers being unable to handle long numbers.
- [Base Device] Algo-debug read-only parameters are now removed from the JSON configuration to improve readability.
- [Base Device] The base OS shipped with the NVIDIA Jetson TX2 NX was updated to Yocto 4.0 (kirkstone). This version comes with updated versions of Docker and Python:
  - The Docker daemon version was updated from v19.03.8 to v20.10.25.
  - Embedded Python version updated from 3.8.2 to 3.10.9
- [Base Device] JetPack was updated which led to updates of L4T-based containers, CUDA and TensorRT:
  - JetPack was updated from version 4.4.0 to version 4.6.3.
  - CUDA and TensorRT-based Docker images were updated to use L4T 32.7.3 (previously L4T 32.4.3). Corresponding CUDA version is 10.2.300 (previously 10.2.89) and TensorRT is 8.2.1 (previously 7.1.3).
- [Base Device] SNTP is disabled by default. It needs to be activated in `device/clock/sntp/active`. This is done to avoid triggering the new diagnostic message warning the user of unavailable SNTP server when no server is configured.
- [Base Device] Additional 16GB of flash memory is available. It is mounted to `/var/lib/docker` and can be used to store custom Docker containers.
- [Base Device] The time necessary to switch a camera to "RUN" or "CONF" was reduced from multiple seconds to below one second.
- [Base Device] The bootup time has increased.

- [ODS Application] The filtering pipeline for highly reflective surfaces was updated:
  - the detection range in the presence of reflective surfaces is increased. For example, the detection of the fork tines of a fork truck covered with large metal surfaces, directly facing the camera is improved.

- [MCC Application] The diagnostic messages were updated to be flexible regarding the direction of motion: "backward calibration failed" is now "motion no in straight line."

### Fixed

- [Base Device] Fixed an issue where the `eth0` interface was not available if the device boot up with only `eth1` active.
- [Base Device] The framerate of the RGB camera correctly displays the fixed 20fps. The framerate is not adjustable.

- [ODS Application] It is now possible to configure more than one ODS application. Only one active application is allowed at a time. We still recommend that only one ODS application will be used and using the `activePorts` parameter to switch between cameras.
- [ODS Application] The dynamic amplitude filter has been tuned to not invalidate large areas of the scene when highly reflective surfaces are present.
- [ODS Application] Fix sporadic occurring of `ERROR_ODSAPP_ALGO_INTERNAL`.
- [ODS Application] Continual improvement on false positive mitigation: reduced number of false positives due to floor types (shiny, bright, etc).

- [MCC Application] Activating MCC leads to `ERROR_ODSAPP_ALGO_INTERNAL`.

### Known Issues

- The CAN interface is limited to 5V.
- Performing five or more software reboots (for example with `ifm3d reboot`) of the OVP8xx without power cycle in between will result in a device unreachable on the network. This is fixed by power cycling.
- When deleting an application while in RUN state, re-creating an application of the same class will set it in RUN state instead of CONF.

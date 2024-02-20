# FIRMWARE 1.0.14 RELEASE NOTES
The following release note provides an overview of the features of the Firmware 1.0.14 version.
Please refer to the ifm O3Rs website [www.ifm3d.com](http://www.ifm3d.com) for further information.

```{admonition} Warning
Downgrading to older firmware versions is not possible!

```


## Previous Releases
Previous firmware release is version 0.16.23.

## Compatible software versions
It is required to use this firmware release with the following software package versions.
<table border="1px solid black">
<tr>
  <th>Software</th>
  <th>Version</th>
</tr>
<tr>
  <th>ifmVisionAssistant</th>
  <th> >= 2.6.12</th>
</tr>
<tr>
  <th>ifm3d-library</th>
  <th> >= 1.2.4</th>
</tr>
<tr>
  <th>ifm3d-ros ROS(1) wrapper</th>
  <th> 1.1.1 (pre-release version)</th>
</tr>
<tr>
  <th>ifm3d-ros2 ROS2 wrapper</th>
  <th> 1.1.0 (pre-release version)</th>
</tr>
</table>


## Compatible Video Processing Platforms
This firmware release can be applied to the following ifm video processing platforms:
<table border="1px solid black">
  <tr>
    <th>Article</th>
    <th>Description</th>
  </tr>
  <tr>
    <th>OVP800</th>
    <th>series product</th>
  </tr>
  <tr>
    <th>M04239</th>
    <th>pre-series sample including ODS license</th>
  </tr>
</table>

## Supported Camera Articles
This firmware release supports the following ifm camera articles:
<table border="1px solid black">
  <tr>
    <th>Camera Article</th>
    <th>Description</th>
    <th>Available Modes</th>
    <th>Comment  </th>
  </tr>
    <tr>
    <th> O3R222 </th>
    <th> 3D: 38k 224x172, 60°x45° IP50 <br>  2D: 1280x800, 127°x80° </th>
    <th> `standard_range4m`, `standard_range2m`, `cyclic_4m_2m_4m_2m`, `extrinsic_calib`, <br> `standard_autoexposure2D`, `standard_manualexposure2D` </th>
    <th>  </th>
  </tr>
    <tr>
    <th> O3R225 AB</th>
    <th> 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° </th>
    <th> `standard_range4m`, `standard_range2m`, `cyclic_4m_2m_4m_2m`, `extrinsic_calib`, <br> `standard_autoexposure2D`, `standard_manualexposure2D` </th>
    <th>  </th>
  </tr>
    <tr>
    <th> O3R225 AC</th>
    <th> 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° </th>
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m, extrinsic_calib, <br> standard_autoexposure2D, standard_manualexposure2D </th>
    <th> improved fish-eye model </th>
  </tr>
</table>

## Migration guide: update FW 0.16.23 to FW 1.0.14

For the initial update process from a firmware 0.16.23 to any firmware version >= 1.0.x, please follow the included [migration guide](FW_1.0.x_migration_guide.md) closely.
The steps outlined there are required to change the device from a A/B redundant partition setup to a recovery based system. This steps needs to be done once per device.

**Warning: No downgrade will be possible after a successful update to a recovery based system!**

## New Features

### Recovery system:
+ A/B redundant partition changed to a recovery system:
  + Increase in user space: up-to 8 GB OEM user space available

### Docker:
+ Docker container logs are included in systemD journal instead of separate files: less prone to deadlock systems with verbose logging inside containers, due to logs saving on device during runtime
+ Docker service is persistent over OEM user changes

### Library: ifm3d
+ update API -  ifm3d-library:
  + version >= 1.2.4, refer to the ifm3d [changelogs](https://github.com/ifm/ifm3d/releases)
  + **Please be aware of breaking changes (when updating from 0.93.0 to 1.x.y) - follow the [migration guide](https://api.ifm3d.com/html/content/migration_guide/index.html) for details on migrating existing code**
+ Diagnosis handling updated: two functions
  + Diagnosis information available via `get_diagnostic`-function in the API module `device.O3R`
  + Diagnosis information available via `on_async_error` or `on_async_notification` functions in the API module `framegrabber.FrameGrabber`


### Diagnosis
+ Diagnosis data
    + accessible through [ifm3d library](https://www.ifm3d.com)
    + Camera specific diagnosis information
    + Example: temperature information for all system components
+ Application specific diagnosis information updated:
  + See available [diagnosis IDs](https://ifm3d.com/documentation/DeviceConfiguration/Troubleshooting/diagnosis.html#error-descriptions)
+ Timestamp included with diagnostic information
+ Changed: update of the JSON structure of the diagnostic information provided through the `get_diagnostic`-function

### TensorRT
+ TensorRT (version `tensorrt_version_7_1_3_0`) runtime libraries are included by default
+ L4T Docker base version: r32.4.3

### Application Concept
+ ODS - Obstacle Detection System (only licensed in article: M04239, refer to specific documentation)

### Persistent Device Configuration
+ Init configuration JSON survives the firmware update
  + Migrate your Init configuration according to the new JSON schema

### NTP timing
+ Improved NTP timing handling: timeouts due to backwards time jumps fixed

### Default camera state
+ The camera default state is now RUN. No manual state change required at first startup
  + It is possible to define the camera state after boot-up in the init JSON, for example to save battery power

### 3D-Camera Features
+ New camera mode: `extrinsic_calib` mode specifically designed for extrinsic calibration processes with checkerboards
+ Changed meaning of confidence bit 15: previous meaning was ISOLATED_PIXEL, new meaning is CROSSTALK. Pixels, which are invalidated by the isolated pixel filter, are now marked in confidence mask bit 9 (EDGEPIXEL)

### Factory Reset
+ Factory reset behavior allows two reset strategies: preserve or reset to default network settings
+ All OEM user settings and files are erased
+ All cached information regarding prev. connected hardware and hardware calibration are erased
  + Next boot-up process will take longer as all calibration files are downloaded again
+ All existing logs are deleted, systemD journal configuration reset to volatile
+ All docker containers are stopped and deleted. A Docker system prune is performed.


## ODS Application specific release notes:

### Features
* Improved robustness to false positive object detections:
  * Improved O3R inter camera crosstalk handling
  * Improved dust artifact handling
  * Fixed false positives due to motion artifacts
  * Fixed false positives due to ambient light
  * Improved multi path interference (MPI) TOF artifact handling
* Improved ego motion estimation:
  * Re-initialization of ego motion in case of ERROR_ODSAPP_VELOCITY_UNAVAILABLE is now allowed, even if the vehicle is still moving
  * Add detection and treatment of ramp situations (this enables ego motion while the vehicle drives over ramps)
  * Improved Standstill detection robustness
* Added overhanging load feature:
  * Feature for excluding overhanging load from the occupancy grid and zones introduced
* Tools for extrinsic VPU calibration (extrinsicVPUToUser) are provided as part of the ODS application bundle:
  * Standalone (Python) applications have to be run on the customers PC, for example laptop.

### Fixes
* Move `maxHeight` parameter from zone to grid section
* Add support for 3 camera ODS application instances: 3 TOF camera streams are evaluated simultaneously

### Known Issues: ODS application
* False positives:
  * Stray light caused by retro-reflectors inside and outside the camera's field of view might cause false positives
  * Dust particles might cause false positives
  * Direct sun light might lead to performance degradation, that is detection range might be limited, objects might be missed, false positives may be seen
  * Approaching or leaving ramps might cause false positive detections
* Objects in the occupancy grid appear 1 grid cell larger than they are in reality
* On floors with not enough visible structure, ego motion might not be available (visible with diagnostics VELOCTIY_UNAVAILABLE)
  This can lead to performance degradations, that is limited detection range, objects might be missed
* Application conf parameter are not handled correctly
* Initializing an ODS application instance with default extrinsic calibration parameters - ODS app with two heads:
  * Configuration description: One head with non-default extrinsic calibration and one with default extrinsic calibration parameters causes a instable non-recoverable app instance
  * Outcome: The ODS error state may not be propagated to a correct diagnostic error code (implausible extrinsic calibration), The camera streams for the respective camera heads may not be released after error state occurred


## Fixes
### 3D-Camera Features
+ Improved camera head error handling for undervoltage / overvoltage situations
+ Improved camera calibration file download handling: sporadic reboot was required after first camera head connection to VPU
+ Improved camera extrinsic calibration:
  + Fixed camera heads 3D TOF optical center offset parameters relative to the camera heads mechanical reference point
  + Fixed in calibration version >= 0.6.1

### 2D-Camera Features
+ 2D calibration file handling improved

### General
+ Improved invalid configuration handling
+ Robust calibration file download


## Known Issues
* Connectivity: ports must be connected pairwise with the same head-type: [Port0,Port1]   [Port2,Port3]   [Port4,Port5]
* Automatic channel selection per imager not yet implemented. It is advised to set all port acquisition channel values differently
  * Channel value difference of >=2 improves crosstalk mitigation
* Downgrading to older firmware versions not possible!
* The IPv4 discovery feature for discovering the device in complex networks is not working
* The framerate of the 2D RGB image stream can not be configured: A parameter change via the JSON interface has no effect on the acquisition framerate.
* Non supported camera heads, for example O3R prototype heads: start with a `M0xxxx`, cause boot-up issues and may result in a non-functional state.
* Algo-debug recording:
  * Algo-debug recording (receiving) may not be functional on customer PCs, for example laptops, with high loads / low processing power and result in missed information.
* Configuring multiple applications at once can result in configuration times larger than the ifm3d API default timeout. A `importlib._bootstrap.Error: Lib: XMLRPC Timeout - can you 'ping' the system` error will be shown.
* If no network connection can be established within 2 min during boot-up, following O3R system services such as imager streams may not be functional until rebooted.
* Native data chunk type availability: AMPLITUDE_COMPRESSED `buffer_id` does not return valid data. Please use NORM_AMPLITUDE_IMAGE instead.
* Slow receiver connections slow down the embedded O3R system: internally frames are not discarded as intended, but the system gets slowed down.
* Repeated mechanical disconnects of Ethernet cables can result in refused data connections by the embedded devices.
* Manually set date and time are not persistent over reboots.
* Overvoltage and undervoltage status are not reset after the event.
* The diagnostic message ERROR_DI_MOTION_COMP_EGA_DATA_TIMESTAMP_MISMATCH may become active for 3D heads used by an ODS application instance when switching the ODS instance from `RUN` to `CONF` states.
* The embedded image processing algorithm is not re-initialized when performing `RUN` -> `CONF` -> `RUN` cycles
* O3R camera filer related issues:
  * Defective pixel visible in amplitude matrix
  * Temporal filter:
    * Temporal filter creates long-term history dependence of point cloud
    * Temporal filter leads to distance drift over temperature

## Look forward to these features in future releases
* NEW ODS functionality: extended ODS applications functionality
  * Easier channel management: default exclusive channel parameter values
  * Easier port management: automatic port state changes
* Extrinsic calibration applications will be moved to the embedded firmware as native non-licensed applications
* NEW licensed applications:
  * PDS: pallet detection system
* Increased camera head temperature limit
* IMU data available to the user as its own port

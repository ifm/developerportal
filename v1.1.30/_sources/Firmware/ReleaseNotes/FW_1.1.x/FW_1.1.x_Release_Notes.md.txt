# FIRMWARE 1.1.30 RELEASE NOTES
The following release note provides an overview of the features of the Firmware **1.1.30** version.
Please refer to the ifm O3R's website [ifm3d.com](http://www.ifm3d.com) for further information.

The software update file for the OVP800, OVP801 devices and dependent prototype hardware can be downloaded from [ifm.com](https://www.ifm.com/us/en/product/OVP800?tab=documents).

```{admonition} Warning
Downgrading to firmware versions < 1.0.14 is not possible!

```


## Previous Releases
Previous firmware release is version 1.0.14.

The update to FW version 1.0.14 is mandatory. A update to 1.1.30 requires a previous update to FW 1.0.14.

## Compatible software versions
It is required to use this firmware release with the following software package versions.
| Software | Version |
| -------- | ------- |
| ifmVisionAssistant | >= 2.6.24 |
| ifm3d library | >= 1.4.2 |
| ifm3d-ros ROS(1) wrapper | 1.1.2 |
| ifm3d-ros2 ROS2 wrapper | 1.1.2 |

## Compatible Video Processing Platforms (VPUs)
This firmware release can be applied to the following ifm video processing platforms:

| Article | Description |
| ------- | ----------- |
| OVP800 | Series product |
| OVP801 | Series product including ODS license |
| M04239 | Pre-series sample including ODS license |

## Supported Camera Articles
This firmware release supports the following ifm camera articles:
| Camera Article | Description | Available Modes | Comment |
| -------------- | ----------- | --------------- | ------- |
| O3R222 | 3D: 38k 224x172, 60°x45° IP50 <br>  2D: 1280x800, 127°x80° | `standard_range4m`, `standard_range2m`, `cyclic_4m_2m_4m_2m`, `extrinsic_calib`, <br> `standard_autoexposure2D`, `standard_manualexposure2D` | |
| O3R225 AB | 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° | `standard_range4m`, `standard_range2m`, `cyclic_4m_2m_4m_2m`, `extrinsic_calib`, <br> `standard_autoexposure2D`, `standard_manualexposure2D` | |
| O3R225 AC | 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° | `standard_range4m`, `standard_range2m`, `cyclic_4m_2m_4m_2m`, `extrinsic_calib`, <br> `standard_autoexposure2D`, `standard_manualexposure2D` | Improved fish-eye model |

## General
### Added
+ Possibility to configure the Docker daemon for insecure and self signed registries via the JSON configuration: see [the docker daemon registry configuration](../../../SoftwareInterfaces/Docker/deployVPU.md#option-2---advanced-load-a-container-from-a-docker-registry).

### Changed
+ Default IP handling for ETH1:
  + IP address of ETH1 will be changed to static IP in the future: please prepare your deployment and EOL process
    + static IP address: 192.168.42.69/24
    + Gateway: 192.168.42.201
+ Configuration JSON: data type of clock `currentTime` changed from integer to string

### Fixed
+ Improved JSON boot-up handling when persistent configuration exist on the device:
  + Get command shall be available when persistent configuration exists but doesn't match the hardware connectivity
+ Improved handling of setting persistent JSON configurations - see [the persistent configurations document](../../../Technology/configuration.md#persistent-configuration).
+ Improved handling of external USB storage devices - see [the USB documentation](../../../Technology/VPU/usb.md).

## 3D camera
### Changed
- Changed overtemperature threshold from 77°C to 85°C
  - Cameras will only switch off for internal temperatures > 85°C (limit)
  - Cameras will become active again (automatically) after they cool down to 80°C
- Reset internal state (for example, for the temporal filter) on RUN/IDLE->CONF->RUN/IDLE changes.
- The amplitude values of suspect pixels is now set to invalid (negative) values.
- Extrinsic calibration parameters are not required to be fully populated anymore (for example, `/ports/portX/processing/extrinsicHeadToUser/transX` can be set without setting the other calibration members).
## 2D camera

## Known Issues

* All the settings persistently saved through the `save_init` function will be lost during the firmware update.
  * Settings that remain after a FW update: Network settings for ETH0
  * Extrinsic parameters must be handled manually
* Connectivity: ports must be connected pairwise with the same head-type: [Port0,Port1]   [Port2,Port3]   [Port4,Port5]
* Channel values have to be manually selected for each port. Ensure each port is set to a different channel value.
  * Channel value difference of >=2 improves crosstalk mitigation
* The IPv4 discovery feature for discovering the device in routed networks is not available
* 2D RGB image data:
  * The framerate of the 2D RGB image stream can not be configured: A parameter change via the JSON interface has no effect on the acquisition framerate.
  * The 2D RGB imager is configured to be "free running," that is, it is not controlled via the internal hardware trigger mechanisms (as 3D TOF)
  * No software trigger for 2D available
  * RGB data quality: compression artifacts
* Algo-debug recording:
  * Algo-debug recording (receiving) may not be functional on customer PCs, for example laptops, with high loads / low processing power and result in missed information.
* A ETH0 network connection is required at boot-up:
  * If no network connection can be established within 2 min during boot-up, following O3R system services such as imager streams may not be functional until rebooted.
  * If no network connection can be established the CAN communication may be available.
* Ethernet and CAN communications are coupled in the Docker container runtime: The CAN interface can only be made available if the complete host network is shared with the container.
* The ifm3d library converts the `AMPLITUDE_COMPRESSED` `buffer_id` into `NORM_AMPLITUDE_IMAGE` instead. Requesting `AMPLITUDE_COMPRESSED` from the `FrameGrabber` will not result in any data. Use `NORM_AMPLITUDE_IMAGE` instead.
* Slow receiver connections slow down the embedded O3R system: internally frames are not discarded, as intended, but the system gets slowed down.
* Repeated mechanical disconnects of Ethernet cables can result in refused data connections by the embedded devices.
* Manually set date and time are not persistent over reboots.
* The diagnostic messages `ERROR_DI_MOTION_COMP_EGO_DATA_TIMESTAMP_MISMATCH` or `ERROR_PORT_FRAME_TIMEOUT` may become active for 3D heads used by an ODS application instance when switching the ODS instance from `RUN` to `CONF` states or removing a port from the `activePorts` list.
* O3R camera filer related issues:
  * Temporal filter:
    * Temporal filter creates long-term history dependence of point cloud
    * Temporal filter leads to distance drift over temperature
* Software trigger unstable:
  * A software trigger request may be required to be sent more than once
  * No feedback loop for a software trigger request available at the moment
* Using 5 or more 3D data streams @ 20 Hz:
  * FW 1.1.30 requires a processing filter parameter update that migrates parts of the filter pipeline to the GPU to enable the usage of simultaneous data streams.
  * Migrating parts of the filter pipeline to the GPU may reduce available GPU resources for the OEM user, that is, OEM user GPU processes may be queued at a later stage.
  * Please get in contact with the robotics support via email at `support.efector.object-ident@ifm.com` for a description on how to enable this feature.
* When setting the configuration fails, the device does not revert to the configuration before the `Set` command and a partial configuration might be applied. See details in [the configuration documentation](../../../Technology/configuration.md#parameter-configuration-priorities).

## ODS Application specific release notes:
### Added
- Negative obstacles are now detected. See [the negative obstacle documentation](../../../ODS/NegativeObstacles/negative_obstacles.md) for more details.
- Only one ODS application instance is required:
  - Instead of defining one application per view (that is, on application for the camera combination looking "forward," one for "backwards," etc), only one application instance is configured.
  - The active input camera data streams , that is, active ports have to be chosen dependent on the driving direction.
  - Please refer to the [changing ODS views documentation](../../../ODS/ChangingViews/changing_views.md) and to the changes in the ODS JSON schema (see [the migration guide](./FW_1.1.x_migration_guide.md)).
- Reduced number of false positives in dusty environments (see [the dust mitigation documentation](../../../ODS/DustMitigation/dust_mitigation.md)).
- Reduced number of false positives when retroreflectors are in the camera's field of view
- New parameter for max number of simultaneously active cameras in ODS and simultaneous point cloud data streams (see the updated [ODS configuration document](../../../ODS/Configuration/configuration.md)).
### Changes
- Changes in the application JSON schema: please refer to [the migration guide](./FW_1.1.x_migration_guide.md).
- Increase detection range for small objects (<=10cm) on the floor beyond the visible floor range.
- Relaxed the filtering constraints of the 3D camera ports and apply the thresholds internally in ODS. This change might affect point cloud visualization of ODS 3D ports.

### Fixes
- Object dimensions in occupancy grid are closer to their real size: object size was artificially inflated in previous versions
- ODS application dependent parameters are correctly (re-) initialized when a RUN-CONF-RUN state change is performed.


### Known Issues
- False positives:
  - Stray light caused by retro-reflectors outside the camera's field of view might cause false positives
  - Direct sun light might lead to performance degradation: the detection range might be limited, objects might be missed or false positives may be seen
  - Approaching or leaving ramps might cause false positive detections
- On floors with not enough visible structure, ego motion might unavailable (visible with diagnostics `VELOCTIY_UNAVAILABLE`).
  This can lead to performance degradations: limited detection range, objects might be missed.
- (Default) channel value handling:
  - The channel value of all camera head configurations is reset to 0 when an ODS application instance is created.
  - The default channel value is set to 0 - a manual configuration to a non zero value is required to mitigate inter-camera crosstalk
- Only one ODS application instance is possible

## ifm3d
For ifm3d-specific known issues, please refer to [the issue tracker on GitHub](https://github.com/ifm/ifm3d/issues/).

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

## Changes
- The JSON configuration structure was updated to accommodate new parameters. Refer to [the migration guide](FW_1.1.x_migration_guide.md) for a full list.
- The overtemperature threshold was updated from 77°C to 85°C.

## New features
- It is now possible to configure insecure and self signed Docker registries via the JSON configuration. See [the docker daemon registry configuration](../../../SoftwareInterfaces/Docker/deployVPU.md#option-2---advanced-load-a-container-from-a-docker-registry) for a tutorial on how to do so.

## Fixes
- Fixed the device being unavailable when the hardware configuration is different from the one specified in the persistent JSON configuration. See [the persistent configurations document](../../../Technology/configuration.md#persistent-configuration) for more details.

## Known Issues
- Ports must be connected pairwise with the same data type: [Port0, Port1] [Port2, Port3] [Port4, Port5], for example [2D 2D] [3D, 3D] [3D, 3D],
- The framerate or acquisition mode (free running or triggered) cannot be configured for the RGB camera,
- The IPv4 discovery feature for discovering the device in routed networks does not work,
- Repeated mechanical disconnects of Ethernet cables can result in refused data connections by the embedded devices.
- In static scenes (no motion for more than 30 minutes), the temporal filter introduces a distance drift of up to 2 cm.
- The software trigger for the 3D cameras is unstable: the request might need to be sent more than once for a successful acquisition.

## ODS Application
### New features
- Negative obstacles can be detected. See [the negative obstacle documentation](../../../ODS/NegativeObstacles/negative_obstacles.md) for more details.

### Changes
- Increased detection range for small objects (<=10cm) on the floor beyond the visible floor range. Previous versions limited the detection to areas where floor pixels were visible.
- The approach for changing views in ODS has been updated. Instead of defining one application per view (that is, on application for the camera combination looking "forward," one for "backwards," etc), only one application instance is configured. Refer to the [changing ODS views documentation](../../../ODS/ChangingViews/changing_views.md) for more details.
- Reduced number of false positives in dusty environments (see [the dust mitigation documentation](../../../ODS/DustMitigation/dust_mitigation.md)).
- Reduced number of false positives when retroreflectors are in the camera's field of view.

### Fixes
- Object dimensions in the occupancy grid are closer to their real size. Previous versions increased the object size by one cell along all edges.

### Known Issues
- The channel value of all camera head configurations is reset to 0 when an ODS application instance is created.

## ifm3d
For ifm3d-specific known issues, please refer to [the issue tracker on GitHub](https://github.com/ifm/ifm3d/issues/).

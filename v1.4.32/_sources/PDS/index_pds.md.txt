---
nosearch: true
---

# PDS (Pose Detection System)

PDS - `Pose Detection System` - provided by [ifm](https://www.ifm.com), is a software solution building on top of the O3R ecosystem to enable AGVs (Automated Guided Vehicles), fork trucks and other robots to detect the pose of objects within a 3D environment.

:::{toctree}
    :maxdepth: 2
    :hidden:
Getting started <GettingStarted/index_getting_started>
Calibration <Calibration/pds_calibration>
Configuration <Configuration/configuration>
`getPallet` <GetPallet/getPallet>
`getRack` <GetRack/getRack>
`getItem` <GetItem/getItem>
`volCheck` <VolCheck/volCheck>
Recording <Recording/recordings_iVA>
Integration <Integration/index_integration>
Vision Assistant release notes <VisionAssistant/PDS_iVA_release_notes_2.7.13>
:::

## Features

PDS uses the O3R platform as its primary data source: one 3D camera stream can be used at one time. The current firmware version for PDS application is tested only with `O3R222` camera head.
The support for O3R225 wide FoV heads is experimental at the moment.
The support for (H)VGA  camera heads will be added in the future.

PDS provides four different commands:
| **Command** | **Output**                                                                      |
| ----------- | ------------------------------------------------------------------------------- |
| `getPallet` | Pose of up to 10 pallets                                                        |
| `getRack`   | Pose of an industrial rack                                                      |
| `getItem`   | Pose of up to 10 custom items (experimental feature)                             |
| `volCheck`  | Quantifies the number of valid pixels within a defined volume of interest (VOI) |


## Compatibility Matrix

| Firmware Version | Supported VPU Hardware | Supported Camera Hardware | ifm3d-library | ifmVisionAssistant | Comments                                            |
| ---------------- | ---------------------- | ------------------------- | ------------- | ------------------ | --------------------------------------------------- |
| 1.2.x            | `M04311`               | O3R222                    | >=1.4.3       | >=2.7.2            | Field test only version. Do not use for production. |
# Compatibility matrix


## Firmware and Hardware compatibility matrix
 | Supported VPU Hardware         | Supported Camera Head Hardware | FW version             | ifm3d-library | ifmVisionAssistant |
 | ------------------------------ | ------------------------------ | ---------------------- | ------------- | ------------------ |
 | OVP810 <br> OVP811             | O3R222 <br> O3R225             | FW 1.10.13             | 1.5.3         | 2.9.9              |
 | OVP810 <br> OVP811             | O3R222 <br> O3R225             | FW 1.4.30 or FW 1.1.41 | 1.4.3, 1.5.3  | 2.8.7              |
 | OVP800 <br> OVP801 <br> M04239 | O3R222 <br> 03R225             | FW 1.4.32              | 1.4.3, 1.5.3  | 2.8.7              |
 | OVP800 <br> OVP801 <br> M04239 | O3R222 <br> 03R225             | FW 1.1.30              | 1.4.3         | 2.6.24, 2.7.6      |
 | OVP800 <br> M04239             | O3R222 <br> 03R225             | FW 1.0.14              | 1.2.6         | 2.6.14             |

:::{note}
- Other combinations of versions than the ones listed in the table above could work but are not officially supported by ifm. [See table below](#recommended-hardware)
- Newer API versions are aimed to be backward compatible. Please verify via the API release notes and changelog.
:::

To review hardware specifications, refer to the [available hardware documentation](../Technology/Hardware/hardware_specifications.md).

## Recommended Hardware

The following hardware combination table is recommended from a performance point of view.
Typically the respective changes regarding ifm internal productions state, e.g. O3R222AA vs. O3R222AB, are minimal. Newer production states may correspond to improved performance, see suggestions in table below. Such performance improvements may include updated calibration routines in the ifm internal production pipeline, etc. Please get in touch with your ifm sales engineer for further details.

| VPU Hardware                   | Recommended Camera Head Hardware                     | Recommended Firmware Version                                                                                                                     |
| ------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| OVP810 <br> OVP811             | O3R222AD and later <br> O3R225AE and later           | [1.10.13](../Firmware/ReleaseNotes/FW_1.4.x/FW_1.10.x_release_notes.md)                                                                          |
| OVP810 <br> OVP811             | O3R222AC and later <br> O3R225AC, O3R225AD and later | [1.4.30](../Firmware/ReleaseNotes/FW_1.4.x/FW_1.4.x_release_notes.md) or [1.1.41](../Firmware/ReleaseNotes/FW_1.1.41/FW_1.1.41_Release_Notes.md) |
| OVP800 <br> OVP801 <br> M04239 | O3R222AA, O3R222AB <br> 03R225AC, O3R225AD and later | [1.1.30](../Firmware/ReleaseNotes/FW_1.1.x/FW_1.1.x_Release_Notes.md) or [1.4.32](../Firmware/ReleaseNotes/FW_1.4.32/FW_1.4.32_release_notes.md) |
| OVP800 <br> M04239             | O3R222AA <br> O3R225AB, 03R225AC                     | [1.0.14](../Firmware/ReleaseNotes/FW_1.0.x/FW_1.0.x_Release_Notes.md)                                                                            |



## ifm3d-ros and ifm3d-ros2 version compatibility

Please refer to the specific packages for ROS compatibility matrices:
- For ROS: [ifm3d-ros compatibility matrix](https://ros.ifm3d.com/latest/README.html#compatibility-matrix)
- For ROS2: [ifm3d-ros2 compatibility matrix](https://ros2.ifm3d.com/latest/README.html#software-compatibility-matrix)
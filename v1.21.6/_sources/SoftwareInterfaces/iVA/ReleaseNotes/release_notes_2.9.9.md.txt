# ifm Vision Assistant 2.9.9 release notes

The following release note provides an overview of the features of the iVA **2.9.9** version, related to the O3R perception platform.
Refer to [ifm3d.com](http://www.ifm3d.com) for additional documentation.

The software is available for windows and Linux (Ubuntu 20.04 and Ubuntu 22.04). It can be downloaded from [ifm.com](https://www.ifm.com/us/en/product/OVP810?tab=documents).

## Previous Releases
Previous iVA release is version 2.8.7.

## Compatible Video Processing Platforms (VPUs)
This firmware release can be applied to the following ifm video processing platforms:

| Article | Description |
| ------- | ----------- |
| OVP800 | Series product |
| OVP801 | Series product including ODS license |
| OVP810 | Series product |
| OVP811 | Series product including ODS license |
| OVP812 | Series product including PDS license |
| OVP813 | Series product including ODS and PDS licenses |

## New features
- Support for PDS applications.
- The distance noise and reflectivity images are available.
- The CAN network can be configured.
- The service report can be downloaded in the Device status tab.
- The IMU data can be visualized under Port 6.

## Changes
- Improvements in ODS zone visualization:
  - Possibility to set up to 16 points,
  - Ability to visualize convex and concave shapes, depending on if the `convexHull` or the `polygon` `zoneType` is selected,
  - Possibility to set zone coordinates up to +/- 15 meters,
  - The zones are labeled in the application visualization.
- The port synchronization wizard was removed. Now, when calibrating the ports using the manual calibration wizard, both ports corresponding to a single camera are calibrated together.

## Bugfixes
- The save init function is no longer called automatically when changing the network settings. The network settings are always saved persistently on the device, but this avoids persistently saving other settings at the same time.
- It is now possible to only import application instances (previously, other options had to be checked additionally).
- The maximum number of simultaneously active cameras for ODS can be up to three.
- The gateway field was missing for Ethernet 0 after deactivating DHCP. This is fixed.

## Known Issues
- The firmware update using the iVA Linux AppImage may fail on the first attempt, causing the VPU to remain in recovery mode.
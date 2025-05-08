# ifm Vision Assistant 2.10.9 release notes

The following release note provides an overview of the features of the iVA 2.10.9 version, related to the O3R perception platform.
Refer to [ifm3d.com](http://www.ifm3d.com) for additional documentation.

The software is available for Windows and Linux (Ubuntu 20.04 and Ubuntu 22.04). It can be downloaded from [ifm.com](https://www.ifm.com/us/en/product/OVP810?tab=documents).

## Previous Releases
Previous iVA release is version 2.9.9.

## Compatible Video Processing Platforms (VPUs)
This firmware release can be applied to the following ifm video processing platforms:

| Article | Description                                   |
| ------- | --------------------------------------------- |
| OVP810  | Series product                                |
| OVP811  | Series product including ODS license          |
| OVP812  | Series product including PDS license          |
| OVP813  | Series product including ODS and PDS licenses |

## New features
- ODS:
  - The camera frustum and position on the XY plane is displayed in the application tab.
  - The polar occupancy grid can be viewed.
  - Presets can be configured.
- PDS:
  - The result of PDS is displayed in a table, which is easier to read than the native JSON format.
  - Single pocket pallet detection is supported.
- Added support for SCC applications. A wizard is available for ease of use.
- Added support for PLC applications.
- A new mode is added to record algo debug data with 4 active cameras. This is necessary to avoid exceeding available bandwidth.
- The severity of the diagnostic event is displayed.
- The diagnostic list is dynamically updated via PCIC, such that the list updates even when the diagnostic window is open.

## Changes
- ODS:
  - Changing the ports used by the application will open up a pop up window. This is because changing the ports will reset the configured presets. This pop up window ensures the user is aware of any changes.

## Bugfixes
- The application import functionality works properly.

## Known issues
- Updating the Firmware using the Linux Appimage could fail. 
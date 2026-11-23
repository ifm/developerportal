# ifmVisionAssistant Changelog

Please always use the latest ifmVisionAssistant version available at respective [product downloads section](https://www.ifm.com/de/en/product/OVP810#documents)

## Compatibility

| Article | Description                                            | ifmVisionAssistant |
| ------- | ------------------------------------------------------ | ------------------ |
| OVP813  | Series product (TX2-NX) including ODS and PDS licenses | >2.9.9             |
| OVP812  | Series product (TX2-NX) including PDS license          | >2.9.9             |
| OVP811  | Series product (TX2-NX) including ODS license          | >2.9.9             |
| OVP810  | Series product (TX2-NX)                                | >2.9.9             |
| OVP801  | Series product (TX2) including ODS license             | >2.8.7             |
| OVP800  | Series product (TX2)                                   | >2.7.6             |

## v2.11.10

### Added

- Introduced a diff tool that displays a warning before modifying critical application-instance properties. The system now issues a warning prompt and provides a detailed comparison of old and new values. Users can also choose to revert affected configuration parameters to their previous state.

## v2.10.16

### Fixed

- Updating the Firmware using the Linux Appimage is fixed.

## v2.10.9

### Added

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

### Changed

- ODS:
  - Changing the ports used by the application will open up a pop up window. This is because changing the ports will reset the configured presets. This pop up window ensures the user is aware of any changes.

### Fixed

- The application import functionality works properly.

## v2.9.9

### Added

- Support for PDS applications.
- The distance noise and reflectivity images are available.
- The CAN network can be configured.
- The service report can be downloaded in the Device status tab.
- The IMU data can be visualized under Port 6.

### Changed

- Improvements in ODS zone visualization:
  - Possibility to set up to 16 points,
  - Ability to visualize convex and concave shapes, depending on if the `convexHull` or the `polygon` `zoneType` is selected,
  - Possibility to set zone coordinates up to +/- 15 meters,
  - The zones are labeled in the application visualization.
- The port synchronization wizard was removed. Now, when calibrating the ports using the manual calibration wizard, both ports corresponding to a single camera are calibrated together.

### Fixed

- The save init function is no longer called automatically when changing the network settings. The network settings are always saved persistently on the device, but this avoids persistently saving other settings at the same time.
- It is now possible to only import application instances (previously, other options had to be checked additionally).
- The maximum number of simultaneously active cameras for ODS can be up to three.
- The gateway field was missing for Ethernet 0 after deactivating DHCP. This is fixed.

## v2.8.7

### Added

- Enable dynamic changes of the `i` button to update the documentation of parameters depending on context.
- Confidence value for each pixel is available.
- 3D pixel information is available in replay mode.
- Added an overlay to show the ODS zone or overhanging load actually used by the algorithm, in cases where it differs from the one visualized.
- Refresh the displayed configuration when it is modified externally, for example if the ODS zones are modified using the ifm3d API. Only for O3R firmware version above 1.4.11.
- Added a small wizard to simplify the configuration of ODS zone coordinates.
- In replay mode, the timestamp is added to the scroll bar.

### Changed

- Removed the button to activate DHCP on `eth1`, since DHCP support for `eth1` is deprecated.
- Update the first illustration in the MCC wizard.

### Fixed

- Switching colorization between amplitude and distance of a 3D camera was not applied in replay mode.
- The distance slide bar was sometimes shown instead of the amplitude slide bar.
- Correction of logged warnings about unexpected port 6.
- In the manual port calibration wizard, it is not possible anymore to select two conflicting rotations at the same time.
- The ODS occupancy grid was displayed mirrored in the `Application` view and in the side tab of the `Monitor` view. The two views are now consistent.
- Setting ODS zones coordinates by clicking on the corner and entering values now works properly.
- The ODS overhanging loads can be configured.
- The X, Y and Z values displayed in the pixel information take into account the extrinsic calibration.
- Chinese characters were displayed when hovering the mouse over a camera when running on Linux.
  
## v2.7.6

### Added

- Motion Camera Calibration wizard. It is available as an application.

### Changed

- The ODS occupancy grid is displayed as a binary white/black instead of grayscale. The threshold is set at 127 by default: grid cells with a probability above 127 will be colored white, the others black. The right-hand side detailed view still shows the grayscale (this tab needs to be expanded by clicking on the two arrows on the right edge of the window).

### Fixed

- Ports can now be smoothly added and removed in the application configuration.
- The ports can be properly switched on/off in the "View options" in "Replay" mode.
- The VPU temperature display is no longer obstructed by long port names.

### Known issues

- Importing settings from file with the "Save and Reboot" enabled triggers error messages.

## Older versions

A detailed changelog is not available for versions prior to 2.7.6.
# iVA 2.8.7 release notes
The following release note provides an overview of the features of the iVA **2.8.7** version.
Please refer to the ifm O3R's website [ifm3d.com](http://www.ifm3d.com) for further information.

The software is available for windows and Linux (Ubuntu20.04 and Ubuntu22.04). The file can be downloaded from [ifm.com](https://www.ifm.com/us/en/product/OVP800?tab=documents).


## Previous Releases
Previous iVA release is version 2.7.6.

## Compatible Video Processing Platforms (VPUs)
This firmware release can be applied to the following ifm video processing platforms:

| Article | Description |
| ------- | ----------- |
| OVP800 | Series product |
| OVP801 | Series product including ODS license |
| M04239 | Pre-series product including ODS license |
| OVP810 | Series product |
| OVP811 | Series product including ODS license |


## Changes
- Removed the button to activate DHCP on `eth1`, since DHCP support for `eth1` is deprecated.
- iVA reloads the parameters dynamically after external changes, (for example if the ODS zones are modified using the ifm3d API).

## New features
- Enable dynamic changes of the `i` button to update the documentation of parameters depending on context.
- Confidence value for each pixel is available.
- 3D pixel information is available in replay mode.
- Added an overlay to show the ODS zone or overhanging load actually used by the algorithm, in cases where it differs from the one visualized.

## Bug Fixes
- Switching colorization between amplitude and distance of a 3D camera was not applied in replay mode.
- The distance slide bar was sometimes shown instead of the amplitude slide bar.
- Correction of logging warnings about unexpected port 6.
- In the manual port calibration wizard, it is not possible anymore to select two conflicting rotations at the same time.
- The ODS occupancy grid was displayed mirrored in the `Application` view and in the side tab of the `Monitor` view. The two views are now consistent.
- Setting ODS zones coordinates by clicking on the corner and entering values now works properly.
- The ODS overhanging loads can be configured.
- The X, Y and Z values displayed in the pixel information take into account the extrinsic calibration.
- Chinese characters were displayed when hovering the mouse over a camera when running on Linux.

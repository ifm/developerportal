# FIRMWARE 0.16.23 RELEASE NOTES
The following release note provides an overview of the features of the Firmware 0.16.23 Version.
Please refer to the ifm O3Rs website [www.ifm3d.com](http://www.ifm3d.com) for further information.


## Previous Releases
Previous firmware release is version 0.14.23.

## Compatible software versions
It is recommended to use this firmware release with the following software package versions.
<table border="1px solid black">
<tr>
  <th>Software</th>
  <th>Version</th>
</tr>
<tr>
  <th>ifmVisionAssistant</th>
  <th> >=2.6.7</th>
</tr>
<tr>
  <th>ifm3d-library</th>
  <th> >=1.1.1</th>
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
    <th>series product (without IMU)</th>
  </tr>
  <tr>
    <th>M04239</th>
    <th>ODS pre-series sample (with IMU)</th>
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
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> standard_autoexposure2D, standard_manualexposure2D </th>
    <th>  </th>
  </tr>
    <tr>
    <th> O3R225 AB</th>
    <th> 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° </th>
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> standard_autoexposure2D, standard_manualexposure2D </th>
    <th>  </th>
  </tr>
    <tr>
    <th> O3R225 AC</th>
    <th> 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° </th>
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> standard_autoexposure2D, standard_manualexposure2D </th>
    <th> improved fish-eye model </th>
  </tr>
</table>


## New Features

### Library: ifm3d
+ complete API-redesign of ifm3d-library: 
  + version >= 1.1.0, refer to the ifm3d [changelogs](https://github.com/ifm/ifm3d/releases). **This is a breaking change, follow the [migration guide](https://ifm.github.io/ifm3d-docs/html/content/migration_guide/index.html) for details on migrating existing code**

### Connectivity:
+ **USB support**
    + USB flash thumb drive / USB SSD support: `fat32` and `ext4` support. For `ext4` the VPU `oem` user id needs write access
    + automounting of USB devices (may require reformatting)
+ **CAN**
+ **ETH**
    + fallback IP if DHCP is selected for ETH0 and ETH1 and no DHCP server is present

### RGB-Camera Features
+ Added manual modes: settings available for
    + Exposure time
    + Framerate

### Synchronization and trigger
+ **SNTP** support added, configurable through json
+ **Imager synchronization**
    + 3D imagers in RUN state having the same `acquisition/framerate` are now hardware synchronized (individual `acquisition/delay` possible)

### Intrinsic calibration
+ Camera heads O3R225AC are calibrated in production with an improved fish-eye model
  + To use these heads an update to FW >= V0.16.23 and ifm3d-library version >= 1.1.1 is required

+ TOF info chunk
    + 2D intrinsic model parameters available
    + 2D inverse intrinsic model parameters available
    + 3D intrinsic model parameters available
    + 3D inverse intrinsic model parameters available
    + Possibility to register 2D and 3D images

### Diagnosis
+ Diagnosis data
    + accessible through [ifm3D-library](https://www.ifm3d.com) 
    + Camera specific diagnosis information
    + Application specific diagnose information
    + Example: temperature information for all system components

### Cross-talk mitigation
+ Imager synchronization in combination with channel implementation effectively mitigates crosstalk between heads on the same VPU

### Application Concept 
+ ODS - Obstacle Detection System (only for article: M04239, refer to specific documentation)

### LED
+ Port LEDs off, if no camera head is detected
+ Port LEDs will blink, if the port is in error state
+ Status LED: turns red, if any ERROR is present

## Fixes
### 3D-Camera Features
+ 3D specific distance image / point cloud estimation fixes: close proximity distance measurements improved
+ 3D timestamps fixed

## Known Issues
* Connectivity: ports must be connected pairwise with the same head-type: [Port0,Port1]   [Port2,Port3]   [Port4,Port5]
* For FW version >= 0.16.23 the heads default state is CONF. **Change to RUN mode to receive data.**
* Automatic channel selection per imager not yet implemented. It is advised to set all head channel values differently
  * Channel difference of >=2 digits improves crosstalk mitigation
* If the initial download of the calibration file from the head was corrupted, the head can not be used. Make sure not to interrupt power until all connected port LEDs are active (=green)
* Downgrading to firmware 0.14.23 is not recommended
* No backward compatibility: once a camera heads is attached to a VPU running FW 0.16.23 it will be updated and no longer work on a VPU running FW 0.14.23
* Loss of extrinsic calibration information of all heads, if the head connectivity is changed (any head added or removed)
* The IPv4 discovery feature for discovering a device on the local network is not working
* ODS must not be used together with user-defined docker containers 
* ODS startup time high (~5s)
* ODS in preseries state (refer to ODS documentation)


## Look forward to these features in future releases
* more user flash memory

# FIRMWARE 0.14.23 RELEASE NOTES 
The following release note provides an overview of the features of the (developer release) Firmware 0.14.23 Version.
Please refer to the ifm O3Rs website [www.ifm3d.com](http://www.ifm3d.com) for further information.


## Previous Releases
Previous firmware release is version 0.13.13.


## Compatible Image Processing Platforms
This firmware release can be applied to the following ifm image processing platform:
<table border="1px solid black">
  <tr>
    <th>article</th>
    <th>comment</th>

  </tr>
  <tr>
    <th>M03975, M04239</th>
    <th>pre-series sample (without IMU)</th>
  </tr>
  <tr>
    <th>OVP800</th>
    <th>series product (with IMU)</th>
  </tr>
</table>


## Supported Heads
This firmware release supports the following ifm camera articles:
<table border="1px solid black">
  <tr>
    <th>article</th>
    <th>description</th>
    <th>available modes</th>
  </tr>
    <tr>
    <th> O3R222 </th>
    <th> 3D: 38k 224x172, 60°x45° IP50 <br>  2D: 1280x800, 127°x80° </th>
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> autoexposure </th>
  </tr>
    <tr>
    <th> O3R225 </th>
    <th> 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° </th>
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> autoexposure </th>
  </tr>
  <tr>
    <th> M03933 </th>
    <th> 3D: 38k 224x172, 60°x45° IP50 <br>  2D: 1280x800, 127°x80° </th>
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> autoexposure </th>
  </tr>
  <tr>
    <th> M03969 </th>
    <th> 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° </th>
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> autoexposure </th>
  </tr>
</table>


## General Features
* Connectivity:
  The O3R image processing platform is a multi camera image processing platform.
  * Ports: ifm camera articles can be connected to all six ports (Port0 .. Port5)
  * Ethernet 0: 1x GB Ethernet connection [eth0]
  * <mark>**NEW**</mark> Ethernet 1: 1x GB Ethernet connection [eth1]
  * <mark>**NEW**</mark> CAN
  * <mark>**NEW**</mark> USB3.0
* Data Interface:
  The ifm3d library is recommended for interfacing with the O3R image processing platform (see installation instructions [here](https://ifm3d.com/sphinx-doc/build/html/ifm3d/doc/sphinx/content/installation_instructions/o3r_early_adopter_index.html)).
  The idea of ifm3d is to let developers quickly ramp up and also deploy code on the image processing platform.
  Sample programs, that illustrate the various functions and good usage, are provided for the following application frameworks:
	* C++ and Python [here](https://ifm3d.com/sphinx-doc/build/html/ifm3d/doc/sphinx/content/examples/index.html)
	* <mark>**NEW**</mark> [ROS(1) wrapper](https://ifm3d.com/sphinx-doc/build/html/ROS/ifm3d-ros/README.html)
	* <mark>**NEW**</mark> [ROS2 wrapper](https://ifm3d.com/sphinx-doc/build/html/ROS/ifm3d-ros2/README.html)
* SSH access:
  Access to the embedded Linux operating system is enabled through the `oem` user.
* Docker containers:
  Docker containers can be used to deploy code embedded on the image processing platform.
  Management of docker containers, like upload, download, autostart, delete is handled through SSH access and Docker compose by the OEM user.


## ifm Camera Usage
The ifm camera heads are in one of the following states:
* CONF: Configuration state, no data acquisition
* IDLE: pause data acquisition
* RUN:  periodic data acquisition @framerate

<mark>**NEW**</mark> For FW version 0.14.x the heads come up in CONF state at their first start! Please change to RUN mode to receive data.


## 3D-Camera Features

In contrast to other TOF-systems the ifm cameras have no ambiguity problem. Objects are measured only within the measurement range, which starts at an offset distance and for the length of the range. Objects before the offset and beyond the measurement range are not detected and more importantly can not disturb the measurement. The range and the offset can be adjusted to the current application.
All data acquisitions are carried out in high dynamic mode with multiple exposure times.
* Modes:
  * standard_range2m: measurement range [0..2] with offset=0 or [0.5..2.5] with offset=0.5 etc.
  * standard_range4m: measurement range [0..4] with offset=0 or [1..5] with offset=1 etc.
  * cyclic_4m_2m_4m_2m: periodic change between 4m and 2m measurement range
* Acquisition Parameters:
  * <mark>**NEW**</mark> manual channel selection per 3D TOF imager:
    + channel selection between -100:100
    + manual selection: this first step is not randomized / based on MAC address
  * `framerate`: periodic image acquisition at 1/framerate-intervals
  * `delay`: not functional (timing is currently free-running only)
  * `expLong`: long exposure time of high dynamic acquisition
  * `expShort`: short exposure time of high dynamic acquisition
  * `offset`: shift of measurement range in 0.5m steps
* Available Output Data:
  * distance: radial distance between camera and object
  * x: x-coordinate of object pixel
  * y: y-coordinate of object pixel
  * z: z-coordinate of object pixel
  * amplitude: detected signal strength
  * confidence: meta information for each pixel
  * Metadata: image width [pix], image height [pix], timestamps,<mark>**NEW**</mark>  head temperature
* Data Processing:
  * various Thresholds: invalidate pixels on various criteria
  * Filters:
    * spatial filters and parametrization
    * temporal filters and parametrization
    + <mark>**NEW**</mark> update Dynamic Symmetry Filter: this is based on a dynamic filter criterion now instead of static filter thresholds
    + <mark>**NEW**</mark> default settings:
        + Distance Noise threshold: new value 0.05 m
        + Minimum Reflectivity: 2 (Percent)
        + Stray light filter is activated by default
        + Mixed Pixel Filter default: angle based threshold estimate

## RGB-Camera Features
The RGB cameras acquire color images of the objects.
* Modes:
  * autoexposure
* Acquisition Parameters:
  * framerate: periodic image acquisition at 1/framerate-intervals
  * delay: not functional (timing is currently free-running only)
* Available Output Data:
	* jpg-encoded RGB image


## Known Issues
* Connectivity: ports must be connected pairwise with the same head-type: [Port0,Port1]   [Port2,Port3]   [Port4,Port5]
* No time synchronization: synchronized data acquisition / image triggering between ports is currently not possible.
* Software triggering in IDLE state is not operational
* The RGB imagers have to be switched to CONF and then back to RUN before streaming data.


## Look forward to these features in future releases
* trigger - trigger heads for a time synchronized operation
* more user flash storage -  alternative flash space handling for redundancy and recovery will clear more flash space for the OEM user
* new 2D RGB mode - it will be possible to set acquisition settings manually
* synchronization among different ports - it will be possible to define the acquisition timing for SW-triggered and periodic acquisitions (for example two heads have a synchronized acquisition)
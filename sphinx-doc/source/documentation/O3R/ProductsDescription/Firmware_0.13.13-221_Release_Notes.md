# FIRMWARE 0.13.13 RELEASE NOTES  !!!!!PRELIMINARY!!!!
The following release note provides an overview of the features of the Firmware 0.13.13 Version.  
Please refer to the ifm O3Rs website [www.ifm3d.com](http://www.ifm3d.com) for further information.


## 1. Previous Releases
There is no previous FW release for image processing platform M03975.
The FW-release 0.13.13 does not operate with image processing platform M03903 and their heads.


## 2. Compatible Image Processing Platforms
This firmware release can be applied to the following ifm image processing platform:
<table border="1px solid black">
  <tr>
    <th>article</th>
    <th>comment</th>   
  </tr>
  <tr>
    <th>M03975</th>
    <th>preseries sample</th>   
  </tr>
  <tr>
    <th>M04239</th>
    <th>preseries sample, housing change</th>   
  </tr>  
</table>


## 3. Supported Heads
This firmware release supports the following ifm camera articles:
<table border="1px solid black">
  <tr>
    <th>article</th>
    <th>description</th>
    <th>available modes</th>   
  </tr>
  <tr>
    <th> M03933 </th>
    <th> 3D: 38k 224x172, 60°x45° IP50 <br>  2D: 1280x800, 127°x80° </th>   
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> autoexposure </th>
  </tr>
  <tr>
    <th> M04237 </th>
    <th> 3D: 38k 224x172, 60°x45° IP54 <br>  2D: 1280x800, 127°x80° </th>   
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> autoexposure </th>
  </tr>  
  <tr>
    <th> M03969 </th>
    <th> 3D: 38k 224x172, 105°x78° IP50 <br>  2D: 1280x800, 127°x80° </th>   
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> autoexposure </th>
  </tr> 
    <tr>
    <th> M03970 </th>
    <th> 3D: 38k 224x172, 105°x78° IP54 <br>  2D: 1280x800, 127°x80° </th>   
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> autoexposure </th>
  </tr>    
  <tr>
    <th> M03976 </th>
    <th> 3D: VGA 640x480, 60°x45° IP50 <br> 2D:1280x800, 127°x80° </th>   
    <th> standard_range4m, standard_range2m, cyclic_4m_2m_4m_2m <br> autoexposure </th>
  </tr>
</table>


## 4. General Features
* Connectivity:  
  The O3R image processing platform is a multi camera image processing platform.  
  * Ports: ifm camera articles can be connected to all six ports (Port0 .. Port5) 
  * Ethernet: 1x GB ethernet connection [eth0]  
* Data Interface:  
  The ifm3d library is recommended for interfacing with the O3R image processing platform (download [here](https://github.com/ifm/ifm3d)) 
  The idea of ifm3d is to let developers quickly ramp up and also deploy the image processing platform. 
  Sample programs, that illustrate the various functions and good usage, are provided for the following applications frameworks:  
	* C++  
	* Python bindings: use `pip install ifm3dpy`, (see [here](www.ifm3d.com/))  
	* ROS1 wrapper:  
* SSH access:  
  Access to the embedded Linux operating system is enabled through the `oem` user.  
* Docker containers:  
  Docker containers can be used to deploy code embedded on the image processing platform. 
  Management of docker containers, like upload, download, autostart, delete is handled through SSH access by the oem user.

## ifm Camera Usage  
The ifm camera heads are in one of the following states:  
* CONF: Configuration state, no data acquisition  
* IDLE: pause data acquisition
* RUN:  periodic data acquisition @framerate   

## 5. 3D-Camera Features
<mark>**NEW**</mark>   
In contrast to other TOF-systems the ifm cameras have no ambiguity problem. Objects are measured only within the measurement range, which starts at an offset distance and for the length of the range. Objects before the offset and beyond the measurement range are not detected and more importantly can not disturb the measurement. The range and the offset can be adjusted to the current application.
All data acquisitions are carried out in high dynamic mode with multiple exposure times.
* Modes:
  * standard_range2m: measurement range [0..2] with offset=0 or [0.5..2.5] with offset=0.5 etc.
  * standard_range4m: measurement range [0..4] with offset=0 or [1..5] with offset=1 etc.
  * cyclic_4m_2m_4m_2m: periodic change between 4m and 2m measurement range
* Acquisition Parameters:
  * framerate: periodic image acquisition at 1/framerate-intervals
  * delay: not functional (timing is currently free-running only)
  * expLong: long exposure time of high dynamic acquisition
  * expShort: short exposure time of high dynamic acquisition
  * offset: shift of measurement range in 0.5m steps
* Available Output Data:
  * distance: radial distance between camera and object
  * x: x-coordinate of object pixel
  * y: y-coordinate of object pixel
  * z: z-coordinate of object pixel
  * amplitude: detected signal strength
  * confidence: metainformation for each pixel
  * Metadata: image width [pix], image height [pix], timestamps   
* Data Processing:
  * various Thresholds: invalidate pixels on various criteria
  * Filters:
    * spatial filters and parametrization
    * temporal filters and parametrization
  
## 6. RGB-Camera Features
The RGB cameras acquire color images of the objects.
* Modes:
  * autoexposure
* Acquisition Parameters:
  * framerate: periodic image acquisition at 1/framerate-intervals
  * delay: not functional (timing is currently free-running only)
* Available Output Data:
	* jpg-encoded RGB image


## 7. Known Issues
* Connectivity: ports must be connected pairwise with the same head-type: [Port0,Port1]   [Port2,Port3]   [Port4,Port5]
* Frame rate limitation: M03976 is limited to 1..10Hz
* No time synchronization: synchronized data acquisition / image triggering between ports is currently not possible.
* Software triggering in IDLE state is not operational


## 8. Look forward to these features in future releases
* CAN: messages can be retrieved via a CAN bus system
* [eth1]: enable the second ethernet port
* USB: a mass storage device is accessible for data collection
* avoid crosstalk between multiple cameras by selecting a channel value
* synchronization among different ports - it will be possible to define the acquisition timing for SW-triggered and periodic acquisitions (eg. two heads have a synchronized acquistion)

## 9. Update Firmware Procedure:
Update procedure:
1. Open [http://192.168.0.69:8080/](http://192.168.0.69:8080/) in web browser. The SWUpdate web interface is shown.
2. Drag and drop the `*.swu` firmware file into the `software update`-window. The upload procedure starts.


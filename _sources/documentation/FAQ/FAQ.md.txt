# FAQ
## Lookup Table for Firmware Version Compatibility
| Firmware Version | Supported VPU          | Supported Camera Heads         | ifm3d-library | ifmVisionAssistant |
| ---------------- | ---------------------- | ------------------------------ | ------------- | ------------------ |
| 0.16.23          | OVP800, M04239         | O3R222, O3R225AB, 03R225AC     | >=1.1.1       | >=2.6.7            |
| 0.14.23          | OVP800, M03975, MO4239 | O3R222, O3R225, M03933, M03969 | 0.93.x        | N/A                |
## Lookup Table for ifm3d-ROS Version Compatibility

For ROS2 distributions Software Compatibility Matrix please refer [ifm3d-ros2 github page](https://github.com/ifm/ifm3d-ros2) and for the ROS distributions please refer this [ifm3d-ros github page](https://github.com/ifm/ifm3d-ros)

Changelog for different packages can seen [here for ifm3d-ros](https://ifm3d.com/ROS/ifm3d-ros/CHANGELOG.html) and [here for ifm3d-ros2](https://ifm3d.com/ROS/ifm3d-ros2/CHANGELOG.html).

## Hardware (Connectivity)
**Q: Why is the Status LED blinking but not turning RED for an undervoltage error?**

A: In an undervoltage situation (not enough power supplied) the LED status is flashing only. A 2.5A and 24V power source is minimum requirement for the operation. Please double check [the diagnostic information](../SoftwareInterfaces/ifmDiagnostic/index_diagnostic.md).

**Q: Why is the PORT LED not turning green after camera head is connected?**

A: This can happen for different scenarios:
- If the camera is plugged in during runtime: no hot-plug capabilities are enabled.
- If different imager types are connected to the same pair of ports, i.e. [PORT0,PORT1]; [PORT2,PORT3]; [PORT4,PORT5]: only a same imager type is supported per port pair.
- When the camera is connected for the first time, the calibration download will take up to 2 minutes. The respective LED turn green after the download process is completed.
Please check [the diagnosis information](../SoftwareInterfaces/ifmDiagnostic/index_diagnostic.md).

**Q: I am not able to receive data from the camera heads?**

A: The default state for each camera head is **CONF** in Firmware Version <= 0.16.23. Change the state to **RUN** to receive data.
If you don't receive after the state change,  double check the PCIC port number mapping, i.e. the port that framegrabber is listening to.
| Hardware Port | PCIC TCP Port |
| ------------- | ------------- |
| Port 0        | 50010         |
| Port 1        | 50011         |
| Port 2        | 50012         |
| Port 3        | 50013         |
| Port 4        | 50014         |
| Port 5        | 50015         |

Please be aware that the system also uses these ports, i.e. they can not be used the oem user: TCP ports 8080,8888,50010-50025, 51010-51025.

**Q: I connected Port0 to receive RGB Data and Port1 to receive 3D Data, but I am not receiving data.**

A: The ports **must** be connected pairwise. If Port0 is used to received 2D/3D Data then Port1 can only receive the same data respectively. Pairs --> |Port0, Port1| Port2, Port3| Port4, Port5|


**Q: What kind of hardware certificates does the O3R fullfil?**

**A:** Generally we try to fullfil all standard certificates: see product description on [ifm.com](https://www.ifm.com/) for further details.

**Q: Does the O3R hardware system fullfil any additional robot specific norms: e.g. ESD / EMV?**

**A:** We are in the process of testing additional robot typical hardware norms: e.g. EN 12895.


## Camera Configuration
**Q: Is it necessary to shut down the camera before switching off the power?**

A: No, the O3R system can be switched off at anytime (except during firmware update).

**Q: Do I have to perform the Intrinsic calibration on the O3R camera heads?**

A: No, the O3R camera heads were calibrated in the production state and don't need an additional intrinsic calibration performed by the user.

**Q: Do I have to repeat the extrinsic calibration procedure every time I reconnect the camera?**

A: No, once the extrinsic calibration parameters are saved to the VPU (via a [save_init function](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.device.O3R.html#ifm3dpy.device.O3R.save_init)) and will be available even after the reboot. **However**, if the camera's position is changed then extrinsic calibration has to be redone.

**Q: Is it essential to connect the calibrated camera head to the same port to maintain the extrinsic calibration parameters**?

A: Yes. The VPU stores the extrinsic calibration parameters information for the respective port. So, it is important to connect the calibrated camera to the same port.

## Data Receiving

**Q: I am unable to receive the data after connecting the camera head?**

A: The camera's default state is in "CONF" and to be able to receive data it has to be changed to "RUN".

**Q: I am unable able to receive the data from camera head after connecting to a different VPU**

A: Once a camera head is connected to the VPU with firmware Version>=0.16.23 then it will no longer work on the other VPU with lower firmware version. The backward compatibility is nether supported nor recommended.

## Diagnostics

**Q. How can I query the VPU log information?**

A. The diagnostic information can be acquired via ifmVisionAssistant. To get the more detailed information about the diagnostic information please refer [this page](../SoftwareInterfaces/ifmDiagnostic/index_diagnostic.md)

Additionally the system is constantly logging information in the background. You can receive this *trace* with our [ifm3d-library](https://ifm.github.io/ifm3d-docs/html/cli_link.html#ifm3d-command-line-tool). Please include this information when contacting us.

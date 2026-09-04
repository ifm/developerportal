# FAQ

## Firmware documentation
**Q: Where can I find the documentation for older firmware versions?**

A: The website is always built on the latest FW version. To view previous versions of the documentation, please check [Previous versions of the documentation](../downloadable/index.md)

## Hardware (connectivity)
**Q: Why is the status LED blinking but not turning red for an under-voltage error?**

A: In an under-voltage situation (not enough power supplied) the LED status is flashing only. A 5A and 24V power source is minimum requirement for the operation. Please double check [the diagnostic information](../SoftwareInterfaces/ifmDiagnostic/index_diagnostic.md).

**Q: What happens if I under-power the VPU?**

A: Low power supply level can cause eye-safety errors to trigger or the VCSEL to shut-downs. This can happen for example when running 3 heads at 20 Hz with inadequate power supply.

**Q: Why is the PORT LED not turning green after camera head is connected?**

A: This can happen for different scenarios:
- If the camera is plugged in during runtime: no hot-plug capabilities are enabled.
- If different imager types are connected to the same pair of ports, that is [PORT0,PORT1]; [PORT2,PORT3]; [PORT4,PORT5]: only a same imager type is supported per port pair.
- When the camera is connected for the first time, the calibration download takes up to 2 minutes. The respective LED turn green after the download process is completed.
Please check [the diagnosis information](../SoftwareInterfaces/ifmDiagnostic/index_diagnostic.md).

**Q: I am not able to receive data from the camera heads?**

A: The default state for each camera head is **CONF** in Firmware Version <= 0.16.23. Change the state to **RUN** to receive data.
If you don't receive after the state change,  double check the PCIC port number mapping, that is the port that FrameGrabber is listening to.
| Hardware Port | PCIC TCP Port |
| ------------- | ------------- |
| Port 0        | 50010         |
| Port 1        | 50011         |
| Port 2        | 50012         |
| Port 3        | 50013         |
| Port 4        | 50014         |
| Port 5        | 50015         |

Please be aware that the system also uses these ports. This means that they cannot be used the OEM user: TCP ports 8080,8888,50010-50025, 51010-51025, SSH on port 22.

**Q: I connected Port0 to receive RGB Data and Port1 to receive 3D Data, but I am not receiving data.**

A: The ports **must** be connected pairwise. If Port0 is is connected to 2D/3D/VGA-3D imager then Port1 can only be connected to the same type of imager respectively.

Pairs --> [Port0, Port1], [Port2, Port3], [Port4, Port5]

**Q: What kind of hardware certificates does the OVP8xx platform fulfill?**

**A:** Generally we try to fulfill all standard certificates: see product description on [ifm.com](https://www.ifm.com/us/en/product/OVP810?tab=documents) for further details.

**Q: Does the O3R hardware system fulfill any additional robot specific norms, for example ESD / EMV?**

**A:** We are in the process of testing additional robot typical hardware norms, for example EN 12895.


## Camera configuration
**Q: Is it necessary to shut down the camera before switching off the power?**

A: No, the O3R system can be switched off at anytime (except during firmware update).

**Q: Do I have to perform the Intrinsic calibration on the O3R camera heads?**

A: No, the O3R camera heads were calibrated in the production state and don't need an additional intrinsic calibration performed by the user.

**Q: Do I have to repeat the extrinsic calibration procedure every time I reconnect the camera?**

A: No, once the extrinsic calibration parameters are saved to the VPU (via a [`save_init` function](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.device.O3R.html#ifm3dpy.device.O3R.save_init)) and will be available even after the reboot. **However**, if the camera's position is changed then extrinsic calibration has to be redone.

**Q: Is it essential to connect the calibrated camera head to the same port to maintain the extrinsic calibration parameters**?

A: Yes. The VPU stores the extrinsic calibration parameters information for the respective port. So, it is important to connect the calibrated camera to the same port.

## Data reception

**Q: I am unable to receive the data after connecting the camera head?**

A: In the firmware version < 1.0.14, the camera's default state is in "CONF" and to be able to receive data it has to be changed to "RUN."

**Q: I am unable able to receive the data from camera head after connecting to a different VPU**

A: Once a camera head is connected to the VPU with firmware version>=0.16.23, it will not work on the other VPU with a lower firmware version. Backward compatibility is neither supported nor recommended.

**Q: Should I expect a delay in the reception of data after re-configuring the device?**

A: Due to a couple frames being buffered internally, a worst case delay of up to six frames can occur. For more details, refer to the [configuration delays documentation](../Technology/configuration.md#configuration-delays).

## Diagnostics

**Q. How can I query the VPU log information?**

A. The diagnostic information can be acquired via ifmVisionAssistant. To get the more detailed information about the diagnostic information please refer [this page](../SoftwareInterfaces/ifmDiagnostic/index_diagnostic.md)

Additionally the system is constantly logging information in the background. You can receive this *trace* with our [ifm3d-library](https://ifm.github.io/ifm3d-docs/html/cli_link.html#ifm3d-command-line-tool). Please include this information when contacting us.

## Applications

**Q. Can I run ODS and PDS with the same camera at the same time?**

A. No, only one application at a time per camera. However, you can switch between applications, taking the switching time into consideration.
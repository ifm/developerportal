# O3R information for debugging

## Reporting an issue

### What to provide

When sending the ifm support team a debug request, please include the information below:
- A precise description of the issue,
- The service report (see [the documentation on how to download it](../ifmDiagnostic/ServiceReport/service_report.md)),
- The local host's OS version
- Depending on the situation:
  - The ifm3d or ifm3dpy API version
  - The ifm Vision Assistant version
  - The ifm3d-ros(2) ROS wrapper version
- If possible, also include:
  - A minimal reproducible example
  - A recording or video of the issue


### GitHub issue tracker

It is recommended to report any issues you may encounter while using the product on [GitHub](https://github.com/ifm/ifm3d). The GitHub platform allows the support and development teams to track and manage the issues efficiently. To report an issue via the GitHub repository, refer to this [document](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue).

When creating the issue, provide the information listed above.

## Troubleshooting guide
### Network interface and connectivity
If the connection between the host and the VPU via ifmVisionAssistant cannot be established, then try the following instructions:
+ Check the network settings: for instance, try to ping the system on its default / configured IP in a local network.
+ Disconnect all camera heads and reboot the VPU:
	1. This will allow you to find hardware configuration problems, for example, camera heads connected to the "wrong" ports.
	[Please double-check the configuration doc for details on the hardware connectivity](../../GettingStarted/Unboxing/hw_unboxing.md)
	2. If step 1 (above) worked try to reconnect one cable at a time to the correct ports as described in the doc above. Please be aware that any hardware change, for example connecting a new head, requires a reboot before it will become available.

## Status LEDs and port LEDs
Starting with firmware version 0.16.x the LEDs at the front of the VPU show the correct system information:
+ STATE LED:
	+ The STATE LED should be green.
	+ The STATE LED will be red if an ERROR is active in the internal diagnosis functionality.
+ PORT LEDs:
	+ Each Port LED is handled separately. If the connected imager (that is 2D RGB / 3D TOF imager) is registered and ready the LED will turn green
	+ If the LEDs are off:
		+ The imager is not registered by the system, that is connected during live operation. It will only be registered with the next reboot cycle.
        + The imager's cable connectivity is incorrect, that is 2D and 3D connected to the same paired deserializer
        + The imager's calibration information is still getting downloaded after it was connected for the first time to this VPU.
		+ For additional possible error cases please check the diagnosis information.

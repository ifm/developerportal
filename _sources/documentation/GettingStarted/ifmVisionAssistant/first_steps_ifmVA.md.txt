# First steps after the first initial connection

Next to unboxing and setting up of the O3R system, an initial test is beneficial. This can prove that the hardware is connected and working properly.

**Tip: When the hardware is not working properly, a firmware update might solve the issue. Please refer to the release notes and compatibility lists to see if the current installed firmware is suited for the currently used ifmVisionAssistant.**

## Activating the heads for 2D & 3D data acquisition

The first step to verify the overall functionality is setting all connected O3R-heads (e.g. O3R222/225) to "RUN" and receive 2D & 3D information.

A newly unboxed O3R system does not show anything in the monitor area - yet.

![blank monitor](resources/blank_monitor.png)

To set all heads at once to the "RUN", it is necessary to switch to `Port settings` and use the `Set all ports to RUN state` button.
Please keep in mind that this is a Vision Assistant specific helper function, which isn't native to the underlying parameter JSON structure. Its working method is to iterate through every port and set its `state` to `RUN`.

![set all ports to run](resources/set_all_ports_to_run.gif)

If there are heads connected (listed in the `Port settings`), they will change from `CONF` to `RUN` and both a 2D and 3D image (if both ports from the respective head are connected) will be received by the ifmVisionAssistant.

A preview can be seen right above the "big" 2D/3D view area.

![preview](resources/preview_2d_3D.png)

The main view typically shows the 3D point cloud data directly.

**Tip: It might be necessary to zoom (scroll) into the image. You can also use the mouse and the left button to change the view directions. The middle mouse button can be used to translate the point cloud relative to the visualization principal point.**

![main view 3D](resources/main_view_3D.gif)

Switching between the ports at the preview area also changes the main view. This allows to inspect other ports and also 2D data.

![main view 2D](resources/main_view_2D.gif)

If all connected heads provide an image - after they have been set to "RUN" (i.e. continuous data acquisition) - the general hardware set up is working.

**Tip: There are several other possibilities to inspect the 2D & 3D data. It is also possible to change the parameters and see the effect within the view. See the following and/or official ifmVisionAssistant documentation for further information.**

**Showcase: Displaying the 2D data as an overlay with the 3D data**

This Vision Assistant specific feature overlays the 2D RGB data of the respective 2D imager to the 3D point cloud. The method used here is a simple pixel-to-pixel map (on an ordered point cloud), which IS NOT based on evaluating the optical model of 2D and 3D. Therefore is can only be used as a rough estimation of 2D to 3D mapping.

The 2D & 3D mapping might be changed in the future to take the optical models into account. Until then please refer to the Python example for a complete 2D RGB & 3D point cloud mapping.
![display 2D in 3D](resources/display_2D_in_3D.gif)

## (Optional) Updating the firmware

To have the best experience with the O3R system and the ifmVisionAssistant, the newest ifmVisionAssistant and the newest O3R firmware should be used.

**Please refer to the ifm landing pages or the ifm3d.com to see the newest firmware release.**

The newest firmware can be installed via the `VPU settings` menu.

![vpu settings](resources/vpu_settings.png)

Using the `Update` function within `Firmware update` provides a new menu to choose the right firmware (image). Afterwards, the system tries to update the system.

**Warning: Some parameters are lost after an firmware update is over. Please save the configuration before starting the update.**

![update firmware](resources/update_firmware.gif)

If the firmware update is successfull, it is recommended to verify the overall funcitonality again (see [Activating the heads](#activating-the-heads-to-receive-2d3d-data)).

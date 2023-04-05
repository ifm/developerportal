# How to update the firmware:

**The following guide is only valid for updating between 1.0.x and 1.0.y versions. For details about the update process between 0.16.23 to 1.0.x please see the [migration guide](../Firmware/ReleaseNotes/FW_1.0.x/FW_1.0.x_migration_guide.md)**


## Download the firmware
The firmware image is available on the [ifm.com](https://www.ifm.com/) website. Navigate to the site and follow the steps below:
- Create an account (if you do not already have one) and log in.
- Use the search bar to find OVP800 (VPU). This is also valid if you have pre-release sample units, e.g. M04239.
- Navigate to the article page an click on the "Downloads" tab.
- Select the firmware from the list. It will start downloading the file.


## With the web interface

1. Open [http://192.168.0.69:8080/](http://192.168.0.69:8080/) in web browser. The SWUpdate web interface is shown.
2. Drag and drop the `*.swu` firmware file into the `software update`-window. The upload procedure starts.

For updating the firmware version from 0.16.xx to 1.0.xx, please follow the workflow in the [migration guide](../Firmware/ReleaseNotes/FW_1.0.x/FW_1.0.x_migration_guide.md)

In firmware version 1.0.x, the system will be in the production state and the web interface will not be available to user. So the user has to reboot the system to recovery mode and then the user can access the web interface. To reboot the system to recovery mode follow the following steps.

1. Open http://192.168.0.69/api/rpc/v1/com.ifm.efector/ in the web browser.
2. Enter `RebootToRecovery` as the method input. The device will reboot to recovery now.

<img align="center" height="300" src="resources/reboot2recovery.gif">

3. After a few seconds, the PORT LEDs will start flashing in a sequence indicating that the VPU is in recovery state.

<img width="400" height="200" src="resources/recovery_state.gif">

4. Open <http://192.168.0.69:8080/> in the web browser to access the SWUpdater web interface.
5. Drag and drop the `*1_0_x.swu` firmware file into the `software update` window. The upload procedure starts.
6. After the firmware flashes to the VPU, the system restarts.
7. After a few minutes, the PORT LEDs will turn ON indicating that the firmware is flashed successfully.

*Please keep in mind that when rebooting to productive the WebInterface will not return, this is due to the fact there is no longer a SWUpdate process in the productive system.*

## With ifmVisionAssistant

Download the ifmVisionAssistant from <https://www.ifm.com/us/en/product/OVP800?tab=documents>

Updating the firmware from 0.16.xx to 1.0.xx is currently not possible with the ifmVisionAssistant.

Updating the firmware from 1.0.xx to 1.0.xx via ifmVisionAssistant(v2.6.12) is currently supported on a Windows machine only. The Debian package of ifmVisionAssistant supporting Linux distributions will be released soon.

Expecting that user extracted the ZIP file and executing the following commands in the same directory

1. Open the command prompt and run the ifmVisionAssistant executable
```shell
C:\Users\Desktop\iVA_2_6_12 $ ifmVisionAssistant.exe
```
To get the logs during firmware update, execute the above command with `-log` flag as shown below.
```shell
C:\Users\Desktop\iVA_2_6_12 $ ifmVisionAssistant.exe -log
```
The log file is saved in i.e C:\Users\XYZ\AppData\Roaming\ifm electronic\ifmVisionAssistant\logs

1. Connect to the VPU and navigate to the `VPU Settings` window and click `Update` under the **Firmware update** section. The version beside the `Update` button refers to the current version running on VPU.
2. Select the File and the update process will start.


## With ifm3d

In the instructions below, replace `firmware_image.swu` with the name of the firmware file you downloaded from [ifm.com](https://www.ifm.com/).
We assume you are running these commands from the folders in which the `.swu` file is located.

:::::{tabs}
::::{group-tab} CLI
:::bash
$ ifm3d reboot --recovery
% wait for the system to reboot

$ ifm3d swupdate < firmware_image.swu
:::
::::
::::{group-tab} c++
:::cpp
TODO
:::
::::
::::{group-tab} python
:::python
from ifm3dpy.device import O3R()
from ifm3dpy.swupdater import SWUpdater

o3r = O3R()

sw_updater.reboot_to_recovery()
if not sw_updater.wait_for_recovery(60000): # Wait for 1 min
    raise RuntimeError("Device failed to boot into recovery")
# once the system has rebooted
o3r.swupdate(firmware_image.swu)
:::
::::
:::::


## Reboot to production state from recovery state

If the firmware update failed and VPU is stuck in a recovery state, the VPU has to be rebooted to the production state. Unfortunately at the current moment, this can only be achieved by executing the following code snippet.

:::::{tabs}
::::{group-tab} CLI
:::bash
$ ifm3d reboot --recovery
:::
::::
::::{group-tab} python
:::python
from ifm3dpy.device import O3R
from ifm3dpy.swupdater import SWUpdater

o3r = O3R()
sw_updater = SWUpdater(o3r)

if not sw_updater.wait_for_productive(2000): # Wait for 2 seconds
    sw_updater.reboot_to_productive()
:::
::::
:::::

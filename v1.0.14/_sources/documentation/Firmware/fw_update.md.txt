# How to update the firmware:

**The following guide is only valid for updating between 1.0.x and 1.0.y versions. For details about the update process between 0.16.23 to 1.0.x please see the [migration guide](../Firmware/ReleaseNotes/FW_1.0.x/FW_1.0.x_migration_guide.md)**


## Download the firmware
The firmware image is available on the [ifm.com](https://www.ifm.com/) website. Navigate to the site and follow the steps below:
- Create an account (if you do not already have one) and log in.
- Use the search bar to find OVP800 (VPU). This is also valid if you have pre-release sample units, e.g. M04239.
- Navigate to the article page an click on the "Downloads" tab.
- Select the firmware from the list. It will start downloading the file.

## Starting firmware is version < 1.0.0
When updating to a firmware version 1.0.0 or above, starting with a firmware version below 1.0.0, please refer to [the migration guide](../Firmware/ReleaseNotes/FW_1.0.x/FW_1.0.x_migration_guide.md).
## Starting firmware is version>= 1.0.0
### Reboot to recovery
When the starting firmware is version 1.0.0 and above, a reboot to recovery state is necessary to perform an update. 

:::::{tabs}
::::{group-tab} CLI
:::bash
$ ifm3d reboot --recovery
:::
::::
::::{group-tab} c++
:::cpp
#include <ifm3d/device/o3r.h>
#include <ifm3d/swupdater/swupdater.h>
...
auto o3r = std::make_shared<ifm3d::O3R>();
auto sw = std::make_shared<ifm3d::SWUpdater>(o3r);
sw->RebootToRecovery();
if (sw->WaitForRecovery()) {
    std::cout << "System in recovery mode" << std::endl;
}  
...
:::
::::
::::{group-tab} python
:::python
from ifm3dpy.swupdater import SWUpdater
from ifm3dpy.device import O3R
o3r = O3R()
sw = SWUpdater(o3r)
sw.reboot_to_recovery()
if sw.wait_for_recovery():
    print("System in recovery mode)
:::
::::
:::::

### With the web interface

Once the device is in recovery mode (see section above), you can open the web interface:

1. Open [http://192.168.0.69:8080/](http://192.168.0.69:8080/) in web browser. The SWUpdate web interface is shown.
2. Drag and drop the `*.swu` firmware file into the `software update`-window. The upload procedure starts.

The system will automatically reboot in productive mode. The web interface will not be available anymore (it is only available in recovery mode).

### With ifmVisionAssistant

Download the ifmVisionAssistant from https://www.ifm.com/us/en/product/OVP800?tab=documents

>Note: Updating the firmware from 0.16.xx to 1.0.xx is currently not possible with the ifmVisionAssistant.

>Note: Updating the firmware from 1.0.xx to 1.0.xx via ifmVisionAssistant(v2.6.12) is currently supported on a Windows machine only. The Debian package of ifmVisionAssistant supporting Linux distributions will be released soon.

In the instructions below, we expect that the user extracted the ZIP file and is executing the following commands in the same directory:

- Open the command prompt and run the ifmVisionAssistant executable
```sh
C:\Users\Desktop\iVA_2_6_12 $ ifmVisionAssistant.exe
```
To get the logs during firmware update, execute the above command with `-log` flag as shown below.
```sh
C:\Users\Desktop\iVA_2_6_12 $ ifmVisionAssistant.exe -log
```
The log file is saved in `C:\Users\<UserName>\AppData\Roaming\ifm electronic\ifmVisionAssistant\logs`

- Connect to the VPU and navigate to the VPU Settings window and click Update under the `Firmware Update` section. The version beside the `Update` button refers to the current version running on VPU.

- Select the File and the update process will start.

### With ifm3d

Once the device is in recovery mode, you can use ifm3d to update the firmware.
In the instructions below, replace `<path/to/firmware_image.swu>` with the path to the firmware file you downloaded from [ifm.com](https://www.ifm.com/).
The code below is continued from the "reboot to recovery" section.

:::::{tabs}
::::{group-tab} CLI
:::bash
$ ifm3d swupdate < <path/to/firmware_image.swu>
:::
::::
::::{group-tab} c++
:::cpp
if (sw->FlashFirmware("<path/to/firmware_image.swu>")){
    sw->WaitForProductive();
    std::cout << "System ready!" << std::endl;
}
:::
::::
::::{group-tab} python
:::python
if sw.flash_firmware('<path/to/firmware_image.swu>'):
    sw.wait_for_productive()
    print("System ready!")
:::
::::
:::::
> Note: the code snippets above do not show how to handle exceptions when they occur in the update process.
> Please refer to the API documentation for details on the potential exceptions thrown by each function.

Double check the firmware version after the update:

:::::{tabs}
::::{group-tab} CLI
:::bash
$ ifm3d dump | jq .device.swVersion.firmware
:::
::::
::::{group-tab} c++
:::c++
ifm3d::json config = dev->Get({"/device/swVersion/firmware"});
:::
::::
::::{group-tab} python
:::python
o3r.get(["/device/swVersion/firmware"])
:::
::::
:::::

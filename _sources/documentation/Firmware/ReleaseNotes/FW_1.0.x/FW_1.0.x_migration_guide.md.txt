# Migration guide: FW update process from FW version 0.16.23 to FW version 1.0.x
Migrating a system from a 0.x.x Release to a 1.0.x Release

## Prerequisite

Before migrating to the firmware version 1.0.x it is required to install the latest 0.16.23 release on the VPU.

## Changes

The previous firmware versions had an A/B image approach. When a software update was initiated the inactive image was updated. During a reboot the updated image was selected and booted into. This approach cuts the available space into two images. Firmware 1.0.x provides a dedicated recovery system for updating the productive system. The increase of the free space in the root filesystem of the productive system comes with the cost to boot into this recovery system to perform an update.

## Inconvenience

As mentioned one has to boot into the recovery system first to perform the initial update to FW 1.0.x. This can be dove via the ifm3d library (`version >= 1.2.4`).
Please see the provided helper Python3 modules to perform a firmware update or follow the process as outlined below.
> TODO: add instructions based on swu update webfontend on port 8080

> Important: There will be no possibility to downgrade an firmware version 1.0.x to the 0.16.x release series by an SWU update anymore.

## Workflow

The Workflow for the migration from a firmware version 0.16.x to 1.0.x is independent of the 1.0.x release version to be installed.

⚠️ The usage of the Web interface is recommended for the migration process. Both ifm3d and iVA do not support the transition. ⚠️

⚠️ Please ensure a stable power connection during the whole update process. The power connection must not be dropped during the update. ⚠️

1. ✅ Perform a Factory reset which includes network settings ❗
2. ✅ Update the O3R to the latest 0.16.23 firmware. ❗
3. ✅ Install the latest firmware version 1.0.x. In this step only the recovery system is installed! The VPU will reboot into recovery automatically.
4. ✅ Install the latest firmware version 1.0.x on the VPU (yes, you have to do this twice). This will reboot automatically into the productive system. Please keep in mind that when rebooting to productive the WebInterface will not return, this is due to the fact there is no longer a SWUpdate process in the productive system.




### Example workflow step 3 / 4:
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
#include <ifm3d/device/o3r.h>
#include <ifm3d/swupdater/swupdater.h>
...
auto o3r = std::make_shared<ifm3d::O3R>();
auto sw = std::make_shared<ifm3d::SWUpdater>(o3r);
sw->RebootToRecovery();
if (sw->WaitForRecovery()) {
    std::cout << "System in recovery mode" << std::endl;
}
sw->FlashFirmware(swu_filename)
...
:::
::::
::::{group-tab} python
:::python

from ifm3dpy.device import O3R()
from ifm3dpy.swupdater import SWUpdater

o3r = O3R()

sw_updater = SWUpdater(o3r)
sw_updater.reboot_to_recovery()
sleep(2)  # allow grace period before requesting recovery state

if not sw_updater.wait_for_recovery(60000):
    raise RuntimeError("Device failed to boot into recovery")

if not sw_updater.flash_firmware(swu_filename, timeout_millis=120000):
    _reboot_productive(o3r=o3r)
    raise RuntimeError("Firmware update failed")

:::
::::
:::::

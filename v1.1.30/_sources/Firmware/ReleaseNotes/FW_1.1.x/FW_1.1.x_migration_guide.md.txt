# FW 1.1.30 migration guide

## Changes to the JSON schema
The type of "/device/clock/currentTime: changed from integer to string. This can cause issues when applying a full configuration (for instance saved with `ifm3d dump`) that was valid with FW 1.0.14, to a device using FW 1.1.30. To mitigate this, we recommend to only apply relevant snippet of configuration. For example, only re-apply the ports configuration or the network settings instead of the whole JSON.


### Changes to the ODS JSON schema
- New property /applications/instances/appX/activePorts defines the camera ports currently active that will be used to generate the occupancy grid and zone data. By default, the first two available 3D ports will be selected.
- /applications/instances/appX/vo/portNumber is now /applications/instances/appX/vo/voPorts.
- New property /applications/instances/appX/portY/negObst: configure the negative obstacle detection (see [detailed documentation about negative obstacles](../../../ODS/NegativeObstacles/negative_obstacles.md)).
- New property `/applications/instances/appX/maxNumSimultaneousCameras` for defining the maximum number of active cameras in `/applications/instances/appX/activePorts`. The default for this property is 2, if you need to run 3 cameras in parallel you should increase it. This parameter can only be changed in "CONF" mode. For Firmware 1.1.30, a setting of 3 reduces the bandwidth for algo-debug recordings.
- Review the [updated ODS configuration document](../../../ODS/Configuration/configuration.md) for a list of all the ODS parameters.

## Changes in persistent configuration handling
Settings can be saved on the VPU with the `save_init` function so that they are persistent over a reboot. In firmware 1.1.30, a new approach is used in handling the persistent configuration at boot up. Due to this change, settings persistently saved will be lost in a firmware update.

If you want to save and reuse the configuration of your device, save it first locally, for example with the Vision Assistant (in the VPU settings tab > Settings > Export).

After the update to the new firmware, re-apply the configuration (VPU Settings > Settings > Import).

Keep in mind that due to some changes to the JSON schema, not all the settings can be re-applied.

For more details on saving persistent configurations, refer to the [configuration documentation](../../../Technology/configuration.md#persistent-configuration).

## Logging
The firmware release of `FW 1.1.X` is coupled with the `ifm3d / ifm3dpy API release 1.4.3`.
Since `ifm3d API version 1.3.X` the internal logging of the API has changed: glog logging is no longer used. Please update your code accordingly.
More details can be found in the ifm3d API migration guide [here](https://api.ifm3d.com/stable/content/migration_guide/v1_3_0.html).

All changes to the logging feature introduced in ifm3d API 1.3.X are made with backwards compatibility in mind: this means that all errors thrown as exceptions will still be thrown as exceptions.
All information previously logged to the glog logger is now logged to our own logger class. As a result, the Python API in particular may appear more verbose than before.

## CPU process allocation
Updates to the internal handling of ifm processes result in a different CPU resource allocation compared to previous FW versions.

### Camera use only: 6 heads @ 20Hz

In FW versions `0.16.23`, `1.0.14` and `1.1.30` the ifm camera data retrieval and filter as well as additional processes are pinned to the CPUs ARM A57 cores: cores [0,3,4,5].
Consequently, for the camera data use case (that is, no ifm application), the user processes shall be pinned to the DENVER cores.

Additional solutions are available where CPU intensive point cloud filtering operations are offloaded to the GPU. This frees up CPU resources.
Such offloading of point cloud processing is required if the 6 `O3R222` or `O3R225` head data streams are to be processed at 20 Hz, that is, full frame rate, without any frames being dropped internally by the software frame.
Please contact your local ifm support or support.efector.object-ident@ifm.com for detailed instructions for this use case.

### ODS application use case
Since ifm applications mainly use the Denver cores in this use case, OEM applications should be pinned to specific ARM cores. When the `UNSTABLE_FRAMERATE` diagnostic occurs more than sporadically, it is necessary to:
+ Pin processes launched from an OEM Docker container to the ARM A57 cores of the TX2 unit (using a taskset of 0x39). Note that the Denver cores of the TX2 unit are reserved for the ODS application.
+ Reduce the number of simultaneously active cameras (see /applications/instances/appX/configuration/activePorts)
+ Reduce the workload of OEM Docker containers by optimizing for runtime or offloading to other processing hardware.

Refer to [the Docker resources allocation documentation](../../../SoftwareInterfaces/Docker/cpu.md) for more details.
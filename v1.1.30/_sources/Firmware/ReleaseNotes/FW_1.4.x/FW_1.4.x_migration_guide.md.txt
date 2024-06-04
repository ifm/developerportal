# Firmware 1.4.30 pre-release migration guide

## JSON Configuration
:::{note}
This section is relevant to all users.
:::

The following changes were made to the JSON parameters:
+ `/device/network/interfaces/eth1/gateway` is now `"readOnly": true`
+ `/device/diagnostic/upTime` was changed from type `int` to `str`
+ `/device/network/can0` was added,
+ `/device/info/deviceTreeBinaryBlob` was removed,
+ `/applications/instances/appX/configuration/emvo` was removed,
+ `/applications/instances/appX/configuration/portX` parameters `diParam`, `floor` and `grid` were removed,
+ `/applications/instances/appX/configuration/port6` was removed,
+ `/applications/instances/appX/configuration/vo` parameters `interestPoint` and `validPixels` were removed,
+ `/ports/portX/acquisition/delay` is now read only for RGB ports,
+ `/ports/portX/acquisition/framerate` default value was changed from 10 to 20Hz for RGB ports,
+ `/ports/portX/data/algoDebugConfig/channels` was removed,
+ `/ports/portX/processing/diParam/useCuda` was added,
+ `/ports/port6/processing/emParam` was removed,
+ `/ports/port6/mode` was changed from `experimental_ods` to `imu_1_khz`


If the parameters above are not set by the user's configuration, the firmware 1.1.30's JSON configuration is still valid and functional.

If any of the parameters listed above are changed by the user's configuration, directly importing a full JSON configuration from a device using firmware version 1.1.30, to a device using firmware 1.4.30 is not possible.

To simplify the update process, we provide a Python script that will convert a configuration valid on firmware 1.1.30, to a configuration that can be applied to firmware 1.4.30. You can find the script with the ifm3d-examples [here](https://github.com/ifm/ifm3d-examples/blob/main/ovp8xx/python/ovp8xxexamples/toolbox/update_settings_to_new_fw_schema.py).

## Resources availability for user code
:::{note}
If no user code is running on the OVP8xx, the user can safely ignore this section.
:::

With FW 1.4.30, it is possible for the user to choose to process the 3D point cloud either on the CPU or the GPU. Additionally, some of the processing required in the ODS application was transferred to the GPU. This changes the available resources for the user to run custom applications.

Total available resources on the OVP8xx platform:
  - 2 Denver cores,
  - 4 ARM A57 cores,
  - 1 GPU (256 CUDA cores),
  - 4 GB of RAM, which corresponds to 3000 MiB of usable RAM, the rest being allocated to the OS and ifm firmware,
  - 16 GB of flash memory, with approximately 8 GB available for user data. On OVP81x devices, an additional 16 GB of eMMC storage is available which is mounted to `/var/lib/docker`.


The resources used by ifm processes depend on:
- The connected cameras:
    - Number of cameras,
    - Framerate,
    - Resolution,
    - Processing on CPU or GPU, 
    - State (active or inactive).
- Whether applications are running or not, especially ODS.

Below, we outline the resources available for user code in various scenarios.

:::{warning}
The numbers below are valid for the firmware version 1.4.30. Refer to [the resource management documentation](../../../SoftwareInterfaces/Docker/resource_management.md#resources-availability-for-user-code) for the most up to date information.
:::

### Available RAM
Generally, the available RAM for user code can be calculated with the following formula:

$available\textunderscore memory = (3000 - (372\times n_{38k} + mem\textunderscore used\textunderscore by\textunderscore rgb + mem\textunderscore used\textunderscore by\textunderscore ods + 87\times n_{mcc}))$


With:
- $n_{38k}$ is the number of connected 3D 38k cameras (O3R222 or O3R225),
- $mem\textunderscore used\textunderscore by\textunderscore rgb = (306 + 126\times n_{rgb})$ if $n_{rgb} > 0$ else $0$, where $n_{rgb}$ is the number of connected RGB cameras,
- $mem\textunderscore used\textunderscore by\textunderscore ods = (102 + n_{ods\textunderscore cams}*42)$ if $n_{ods\textunderscore cams} > 0$ else $0$, where $n_{ods\textunderscore cams}$ is the number of cameras used in ODS
- $n_{mcc}$ is the number of MCC applications instantiated. 

The above formula uses a margin of 250MB and reserves 20% for future developments. We recommend keeping around 200MB of RAM free.

Below is a table with some example scenarios and the corresponding available RAM:

| $n_{38k}$ | $n_{rgb}$ | $n_{ods\\_cams}$ | $n_{mcc}$ | Available Memory [MB] | Comment                                                                                                  |
| -------- | -------- | -------------- | -------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| 6        | 0        | 6              | 6        | 0                     | Not all the 38k camera are active simultaneously in this scenario, but they are all listed as ODS ports. |
| 4        | 2        | 0              | 0        | 954                   |                                                                                                          |
| 6        | 0        | 0              | 0        | 768                   |                                                                                                          |
| 0        | 6        | 0              | 0        | 1938                  |                                                                                                          |

### CPU and GPU resources
#### Cameras only, no ifm application

As of firmware version 1.4.30, by default, all 3D cameras are processed on the GPU. [GPU usage can be disabled](../../../Technology/3D/ProcessingParams/processing_params.md#cuda-processing), but we typically recommend keeping the GPU processing active except in cases where the GPU is required for user code.

When the cameras are processed on the GPU, the resources for example scenarios are listed below. 

| Scenario                  | Available ARM A57 cores (total: 4) | Available Denver cores (total: 2) | Available GPU (total 100%) |
| ------------------------- | ---------------------------------- | --------------------------------- | -------------------------- |
| 6x38k @20Hz               | 1                                  | 2                                 | 0                          |
| 4x38k @20Hz + 2xRGB @20Hz | 1                                  | 2                                 | 0                          |

To run your code on the available cores, the processes need to be pinned to these cores. Follow the [resource management documentation](../../../SoftwareInterfaces/Docker/resource_management.md).

#### ODS application

When running ODS concurrently with user code on the VPU, the available resources are limited. We list below some exemplary scenarios:

| Scenario                         | Available ARM A57 cores (total: 4) | Available Denver cores (total: 2) | Available GPU (total 100%) | Comments                                                                                                                 |
| -------------------------------- | ---------------------------------- | --------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 3x38k in ODS @20Hz + 2xRGB @20Hz | 0                                  | 0                                 | 0                          | No resources available for user code.                                                                                    |
| 3x38k in ODS @20Hz + 3x38k @20Hz | 0                                  | 0                                 | 0                          | Two of the non-ODS cameras must be configured to run on the CPU (`useCuda=false`). No resources available for user code. |
| 3x38k in ODS @20Hz               | 1                                  | 0                                 | 0                          | The user can use a single ARM core.                                                                            |

To run your code on the available cores, the processes need to be pinned to these cores. Follow the [process pinning documentation](../../../SoftwareInterfaces/Docker/resource_management.md).

Notes:
- The table above assumes that all cameras are processed on the GPU (`useCuda` flag), except otherwise noted.
- Maximum number of active cameras for ODS is 3. Cameras used by ODS must be run on the GPU and there is no possibility to change that.
- ODS always uses the GPU, and always takes up the two Denver cores. These cores cannot be used for user applications and the user code should be pinned to the available ARM A57 cores (see [process pinning documentation](../../../SoftwareInterfaces/Docker/resource_management.md)).
- If cameras that are used by ODS have the `useCuda` flag set to `false`, ODS will ignore this and use the GPU for this camera anyway.


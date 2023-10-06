# Diagnosis information

The O3R system allows a system wide monitoring via its diagnosis information.

To verify the working status of the O3R system and especially the ODS application, a diagnostic query can be used. It is recommended to poll this diagnostic data automatically/periodically (e.g. every 5 sec.) to get the status of the overall system.

## Receiving the diagnostic data

For ifm3d 1.1.0 and above, it is possible to retrieve the diagnosis information as follows:
:::::{tabs}
::::{group-tab} Python
:::python
from ifm3dpy.device import O3R
o3r = O3R()
o3r.get_diagnostic()
:::
::::
::::{group-tab} c++
:::cpp
#include <ifm3d/device/o3r.h>
auto o3r = std::make_shared<ifm3d::O3R>();
auto diag = o3r->GetDiagnostic();
:::
::::
::::{group-tab} CLI
:::bash
ifm3d diagnostic
:::
::::
:::::


.. warning::
    Firmware 1.0.14 introduces an additional intermediate group (layer) to the JSON structure of the returned diagnostic JSON string.
    The diagnostic Error message structure (as described below) can be found under the additional group `event`.


# Error descriptions

## Differences: active/dormant
The O3R system differentiates between active errors - which are currently active, and dormant errors - errors which happened any time between the start of the system and now.
In most cases, it is recommend to only use the active errors.

## Error message structure

Error message structure is a follows:
+ **source**: The internal source (name) of the diagnostic event.
+ **count**: This counter tracks how often an event was detected.
+ **state**: Active and dormant. If the state is reported active, the event was present during the call to get. If it is reported dormant there was no active event during the call to get.
+ **bootid**: For persistent diagnostic events this is an information to distinguish between an event which was detected during one boot. Due to the fact we do not persist the diagnostics at the moment this can be ignored.

**IDs**
+ **icc** The micro controller on the camera head which monitors the camera status.
+ **tcu** The trigger control unit which is responsible for the synchronization.
+ **mira** The internal name of the 3D ToF chip.

## General O3R diagnosis information
| Error title | Description |
| --- | --- |
| ERROR_HEAD_OVERTEMPERATURE_ICC | If the illumination current controller detects an overtemperature the port will enter an error state. |
| ERROR_HEAD_INVALID_CALIBRATION | If the illumination current controller detects that the current calibration has a check sum error or is not present at all, the port will enter an error state. |
| ERROR_VPU_OVERVOLTAGE_24V | If the VPU detects an overvoltage the device will enter an error state. |
| ERROR_BOOT_SEQUENCE_INVALID_CONFIGURATION | The VPU can not construct a valid configuration, i.e. the boot-up procedure is blocked .|
| ERROR_EUCAP_UNSUPPORTED_IMU | No IMU is detected or the IMU is missing its respective calibration information. |
| ERROR_VPU_TCU_COMM_ERROR |  If the VPU detects a communication error with the timing control unit. |
| ERROR_VPU_UNDERVOLTAGE_24V | If the VPU detects an undervoltage the device will enter an error state. |
| ERROR_BOOT_SEQUENCE_PORT_CONFIGURATION_TIMEOUT | When the imager process of the assigned port does not respond during a 5 sec timeout during boot-up. |
| ERROR_VPU_WATCHDOG_TIMEOUT | A VPU global watchdog error is detected. |
| ERROR_GECCO_CONFIGURATION_NO_CALIB | A imager specific calibration information is not available: this might be due to a calibration download failure or missing calibration on the camera head. |
| ERROR_VPU_UNDERVOLTAGE_1_8V | If the VPU detects an undervoltage: specific undervoltage at 8 V. |
| ERROR_VPU_UNDERVOLTAGE_5V | If the VPU detects an undervoltage: specific undervoltage at 5 V. |
| ERROR_CONIG_EUCAP_INVALID_HEAD_COMBINATION | A invalid hardware connectivity is detected: this is most likely a combination of different imager types being connected to a "paired" deserializer. Check the hardware connection requirements per Video Processing Unit (VPU) article. |
| ERROR_BOOT_SEQUENCE_TCU_FW_UPDATE_FAILED | The firmware update of the trigger control unit failed. The whole system will be in error state. |
| ERROR_MIRA_GRABBER_FRAME_TIMEOUT | An imager specific data acquisition thread timeout is detected. |
| ERROR_BOOT_SEQUENCE_TCU_INVALID_FW | The VPU detects an incompatible TCU firmware version. The compatibility check is performed on a major and minor compatibility check. |
| ERROR_MIRA_GRABBER_MIRA_RESET | An imager specific data acquisition thread timeout is detected and corrected. The imager specific data acquisition thread was recovered and reset. |

## ODS specific diagnosis information

| Error title | Description |
| --- | --- |
| ERROR_ODSAPP_VO_IMAGE_FRAMERATE | Framerate of the head used by the visual odometry not high enough |
| ERROR_ODSAPP_IMAGE_IMU_DELAY_IMPLAUSIBLE | This might be an indication that the receivers connected to the VPU are slowing down the VPU processing too much. Make sure that Power Saving modes are disabled on the receivers.|
| ERROR_ODSAPP_ALGO_INTERNAL | Internal fallback error for ODS application during runtime  - if unspecified error cases are set. |
| ERROR_ODSAPP_UNSTABLE_FRAMERATES | Framerate within ODS unstable. Check power supply, cable connection, etc. This might also be an indication that the receivers connected to the VPU are slowing down the VPU processing too much. Make sure that Power Saving modes are disabled on the receivers. |
| ERROR_ODSAPP_EXTR_DI_CALIB_IMPLAUSIBLE |The error is raised when any of the 3D ports contains a transZ value <= 0.01m. A consequence of this error is also that ERROR_ODSAPP_PARAMETER_PLAUSIBILITY_CHECK_FAILED is set and that the affected camera does not update the fused occupancy grid.|
| ERROR_ODSAPP_VO_EXTR_DI_CALIB_IMPLAUSIBLE | The extrinsic calibration of the used head for visual odometry is not plausible. The visual odometry camera needs to see a reasonably large part of the floor. The floor must be at least visible at radial distances between 1.00 m and 1.50 m from the camera. |
| ERROR_ODSAPP_DEFAULT_ZONE_USED | Default zone ID=0 used |
| ERROR_ODSAPP_PARAMETER_PLAUSIBILITY_CHECK_FAILED |If there are cross-dependencies in the ODS application parameters, which are not modeled in the JSON schema, the ODS application shall check for them and set an error if the parameter set is invalid.|
| ERROR_ODSAPP_STANDSTILL_CHECKS_NOT_EXECUTED |The error is set on initialization of the ODS application. The error is reset after the EMVO has detected the standstill condition and the standstill checks have been executed once.|
| ERROR_ODSAPP_EXTR_VPU_CALIB_IMPLAUSIBLE | The algorithm shall check that during detected standstill the direction of the acceleration vector differs not more than +/- 5 degree from the expected direction parallel to the user's Z axis with the expected sign with respecting the extrinsic VPU and IMU calibration.|
| ERROR_ODSAPP_INTR_IMU_CALIB_IMPLAUSIBLE | In standstill, the length of the measured acceleration vector is expected to be 9.80665 m/s^2, the measured angular rate is expected to be 0 rad/s. If the measurements differ from the expectation by more than 0.12 m/s^2 (acceleration) or 0.012 rad/s (angular rate) the error will be set. |
| ERROR_ODSAPP_VELOCITY_UNAVAILABLE |After the EMVO receives no Visual Odometry update for more than a few seconds, the error shall be set. The error is reset / deactivated when the visual odometry has valid output again.|

## ifm3d errors

The ifm3d API has its own set of error codes and messages. A complete list can be found [here](https://api.ifm3d.com/latest/cpp_api/err_8h_source.html).
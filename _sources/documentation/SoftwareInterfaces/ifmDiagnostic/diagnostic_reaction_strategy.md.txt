# Diagnose error code: reaction strategies

This diagnosis reaction strategy is motivated by the fact that different error codes / scenarios have different implications and severity and therefore have to be treated differently.

## Severity levels definitions

|  Priority | Severity      | Meaning                                                                                                                 |
|  -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------- |
|  Minor    | Information   | This level is used to convey information to the user. No persistent error has occurred.                                 |
|  Moderate | Warning       | This level indicates that an error was detected but is not serious enough to interfere with the running of the program. |
|  Major    | Severe Error  | This level indicates that a serious error was detected and persistent.                                                  |
|  Critical | Unrecoverable | This level usually indicates a error that forces termination of processing.                                             |


## Severity Level dependent actions

| Error category | Priority | Severity level | Handling strategy     |
| --------- | -------- | ---------------------- |-- |
|[Boot sequence](#boot-up-sequence-related-error-codes)|||
| Boot sequence boot sequence 101014| Major | Severe | VPU specific EEPROM content can not be read. [reboot](#reboot--power-cycle) if persistent [factory  reset](#factory-reset)|
| Boot sequence boot sequence 101018| Major | Unrecoverable | Bring-up failed and unrecoverable. Manual reconfiguration required. [reboot](#reboot--power-cycle) if persistent [factory  reset](#factory-reset)|
| Boot sequence tcu 101000 | Critical | Severe / Unrecoverable | TCU firmware is not compatible / was not updated automatically to the correct FW dependent version <br> [reboot](#reboot--power-cycle) if persistent [factory  reset](#factory-reset) and [flash firmware anew](#flash-firmware-anew) |
| Boot sequence head 101004 | Critical | Unrecoverable | The camera head hardware may not be supported by this VPU and firmware. Disconnect all camera heads <br> [reboot](#reboot--power-cycle) and connect one camera head at a time to debug the problem.|
| Boot sequence head 101005 | Major | Severe | The camera mode is not be supported by this VPU and firmware. Select a different mode via the configuration tools and [reboot](#reboot--power-cycle) |
| Boot sequence head 101008 | Major | Severe  | The extrinsic calibration saved on the device (`saveInit`) does not match the connected hard at this specific port. [factory  reset](#factory-reset) to remove the all persistently saved settings or debug config manually per port. |
| Boot sequence head 101009 | Critical |  Unrecoverable | The validation of the camera head hardware identification failed. <br> [reboot](#reboot--power-cycle) if persistent [factory  reset](#factory-reset) and [flash firmware anew](#flash-firmware-anew). Replace hardware|
| Boot sequence head 101016 | Critical | Unrecoverable | Different camera streams connected to the same deserializer. Update hardware connectivity and [reboot](#reboot--power-cycle) |
| Boot sequence icc 101010| Critical |  Unrecoverable | The illumination controller FW does not match the one required by the device FW. [reboot](#reboot--power-cycle) if persistent [flash firmware anew](#flash-firmware-anew). |
| Boot sequence icc 101011| Critical |  Unrecoverable | The illumination controller FW does not match the one required by the device FW. [reboot](#reboot--power-cycle) if persistent [flash firmware anew](#flash-firmware-anew). Replace camera hardware.|
| Boot sequence icc 101012| Critical | Unrecoverable | The illumination controller FW does not match the one required by the device FW. An update is attempted. [reboot](#reboot--power-cycle) if persistent [flash firmware anew](#flash-firmware-anew). |
| Boot sequence icc 101013| Critical |  Unrecoverable | The illumination controller FW does not match the one required by the device FW. [reboot](#reboot--power-cycle) if persistent [flash firmware anew](#flash-firmware-anew). |


| Error category | Priority | Severity level | Handling strategy     |
| --------- | -------- | ---------------------- |-- |
|[Boot sequence](#boot-up-sequence-related-error-codes)|||
| Boot sequence 101002 imu| Critical | Severe  | Detected IMU hardware is not compatible. <br> [reboot](#reboot--power-cycle) if persistent [factory  reset](#factory-reset) and [flash firmware anew](#flash-firmware-anew)|
| Boot sequence 101003 imu| Critical | Severe  | Invalid IMU calibration used at boot-up. [reboot](#reboot--power-cycle) if persistent [factory  reset](#factory-reset) and [flash firmware anew](#flash-firmware-anew) |
| Boot sequence 101006 port| Critical | Severe / Unrecoverable | [reboot](#reboot--power-cycle) if persistent [factory  reset](#factory-reset) |
| Boot sequence 101007 port| Critical | Severe  | The configuration saved on the device (`saveInit`) does not match the connected hard at this specific port. Manual reconfiguration required. If persistent [factory  reset](#factory-reset) |
| Boot sequence 101015 port| Moderate | Severe | A dummy calibration is used during runtime. Measurement performance and accuracy may be reduced. [reboot](#reboot--power-cycle) if persistent [factory  reset](#factory-reset).|
| Boot sequence 101017 port| Major | Severe | Camera head did not respond within 5 sec after boot-up. [reboot](#reboot--power-cycle) if persistent over runtime [factory  reset](#factory-reset) and [flash firmware anew](#flash-firmware-anew).|
| Boot sequence 101019 port| Moderate | Warning | User specified EEPROM content used. Measurement performance and accuracy may be reduced. [reboot](#reboot--power-cycle)|
| Boot sequence 101020 port| Moderate | Warning | User specified calibration used. Measurement performance and accuracy may be reduced. [reboot](#reboot--power-cycle)|


| Error category | Priority | Severity level         | Handling strategy     |
| --------- | -------- | ---------------------- |-- |
|[VPU](#vpu-related-error-codes)|||
| VPU 103002 | Major | Warning | fix power supply |
| VPU 103003 | Major | Warning | fix power supply |
| VPU 103004 | Major | Severe | fix power supply - [reboot](#reboot--power-cycle) |
| VPU 103005 | Major | Severe | fix power supply - [reboot](#reboot--power-cycle) |
| VPU 103006 | Major | Severe | fix power supply - [reboot](#reboot--power-cycle) |
| VPU 103007 | Major | Severe | fix power supply - [reboot](#reboot--power-cycle) |
| VPU 103008 | Major | Severe | [Provide adequate (passive) cooling via heat conduction and convection](insert-link) |
| VPU 103009 | Moderate | Warning | Check NTP server availability and correct configuration|
| VPU 1030010 |  Moderate |  Severe | For IDLE state conditions trigger overrun may result in missed image information <br> see [trigger overruns](#image-loss-due-to-trigger-overruns--non-accepted-trigger-signals) |
| VPU 103011 | Major | Severe | [reboot](#reboot--power-cycle) |
| VPU 103012 | Moderate / Major | Warning / Severe Error | If only sporadic the system will be recover by itself. If persistent or repeated check [Watchdog errors](#watchdog-errors--timeouts) |
| COMM 103000 |  Critical | Severe Error  | [reboot](#reboot--power-cycle) if persistent [factory  reset](#factory-reset) and [flash firmware anew](#flash-firmware-anew) |
| COMM 103001 |  Moderate | Warning  | Warning only: if persistently active [reboot](#reboot--power-cycle)|


| Error category| Priority | Severity level         | Handling strategy     |
| --------- | -------- | ---------------------- |-- |
| [Port](#port-related-error-codes)|||
| Port 102011 | Moderate / Major |  Warning / Severe Error | Warning only: if persistently active [reboot](#reboot--power-cycle) |
| Port 102013 | Critical | Severe / Unrecoverable | [reboot](#reboot--power-cycle) if persistent check for [hardware defects](#fpd-link-errors) |
| Port 102014 | Major / Critical |  Warning / Severe Error | if persistent [reboot](#reboot--power-cycle) for non-series hardware check [internal Algorithmic errors](#internal-error-in-the-port-algorithm)|


| Error category| Priority | Severity level         | Handling strategy     |
| --------- | -------- | ---------------------- |-- |
| [HEAD](#camera-head-related-error-codes)|||
| head 102000| Major | Severe | [Provide adequate (passive) cooling via heat conduction and convection](insert-link) |
| head 102001| Major | Severe | fix power supply - if active / persistent [reboot](#reboot--power-cycle) to reset / reboot heads |
| head 102002|  Major |  Severe | If detected the system will enter error state and blocks image acquisition - to reset  [reboot](#reboot--power-cycle) <br> if persistent [flash firmware anew](#flash-firmware-anew) to update all respective micro controller versions|
| head 102003| Major | Warning / Severe | The respective head will be blocked for image acquisition until no overvoltage is present - fix power supply and cable hardware|
| head 102004| Major | Warning / Severe | The respective head will be blocked for image acquisition until no undervoltage is present - fix power supply and cable hardware|
| head 102005| Major | Unrecoverable | The respective head will be blocked for image acquisition until system is [rebooted](#reboot--power-cycle)|
| head 102006| Critical |  Unrecoverable | The respective head (including its illumination) will be blocked until system is [rebooted](#reboot--power-cycle)|
| head 102007| Major |  Unrecoverable | The respective head has detected a check sum error for its calibration - will be blocked until system is [rebooted](#reboot--power-cycle) <br> if persistent [factory  reset](#factory-reset), finally [flash firmware anew](#flash-firmware-anew) or replace hardware|
| head 102008| Major | Unrecoverable | The respective head will be blocked until system is [rebooted](#reboot--power-cycle)|
| head 102009| Warning | Severe | [Provide adequate (passive) cooling via heat conduction and convection](insert-link). <br> The respective head has reached temperatures exceeding its threshold and will be switched off until cooled down. After cool down phase the head will switch to live operation again by itself.|
| head 102010| Major | Unrecoverable | The respective head will be blocked until system is [rebooted](#reboot--power-cycle)|
| head 102012| Moderate | Warning / Severe | The system detected a imager reset and performed a self healing operation. If error persists [reboot](#reboot--power-cycle).|


| Error category| Priority | Severity level         | Handling strategy     |
| --------- | -------- | ---------------------- |-- |
| [IMU](#imu-related-error-codes)|||
| IMU 104000| Minor / Moderate | Warning | The system checks for IMU timestamp and temperature value plausibility. This warning is active until new plausible data is available. <br> If error is persistent over longer time durations [reboot](#reboot--power-cycle)|


| Error category| Priority | Severity level         | Handling strategy     |
| --------- | -------- | ---------------------- |-- |
| [di](#di-distance-image-processing--filter-related-error-codes)|||
| di 102015| Major | Severe | Sanity checks based on the intrinsic calibration file failed. The data acquisition of the respective camera is blocked. This is most likely due to old / incompatible hardware. <br> If error is persistent [factory  reset](#factory-reset) and [flash firmware anew](#flash-firmware-anew) or replace hardware.|
| di 102016| Moderate| Warning  | If motion compensation is activated but can not be performed due to missing ego data. [Check your mounting setup](#check-mounting-setup). |
| di 102017| Moderate| Warning  | If motion compensation is activated but can not be performed due to ego data availability, i.e. outdated timestamps. [Check your mounting setup](#check-mounting-setup). |


| Error category| Priority | Severity level         | Handling strategy     |
| --------- | -------- | ---------------------- |-- |
| [ODS](#ods-app-related-error-codes)|||
| ODS 105000 | Moderate | Warning | The app checks plausible IMU / VPU extrinsic calibration. Perform a IMU / VPU calibration and sanity check [link](todoo-insert-link)|
| ODS 105001 | Minor / Moderate | Warning | The app checks plausible 3D data timestamps. No internal escalation is performed if active.|
| ODS 105002 | Major | Severe | The app checks camera specific calibration for plausibility. If error is active the respective camera can not be used in this app. <br> If persistent [flash firmware anew](#flash-firmware-anew) to trigger downloads of calibration files again and update dependent camera drivers.|
| ODS 105003 | Major | Severe | The app checks its configuration for plausibility. If implausible the app is set to error state and has to be reconfigured to exit error state. <br> [Check the app specific JSON schema for configuration verification](todoo-insert-link).|
| ODS 105004 | Minor / Moderate | Warning | The app checks plausible 3D frame timestamps. No internal escalation is performed if active.|
| ODS 105005 | Minor / Moderate | Info | The app checks performs repeated IMU standstill calibration during live operation. If the estimated calibration values differ more than the internal threshold from their expected values this error will be activated. <br> This is an internal error - no internal escalation strategy will be applied. It will be automatically be reset by the application at the next possible instance.|
| ODS 105006 | Major | Severe | At least one sub-component of the app is unstable due to unstable framerate of the input data stream. See [ODS unstable framerate](#ods-unstable-framerate-implications) |
| ODS 105007 |  Moderate | Warning | The app performs ego-motion estimations. If no ego-motion is available the application performance may be reduced proportionally to time sice ego-motion estimation was lost. <br> No internal escalation is performed if active. <br> [Check your mounting setup](#check-mounting-setup).|
| ODS 105008 | Minor / Moderate | Information | The app checks for default zone configuration. No internal escalation is performed if active.|
| ODS 105009 | Major | Warning / Severe | The app failed to perform ego-motion estimations.<br> If this error persists, even if the vehicle is standing still with a significant part of structured floor visible on the VO camera, this is an indication that there is either an issue with the IMU or with the extrinsic calibration of the VO camera.|
| ODS 105010 | Major |  Warning / Severe Error | Uncaught internal app exceptions. If persistent instantiate and reconfigure the app, [reboot](#reboot--power-cycle) for non-series hardware check [internal Algorithmic errors](#internal-error-in-the-port-algorithm)
| ODS 105011 | Moderate | Warning | The app checks plausible extrinsic head calibration. Performance may be reduced . No internal escalation is performed if active. <br> [Check your mounting setup](#check-mounting-setup).||
| ODS 105012 | Moderate | Warning | The app is configured with development features active, e.g. overwrite of velocity information status. This is not suggested for deployment as it may lead to unexpected behavior.|



# Handling strategies
## Reboot / power cycle
A software reboot can be performed via the [API CLI methods](https://api.ifm3d.com/html/_autosummary/ifm3dpy.O3R.html?highlight=reboot#ifm3dpy.O3R.reboot) or via the respective OS calls (on the embedded device).

Alternatively one can power cycle the device: the power connection should be interrupted for at least 5 seconds.

## Factory reset
The device can be reset to factory conditions and configuration via the [CLI method](https://api.ifm3d.com/html/content/cmdline_overview.html?highlight=factory%20reset), [API method](https://api.ifm3d.com/html/_autosummary/ifm3dpy.O3R.html?highlight=factory%20reset#ifm3dpy.O3R.factory_reset)

## Flash firmware anew
Please flash the firmware again. For backward compatibility, see the [firmware release notes](https://ifm3d.com/documentation/Firmware/index.html).

## Camera head connectivity
Different camera head imagers, e.g. 2D RGB and 3D ToF, or 3D ToF imagers of different resolutions, need to be connected to separate deserializers.
Ports [0,1], Ports [2,3], Ports [4,5] are paired to the same deserializer internally and can therefore only handle image streams of the same type.
Checks can be performed by verifying the cable description at the mini-Fakra connector or via the complete system status JSON (config under device).

## Image loss due to trigger overruns / non accepted trigger signals
The system runs in a triggered mode internally for RUN and IDLE state. The difference is: for RUN state the system gets triggered continuously (internally), whereas in IDLE state only single software trigger signals are propagated / listened for.

The trigger overrun only applies to the software triggered state - IDLE state: in case multiple trigger signals have been sent and can not be accepted by the system.
In case of trigger overruns the system may have lost trigger signals, i.e. the respective images may not have been acquired or their frame start may have been delayed by an undefined time.
Additionally check for network latency which cause trigger signals to get delayed.

## Image buffer availability
Internally the system monitors its data buffer states. Each data stream is buffer into its own buffers with an anticipated buffer size, depending on the type and data frequency.

When the data is not retrieved fast enough, i.e. the queue is not popped often enough this error is activated:
1. Externally pointing data streams: the data retrieval rate is not adequate - possible bottlenecks are: network bottlenecks (insufficient network speed / latency ), OEM application running at low data retrieval rates, etc. Check your software and hardware for bottlenecks!.
2. Internally pointing data stream: ifm applications on the device: The application is not processing data with the required frequency. See the application specific error codes. Check for additional (Docker based) applications which have high resource requirements.

For case 1 (external): In case data is not retrieved fast enough the data buffer will be partially flushed.
For case 2 (internal): In case data is not retrieved fast enough the data acquisition framerate can be slowed down.

## Watchdog errors / timeouts
The system monitors its internal process states via watchdogs. Each watchdog has it own respective timeout, which is configured to not activate under normal operation conditions, e.g. normal processing power requirements.

High processing requirements or certain re-configurations during runtime can cause sporadic triggers of watchdog timeouts. This can be tracked by dormant and low error counts. This case can be neglected.

In case repeated active watchdog errors and high error counts increases (> 5 / min) the system may not be self recoverable and requires a reboot.

## FPD-Link errors
The system monitors the FPD-Link communication between the VPU and each camera head.

The FPD-Link communication can perform self healing actions for most cases. If `ERROR_PORT_FPDLINK` errors are active the system entered a non-recoverable FPD-Link dependent error state.
Possible sources of such errors are loose cable connections, continuous EMV / ESD disturbances on the cables, damaged cables, etc. Check for possible hardware malfunctions first and replace FAKRA cables to ensure no hardware defects are present.

## Internal error in the port algorithm
The algorithmic data evaluation pipeline on the embedded device monitor for uncaught internal error cases. These should not be present for series hardware and software as supplied by ifm.

For prerelease software and prototype hardware this error may occur. Please check the release notes for known defects for your specific non-series software and hardware.
For older hardware that is no longer supported by newer firmware / software releases this error may occur.
In these cases the data will most likely still be available but may be reduced in performance and accuracy.

## Check mounting setup
Depending on the application specific mounting setups may be required to ensure all required data can be seen, appears in the FOV of the respective camera head.

**Motion compensation:**
The motion compensation algorithm requires the floor to be part of the scene to work. If the floor is not part of the scene / can not be identified as floor for longer durations (> 50 frames), motion compensation will be deactivated.
Fix:
+ Double check your mounting setup for rigidness.
+ Check for hardware cleanliness: dust and finger prints on the housing will reduce performance and possible floor range.
+ If hardware has recently been replaced check for correct alignment and calibrate the system (extrinsic calibration).

## ODS unstable framerate implications
In case an sub-component unstable framerate has been detected the system runs with reduced performance. This includes:
+ throttled input data stream framerate
+ reduced output performance / data quality.

This error can be caused by high resource (CPU / GPU) load scenarios on the embedded device. If additional resource heavy software components are run simultaneously this can cause system overload.
**Solution strategy:**
+ We are working on solutions where CPU intense operations are offloaded to the GPU. This will free up CPU resources for OEM applications - will be available with final FW version 1.0.x
+ OEM user applications should be pinned to specific CPU cores (ARM cores): since ifm applications mainly utilize the Denver cores, OEM applications should be pinned to specific ARM cores. <!-- TODO insert link -->

## Ethernet connection issues
Ethernet connection issues are as of FW 1.0.14 not tracked as diagnostic events / errors. A Ethernet patch cable disconnect for example will not result in an error state as indicated by the status LEDs or diagnostic entries. Such an error can only be tracked using the ifm3d trace call to retrieve the full embedded systemD journal log.
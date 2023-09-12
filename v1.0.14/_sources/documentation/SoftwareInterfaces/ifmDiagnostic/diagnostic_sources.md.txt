
# Diagnostics error code sources

**General information about O3R diagnosis information**
The O3R system provides diagnosis information for different root causes: see the list of independent error case root causes below.


## Boot-up sequence

**WHEN:**

+ This list of error code may be present from start-up of the system.
+ This list of error codes should not persist longterm, i.e. the error state has to switch to dormant for the boot-up to be successful.

**CONTENT**

Boot-sequence and TCU error codes are related to the system configuration on boot-up without any additional hardware being connected / present, i.e. no camera heads etc. connected.
The table IMU holds information about IMU specific error codes during boot-up.

For camera head specific error codes on boot-up see the table head and its subcategory ICC. The table port is related to error codes regarding camera heads connected to the physical FARKRA ports of the VPU. This mapps camera head specific error codes to their respective hardware connection.

```{include} diagnosis_error_codes/section_bootsequence.md
```


## VPU

**WHEN:**

+ This list of error codes may occur at any time during the runtime of the system.
+ Depending on the severity of these error codes: i.e. combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**

+ VPU error codes hold information about undervoltage scenarios at certain voltage levels.
+ VPU error codes hold information about VPU overtemperature, NTP sync status, trigger overruns, image buffer overflows, and watchdog timeouts for the imager retrieval processes.
+ COMM error codes hold information about communication faults to the TCU (trigger control unit) and temperature sensors.

```{include} diagnosis_error_codes/section_vpu.md
```

## Port

**WHEN:**

+ This list of error codes may occur at any time during the runtime of the system.
+ Depending on the severity of these error codes: i.e. combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**

Port error codes hold information about data stream drops due to:
+ 3D imager timeouts
+ FPD-Link internal communication errors, e.g. EMV shocks.
+ Internal algorithmic errors while processing the time of flight data.

```{include} diagnosis_error_codes/section_port.md
```

## Camera Head
**WHEN:**

+ This list of error codes may occur at any time during the runtime of the system.
+ Depending on the severity of these error codes: i.e. combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**

+ Head error codes hold information about overtemperature scenarios, brown outs, etc.  detected at the temperature sensor per camera head.
+ Head error codes hold information about overvoltage and undervoltage scenarios at certain voltage levels.
+ Camera shut-off due to eye-safety violations or overtemperature at the VCSEL driver.
+ Camera imager resets, etc.

```{include} diagnosis_error_codes/section_head.md
```


## IMU
**WHEN:**

+ This list of error codes may occur at any time during the runtime of the system.
+ Depending on the severity of these error codes: i.e. combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**
IMU specific errors such as implausible IMU data returned from the sensor.

```{include} diagnosis_error_codes/section_IMU.md
```

## DI (Distance Image) processing

**WHEN:**

+ This list of error codes may occur at any time during the runtime of the system.
+ Depending on the severity of these error codes: i.e. combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**

+ Unexpected content encountered inside the (intrinsic) calibration file.
+ No ego-motion data (ODS) was received or ego-motion data is corrupted.

```{include} diagnosis_error_codes/section_di.md
```

## ODS app
**WHEN:**

+ This list of error codes may occur at any time during the runtime of the ODS application.
+ Depending on the severity of these error codes: i.e. combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**

Odsapp error codes hold information about:
+ extrinsic calibration of the camera heads are implausible.
+ mismatched timestamp between IMU data and image data.
+ implausible extrinsic calibration, i.e. default values used for `extrinsic_head_to_user` and implausible extrinsic calibration (camera heads) values.
+ ODS app parameterization plausibility checks, i.e default zones used.
+ insufficient / unstable framerates during runtime.
+ missing stand still (3-5 sec) before starting each ODS run.

```{include} diagnosis_error_codes/section_odsapp.md
```

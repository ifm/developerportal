
# Error code sources

The O3R system provides diagnosis information for different root causes. We provide descriptions for each error below.

## Boot-up sequence

**WHEN:**

- This list of error code may be present from start-up of the system.
- This list of error codes should not persist long-term, that is, the error state has to switch to dormant for the boot-up to be successful.

**CONTENT**

Boot-sequence and Trigger Control Unit (TCU) error codes are related to the system configuration on boot-up without any additional hardware being connected, that is no camera heads or other hardware plugged in.
The table IMU holds information about IMU specific error codes during boot-up.

For camera head specific error codes on boot-up see the table head and its subcategory ICC. The table port is related to error codes regarding camera heads connected to the physical FAKRA ports of the VPU. This maps camera head specific error codes to their respective hardware connection.

```{include} diagnosis_error_codes/FW1.1/section_boot_sequence.md
```


## VPU

**WHEN:**

- This list of error codes may occur at any time during the runtime of the system.
- Depending on the severity of these error codes, that is the combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided, see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**

- VPU error codes hold information about undervoltage scenarios at certain voltage levels, VPU over-temperature, NTP sync status, trigger overruns, image buffer overflows, and watchdog timeouts for the imager retrieval processes.
- COMM error codes hold information about communication faults to the TCU (trigger control unit) and temperature sensors.

```{include} diagnosis_error_codes/FW1.1/section_vpu.md
```

## Port

**WHEN:**

- This list of error codes that may occur at any time during the runtime of the system.
- Depending on the severity of these error codes, that is the combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided, see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**

Port error codes hold information about data stream drops due to:
- 3D imager timeouts
- FPD-Link internal communication errors, for example EMV shocks.
- Internal algorithmic errors while processing the time of flight data.

```{include} diagnosis_error_codes/FW1.1/section_port.md
```

## Camera Head
**WHEN:**

- This list of error codes may occur at any time during the runtime of the system.
- Depending on the severity of these error codes: that is combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**

- Head error codes hold information about overtemperature scenarios, brown outs, etc.  detected at the temperature sensor per camera head.
- Head error codes hold information about overvoltage and undervoltage scenarios at certain voltage levels.
- Camera shut-off due to eye-safety violations or overtemperature at the VCSEL driver.
- Camera imager resets, etc.

:::{note}
- Please contact [support](support.efector.object-ident@ifm.com) if diagnostic codes related to camera heads occur repeatedly.
:::

:::{note}
- Please contact [support](support.efector.object-ident@ifm.com) if diagnostic codes related to camera heads occur repeatedly.
:::

```{include} diagnosis_error_codes/FW1.1/section_head.md
```
## IMU
**WHEN:**

- This list of error codes may occur at any time during the runtime of the system.
- Depending on the severity of these error codes: that is combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**
IMU specific errors such as implausible IMU data returned from the sensor.

```{include} diagnosis_error_codes/FW1.1/section_imu.md
```

## Distance image processing

**WHEN:**

- This list of error codes may occur at any time during the runtime of the system.
- Depending on the severity of these error codes: that is combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**

- Unexpected content encountered inside the (intrinsic) calibration file.
- No ego-motion data (ODS) was received or ego-motion data is corrupted.

```{include} diagnosis_error_codes/FW1.1/section_di.md
```

## ODS application
**WHEN:**

- This list of error codes may occur at any time during the runtime of the ODS application.
- Depending on the severity of these error codes: that is combination of error code and number of activations in a certain amount of time, the error escalation strategy has to be decided see  [error escalation strategy](diagnostic_reaction_strategy).

**CONTENT:**

ODS application error codes hold information about:
- Implausible extrinsic calibration of the camera heads.
- Mismatched timestamp between IMU data and image data.
- Implausible extrinsic calibration, that is default values used for `extrinsic_head_to_user` and implausible extrinsic calibration (camera heads) values.
- ODS application parameterization plausibility checks, i.e default zones used.
- Insufficient / unstable framerates during runtime.
- Missing stand still (3-5 sec) before starting each ODS run.

```{include} diagnosis_error_codes/FW1.1/section_odsapp.md
```

## PDS application
**WHEN:**

This list of errors may occur at any time during the runtime of the PDS application.

**CONTENT:**

The PDS application is a triggered application and may raise the following XMLRPC exceptions:
- ERROR_PDSAPP_EXTR_DI_CALIB_IMPLAUSIBLE: Raised, if the algorithm detects an implausible Distance Image extrinsic calibration.
- ERROR_PDSAPP_DEPTH_HINT_OUT_OF_RANGE: Raised, if the algorithm detects an implausible depth hint in the input.

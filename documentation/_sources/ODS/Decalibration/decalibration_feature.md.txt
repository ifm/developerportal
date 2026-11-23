# Camera decalibration detection

:::{note}
    This feature is available only from the firmwares >= 1.20.29
:::

The main purpose of this feature is to detect if the camera is decalibrated by comparing the current estimated extrinsic calibration with the user-provided extrinsic calibration. The feature focuses specifically on detecting deviations in the rotation of the camera. The translation is not considered.

When decalibration is detected, the system generates an `ERROR_ODSAPP_CAMERA_DECALIBRATED` diagnostic message. This diagnostic is mapped to the corresponding port: the source is `/applications/instances/app<X>/ports/port<x>` where `app<x>` represents the specific ODS application instance and `port<x>` represents the decalibrated port.

As this is a diagnostic with severity `minor`, the vehicle doesn't have to be stopped immediately, but calibration values should be reviewed while the vehicle is stationary for example during charging.

:::{important}

- The camera must be properly calibrated using one of the calibration routines described in the [Calibration Routines section](../../CalibrationRoutines/index_calibrations.md).
- If the initial calibration is significantly wrong—such as being completely misaligned or having incorrect extrinsic translation parameters, the algorithm may not be able to detect decalibration properly and may not trigger the diagnostic alert.

:::

## What to do when decalibration is detected

If the ODS application has flagged a `ERROR_ODSAPP_CAMERA_DECALIBRATED` diagnostic message, follow the steps below to determine whether a manual recalibration is needed or if valid correction data is already available.

1. Inspect the `rotDeltaValid` array:
   1. The elements of this array correspond to the rotations around X, Y and Z respectively.
   2. A value of 1 indicates a valid estimation; 0 means the system couldn't determine a reliable correction for the respective axis.
2. If all the validity flags show the value 1, review the correction values:
   1. If the corrected calibration values appear to be suspicious, compare the estimated calibration against the original CAD reference values. Accumulated small calibration adjustments can result in a substantial overall deviation from the intended configuration. 
   2. The direct comparison of rot[XYZ] values may be misleading, it is advisable to compare human-readable angles (e.g., yaw, pitch, roll) or the corresponding rotation matrices to assess the consistency of the calibration.
3. If the corrected values are reasonable, apply them:
   1. Use the fully corrected values (`rotHeadToUser`) to update your camera's extrinsic calibration parameters.
4. Re-calibrate if necessary: if one or more validity flags show 0 or the correction values seem unusually large, consider performing a full manual recalibration.

For a typical calibration correction sequence, view the flowchart below.

![calibration_correction_sequence](calibration_correction.drawio.svg)

## Extrinsic calibration correction

The estimated extrinsic calibration values are provided by algorithm and can be retrieved by deserializing the buffer_id `O3R_ODS_EXTRINSIC_CALIBRATION_CORRECTION` which has the following structure.

| Name             | Type         | Description                                                                                                                                                                                |
| ---------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `version`        | `uint32`     | Version number                                                                                                                                                                             |
| `completionRate` | `float32`    | Represents the completion rate of data collection, ranging from 0.0 to 1.0. A value of 1.0 signifies that sufficient data has been gathered to estimate all three rotational delta values. |
| `rotDeltaValue`  | `float32[3]` | The estimated rotation delta value [rad] to correct the extrinsic calibration. Array of [X, Y, Z].                                                                                         |
| `rotDeltaValid`  | `uint8[3]`   | A flag indicating a valid estimation of rotation delta value (0: invalid, 1: valid). Array of [X, Y, Z].                                                                                   |
| `rotHeadToUser`  | `float32[3]` | The rotation value [rad] of the (corrected) extrinsic calibration (extrinsicHeadToUser). Array of [X, Y, Z].                                                                               |

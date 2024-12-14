# VPU extrinsic calibration
## General information
### Orientation

ODS uses the IMU to compute the motion of the vehicle. To do this, the VPU needs to be calibrated, using the same reference frame as used for the head calibration.

In the table below, we assume that the VPU is positioned parallel to the coordinate system. We provide the angle correspondence between the VPU position and the `rotX`, `rotY` and `rotZ` values. The translations can be measured directly from CAD drawings or on the vehicle itself.

User coordinate system: X (forward), Y (to the left), Z (up).

| rotX [rad] | rotY [rad] | rotZ [rad] | VPU plugs direction | VPU plugs direction in user coordinates (math.) | VPU label direction | VPU label direction in user coordinates (math.) |
| ---------- | ---------- | ---------- | ------------------- | ----------------------------------------------- | ------------------- | ----------------------------------------------- |
| 0          | 0          | 0          | to the right        | -Y                                              | upwards             | +Z                                              |
| 0          | 0          | pi/2       | to the front        | +X                                              | upwards             | +Z                                              |
| 0          | 0          | pi         | to the left         | +Y                                              | upwards             | +Z                                              |
| 0          | 0          | -pi/2      | to the back         | -X                                              | upwards             | +Z                                              |
| pi/2       | 0          | 0          | downwards           | -Z                                              | to the right        | -Y                                              |
| pi/2       | pi/2       | 0          | downwards           | -Z                                              | to the front        | +X                                              |
| pi/2       | pi         | 0          | downwards           | -Z                                              | to the left         | +Y                                              |
| pi/2       | -pi/2      | 0          | downwards           | -Z                                              | to the back         | -X                                              |
| pi         | 0          | 0          | to the left         | +Y                                              | downwards           | -Z                                              |
| pi         | 0          | pi/2       | to the front        | +X                                              | downwards           | -Z                                              |
| pi         | 0          | pi         | to the right        | -Y                                              | downwards           | -Z                                              |
| pi         | 0          | -pi/2      | to the back         | -X                                              | downwards           | -Z                                              |
| -pi/2      | 0          | 0          | upwards             | +Z                                              | to the left         | +Y                                              |
| -pi/2      | pi/2       | 0          | upwards             | +Z                                              | to the front        | +X                                              |
| -pi/2      | pi         | 0          | upwards             | +Z                                              | to the right        | -Y                                              |
| -pi/2      | -pi/2      | 0          | upwards             | +Z                                              | to the back         | -X                                              |
| 0          | pi/2       | pi         | to the left         | +Y                                              | to the front        | +X                                              |
| 0          | -pi/2      | pi         | to the left         | +Y                                              | to the back         | -X                                              |
| 0          | pi/2       | 0          | to the right        | -Y                                              | to the front        | +X                                              |
| 0          | -pi/2      | 0          | to the right        | -Y                                              | to the back         | -X                                              |
| -pi/2      | 0          | pi/2       | to the front        | +X                                              | to the left         | +Y                                              |
| pi/2       | 0          | pi/2       | to the front        | +X                                              | to the right        | -Y                                              |
| -pi/2      | 0          | -pi/2      | to the back         | -X                                              | to the left         | +Y                                              |
| pi/2       | 0          | -pi/2      | to the back         | -X                                              | to the right        | -Y                                              |

### Reference point
The geometrical reference point of the VPU is the intersection point of the two lines of diagonally opposing mounting points at the back of the VPU.
See the figure below for reference.

![](images/vpu_refpoint.png)

<!-- 
## VPU Extrinsic Calibration and Misalignment Estimation

### Introduction

The extrinsic calibration of the VPU, that is, extrinsicVPUToUser, defines the 3D transformation between the VPU coordinate system and the User coordinate system.
It is the basis for the ego-motion estimation of the ODS application of O3R, which is based on IMU measurements.
Since deviations in the extrinsic VPU calibration can impact the ego-motion estimation and therefore the overall ODS performance, it should be as accurate as possible.

To this end, the VPU Extrinsic Calibration Tool assists in determining the extrinsic VPU calibration for axis-aligned mounting positions.
Moreover, the VPU Misalignment Estimation Tool allows to estimate the so-called VPU misalignment, that is, small deviations in the orientation of the VPU, to provide an improved extrinsic VPU calibration.

### VPU Extrinsic Calibration Tool

The VPU Extrinsic Calibration Tool is started using the following command: `python vpu_extrinsic_calibration.py --ip 192.168.0.69 --source port6`.
The input argument `ip` is the IP address of the VPU, `source` specifies the IMU port.

The left side of the GUI shows a table containing the 24 possible orientations of the VPU for axis-aligned mounting positions.
By identifying the direction of the plugs and the labels of the VPU in the User coordinate system, the correct orientation can be determined.
Inserting the corresponding ID on the right side of the GUI, allows rotX, rotY and rotZ to be conveniently set.
For mounting positions of the VPU that are not axis aligned, rotX, rotY and rotZ can be entered directly.
The translation (transX, transY, transZ) between the VPU coordinate system and User coordinate system must be measured manually and must also be specified.
Note that the origin of the VPU coordinate system is defined as the center of the mechanical interface, that is, the center of the four screw holes on the bottom of the VPU.

![](images/vpu_extrinsic_calibration_gui.png)

For more details about the orientation of the VPU, see the full size VPU IPC image here: ![](images/ovp800.png)

After providing the measurements, the extrinsic VPU calibration has to be updated (press `Update`), that is, the two text boxes on the bottom are updated.
Make sure to check that the text box on the right contains the correct values, before the extrinsic VPU calibration, that is, extrinsicVPUToUser, is stored on the VPU (press `Save to VPU`).

### VPU Misalignment Estimation Tool

The VPU Misalignment Estimation Tool relies on IMU data recorded while the vehicle moves on a path shaped like a "lying eight", that is, a right turn followed by a left turn (or vice versa, see the figure below).
While this motion mainly results in angular rates $\omega_{z}$ (around the z-axis), the VPU misalignment (small deviations in the orientation of the VPU) manifests in angular rates $\omega_{x}$ and $\omega_{y}$ different from zero (around the x- and y-axis).
The VPU misalignment is estimated in a least-squares optimization such that the angular rates $\omega_{x}$ and $\omega_{y}$ vanish.
The estimated VPU misalignment is used to update the extrinsic calibration of the VPU.

![](images/lying_eight.png)

The VPU Misalignment Estimation Tool is started using the following command: `python vpu_misalignment_estimation.py --ip 192.168.0.69 --source port6`.
The input argument `ip` is the IP address of the VPU, `source` specifies the IMU port.

The left side of the GUI shows the recorded angular rates (separately for $\omega_{x}$, $\omega_{y}$ and $\omega_{z}$).
The bottom row is the original data, while the top row shows the (aligned) data after estimating the VPU misalignment.
The right side offers several buttons to start and stop data recording (`Start Recording` and `Stop Recording`, respectively), to estimate the VPU misalignment (`Estimate Misalignment`), to store the updated extrinsic calibration on the VPU (`Save to VPU`) and to close the window (`Close Window`).
Moreover, three text boxes show information about the VPU misalignment estimation (top), the extrinsic VPU calibration, that is, extrinsicVPUToUser, as well as instructions and other results (bottom).

![](images/vpu_misalignment_estimation_gui_1.png)

Make sure that the extrinsic VPU calibration is correctly stored on the VPU and is shown in the corresponding text box before starting to record data.

Follow the instructions and press `Start Recording` to start recording data.
Note that it is mandatory to wait for one second before moving the vehicle.
In addition, the VPU Misalignment Estimation Tool expects the vehicle to move in positive x-direction first, that is, the "lying eight"-shaped path must be driven as depicted in the figure above.
To assist recording data, the recorded angular rates are continuously updated and the last ten seconds are displayed.
The length of the recorded data is not important.
Everything from a few seconds to more than one minute is fine.
Make sure that there is a significant rotation with \omega_{z}$ reaching more than +/- 0.25 rad/s in both turns.
The radius of the two turns can be anything between half a meter and several meters.
Make sure that the vehicle is moving on flat ground.

Press `Stop Recording` to stop recording data.
All the recorded angular rates are shown.
The extrinsic calibration is checked for plausibility.
If this check is passed, follow the instructions and press `Estimate Misalignment`.

![](images/vpu_misalignment_estimation_gui_2.png)

The VPU misalignment is estimated.
The results (two angles $\alpha$ and $\beta$ along with the final RMSE) are shown in the top text box.
On the left side of the GUI, the angular rates using the updated extrinsic VPU calibration based on the estimated misalignment are displayed in the top row.
The angular rates $\omega_{x}$ and $\omega_{y}$ should have vanished or should at least be smaller than before.
This is also checked as part of a plausibility check.
If it is passed, the improved extrinsic VPU calibration can be stored on the VPU (press `Save to VPU`).

![](images/vpu_misalignment_estimation_gui_3.png) -->
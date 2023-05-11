
# Automated camera head calibration tools

Camera calibration tools and tactics can change depending on the needs of the application. 

ifm provides [python code samples](Software_Interfaces/Toolbox/ExtrinsicCalibration/StaticCameraCalibration/README) to facilitate calibration using a stationary checkerboard. This process can be used to build calibration cells for end-of-line testing of AMRs/AGVs camera systems.

When developing an AMR and testing the camera system, the static calibration methodology requires repeated measurements with each repositioning of the vehicle. An alternate tool was built to address the needs for field-testing of cameras. This tool is called Multi-Frame-Calibration.


## Multi-Frame Calibration

The Multi-frame-Calibration tool allows the roboticist to perform camera calibration by moving the vehicle which the camera is attached to.

The Application will use the pictures that the camera collects while the vehicle is moving to determine the 3 rotation parameters of the camera's extrinsic calibration.

Prerequisites:
* An o3r camera system mounted on a vehicle.
* A vehicle which can travel in a straight line in the negative-x direction (backward).
* A computer connected to the VPU of the o3r camera system.
* Measurements of the translations of the camera head (transX, transY, and transZ of the extrinsicHeadToUser properties). This can be measured manually, or derived from CAD. Note that the camera positions are relative to the center of the rear face of the camera head. 
<!-- TODO: ADD link to image -->
* The Multi-Frame-Calibration software package. Currently this is available upon request from support.robotics@ifm.com.
* A printed calibration checkerboard (checkerboard.pdf in 0.8m x 0.6m) resting on the floor or at a height so that it is in the field of view of the camera being calibrated.
<!-- TODOOO: ADD PDF for printout -->


### Procedure

Place the target vertical with the reference corner up.

Open the Multi-Frame-Calibration application, selecting the port which corresponds to the camera to be calibrated. You will see a live view from the specified camera.

The menu at the left side of the application will help guide you through the calibration procedure.
<!-- TODO: add UI picture -->

Type in the camera translations.
<!-- TODO: add UI picture -->

Position the vehicle so that as it moves backward, the calibration target will be completely in the camera's field-of-view for at least 2 meters of motion. Side-mounted cameras will require motion parallel to the target,
rear-mounted cameras will require motion toward the target, and front-mounted cameras will require motion away from the target.
<!-- TODO: add diagram -->

Click start-sequence, and begin moving the robot backwards in a straight line at no more than 0.3 meters per second. The application will automatically record pictures of the calibration target as the view of the target changes. The movement can be considered complete when the vehicle has moved at least 1-2m with the target in view. Click stop-sequence.
<!-- TODO: add UI picture -->

There are two additional pictures that need to be recorded. These need to be taken from either side of the straight-line path that the vehicle moved over. Drive the vehicle so that the camera is positioned more than 0.25m from the straight-line path, ensure that the checkerboard is detected in the UI and select "Add image". Drive the vehicle to the other side of the straight-line path and again select "Add image"
<!-- TODO: add diagram-->

You can now press calibrate and the result should be a passing calibration. The extrinsic calibration of this camera can then be deployed on the vehicle.
<!-- TODO: add UI picture -->

### Troubleshooting

In the case that calibration is failing, the UI should suggest a few options to fix the problem. These may be:

* Not enough images to calibrate with. Try positioning the straight-line path so that the camera can see the calibration target over a longer distance.
* Off-axis images are too close. Try positioning the additional photos so that the camera is > 0.25m from the path that the camera moved during the straight-line sequence.
* Motion not linear. Ensure that the vehicle is moving in a straight line, some vehicles can be guided manually, but will not travel in an exactly straight line in this mode. Use a mode of moving the vehicle in a precise line.





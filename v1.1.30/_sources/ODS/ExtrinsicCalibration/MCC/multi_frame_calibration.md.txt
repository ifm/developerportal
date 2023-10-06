
# Automated camera head calibration tools

Camera calibration tools and tactics can change depending on the needs of the application.

ifm provides [Python code samples](../../../SoftwareInterfaces/Toolbox/ExtrinsicCalibration/StaticCameraCalibration/README.md) to facilitate calibration using a stationary checkerboard. This process can be used to build calibration cells for end-of-line testing of AMRs/AGVs camera systems.

When developing an AMR and testing the camera system, the static calibration methodology requires repeated measurements with each repositioning of the vehicle. An alternate tool was built to address the need for field-testing of cameras. This tool is called Motion Camera Calibration (MCC).


## Motion Camera Calibration

The MCC tool allows the roboticist to perform camera calibration by moving the vehicle to which the camera is attached.

The application will use the images that the camera collects while the vehicle is moving to determine the 3 rotation parameters of the camera's extrinsic calibration.

Prerequisites:
* An O3R camera system mounted on a vehicle.
* A vehicle which can travel in a straight line in the negative-x direction (backward).
* A computer connected to the VPU of the O3R camera system.
* Measurements of the translations of the camera head (transX, transY, and transZ of the extrinsicHeadToUser properties). This can be measured manually, or derived from CAD. Note that the camera positions are relative to the center of the rear face of the camera head.
<!-- TODO: ADD link to image -->
* The Motion Camera Calibration software package. Currently, this is available upon request from support.robotics@ifm.com.
* A printed calibration checkerboard (size 0.8m x 0.6m) resting on the floor or at a height so that it is in the field of view of the camera being calibrated.
Please find the checkerboard in PDF format {download}` here <_resources/MotionCameraCalibrationTarget_600X800.pdf>`

### Installation
We recommend installing the MCC tool to a fresh Python3 virtual environment to minimize the risk of conflicting versions of dependent Python libraries.

1. Create a new virtual environment:
   ```
   python3 -m venv venv
   ```

2. Install the requirements: The required `requirements_MCC.txt` file can be found in the GH repository under `ODS/ExtrinsicCalibration/MCC`
   ```
   source ./venv/bin/activate
   python3 -m pip -r requirements_MCC.txt
   ```
3. Install the MCC tool: request the download link via email from: from support.robotics@ifm.com
4. Start the MCC tool:
   ```
   o3r-extr-calib-camera
   ```


### Tool Description

1. The MCC application window has 2 parts. <!-- TODO: add UI picture -->
   1. On the left side, you can:
        * Conﬁgure:
            * The ports
            * The modes
            * The cell size of the checkerboard
            * The translation parameters
        * Start backward motion / stop backward motion
        * Clear and restart the calibration process
        * Save / load the data ﬁle

   2. On the right side, you have two windows:
        * Left window: shows the live stream of the camera,
        * Right window: shows the last image that is used for calibration.

2. You can calibrate only one camera at a time; therefore select the camera port in the application window which you wish to calibrate.

### Procedure

1. Place the target horizontally (if the camera head is mounted horizontally) or vertically (if the camera is mounted vertically) such that the reference corner (bigger cell) is up.
1. Type in the camera translations.
1. Move the camera closer to the target such that the target is large in the live image: it should at least ﬁll 50% of the image. <!-- TODO: add UI picture -->
1. Once the checkerboard is detected, the corners will become green indicating that you can start the backward motion.
1. Click `Start backward motion` and move the robot backward in a straight line.<!-- TODO: add diagram-->
   - Once you clicked the `start backward motion` all other options will be greyed out except `Clear and Restart`
   - **The minimum movement range should be `50 cm` (If you moved the robot less than 50 cm then the calibration will not be successful)**

   ```{image} _resources/move_back.gif
   :alt: Drive backwards
   :width: 400px
   :align: center
   ```
1. The calibration tool will automatically save the frames to a file in the background while you move the robot (camera).
1. Once the calibration tool captures the required number of frames, the `Stop backward motion` button will be enabled again and can be clicked by the user to terminate this step.

   :::{note}  During the procedure, if you feel you did anything wrong or didn't move the camera in a straight line click `Clear and Restart` to restart the calibration procedure.
   :::

1. Move the robot orthogonal to the backward motion line and close to the target (ﬁll at least 50% of the image) such that the tool detects all corners of the checkerboard target.
   - The orthogonal offset should be a minimum of 40 cm.

   ```{image} _resources/capture_frame_1.gif
   :alt: Capture single frame 1
   :width: 400px
   :align: center
   ```

1. Click `Add single image (1/2)` to add this image to the calibration data file. After clicking the button once, it changes to `Add single image (2/2)` which means the first offset position was successful.

1. Move the camera to the other side of the backward motion line and ensure all the checkerboard corners are detected.

   ```{image} _resources/capture-frame-2.gif
   :alt: Capture single frame 2
   :width: 400px
   :align: center
   ```

1. Click `Add single image (2/2)`.

1. Click `Calibrate` to perform calibration and output the results.
1. The calibration status and parameters will be displayed at the top of the application window.

   **Optional Steps**

1.  Manually save the calibration parameters output (values) to a file for further reference.
1.  Save the image data file by clicking on the `Save h5 file` button, this is a handy file to send back to ifm development team for debugging.

### Troubleshooting

The calibration might not be successful due to the following reasons:

   * Backward motion is not in a straight line.
   * If the backward motion path is too short. The minimum path length is 0.4 meters.
   * Due to low signal levels in the images. In this case, try calibrating using `activeIllumination` mode.
   * If the target is too small in the images. Try to move closer to the checkerboard target.
   * If the single images are too close to each other. The offset between the positions of two single images should be at least 0.50 meters.
   * If the distance between a single image and the motion path is less than 0.25 meters.
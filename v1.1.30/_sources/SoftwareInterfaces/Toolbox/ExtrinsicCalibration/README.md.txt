# Extrinsic calibration routines: camera to robot coordinates

The extrinsic camera calibration specifies where the camera head is positioned in a reference coordinate system. Internally at ifm, the following calibration routines were developed to estimate the translations and rotations of cameras and VPU respective to a user defined coordinate system, typically the Robot Coordinate System (RCS).

:::{toctree}
:maxdepth: 2
Static camera calibration <StaticCameraCalibration/README>
Motion camera calibration with ifmVisonAssistant <MCC/mcc_with_iVA>
VPU calibration <VPUCalibration/README>
Calibration verification <CameraCalibrationVerification/extrinsic_calibration_verification>
:::

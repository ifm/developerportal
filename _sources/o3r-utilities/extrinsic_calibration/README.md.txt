# Extrinsic calibration routines: camera to robot coordinates

The extrinsic camera calibration estimates the translational and rotational parameters which transform the coordinates of 3D points to the user coordinate system. Internally at ifm, the following calibration routines were developed to estimate the position and rotation of cameras / IMU respective to the Robot Coordinate System (RCS).

In the checkerboard calibration routine, a robot and a checkerboard are placed exactly parallel and the distances from RCS to the edges of the checkerboard are measured manually.

For the IMU calibration routine, a specific figure has to be driven by the AGV to improve / validate the manually set IMU extrinsic calibration parameters.

:::{toctree}
:maxdepth: 1
The static checkerboard method <checkerboard_static_camera_calibration/README>
The IMU calibration method <IMU_VPU_extrinsic_calibration/README>
:::

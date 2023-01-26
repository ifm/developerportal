# Extrinsic calibration routines: camera to robot coordinates 

The extrinsic camera calibration estimates the translational and rotational parameters which transform the coordinates of 3D points to the user coordinate system. Internally at ifm, the following calibration routines were developed to estimate the position and rotation of the camera respective to the Robot Coordinate System (RCS).

In the checkerboard calibration routine, a robot and a checkerboard are placed exactly parallel and the distances from RCS to the edges of the checkerboard are measured manually.

:::{toctree}
:maxdepth: 1
The checkerboard method <checkerboard_static_camera_calibration/README>
:::

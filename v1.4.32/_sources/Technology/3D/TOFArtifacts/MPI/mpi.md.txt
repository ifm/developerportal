# Multi-Path Interference (MPI)

This artifact occurs when the light emitted from the camera reaches an object or a wall for example, but instead of taking a single direct path back to the sensor, it reflects off multiple surfaces before returning to the camera. This leads to inaccuracies in distance measurements because the sensor may register an average or a combined value from multiple paths, causing a distorted depth map.
When this phenomenon occurs, you would for example see curved walls and floors, especially near corners.

This drawing illustrates the impact of MPI in general:

![Diagram showing the paths taken by the light.](./resources/MPI.png)

The example below shows the point cloud and the impact of MPI on the floor recorded with an actual O3R camera.

![Example of MPI in a scene.](./resources/MPI.gif)

In cases where the environment is controlled, there is an easy solution to MPI.
This solution simply involves using floor material with low reflectivity. 
In the example below the floor material was changed and its reflectivity is below 10% which almost completely eliminates the MPI.

![The impact of MPI is reduced by using a black floor.](./resources/MPI_black_floor.gif)

In most scenarios, MPI does not significantly impact the performance of ODS. This is largely due to the floor segmentation applied within ODS, which effectively differentiates between pixels representing the floor and those corresponding to objects on the floor. Even if an object is located in a region where MPI is present, the system will correctly detect the object’s height above the floor. Only the floor pixels themselves may be affected by MPI, without compromising object detection accuracy.

The following example illustrates this scenario.

![Example of ODS detection in a scene with MPI.](./resources/MPI_ODS.gif)
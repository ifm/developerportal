# Process pinning

By default processes schedules are handled by a multi-process scheduler on Linux devices so that they are distributed over all available CPU resources.
This is also the case for application processes on the O3R system. In consequence they may be run on what ever CPU resource is best suited as decided by the scheduler.

O3R native applications (as supplied by ifm) use the Denver cores as their primary CPU resource and may additionally run on ARM cores of the CPU.
Customer applications such as ROS nodes etc. should therefore be run on the ARM cores. To avoid applications interfering with each other, pinning applications to specific CPU cores can be done, for example:

```sh
taskset -c 0 python3 ros_publisher_node.py
```
This examples pins the ROS publisher node to CPU core 0.
The Denver Cores are core 1, 2.
The ARM cores are 0, 3, 4, 5.

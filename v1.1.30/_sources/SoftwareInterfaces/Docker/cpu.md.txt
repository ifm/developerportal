# Process pinning

By default processes schedules are handled by a multi-process scheduler on Linux devices so that they are distributed over all available CPU resources.
This is also the case for application processes on the O3R system. In consequence they may be run on whatever CPU resource is best suited as decided by the scheduler.

O3R native applications (as supplied by ifm) use the Denver cores as their primary CPU resource and may additionally run on ARM cores of the CPU.
Customer applications such as ROS nodes etc. should therefore be run on the ARM cores. To avoid applications interfering with each other, pinning applications to specific CPU cores can be done, for example:

```sh
taskset -c 0 python3 ros_publisher_node.py
```
This examples pins the ROS publisher node to CPU core 0.

:::{note}
The Denver cores are core 1, 2.
The ARM cores are 0, 3, 4, 5.
:::
## Available resources

When running an ODS application, the available resources for OEM applications depend on the number of simultaneously active cameras. The repartition is as follows:
- `maxNumSimultaneousCameras=1`: 2 ARM A57 cores are available, 
- `maxNumSimultaneousCameras=2`: 1 ARM A57 core is available,
- `maxNumSimultaneousCameras=3`: the OEM docker containers must limit the CPU usage as much as possible (<20% of an ARM A57 core)

Additional such resource considerations can be found under [Running applications concurrent with obstacle detection system](../../ODS/FieldTest/ConcurrentWorkloads/concurrent_workloads.md). 
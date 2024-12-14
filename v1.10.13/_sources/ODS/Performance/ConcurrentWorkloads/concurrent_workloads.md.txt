# Running workloads concurrent with ODS

Any ODS application instance is a set of high priority processes on the OVP8x1.
Additional OEM user processes may see degraded performance, due to high system load based of the ODS application instance.
Additional OEM user processes may cause degraded performance for ODS, meaning the ODS application throttles if too few CPU or RAM resource is available at runtime.

It is important to verify that any additional OEM user code only utilizes system resource to an acceptable level of availability depending on the [resource availability](../../../SoftwareInterfaces/Docker/resource_management.md#resources-availability-for-user-code) and that users pin their processes to the available cores as explained in [the process pinning documentation](../../../SoftwareInterfaces/Docker/resource_management.md#process-pinning).

## Data streams

While ODS is running, connecting to the ifm Vision Assistant (iVA) and streaming point cloud data may noticeably affect performance. This might not pose a problem for basic tasks like data recording or diagnostics in iVA. However, it's indicative of potential performance issues in other scenarios, such as live streaming from a separate IPC or Docker container. In such cases, ODS may not achieve its full frame rate.

While running a user code on the VPU that is using the point clouds or the ODS data it is not advisable to use iVA in parallel. iVA per default requests ODS data and point cloud data which does impact performance on the system, especially in case of 3 cameras.

:::{note}
Slow user receivers will throttle the whole system: make sure all connections are running at Gigabit-Ethernet connection speed.
:::

## Resource Availability for the User

When running an ODS application, the available resources for users to run their own software on the VPU, depend on the number of simultaneously active cameras used by ODS. The repartition is as follows:

- `maxNumSimultaneousCameras=1`: 3 ARM A57 cores are available. External streaming of 3D data via PCIC ports should maintain seamless performance even with 6 3D cameras active (1 dedicated to ODS streaming and up to 5 operating normally).

- `maxNumSimultaneousCameras=2`: 2 ARM A57 cores are available. External streaming of 3D data via PCIC ports may encounter frame drops if more than 5 3D cameras are concurrently running (2 dedicated to ODS streaming and up to 3 operating normally).

- `maxNumSimultaneousCameras=3`: 1 ARM A57 core is available. External streaming of 3D data via PCIC ports may suffer from frame drops with more than 3 3D cameras in operation (3 dedicated to ODS streaming).

For further information on resource availability on the OVP8xx, please refer to the [resource management documentation](../../../SoftwareInterfaces/Docker/resource_management).

:::{note}
ifm embedded applications (ODS, PDS, etc.) only support the use of O3R225 and O3R222 heads.
:::
# Running workloads concurrent with ODS

ODS is a high priority process on the VPU. Additional processes may see degraded performance, and may also cause degraded performance for ODS. It is important to qualify that any additional use-cases perform to an acceptable level of performance.

## PCIC streams

While ODS is running as if in production, connecting to ifmVisionAssistant and streaming point cloud data may not yield perceptible changes in performance but there may be frame-drops in the visualization. This may not be an issue when using iVA for data recording or basic diagnostics, but this is representative of potential performance degradation that could be experienced in alternative examples of concurrent streaming. For example, a separate IPC or docker container is set up to be streaming live point-cloud data from the VPU in production. ODS may not be able to run at full framerate or with minimum possible latency.

While ODS is running with 0-1 cameras, 3D data streamed externally by PCIC ports should not experience frame drops when 6 3D cameras are running.

While ODS is running with 2 cameras, 3D data streamed externally by PCIC ports may experience frame-drops when more than 5 3D cameras are running.

While ODS is running with 3 cameras, 3D data streamed externally by PCIC ports may experience frame-drops when 3 or more 3D cameras are running.

Note that any additional steps in the network (intermediate switches) will likely exacerbate performance degradation.

Additional such resource considerations can be found under [docker CPU usage guide](../../../SoftwareInterfaces/Docker/cpu.md) 
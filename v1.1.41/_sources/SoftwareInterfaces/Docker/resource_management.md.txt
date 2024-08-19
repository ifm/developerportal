# Resource management

## Resources availability for user code

Total available resources on the OVP8xx platform:
  - 2 Denver cores,
  - 4 ARM A57 cores,
  - 1 GPU (256 CUDA cores),
  - 4 GB of RAM, which corresponds to 3826 MiB of usable RAM, the rest being allocated to the OS and ifm firmware,
  - 16 GB of flash memory, with approximately 8 GB available for user data. On OVP81x devices, an additional 16 GB of eMMC storage is available which is mounted to `/var/lib/docker`.

The resources used by ifm processes depend on:
- The connected cameras:
    - Number of cameras,
    - Framerate,
    - Resolution,
    - Processing on CPU or GPU, 
    - State (active or inactive).
- Whether applications are running or not, especially ODS.

Below, we outline the resources available for user code in various scenarios.

### Available RAM
Generally, the available RAM for user code can be calculated with the following formula:

$available\textunderscore memory = (3000 - (372\times n_{38k} + mem\textunderscore used\textunderscore by\textunderscore rgb + mem\textunderscore used\textunderscore by\textunderscore ods + 87\times n_{mcc}))$


With:
- $n_{38k}$ is the number of connected 3D 38k cameras (O3R222 or O3R225),
- $mem\textunderscore used\textunderscore by\textunderscore rgb = (306 + 126\times n_{rgb})$ if $n_{rgb} > 0$ else $0$, where $n_{rgb}$ is the number of connected RGB cameras,
- $mem\textunderscore used\textunderscore by\textunderscore ods = (102 + n_{ods\textunderscore cams}*42)$ if $n_{ods\textunderscore cams} > 0$ else $0$, where $n_{ods\textunderscore cams}$ is the number of cameras used in ODS
- $n_{mcc}$ is the number of MCC applications instantiated. 
The above formula uses a margin of 250MB and reserves 20% for future developments. We recommend keeping around 200MB of RAM free.

Below is a table with some example scenarios and the corresponding available RAM:

| $n_{38k}$ | $n_{rgb}$ | $n_{ods\\_cams}$ | $n_{mcc}$ | Available Memory [MB] | Comment                                                            |
| -------- | -------- | -------------- | -------- | --------------------- | ------------------------------------------------------------------ |
| 6        | 0        | 6              | 6        | 0                     | Not all the 38k camera are active simultaneously in this scenario, but they are all listed as ODS ports. |
| 4        | 2        | 0              | 0        | 954                   |                                                                    |
| 6        | 0        | 0              | 0        | 768                   |                                                                    |
| 0        | 6        | 0              | 0        | 1938                  |                                                                    |

### CPU and GPU resources
#### Cameras only, no ifm application

As of firmware version 1.4.30, by default, all 3D cameras are processed on the GPU. [GPU usage can be disabled](../../Technology/3D/ProcessingParams/use_cuda.md), but we typically recommend keeping the GPU processing active except in cases where the GPU is required for user code.

When the cameras are processed on the GPU, the resources for example scenarios are listed below. 

| Scenario                  | Available ARM A57 cores (total: 4) | Available Denver cores (total: 2) | Available GPU (total 100%) |
| ------------------------- | ---------------------------------- | --------------------------------- | -------------------------- |
| 6x38k @20Hz               | 1                                  | 2                                 | 0                          |
| 4x38k @20Hz + 2xRGB @20Hz | 1                                  | 2                                 | 0                          |

To run your code on the available cores, the processes need to be pinned to these cores. Follow the [resource management documentation](../../SoftwareInterfaces/Docker/resource_management.md).

#### ODS application

When running ODS concurrently with user code on the VPU, the available resources are limited. We list below some exemplary scenarios:

| Scenario                         | Available ARM A57 cores (total: 4) | Available Denver cores (total: 2) | Available GPU (total 100%) | Comments                                                                                                                 |
| -------------------------------- | ---------------------------------- | --------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 3x38k in ODS @20Hz + 2xRGB @20Hz | 0                                  | 0                                 | 0                          | No resources available for user code.                                                                                    |
| 3x38k in ODS @20Hz + 3x38k @20Hz | 0                                  | 0                                 | 0                          | Two of the non-ODS cameras must be configured to run on the CPU (`useCuda=false`). No resources available for user code. |
| 3x38k in ODS @20Hz               | 1                                  | 0                                 | 0                          | The user can use a single ARM core.                                                                            |

To run your code on the available cores, the processes need to be pinned to these cores. Follow the [process pinning documentation](../../SoftwareInterfaces/Docker/resource_management.md).

Notes:
- The tables above assume that all cameras are processed on the GPU (`useCuda` flag), except otherwise noted.
- Maximum number of active cameras for ODS is 3. Cameras used by ODS must be run on the GPU and there is no possibility to change that.
- ODS always uses the GPU, and always takes up the two Denver cores. These cores cannot be used for user applications and the user code should be pinned to the available ARM A57 cores (see [process pinning documentation](../../SoftwareInterfaces/Docker/resource_management.md)).

## Process pinning

The O3R platform is design as a shared resource system, meaning that by default, process schedules are handled by the Linux multi-process scheduler so that they are distributed over all available CPU cores.
This is also the case for OEM application processes. In consequence they may be run on whatever CPU resource is best suited as decided by the scheduler.

ifm embedded applications (ODS, PDS, etc.) use the Denver cores as their primary CPU resource and may additionally run on ARM cores of the CPU.
In cases where an ifm application is running in addition to custom applications such as ROS nodes for examples, the user's application code should be pinned to the ARM cores.

:::{note}
The Denver cores are core 1, 2.
The ARM cores are 0, 3, 4, 5.
:::

Pinning user code can be done using the `taskset` command. For example, to pin `ros_publisher_node.py` to ARM A57 cores, use:
```sh
taskset -c 0,3,4,5  python3 ros_publisher_node.py
```

:::{note}
Ethernet and CAN SocketCAN processes are usually scheduled on core 0 by the scheduler but are not pinned. They receive higher priority through user-space interrupts.
Therefore, if possible, avoid scheduling tasks on core 0 exclusively.
:::

## Docker quotas

The system does not specify Docker quotas.
If user processes deployed via Docker containers use high resource loads, the system might become unresponsive.

In the case of memory leaks or other issues, the Docker containers are **not** automatically stopped.
We recommend to implement safe guards, for example via Docker compose files:

```yaml
version: "2.4"

services:
  redis:
    image: redis:${ARCH}-redis
    build:
      context: .
      dockerfile: Dockerfile.redis
      args:
        - ARCH=${ARCH}
    restart: unless-stopped

    ports:
      - "6666:6379"

    # appendonly -> not using AOF persistence
    # maxmemory -> max memory used by redis
    # maxmemory-policy -> policy to use when maxmemory is reached (allkeys-lru -> Keeps most recently used keys; removes least recently used (LRU) keys)
    command:
      [
        "redis-server",
        "--appendonly",
        "no",
        "--maxmemory",
        "1300mb",
        "--maxmemory-policy",
        "allkeys-lru",
      ]

    logging:
      driver: journald
      options:
        tag: "{{.ImageName}}"

    cpuset: 1,2
    mem_limit: 1500000000
    memswap_limit: 1500000000
```
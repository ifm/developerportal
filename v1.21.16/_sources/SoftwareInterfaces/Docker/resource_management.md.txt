# Resource management

For resources and memory available on VPU, please refer to this [resource management](../../Technology/VPU/ResourceManagement/index_resource_management.md#resource-management) 

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
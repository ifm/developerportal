# Boot-up sequence

The system can take some time to be fully booted, especially in cases when a new camera is connected and an update needs to be performed.
To ensure that the system is operational after a boot-up sequence, there are two things to verify:

1. Once the system is responsive to a `Get()` command, check the JSON configuration. In the device configuration, a specific variable tracks the initialization stages: `/device/diagnostic/confInitStages`. 
   When the device is fully initialized and ready to be used, the variable will contain the list `['device', 'ports', 'applications']`.
2. Check the diagnostic for active errors. Refer to the diagnostic documentation on [how to check the diagnostic using the ifm3d API or the ifm Vision Assistant](./diagnostic_retrieval.md).

For a complete example on how to monitor the boot-up sequence, refer to the ifm3d examples:
:::::{tabs}
::::{group-tab} Python
:::{literalinclude} /ifm3d-examples/ovp8xx/python/ovp8xxexamples/core/bootup_monitor.py
:language: python
:::
::::
::::{group-tab} C++
:::{literalinclude} /ifm3d-examples/ovp8xx/cpp/core/bootup_monitor/bootup_monitor.hpp
:language: cpp
:::
::::
:::::
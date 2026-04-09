# Boot-up sequence

The system can take some time to be fully booted, especially in cases when a new camera is connected and an update needs to be performed.
To ensure that the system is operational after a boot-up sequence, there are two things to verify:

1. Once the system is responsive to a `Get()` command, check `/device/status`.

   When the device is fully initialized and ready to be used, `/device/status` returns `OPERATE`.
2. Check the diagnostic for active errors. Refer to the diagnostic documentation on [how to check the diagnostic using the ifm3d API or the ifm Vision Assistant](./diagnostic_retrieval.md).

Examples for monitoring the boot-up sequence can be found in the [`ifm3d-examples` repository](https://github.com/ifm/ifm3d-examples/tree/main/ovp8xx).
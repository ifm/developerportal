# CAN interface

## Hardware

The O3R has a built-in CAN-bus interface, with the CAN-High and CAN-Low lines on pin 4 and 5 respectively (cf. [hardware diagram](../../GettingStarted/Unboxing/hw_unboxing.md)). Note that cables will need a terminating resistor like the [E11589](https://www.ifm.com/de/en/product/E11589).

## Software

The CAN interface is supported starting from firmware version 0.14.1. Configuring the CAN interface through the JSON configuration is only possible for firmware version 1.4.30 and above.

Please note that the CAN interface is only accessible within Docker when using the `--network host` option.

Before utilizing the CAN interface, it needs to be set up. To verify whether the CAN interface is active and with which bitrate it operates, there are two possible methods: using the `ifm3d` CLI or Python scripts.

1. Using the  `ifm3d` CLI:
    ```bash
    $ ifm3d dump | jq .device.network.interfaces.can0
    {
    "active": false,
    "bitrate": "125K"
    }
    ```

2. Using Python script: see the script below or download it from [ifm3d-examples](https://github.com/ifm/ifm3d-examples/tree/main/ovp8xx/python/ovp8xxexamples/core/can_activate.py).

:::{literalinclude} /ifm3d-examples/ovp8xx/python/ovp8xxexamples/core/can_activate.py
  :language: python
:::

:::{note}
New network settings will only be applied after reboot. The Python script performs a reboot. 
Using the `ifm3d` CLI a reboot can be performed by `ifm3d reboot`.
:::

After activating the CAN interface and rebooting the VPU, we can verify the status of the CAN interface again using the `ifm3d` CLI as follows:

```bash
$ ifm3d dump | jq .device.network.interfaces.can0
{
  "active": true,
  "bitrate": "125K"
}
```

## Example: Interfacing with the [DTM425](https://www.ifm.com/de/en/product/DTM425) RFID antenna using Docker

**Step 1**: Connect the DTM425 to the O3R and both to power.

**Step 2**: Create a minimal Dockerfile (filename: `Dockerfile`) like shown below (the example can be downloaded [here](https://github.com/ifm/ifm3d-examples/tree/main/ovp8xx/docker/can/Dockerfile)):

:::{literalinclude} /ifm3d-examples/ovp8xx/docker/can/Dockerfile
  :language: docker
:::


This Dockerfile installs Python and the CANopen library for Python. The example script is then installed into the image and set to automatically execute when the container is run.

**Step 3**: Use the example Python script below (or download the script [here](https://github.com/ifm/ifm3d-examples/tree/main/ovp8xx/docker/can/can_example.py)) and download the required [EDS file](https://www.ifm.com/de/en/product/DTM425?tab=documents) (filename `DTM425.eds`). Place the files in the same location as the Dockerfile.


:::{literalinclude} /ifm3d-examples/ovp8xx/docker/can/can_example.py
  :language: python
:::

The script writes the hex-value `0xdeadbeef` to the RFID tag and reads the data from the tag. When scanning for the device, it is assumed that the RFID antenna is the only CAN device on the bus, besides the VPU itself.

**Step 4**: Build, deploy and run the Docker container:

```sh
docker build . -t dtm425_example
docker save dtm425_example | ssh -C oem@192.168.0.69 docker load
ssh oem@192.168.0.69 docker run --network host dtm425_example
```

Note that `--network host` *is required* to access the CAN interface.

The output of the last command should look like this:

```
Writing tag: b'\xde\xad\xbe\xef'
Reading tag: b'\xde\xad\xbe\xef\x00\x00\x00[...]\x00\x00\x00'
```

For more information on necessary setup steps for [building](../../SoftwareInterfaces/Docker/docker.md#build-and-run-a-docker-container-for-the-o3r-platform) and [deployment](../../SoftwareInterfaces/Docker/deployVPU.md), please see the linked pages.


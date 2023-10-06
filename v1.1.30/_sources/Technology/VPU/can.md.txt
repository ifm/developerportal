# CAN interface

## Hardware

The O3R has a built-in CAN-bus interface, with the CAN-High and CAN-Low lines on pin 4 and 5 respectively (cf. [hardware diagram](../../GettingStarted/Unboxing/hw_unboxing.md)). Note that cables will need a terminating resistor like the [E11589](https://www.ifm.com/de/en/product/E11589).

## Software

The CAN interface is supported since firmware version 0.14.1 with no further configuration needed. Note that the CAN interface is only accessible in Docker when using `--network host`.

## Example: Interfacing with the [DTM425](https://www.ifm.com/de/en/product/DTM425) RFID antenna using Docker

**Step 1**: Connect the DTM425 to the O3R and both to power.

**Step 2**: Create a minimal Docker file (filename: `Dockerfile`), as shown below:

```Docker
FROM arm64v8/alpine

RUN apk add python3 py3-pip
RUN pip install canopen

COPY can_example.py /usr/local/bin
COPY DTM425.eds /usr/local/share

CMD ["can_example.py"]
```

This Docker file installs Python and the CANopen library for Python. The example script is then installed into the image and set to automatically execute when the container is run.

**Step 3**: Create the example Python script (filename: `can_example.py`; see below) and download the required [EDS file](https://www.ifm.com/de/en/product/DTM425?tab=documents) (filename `DTM425.eds`). Place the files in the same location as the Docker file. Make sure that the script has the executable permission set.

```python
#!/usr/bin/env python3
import time
import canopen


def connect():
    nw = canopen.Network()
    nw.connect(channel="can0", bustype="socketcan")
    nw.scanner.search()
    time.sleep(0.05)

    device = nw.add_node(nw.scanner.nodes[0], "/usr/local/share/DTM425.eds")
    device.nmt.state = "OPERATIONAL"
    time.sleep(0.05)

    return (nw, device)


def disconnect(nw, device):
    device.nmt.state = "PRE-OPERATIONAL"
    nw.disconnect


def write_tag(device, data):
    memory_size = device.sdo[0x2182][0x4].raw

    if len(data) < memory_size:
        data = data + b'\x00' * (memory_size - len(data))

    for offset in range(0, memory_size, 8):
        length = (8 if offset + 8 <= memory_size else
                  memory_size - offset)
        device.sdo[0x2380].raw = offset
        device.sdo[0x2381].raw = length
        device.sdo[0x2382].raw = data[offset:offset + length]


def read_tag(device):
    memory_size = device.sdo[0x2182][0x4].raw
    data = b""

    for offset in range(0, memory_size, 8):
        length = 8 if offset + 8 <= memory_size else memory_size - offset
        device.sdo[0x2280].raw = offset
        device.sdo[0x2281].raw = length
        data = data + device.sdo[0x2282].raw

    return data


nw, device = connect()
data = b'\xDE\xAD\xBE\xEF'
write_tag(device, data)
print("Writing tag:", data)
print("Reading tag:", read_tag(device))
disconnect(nw, device)
```

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


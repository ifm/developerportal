# Timestamps

The O3R provides multiple timestamps that correspond to different times in the acquisition and processing of an image.

## Acquisition timestamps

The acquisition timestamps refer to the center of [each individual HDR exposure time](../../3D/AcquisitionParams/index_acquisition_params.md#exposure-times) (the O3R uses three exposures, a short, a medium, and a long, in that order). For the RGB image, there is only one exposure, so there is only one timestamp.

These timestamps can be retrieved with the ifm3d library respectively in the [`TOF_INFO`](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.deserialize.TOFInfoV4.html#ifm3dpy.deserialize.TOFInfoV4.exposure_timestamps_ns) or [`RGB_INFO`](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.deserialize.RGBInfoV1.html#ifm3dpy.deserialize.RGBInfoV1.timestamp_ns) buffers.

## Receive timestamps

When a frame is received by the end device using the ifm3d API, a timestamp is attached to it (see [frame documentation](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.framegrabber.Frame.html#ifm3dpy.framegrabber.Frame.timestamps)). Depending on the network configuration, the difference between the capture time and the reception time may vary. The ifm3d API appends a timestamp corresponding to the local time of the end device. If the ifm3d API runs on the VPU, the local CPU time of the VPU is used. If ifm3d API runs on the user's machine, a different time zone may be used depending on the local time settings.

Note that NTP does not take time zones into account, but uses UTC as the reference for all timestamps. The user may need to convert the receive timestamps to UTC to match the NTP-synchronized capture timestamp.

The ifm3d API provides the timestamp of the frame as an array of two `datetime` objects. The second element of this table is inherited from legacy products that provided multiple timestamps. For the O3R, the user can use the first element of the table.

## Synchronization

All timestamps can be synchronized using [sNTP](../sntp.md).

## Example 

The example below displays the acquisition and receive timestamps for 2D and 3D frames. 
It also shows timestamps when NTP synchronization is enabled: this relies on having a NTP server running on the user's machine. 

```{literalinclude} timestamps.py
    :language: python
```

Expected output:
```bash
$ python3 timestamps.py 
All the timestamps are displayed in nanoseconds since epoch.
Epoch date in UTC: 1970-01-01 05:00:00+00:00
Local time zone: EDT
/////////////////////////////////
2D acquisition timestamp:           1692812209955356240
2D receive timestamp:               1692812209955355904
Acquisition to reception latency:   256
/////////////////////////////////
3D acquisition timestamps:                      [1692812210115606937, 1692812210111675942, 1692812210098277180]
3D reception timestamps:                        1692812210115606016
Last exposure acquisition to reception latency: 1024
/////////////////////////////////
Enabling NTP synchronization on the device.
Make sure you activate the NTP server on your local machine.
Current local timestamp:    1692812213285470976
Current time on device:     1692812213291698338
3D acquisition timestamps (with sNTP):          [1692812213310297968, 1692812213306366973, 1692812213292968211]
3D reception timestamps (with sNTP):            1692812213310297088
Last exposure acquisition to reception latency: 768
```
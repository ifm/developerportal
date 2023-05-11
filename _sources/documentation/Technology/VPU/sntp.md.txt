# NTP(Network Time Protocol)

The OVP8xx (and M04239) time system is based on the `Unix base time`. `Unix base time` started on the 1st of January, 1970. Get more information from [Wikipedia](https://en.wikipedia.org/wiki/Unix_time).
By default, the OVP8xx (and M04239) will be reset every time a reboot occurs to an arbitrary time: e.g. `1581090786002917000`.


`NTP` might be the right choice, to provide the same `base time` to all O3R systems per facility and to repeatably set the current time.
This whitepaper explains the application of `NTP` on an O3R system.

## What is `NTP`

Network Time Protocol(<https://en.wikipedia.org/wiki/Network_Time_Protocol>) is a network protocol for time synchronization between network systems/participants.

To synchronize different systems, an `NTP` server is needed (e.g. chrony). An `NTP` client (O3R) can connect to the `NTP` server and apply the provided time from the `NTP` server. To provide stable synchronization, some systems are connected with several `NTP` servers to also have a fallback `NTP` server if the `lead` server goes offline.

## Why use NTP with the O3R?

Receiving data - 3D images, occupancy grid, diagnosis - is meaningless if it cannot be seen in the same time context as the system in the same location as this O3R (e.g. AGV). Typically, timestamps (for frames etc.) are measured in seconds, milliseconds or even nanoseconds. For (3D) image processing and other time-critical information, time synchronization is needed. One way could be measuring the start time for different systems, or synchronizing these systems with each other.

If no NTP connection is established the systems default time will be set to a similar value at startup: `1581090786002917000`
This Unix base time timestamp is equivalent to Fri Feb 07, 2020, 15:53:06 GMT+0000

E.g.:
The received occupancy grid frame contains a timestamp based on the OVP8xx time. The AGV logs information about special events - like a detected object (detected by LIDAR and/or ODS). If both events, the AGV log and the ODS data are not within the same time frame, it is hard or near impossible to reference both to each other.

The O3R platform can be synchronized to a central clock using Simple `NTP` - [Wikipedia](https://en.wikipedia.org/wiki/Network_Time_Protocol#SNTP).

When the `SNTP` synchronization is active, the timestamps of all the images sent from the connected camera heads will be synchronized to the defined clock.

:::{note}
  1. Note that enabling synchronization through NTP requires that you consider the general architecture of your system.
  2. The Time Serving machine needs to be fully booted before the O3R is started, to avoid having to perform a time jump.
  3. Also, NTP servers have different levels of accuracy and the O3R might fail to synchronize with one if the accuracy is considered too low.
  4. An alternative approach to (S)NTP is a time "translator" like: https://github.com/ethz-asl/cuckoo_time_translator
:::

## How to activate NTP

The `NTP` configuration is located within the clock parameter of the device configuration (JSON). 

The JSON configuration can be retrieved by ifm3d/ifm3dpy CLI.

```json
    {
        "device": {
            "clock": {
                "currentTime": 1581091007595569376,
                "sntp": {
                    "active": true,
                    "activeServerAddress": "",
                    "activeServerName": "time1.google.com",
                    "availableServers": [],
                    "systemClockSynchronized": false
                }
            }
        }
    }
```

A `NTP` address is not provided by default - `"systemClockSynchronized": false`

**via ifmVIsionAssistant**

.. warning::
    It is not yet possible to provide the NTP server address to the O3R via the ifmVisionAssistant.

**via ifm3d API**

Receive the currently provided NTP server addresses and the currently used NTP address:

```python
    from ifm3dpy.device import O3R
    o3r = O3R()
    print(o3r.get(["/device/clock"]))
```

To connect the O3R to an `NTP` server, provide the server address - `availableServers`:

```python
    # Output available servers --> No Servers
    print(o3r.get(["/device/clock/sntp/availableServers"]))
    
    #set your local IP as an available server
    o3r.set({'device': {'clock': {'sntp': {'availableServers': ["192.168.0.110"]}}}})

    o3r.get(["/device/clock/sntp/availableServers"])
    # Output: {'device': {'clock': {'sntp': {'availableServers': ['192.168.0.110']}}}}
```

After providing a valid `NTP` address:

```json
    {
        "device": {
            "clock": {
                "currentTime": 1676038117923030927,
                "sntp": {
                    "active": true,
                    "activeServerAddress": "192.168.0.110",
                    "activeServerName": "192.168.0.110",
                    "availableServers": [
                        "192.168.0.110"
                    ],
                    "systemClockSynchronized": true
                }
            }
        }
    }
```

## Evaluating NTP configuration

After the NTP synchronization, the `current time` on the OVP8xx should reflect the NTP time.

Without an NTP connection:

```python
    o3r.get(["/device/clock/currentTime"])
    # Output of above line:  {'device': {'clock': {"currentTime": 1581091007595569376}}}
    datetime.datetime.utcfromtimestamp(o3r.get(["/device/clock/currentTime"])["device"]["clock"]["currentTime"] // 1000000000)
    datetime.datetime(2020, 2, 7, 15, 56, 47) # System time without NTP connection
```
With NTP connection:

```python
    o3r.get(["/device/clock/sntp/availableServers"])
    # Output of above line: {'device': {'clock': {'sntp': {'availableServers': []}}}}
    o3r.set({'device': {'clock': {'sntp': {'availableServers': ["192.168.0.110"]}}}})
    o3r.get(["/device/clock/sntp/availableServers"])
    # Output of above line: {'device': {'clock': {'sntp': {'availableServers': ['192.168.0.110']}}}}
    o3r.get(["/device/clock/currentTime"])
    # Output of above line: {'device': {'clock': {'currentTime': 1676037142019902053}}}
    print(datetime.datetime.utcfromtimestamp(o3r.get(["/device/clock/currentTime"])["device"]["clock"]["currentTime"] // 1000000000))
    print(datetime.datetime(2023, 2, 10, 14, 2, 12) # System time with NTP connection)
```

The system time itself is not enough to verify the time synchronization. It is important to see if the timestamp provided by an data frame is also synchronized.

```python
    from ifm3dpy.device import O3R
    from ifm3dpy.framegrabber import FrameGrabber, buffer_id
    import datetime

    fg = FrameGrabber(O3R(),50012)
    fg.start([buffer_id.NORM_AMPLITUDE_IMAGE])
    [ok, frame] = fg.wait_for_frame().wait_for(1500)
    if ok:
        print(frame.timestamps())
    print(datetime.datetime(2023, 2, 10, 15, 22, 43, 608748))
```
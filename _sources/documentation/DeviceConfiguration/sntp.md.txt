# SNTP (Simple Network Time Protocol) setup

The O3R platform can be synchronized to a central clock using (S)NTP. The clock configuration is part of the json configuration:

```json
$ ifm3d dump | jq .device
"clock": {
    "currentTime": 1581107987742150000,
    "sntp": {
    "active": true,
    "activeServerAddress": "",
    "activeServerName": "time3.google.com",
    "availableServers": [],
    "systemClockSynchronized": false
    }
},
...
```

The settings can be changed for instance using the CLI as follows (see the [configuration](ADDLINK) documentation for other methods):
```bash
echo {} | jq '.device.clock.sntp.active=false' | ifm3d config
```

When the sntp synchronization is active, the timestamps of all the images sent from the connected camera heads will be synchronized to the defined clock.

> Note:
> Note that enabling synchronization through NTP requires that you consider the general architecture of your system. 
> The Time Serving machine needs to be fully booted before the O3R is started, to avoid having to perform a time jump.
> Also, NTP servers have different levels of accuracy and the O3R might fail to synchronize with one if the accuracy is considered too low.
> An alternative approach to (S)NTP is a time "translator" like: https://github.com/ethz-asl/cuckoo_time_translator.
# Diagnostics example output

## Example diagnostic output

```JSON title="Example output of one diagnostic error"
    {
        "description": "The extrinsic VPU calibration is implausible",
        "id": 105000,
        "name": "ERROR_ODSAPP_EXTR_VPU_CALIB_IMPLAUSIBLE",
        "source": "/applications/instances/app0",
        "state": "dormant",
        "stats": {
            "count": 0,
            "lastActivated": {
                "bootid": "",
                "timestamp": 0
            },
            "lastDeactivated": {
                "bootid": "1e18bc51-bda5-4258-9463-ef03b5c59bdd",
                "timestamp": 1581090751720
            }
        }
    }
```

### Description / ID / name
These fields are used to identify the error: [see the complete list of available error codes](../diagnostic_sources.md).

### Source
This field describes the source of the error code on the embedded device and OS.
This is used to identify the exact application or process, if multiple similar sources are running in parallel.

### State: active/dormant
The O3R system differentiates between active errors - which are currently active, and dormant errors - errors which happened any time between the start of the system and now.

### Stats
Stats gives you an overview over the count of this specific error, that is how often it has switched states since boot up.
Last activated and last deactivated gives an overview over the timestamps and boot id of the last activation stages.

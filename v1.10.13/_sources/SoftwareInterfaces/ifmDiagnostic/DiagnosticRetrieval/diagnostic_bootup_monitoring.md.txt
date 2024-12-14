# Boot-up diagnostic

## Verify the system operational state after boot-up
To check if the system is operational after a boot-up sequence one should verify at least two stages (for an ODS application):

1. Check that confInitStages:
    1. For non-ODS application scenarios: `/device/diagnostic/confInitStages: ['device', 'ports']`
    2. For ODS application scenarios: `/device/diagnostic/confInitStages: ['device', 'ports', 'applications']`
2. Diagnostic query for active errors

```JSON title="system operational state check: JSON config content"
    "diagnostic": {
      "confInitStages": [
        "device",
        "ports"
      ],
```

Additionally it is advisable to periodically check them systems temperature values via the JSON configuration:
```JSON title="system temperatures: JSON config content"
$ ifm3d dump | jq .device.diagnostic.temperatures
[
  {
    "entity": "BCPU-therm",
    "overtemperature": false,
    "temperatureLimit": 100.5,
    "valid": true,
    "value": 43
  },
  {
    "entity": "GPU-therm",
    "overtemperature": false,
    "temperatureLimit": 100.5,
    "valid": true,
    "value": 40
  },
  {
    "entity": "MCPU-therm",
    "overtemperature": false,
    "temperatureLimit": 100.5,
    "valid": true,
    "value": 43
  },
  {
    "entity": "port2",
    "overtemperature": false,
    "temperatureLimit": 85,
    "valid": true,
    "value": 47
  },
  {
    "entity": "port3",
    "overtemperature": false,
    "temperatureLimit": 85,
    "valid": true,
    "value": 49
  },
  {
    "entity": "VPU",
    "overtemperature": false,
    "temperatureLimit": 100.5,
    "valid": true,
    "value": 43
  }
]
```


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
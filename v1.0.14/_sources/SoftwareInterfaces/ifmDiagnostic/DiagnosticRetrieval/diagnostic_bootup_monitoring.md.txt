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
      "temperatures": [
        {
          "entity": "PLL-therm",
          "value": 26.5
        },
        {
          "entity": "MCPU-therm",
          "value": 26.5
        },
        {
          "entity": "PMIC-Die",
          "value": 100.0
        },
        {
          "entity": "Tboard_tegra",
          "value": 23.0
        },
        {
          "entity": "GPU-therm",
          "value": 25.0
        },
        {
          "entity": "BCPU-therm",
          "value": 26.5
        },
        {
          "entity": "thermal-fan-est",
          "value": 25.899999618530273
        },
        {
          "entity": "Tdiode_tegra",
          "value": 23.0
        },
        {
          "entity": "port2",
          "overtemperature": false,
          "temperatureLimit": 77,
          "valid": false,
          "value": 33
        },
        {
          "entity": "port3",
          "overtemperature": false,
          "temperatureLimit": 77,
          "valid": false,
          "value": 34
        }
      ]
```

??? Example For an example implementation see this Python module:
    ```JSON title="system operational state check"
    --8<-- "ods_examples/helper/bootup_monitor.py"
    ```

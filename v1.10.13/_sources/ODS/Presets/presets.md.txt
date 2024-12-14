# Presets

## Overview

The presets feature in the Obstacle Detection System (ODS) allows the users to define and manage up to 128 predefined zone configurations. This feature facilitates quick switching between different configurations by loading a preset definition through a single command.
This is especially useful in dynamic environments requiring frequent zone setup changes.

## Key features

1. Predefined configurations: users can define up to 128 presets.
2. Quick activation: presets can be activated using the load command with a specific definition identifier.
3. Customizable definitions: each preset includes:
   1. A set of active camera ports.
   2. Zone configurations with a unique
      1. Zone configuration ID
      2. Zone type
      3. Zone coordinates.

:::{note}
Currently, it is not possible to configure the presets using the ifmVisionAssistant. The presets are only configured using the Python or C++ ifm3d API. 
:::

## Parameter description
Within the ODS application parameters, the presets follow the structure below.
All presets are contained under the `presets/definitions` parameter.


```json
{
  "applications": {
    "instances": {
      "app0": {
        "class": "ods",
        "presets": {
          "definitions":{
            "0": {
              "description": "description of the preset",
              "preset": {
                "activePorts": [/* List of active camera ports */],
                "zones": {
                  "zoneConfigID":/* Unique identifier for zone configuration */,
                  "zoneType":/* Type of zone (e.g., convexHull, Polygon) */,
                  "zoneCoordinates": [/* Coordinates defining the zone */]
                }
              }
            }
          },
          "load": {"identifier": 0},
          "location": "/applications/instances/app0/configuration",
          "command": "nop"
        }
      }
    }
  }
}

```
All the parameters can be found in the `applications/instances/appX/presets` section of the JSON configuration.

| Parameter                                  | Description                                                                                                                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/presets/definition/X`                    | The identifier of the first preset, the first identifier must start with value `"0"` (string). A maximum of 128 presets can be configured.                                        |
| `/presets/definition/X/preset/activePorts` | The ports that are used by this preset                                                                                                                                  |
| `/presets/definition/X/preset/zones`       | Define the used protection zones - [See `ods zone definition` for a complete description](../Zones/zones.md). A maximum of three zones can be configured in one preset. |
| `/presets/load/identifier`                      | Value of the identifier of the preset that will be loaded when a `load` command is triggered                                                                                 |
| `/presets/location`                        | A read-only parameter specifying the JSON path to the ODS configuration, where the preset will be loaded when the `load` command is triggered.                          |
| `/presets/command`                         | Specifies the command to be executed. It can have the value `nop` (do nothing) or `load` (trigger loading preset).                                                      |
| `/presets/definitions/X/description`     | String specifying a description for the preset   |

:::{note}
- The preset identifier is a string parameter. 
- The command parameter is per default `nop` and will return to this default again once the operation is completed.
:::

## Load command
To load a preset we use the `load` command, which will set the preset having the identifier matching the value of `/presets/load/identifier`. The load command is located under `/presets/command` and can have the following values:
- `nop`: Default value, meaning do nothing.
- `load`: Triggers loading the preset.

The `load` command execution time mainly depends on the `activePorts` in the preset. If we load a preset with different `activePorts`, the newly added ports need to change from `IDLE` to `RUN`.
Changing only the zones while keeping the same `activePorts` is completed within one to two ODS frames, which corresponds to 50 to 100 ms with the default framerate of 20Hz.

The following table documents the approximate load runtime:

| Change                                                                                                     | Time to update result |
| ---------------------------------------------------------------------------------------------------------- | --------------------- |
| Changing only the zone: `activePorts`: `["port2"]` → `["port2"]`, `zones`: `[zones_i]` → `[zones_j]`       | 50 to 100 ms          |
| Adding another port: `activePorts`: `["port2"]` → `["port2", "port3"]`, `zones`: `[zones_i]` → `[zones_j]` | ~600 ms               |
| Mutually exclusive ports: `activePorts`: `["port2"]` → `["port3"]`, `zones`: `[zones_i]` → `[zones_j]`     | ~600 ms               |

## Configuration procedure

Please follow these steps to configure the ODS presets system:

1. Create an ODS application instance and set up the ODS parameters. Please ensure that you list all the ports used across all presets in the ODS `/appX/ports` parameter. Refer to [the port configuration documentation](../Instantiation/instantiation.md#ports-selection) for detailed instructions.

2. Currently, the presets can only be configured via the ifm3d API. Set a JSON configuration which contains the requested presets. Ensure each preset has **a unique identifier (`presets/definition/X`) matching the `zoneConfigID` values**.
    :::{note}
    JSON validation is only performed during the configuration of presets and not when they are loaded using the load command.
    Each preset identifier should have a unique value starting from 0 up to 999, with a maximum of 128 presets.
    To avoid confusion, set the `zoneConfigID` to match the identifier of each preset.
    This is especially important when using the PLC application, as the global value displayed to the PLC is the `zoneConfigID`, **not** the preset identifier.
    :::
3. Set the ODS application to RUN state. This can be also done before setting the ODS presets. 
    :::{note}
    - At this step, no preset will be automatically loaded. The default value of `applications/instances/appX/configuration/zones/zoneConfigID` is `0`. This does not mean that to the preset containing `zoneConfigID` `0` has been loaded. Only after manually executing a `load` command will the `zoneConfigID` parameter be overwritten.
    - When ODS is in `RUN` state and a preset is added to the configuration, the currently used preset will not change until a `load` command is issued.
    :::
4. Set the desired preset via a `load` command. Make sure to use the identifier to load the appropriate preset. 

## Example Configuration

Below is an example of an ODS configuration including presets.
This configuration includes three presets:

1. Forward driving preset: optimized for detecting objects in front of the vehicle with three detection zones.
2. Backward driving preset: designed for rear detection with two zones.
3. Left turn preset: configured for detecting objects during left turns with three zones.

These presets are provided as examples and can be customized or extended based on the specific needs of the customer.

```json
{
  "applications": {
    "instances": {
      "app0": {
        "class": "ods",
        "ports": [
          "port2",
          "port3",
          "port6"
        ],
        "state": "CONF",
        "presets": {
          "definitions":{
            "0": {
              "description": "Forward preset with three zones and one active camera",
              "preset": {
                "activePorts": [
                  "port2",
                ],
                "zones": {
                  "zoneConfigID": 0,
                  "zoneType":"convexHull",
                  "zoneCoordinates": [
                    [[0, -0.3], [2.5, -0.3], [2.5, 0.3], [0, 0.3]],
                    [[2.5, -0.3], [3.5, -0.3], [3.5, 0.3], [2.5, 0.3]],
                    [[3.5, -0.3], [4.5, -0.3], [4.5, 0.3], [3.5, 0.3]]
                  ]
                }
              }
            },
            "1": {
              "description": "Backward preset with two zones and one active camera",
              "preset": {
                "activePorts": [
                  "port3"
                ],
                "zones": {
                  "zoneConfigID": 1,
                  "zoneType":"polygon",
                  "zoneCoordinates": [
                    [[-0.5, -0.3], [-3.0, -0.3], [-3.0, 0.3], [-0.5, 0.3]]
                    [[-3.0, -0.3], [-4.0, -0.3], [-4.0, 0.3], [-3.0, 0.3]]
                  ]
                }
              }
            },
            "2": {
              "description": "Left turn preset with three zones and two active cameras",
              "preset": {
                "activePorts": [
                  "port2",
                  "port4"
                ],
                "zones": {
                  "zoneConfigID": 2,
                  "zoneType":"polygon",
                  "zoneCoordinates": [
                    [[0.5, 0.3], [1.5, 0.3], [1.5, 0.9], [0.5, 0.9]],
                    [[1.5, 0.3], [2.5, 0.3], [2.5, 0.9], [1.5, 0.9]],
                    [[2.5, 0.3], [3.5, 0.3], [3.5, 0.9], [2.5, 0.9]]
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Best practices

-  As a first configuration step, include all required cameras in the JSON `ports` parameter. You can only define `activePorts` for each preset that are included in the global `ports` parameter. For example, if using two cameras for forward driving and two cameras for backward driving, specify all four camera ports in the global `ports` parameter.
- Ensure that each preset has a unique identifier to prevent one preset from being overwritten by another. Define a unique value for the identifier starting from 0 up to 999, with a maximum of 128 presets.
- We highly recommend to set the `zoneConfigID` value matches the identifier of the preset to avoid confusion. 
- When loading a preset, the identifier of the preset is going to be used for the load command. The `zoneConfigID` displayed is the one defined in the loaded preset, at `presets/definitions/X/zones/zoneConfigID`.

## Known issues:
- The `zoneConfigID` is not enforced to be identical with the presets identifier.
- If no preset is set, the `zoneConfigID` will be displayed as the default value 0, but this doesn't mean that preset 0 is active.
- `IDLE` state will be set for the application if a preset containing an empty `activePorts` is loaded. The ODS will not update the data and the output returned will be empty.
- The default value of the output if no zones or presets are set is  `[0,0,0]`. So please ensure that a preset is loaded before operation.


## Code examples

Code examples are available in the [ifm3d-examples](https://github.com/ifm/ifm3d-examples) repository: see [the Python ODS preset example](https://github.com/ifm/ifm3d-examples/ovp8xx/python/ovp8xxexamples/ods/ods_presets.py).

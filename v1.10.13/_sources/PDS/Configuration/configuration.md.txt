# Configuration

The PDS application is instantiated with a set of JSON parameters. 
A minimal instantiation is as follows, where `"app0"` can be replaced by another app index if required:

```json
{
    "applications":{
        "instances":{
            "app0":{
                "class": "pds"
            }
        }
    }
}
```

This is equivalent to creating a PDS app in the Vision Assistant:

![Instantiating a PDS app in the Vision Assistant](resources/instantiate_app.png)

![Instantiated app with default settings](resources/default_app.png)

The app will be instantiated with all parameters set to their default values. 
The parameters can be further configured and are described below.

## General parameters

| Property                                | Type    | Description                                       | Default   | Minimum | Maximum | Enumeration                    |
| :-------------------------------------- | :------ | :------------------------------------------------ | :-------- | :------ | :------ | :----------------------------- |
| `class`                                 | string  | Application class                                 | N/A       | N/A     | N/A     | `['mcc', 'ods', 'pds', 'plc']` |
| `configuration.version.X`               | integer | Version number for the parameters.                | 0         | 0       | N/A     | N/A                            |
| `data.algoDebugConfiguration.version.X` | integer | Version number for algo-debug.                    | N/A       | 0       | N/A     | N/A                            |
| `data.availablePCICOutput`              | array   | PCIC outputs that are produced by the application | N/A       | N/A     | N/A     | N/A                            |
| `data.pcicTCPPort`                      | integer | PCIC output TCP/IP port of the application        | N/A       | N/A     | N/A     | N/A                            |
| `name`                                  | string  | User-defined application name                     | N/A       | N/A     | N/A     | N/A                            |
| `ports`                                 | array   | N/A                                               | ['port2'] | N/A     | N/A     | N/A                            |
| `state`                                 | string  | Application state                                 | CONF      | N/A     | N/A     | `['CONF', 'IDLE', 'ERROR']`    |

## Customization parameters at `configuration/customization`

These parameters are available at the `configuration/customization` path in the JSON configuration. These parameters allow users to quickly adapt the detection system to their environment with minimal input.

**Recommended for:**

- Users who want to set up the system with minimal adjustments.
- Situations where the detection environment is consistent, and default settings are sufficient.
- Configuring high-level properties like pallet type, detection order, or defining the Volume of Interest (VOI).

**Example:**

For example, to detect a standard pallet in a warehouse when the approximate distance from the camera is known, you would just need to adjust the `depthHint` and select the appropriate `palletIndex`.

**Parameters:**

| Property               | Type   | Description                                                                                                                                 | Default | Minimum | Maximum | Enumeration                                   |
| :--------------------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------ | :------ | :------ | :-------------------------------------------- |
| `command`              | string | PDS command to be executed. When the execution has finished, this field will automatically switch back to nop (No Operation)                | nop     | N/A     | N/A     | `['nop', 'getPallet', 'getRack', 'volCheck']` |
| `getPallet.PARAMETERS` |        | Customization parameters for the `getPallet` command. Refer to [the `getPallet` documentation](../GetPallet/getPallet.md) for more details. |         |         |         |                                               |
| `getRack.PARAMETERS`   |        | Customization parameters for the `getRack` command. Refer to [the `getRack` documentation](../GetRack/getRack.md) for more details.         |         |         |         |                                               |
| `volCheck.PARAMETERS`  |        | Customization parameters for the `volCheck` command. Refer to [the `volCheck` documentation](../VolCheck/volCheck.md) for more details.     |         |         |         |                                               |

## Fine-tuning parameters at `configuration/parameter`

These parameters are available at the `configuration/parameter` path in the JSON configuration.

These parameters should be used when fine-tuning the detection algorithm for optimal performance in complex or variable environments.

**Recommended usage**:

- Users who need to improve accuracy and speed in challenging detection scenarios.
- Pallets of varying sizes or material.
- Racks of non-standard sizes.
- etc.

**Example:** For example, the user can adjust the bounding box dimensions with `getPallet/x/orthoProjection/voi/xMax` and `xMin` to focus the detection on specific areas and therefore increase the detection speed.

**Parameters:**
`getPallet`, `getRack` and `volCheck` can all be fine tuned in specific ways. 
For more details on each of the parameters, refer to the respective documentation: [`getPallet` parameters](../GetPallet/getPallet.md), [`getRack` parameters](../GetRack/getRack.md) and [`volCheck` parameters](../VolCheck/volCheck.md).

## Port parameters at `configuration/port`

These parameters are available at the `configuration/port` path in the JSON configuration.
These parameters mirror the port parameters available at the `/ports/portX` path in the JSON configuration.
They are used to configure acquisition settings and filtering for the port. Typically, these settings to not need to be updated, as the application provide reasonable defaults for most use cases.
---
nosearch: true
---

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
:::{note}
The user can refer to the [JSON schema](../../Technology/configuration.md#json-schema) after instantiating the application for more details on the available parameters.
:::

This is equivalent to creating a PDS app in the Vision Assistant:

![Instantiating a PDS app in the Vision Assistant](resources/instantiate_app.png)

![Instantiated app with default settings](resources/default_app.png)

The app will be instantiated with all parameters set to their default values. 
The parameters can be further configured and are described below.


| Parameter                                      | Description                                                                                                                                                                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                                         | Providing a custom name for the PDS application                                                                                                                                                                          |
| `ports`                                        | The port that is used by the PDS application                                                                                                                                                                             |
| `state`                                        | The current app state (default: `CONF`)                                                                                                                                                                                  |
| `configuration/customization/command`          | The command to be executed by PDS (`getPallet`, `getRack`, `getItem`, `volCheck` or `nop`). `nop` corresponds to no operation. After a command is executed by the PDS, the command parameter is set back to `nop` value. |  |
| `configuration/customization/getPallet`        | Configure the `getPallet` command. Refer to [the `getPallet` documentation](../GetPallet/getPallet.md) for further details on the relevant parameters.                                                                   |
| `configuration/customization/getRack`          | Configure the `getRack` command. Refer to [the `getRack` documentation](../GetRack/getRack.md) for further details on the relevant parameters.                                                                           |
| `configuration/customization/getItem`          | Configure the `getItem` command. Refer to [the `getItem` documentation](../GetItem/getItem.md) for further details on the relevant parameters.                                                                           |
| `configuration/customization/volCheck`         | Configure the `volCheck` command. Refer to [the `volCheck` documentation](../VolCheck/volCheck.md) for further details on the relevant parameters.                                                                       |
| `configuration/port/mode`                      | To designate the measurement range: 2 or 4 meters. This parameter is configurable only in `CONF` state.                                                                                                                  |
| `configuration/port/acquisition/channelValue`  | Channel value where each channel corresponding to a different modulation frequency. This parameter is configurable only in `CONF` state.                                                                                 |
| `configuration/port/acquisition/exposureLong`  | Parametrize the long exposure time. This parameter is configurable only in `CONF` state. The default value works for the majority of use cases and we do not recommend changing this value.                              |
| `configuration/port/acquisition/exposureShort` | Parametrize the short exposure time. This parameter is configurable only in `CONF` state. The default value works for the majority of use cases and we do not recommend changing this value.                             |
| `configuration/port/acquisition/offset`        | Shifts the starting point of the measured range. This parameter is configurable only in `CONF` state. The default value works for the majority of use cases and we do not recommend changing this value.                    |
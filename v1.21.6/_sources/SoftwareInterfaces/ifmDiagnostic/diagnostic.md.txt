# Diagnostic description

## Structure

The diagnostic provides important information about the health of the system and its parts. 
It is always streamed on a dedicated virtual port, port 9, and is structured in JSON.

### Diagnostic

| Key            | Value  | Description                                                                                                                                                                                             |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"bootid"`     | String | A unique number that identifies the boot session.                                                                                                                                                       |
| `"events"`     | List   | The list of diagnostic messages that are currently active or previously occurred during this boot session. The content of the diagnostic messages is described [in the events section](#events).        |
| `"groups"`     | Dict   | For each application and port, a status is provided. It is an aggregated view of all the diagnostic messages related to this app or port. For more details, refer to [the groups description](#groups). |
| `"timestamps"` | Int    | The timestamp of the diagnostic report.                                                                                                                                                                 |
| `"version"`    | Dict   | The current version of the firmware and of the diagnostic template.                                                                                                                                     |


### Events

| Key             | Value                                    | Description                                                                                                                                                                                                                                                                                                                                                          |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"description"` | String                                   | The description of the error.                                                                                                                                                                                                                                                                                                                                        |
| `"id"`          | Int                                      | The error identification number.                                                                                                                                                                                                                                                                                                                                     |
| `"name"`        | String                                   | The error name.                                                                                                                                                                                                                                                                                                                                                      |
| `"severity"`    | `["critical", "major", "minor", "info"]` | `"critical"`: The error will not recover itself and data received in this state is not reliable. The user must intervene to resolve this error. <br>`"major"`: The error might heal itself but data received in this state is not reliable. <br>`"minor"`: A condition is present which may limit performance or functionality. <br>`"info"`: All other diagnostics. |
| `"source"`      | String                                   | The source of the error, that is, the component that detected the error. See more about sources [below](#sources).                                                                                                                                                                                                                                                   |
| `"state"`       | `["active", "dormant"]`                  | The state of the error. If the error is healed within the same boot session, its state will become dormant.                                                                                                                                                                                                                                                          |
| `"stats"`       | Dict                                     | Statistics regarding this event: how many times it was activated, timestamp of the last activation and deactivation, etc.                                                                                                                                                                                                                                            |

#### Sources

The diagnostic sources can be mapped to system components as follows:
  
- `"/applications/instances/appX[/...]"`: the application `appX`.
- `"/applications/instances/appX/ports/portY[/...]"`: the port `"portY"` used by the application `"appX"`.
- `"/ports/portX[/...]"`: the port `portX`.
- `"/device[/...]"`: the VPU.
- `"/device/network/interfaces/X[/...]"`: the network interface `X` (`eth0`, `eth1`, `can`).

### Groups

From the firmware versions 1.20.29 and above, a new feature to monitor the port's/application's health by the group severity. It is recommended to  handle the vehicle behavior by monitoring the group severity.

| Key        | Value                                                                    | Description                                                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Group name | `["not_available", "no_incident", "info", "minor", "major", "critical"]` | Provide the status of the group. It aggregates all the events related to this specific group, and provides an overall health status. For example, if there are two events the occurred for `"app0"`, one `"minor"` and one `"critical"`, then the group `"app0"` will show the severity `"critical"`. |

For more details about using the diagnostic, refer to [the Python](https://github.com/ifm/ifm3d-examples/blob/main/ovp8xx/python/ovp8xxexamples/core/diagnostic.py) and [C++ examples](https://github.com/ifm/ifm3d-examples/tree/main/ovp8xx/cpp/core/diagnostic) using the ifm3d API.

## Error codes and descriptions

:::{include} ../../generated_docs/diagnostic_diagnostics.md
:::

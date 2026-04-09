# Results

The result of PDS is formatted in JSON. 
It contains multiple parts: 
- a common part, which provides information such as the timestamps and the last command used; 
- a command part, which contains the result of the detection (if any).

## Common result

The result of the PDS commands is provided in JSON format. 
The following output is always present in the result of a PDS command, whether or not the detection was successful:

| Property               | Type         | Description                                                                                                                                                             |
| :--------------------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lastCommand`          | string       | The name of the last command used.                                                                                                                                      |
| `lastCommandInput`     | JSON         | The values used for the parameters of the last command. Not all the parameters will be displayed there, but only the ones in the `configuration/customization` section. |
| `pdsVersion`           | JSON         | The current version of the PDS algorithm.                                                                                                                               |
| `timeStamp`            | integer      | The timestamps at which the frame was captured.                                                                                                                         |

## Command results

The details of the output of each command can be found in their respective documentation: [result of `getPallet`](../GetPallet/getPallet.md#results), [result of `getRack`](../GetRack/getRack.md#results), [result of `volCheck`](../VolCheck/volCheck.md#results).
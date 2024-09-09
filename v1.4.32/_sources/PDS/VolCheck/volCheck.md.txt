---
nosearch: true
---

# `volCheck`

The `volCheck` (short for volume check) functionality of PDS offers an easy-to-use possibility to test whether a 3D volume (Volume Of Interest - VOI) is free of obstacles. The number of pixels present in the defined VOI is provided, and the user can decide how many pixels are considered an obstacle.
This command is useful to check whether the location is occupied or not before placing the load, or make sanity check for example to verify that the forks are visible where expected.

## Input

### Command
The input to the `volCheck` command should be provided in JSON.
Below is an example, assuming an instantiated PDS app `app0`:
```json
{
    "applications": {
        "instances": {
            "app0": {
                "configuration": {
                    "customization": {
                        "command": "volCheck",
                        "volCheck": {
                            "xMin": 1,
                            "xMax": 2,
                            "yMin": -0.5,
                            "yMax": 0.5,
                            "zMin": 0.0,
                            "zMax": 0.4,
                        },
                    }
                }
            }
        }
    }
}
```

### `volCheck`
| Name       | Description                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------- |
| `volCheck` | The default bounding box parameters for `volCheck`: `xMin`, `xMax`, `yMin`, `yMax`, `zMin`, `zMax`. |


## Output
The output of a `volCheck` command is formatted in JSON.
An example JSON result, where 2087 pixels were detected within the specified volume, is shown below:

```json
"volCheck": {
    "numPixels": 2087
}
```
### `numPixels`

| Name        | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| `numPixels` | Number of valid pixels inside the given volume of interest. |

## Example

:::{literalinclude} ../Python/vol_check.py
:caption: vol_check.py
:language: python
:::

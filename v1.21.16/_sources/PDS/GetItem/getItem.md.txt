---
nosearch: true
---

# `getItem`
The `getItem` function of PDS is designed to detect the pose of a given item. To do this, PDS requires a template of the item to be detected. A template can be understood as a reference model of the object, consisting of point cloud data from one side of the object, representing the shape of the object as seen from different angles. This template serves as a basis for comparison during the pose detection process.
Please note that these templates typically allow for an angular deviation of up to 10° - 15° from the normal vector.

To detect a custom item, please contact your local ifm support or support.robotics@ifm.com for detailed instructions.

## Input
### Command
The input to the `getItem` command should be provided in JSON. 
Below is an example, assuming an instantiated PDS app `app0`:
```json
{
    "applications": {
        "instances": {
            "app0": {
                "configuration": {
                    "customization": {
                        "command": "getItem",
                        "getItem": {
                            "depthHint": -1,
                            "itemIndex": 0,
                            "itemOrder": "zAscending"
                        }
                    }
                }
            }
        }
    }
}
```
### `depthHint`
| Name        | Description                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `depthHint` | Estimated distance between the item and the calibrated coordinate system center in meters. Set to <=0 for automatic detection. |

### `itemIndex`

The ifm development team developed and tested this functionality on pre-configured trolley types. To detect other types of items, contact ifm support.

| Name        | Description                      |
| ----------- | -------------------------------- |
| `itemIndex` | Type of the item to be detected. |

### `itemOrder`

| Name        | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `itemOrder` | When multiple items are detected, the order of the detected items can be set based on the following properties: <br>`scoreDescending` (default): the item order will be based upon the detection score (highest to lowest), <br>`zAscending` or `zDescending`: the item order will be based upon the height from the floor (`zAscending` - lower to upper, `zDescending` - upper to lower). |

## Output
The output of a `getItem` command is formatted in JSON.
An example JSON result, where the position of one item was identified, is shown below:
```json
"getItem": {
    "depthEstimationVoi": {
        "xMax": 0,
        "xMin": 0,
        "yMax": 0,
        "yMin": 0,
        "zMax": 0,
        "zMin": 0
    },
    "item": [
        {
        "angles": {
            "rotX": 0,
            "rotY": 0,
            "rotZ": 0.05009809136390686
        },
        "position": {
            "x": 1.5020731687545776,
            "y": 0.010188048705458641,
            "z": 0.1468670815229416
        },
        "score": 0.9384191036224365
        }
    ],
    "projectionVoi": {
        "xMax": 0,
        "xMin": 0,
        "yMax": 0,
        "yMin": 0,
        "zMax": 0,
        "zMin": 0
    }
}
```
### `item`
This component of the JSON result lists out all the detected items (up to 10).
For each item, the following information is provided:
| Name       | Description                                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `angles`   | Rotations components `rotX`, `rotY`, `rotZ` of the item, along the three axis of the calibrated coordinate system, in radians.                                            |
| `position` | Cartesian coordinates `x`, `y` and `z` of the item principal point.                                                                                                                |
| `score`    | Detection score of the item [0..1]. Note that the score does *not* correspond to how well the item is detected but rather how close it is to the reference item template. |

### `depthEstimationVoi` and `projectionVoi`

The `depthEstimationVoi` and `projectionVoi` components provide the volumes that were used internally to detect the item:
| Name                 | Description                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `depthEstimationVoi` | Volume used in the algorithm to approximate the position of the front face of the item.                                          |
| `projectionVoi`      | Area where the precise estimation of the position and rotation of the item was done. The pixels outside this area are discarded. |


## Example

To initialize and configure the PDS application to execute `getItem` command, please see the code example below.

:::{literalinclude} ../Python/get_item.py
:caption: getItem.py
:language: python
:::
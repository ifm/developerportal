# `volCheck`

The `volCheck` (short for volume check) functionality of PDS offers an easy-to-use possibility to test whether a 3D volume (Volume Of Interest - VOI) is free of obstacles. The number of pixels present in the defined VOI is provided, and the user can decide how many pixels are considered an obstacle.
This command is useful to check whether the location is occupied or not before placing the load, or make sanity check for example to verify that the forks are visible where expected.

## Configuration

### Command configuration
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


| Property        | Type   | Description                                          | Default | Minimum | Maximum | Enumeration |
| :-------------- | :----- | :--------------------------------------------------- | :------ | :------ | :------ | :---------- |
| `volCheck.xMax` | number | Bounding box dimension of VOI along X-axis - Maximum | 2.5     | N/A     | N/A     | N/A         |
| `volCheck.xMin` | number | Bounding box dimension of VOI along X-axis - Minimum | 1       | N/A     | N/A     | N/A         |
| `volCheck.yMax` | number | Bounding box dimension of VOI along Y-axis - Maximum | 0.4     | N/A     | N/A     | N/A         |
| `volCheck.yMin` | number | Bounding box dimension of VOI along Y-axis - Minimum | -0.4    | N/A     | N/A     | N/A         |
| `volCheck.zMax` | number | Bounding box dimension of VOI along Z-axis - Maximum | 0.5     | N/A     | N/A     | N/A         |
| `volCheck.zMin` | number | Bounding box dimension of VOI along Z-axis - Minimum | 0.1     | N/A     | N/A     | N/A         |

### Fine-tuning parameters

| Property                  | Type   | Description                  | Default | Max. | Min. |
| :------------------------ | :----- | :--------------------------- | :------ | :--- | :--- |
| volCheck/nearestXQuantile | number | Quantile [0..1] for nearestX | 0.05    | 0    | 1    |


## Results
The output of a `volCheck` command is formatted in JSON.
An example JSON result, where 2087 pixels were detected within the specified volume, is shown below:

```json
"volCheck": {
    "nearestX": 1.3,
    "numPixels": 2087,
}
```


| Name        | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| `nearestX`  | Distance in meters to the closest pixel in the volume.      |
| `numPixels` | Number of valid pixels inside the given volume of interest. |

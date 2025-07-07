# `volCheck`

The `volCheck` (Volume Check) feature in PDS provides a straightforward way to verify if a defined 3D volume of interest (VOI) is free from obstacles. It provides the number of valid pixels within a defined VOI and gives the distance to the nearest pixel within that VOI, allowing the user to specify a threshold for considering an area as occupied.  

This functionality is particularly useful for ensuring a location is clear before placing a load or performing sanity checks, such as confirming the visibility of fork tines in their expected position.  

## Use cases  

The `volCheck` command can be applied in various scenarios to enhance operational safety and decision-making:  

- Forkload detection: By comparing the expected pixel count of unloaded forklift tines with the actual count, the system can determine whether the forks are carrying a load.  
- Height validation: Ensure that the ground is at the expected height. If deviations are detected, it may indicate an issue requiring the forklift to stop.  
- Obstacle detection: Checks whether the area in front of the sensor is clear before executing further commands. If an obstacle is present, the forklift can be halted to prevent collisions.  


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

```{include} ../../generated_docs/pds_properties_customization_properties_volCheck.md
```

### Fine-tuning parameters

```{include} ../../generated_docs/pds_properties_parameter_properties_volCheck.md
```

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

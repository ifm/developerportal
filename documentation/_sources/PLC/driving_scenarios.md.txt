# Configuration of presets for an example AGV

AGVs require different zone configurations to operate safely in the various environments. These zone configurations depend on factors like minimum and maximum speed, load and driving scenarios. The following presets configuration serves as an example for a AGV using two camera facing in the main driving direction connected to [`port0`, `port1`] and another camera connected to [`port2`] mounted to the rear end of vehicle.

- Preset 0, when the AGV is driving at high speeds:

![high_speed_AGV](plc_resources/high_speed.png)

- Preset 1, when the AGV is driving at low speeds:

![slow_speed_AGV](plc_resources/slow_speeds.png)

- Preset 2, when the AGV is driving in reverse:

![drive_reverse](plc_resources/drive_reverse.png)

- Preset 3, when the AGV is idle, save power by stopping all active cameras.

These example presets correspond to the following JSON configuration of the `app0` ODS application:
```json
{
    "applications": {
        "instances": {
            "app0": {
                "class": "ods",
                "presets": {
                    "definitions":{
                        "0": {
                            "description": "Driving Forward - High speeds",
                            "preset": {
                                "activePorts": ["port0", "port1"],
                                "zones": {
                                    "zoneConfigID": 0,
                                    "zoneCoordinates": [
                                    [[0.6, 0.5], [0.6, -0.5], [2.6, -0.5], [2.6, 0.5]], // Danger/Emergency Stop Zone
                                    [[2.6, 0.5], [2.6, -0.5], [3.6, -0.5], [3.6, 0.5]], // Warning Zone
                                    [[3.6, 0.5], [3.6, -0.5], [4, -0.5], [4, 0.5]]      // Notify Zone (Slow Down)
                                    ]
                                }
                            }
                        },
                        "1": {
                            "description": "Driving Forward - Slow speeds",
                            "preset": {
                                "activePorts": ["port0","port1"],
                                "zones": {
                                    "zoneConfigID": 1,
                                    "zoneCoordinates": [
                                    [[0.6, 0.5], [0.6, -0.5], [1.6, 0.5], [1.6, -0.5]],  // Danger/Emergency Stop Zone
                                    [[1.6, 0.5], [1.6, -0.5], [2.6, 0.5], [2.6, -0.5]],  // Warning Zone
                                    [[2.6, 0.5], [2.6, -0.5], [4, 0.5], [4, -0.5]]       // Notify Zone (Slow Down)
                                    ]
                                }
                            }
                        },
                        "2": {
                            "description": "Driving Backward",
                            "preset": {
                                "activePorts": [
                                    "port2"
                                ],
                                "zones": {
                                    "zoneConfigID": 2,
                                    "zoneCoordinates": [
                                    [[-0.6, 0.5], [-0.6, -0.5], [-1.6, 0.5], [-1.6, -0.5]],  // Danger/Emergency Stop Zone
                                    [[-1.6, 0.5], [-1.6, -0.5], [-2.6, 0.5], [-2.6, -0.5]],  // Warning Zone
                                    [[-2.6, 0.5], [-2.6, -0.5], [-4, 0.5], [-4, -0.5]]       // Notify Zone (Slow Down)
                                    ]
                                }
                            }
                        },
                        "3": {
                            "description": "Power saving / charging mode",
                            "preset": {
                                "activePorts": [],
                                "zones": {
                                    "zoneConfigID": 3
                                }
                            }
                        }}}}}}}
```
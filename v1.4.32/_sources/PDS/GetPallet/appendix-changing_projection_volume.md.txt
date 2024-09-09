---
nosearch: true
---

# Appendix - Changing the projection volume parameters for non-standard detection

If the default projection volume doesn't meet your needs, you have two options.

## Option 1: Adjust the coordinates of the projection volume.
  
This is the preferred method but requires careful handling. It involves sliding the entire volume without altering its size. For example, if you change the maximum and minimum Y coordinates, you should adjust both by the same amount: `ymax_new = ymax + a` and `ymin_new = ymin + a`, ensuring `ymax_new - ymin_new` remains constant.


We recommend adjusting the projection volume directly if you need to detect pallets that aren't directly in front of the camera but shifted in the Y direction, like shown in the image below:

![shifted](./resources/shifted.svg)

To change the coordinates of the projection volume, the following parameter needs to be added to the configuration (change the `APP_PORT` with your app, for example `app0`):

```json
{
    "applications": {
        "instances": {
            APP_PORT: {
                "configuration": {
                    "parameter": {
                        "getPallet": {
                            "0": {
                                "orthoProjection": {
                                    "voi": {
                                        "yMin": -1 + y_shift,
                                        "yMax": 1 + y_shift,
                                        "zMin": -0.6 + z_shift,
                                        "zMax": 0.6 + z_shift,
                                    }
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

Note that this parameter can be edited for each pallet (up to ten pallets can be detected).

To set this parameter in Python or C++, you can use the respective [get_pallet.py](../Python/get_pallet.py) and [get_pallet.cpp](../Cpp/get_pallet.cpp) examples and edit the parameters of the JSON command. For example, for a shift along the Y axis of 50 cm and along the Z axis of 10 cm, you can do:
:::::{tabs}
::::{group-tab} Python
```python
o3r.set(
    {
        "applications": {
            "instances": {
                APP_PORT: {
                    "configuration": {
                        "customization": {
                            "command": "getPallet",
                            "getPallet": {"depthHint": 1.2},
                        },
                        "parameter": {
                            "getPallet": {
                                "0": {
                                    "orthoProjection": {
                                        "voi": {
                                            "yMin": -0.8 + y_shift,
                                            "yMax": 0.8 + y_shift,
                                            "zMin": -0.4 + z_shift,
                                            "zMax": 0.4 + z_shift,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
)

```
::::
::::{group-tab} C++
```cpp
// Note that the imports are omitted in this snippet of code.
ifm3d::json getPallet_command ={
    {"applications", {
        {"instances", {
            {APP_PORT, {
                {"configuration", {
                    {"customization", {
                        {"command", "getPallet"},
                        {"getPallet", {
                            {"depthHint", 1.2}
                        }},
                    }},
                    {"parameter", {
                        {"getPallet", {
                            {"0", {
                                {"orthoProjection", {
                                    {"voi", {
                                        {"yMin", -0.8 + y_shift},
                                        {"yMax", 0.8 + y_shift},
                                        {"zMin", -0.4 + z_shift},
                                        {"zMax", 0.4 + z_shift},
                                    }}
                                }}
                            }}
                        }}
                    }}
                }}
            }}
        }}
    }}
};
o3r->Set(getPallet_command);
```
::::
:::::

## Option 2: Edit the extrinsic calibration.

Adjust the extrinsic calibration of the camera so that the calibrated coordinate system has an X axis that is parallel to the Y axis of the RCS.
This ensures that the pallet's front face is perpendicular to the camera's X axis, which is what is required by the PDS algorithm.
The results provided by PDS then need to be transformed to the RCS.

This approach is the only one available in cases where the camera is mounted sideways on the robot, as shown in the image below:

![sideway](./resources/sideway.svg)

# Appendix - Changing the getPallet parameters:

::: {warning}
The following parameter changes shall only be done with care! 
changing these parameter may have unintended detection robustness and detection range effects if configured incorrectly for the use case and environment.
:::

If the pallet is more than 2 meters away from the camera and is not detected, you may need to reduce the sanity check thresholds, which is the minimum number of pixels required to validate the pallet.

To change the thresholds, the following parameter needs to be added to the configuration (change the `APP_PORT` with your app, for example `app0`):

```json
{
    "applications": {
        "instances": {
            APP_PORT: {
                "configuration": {
                    "parameter": {
                        "getPallet": {
                            "0": {
                                "localizePallets": {
                                    "faceMinPts": 300,
                                    "stringerMinPts": 70
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

Note that this parameter can be edited per pallet index (up to ten pallets may be used).
Be aware, that it is not recommended to modify this setting. We rather advise you to follow the recommended installation guideline, which should result in a relative camera and pallet position that does not require updating the mentioned parameters.

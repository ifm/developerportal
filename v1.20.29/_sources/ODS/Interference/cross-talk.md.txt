
# Camera interference

In multi-camera uses cases, it can happen that cameras interfere with each other.
Interference can happen when the fields of views of the cameras are overlapping, or when cameras see each other directly.

We provide two ways to mitigate this issue.

## Channel values

Different channel values (that is, slightly different modulation frequencies) are available for the user to pick from.
Each camera can be assigned a value from -100 to 100. Channel values for interfering cameras should be at least two digits apart. For example, assign a first camera `channelValue` to 0, and a second camera to 2.

As of firmware v1.10.13, all the cameras connected to a single OVP are assigned a different channel value equal to the port number times two. This means that channel values do not need to be changed for single OVP applications.

However, when dealing with fleets, vehicles are likely to often pass each other, and in this case a wider variety of channel values should be set, different for each vehicle.
We recommend to randomly assign channel values such that each vehicle camera configuration is different.

The channel values can be set for each application port setting. For example:

```JSON title="Channel value"
{
    "applications":{
        "instances":{
            "appX":{
                "configuration": {
                    "port2": {
                        "acquisition": {
                            "channelValue": 0
                            }
                    },
                    "port3": {
                        "acquisition": {
                            "channelValue": 2
                        }
                    }
                }
            }
        }
    }
}
```
:::{note}
Since the application takes ownership of the ports that it uses and is able to reset their parameters, the port parameters relevant to the application have to be set within the port section of the application configuration, and not directly in the top level port settings: `/applications/instances/appX/configuration/portY`.

Also note that the port settings under `/ports/portY` cannot be changed while the application is running. To reconfigure a port, always use the port settings in the specific application configuration `/applications/instances/appX/configuration/portY`.
:::

## Timing jitter 

:::{note}
This parameter is available for firmware 1.20.29 and above.
It is only available for cameras used in the ODS application.
:::

Typically, using different channel values is sufficient to mitigate interference between cameras. 
However, in specific geometric configurations, some interference can still occur and cause false detections.
If you notice this effect during your testing, the timing jitter can be a useful feature.

Timing jitter slightly changes the timing of each frame, such that the probability of interference between two cameras is lowered further. 
This parameter can be activated for the application, and will apply to all the ports used by this application.
To activate it, switch `/applications/instances/app<x>/configuration/enableTimingJitter` to `true`.

Activating the timing jitter leads to non-constant timestamp deltas in the ODS timestamp output. This means that the timestamps of each frame will not precisely correspond to the expected timestamp of regularly spaces frames at 20Hz.

## Intra vs. inter system interference

For interference between cameras connected to the same VPU, the best results are obtained when the cameras with overlapping fields of view are:
-  Synchronized, that is, running with the same framerate, delay, exposure time and jitter settings,
-  Running with different channel values (the channel values must be at least 2 apart).

For interference between cameras connected to different VPUs, the best results are obtained when:
- A different channel values is assigned to all the cameras (the channel values must be at least 2 apart),
- Timing jitter is enabled.
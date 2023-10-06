# Dust mitigation

:::{note}
This feature was added in firmware version 1.1.30.
:::


## Prerequisites and limitations
ODS has the ability to mitigate the negative effects of a dusty environment, which means it can be configured to reduce the false positive rate caused by dust artifacts.


:::{note}
Light dust conditions can be more easily mitigated by the application filter.
Heavier dust conditions can still cause false positives or ghost objects in the occupancy grid and dependent zone information.
:::

An O3R camera exposed to dust will degrade its performance. Please clean the head regularly in dusty conditions, even if there is no visually noticeable amount of dust on the camera head itself.
Suggestions for cleaning intervals and procedures can be found in this separate document [O3R Cleaning Instructions](../../Technology/Hardware_Interfaces/camera_heads.md#cleaning-camera-heads).


## Configuration

The dust mitigation feature is always active - the appropriate parameter is called `temporalConsistencyConstraint`. By default, the dust mitigation is tuned for good detection performance under light dust conditions.

This configuration is located in the `grid` section of the ODS JSON configuration.

The JSON below shows the `temporalConsistencyConstraint` parameter as part of the overall ODS application JSON configuration:
```json
{
    "applications":{
        "instances":{
            "app0":{
                "configuration": {
                    "grid": {
                        "temporalConsistencyConstraint": 1
                    }
                }
            }
        }
    }
}
```

The default value of the `temporalConsistencyConstraint` parameter is 1.
Maximum and minimum parameter values can be extracted from the [JSON schema](../../Technology/configuration.md#json-schema).


## Application specific fine tuning

*The `temporalConsistencyConstraint` factor increases the number of frames needed for objects to be marked as valid detection. Use factors > 1 for dusty conditions.*

The effect of the dust mitigation feature `temporalConsistencyConstraint` can be understood as multi-sampling as implemented in other active 3D measurement units such as LIDAR scanners.

A value of 1 is equivalent to the ODS default multi-sampling being active. The object probability increase is set to its default values,
This means that the normal probability increase applies: larger objects can be detected within 1-2 frames, smaller objects at ground level may need up to 4 frames to increase their probability value in the occupancy grid above the default threshold (0.5).

Increasing the `temporalConsistencyConstraint` parameter is equivalent to decreasing the probability increase per frame.
As a result, object detection becomes more robust against time-dependent artifacts such as dust, but will also increase system latency.
It takes more frames to reach a probability level corresponding to an object detection.

Since dust artifacts are highly dependent on the amount of dust type in this particular scenario, testing must be done in the field to tune the filter for this specific use case:
+ We suggest a `temporalConsistencyConstraint` parameter between 1 and 1.5 for light dust conditions.
+ For heavy dust conditions a `temporalConsistencyConstraint` parameter between 1.5 and 2 may be required. In heavy dust conditions, the algorithm relies heavily on the availability of ego-motion data. In addition, heavy dust condition may reduce detection performances for small moving objects.

Note that increasing the `temporalConsistencyConstraint` parameter will decrease the probability of false positive detections caused by dust artifacts. However, this does not mean that all false positives can be handled by this filter, especially under heavy dust conditions.
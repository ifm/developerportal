# ODS ToF artifacts

This paper gives an overview of O3R 3D Time of Flight (ToF) specific artifacts and their effect on ODS.

## Common Time of Flight (ToF) artifacts

**Common artifacts associated with 3D Time of Flight (ToF) imaging**

1. Multipath Interference: This artifact occurs when the light emitted from the ToF camera reflects off multiple surfaces before returning to the camera. The camera then interprets these multiple reflections as being at different distances, leading to errors in depth calculation.
2. Motion Blur / Motion artifacts: This artifact occurs when the subject or the camera is moving during the time it takes for the ToF camera to capture a complete image. This can lead to blurred or distorted images, as the camera's depth calculations are based on the assumption that the subject is stationary.
3. Stray light: Straylight artifacts are an artifact that occurs when the light emitted by the ToF camera is scattered or reflected by surfaces other than the intended subject, such as the camera's own housing or nearby objects. When this happens, the camera may receive additional light that can lead to errors in depth calculation. For example, imagine a ToF camera pointed at a scene with a subject in the foreground and a wall in the background. When the camera emits a burst of light, some of the light may reflect off the foreground object and return to the camera, while some may reflect off the wall and return to the camera. However, if the camera's own housing or nearby objects scatter or reflect some of the emitted light, the camera may receive additional light that can lead to depth measurement errors.
4. Crosstalk between cameras of the same type and cameras and other active sensors in the same near infrared spectrum,
5. Dust: Dust particles in the air may reflect significant amounts back at the camera at close distances. These particles appear to be medium to large objects, because of their close proximity.
6. Low signal-to-noise ratio: pixels affected by this artifacts are discarded by the internal filters such as the `minimumAmplitude`, the `minimumReflectivity` and the `distanceNoise` filters.
7. Pixel saturation: pixel saturation are discarded by the internal filter pipeline
8. Halo effects surrounding bright objects such as retro-reflectors

For further details please see the extended documentation on [ifm3d.com](https://ifm3d.com/documentation/DeviceConfiguration/index.html)

## ODS specific effects of ToF artifacts

### True / False positives
In the context of binary classification (i.e., classifying data into one of two categories), a true positive (TP) is a case where the model correctly predicts the positive class, while a false positive (FP) is a case where the model predicts the positive class, but the true label is actually negative.

To put it more formally, let's define:

+ TP: The model predicts a positive class, and the true label is positive.
+ FP: The model predicts a positive class, but the true label is negative.
+ (True negative (TN): The model predicts the negative class, and the true label is negative.)
+ (False negative (FN): The model predicts the negative class, but the true label is positive.)


These classification outcomes are typically described in a [confusion matrix](https://en.wikipedia.org/wiki/Confusion_matrix).

### ODS effects of TP(s), FP(s), TN(s) and FN(s)

To summarize:

+ True Positive (TP): The ODS model correctly predicts a positive case, i.e there is an actual object and the ODS algorithm detected it.
+ False Positive (FP): The model incorrectly predicts a positive case, i.e there is no object and the ODS algorithm falsely detected one.
+ True Negative (TN): The model correctly predicts a negative case, i.e there is no object and the ODS algorithm correctly detected no object.
+ False Negative (FN): The model incorrectly predicts a negative case, i.e there is an actual object and the ODS algorithm falsely detected no object.

### ODS performance and robustness

In the case of ODS ToF artifacts most likely cause an increase in false positive rate (FP) but do not decrease the ODS true positive rate (TP).
This means the algorithms performance most likely is not reduced but the robustness is reduced.
This is equivalent to the robot stopping even tough there is no object present - this may lead to downtime but does not cause accidents, i.e. FNs.

For all possible sources of FPs above, the ODS application is tailored to be as robust as possible:

1. Multipath Interference: We use specifically designed acquisition modes in conjunction with internal processing filters to allow us to detect multipath interference effected scenes and react accordingly.
2. Motion Blur / Motion artifacts: We use specifically designed acquisition settings in conjunction with internal processing filters to allow us to detect motion artifacts effected part of scenes and react accordingly.
3. Stray light: We use specifically designed internal processing filters to allow us to detect stray light effected scenarios. However such sources of stray light can only be detected if the source of the stray light lies within the inner boundaries of the cameras field of view (FoV).
   1. Please minimize all sources of possible stray light in close vicinity of the camera mounting: For further details please see the mounting instructions included in this documentation repository and also read the O3R manual.
   2. For stray light effects caused by overhanging load, please see the [overhanging load documentation](../../../Parameters/OverhangingLoads/overhanging_loads.md).
4. Crosstalk:
   1. For inter O3R camera crosstalk please use our channel implementation to mitigate inter O3R camera crosstalk. A channel difference of >= 2 between any two cameras will reduce the effects of crosstalk to the same level as typical background noise caused by ambient non-pulsed NIR light sources.
   2. For O3R to other active sensor devices crosstalk:
      1. Please mount the O3R cameras away from laser scanner mounting planes. This reduces the possibility of direct line-of-sights between the cameras and the laser scanner. We recommend at least a vertical offset of 10 cm between the scanner plane and the cameras optical center.
      2. Please refer to the laser scanner manuals for their suggested parameter sets for mobile robot applications: These typically state a multi sampling for all mobile robot applications. ifm internal tests have shown that for a correctly parameterized laser scanner in a mobile robot application, the O3R to laser scanner crosstalk does not cause significant amounts blinding events and no false positives.
5. Dust: Improvements for dusty environments have been introduced in FW version 1.0.14. Additional to algorithmic mitigation approaches, please clean the O3R cameras regularly - refer to the respective chapter in [the hardware doc](../../Hardware/hardware.md)
6. Other ToF artifacts of minor effect strength and frequency of occurrences: All of these are typically handled by internal processing filters - no user parameter fine tuning required.
      1. Low signal
      2. Pixel saturation
      3. Halo effects
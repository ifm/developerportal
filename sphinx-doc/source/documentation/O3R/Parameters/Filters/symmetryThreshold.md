# Symmetry Threshold
## Abstract

The symmetry threshold `maxSymmetry` is used for filtering motion artifacts. Increasing the threshold value leads to more valid pixels around moving objects but also increases the chance of computing incorrect distance measurements for some pixels. Decreasing the threshold will result in invalidation of more pixels because of their estimated symmetry value. 
In cases with a high ambient noise level, the dynamic symmetry filter should be enabled (with the parameter `enableDynamicSymmetry`) to ensure pixels are not invalidated due to ambient noise. 

## Description
The O3R camera heads use the ifm ToF (Time of Flight) technology for measuring the distance to objects. To calculate one single point cloud image, the system takes several independent image frames. These images are correlated over time (see [basic concepts](../basicConcepts.md)). This correlation is represented as symmetry value. It can be thought of as the four modulated signals used for performing the *raw* measurement, being more or less symmetrical to one another.

For low symmetry threshold values, only pixels for which the correlation images are highly symmetrical (i.e., with no or few motion artifacts) are valid. Because of inherent noise, a perfect symmetry is never possible even for static scenes. Increasing the symmetry threshold validates pixels with higher symmetry values, including noisy pixels and potential motion artifacts.

In a high-noise environment, the sensor noise might be propagated to the symmetry image and most of the pixels invalidated because of the symmetry threshold. In these cases, the dynamic symmetry should be activated. The dynamic symmetry ensures that the symmetry threshold of a pixel is at least high enough to prevent invalidation due to sensor noise. It can be thought of as differentiating motion artifacts from ambient noise in the scene.

*If the dynamic symmetry is enabled, each pixel gets an individual symmetry value, which is either the `maxSymmetry` setting or the expected symmetry (computed internally) due to noise, whichever one is greater.*

## Example

*COMING SOON...*
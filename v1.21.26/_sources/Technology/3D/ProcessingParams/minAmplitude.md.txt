# Minimum Amplitude
## Abstract

The minimum amplitude (`diParam.minAmplitude`) parameter invalidates pixels where the amplitude (reflected light) drops below the minimum threshold.

## Description

For each pixel, the amplitude value represents how much light was received by the imager. The minimum amplitude parameter provides a threshold that defines when the system should discard pixels with low amplitude. The images below show the amplitude image and the corresponding point cloud for a scene containing black totes that are made out of a dark plastic and reflect very little light. As can be seen, part of the point cloud is missing where the amplitude of the pixel is below the chosen threshold value.

|Amplitude image |Point cloud |
|--|--|
|![default-values-amplitude](./resources/default_value_amp.png "3D amplitude image")|![default-values-3d](./resources/default_value_3D.png "3D point cloud with default values")|

In the table below, the same scene is measured with different amplitude threshold values. With a value of zero, we can compute the point cloud for the very dark areas.  we increase the threshold to 50, a large part of the point cloud is lost where the pixels marked as invalid.

|Minimum amplitude| Point cloud|
|:-:|-|
|0|![3D point cloud with minimum amplitude=0](./resources/amp_0_3D.png)|
|20|![3D point cloud with minimum amplitude=20](./resources/default_value_3D.png)|
|50|![3D point cloud with minimum amplitude=50 values](./resources/amp_50_3D.png)|

In certain cases, such as when black objects are in the field-of-view. Changing the default value from 20 to zero can be beneficial, because then more pixels are counted as valid pixels and the point cloud is more complete.
Generally speaking, lowering the amplitude leads to more ambient noise and less accuracy in the distance measurement. In this case, we encourage you to test the [filters](./processing_params.md) available with the O3R to mitigate the noise from black objects measurements.

> Note: black objects in the visible spectrum are not necessarily black in the near infrared range.

> Note: The minimum amplitude threshold is applied to the *non-normalized* amplitude image. The numerical value of the *normalized* amplitude image might not correspond to expected values with the set threshold. The normalization factor used in our algorithm is accessible as part of the PCIC output and called `ampNormalizationFactor`.

## Related topics

The minimum amplitude parameter is related to the maximum distance noise parameter: a low amplitude value with a high distance noise value ensures that more pixels are valid but will allow for a noisier measurement, requiring some filtering, for instance with the temporal filter. See the following:
- [Distance noise](./maxDistNoise.md)
- [Temporal filter](./temporalFilter.md)
- [Bilateral filter](./bilateralFilter.md)
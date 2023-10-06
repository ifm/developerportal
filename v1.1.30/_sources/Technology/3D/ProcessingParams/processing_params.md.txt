
# 3D processing parameters overview
## Maximum Distance Noise
|Variable name|Short description|
|--|--|
|`maxDistNoise`|Defines the maximum allowable distance noise. Its value represents the standard deviation of the distance value, in meters.|

Typical filters tend to utilize “broad strokes” when making decisions on which pixel to keep and which to filter. These “broad strokes” may eliminate pixels that are critical to the use case. By utilizing the noise value, we only eliminate pixels with the highest noise value (e.g, ambient light) while preserving the maximum amount of usable data. Applying filters in conjunction with the maximum distance noise filter increases the potential for usable pixels in the scene.

When to change default:
- Lower the max. distance noise value if you are attempting to measure an object with high precision (e.g, box dimensioning).
- Increase the max. distance noise value if it is more important to evaluate all pixels in the scene, regardless of their noise (for example obstacle detection).

Learn more [here](./maxDistNoise.md).

## Minimum Amplitude and minimum reflectivity
|Variable name|Short description|
|--|--|
|`minAmplitude`|Defines the minimum amplitude value required for a pixel to be valid|
|`minReflectivity`|Defines the minimum reflectivity required of the measured object for a pixel to be valid|
A pixel is valid if the energy (amplitude) received is above the defined threshold. The measured amplitude is primarily affected by both the reflectivity of the object and its distance to the camera.

When to change the default:

Lower the default value when the standard targets are known to have low reflectivity (for example <10% like matte black targets). A lower amplitude threshold is also valuable when attempting to detect negative obstacles (for example stairs).
It is recommended to enable a noise filter (temporal or adaptive filter) when lowering the default minimum amplitude.

Learn more about the minimum amplitude [here](./minAmplitude.md).

Learn more about the minimum reflectivity [here](./minReflectivity.md)

## Adaptive Noise Bilateral Filter and Median Filter
|Variable name|Short description|Min/max values|
|--|--|--|
|`anfFilterSizeDiv2`|Adaptive Noise Bilateral Filter. mask size is *(2\*anfFilterSizeDiv2+1)^2*.| 0: disable the filter <br />1: 3x3 <br />2: 5x5 <br />3: 7x7|
|`medianSizeDiv2`|Size of the mask for spatial median filtering (the size is *(2\*medianSizeDiv2+1)^2)*|0: disable the filter <br />1: 3x3 <br />2: 5x5|

The adaptive bilateral noise filter reduces distance noise while also preserving object edges. Utilizing a larger number of pixels (for example 7x7) in the mask will, in most cases, result in better image quality.

**We recommend that you typically use the bilateral filter because it is more efficient and has a better incorporation of the noise.**

The median filter does not preserve edges as well as the bilateral filter and tends to produce round corners, but being more computationally efficient, could be utilized with “in-motion” use cases (for example obstacle detection on mobile robots).

Learn more [here](./bilateralFilter.md)

## Temporal Filter
|Variable name|Short description|
|--|--|
|`enableTemporalFilter`|Enables the filter|

The temporal filter mitigates distance noise by integrating pixel information over multiple frames. There is no strict limit for the number of frames. Instead, an automatic resetting approach is applied to the pixels.

Although the O3R temporal filter can be used for “in-motion” use cases, it is best suited for static scenes.

Learn more [here](./temporalFilter.md)

## Mixed Pixel Filtering
|Variable name|Short description|Min/max values|
|--|--|--|
|`mixedPixelFilterMode`| Filtering mode (angle or distance)|0: disable the filter, 1: mixed pixel filter is on and uses an angle threshold, 2: mixed pixel filter is on and uses an adaptive delta distance threshold|
|`mixedPixelThresholdRad`| Threshold given in [rad] for the minimum angle between the surface tangent and the view vector (used if `mixedPixelFilterMode`=1).| |

Mixed pixels (or “flying pixels”) are pixels that fall partially on a foreground object and partially on an object in the background. Because the physics of indirect ToF do not allow the imager to distinguish partial pixel measurements, the full pixel result is a weighted average distance measurement between the two targets. When viewing the point cloud, these pixels appear “floating”, or not corresponding to any object.
The mixed pixel filter removes the mixed pixels from the image.

When to change the default:
Mixed pixels fall on the edges of targets. Use cases, such as negative obstacle detection, could take advantage of the additional information provided by these mixed pixels, requiring the filter to be disabled.

Learn more [here](./mixedPixelFilter.md)

## Symmetry Threshold
|Variable name|Short description|
|--|--|
|`dynamicSymmetryThreshold`| The threshold given as a factor of the symmetry's standard deviation. If set to 0, the filter is disabled.|


The raw modulated signal used to perform the distance measurement is designed to be perfectly symmetrical (sent and received). This is true for static applications. If the object is in motion, however, the symmetry of the reflected signal may be altered, leading to “motion blur”. This artifact can be mitigated by allowing "less" symmetry in the measurements.

> Note: adjusting this filter for faster motion, or allowing less symmetry, will increase overall distance noise.

Learn more [here](./symmetryThreshold.md)

# Settings Description

## Acquisition Settings

### Modes
|Variable name|Short description|Min/max values|
|--|--|--|
|`mode`|This parameter designates the measurement range: 2 or 4 meters.|experimental_high_2m, experimental_high_4m *(default)*|

Learn more [here](AcquisitionSettings/modes.md).

### Exposure Times
|Variable name|Short description|Min/max values|
|--|--|--|
|`expLong`, `expShort`|These parameters are used to set the exposure times.|1–5000 µs|

Exposure times are utilized to maximize the number of valid pixels in a scene. The use of multiple exposures permits the camera to operate in “dynamic” environments that require the detection of dark and light objects at both the minimum and maximum ranges.

The proper exposure time for a pixel depends on factors such as the dynamics of the scene and whether the target is moving or stationary. For highly reflective targets or for motion, a short exposure time is best. For targets far away or with low reflectivity, we prefer a high exposure time.
As such, it is common that all targets of a scene cannot be properly exposed with a single exposure time. 
To reduce noise and the number of overexposed/underexposed pixels, we use three exposures for each frame. The “experimental_high” mode provides two settable exposure times (`expLong` and `expShort`) plus a third *static* exposure (set at 30 µs) designed to help detect highly reflective targets in the very near range (~1 m). Note that using a small ratio of exposure times helps reduce noise in transitions regions (where neighboring pixels use different exposure times).

> Note: You can find which exposure time is used for each pixel by analyzing the confidence image as detailed [here](confidenceImage.md).

### Offset
|Variable name|Short description|Min/max values|
|--|--|--|
|`offset`|Shifts the start point of the measured range (see *mode*)|+/-30 meters|

Coded modulation dictates the base range of the camera. (e.g., 0.2 to 2 m). Coded modulation also allows this range to be offset or shifted from its start point. In the example of 0.2–2 m base range, an `offset`
of 1 would lead to a 1.2–3 m range. Continuing this example, an `offset` of 2 leads to a 2.2–4m range. The `offset` can be changed frame by frame.

Learn more [here](AcquisitionSettings/offset.md).

### Framerate
|Variable name|Short description|Min/max values|
|--|--|--|
|`framerate`|Defines the number of frames captured each second|1 to 20 frames per second (FPS)|

The FPS highly depends on the applied imager settings (exposure mode and times, filters, etc.). Higher exposure times, for example, negatively impact the overall FPS. The O3R is designed to achieve 20 FPS in the 2 m and 4 m modes, *regardless* of applied settings. Higher FPS may be achievable by reducing the applied settings.

## Filters
### Maximum Distance Noise
|Variable name|Short description|Min/max values|
|--|--|--|
|`maxDistNoise`|Defines the maximum allowable distance noise. Its value represents the standard deviation of the distance value, in meters.|0 to 1. Default 0.05 -> 5 cm noise|
        
Typical filters tend to utilize “broad strokes” when making decisions on which pixel to keep and which to filter. These “broad strokes” may eliminate pixels that are critical to the use case. By utilizing the noise value, we only eliminate pixels with the highest noise value (e.g, ambient light) while preserving the maximum amount of usable data. Applying filters in conjunction with the maximum distance noise filter increases the potential for usable pixels in the scene.

When to change default:
- Lower the max. distance noise value if you are attempting to measure an object with high precision (e.g, box dimensioning).
- Increase the max. distance noise value if it is more important to evaluate all pixels in the scene, regardless of their noise (e.g., obstacle detection).

Learn more [here](Filters/maxDistNoise.md).

### Minimum Amplitude
|Variable name|Short description|Min/max values|
|--|--|--|
|`minAmplitude`|Defines the minimum amplitude value required for a pixel to be valid|0 to 1000. Default: 20 |

A pixel is valid if the energy (amplitude) received is above the defined threshold. The measured amplitude is primarily affected by both the reflectivity of the object and its distance to the camera.

When to change the default: 

Lower the default value when the standard targets are known to have low reflectivity (e.g., <10% like matte black targets). A lower amplitude threshold is also valuable when attempting to detect negative obstacles (e.g., stairs).
It is recommended to enable a noise filter (temporal or adaptive filter) when lowering the default minimum amplitude.

Learn more [here](Filters/minAmplitude.md).

### Adaptive Noise Bilateral Filter and Median Filter
|Variable name|Short description|Min/max values|
|--|--|--|
|`anfFilterSizeDiv2`|Adaptive Noise Bilateral Filter. mask size is *(2\*anfFilterSizeDiv2+1)^2*.| 0: disable the filter <br />1: 3x3 <br />2 *(default)*: 5x5 <br />3: 7x7|
|`medianSizeDiv2`|Size of the mask for spatial median filtering (the size is *(2\*medianSizeDiv2+1)^2)*|0 *(default)*: disable the filter <br />1: 3x3 <br />2: 5x5|

The adaptive bilateral noise filter reduces distance noise while also preserving object edges. Utilizing a larger number of pixels (e.g., 7x7) in the mask will, in most cases, result in better image quality.

**We recommend that you typically use the bilateral filter because it is more efficient and has a better incorporation of the noise.**

The median filter does not preserve edges as well as the bilateral filter and tends to produce round corners, but being more computationally efficient, could be utilized with “in-motion” use cases (e.g., obstacle detection on mobile robots).

Learn more [here](Filters/bilateralFilter.md)

### Temporal Filter
|Variable name|Short description|Min/max values|
|--|--|--|
|`enableTemporalFilter`|Enables the filter|true (default)/false

The temporal filter mitigates distance noise by integrating pixel information over multiple frames. There is no strict limit for the number of frames. Instead, an automatic resetting approach is applied to the pixels. 

Although the O3R temporal filter can be used on “in-motion” use cases, it is best suited for static scenes.

Learn more [here](Filters/temporalFilter.md)

### Mixed Pixel Filtering
|Variable name|Short description|Min/max values|
|--|--|--|
|`mixedPixelFilterMode`| Filtering mode (angle or distance)|0: disable the filter, 1 *(default)*: mixed pixel filter is on and uses an angle threshold, 2: mixed pixel filter is on and uses an adaptive delta distance threshold|
|`mixedPixelThresholdRad`| Threshold given in [rad] for the minimum angle between the surface tangent and the view vector (used if `mixedPixelFilterMode`=1).|0 to 1.57079. <br >*(default 0.15)*|

Mixed pixels (or “flying pixels”) are pixels that fall partially on a foreground object and partially on an object in the background. Because the physics of indirect ToF do not allow the imager to distinguish partial pixel measurements, the full pixel result is a weighted average distance measurement between the two targets. When viewing the point cloud, these pixels appear “floating”, or not corresponding to any object.
The mixed pixel filter removes the mixed pixels from the image.

When to change the default:  
Mixed pixels fall on the edges of targets. Use cases, such as negative obstacle detection, could take advantage of the additional information provided by these mixed pixels, requiring the filter to be disabled.

Learn more [here](Filters/mixedPixelFilter.md)

### Symmetry Threshold
|Variable name|Short description|Min/max values|
|--|--|--|
|`enableDynamicSymmetry`| |true *(default)*/ false|
|`maxSymmetry`|Defines the maximum allowed asymmetry for a measured pixel. A pixel with a higher symmetry is discarded.|0 to 1 <br>*(default: 0.4)*|

The raw modulated signal used to perform the distance measurement is designed to be perfectly symmetrical (sent and received). This is true for static applications. If the object is in motion, however, the symmetry of the reflected signal may be altered, leading to “motion blur”. This artifact can be mitigated by allowing "less" symmetry in the measurements.

> Note: adjusting this filter for faster motion, or allowing less symmetry, will increase overall distance noise.

Learn more [here](Filters/symmetryThreshold.md)
### Stray light
|Variable name|Short description|Min/max values|
|--|--|--|
|`enableStraylight`|Turn stray light correction on/off|True *(default)*/false|

Stray light is defined as “unwanted light from the active illumination reaching the imager”. This is typically experienced when there is a very bright object in the FoV. The resulting amplitude of pixels landing on the bright object affect the neighboring “darker” pixels. This is seen as a “halo” around the bright object. This “halo” can affect the measurement of neighboring pixels (even providing a value for pixels where none previously existed). The stray light filter mitigates this physics artifact.

Learn more [here](Filters/strayLight.md)    
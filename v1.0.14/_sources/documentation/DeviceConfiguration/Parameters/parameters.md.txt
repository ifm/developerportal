# Settings Description

> Note: The min, max and default values of each parameter are defined in the json schema.
> To print out the schema, you can use the [ifm3d CLI](ifm3d/doc/sphinx/cli_link:ifm3d%20-%20Command%20Line%20Tool):
> `ifm3d jsonschema`
## Acquisition Settings
### Framerate
|Variable name|Short description|
|--|--|
|`framerate`|Defines the number of frames captured each second|

For the O3R system the FPS is independent from the applied imager settings (exposure mode and times, filters, etc.). Higher exposure times, for example, will **not** negatively impact the system's FPS. The O3R is designed to achieve 20 FPS in the 2 m and 4 m modes, *regardless* of applied settings.

### 2D imager
#### Mode
|Variable name|Short description|
|--|--|
|`mode` (for the 2D imager) |This parameter designates the acquisition mode: auto or manual exposure |standard_autoexposure2D, standard_manualexposure2D |
#### Exposure time
|Variable name|Short description|
|--|--|
|`exposureTime`| Exposure time used for the acquisition of the RGB image, in ms.|

#### Gain
|Variable name|Short description|
|--|--|
|`gain`| Image gain (affects sensibility to light).|

The gain is particularly useful in low light situations, used in combination with the exposure time: increasing the exposure time as well as the gain will result in a brighter image.

### 3D imager
#### Modes
|Variable name|Short description|Available values|
|--|--|--|
|`mode` (for the 3D imager) |This parameter designates the measurement range: 2 or 4 meters.|standard_range2m, standard_range4m, cyclic_4m_2m_4m_2m|

Learn more [about the standard modes for the 3D imager](documentation/O3R/Parameters/AcquisitionSettings/modes:Modes).

#### Exposure Times
|Variable name|Short description|
|--|--|
|`exposureLong`, `exposureShort`|These parameters are used to set the exposure times.|

Exposure times are utilized to maximize the number of valid pixels in a scene. The use of multiple exposures (HDR) permits the camera to operate in “dynamic” environments that require the detection of dark and light objects at both the minimum and maximum ranges.

The proper exposure time for a pixel depends on factors such as the dynamics of the scene and whether the target is moving or stationary. For highly reflective targets or for motion, a short exposure time is best. For targets far away or with low surface reflectance  choosing high exposure time is preferable.
As such, it is common that all targets of a scene cannot be properly exposed with a single exposure time.
To reduce noise and the number of overexposed/underexposed pixels, we use three exposures for each frame. The `standard` modes provides two settable exposure times (`expLong` and `expShort`) plus a third *constant* exposure (set at 30 µs) designed to help detect highly reflective targets in the very near range (~1 m). Note that using a small ratio of exposure times helps reduce noise in transitions regions (where neighboring pixels use different exposure times).

> Note: You can find which exposure time is used for each pixel by analyzing the confidence image as detailed [here](documentation/O3R/ProductsDescription/ImagesDescription/confidenceImage:The%20confidence%20image).

#### Offset
|Variable name|Short description|
|--|--|
|`offset`|Shifts the start point of the measured range (see [mode](documentation/O3R/Parameters/parameters:modes))|

Coded modulation dictates the base range of the camera (e.g., 0 to 2 m). Coded modulation also allows this range to be offset or shifted from its start point. In the example of 0 – 2 m base range, an `offset` of 0.5 m would lead to a 0.5 – 2.5 m range. Continuing this example, an `offset` of 1 leads to a 1 – 3m range. The `offset` can be changed frame by frame.

Learn more [here](documentation/O3R/Parameters/AcquisitionSettings/offset:Offset).

#### Channel selection and channel value

|Variable name|Short description|
|--|--|
|`channelSelection`|Defines the user mode for handling channel selection: currently only manual |
|`channelValue`|Defines the channel value |

This concept for cross talk mitigation is based on channels, each channel corresponding to a different modulation frequency. Use a channel combination of mutually exclusive channels to *almost* completely reduce the possibility and effect of cross talk between O3R camera heads.
The channel value has to be set per 3D TOF imager / O3R camera head. By default it is to value 0.
A channel value difference of 1 has been shown to be adequate. Any additional channel value offset (> 1) will not improve crosstalk mitigation between O3R camera heads.


## Filters
### Maximum Distance Noise
|Variable name|Short description|
|--|--|
|`maxDistNoise`|Defines the maximum allowable distance noise. Its value represents the standard deviation of the distance value, in meters.|

Typical filters tend to utilize “broad strokes” when making decisions on which pixel to keep and which to filter. These “broad strokes” may eliminate pixels that are critical to the use case. By utilizing the noise value, we only eliminate pixels with the highest noise value (e.g, ambient light) while preserving the maximum amount of usable data. Applying filters in conjunction with the maximum distance noise filter increases the potential for usable pixels in the scene.

When to change default:
- Lower the max. distance noise value if you are attempting to measure an object with high precision (e.g, box dimensioning).
- Increase the max. distance noise value if it is more important to evaluate all pixels in the scene, regardless of their noise (e.g., obstacle detection).

Learn more [here](documentation/O3R/Parameters/Filters/maxDistNoise:Maximum%20Distance%20Noise).

### Minimum Amplitude and minimum reflectivity
|Variable name|Short description|
|--|--|
|`minAmplitude`|Defines the minimum amplitude value required for a pixel to be valid|
|`minReflectivity`|Defines the minimum reflectivity required of the measured object for a pixel to be valid|
A pixel is valid if the energy (amplitude) received is above the defined threshold. The measured amplitude is primarily affected by both the reflectivity of the object and its distance to the camera.

When to change the default:

Lower the default value when the standard targets are known to have low reflectivity (e.g., <10% like matte black targets). A lower amplitude threshold is also valuable when attempting to detect negative obstacles (e.g., stairs).
It is recommended to enable a noise filter (temporal or adaptive filter) when lowering the default minimum amplitude.

Learn more about the minimum amplitude [here](documentation/O3R/Parameters/Filters/minAmplitude:Minimum%20Amplitude).

Learn more about the minimum reflectivity [here](documentation/O3R/Parameters/Filters/minReflectivity:Minimum%20Reflectivity)

### Adaptive Noise Bilateral Filter and Median Filter
|Variable name|Short description|Min/max values|
|--|--|--|
|`anfFilterSizeDiv2`|Adaptive Noise Bilateral Filter. mask size is *(2\*anfFilterSizeDiv2+1)^2*.| 0: disable the filter <br />1: 3x3 <br />2: 5x5 <br />3: 7x7|
|`medianSizeDiv2`|Size of the mask for spatial median filtering (the size is *(2\*medianSizeDiv2+1)^2)*|0: disable the filter <br />1: 3x3 <br />2: 5x5|

The adaptive bilateral noise filter reduces distance noise while also preserving object edges. Utilizing a larger number of pixels (e.g., 7x7) in the mask will, in most cases, result in better image quality.

**We recommend that you typically use the bilateral filter because it is more efficient and has a better incorporation of the noise.**

The median filter does not preserve edges as well as the bilateral filter and tends to produce round corners, but being more computationally efficient, could be utilized with “in-motion” use cases (e.g., obstacle detection on mobile robots).

Learn more [here](documentation/O3R/Parameters/Filters/bilateralFilter:Adaptive%20noise%20bilateral%20filter)

### Temporal Filter
|Variable name|Short description|
|--|--|
|`enableTemporalFilter`|Enables the filter|

The temporal filter mitigates distance noise by integrating pixel information over multiple frames. There is no strict limit for the number of frames. Instead, an automatic resetting approach is applied to the pixels.

Although the O3R temporal filter can be used for “in-motion” use cases, it is best suited for static scenes.

Learn more [here](documentation/O3R/Parameters/Filters/temporalFilter:Temporal%20Filter)

### Mixed Pixel Filtering
|Variable name|Short description|Min/max values|
|--|--|--|
|`mixedPixelFilterMode`| Filtering mode (angle or distance)|0: disable the filter, 1: mixed pixel filter is on and uses an angle threshold, 2: mixed pixel filter is on and uses an adaptive delta distance threshold|
|`mixedPixelThresholdRad`| Threshold given in [rad] for the minimum angle between the surface tangent and the view vector (used if `mixedPixelFilterMode`=1).| |

Mixed pixels (or “flying pixels”) are pixels that fall partially on a foreground object and partially on an object in the background. Because the physics of indirect ToF do not allow the imager to distinguish partial pixel measurements, the full pixel result is a weighted average distance measurement between the two targets. When viewing the point cloud, these pixels appear “floating”, or not corresponding to any object.
The mixed pixel filter removes the mixed pixels from the image.

When to change the default:
Mixed pixels fall on the edges of targets. Use cases, such as negative obstacle detection, could take advantage of the additional information provided by these mixed pixels, requiring the filter to be disabled.

Learn more [here](documentation/O3R/Parameters/Filters/mixedPixelFilter:Mixed%20Pixel%20Filter)

### Symmetry Threshold
|Variable name|Short description|
|--|--|
|`dynamicSymmetryThreshold`| The threshold given as a factor of the symmetry's standard deviation. If set to 0, the filter is disabled.|


The raw modulated signal used to perform the distance measurement is designed to be perfectly symmetrical (sent and received). This is true for static applications. If the object is in motion, however, the symmetry of the reflected signal may be altered, leading to “motion blur”. This artifact can be mitigated by allowing "less" symmetry in the measurements.

> Note: adjusting this filter for faster motion, or allowing less symmetry, will increase overall distance noise.

Learn more [here](documentation/O3R/Parameters/Filters/symmetryThreshold:Symmetry%20Threshold)
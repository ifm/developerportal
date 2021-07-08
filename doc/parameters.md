
# Settings description

## Exposure settings

Exposure settings are utilized to maximize the number of valid pixels in a scene. The use of multiple exposures permits the camera to operate in "dynamic" environments that require the detection of dark and light objects at both the minimum and maximum ranges.

### Modes
|Variable name|Short description|Min/max values|
|--|--|--|
|`mode`|This parameter designates the measurement range: 2 or 4 meters.|experimental_high_2m, experimental_high_4m *(default)*|


### Exposure times
|Variable name|Short description|Min/max values|
|--|--|--|
|`expLong`, `expShort`|These parameters are used to set the exposure times.|1 – 5000µs|

The proper exposure time depends on factors like the dynamics of the scene and whether the target is moving or stationary (plus others). For highly reflective targets or for motion, you might want to choose a short exposure time. For targets far away or with low reflectivity, you might want to choose a high exposure time.
As such, it is common that all targets of a scene cannot be properly exposed with a single exposure time. In these cases, multiple exposures are used to reduce both noise and the number of over/under exposed pixels. The "experimental_high" mode provides 2 settable exposure times plus a third *static* exposure designed to help detect highly reflective targets in the very near range (~1m).  

### Offset
|Variable name|Short description|Min/max values|
|--|--|--|
|`offset`|Shifts the start point of the measured range (see *mode*).|? meters|

Coded modulation dictates the base range of the camera. (e.g. 0.2 to 2m). Coded modulation also allows this range to be "offset" or shifted from its start point. In the example of 0.2 – 2m base range, and `offset`
of 1 would lead to a 1.2-3m range. Continuing this example, an `offset` of 2 leads to a 2.2-4m range. The `offset` can be changed frame by frame.

*BEFORE/AFTER IMAGES COMING SOON*

### Frame rate
|Variable name|Short description|Min/max values|
|--|--|--|
|`framerate`|Defines the number of frames captured each second|1 to 20 FPS (frames per second)|

The FPS highly depends on the applied imager settings (exposure mode and times, filters, etc). Higher exposure times, for example, negatively impact the overall FPS. The O3R is designed to achieve 20 FPS in 0.2 to 4m mode *regardless* of applied settings. Higher FPS may be achievable by reducing the applied settings.


## Filters
### Maximum distance noise
|Variable name|Short description|Min/max values|
|--|--|--|
|`maxDistNoise`|Defines the maximum allowable distance noise. Its value represents the standard deviation of the distance value, in meters.|0 to 1. Default 0.05 -> 5cm noise|
        
Typical filters tend to utilize "broad strokes" when making decisions on which pixel to keep and which to filter. These "broad strokes" may eliminate pixels that are critical to the Use Case. By utilizing the noise value, we only eliminate pixels with the highest noise value (e.g ambient light) while preserving the maximum amount of usable data. Applying filters in conjunction with Maximum Distance Noise increases the potential for usable pixels in the scene.

When to change default:
- Lower the distance noise value if you are attempting to measure an object with high precision (e.g box dimensioning).
- Increase the distance noise value if it is more important to evaluate all pixels in the scene, regardless of their noise (e.g. obstacle detection).


### Minimum amplitude
|Variable name|Short description|Min/max values|
|--|--|--|
|`minAmplitude`|Defines the minimum amplitude value required for a pixel to be valid|0 to 1000. Default: 20 |

A pixel is valid if the energy (amplitude) received is above the defined threshold. The measured amplitude is primarily impacted by both the reflectivity of the object and its distance to the camera.

When to change the default: 

Lower the default value when the standard targets are known to have low reflectivity (e.g. <10% like matte black targets). A lower amplitude threshold is also valuable when attempting to detect negative obstacles (e.g. stairs).
It is recommended to enable a noise filter (temporal or adaptative filter) when lowering the default Minimum Amplitude.

### Adaptive noise bilateral filter and median filter
|Variable name|Short description|Min/max values|
|--|--|--|
|`anfFilterSizeDiv2`|Adaptive Noise Bilateral Filter. mask size is *(2\*anfFilterSizeDiv2+1)^2*.| 0 (disable filter) <br />1 *(default)*: 3x3 <br />2: 5x5 <br />3: 7x7|
|`medianSizeDiv2`|Size of the mask for spatial median filtering (the size is *(2\*medianSizeDiv2+1)^2)*|0: disable the filter|

The adaptive bilateral noise filter reduces distance noise while also preserving object edges. Utilizing a larger number of pixels (e.g. 7x7) in the mask will, in most cases, result in a better image quality.

**We recommend that you typically use the bilateral filter, as it is more efficient and has a better incorporation of the noise.**

The median filter does not preserve edges as well and tends to produce round corners but, being more computationally efficient, should be utilized with "in-motion" Use Cases (e.g. obstacle detection on mobile robots)

### Temporal filter
|Variable name|Short description|Min/max values|
|--|--|--|
|`enableTemporalFilter`|Enables the filter|true (default) /false

A temporal filter, in its simplest form, mitigates distance noise by averaging the per pixel results from multiple frames. The O3R temporal filter, however, also includes environmental noise estimation, the use of a Kalman filter and is calculated on the lower level imager data, making the entire temporal filter more robust.

Although the O3R temporal filter can be used on "in-motion" Use Cases, it is best suited for static scenes.

### Mixed pixel filtering
|Variable name|Short description|Min/max values|
|--|--|--|
|`mixedPixelFilterMode`|1st mode should be used typically. Uses the viewing angle to the pixel for filtering.2nd mode is legacy, doing pretty much the same thing with more parameters.|0: mixed pixel filter is off, 1 *(default)*: mixed pixel filter is on and uses an angle threshold, 2: mixed pixel filter is on and uses an adaptive delta dist threshold|
|`mixedPixelThresholdRad`|Threshold given in [rad] for the minimum angle between the surface tangent and the view vector (used if `mixedPixelFilterMode`=1).|0 to 1.57079. <br \>*(default 0.15)*|

Mixed Pixels (or "flying pixels") are pixels that fall partially on a foreground object and partially on an object in the background. Because the physics of indirect ToF do not allow the imager to distinguish partial pixel measurements, the full pixel result is a "weighted average" distance measurement between the two targets. When viewing the point cloud, these pixels appear "floating", or not corresponding to any object.
The Mixed Pixel filter removes the mixed pixels from the image.

*ADD BEFORE/AFTER COMING SOON*

When to change the default:

Mixed pixels fall on the edges of targets. Use Cases, such as negative obstacle detection, could take advantage of the additional information provided by these mixed pixels, requiring the filter to be disabled.

### Symmetry threshold
|Variable name|Short description|Min/max values|
|--|--|--|
|`enableDynamicSymmetry`| |true *(default)* / false|
|`maxSymmetry`|Defines the maximum allowed asymmetry for a measured pixel. A pixel with a higher symmetry is discarded.|0 to 1. *(default: 0.5)*|

The raw modulated signal used to perform the distance measurement is designed to be perfectly symmetrical (sent and received). This is true for static applications. If the object is in motion, however, the symmetry of the reflected signal may be altered, leading to "motion blur". This artifact can be mitigated by allowing "less" symmetry in the measurements.

*Note:* adjusting this filter for faster motion, or allowing less symmetry, will increase overall distance noise.

*BEFORE/AFTER IMAGES + SCHEMATIC EXPLANATION COMING SOON*

### Stray light
|Variable name|Short description|Min/max values|
|--|--|--|
|`enableStraylight`|Turn straylight correction on/off|True *(default)*/false|

Stray light is defined as "unwanted light from the active illumination reaching the imager". This is typically experienced when there is a very bright object in the FoV. The resulting amplitude of pixels landing on the bright object impact the neighboring "darker" pixels. This is seen as a "halo" around the bright object. This "halo" can impact the measurement of neighboring pixels (even providing a value for pixels where none previously existed). The Stray Light filter mitigates this physics artifact.

*BEFORE/AFTER IMAGE COMING SOON*
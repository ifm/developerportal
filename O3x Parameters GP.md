- [Setting Page Contents](#setting-page-contents)
  - [**Exposure Settings**](#exposure-settings)
  - [**Modes**](#modes)
  - [**Exposure Times**](#exposure-times)
  - [**Offset**](#offset)
  - [**Frame rate**](#frame-rate)
  - [_ **Filters** _](#_-filters-_)
  - [**Maximum Distance Noise**](#maximum-distance-noise)
  - [**When to change default** :](#when-to-change-default-)
  - [**Minimum amplitude**](#minimum-amplitude)
  - [**When to change the default:**](#when-to-change-the-default)
  - [**Adaptive Noise Bilateral Filter**](#adaptive-noise-bilateral-filter)
  - [**Temporal filter**](#temporal-filter)
  - [**Mixed Pixel Filtering**](#mixed-pixel-filtering)
  - [**Symmetry Threshold**](#symmetry-threshold)
  - [**Stray Light**](#stray-light)

## Setting Page Contents

### **Exposure Settings**

Exposure settings are utilized to maximize the number of valid pixels in a scene. The use of multiple exposures permits the camera to operate in &quot;dynamic&quot; environments that require the detection of dark + light objects at both the minimum and maximum ranges.

### **Modes**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| mode | This parameter designates the measurement range: 2 or 4 meters | experimental\_high\_2m, experimental\_high\_4m |

### **Exposure Times**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| expLong, expShort | These parameters are used to set the exposure times. | 1 – 5000µs
 |

The proper exposure time depends on factors like the dynamics of the scene and whether the target is moving or stationary (plus others). For highly reflective targets or for motion, you might want to choose a short exposure time. For targets far away or with low reflectivity, you might want to choose a high exposure time.

As such, it is common that all targets of a scene cannot be properly exposed with a single exposure time. In these cases, multiple exposures are used to reduce both noise and the number of over/under exposed pixels. The &quot;experimental\_high&quot; provides 2 settable exposure times plus a third _static_ exposure designed to help detect highly reflective targets in the very near range (\&lt;1m).

### **Offset**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| Offset | Shifts the start point of the measured range (see _mode_). | **? meters** |

Coded modulation dictates the base range of the camera. (e.g. 0.2 to 2m). Coded modulation also allows this range to be &quot;offset&quot; or shifted from its start point. In the example of 0.2 – 2m base range, and &quot;offset&quot; of 1 would lead to a 1.2-3m range. Continuing this example, an &quot;offset&quot; of 2 leads to a 2.2-4m range. The &quot;offset&quot; can be changed frame by frame.

BEFORE/AFTER IMAGES

### **Frame rate**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| framerate | Defines the number of frames captured each second | 1 to 20 FPS (frames per second)
 |

The FPS highly depends on the applied imager settings (exposure mode and times, filters, etc). Higher exposure times, for example, negatively impact the overall FPS. The O3R is designed to achieve 20 FPS in 0.2 to 4m mode _regardless_ of applied settings. Higher FPS may be achievable by reducing the applied settings.

### _ **Filters** _

### **Maximum Distance Noise**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| maxDistNoise | Defines the maximum allowable distance noise. Its value represents the standard deviation of the distance value, in meters. | 0 to 10: no thresholdDefault 0.05 -\&gt; 5cm noise |

Typical filters tend to utilize &quot;broad strokes&quot; when making decisions on which pixel to keep and which to filter. These &quot;broad strokes&quot; may eliminate pixels that are critical to the Use Case. By utilizing the noise value, we only eliminate pixels with the highest noise value (e.g ambient light) while preserving the maximum amount of usable data. Applying filters in conjunction with Maximum Distance Noise increases the potential for usable pixels in the scene.

### **When to change default** :

Lower the distance noise value if you are attempting to measure an object with high precision (e.g box dimensioning).

Increase the distance noise value if it is more important to evaluate all pixels in the scene, regardless of their noise (e.g. obstacle detection).

Before/after image with chosen values.

Low amplitude / high sunlight and see difference

### **Minimum amplitude**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| minAmplitude | Defines the minimum amplitude value required for a pixel to be valid | 0 to 1000Default: 20
 |

A pixel is valid if the energy (amplitude) received is above the defined threshold. The measured amplitude is primarily impacted by both the reflectivity of the object and its distance to the camera.

### **When to change the default:**

Lower the default value when the standard targets are known to have low reflectivity (e.g. \&lt;10% like matte black targets). A lower amplitude threshold is also valuable when attempting to detect negative obstacles (e.g. stairs).

It is recommended to enable a noise filter (temporal or adaptative filter) when lowering the default Minimum Amplitude.

### **Adaptive Noise Bilateral Filter**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| AnfFilterSizeDiv2(main parameter) | Adaptive Noise Bilateral Filter mask size is (2\*anfFilterSizeDiv2+1)^2. | 0 (disable filter) to 3Default: 0 (will change to enabled by default)1: 3x32: 5x53: 7x7 |
| medianSizeDiv2 | Size of the mask for spatial median filtering (the size is (2\*medianSizeDiv2+1)^2) | 0: disable the filter |

The adaptive bilateral noise filter reduces distance noise while also preserving object edges. Utilizing a larger number of pixels (e.g. 7x7) in the mask will, in most cases, result in a better image quality.

**We recommend that you typically use the bilateral filter, as it is more efficient and has a better incorporation of the noise.**

The median filter does not preserve edges as well but, being more computationally efficient, should be utilized with &quot;in-motion&quot; Use Cases (e.g. obstacle detection on mobile robots)

### **Temporal filter**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| enableTemporalFilter | Enables the filter | true/falseDefault: False (will change to true) |

A temporal filter, in its simplest form, mitigates distance noise by averaging the per pixel results from multiple frames. The O3R temporal filter, however, also includes environmental &quot;noise&quot; estimation, the use of a Kalman filter and is calculated on the lower level imager data, making the entire temporal filter more robust.

Although the O3R temporal filter can be used on &quot;in-motion&quot; Use Cases, it is best suited for static scenes.

### **Mixed Pixel Filtering**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| mixedPixelFilterMode | 1st mode should be used typically. Uses the viewing angle to the pixel for filtering.2nd mode is legacy, doing pretty much the same thing with more parameters. | 0: mixed pixel filter is off, 1: mixed pixel filter uses an angle threshold, 2: mixed pixel filter with an adaptive delta dist thresholdDefault: 1 |
| mixedPixelThresholdRad | Threshold given in [rad] for the minimum angle between the surface tangent and the view vector (used if mixedPixelFilterMode=1). | 0 to 1.57079Default 0.15 |

Mixed Pixels (or &quot;flying pixels&quot;) are pixels that partially fall partially on a foreground object and partially on an object on the background. Because the physics of indirect ToF do not allow the imager to distinguish partial pixel measurements, the full pixel result is an &quot;weighted average&quot; distance measurement between the two targets. When viewing the point cloud, these pixels appear &quot;floating&quot;, or not corresponding to any object. The Mixed Pixel filter removes the mixed pixels from the image.

ADD BEFORE/AFTER

**When to change the default:**

Mixed pixels fall on the edges of targets. Use Cases, such as negative obstacle detection, could take advantage of the additional information provided by these mixed pixels, requiring the filter to be disabled.

### **Symmetry Threshold**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| enableDynamicSymmetry |
 | true/false |
| maxSymmetry | Defines the maximum allowed asymmetry for a measured pixel. A pixel with a higher symmetry is discarded. | 0 to 1Default: 0.5 |
| [???] dynamicSymmetryThreshold[protected] | The threshold given as a factor of the symmetry&#39;s standard deviation. Use a high value to retain noisy pixels | 0 to 20Default: 6 |

The raw modulated signal used to perform the distance measurement is designed to be perfectly symmetrical (sent and received). This is true for static applications. If the object is in motion, however, the symmetry of the reflected signal may be altered, leading to &quot;motion blur&quot;. This artifact can be mitigated by allowing &quot;less&quot; symmetry in the measurements.

Note: adjusting this filter for faster motion, or allowing less symmetry, will increase overall distance noise.

BEFORE/AFTER IMAGES + SCHEMATIC EXPLANATION

### **Stray Light**

| Variable name | Short description | Min/max values |
| --- | --- | --- |
| enableStraylight | Turn straylight correction on/off | True/falseDefault: true |

Stray light is defined as &quot;unwanted light from the active illumination reaching the imager&quot;. This is typically experienced when there is a very bright object in the FoV. The resulting amplitude of pixels landing on the bright object impact the neighboring &quot;darker&quot; pixels. This is seen as a &quot;halo&quot; around the bright object. This &quot;halo&quot; can impact the measurement of neighboring pixels (even providing a value for pixels where none previously existed. The Stray Light filter mitigates this physics artifact.

BEFORE/AFTER IMAGE
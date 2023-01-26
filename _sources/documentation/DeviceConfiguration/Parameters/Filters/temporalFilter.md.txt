# Temporal Filter

## Abstract
The temporal filter filters the data over—you guessed it—time. Each measurement per pixel over several frames is used to produce the filtered value, reducing (distance) noise per pixel.
This filter is best suited for static scenes because the objects in the scene are in the same relative positions over multiple frames. 

## Description
The temporal filter affects all images—distance image, point cloud, and so on—by reducing the noise. The filtered value for each pixel at a certain time is computed by integrating information over multiple frames. There is no strict limit on how many frames are taken into account for filtering; instead, the filter is automatically reset when necessary, such as when motion is detected.

## Examples
### Reducing Noise
The primary role of the temporal filter is to reduce noise. The following images show a before/after of a scene measured without (left images) and with (right images) the temporal filter. The two images in the second row represent the distance noise, with the color black representing a negligible amount of noise and blue a noise of around 2 cm. We can see that the noise is greatly reduced by the use of the temporal filter. It is even more visible “live”. Try it!
|![Noise without temporal filter](resources/noise_no_temp_filter.png)|![Noise with temporal filter](resources/noise_temp_filter_on.png)| |
|--|--|--|
|![Noise image without temporal filter](resources/noise_image.png)|![Noise image with temporal filter](resources/no_noise_image.png)|![Color bar for noise image](resources/color_bar_noise.png)

### Recovering Lost Pixels
Because the filter estimates pixel values over time, a positive side effect is that it gathers more data overall. Certain pixels might reflect too little light because of their distance to the camera or their material, which causes them to be discarded during the filtering process (by the [spatial filter](documentation/O3R/Parameters/Filters/bilateralFilter:Adaptive%20noise%20bilateral%20filter), for instance, or the [minimum amplitude filter](documentation/O3R/Parameters/Filters/minAmplitude:Minimum%20Amplitude)). However, distance data for these pixels can potentially be computed by collecting light over multiple frames. In the following two images, we compare the same scene without (left image) and with (right image) the filter. We can see that a section of the floor (around 10 cm) at the end of the range (the point at which the pixels return the least amount of light) is not visible without the temporal filter. Note that this section of the floor could also possibly be recovered using the [distance noise](documentation/O3R/Parameters/Filters/maxDistNoise:Maximum%20Distance%20Noise) with higher values for the distance noise threshold, with the disadvantage of increasing the overall noise.

|![Scene without temporal filter](resources/no_temporal_filter.png)|![Scene with temporal filter](resources/temporal_filter_on.png)|

## Related settings
+ [Distance noise](documentation/O3R/Parameters/Filters/maxDistNoise:Maximum%20Distance%20Noise)
+ [Minimum amplitude](documentation/O3R/Parameters/Filters/minAmplitude:Minimum%20Amplitude)
+ [Spatial filter](documentation/O3R/Parameters/Filters/bilateralFilter:Adaptive%20noise%20bilateral%20filter)
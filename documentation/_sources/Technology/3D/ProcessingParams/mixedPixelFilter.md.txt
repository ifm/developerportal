# Mixed Pixel Filter
## Abstract

We call "mixed pixels" pixels resulting from a mixed signal from foreground and background planes (typically, the pixel "lands" partially on an object and partially on its background). Such pixels don't represent the distance measurement to either object and lie somewhere in between (they appear to be *flying*, and we sometimes refer to them as *flying pixels*). The mixed-pixel filter invalidates these pixels. The `mixedPixelFilterMode` setting defines whether this filter is activated and which validation methods is used. `mixedPixelFilterMode = 1` switches to angle validation check (adjust it with `mixedPixelThresholdRad`). `mixedPixelFilterMode = 2` switches to distance based validation check. `mixedPixelFilterMode = 0` switches the filter off completely.

:::{note}
We recommend either disabling the filter (more precision on objects' edges) or using the angle based validation method (`mixedPixelFilterMode = 1`) to remove pixels between objects and their backgrounds.
:::


## Description
The `mixedPixelFilterMode` controls two different methods for invalidation mixed pixels.  

### Angle based validation method  
The angle based mixed pixel filtering (`mixedPixelFilterMode = 1`) is based on the idea of estimating, for each pixel, the angle between the optical and an approximate tangent plane on the object (at this exact pixel coordinate). If the angle difference is larger than the allowed angle threshold, the pixel is invalidated.  
The angle threshold of this mode is controlled by the parameter `mixedPixelThresholdRad` (angle in radians).

### Distance based validation method
The second version of the mixed pixel (`mixedPixelFilterMode = 2`) filter is centered around the idea of comparing distances in the local neighborhood of a pixel. The distance of the pixel is compared in horizontal and vertical direction against its neighboring pixels' distance values. If the distance differences are outside a threshold (set internally), the pixel is invalidated.

## Examples
### Different angle threshold values

To show the impact of adjusting the mixed pixel filter with the `mixedPixelThresholdRad`, we show a scene where two boxes are placed in front of the camera, at around one and two meters. The table below shows the distance image and the point cloud with the filter inactive and filter in the angle mode with different angle thresholds:

> Note: settings `mixedPixelThresholdRad = 0` is equivalent to turning the filter off.

| Value of `mixedPixelThresholdRad`| Distance image| Point cloud|
|--|--|--|
| 0 (equivalent to `mixedPixelFilterMode = 0`)| ![Mixed pixels filter disabled - distance](resources/mixed_pixel_0_distance.png)|![Mixed pixels filter disabled - view 1](resources/mixed_pixel_rad_0_view1.png)|
| | | ![Mixed pixels filter disabled - view ](resources/mixed_pixel_rad_0_view2.png)|
| 0.15 (default)| ![Mixed pixels filter `mixedPixelThresholdRad = 0.15` - distance](resources/mixed_pixel_rad_015_distance.png)| ![Mixed pixels filter `mixedPixelThresholdRad = 0.15` - view 1](resources/mixed_pixel_rad_015_view1.png)|
| | | ![Mixed pixels filter `mixedPixelThresholdRad = 0.15` - view 2](resources/mixed_pixel_rad_015_view2.png)|
| 0.3| ![Mixed pixels filter `mixedPixelThresholdRad = 0.3` - distance](resources/mixed_pixel__rad_03_distance.png)| ![Mixed pixels filter `mixedPixelThresholdRad = 0.3` - view 1](resources/mixed_pixel_rad_03_view1.png)|
| | | ![Mixed pixels filter `mixedPixelThresholdRad = 0.3` - view ](resources/mixed_pixel_rad_03_view2.png)|
| 0.5| ![Mixed pixels filter `mixedPixelThresholdRad = 0.5` - distance](resources/mixed_pixel__rad_05_distance.png)| ![Mixed pixels filter `mixedPixelThresholdRad = 0.5` - view 1](resources/mixed_pixel_rad_05_view1.png)|
| | | ![Mixed pixels filter `mixedPixelThresholdRad = 0.5` - view 2](resources/mixed_pixel_rad_05_view2.png)|

We can see that using higher values for the `mixedPixelThresholdRad` invalidates more pixels. We typically recommend deactivating the filter or using small values for the threshold.


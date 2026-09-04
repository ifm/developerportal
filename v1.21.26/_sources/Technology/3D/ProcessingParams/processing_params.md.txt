
# 3D processing parameters overview

This document gives a short overview of the available processing parameters for the O3R 3D cameras.
Since type and default values can change depending on the firmware version, we recommend using the schema to read out the type and default value for specific parameters. For example, to check the type and default value of the `maxDistNoise` for the `port0` you can use:

::::{tabs}
:::{group-tab} CLI
```bash
$ ifm3d jsonschema | jq .properties.ports.properties.port0.properties.processing.properties.diParam.properties.maxDistNoise
{
  "default": 0.05,
  "description": "Maximum distance noise, given as the standard deviation in [m]. (0.0: disable check).",
  "maximum": 1,
  "minimum": 0,
  "type": "number"
}
```
:::

:::{group-tab} Python
```python
from ifm3dpy.device import O3R
o3r = O3R("192.168.0.69")
o3r.get_schema()["properties"]["ports"]["properties"]["port0"]["properties"]["processing"]["properties"]["diParam"]["properties"]["maxDistNoise"]
{'default': 0.05, 'description': 'Maximum distance noise, given as the standard deviation in [m]. (0.0: disable check).', 'maximum': 1.0, 'minimum': 0.0, 'type': 'number'}
```
:::

:::{group-tab} C++
```cpp
// Note that this example does not include the necessary imports.
auto dev = std::make_shared<ifm3d::O3R>();
ifm3d::json o3r_schema;
o3r_schema = dev->GetSchema()["properties"]["ports"]["properties"]["port0"]["properties"]["processing"]["properties"]["diParam"]["properties"]["maxDistNoise"];
// Printing out the o3r_schema would give:
//{
//  "default": 0.05,
//  "description": "Maximum distance noise, given as the standard deviation in [m]. (0.0: disable check).",
//  "maximum": 1.0,
//  "minimum": 0.0,
//  "type": "number"
//}
```
:::
::::

:::{include} ../../../generated_docs/camera_3d_di.md
:::

```{include} ../../../notices/conf_attribute_note.md
```

## Maximum Distance Noise

Typical filters tend to utilize “broad strokes” when making decisions on which pixel to keep and which to filter. These “broad strokes” may eliminate pixels that are critical to the use case. By utilizing the noise value, we only eliminate pixels with the highest noise value (e.g, ambient light) while preserving the maximum amount of usable data. Applying filters in conjunction with the maximum distance noise filter increases the potential for usable pixels in the scene.

When to change default:
- Lower the max. distance noise value if you are attempting to measure an object with high precision (e.g, box dimensioning).
- Increase the max. distance noise value if it is more important to evaluate all pixels in the scene, regardless of their noise (for example obstacle detection).

Learn more [here](./maxDistNoise.md).

## Minimum Amplitude and minimum reflectivity

A pixel is valid if the energy (amplitude) received is above the defined threshold. The measured amplitude is primarily affected by both the reflectivity of the object and its distance to the camera.

When to change the default:

Lower the default value when the standard targets are known to have low reflectivity (for example <10% like matte black targets). A lower amplitude threshold is also valuable when attempting to detect negative obstacles (for example stairs).
It is recommended to enable a noise filter (temporal or adaptive filter) when lowering the default minimum amplitude.

Learn more about the minimum amplitude [here](./minAmplitude.md).

Learn more about the minimum reflectivity [here](./minReflectivity.md).

## Adaptive Noise Bilateral Filter and Median Filter

The adaptive bilateral noise filter reduces distance noise while also preserving object edges. Utilizing a larger number of pixels (for example 7x7) in the mask will, in most cases, result in better image quality.

**We recommend that you typically use the bilateral filter because it is more efficient and has a better incorporation of the noise.**

The median filter does not preserve edges as well as the bilateral filter and tends to produce round corners, but being more computationally efficient, could be utilized with “in-motion” use cases (for example obstacle detection on mobile robots).

Learn more [here](./bilateralFilter.md).

## Temporal Filter

The temporal filter mitigates distance noise by integrating pixel information over multiple frames. There is no strict limit for the number of frames. Instead, an automatic resetting approach is applied to the pixels.

Although the O3R temporal filter can be used for “in-motion” use cases, it is best suited for static scenes.

Learn more [here](./temporalFilter.md).

## Mixed Pixel Filtering

Mixed pixels (or “flying pixels”) are pixels that fall partially on a foreground object and partially on an object in the background. Because the physics of indirect ToF do not allow the imager to distinguish partial pixel measurements, the full pixel result is a weighted average distance measurement between the two targets. When viewing the point cloud, these pixels appear “floating”, or not corresponding to any object.
The mixed pixel filter removes the mixed pixels from the image.

When to change the default:
Mixed pixels fall on the edges of targets. Use cases, such as negative obstacle detection, could take advantage of the additional information provided by these mixed pixels, requiring the filter to be disabled.

Learn more [here](./mixedPixelFilter.md).

## Symmetry Threshold

The raw modulated signal used to perform the distance measurement is designed to be perfectly symmetrical (sent and received). This is true for static applications. If the object is in motion, however, the symmetry of the reflected signal may be altered, leading to “motion blur”. This artifact can be mitigated by allowing "less" symmetry in the measurements.

> Note: adjusting this filter for faster motion, or allowing less symmetry, will increase overall distance noise.

Learn more [here](./symmetryThreshold.md).

## CUDA processing

Starting with firmware version 1.4.30, all 3D data is processed by default on the GPU using a CUDA-based implementation. The `useCuda` parameter determines where the distance data is computed: set it to true for GPU processing and false for CPU processing. We generally recommend keeping CUDA processing enabled.

Learn more [here](./use_cuda.md).

## Bin Mode

As of firmware version 1.20.29 and above, VGA camera heads (O3R252) are supported with the VPU articles mentioned in [compatibility matrix documentation](../../../CompatibilityMatrix/compatibility_matrix.md).

The `binMode` parameter is only available for VGA camera heads and it allows the user to choose the resolution of the 3D imager.

| Property  | Type    | Description                                        | Default | Minimum | Maximum | Enum  | Attributes |
| :-------- | :------ | :------------------------------------------------- | ------: | ------: | ------: | :---- | :--------- |
| `binMode` | integer | 0: resolution 640 x 480 <br> 1: resolution 320 x 240 |       0 |       0 |       1 | `N/A` | ['conf']   |

```{include} ../../../notices/conf_attribute_note.md
```
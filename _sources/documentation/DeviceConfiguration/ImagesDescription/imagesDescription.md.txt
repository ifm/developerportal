# Description of the available images

This document gives a high level overview of the images available for the O3R. Receiving certain images can be turned ON/OFF using the schema mask (*documentation coming soon*).

>Note: For more information about the types, sizes and other implementation aspects, please refer to the [ifm3d API documentation](ifm3d/doc/sphinx/index:ifm3d%20library).

## Raw Amplitude image and Amplitude image

Each pixel of the amplitude matrix denotes the amount of modulated light (i.e., the light from the camera's active illumination) which is reflected by the appropriate object. Higher values indicate higher signal strengths and thus a lower amount of noise on the corresponding distance measurements. The raw amplitude image is not normalized, which can lead to inhomogeneous image impression if a certain pixel is taken from the short exposure time and some of its neighbors are not. Invalid pixels have a value of zero.

The amplitude image is the normalized image over the different exposure times.


## Distance image (radial)

Each pixel of the distance image denotes the ToF distance measured by the corresponding pixel or group of pixels of the imager, along the respective pixel direction. The distance value is corrected by the camera's calibration, excluding effects caused by multi-path interference and multiple objects contributions (e.g., [mixed pixels](documentation/O3R/Parameters/Filters/mixedPixelFilter:Mixed%20Pixel%20Filter)). The reference point is the center of the back of the camera head's housing. Invalid pixels have a value of zero.

## Distance noise (radial)

The distance noise represent the estimated standard deviation of the distance error, in meters for each pixel.

## Confidence 
The confidence image give detail about the validity of each pixel and the reason (if any) why it was invalidated. See details [here](documentation/O3R/ProductsDescription/ImagesDescription/confidenceImage:The%20confidence%20image).

## Reflectivity
The reflectivity image represents the estimated reflectivity in the near infrared spectrum of the objects in the scene.
See also the [minimum reflectivity filter](documentation/O3R/Parameters/Filters/minReflectivity:Minimum%20Reflectivity).
*coming soon in ifm3d library*

## Point cloud (XYZ)
The XYZ image (also called point cloud) is a 3-channel image of the spacial planes X, Y and Z. It uses the Cartesian coordinate system.
The value 0 denotes an invalid pixel.

## Unit vectors
The unit vectors are vectors of size 1 that represent each pixel's direction. They are computed from the intrinsic calibration of the camera and the optical model. They are used in combination with the distance image to compute the point cloud.

## JPEG image
This image is the JPEG-encoded RGB image streamed by the 2D imager, when available.

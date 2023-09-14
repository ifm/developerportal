# The confidence image 

The confidence image is accessible as part of the data streamed from the O3R device. This image contains information about the validity of each pixel. If a pixel is invalid, the confidence image explains why is has been marked as invalid. The values are as follows:

- 1: CONF_INVALID - indicates that the pixel is invalid;
- 2: CONF_SATURATED - the pixel is overexposed/saturated;
- 4: CONF_BADAMBSYM - the pixel had bad symmetry, probably because of motion (see [symmetry threshold](documentation/O3R/Parameters/Filters/symmetryThreshold:Symmetry%20Threshold));
- 8: CONF_LOWAMP - amplitude lower than the [minimum amplitude](documentation/O3R/Parameters/Filters/minAmplitude:Minimum%20Amplitude), or [distance noise threshold](documentation/O3R/Parameters/Filters/maxDistNoise:Maximum%20Distance%20Noise) exceeded;
- (16|32): CONF_EXPINDEX - indicates whether the short, medium or long [exposure](documentation/O3R/Parameters/parameters:Exposure%20Times) is used for this pixel: expIndex = (v & CONF_EXPINDEX) >> 4 indicates the index of the exposure time used by this pixel where low indices indicate shorter exposures;                       
- 64: CONF_INVALID_RANGE - the pixel is outside of the measurement range;
- 128: CONF_SUSPECT_PIXEL - this is a bad pixel on the chip;
- 256: RESERVED
- 512: CONF_EDGEPIXEL or CONF_ISOLATED - edge pixels refer to the image edges which are sometimes invalidated by lateral filters, an isolated pixel is a pixel with random amplitude in an area where no amplitude is measured;
- 1024: CONF_UNPLAUSIBLE - pixels remaining after shifting the [offset](documentation/O3R/Parameters/AcquisitionSettings/offset:Offset), between the camera and the beginning of the shifted range;
- 2048: CONF_REFLECTIVITY - the [reflectivity](documentation/O3R/Parameters/Filters/minReflectivity:Minimum%20Reflectivity) is below the threshold;
- 4096: CONF_DYNAMIC_AMPLITUDE - the pixel is probably part of the halo around a very bright object (see the [stray-light filter](documentation/O3R/Parameters/Filters/strayLight:Stray%20Light%20Filter));
- 16384: CONF_MIXEDPIXEL - the pixel is a [mixed pixel](documentation/O3R/Parameters/Filters/mixedPixelFilter:Mixed%20Pixel%20Filter), part of which is measuring the object and the other part the background;
- 32768: CROSSTALK: the pixel is invalidated because of detected interference from other sources.
---
nosearch: true
---

# Stray light

Stray light artifacts occur when the light emitted by the camera reflects on highly reflective surfaces (retro reflectors, very close objects, etc). 
These then send back an abnormally strong signal compared to diffuse surfaces. 
This can cause the sensor to become saturated, leading to errors in depth estimation. 
The excessive return signal overwhelms the iToF sensor's ability to differentiate between the true phase shift and intensity changes caused by the object's surface. 
The high intensity of the reflected light can cause adjacent pixels on the iToF sensor to register false signals, creating a "blooming" or halo effect. 
This leads to incorrect depth values in the neighboring regions, further complicating the depth map.
These artifacts also impact objects with a lower reflectivity, and can make the detection of such objects difficult.

As a mitigation strategy the O3R cameras have a built in HDR mode. 
HDR techniques in iToF cameras are designed to handle a wide range of light intensities in a scene, from very bright to very dark regions. 
This helps prevent sensor saturation caused by extremely bright reflections, such as those from retro-reflective surfaces. 

HDR combines multiple exposures—short, medium, and long—to capture a broader range of light intensities. 
Shorter exposures are used to handle high-intensity signals (such as light reflected from retro-reflectors), preventing sensor saturation.
Longer exposures capture low-intensity signals from dimmer or farther objects.
By blending information from different exposures, HDR helps ensure that highly reflective objects (like retro-reflectors) do not overwhelm the sensor while still providing accurate depth information for less reflective surfaces.

Additionally, a stray light filter enhances image quality by reducing unwanted light that might interfere with distance measurement accuracy. 
This filter help mitigate scattered light by analyzing and managing how light from outside the intended scene disperses across the sensor. 
It is especially beneficial in ToF cameras, as it addresses light distortions and improve depth precision, particularly in settings with bright or reflective surfaces where stray light is prevalent. 
The stray light filter is always active.


Below is a side-by-side comparison of the same scene with and without stray light caused by a retro-reflector:

|                                                    |                                                     |
| ---------------------------------------------------| --------------------------------------------------- |
| ![Scene without stray light](./resources/noSL.gif) | ![Impact of stray light on ODS](./resources/SL.gif) |

If you encounter such a scenario, the best recommendation is to remove the retro-reflector from the environment. 
Unlike the example presented above, stray light artifacts caused by retro-reflectors can be managed when the reflectors are within the camera's field of view. 
However, if the source of stray light is outside the field of view, filtering out the artifacts becomes more challenging. 
If retro-reflectors are expected in the environment, test by driving the vehicle along a realistic path with reflectors on the side. 
Monitor data closely when passing the reflectors, both with and without obstacles, and repeat with varying obstacle sizes, reflectivity, and reflector density to simulate real-world scenarios. 
If that is not possible, please contact ifm support to discuss the next steps.
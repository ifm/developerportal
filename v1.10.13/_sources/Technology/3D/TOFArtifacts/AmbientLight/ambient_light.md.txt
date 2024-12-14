---
nosearch: true
---

# Ambient light

Indoor ambient light typically doesn't interfere with ifm's Time-of-Flight cameras like the O3R, as it doesn't emit much in the infrared wavelength used by the camera (940 nm). 
However, sunlight is a more significant issue due to its broad IR spectrum, including the 940 nm band, which increases noise and reduces the camera's detection range on sunlit objects.


Sunlight, with its strong IR content, can overwhelm the ToF sensor's ability to differentiate between the emitted and ambient IR light. 
This leads to signal saturation, where the sensor receives more light than it can process, impairing accurate depth measurement.
When sunlight directly illuminates objects, particularly in outdoor settings with brightness levels up to 130k lux, the ToF sensor struggles to detect objects at long ranges due to high noise from sunlight. 
This leads to reduced measurement range and accuracy, particularly for objects with lower reflectivity. 
This is compounded when objects are directly illuminated by sunlight, as the IR noise interferes with the ToF camera’s ability to capture clean depth information.
High levels of sunlight can introduce ghosting, false depth readings, and other artifacts in the data. 
Reflective surfaces (such as glass or shiny materials) in direct sunlight amplify the risk of false readings, which results in unreliable object detection or distorted depth maps.

A reduced measurement range should be expected in such conditions. 
Therefore, if the camera will primarily be used outdoors, thorough testing in bright sunlight is strongly recommended. 

The impact on ODS will be similar, which is why it is primarily focused on indoor applications. 
If the vehicle is expected to operate near large windows or partially outdoors, we recommend validating ODS performance in those conditions as well. 
Sunlight introduces additional noise, slightly reducing range, and it is important to assess how this affects obstacle detection in the user's specific environment and for the intended obstacles.  

The video below demonstrates the impact of sunlight >100k Lux on the depth map as well as ODS where the reliability of object detection beyond 1m was not possible.
Disclaimer: The presented scene is not a real-world scenario. It is an intentionally fabricated setup designed to provoke the artifact described in this section for demonstration purposes, with the goal of illustrating a worst-case scenario

![Data recorded outdoors in full sunlight.](./resources/sunlight.gif)

If you encounter such a scenario, please contact ifm support to discuss the next steps.
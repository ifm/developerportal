# Artifacts and their impacts

This paper gives an overview of O3R 3D indirect Time of Flight (iToF) specific artifacts and their effect on ODS.

## Common artifacts

The O3R uses iToF and therefore has to handle artifacts related to the physics behind this technology. These are not ifm-specific artifacts but common to all iToF systems. 

Below is a list of common artifacts that exist for the O3R and that impact the data and consequently ODS' performance.

1. Multi-Path Interference (MPI): 
This artifact occurs when the light emitted from the camera reflects off multiple surfaces before returning to the camera. The camera then interprets these multiple reflections as being at different distances, leading to errors in depth calculation. 
When this phenomenon occur, you would for example see curved walls and floors, especially near corners.

2. Motion Blur: 
This artifact occurs when the subject or the camera is moving during the short amount of time it takes to capture an image. This can lead to blurred or distorted images, as the camera's depth calculations are based on the assumption that the subject is stationary.

3. Stray light: 
Stray light artifacts occur when the light emitted by the camera reflects on highly reflective objects (retro reflectors, very close objects, etc). This intense reflected light is scattered in the optical system and can create a blinding effect, as you would get when pointing your camera to the sun.
This translates to a halo effect around the reflective object, increasing its measured size. This artifacts also impacts objects with a lower reflectivity, and can make the detection of such objects difficult.

4. Crosstalk:
Crosstalk exists between cameras of the same type and between cameras and other sensors using active illumination in the same infrared spectrum. The light emitted by the other device can be interpreted by the camera as its own light and this results in ghost pixels along the line from the camera to the other device.

5. Dust: 
Dust particles in the air, when very close to the camera, may reflect significant amounts of light and appear as an object in their own right. In the image, you would see an effect similar to heavy snow through your windshield.

6. Ambient light:
Indoor ambient light is typically not an issue as indoor lighting usually does not include the infrared wavelength used by the O3R.
Sunlight, however, can be more difficult to deal with. The O3R uses 940nm pulsed light, which corresponds to a dip in intensity in the sunlight spectrum. However, there is still enough 940nm light to increase noise levels in the O3R data. 
In practice, this means that detection ranges might be reduced on objects directly illuminated by sunlight, as a result of high noise filtering. 

## Impact on ODS

Some of these artifacts might induce false positives in ODS: an object is detected where there is none. 

Most iToF artifacts are mitigated in ODS, either through intelligent acquisition methods or through filtering techniques in the algorithms. However, it is impossible to eliminate all potential artifacts, and some false positive may still occur. 

Below are some guidelines on what to prioritize when testing ODS' robustness against false positives:
1. Stray light artifacts caused by retro-reflectors can be handled when the reflectors are in the field of view of the cameras. When the source of the stray light is not in the field of view, it is more difficult to filter out the artifact. If reflectors are expected in the environment, try the following: drive the vehicle along a realistic path where reflectors are located along the side. Pay close attention to the data when just passing the reflector, both when there is no obstacle in front of the vehicle, and when there is an obstacle. Repeat the test with different obstacles of varying size and reflectivity, and for a density of reflectors in the scene that reflects a realistic use case.

2. Crosstalk:
   - Crosstalk between ifm cameras is mostly mitigated through the use of different frequencies and synchronization (make sure you use separate [channels](../../Configuration/configuration.md#channel-value)). 
   - Crosstalk with other devices might occur, and can be difficult to predict. Some safety scanners, for examples, use infrared light at a similar wavelength as the O3R cameras, and might be impacted by the O3R illumination. This creates artifacts similar as how dust would interfere with the scanner. To mitigate this issue:
      - It is usually sufficient to increase the number of scans the safety scanner requires to identify a pixel as an obstacle, 
      - Mount the O3R as far away as possible from the safety scanner plane,
      - Turn the cameras off when the robot is stationery. This has the benefit of saving power, and ensures that the illumination is active only when necessary.
      
To thoroughly test crosstalk, we recommend running tests with a full fleet of robots. Crosstalk might occur only in specific geometrical configurations, and these situations are easier to pinpoint when multiple robots are involved, at various distances and angles. 

3. Ambient light:
In cases where the vehicle is expected to drive along large windows, or partially outside, we recommend validating ODS performances in those conditions as well. Sunlight creates additional noise, which in turns results in slightly reduced range, and it is important to understand how this impacts obstacle detection for the user's specific environment and targeted obstacles. 
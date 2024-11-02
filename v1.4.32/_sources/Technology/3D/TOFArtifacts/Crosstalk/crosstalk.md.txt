# Crosstalk
## Between ifm cameras
Crosstalk in ToF cameras occurs when multiple cameras operate simultaneously in the same environment, causing interference between their emitted IR signals. 
This interference happens when one camera's IR light is detected by another camera's sensor, leading to misinterpretation of signals and inaccurate depth measurements. 
Key factors influencing crosstalk include overlapping illumination, similar modulation frequencies, overlapping fields of view, environmental reflectivity, wavelength overlap, and camera proximity. 
The effects of crosstalk include inaccurate depth readings, increased noise, and visual artifacts ("ghost" objects appearing in the point cloud), ultimately reducing the performance and reliability of the cameras point cloud in multi-camera setups.

To mitigate interference between two or more cameras, you can select different channels for each camera, which slightly alters the modulation frequency. 
For more information, see [Channel selection and channel value](../../AcquisitionParams/index_acquisition_params.md#channel-selection-and-channel-value)

The video below demonstrates how interference affects the point cloud and ODS performance when multiple cameras operate on the same channel. In this setup, three cameras are placed side by side, facing the same scene, running at the same frame rate, and starting simultaneously. This leads to significant flickering and flagged pixels due to interference. Assigning each camera a different channel effectively eliminates crosstalk, restoring a reliable depth map.

![Scene recorded with and without separate channels selected, to show the impact of crosstalk.](./resources/CrossT2.gif)

As mentioned above, this artifact can be resolved by assigning different channels to each camera.
## With other devices
Finally, crosstalk can occur not only between ToF cameras but also with other devices. For example, safety scanners using infrared light at similar wavelengths to the O3R may experience interference, producing artifacts similar to those caused by dust. 
To mitigate this:
- It is usually sufficient to increase the number of scans the safety scanner requires to identify a pixel as an obstacle. 
- Mount the O3R as far away as possible from the safety scanner plane, particularly along the vertical axis.
- Turn off the cameras when the robot is stationery. This has the benefit of saving power, and ensures that the illumination is active only when necessary.
      
To thoroughly test crosstalk, we recommend running tests with multiple robots at varying distances and angles. 
Crosstalk might occur only in specific geometrical configurations, and these situations are easier to pinpoint when a larger number of robots are involved. The tests should focus solely on real-world scenarios, such as at charging stations or intersections where multiple robots may converge at the same time.
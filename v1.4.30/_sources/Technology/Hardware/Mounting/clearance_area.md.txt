# Clearance area requirements

The O3Rxxx cameras use active illumination. 
The field of view of the illumination module is wider than the field of view of the optics module. 
Any object obstructing the field of view of the illumination module or the lens, especially in the close range, can cause disruptions of the signal and generate artifacts that are difficult to filter out.

To ensure that no disruption is caused by objects in the close range, for example the vehicle's chassis itself, it is required to maintain a clearance area around the camera free of all obstruction.

## O3R225
For the O3R225, the clearance area is defined as shown in the diagram below:
![Top view of the clearance area for an O3R225 camera](img/225_clearance_area_horizontal.jpg)

![Side view of the clearance area for an O3R225 camera](img/225_clearance_area_vertical.jpg)

The clearance area is 150 degrees along the horizontal angle and 140 degrees along the vertical angle. 

The clearance area shall be kept free of any permanent obstructions, like the vehicle's chassis or other overhanging parts. It is especially important to respect these requirements for the first 50 cm in front of the camera.

Temporary occlusions, like loads carried by the vehicle, can be acceptable depending on the setup but might impact the detection performance. For dealing with such occlusions in ODS, refer to [the overhanging loads documentation](../../../ODS/OverhangingLoads/overhanging_loads.md).

:::{note}
You may have noticed that the illumination area extends past the nominal field of view of the illumination module. 
This is because of the diffuse quality of light: light reaches a wider angle than the specified field of view, with its intensity decreasing as the angle increases. 
This means that objects in the area to the edges of the illumination field of view can still impact the measurements.
The defined clearance area takes this into account.
:::

## O3R222

For the O3R222, the clearance area is defined as shown in the diagram below:
![Top view of the clearance area for an O3R222 camera](img/222_clearance_area_horizontal.jpg)

![Side view of the clearance area for an O3R222 camera](img/222_clearance_area_vertical.jpg)

The clearance area is 80 degrees along the horizontal angle and 80 degrees along the vertical angle. 

The clearance area shall be kept free of any permanent obstructions, like the vehicle's chassis or other overhanging parts. It is especially important to respect these requirements for the first 50 cm in front of the camera.

Temporary occlusions, like loads carried by the vehicle, can be acceptable depending on the setup but might impact the detection performance. For dealing with such occlusions in ODS, refer to [the overhanging loads documentation](../../../ODS/OverhangingLoads/overhanging_loads.md).

:::{note}
You may have noticed that the illumination area extends past the nominal field of view of the illumination module. 
This is because of the diffuse quality of light: light reaches a wider angle than the specified field of view, with its intensity decreasing as the angle increases. 
This means that objects in the area to the edges of the illumination field of view can still impact the measurements.
The defined clearance area takes this into account.
:::
<!-- 
## Examples

Considering the clearance area requirements listed above, below are two examples of mounting positions:
| Correct mounting                                             | Incorrect mounting                                                                                                                     |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| With this mounting position, the clearance area is respected | With this mounting position, the clearance area is not respected.<br>The vehicle body is obstructing the corner of the clearance area. |
| TODO good mounting picture                                   | TODO bad mounting picture                                                                                                              | -->
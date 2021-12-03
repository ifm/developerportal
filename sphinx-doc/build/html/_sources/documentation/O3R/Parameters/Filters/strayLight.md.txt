*Disclaimer: As a vendor of industrial equipment, we always try to mitigate physics artifacts to the best of our abilities. The default settings are chosen with this goal in mind: providing the best experience for **most** cases. However, the variety of scenes that mobile robots and other applications can encounter makes a “one-fits-all” configuration impossible. With this in mind, we present the outliers in our documentation, challenging but common cases that might require fine-tuning of the camera configuration.*

# Stray Light Filter

Scenes including highly reflective objects are common in robotics and industrial use cases. These scenes can present challenges because reflectors introduce an artifact known in optical systems as stray light. In this document, we focus on this phenomenon and present the stray light filter available with the O3R. We analyze some challenging cases and give hints on how to handle specific applications. 

> NOTE: the scenes presented here are recreated with the intention of highlighting the specific challenges of mobile robots environments here in our office. We detail our experience of trying to “fool” the system, but we are well aware of the limitations of this approach. We always want to hear from firsthand experience, and we gladly welcome your feedback. 

## Abstract
Stray light is a phenomenon that exists in any optical system where light reflected from very bright objects is bouncing around in the lens, impacting the measurement. Two main effects of stray light are noticed in 3D point clouds: the creation of a halo around the bright objects, and the apparition of “ghost” pixels in the close range. To mitigate these artifacts, a stray light filter is available (turn it on with `diParam.enableStrayLight`). This filter can be fine-tuned to be more or less conservative, depending on whether the application requires high accuracy or a rich point cloud (adjust `diParam.excessiveCorrectionThreshDist` and `diParam.excessiveCorrectionThreshAmp`).

**Table of Contents:**
1. The stray light phenomenon + filter intro
    1. Halo: before/after
    2. Ghost pixels: before/after
2. Fine-tuning of the stray light
3. Conclusion


## The stray light phenomenon

Stray light designates any unwanted light reaching the optical lens of the camera. This light can be reflected light from an object within the field of view or emitted by an object outside the FoV. Stray light exists in any non-perfect optical systems, where an excessive amount of light is reflected on the internal parts of the system (within the lens or other camera components) and eventually reaches a pixel of the imager, interfering with the measurement. 
Common objects found in warehouses and other industrial environments, like reflective cones or safety vests, are sources of stray light interference.

A typical effect of stray light is to cause a halo of pixels around the reflective object, affecting the measurement of low-signal pixels in the area. But stray light can also affect pixels not in the direct vicinity of the reflector, creating ghosts pixels, typically in the close range, which can make the scene hard to analyze. 

Let's look at some concrete examples of stray light artifacts. For the purpose of demonstration, we have disabled the built-in O3R stray light filter.

### First case: The stray light halo
A circulation cone with a reflective band is positioned 1 m in front of the camera. We can observe a stray light halo around the cone: pixels are measured where there should not be anything (the background is out of range in this case).
![Stray light halo when filter is disabled.](resources/no_filter_halo.png)

A cardboard box is positioned next to the cone, at the same distance from the camera. The halo is still there and affecting part of the background pixels. However, the measurement of the actual box is accurate and is not affected by the reflective object next to it. Stray light affects the low-signal pixels in the scene more strongly, and, in this case, it does not affect the measurement of the box, which reflects enough light.
![Stray light impact on box with filter disabled](resources/no_filter_halo_box.png)


### Handling stray light halos
The O3R camera comes with a built-in stray light filter that mitigates stray light artifacts. This filter improves the measurements by correcting the undesired effects of the optical system. Additionally, pixels that are overly affected by stray light are filtered according to set distance and amplitude thresholds (the default distance threshold is set to 8 cm: if stray light affects a pixel measurement more than 8 cm, this pixel will be invalidated). 

Let's look at the first scene again, but this time with the filter activated. We can see that the halo has been greatly reduced around the reflective part of the cone. A similar result is achieved with the box in the scene.
![Stray light filter activated](resources/filter_cone.png)
![Stray light filter activated with box](resources/filter_with_box.png)

The stray light filter makes it possible to reduce mismeasured pixels in the vicinity of the reflector.
### Second case: “Ghost” pixels
Let's look at a second case of stray light. A reflective cone is placed 1 m in front of the camera. The background is a white wall, at around 2 m. The stray light filter is deactivated.
![Stray light filter deactivated, flying pixels appear](resources/no_filter_flying_pixels2-edits.png)
![Stray light filter deactivated, flying pixels appear](resources/no_filter_flying_pixels1-edits.png)

We can see (highlighted in the red circle) that some pixels are measured that do not exist in the real scene (there is no object there). This is a second effect of stray light: nonexistent pixels appear in the close range. 
This could create false positive measurements, for instance when performing obstacle detection and trigger interruption of service.


### Handling “ghost” pixels

In the second scene, “ghost” pixels appeared in the close range due to stray light. The filter also mitigates this artifact:
![Flying pixels removed by the filter](resources/filter_removes_flying_pixels.png)

The side effect of this is the removal of additional pixels on the scene, as we can see in the floor area.
The O3R stray light filter invalidates pixels that are flagged as over-affected by the stray light: pixels whose distance or amplitude measurement is affected over the set threshold. We will see in the next section how to tune this distance threshold.

## Fine tuning the stray light filter

The default settings of the filter are chosen to properly handle most cases of stray light, but some scenes might require fine-tuning it.
We focus here on obstacle detection cases that prove challenging with the default settings of the filter.

### Obstacle detection
In cases where obstacle detection is the main application, one can accept that stray light affects the scene such that some pixels will be measured as much as 10 cm off their real position, as long as the obstacle is detected and false negatives are avoided. Let's focus on scenes where the sources of stray light are limited (a single reflector or smaller reflective surfaces).

The interesting setting in this case is the `excessiveCorrectionThreshDist`. This setting defines the distance threshold above which a pixel affected by stray light will be discarded.

Let's look at a scene with and without stray light. A box (the obstacle) is placed on the floor, and we measure the distance to it.
#### Scene without reflector:
![A box on the floor with no reflector in the scene](resources/box_no_reflector.png)

We choose a reference pixel on the side of the box. The distance measured for this pixel is 1.527 m.

#### Scene with reflector:

For the exact same scene, we add a reflector to the side of the field of view. 
![Part box disappears when a reflector is added to the scene](resources/box_disappears_pixel.png)

We can see that a whole side of the box disappears. This is due to the stray light that affects the scene: the pixels are marked as invalid by the stray light filter because of their distance measurement being affected.

#### Adjusting the distance threshold

Let's adjust the distance threshold setting, `excessiveCorrectionThreshDist`. Its default value is 0.08 m, which means that any pixel affected more than around 8 cm will be discarded.  Let's set it to `0.2 m`.
![We can get the box back](resources/box_back_0.2.png)

We can see that we are able to recover most of the pixels from the side of the box. However, the distance measured for the same pixel is now 1.590 m, when our reference measurement is 1.527 m. The side of the box is measured 6.3 cm off its actual position. This is acceptable because the robot will be able to drive along the reflector and still detect the presence of an obstacle.

> Note: there are multiple filters activated by default with the O3R, which means pixels might be discarded due to a combination of multiple filters. This explains why the pixel was discarded while being only 6.3 cm off, and not 8 cm, as expected with the correction threshold we set.


**Warning:**
Relaxing the distance threshold value affects which stray light pixels are discarded by the filter. By doing so, you risk allowing some ghost pixels in the scene that might create false positive obstacles.


### Multiple reflectors in the scene

Scenes involving multiple reflectors can have pretty dramatic stray light artifacts. In these cases, getting rid of all the stray light ghost pixels might require you to strengthen the filter. Let's analyze a specific example and see how it can be handled.

The scene is set up with two reflectors along the expected path of the robot, and the left side is actually a glass wall. We imagine that the robot is moving forward, and, therefore, it must detect the floor and potential obstacles.

Let's have a look at the scene with the stray light filter deactivated. Pretty dramatic, right? The two reflectors create so much stray light that the whole path of the robot is blocked by ghost pixels (see the highlighted areas in red).

![Dramatic stray light artifact](resources/dramatic_straylight_edited.png)
![Dramatic stray light artifact](resources/dramatic_straylight_2_edited.png)

Now let's reactivate the filter and see what we get.
![Filter reactivated, stray light considerably reduced.](resources/dramatic_straylight_reduced_edited.png)
The ghost pixels almost completely disappeared, and the path forward is mostly clear. But we can still see remaining ghost pixels in the close range above the robot (denoted by the red circle). A measurement indicates that these pixels are 0.8 m away from the camera, which could be in the path of the robot if it or its payload reaches this height. The robot would therefore be blocked from moving forward by an obstacle detection algorithm, even though the path is clear.

We can once more adjust the stray light filter to ensure we filter away all the remaining ghost pixels. To do so, we can use the distance threshold, as presented earlier. This time, we are trying to remove extra pixels, so we are going to lower the distance threshold (we set it to 0.05 m). We can see that all the ghost pixels are now gone, and the robot can proceed to its route, obstacle free.
![We remove the ghost pixels](resources/dramatic_straylight_ghost_removed.png)

> NOTE: This scene could also be handled with the amplitude threshold (`diParam.excessiveCorrectionThreshAmp`). This threshold follows the same concept as the distance threshold, invalidating pixels with an amplitude below the set value. Generally, setting the distance threshold suffices, but we encourage you to play with both to select the best configuration possible for your use case.

## Conclusion

As we saw with the examples detailed above, there is no “one-size-fits-all” configuration for handling stray light in robotics applications. Proper configuration needs to be selected after reviewing the scenes the robot is expected to encounter. The number and position of highly reflective surfaces that will enter the field of view at a certain time affects the necessary strength of the filter. Multiple configurations can be stored on board the O3R, and we encourage bringing intelligence to the use of the platform to adapt the cameras’ configurations to the scene where necessary. In scenes where a high accuracy of the ToF measurement is expected, we recommend avoiding placing reflectors in the scene or placing them reasonably far away from the navigation path of the robot.

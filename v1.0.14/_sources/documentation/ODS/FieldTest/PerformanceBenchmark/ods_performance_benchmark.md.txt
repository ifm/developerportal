# ODS Performance

The O3R-ODS performance depends upon various factor: this whitepaper gives an introduction to the factors influencing ODS performance and how the system can be tested and evaluated for benchmarking.

## Factors to be considered

The following list of conditions and dependencies gives an overview of considerations which have to be taken into account to achieve optimal ODS performance results:

+ Mounting position and mounting height
+ Type of ifm camera head: different camera FOVs, i.e. focal lengths.
+ Floor types and maximum visible range of floor pixels per floor type
+ Movement speed
+ Targeted object size


### Camera mounting positions, esp. vertical mounting heights
The positioning of the cameras and the number of cameras mounted on the AGV has a great impact on the performance of the ODS system.

There are a list of considerations which have to be taken into account when selecting mounting positions of cameras on an AGV:

**Floor range in relation to mounting height:**

The amount of light reflected back from the floor in a diffuse reflection type depends on the angle of incidence.
This means for higher mounted cameras, the angle of incidence (on the floor plane) is larger, i.e., more light is reflected to be suitable for a robust distance measurement. If the camera is too close to the ground, reflection artifacts may affect the system and negatively impact measurement ranges.

In general we recommend mounting the cameras in a range of 250 mm to 700 mm (vertically) from the ground. This is a good compromise between diffuse reflections for typical floors and small radial distances to objects on the floor, i.e. maximization of the detection range.

The orientation should be adjusted such that at least one camera on the AGV must see the large portion of the floor (see the chapter about visual odometry).

**Maximum radial range vs horizontal range:**

The benchmark results as provided by ifm are a measurement in difference in X-coordinates.
It is expected that the main movement direction of the AGV / AMR is in forward X direction, hence the difference in X-coordinates for objects which are roughly aligned with a straight movement direction of the AGV.

In practical application the radial distance between the camera and the the object of interest is mainly dependent on the mounting height (and for wide mounting baseline - the Y-difference).
For longer radial distances the object reflection signal becomes significantly weaker and it is harder to robustly estimate true objects detections, i.e. the trade-off between better angles of attack (see chapter above) becomes negated by lower signal strength - smaller typical object ranges.

The maximum range of ODS is limited to 4 meters in firmware version 1.0.x.

**Dead zones**

Depending on the mounting height and mounting position dead zones, e.g. triangles in space where no data is received, might be more or less pronounced.
Objects in these triangles can not be seen unless a secondary camera monitors it.

Depending on the restart strategy the effective braking distance is determined by the typical object detection range minus the extend of the dead zone in front of the AGV.


**Visual odometry:**

The Visual Odometry algorithm is an integral part of the ODS. For a fully working system visual odometry needs to be correctly configured for at least one suitable camera.
This requires the camera to be mounted is such a way to be able to see the floors surface in front of the AGV / AMR or at one of the sides (angled to the main driving direction) of the machine.
Typically visual odometry requires a floor range (i.e. floor pixels visible in a specific distance range) of `~ 1 m`. This means a part of the floor covering a distance range of about one meter has to be visible under typical driving conditions for the visual odometry software part to be functional.

Please see the [mounting guide](../../Mounting/mounting.md) for more details on how to mount your cameras.
This visual odometry camera in interaction with the O3Rs IMU is used to estimate ego motion data, i.e. the movement of the O3R system as part of the machine.

In all ifm internally tested scenario and mounting configurations enough of the floor is visible for a stable ego motion estimation.

### Type of cameras
The positioning of the cameras and the number of cameras mounted on the AGV has a great impact on the performance of the ODS system.

As of now, there are two different types of O3R camera heads available in the market which have different Field Of View (FoV).

| Camera Model | Horizontal FOV | Vertical FOV |
| ------------ | -------------- | ------------ |
| O3R225       | 105°           | 78°          |
| O3R222       | 60°            | 45°          |

**O3R225**

The O3R225 camera has an opening angle of 105° by 78°. This ideally suited for applications where large opening angles are required to monitor large areas of space.
Please see the technical specifications on the [ifm.com website](https://www.ifm.com/).


**O3R222**

The O3R222 camera has an opening angle of 60 by 45°. This ideally suited for applications where maximum range especially on small object sizes is required.
Please see the technical specifications on the [ifm.com website](https://www.ifm.com/).

The amount of active light illumination per spatial angle is much larger for the O3R222 camera heads since the area covered is only about 1/4 of the area of a O3R225 camera.
This improves detection ranges significantly.

To benefit from the advantages of both cameras, we suggest to complement a O3R225 camera with a O3R222 camera for long range applications. Please see our mounting instructions for more details and example mounting configurations.


### Floor types and maximum floor plane estimation ranges

Depending on the floor type the amount of light reflected back into the camera lens via a diffuse reflection type differs.

The optical properties of a floors surface are similar in the visual spectrum compared to the spectrum of the O3R cameras. If floors appear "reflective" for the human eye, this will most likely mean they are also "reflective" in near infrared, i.e. the cameras working spectrum.

For floors with specular reflective properties the maximum range of pixels on the floor will be a smaller distance. This is turn means that the floors plane estimation is limited by the reduced maximum floor range. This is especially important for small objects placed directly on the floor. Such small objects required a complete floor estimation in their local neighborhood, i.e. the floor to be visible to the same range as the objects itself.

For larger objects or elevated small objects this requirement is relaxed. These can be detected further / earlier than the respective local ground plane pixels.

When testing your setup and application, please perform the tests under comparable conditions such as floor types.


### Movement speed

Movement speed implicitly impacts the stable estimation distances of all objects.
Objects have to be seen in at least 2-3 frames before their corresponding probability reaches a high enough level in the occupancy grid (and zone) to exceed the required threshold level of 0.5.

This means that for higher movement speeds the traveled distance towards the objects during these 2-3 frames is larger compared to lower movement speeds and therefore the maximum detection distance is reduced.

<!-- TODO: add more description? -->

### Typical object size and reflectivity

ODS performance depends on object size and reflectivity.

If large surface areas or highly reflective surface types and angles are present the object can be seen easily.
For small surface areas and low reflective surface types and angles the object might not be seen by the camera at all, and can therefore not be detected by the ODS application.

### Latency

**Obstacle Detection System**

The ODS runs at 20 frames per second i.e the time difference between each ods frame is equal to 1/20 s (second) = 50 ms (millisecond).
The typical ODS "latency" is around 2-3 frames. This ensures robustness, via multiple detections in consecutive frames.


**Additional System Latency and Consequences**

- Network Latency:
    This latency refers to the delay in network communication between the host (VPU) and an additional IPC or PLC. High network load can introduce additional latency to the network. Ensure full Gigabit Ethernet speeds when designing your local AGV network.
- Communication cycle times: e.g. PLC cycle times
    Typically kinematics handling (such as acceleration and braking) is handled in a low level PLC based application. Depending on the cycle time configuration this might introduce additional time delays before "stopping signals" are evaluated.


**Reaction Distance Calculations**

The stopping distance for an AGV is the sum of the reaction distance and braking distance. Braking distance is the distance traveled by the AGV after the application of brakes (mechanical / regenerative braking) which depends on the vehicle deceleration, load and also friction between the floor and wheels.

Whereas, the reaction distance is the distance traveled by the AGV in the time duration of detecting the obstacle with high confidence (duration of 2 to 3 frames) by ODS (ODS latency), receiving the data from O3R to IPC (network latency), post-processing the ODS data and sending the signals to actuate the brakes (processing time).

- The latency for ODS is 50 milliseconds i.e for three frames = 150 milliseconds
- Network Latency ~ 10 milliseconds
- Processing time: depends on the algorithm and processing power of the IPC / PLC cycle times

$$ time_{total latency} = ODS\_latency +  Network\_latency + processing\_time $$
<!-- 
## ODS Performance Analysis


**TODO: add tables with typical ODS performances** -->
# ODS Performance

This whitepaper gives an introduction to the factors influencing ODS performance and how the system can be evaluated for a specific application.

The following factors have to be taken into consideration when integrating ODS into a system:

+ Mounting position,
+ Field of view of the camera,
+ Floor types,
+ Movement speed,
+ Targeted object type,
+ Latencies.

## Mounting position

The positioning of the cameras on the AGV has a great impact on the performance of ODS.

Below are some things to take into account.

### Mounting height

The amount of light reflected from a surface in a diffuse reflection depends on the angle of incidence. The more light reaches the camera, the more robust the computed distance measurement.
This means that, assuming that the camera is facing straight out, the higher the camera is mounted, the larger the angle of incidence on the floor plane, the more light is reflected from the floor back to the camera. This in turn leads to more robust distance measurements. 

On the other hand, the lowest the camera is mounted, the less light is available which makes is more difficult to detect objects at long distances.
In addition, if the camera is too close to the ground, reflection artifacts may occur and negatively impact measurement ranges.

Another aspect to the mounting height is the distance from the camera to the object to detect. If the camera is mounted at a 2 meter height on a vehicle, it is already two meters away from any object on the floor. While this might be a good mounting position to detect cantilever objects that might collide with the top part of the vehicle, this would considerably decrease the ability to detect the floor and small objects on the floor.

In general, we recommend mounting the cameras in a range of **250 mm to 700 mm** (vertically) from the ground. This is a good compromise to maximize the angle of incidence of light while ensuring that the camera is not mounted too far from potential object on the floor.

### Dead zones

Depending on the mounting position, dead zones might exist. ODS does not retain a memory of objects that have disappeared from the field of view into a dead zone. 
It is important to take this into account and define a strategy to either cover the dead zones with additional cameras, or to incorporate these dead zones into the effective breaking distance calculation. 

### Visual odometry

The visual odometry is used in ODS along with IMU data to calculate the velocity of the vehicle. 
For a fully functional system, the visual odometry needs to be available for at least one camera.
Typically, visual odometry requires that pixels belonging to the floor be visible up to about 1 meter  under typical driving conditions.

This might require the camera to be angle down is such a way to be able to see the floor in front or to the side (angled to the main driving direction) of the vehicle.

## Type of cameras

As of now, there are two different types of O3R camera heads available in the market which have different field of view (FOV).

| Camera Model | Horizontal FOV | Vertical FOV | 
| ------------ | -------------- | ------------ | 
| O3R225       | 105°           | 78°          | 
| O3R222       | 60°            | 45°          |

The illumination module and the resolution are the same for both camera, which means that for the same amount of light, the O3R225 has to cover around four times the area the O3R222 covers. 
Due to this fact, greater detection ranges, especially for small objects are achieved with the O3R222 camera.

To benefit from the advantages of both cameras, we suggest to complement a O3R225 camera with a O3R222 camera for long range applications.

## Floor types 

The reflectivity and type of the floor surface impacts the amount of light reflected back into the camera lens.
Even though the O3R cameras utilize the infrared spectrum, a good rule of thumbs is that a floors that appear "reflective" for the human eye will most likely also be reflective in infrared.

Three main things are impacted by the reflectivity and surface type of the floor:
- Floors that are very smooth without visible marks, like freshly painted floors, can be challenging for the [visual odometry](#visual-odometry) estimation.
- Highly reflective floors can create stray light artifacts when the camera is mounted low. In this case, stray light can negatively impact the detection of small or low reflectivity objects.
- To reliably detect small objects (smaller than 10cm) on the floor, ODS relies partially on detecting the floor in the vicinity of the object. For highly reflective floors, the visible floor range is typically smaller. This means that performance detection for small objects might be degraded on highly reflective floors. For objects larger than 10 cm (vertically), this limitation does not apply.

For these reasons, it is crucial to benchmark ODS in the environmental conditions expected for the use case.

## Movement speed

The speed of the vehicle impacts the stable detection distances of all objects. ODS runs at 20 frames per second, and needs an object to be stably detected for 2 or 3 frames before the corresponding cells in the occupancy grid are filled and the zones are triggered. 
This introduces a slight delay between the first and the stable detection of the object, which explains differences in the detection distances at different velocities. 

## Object size and reflectivity

Some objects are easier for the camera to detect depending on their size and reflectivity.

Large objects and highly reflective surfaces reflect more light back to the camera and are therefore easier to detect. The contrary is true for small objects or objects with a low reflectivity. 

## Latency

### Processing and network latencies

The processing time, which encompasses the point cloud calculation and the ODS algorithm, as well as the network delays of transferring data from the camera to the embedded system introduce a latency of roughly 100 ms. 
This latency can be precisely measured using the timestamp attached to the data, when the O3R platform and the vehicle are time synchronized, and comparing it to the reception timestamp. See the [timestamps documentation](../../../Technology/VPU/Timestamps/timestamps.md).

Additional delays in the communication to an external IPC or PLC can also occur, depending on the setup. To reduce these delays, ensure full gigabit Ethernet speeds when designing the local vehicle network.

Finally, the cycle times in the PLC or IPC for handling the vehicle kinematics might introduce additional delays before "stop signals" are processed.

### ODS latencies

ODS runs at 20 frames per second, which means it processes a new frame every 50 milliseconds. For a stable detection, an object typically needs to be detected for two or three frames. This means that 100 ms latency exist between when the object is first detected by the camera and when it appears in the occupancy grid or zone. 

This latency only impact the object's first detection. Once the object is robustly detected, its position in the occupancy grid will be reported with no latency, except for those introduces in processing (see [above](#processing-and-network-latencies)).

### Stopping Distance Calculation

The stopping distance for a vehicle is the sum of the reaction distance and braking distance. 

The braking distance is the distance traveled by the vehicle after applying the brakes, which depends on the vehicle deceleration rate, the load and the friction between the floor and the wheels.

The reaction distance is the distance traveled between the reception of the data from the O3R and the propagation of the brake signals through the network.

These two distances have to be added to calculate the specific stopping distance of the vehicle. An example would be:
- The latency between an obstacle being detected by ODS and the data being forwarded to the IPC or PLC: ~100ms
- Vehicle network Latency: ~ 10 milliseconds
- The braking distance of the vehicle at a speed of 1m/s is 40 cm

In the example above, the total latencies of 110 ms correspond to 11 cm, which have to be added to the 40 cm of braking distance for a total of 51 cm for the stopping distance. This means that objects need to be detected at least 51 cm away from the robot to ensure that stopping is possible before collision.
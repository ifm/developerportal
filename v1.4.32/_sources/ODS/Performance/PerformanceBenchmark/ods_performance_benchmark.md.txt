# ODS Performance

The following information gives an introduction to the factors influencing ODS performance and how the system can be evaluated for a specific application.

The following factors have to be taken into consideration when integrating ODS into a system:

+ Mounting position,
+ Field of view of the camera,
+ Floor types,
+ Movement speed,
+ Targeted object type,
+ Latencies.

## Mounting position
The mounting position of the ODS cameras is very important to ensure optimal performance for the specific use case.

We outline our mounting recommendations in [the ODS mounting documentation](../../Mounting/mounting.md).

## Type of cameras

As of now, there are two different types of O3R camera heads available in the market which have different field of view (FOV).

| Camera Model | Horizontal FOV | Vertical FOV | 
| ------------ | -------------- | ------------ | 
| O3R225       | 105°           | 78°          | 
| O3R222       | 60°            | 45°          |

The illumination optical power and sensor pixel resolution are identical for both cameras. Consequently, given equivalent amount of light, the O3R225 covers approximately four times the area of the O3R222, attributable to differences in their field of view (FOV) and field of illumination (FOI). 
As a result, the O3R222 camera achieves greater detection ranges, particularly for small objects.

To benefit from the advantages of both cameras, we suggest to complement a O3R225 camera with a O3R222 camera for long range applications.

## Floor types 

The reflectivity and type of the floor surface impacts the amount of light reflected back into the camera lens.
Even though the O3R cameras utilize the infrared spectrum, a good rule of thumb is that floors that appear "reflective" for the human eye will most likely also be reflective in infrared.

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
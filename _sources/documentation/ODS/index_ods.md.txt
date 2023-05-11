# ODS (Obstacle Detection System)


ODS - `Obstacle Detection System` - provided by [ifm](https://www.ifm.com), is a software solution building on top of the O3R ecosystem to enable autonomously driving vehicles (AGVs / AMRs) to avoid collisions with obstacles.

The ODS application is specifically designed to detect two groups of objects, which are missed by a standard LiDAR based autonomously driving vehicle:

+ objects above the safety LiDAR scanner plane, i.e. cantilevered objects,
+ and objects below the safety LiDAR scanner plane, i.e. small sized objects on the floor.

Its application lies within the addition of a full 3D volumetric monitoring of the surrounding of autonomously driving vehicles - whereas LiDAR scanner planes are limited to two spatial dimensions.
ODS doesn't follow any safety regulations: e.g. ASIL-level or similar, and can therefore not replace a typical application of safety devices such as safety LiDAR scanners.


**ODS application properties and building blocks:**
+ ODS uses the O3R camera(s) as its primary data source: at least one O3R 3D camera stream is required
+ ODS is capable of estimating the required ego-motion information via an internal algorithm - i.e. is not dependent on external ego-motion sources
+ ODS outputs two kind of information sets:
   + A 2D occupancy grid information: typically used in addition to existing navigation information to avoid and navigate around obstacles
   + (3D) zone information: a typical use case is the direct propagation to the chassis control system to perform braking manuevers when obstacles are present
   + ODS does not classify objects: the output information is independent of the object type
+ multiple ODS applications can be initialized on one O3R VPU (IPC): one application instance per primary movement direction - i.e. forward, backward driving
+ ODS is a licensed application: Please see the O3Rs release notes for additional information for compatibility tables and embedded OS versions



<!-- TODOOO ## Demonstration Videos -->

<!-- TODOOO ## Essential Reading for various phases of ODS integration -->


:::{toctree}
    :maxdepth: 2
Getting started <getting_started>
Mounting <Mounting/mounting>
Instantiation <Instantiation/instantiation>
Configuration <Configuration/configuration>
Zones <Zones/zones>
Occupancy grid <OccupancyGrid/occupancy_grid>
Recording <Recording/ods_data_recording>
Changing views <ChangingViews/changing_views>
Overhanging loads <OverhangingLoads/overhanging_loads>
Extrinsic calibration <ExtrinsicCalibration/index_extrinsic_calibration>
Field test <FieldTest/index_field_test>
Device verification <DeviceVerification/index_device_verification>
ifmVisionAssistant <iVA/index_ifmODS_iVA>
Python <Python/index_ifmODS_python>
C++ <Cpp/index_ifmODS_cpp>
FAQ <faq>
:::
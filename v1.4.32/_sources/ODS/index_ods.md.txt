# ODS (Obstacle Detection System)

Unfamiliar with ODS? Check out our presentation video.

:::{youtube} H1wF4GrevtQ
    :width: 25%
:::
:::{toctree}
    :maxdepth: 2
    :hidden:
Getting started <getting_started>
The ODS journey <self>
Mounting <Mounting/mounting>
Instantiation <Instantiation/instantiation>
Configuration <Configuration/configuration>
Zones <Zones/zones>
Occupancy grid <OccupancyGrid/occupancy_grid>
Recording <Recording/ods_data_recording>
Changing views <ChangingViews/changing_views>
Overhanging loads <OverhangingLoads/overhanging_loads>
Negative Obstacles <NegativeObstacles/negative_obstacles>
Dust artifact mitigation <DustMitigation/dust_mitigation>
Extrinsic calibration <ExtrinsicCalibration/index_extrinsic_calibration>
Performance <Performance/index_performance>
Device verification <DeviceVerification/index_device_verification>
ifmVisionAssistant <iVA/index_ifmODS_iVA>
Python <Python/index_ifmODS_python>
C++ <Cpp/index_ifmODS_cpp>
:::


<!-- Have to use raw html so the title does not appear twice in the navigation -->
:::{raw} html
<h2>The ODS journey</h2>
:::

A successful integration of ODS on to an automated vehicle has multiple phases. We refer to it here as the ODS journey, to represent the long process of designing a new vehicle and developing and testing its new features.

The diagram below is intended to be used as a reference throughout the full ODS integration process, starting from unboxing the device and learning how to use it, to the start of production after a successful test campaign.
Each step in the diagram will guide you to the relevant documentation.

:::::{grid} 2
:reverse:

::::{grid-item}
:::{raw} html
    :file: img/ods_journey.drawio.svg
:::
::::
::::{grid-item}
**The exploratory testing phase involves:**

- Getting familiar with the interfaces which will be used for testing, mainly [the ifm Vision Assistant GUI](../SoftwareInterfaces/iVA/index_iVA.md),
- Building a basic understanding of what the ODS solution provides and how it works,
- Get a feel for whether the ODS will fit into the existing software and hardware design of the vehicle.
 
For this phase, testing can be done in an informal way, where learning about the ODS solution and designing formal tests can be done in parallel. The goal is to build a solid foundation for the rest of the project, where ODS performance must be validated against system requirements.


**Performance validation phase:**

The goal of this phase is to verify that the ODS solution solves the expected problem statement: can the relevant objects be detected far enough to come to a complete stop under normal operating conditions?

For this phase, to perform a realistic evaluation, the camera and VPU need to be mounted on the vehicle, with a precise calibration. This ensures that ODS will perform similarly as in the final product. 
The tested mounting positions should be as close to the anticipated positions in the final vehicle as possible, but it does not have to be the exact same.

During this phase, no software integration is required. The user can record data using the ifm Vision Assistant, and inspect the recordings for more detailed analysis afterwards.

The focus is on designing real operation test cases in order to evaluate the performance of the ODS solution with respect to the vehicle's requirements.

**The integration phase:**

In the previous phase, we have established that ODS works for the expected use case.
The focus of the integration phase is in fully integrating ODS into the vehicle's drive and control loop. This involves:

- Integrating ODS with the vehicle software, either using the [ifm3d API](https://api.ifm3d.com/stable/) or the PLC interface.
- Finalizing the position of the camera and VPU into the mechanical design of the vehicle, including wiring, etc. Special attention should be paid to [the camera heads clearance areas](../Technology/Hardware/Mounting/clearance_area.md).
- Once the vehicle integration is complete, it is important to test the ODS solution in the expected environment to ensure that all environmental variables are accounted for. This is also an opportunity to test things like latency and other aspects of the integration.
- Setting up the production of the vehicle is part of this phase, and for ODS this means having a way to calibrate the cameras in production. We recommend using the [Static Camera Calibration](../CalibrationRoutines/SCC/README.md) for this purpose.
::::
::::
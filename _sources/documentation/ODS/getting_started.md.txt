# Getting started with ODS

## Prerequisites

It is expected that there is a running system. Please refer to [the unboxing section](../GettingStarted/index_getting_started).

A typical procedure would be:
- connect M04239-VPU with heads and power supply
- boot-up the system
- connect with iVA
- verify that live images are received



## Step 1: Extrinsic calibration
The parameters to transform the camera coordinate system into the user coordinate system are called extrinsic calibration parameters. Without the extrinsic calibration parameters ODS will not work properly.
For a tabletop setup, from which accurate results are not expected, the calibration parameters should be set to the following values:
- transX: 0
- transY: 0
- transZ: 0.1
- rotX: -1.57
- rotY: 1.57
- rotZ: 0


## Step 2: Using iVA for ODS

These are the steps to start ODS in the iVA:
- Instantiate the ODS Application
  - open application-tab
  - click on the + - symbol -> a list of applications should appear
  - click on ODS  -> ODS parameters should appear

  ! Oops, that didn't work ! --> verify a M04239 VPU with ODS license is used.

- Configure ODS parameters
  - (this step is not need for a table top demonstration)

- Start ODS
  - set ODS-state to "RUN" -> the live occupancy grid should appear 

  ! Oops, that didn't work ! --> change the extrinsic parameters to the suggested values above.

- Play with display
  - the application tab only shows the occupancy grid
  - change to monitor tab -> the pointcloud and the occupancy grid are shown

watch the video:
![Create a new ODS Application instance](img/start_ods.gif)

:::{note}
For better visualization of the point cloud when using ODS, use the Frame Filter from the `View Options` in the  `Monitor` window. The frame filter does not change the Mode for any Ports as this is only used for visualization purposes.

  ![Frame Filter](img/frame_filter.png)
:::


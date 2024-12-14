# PDS (Pick and Drop System)

PDS - `Pick and Drop System` - provided by [ifm](https://www.ifm.com), is a software solution built on top of the O3R ecosystem to enable AGVs (Automated Guided Vehicles), forklifts, and other robots to detect the pose of objects within a 3D environment for picking them up and detecting racks for dropping them.

:::{toctree}
    :maxdepth: 2
Getting started <GettingStarted/index_getting_started>
Calibration <Calibration/pds_calibration>
Configuration <Configuration/configuration>
Results <Results/results>
Pallets <GetPallet/getPallet>
Racks <GetRack/getRack>
Volume check <VolCheck/volCheck>
Code examples <Examples/examples>
Recording <Recording/recordings_iVA>
Integration <Integration/index_integration>
:::

<!-- ------------------------------------------------- -->
<!-- This is a title, but we put it as raw html as
a hack to avoid having it display in the left bar nav. -->
:::{raw} HTML
    <h2> Features </h2>
:::

PDS uses the O3R platform as its primary data source: one 3D camera stream can be used at one time. It is recommended to use the `O3R222` camera head.
The support for O3R225 wide FoV heads is experimental at the moment.
The support for (H)VGA  camera heads will be added in the future.

PDS provides four different commands:
| **Command** | **Output**                                                                      |
| ----------- | ------------------------------------------------------------------------------- |
| `getPallet` | Pose of up to 10 pallets                                                        |
| `getRack`   | Pose of an industrial rack                                                      |
| `getItem`   | Pose of up to 10 custom items (experimental feature)                             |
| `volCheck`  | Quantifies the number of valid pixels within a defined volume of interest (VOI) |

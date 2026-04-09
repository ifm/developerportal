# PDS (Pick and Drop System)

PDS - `Pick and Drop System`, provided by [ifm](https://www.ifm.com), is a software solution built on top of the O3R ecosystem to enable AGVs (Automated Guided Vehicles), forklifts, and other robots to detect the pose of objects within a 3D environment for picking them up and detecting racks for dropping them.


::::{grid} 3
:::{grid-item-card}  Pick
    :class-item: homepage-icons
    :width: 50
    :img-top: ./img/pick_icon.jpg
    :img-alt: Get pallet icon
    :link: GetPallet/getPallet
    :link-type: doc
    :link-alt: Link to the get pallet documentation
+++
Find the position of up to 10 pallets with `getPallet`

:::
:::{grid-item-card}  Drop
    :class-item: homepage-icons
    :width: 50
    :img-top: ./img/drop_icon.jpg
    :img-alt: Drop icon
    :link: GetRack/getRack
    :link-type: doc
    :link-alt: Link to the get rack documentation
+++
Find the position of a rack with `getRack` and check for occupancy

:::
:::{grid-item-card}  Check
    :class-item: homepage-icons
    :width: 50
    :img-top: ./img/check_icon.jpg
    :img-alt: Vol check icon
    :link: VolCheck/volCheck
    :link-type: doc
    :link-alt: Link to the volume check documentation
+++
Checks predefined volumes with `volCheck` and find the distance to the nearest object

:::
::::


<!-- ------------------------------------------------- -->
<!-- This is a title, but we put it as raw html as
a hack to avoid having it display in the left bar nav. -->
:::{raw} HTML
    <h2> The PDS workflow </h2>
:::

PDS is a flexible system, and can suit many use cases. The diagram below shows an example of how the three commands, `getPallet`, `getRack` and `volCheck` could be used to perform a successful pick and drop mission.

:::{raw} HTML
    :file: img/pds_workflow.drawio.svg
:::

:::{raw} html
    <h2> Where to start? </h2>
:::

::::{grid} 3
:::{grid-item-card}  Choosing a camera
    :class-item: homepage-icons
    :width: 50
    :img-top: ./img/o3r_icon.svg
    :img-alt: Icon representing a camera
    :link: Compatibility/compatibility
    :link-type: doc
    :link-alt: Link to the compatibility documentation
:::
:::{grid-item-card}  Mounting the camera
    :class-item: homepage-icons
    :width: 50
    :img-top: ./img/mounting_icon.svg
    :img-alt: Get rack icon
    :link: Mounting/mounting
    :link-type: doc
    :link-alt: Link to the PDs mounting documentation
:::
:::{grid-item-card}  Getting started
    :class-item: homepage-icons
    :width: 50
    :img-top: ./img/forktruck_icon.svg
    :img-alt: Vol check icon
    :link: GettingStarted/index_getting_started
    :link-type: doc
    :link-alt: Link to the PDS getting started documentation
:::
::::



:::{toctree}
    :maxdepth: 2
    :hidden:
Compatibility <Compatibility/compatibility>
Getting started <GettingStarted/index_getting_started>
Mounting setup <Mounting/mounting>
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

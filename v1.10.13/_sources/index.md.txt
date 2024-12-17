# Welcome to the O3R documentation!

:::{toctree}
    :maxdepth: 2
    :hidden:
Home <self>
Getting started <GettingStarted/index_getting_started>
Firmware <Firmware/index>
Compatibility Matrix <CompatibilityMatrix/compatibility_matrix>
Technology <Technology/index_technology>
Software Interfaces <index_software_interfaces>
Calibration Routines <CalibrationRoutines/index_calibrations>
ODS <ODS/index_ods>
PDS <PDS/index_pds>
FAQ <FAQ/FAQ>
History <downloadable/index>
:::

This website contains all the documentation for the O3R platform. Find the datasheets and use case descriptions on [ifm.com](https://www.ifm.com/us/en/us/robotics/cameras/o3r/o3r).

:::::{grid} 1
::::{grid-item}
    :class: homepage-icons
![News icon](./resources/ifm3d_landing_news.svg) 
A new firmware version is available for the O3R platform.
Find it here: [FW 1.10.13](https://www.ifm.com/de/en/product/OVP810#documents)
::::
:::::

<!-- ------------------------------------------------- -->
<!-- This is a title, but we put it as raw html as
a hack to avoid having it display in the left bar nav. -->
:::{raw} html
    <h2> First time? </h2>
:::
Explore our unboxing and getting started guides to quickly get you up an running, and ready to develop your application.

::::{grid} 2
:::{grid-item-card}  O3R Unboxing
    :class-item: homepage-icons
    :width: 50
    :img-top: ./resources/ifm3d_landing_unboxing.svg
    :img-alt: Unboxing icon
    :link: GettingStarted/Unboxing/hw_unboxing
    :link-type: doc
    :link-alt: Link to the hardware unboxing section
+++
Learn how to wire the O3R platform

:::
:::{grid-item-card}  Getting started with ODS
    :class-item: homepage-icons
    :width: 50
    :img-top: ./resources/ifm3d_landing_ods.svg
    :link: ODS/getting_started
    :link-type: doc
    :link-alt: Link to the ODS getting started documentation
+++
Learn how to quickly setup the Obstacle Detection Solution

:::
::::

::::{grid} 2
:::{grid-item-card}  Getting started with the O3R point cloud
    :class-item: homepage-icons
    :width: 20
    :img-top: ./resources/ifm3d_landing_point-cloud.svg
    :link: SoftwareInterfaces/iVA/first_steps_ifmVA
    :link-type: doc
    :link-alt: Link to the first steps with the Vision Assistant
+++
Learn about the point cloud

:::
:::{grid-item-card}  Getting started with PDS
    :class-item: homepage-icons
    :width: 20
    :img-top: ./resources/ifm3d_landing_pds.svg
+++
Coming soon...

:::
::::

<!-- ------------------------------------------------- -->
<!-- This is a title, but we put it as raw html as
a hack to avoid having it display in the left bar nav. -->
:::{raw} html
    <h2> Jump to: </h2>
:::

::::::{grid} 2
:gutter: 4

:::::{grid} 1
:gutter: 4

::::{grid-item-card} Mounting
    :class-item: homepage-icons jump-to-cards
    :img-top: ./resources/ifm3d_landing_mounting.svg
    :link: Technology/Hardware/Mounting/index_mounting
    :link-type: doc
    :link-alt: Link to the mounting instructions
+++
Install the O3R platform on your machine
::::
::::{grid-item-card}  Calibration
    :class-item: homepage-icons jump-to-cards
    :img-top: ./resources/ifm3d_landing_calibration.svg
    :link: CalibrationRoutines/index_calibrations
    :link-type: doc
    :link-alt: Link to the calibration instructions
+++
Calibrate the position of the camera, with convenient methods in the field or in production
::::
::::{grid-item-card}  Power requirements
    :class-item: homepage-icons jump-to-cards
    :img-top: ./resources/ifm3d_landing_power-requirements.svg
    :link: Technology/Hardware/Mounting/heat_dissipation_guidelines
    :link-type: doc
    :link-alt: Link to the power requirements
+++
Properly power the system to ensure optimal performance
::::
:::::
:::::{grid} 1

::::{grid} 2
:gutter: 4

:::{grid-item-card}
    :class-item: programming-icons jump-to-cards
    :img-top: ./resources/ifm3d_landing_python.svg
    :link: https://api.ifm3d.com/stable/
    :link-type: url
    :link-alt: Link to the API documentation
Check out the ifm3dpy API and Python examples
:::
:::{grid-item-card}
    :class-item: programming-icons jump-to-cards
    :img-top: ./resources/ifm3d_landing_cpp.svg
    :link: https://api.ifm3d.com/stable/
    :link-type: url
    :link-alt: Link to the API documentation
Check out the ifm3d API and C++ examples    
:::
::::
::::{grid} 2
:::{grid-item-card}
    :class-item: programming-icons jump-to-cards
    :img-top: ./resources/ifm3d_landing_ros.svg
    :link: https://ros.ifm3d.com/
    :link-type: url
    :link-alt: Link to the ROS documentation
`ifm3d-ros` is a wrapper for using ifm's 3D cameras with ROS     
:::
:::{grid-item-card}
    :class-item: programming-icons jump-to-cards
    :img-top: ./resources/ifm3d_landing_ros2.svg
    :link: https://ros2.ifm3d.com/
    :link-type: url
    :link-alt: Link to the ROS2 documentation
`ifm3d-ros2` is a wrapper for using ifm's 3D cameras with ROS2    
:::
::::
::::{grid} 2
:::{grid-item-card} 
    :class-item: programming-icons jump-to-cards
    :img-top: ./resources/iVA-logo.svg
    :link: SoftwareInterfaces/iVA/index_iVA
    :link-type: doc
    :link-alt: Link to the ifmVisionAssistant documentation
Use the Vision Assistant for easy visualization and configuration of ifm's 3D cameras!    
:::
:::{grid-item-card} 
    :class-item: programming-icons jump-to-cards
    :img-top: ./resources/ifm3d_landing_docker.svg
    :link: SoftwareInterfaces/Docker/index_docker
    :link-type: doc
    :link-alt: Link to the Docker documentation
Take advantage of Docker to deploy your applications on board the VPU.    
:::
::::
:::::
::::::

<!-- ------------------------------------------------- -->
<!-- This is a title, but we put it as raw html as
a hack to avoid having it display in the left bar nav. -->
:::{raw} html
    <h2> Troubleshooting? </h2>
:::

Sometimes, things go wrong. 
Explore our software troubleshooting guide, where you will find how to deal with specific diagnostic messages, or look through the point cloud artifacts to understand how to get the best 3D data for your application.

::::{grid} 2
:::{grid-item-card} Software diagnostic guide
    :class-item: homepage-icons
    :img-top: ./resources/ifm3d_landing_diagnostics.svg
    :link: SoftwareInterfaces/ifmDiagnostic/index_diagnostic
    :link-type: doc
    :link-alt: Link to the software diagnostic documentation
:::
:::{grid-item-card} Common point cloud artifacts
    :class-item: homepage-icons
    :img-top: ./resources/ifm3d_landing_point-cloud-analysis.svg
    :link-type: doc
    :link-alt: Link to the point cloud artifacts documentation
Coming soon...
:::
::::
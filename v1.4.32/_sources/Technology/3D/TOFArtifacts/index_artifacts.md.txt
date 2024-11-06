---
nosearch: true
---

# Artifacts and their impacts

The O3R uses an indirect Time-of-Flight (iToF) sensor and therefore has to handle artifacts related to the physics behind this technology. These are not ifm-specific artifacts but common to all iToF systems. 

Below is a list of artifacts that you may encounter when testing the O3R platform.
For each artifact, click on the corresponding image and read out about potential mitigation strategies that you can apply to your application.

When using ODS, effective filtering is already in place to reduce the impact of these artifacts, and you can also see before/after images in each of the articles.

:::{toctree}
:maxdepth: 2
:hidden:
    Ambient light <AmbientLight/ambient_light>
    Crosstalk <Crosstalk/crosstalk>
    Dust <Dust/dust>
    Motion blur <MotionBlur/motion_blur>
    Multi-path interference <MPI/mpi>
    Stray light <StrayLight/stray_light>
:::

::::{grid} 3
:::{grid-item-card} Ambient light
:link: AmbientLight/ambient_light
:link-type: doc
![Impact of ambient light on the data](./AmbientLight/resources/ambient_light_short.gif)
:::
:::{grid-item-card} Crosstalk
:link: Crosstalk/crosstalk
:link-type: doc
![Impact of crosstalk on the data](./Crosstalk/resources/crosstalk_short.gif)
:::
:::{grid-item-card} Dust
:link: Dust/dust
:link-type: doc
![Impact of dust on the data](./Dust/resources/dust_short.gif)
:::
::::


::::{grid} 3
:::{grid-item-card} Motion blur
:link: MotionBlur/motion_blur
:link-type: doc
![Impact of motion on the data](./MotionBlur/resources/motion_blur_short.gif)
:::
:::{grid-item-card} Multi-path interference (MPI)
:link: MPI/mpi
:link-type: doc
![Impact of MPI on the data](./MPI/resources/mpi_screenshot.png)
:::
:::{grid-item-card} Stray light
:link: StrayLight/stray_light
:link-type: doc
![Impact of stray light on the data](./StrayLight/resources/stray_light_short.gif)
:::
::::
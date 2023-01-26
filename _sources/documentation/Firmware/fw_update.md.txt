# How to update the firmware

## Download the firmware
The firmware image is available on the [ifm.com](https://www.ifm.com/) website. Navigate to the site and follow the steps below:
- Create an account (if you do not already have one) and log in.
- Use the search bar to find OVP800 (VPU). This is also valid if you have a sample unit like M03975 or M04239.
- Navigate to the article page an click on the "Downloads" tab. 
- Select the firmware from the list. It will start downloading the file.


## With the web interface

1. Open [http://192.168.0.69:8080/](http://192.168.0.69:8080/) in web browser. The SWUpdate web interface is shown.
2. Drag and drop the `*.swu` firmware file into the `software update`-window. The upload procedure starts.

## With ifm3d

In the instructions below, replace `firmware_image.swu` with the name of the firmware file you downloaded from [ifm.com](https://www.ifm.com/).
We assume you are running these commands from the folders in which the `.swu` file is located.

:::::{tabs}
::::{group-tab} CLI
:::bash
$ ifm3d swupdate < firmware_image.swu
:::
::::
::::{group-tab} c++
:::cpp
TODO
:::
::::
::::{group-tab} python
:::python
from ifm3dpy import O3RCamera()
o3r = O3RCamera()
o3r.swupdate(firmware_image.swu)
:::
::::
:::::


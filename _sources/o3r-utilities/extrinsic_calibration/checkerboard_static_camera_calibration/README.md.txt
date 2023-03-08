# Checkerboard Static Camera - Calibration Routine

In this calibration routine, the camera and checkerboard can not be moved/disturbed during the calibration process. Before proceeding to perform the calibration process we assume that the user

- has already connected the camera head to the VPU.
- changed the PORT state from "CONF" to "RUN".
- is able to receive the 3D Data because this routine uses only the amplitude image/reflectivity image for the calibration.
- is not running the ifmVisionAssistant in parallel.
- knows the exact position of a robot coordinate system.

## Procedure

1. Clone the o3r-utilities repository.
   ```sh
   $ git clone https://github.com/ifm/o3r-utilities.git
   ```
2. Create a virtual environment and install the required packages (run from the extrinsic_calibration/checkerboard_static_camera_calibration folder).
    ```sh
   $ python -m venv venv                # create a virtual environment
   $ source venv/bin/activate           # activate the virtual environment
   $ pip install -r requirements.txt    # install the required python packages
   ```
3. Activate the new python venv, register it with ipykernal (used to work with virtual environments and Jupyter notebooks) and start Jupyter lab:
    ```sh
    $ source venv/bin/activate  # Activate the virtual environment
    $ pip install ipykernel # Install ipykernel to work with venv and Jupyter notebooks
    $ python -m ipykernel install --user --name=venv # Register the venv
    $ jupyter-lab # Start jupyter-lab
    ```
    ![Jupyter Lab example](_resources/jupyter_lab.png)

> Note: you can remove a venv from the list of ipykernels with `jupyter kernelspec remove venv`

4. Start the calibration process:
After setting up the scene and measuring all the distances (see section below): edit the following parameters in the second cell of the Jupyter Notebook.
    > Note: The values below are examples values: please input the values as measured for your setup.
    ```python
    if True:
        # camera and target are mounted horizontally
        # A is upper left corner in the image and also in the world
        X_AB=1.200
        Z_AB=0.565
        X_CD=1.200-0.200
        Z_CD=0
        Y_AC=0.415
        Y_BD=-0.385
    ```

4. If the camera is mounted vertically, make sure to change the value from **true** to **false** in Line 5, the second cell of the Jupyter Notebook: see the example below
    ```python
    # XYZ coordinates [m] of the ABCD points
    if True:
        # camera and target are mounted horizontally
        # A is upper left corner in the image and also in the world
        X_AB=1.200
        Z_AB=0.565
    ...
    ```
5. Edit all the measurements
6. Select your prefered data input source:
    ```python3
    source = "ifm3dpy://%s/port%d" % (ip, camPort)
    #source = "adlive://%s/port%d" % (ip, camPort)
    # it's also possible to use a recording as source:
    #source=r"adrec://C:\Projects\iCV-Algo\O3R\workspace\20210920_095332_calib2.h5"
    ```
6. Use either reflectivity or amplitude image for calibration: depending on which has a less noticeably bright spot (resulting from the active illumination of the O3R camera).
   ```python
    # by default, the amplitude image is used to detect the corner points. As an alternative, you might try to use
    # the reflectivity image instead.
    #image_selection = "reflectivity"
    image_selection = "amplitude"
    ...
    ```
7. Run the second cell and check the results. If the calibration is successful then the plots will be displayed as shown in below example figure.  

```{image} _resources/successful_calibration.png
:alt: successful_calibration.png
:width: 800
:align: center
```    
    <!-- ![successful_calibration.png](_resources/successful_calibration.png) -->
8. If the Calibration succeeded then run the fourth cell to write calibration values to the O3R system, i.e. your device.
Please **don't skip this step:** after any further steps, the old estimation results are not recoverable.


## Setting up the scene

### Requirements

- A Checkerboard of size 800 X 600 mm² is printed either directly thick aluminum sheet or printed on matte finish paper and pasted to the board. The calibration board can not move during one camera's complete calibration, due to the design of the process. Please find the checkerboard in pdf format {download}` here <_resources/checkerboard.pdf>`,
- Cardboard edges should not extend past the checkerboard dimensions as this will result in a calibration error.

### Scene

- Rest the checkerboard on a wall and make sure the checkerboard occupies the maximum field of view of the camera for the most accurate calibration.
- Move the Robot such that the Y-Axis of a Robot Coordinate System is exactly parallel to the checkerboard.

```{image} _resources/TOP_VIEW.png
:alt: top_view
:width: 400px
:align: center
```

- Tilt the board if a reflection of the illumination is seen on the camera image. You can tilt as long as the top edge is fully resting on the wall. Keep in mind that all the edges of the board still have to be visible to the camera after tilting the checkerboard.

| Good Positioning                           | Bad Positioning                          |
| ------------------------------------------ | ---------------------------------------- |
| ![Goodimage.png](_resources/Goodimage.png) | ![badimage.png](_resources/badimage.png) |

### Isometric View of the Scene
Please see this isometric view of a good scene to get a better understanding of the expected geometric configuration.  

```{image} _resources/isometric_view.png
:alt: isometric_view
:width: 400px
:align: center
```

## Required Measurements

| Camera Mounting | Checkerboard Positioning                     | Measurements                                                     |
| --------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| Horizontal      | ![Horizontal.png](_resources/Horizontal.png) | X_AB<br><br>Z_AB<br><br>X_CD<br><br>Z_CD<br><br>Y_AC<br><br>Y_BD |
| Vertical        | ![Vertical.png](_resources/Vertical.png)     | X_AC<br><br>Z_AC<br><br>X_BD<br><br>Z_BD<br><br>Y_AB<br><br>Y_CD |

**Robot Coordinate System** **(RCS)** is assumed to be a right-handed coordinate system and rests on the ground plane.

All measurements are in meters from the Robot coordinate system to the edges of the checkerboard in a cartesian coordinate system.
Rotation angle results are given in radiant.

**Measurements for the camera having an offset along the y-axis respective to the RCS:**

<font color=blue>(When the cameras are mounted on the sides of AGV)</font>


In this case, placing the checkerboard exactly in front of the AGV may not capture the whole checkerboard which is not desired and leads to calibration failure.

Therefore place a robot in such a way that the whole checkerboard is captured and also the Y-Axis of the RCS is exactly parallel to the checkerboard. The measurements along Y-Axis won't be equal and it is totally fine.

    Y_AC != Y_BD != 0.4m

The sample scene setup for a camera mounted on the right side of an AGV gives a better understanding of the above statement.


```{list-table}
:header-rows: 1
- * Robot Positioning
  * Image Captured
- * ```{image} _resources/RCS_CBCS.png
    :alt: RCS_CBCS
    :width: 400
    ```
  * ```{image} _resources/bad_view.png
    :alt: bad_view
    :width: 400
    ```
- * ```{image} _resources/good_configuration.png
    :alt: good_con
    :width: 400
    ```
  * ```{image} _resources/correct_view.png
    :alt: corr_view
    :width: 400
    ```
```

### Measurements for the above scene

```{list-table}
:header-rows: 1
- * Geometric Configuration
  * Description for Y_AC & Y_BD
- * ```{image} _resources/Measurements.png
    :alt: measurements
    :width: 500
    ```
  * Y_AC and Y_BD are both positive in this case 
    because the checkerboard is moved to the right side 
    to capture the whole checkerboard in the amplitude/reflectivity image.
```

# The checkerboard calibration target

Both calibration routines provided by ifm, the static camera calibration (SCC) and the motion camera calibration (MCC), use the same calibration target.

You can download the checkerboard in PDF format {download}` here <resources/checkerboardCalibrationTarget_600X800.pdf>`.

## Printing instructions

The checkerboard should be printed at scale, such that the printed size is:
- A page of 600 x 800 mm,
- 7x5 squares (black and white) → results in 6x4 inner corners
- Default size: square size = 0.1 m, Frame size (white border) = 0.05 m
- The larger black square is 0.15 m x 0.15 m.
- Maintain these proportions when scaling.

The checkerboard should be printed on:
- A rigid board, so that it will not bend when used,
- Matte paper, such that reflections from the camera are minimized.

## Checkerboard configuration

The checkerboard corners are names A, B, C and D. The corner with the large black square is always A, such that the corner distribution corresponds to the images below:

| Horizontal checkerboard                                                                     | Vertical checkerboard                                                                   |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| ![Corner names for horizontal checkerboard](./resources/checkerboard_horizontal.drawio.svg) | ![Corner names for vertical checkerboard](./resources/checkerboard_vertical.drawio.svg) |

In the two calibration routines, the dimensions of the checkerboard can be scaled but the proportions should be maintained. The image below represents the different parameters that can be set by the user:

![Dimensions of the various parts of the checkerboard](./resources/checkerboard_dimensions.drawio.svg)
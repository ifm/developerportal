# Calibration routines

The extrinsic camera calibration specifies where the camera head is positioned in a reference coordinate system. Several calibration routines were developed at ifm to estimate the translations and rotations of cameras and OVP respective to a user defined coordinate system.


::::::{grid} 2
:gutter: 3
:padding: 0

:::::{grid-item}
Which method to calibrate your camera?
::::{grid} 2
:gutter: 1

:::{grid-item-card}  In the field
:link: MCC/mcc_with_wizard
:link-type: doc
Check out our camera calibration in motion.
:::
:::{grid-item-card}  In production
:link: SCC/README
:link-type: doc
Check out our static camera calibration.
:::
::::
:::::

:::::{grid-item}
:padding: 0 4 0 0 

In motion application?
::::{grid-item-card}  Don't forget to calibrate the OVP.
:link-type: doc
:link: OVPCalibration/README
::::
:::::

::::::


Need a refresher?
:::{card} What is calibration, exactly?
:link: IntroToCalibrations/README
:link-type: doc
:::


:::{toctree}
:maxdepth: 1
:hidden:
Introduction to calibration <IntroToCalibrations/README>
Static Camera Calibration <SCC/README>
Motion Camera Calibration <MCC/mcc_with_wizard>
OVP8xx calibration <OVPCalibration/README>
:::
# ODS temperature tests
## Temperature test examples based on native ODS application at maximum load

A temperature test can easiest be implemented based on a native ifm ODS application instance running on the system during the testing procedure.
This reflects the expected load during operation conditions most closely.

Please be aware that this ODS application instance needs to be configured correctly, i.e. be functional and in RUN state during the temperature tests. A applications instance that has active severe or unrecoverable error codes during operation did not initialize completely and can therefore not be used to introduce the required system load on the VPU.

**Please follow this checklist to double-check for good live operation before starting your temperature tests:**
1. All camera heads are connected and live: i.e. check port LEDs
2. The VPU has fully booted:
   1. (check the system boot status via the bootup monitor tool)
   2. The ODS application instance was created and is functional, i.e. provides the ODS data output
      1. Double-check the dependent ports: camera and IMU
   3. No severe or unrecoverable active error code are present
   4. The ifm ODS application instances (i.e. all dependent camera heads) are set to 20 Hz - this introduces the most resource load on the VPU.
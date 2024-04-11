# How to use these examples
## Setup
### Get the examples

We provide a couple of the examples as web pages for you to browse, but we recommend getting the full example folder from git.

The examples are provided as part of the documentation. You can clone them with:
```bash
git clone --branch v1.0.0 https://github.com/ifm/ifm3d-examples.git
```
:::{note}
Refer to [the compatibility matrix](https://github.com/ifm/ifm3d-examples/tree/main?tab=readme-ov-file#compatibility) for the tag corresponding to your preferred version of the API.
:::

The examples for ODS can be found in the `ods` folder, in `/ovp9xx/cpp` for the c++ examples.

### Building the examples

:::{note}
In the following instructions, we assume that you have already installed [the ifm3d library](https://api.ifm3d.com/stable/).
:::

To build the examples, you can use the provided CMakeLists.txt. In the Examples folder, execute the instructions below:
```bash
mkdir build
cd build
cmake ..
cmake --build .
```

Each example (see the building blocks below) will generate an executable. Run the executable and inspect the code to get familiar with the ifm3d API usage in the context of ODS.

:::{note}
We expect that the executables will be run from the build folder, located in the Examples folder. 
If another path is used, the path to the configuration files need to be updated in the ods_config.cpp, ods_get_data.cpp and ods_demo.cpp examples.
:::

### Hardware setup

For these examples, we expect the following setup:
- The VPU is of type OVP801 or M04239 (ODS-compatible VPU),
- Two cameras heads are connected to the VPU, with the 2D ports connected to ports 0 and 1 and the 3D ports to port 2 and 3. Note we only use two cameras for the full example ods_demo.py. The individual tutorials only rely on one camera, 3D connected to port 2.
- In the full ods_demo.py example, we set a calibration for the cameras expecting port2 to face forward and port 3 to face backwards, both cameras mounted at 60 cm high. These are artificial calibrations for demonstration purposes. If the cameras are not mounted this way, the examples will still run—just keep in mind that the generated ODS values will not correspond to your physical setup.

You can use any other configuration to use these examples, but you will need to adjust the configuration files use when configuring an application. The default configuration files can be found with the examples [in the `configs` folder](https://github.com/ifm/ifm3d-examples/tree/main/ovp8xx/cpp/ods/configs).

:::{note}
Additional resources:
- For more information on how to get started with the O3R platform: [](../../GettingStarted/index_getting_started.md).
- For a general overview of ODS: [](../../ODS/index_ods.md),
- For calibration and mounting documentation: [](../../ODS/ExtrinsicCalibration/index_extrinsic_calibration.md) and [](../../ODS/Mounting/mounting.md).
:::
## Building blocks

The example files provided in this mini-library are intended to be used as teaching resources and as building block in more complex applications. The user is free to disassemble, extend, or do whatever they please with this code. All the functions needed for to work with ODS applications are part of the ifm3d library. The rest of the code is added to simplify readability, usage and error handling.
- ods_config.h and ods_config.cpp show how to get and set configurations on the O3R platform. The header files can be reused in other applications that need configurations functionalities. This example showcases the use of a JSON validator that provides verbose errors when wrong configurations are provided.
- ods_get_data.h and ods_get_data.cpp show how to properly start the data stream, implement a callback that will fill a queue with data, and retrieve data from the queue. Use the header file to make use of the data queue or of the data streamer in your application.
- diagnostic.h and diagnostic.cpp show how to retrieve diagnostic information on request or asynchronously whenever an error occurs. Monitoring the diagnostic at all times is crucial to ensure good functioning of the application. 

In ods_demo_client.cpp, we show how all these pieces can be used together to form a complete ODS application:
- We configure two applications, one for the “front” view and one for the “back” view,
- We start streaming data from the front view and display it,
- After some seconds, we switch view to use the “back” view, and display the data,
- In parallel, we display the diagnostic messages as they are received from the O3R.

:::{note}
To explore general usage of the ifm3d API, refer to the following examples: [](https://api.ifm3d.com/latest/examples/index.html)
:::

## Additional considerations

The scripts mentioned above do not take into account all that is necessary for a production application to function long term. We de not handle deployment details, for instance using docker, or specific error handling strategies, like turning off cameras if overheating or restarting the data stream if it was interrupted.
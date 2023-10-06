# How to use these examples

## Setup
### Get the examples
We provide a couple of the examples as web pages for you to browse, but we recommend getting the full example folder from git.

The examples are provided as part of the documentation. You can clone them with:
```shell
git clone https://github.com/ifm/documentation.git
```

The examples for ODS can be found in the ODS folder, in /Python for the Python examples.

### Hardware setup
For these examples, we expect the following setup:
- The VPU is of type M04239 (ODS-compatible VPU),
- Two cameras heads are connected to the VPU, with the 2D ports connected to ports 0 and 1 and the 3D ports to port 2 and 3. Note we only use two cameras for the full example `ods_demo.py`. The individual tutorials only rely on one camera, 3D connected to port 2. 
- In the full `ods_demo.py` example, we set a calibration for the cameras expecting port2 to face forward and port 3 to face backwards, both cameras mounted at 60 cm high. These are artificial calibrations for demonstration purposes. If the cameras are not mounted this way, the examples will still run--just keep in mind that the generated ODS values will not correspond to your physical setup.

You can use any other configuration to use these examples, but you will need to adjust the configuration files.

## Building blocks
The example files provided in this mini-library are intended to be used as teaching resources and as building block in more complex applications. 
The user is free to disassemble, extend, or do whatever they please with this code. All the functions needed for to work with ODS applications are part of the ifm3dpy library. The rest of the code is added to simplify readability, usage and error handling.
- `ods_config.py` shows how to get and set configurations on the O3R platform. It adds a JSON schema validation method, which provides verbose errors in cases where the provided configuration is incorrect. 
- `ods_stream.py` shows how to properly start the data stream and retrieve data from the queue. It uses the `ods_queue.py` which handles adding items to the queue, retrieving them from the queue and deserializing them into usable data.
- `diagnostic.py` shows how to retrieve diagnostic information on request or asynchronously whenever an error occurs. Monitoring the diagnostic at all times is crucial to ensure good functioning of the application.
   Note that if you run these examples using interactive Python, the asynchronous diagnostic messages might not be displayed.

In the `ods_demo.py` script, we show how all these pieces can be used together to form a complete ODS application:
- We configure two applications, one for the "front" view and one for the "back" view,
- We start streaming data from the front view and display it,
>Note that we use openCV to display images in a simple viewer. This cannot replace the far more capable tool for monitoring ODS, ifmVisionAssistant (iVA).
- Using number keys we toggle cameras to change which view ODS can see. Using arrow keys we adjust the zones which ODS checks for us.

## Additional considerations

The scripts mentioned above do not take into account all that is necessary for a production application to function long term. 
We de not handle deployment details, for instance using docker, or specific error handling strategies, like turning off cameras if overheating or restarting the data stream if it was interrupted. 

<!-- TODOO: We do provide [here an example of a deployed application](TODOINSERTLINK) that can be accessed and used as inspiration or as is. -->
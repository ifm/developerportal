
# Configuration
This document details some aspect of the configuration of the O3R, including using the JSON schema and handling persistent configurations. To learn how to use the ifm3d API to configure the O3R, refer to [the configuration "How-to" document](https://api.ifm3d.com/stable/examples/o3r/configuration/configuration.html). For a detailed list of available parameters, refer to the respective 2D or 3D section of [the Technology section](index_hardware_interfaces.md).

## "CONF"-only parameters
Some parameters require that the port or application instance is in "CONF" state to be edited. This is for example the case for the mode, or for enabling the detection of negative obstacles in an ODS application.

To verify if a parameter requires a change to "CONF," you can use the JSON schema. For example, let's see if the framerate parameter for a camera connected to port2 (in this example) requires a change to "CONF":
:::::{tabs}
::::{group-tab} Python
:::python
from ifm3dpy import O3R
o3r = O3R()
schema = o3r.get_schema()
schema["properties"]["ports"]["properties"]["port2"]["properties"]["acquisition"]["properties"]["framerate"]
>>> {'attributes': ['conf'], 'default': 10, 'description': 'Framerate of the Imager', 'maximum': 20.0, 'minimum': 10.0, 'multipleOf': 0.5, 'readOnly': False, 'type': 'number'}
:::
::::
::::{group-tab} c++
:::cpp
#include <ifm3d/device/o3r.hpp>
using namespace ifm3d::literals;
...
auto o3r = std::make_shared<ifm3d::O3R>();
auto schema = o3r->GetSchema();
std::cout << schema["/properties/ports/properties/port2/properties/acquisition/properties/framerate"_json_pointer];
>>> {"attributes":["conf"],"default":10,"description":"Framerate of the Imager","maximum":20.0,"minimum":10.0,"multipleOf":0.5,"readOnly":false,"type":"number"}
:::
::::
::::{group-tab} CLI
:::bash
$ ifm3d jsonschema | jq .properties.ports.properties.port2.properties.acquisition.properties.framerate
{
  "attributes": [
    "conf"
  ],
  "default": 10,
  "description": "Framerate of the Imager",
  "maximum": 20,
  "minimum": 10,
  "multipleOf": 0.5,
  "readOnly": false,
  "type": "number"
}
:::
::::
:::::

The `attributes` section of the parameter schema shows the "conf" keyword if the parameter requires a switch to "CONF" state to be changed. If this keyword does not appear, then the parameter can be changed on-the-fly, and the new parameter will be applied to the next frame. Keep in mind that some parameters might take a couple frames to be fully stable, for instance the temporal filter.
In the /ports section, changing a "CONF" parameter while the port is "RUN" or "IDLE" state results in an implicit state change to "CONF," the parameter change and an implicit state change back to "RUN" or "IDLE." Note that this is a slow operation and the filtering pipeline might take a couple frame to be stable (for example, the temporal filter will start from scratch).

In the /applications section, changing a "CONF" parameter while the port is in "RUN" or "IDLE" results in an exception provided to the user.
:::{warning}
For "CONF"-only application parameters, the user needs to manually switch the application state to "CONF" before requesting a parameter change.
:::

## Parameter configuration priorities

:::{note}
This section is only valid for O3R firmware >= 1.1.0.
:::

When configuring the O3R, the parameters are applied in a specific order. This is to ensure no inconsistent configuration can be applied. For instance, changing the mode changes the limits of some parameters, therefore the mode change has to be applied first.

Order of configuration:
- device: all the parameters in depth-first order
- ports (configuration of multiple ports is handled in parallel)
    - If the current state is "CONF":
        - mode
        - other parameters
        - state (if requested)
    - If the current state is "RUN" or "IDLE":
        - If the requested state is "CONF":
            - state
            - mode
            - other parameters
        - If the requested state is "RUN" or "IDLE":
            - state to "CONF" (only if some of the requested parameters require a "CONF" state to be changed)
            - mode
            - other parameters
            - state to "RUN" or "IDLE"
    - Note that port parameters can be changed subsequently by the application
- applications/classes
- applications/instances
    - If the current state is "CONF":
        - other parameters: this include port parameters
        - state
    - If the current state is "RUN" or "IDLE":
        - state
        - other parameters: this include port parameters
        - if "CONF"-only parameters are requested, an error will be triggered. The application has to be explicitly switched to "CONF" before changing these parameters.

:::{note}
All the parameters are changed in depth first order.
:::

:::{warning}
If an error is encountered during the configuration process, the parameters that have already be changed **will maintain their new configuration**. There is no rollback to the previous successful configuration when errors occur during the configuration process.
:::

## Sticky parameters

Typically, when changing a parameter that has an effect on the JSON schema, for example the `/ports/portX/mode`, `/applications/instances/appX/ports` and `/applications/instances/appX/class`, all the related parameters are reset to their default value. However, some parameters are "sticky," meaning they keep their values in these cases.

This is the case only for properties with an attribute "sticky" in the JSON schema, for example the extrinsic calibration `/portX/processing/extrinsicHeadToUser`.
For all other parameters, the settings, if different from default, have to be reapplied.

Sticky parameters are reset with a call to the `reset` function, or with a factory reset.

## Configuration delays

The `Set` command can introduce a certain amount of latency depending on the parameters configured.
The switch to "CONF" state required by some of the parameters introduces a short delay, as well as the image buffering configuration. We provide some details on these cases below.

### Buffering

The maximum number of raw images being buffered before the filtering pipeline is three. In addition to these three images, another three images maximum are buffered after the image processing pipeline, before being sent over Ethernet.
This can result in up to six images being received before the received images show the new configuration.

:::{note}
To minimize images getting buffered before being sent over Ethernet, ensure a full Gigabit Ethernet connection and ensure the client can handle the data transfer on the Ethernet communication.
:::

#### Delays due to image buffering
The worst case delay before new data is received can be calculated by the following formula:

` t = 1/FPS * nb_img_in_buffer`

This however is a worst case estimate for slow receivers and maximum buffer fill levels.
A typical delay (under regular embedded load and fast receivers) is expected to be 0 - 2 frames.

#### Flushing the buffers
The buffers are not flushed automatically when a configuration change occurs. If it is not acceptable for your application to process a couple of image with the old configuration, then you can manually ensure that all the buffers are empty before setting a new configuration:
1. Set the respective ports states to "CONF,"
2. Keep the FrameGrabber callback alive until no more new images are received,
3. Request the new parameter set,
4. Set the respective ports to "RUN" state.

#### Verify the frame's timestamps
To verify that the new frame corresponds to the new parameters, you can use the frame timestamps:
1. Get the acquisition timestamp of the last image before the parameter change request,
2. Request a new parameter set,
3. Verify the acquisition timestamps over the next 6 images: there shall be a noticeable time delay after the settings have been applied,

:::{note}
Make sure to monitor the acquisition timestamps, provided as part of the `TOF_INFO`, `RGB_INFO`, `O3R_ODS_INFO` and `O3R_ODS_OCCUPANCY_GRID` buffers, and not the reception timestamps, attached by ifm3d to the `Frame` object. Refer to the [timestamps documentation](../Technology/VPU/Timestamps/timestamps.md) for more details.
:::
### Camera streams configuration delays
#### Acquisition parameters
Configuring acquisition parameters always requires a RUN-CONF-RUN state transition, as indicated by the "CONF" flag in the JSON schema.

This means that the image acquisition is stopped before the parameter can be set to its new value. Afterwards the imager process is automatically restarted.

Some images may still be buffered by the embedded system and therefore represent the old configuration state (see [the section about buffering](#buffering)).

#### Processing parameters
Changing processing parameters only impact the image processing pipeline and can be done without the need to stop the image acquisition process: images are acquired without interruption.

The application of the new parameters is applied immediately in the image processing pipeline. The user might still receive up to three pre-configuration images due to the buffering configuration.

#### Acquisition and processing parameters
In cases where both the acquisition and processing parameters are changed, the possible outcomes can be:
1. Max 3 images with old acquisition parameter settings,
2. Max 3 images with old acquisition parameters and old processing parameter settings
being sent after the configuration change request.

### Application streams configuration delays
The application do not automatically change the state to "CONF" when a new "CONF"-only parameter is requested.
This ensures that no parameter is accidentally changed that could disrupt the functioning of the application.

To change a "CONF"-only application parameter:
1. Set the application to "CONF" state,
2. Request a new application parameter set for the application instance,
3. Set the application to "RUN" state.

Once the application state is changed back to "RUN," the internal processing application pipeline is reconfigured to use the new parameter set. This takes a finite amount of time.

On top of the small amount of time it takes for the application to be reconfigured, the user might still receive up to three pre-configuration frames due to the internal O3R buffers.

## JSON schema

A JSON schema for the current O3R configuration is available and the user can use it to check the configuration before setting it.

Third-party packages can be used in Python or c++ to validate a configuration. For example:
:::::{tabs}
::::{group-tab} Python
:::python
from ifm3dpy.device import O3R
import jsonschema
o3r = O3R()
schema = o3r.get_schema()
correct_conf = {"device":{"info":{"name": "My O3R"}}}
jsonschema.validate(conf, schema)
# No return, validation successful
incorrect_conf = {"device":{"info":{"o3r_name": "My O3R"}}}
jsonschema.validate(incorrect_conf, schema)
# Error raised during the validation
>>> Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/home/usmasslo/.local/lib/python3.8/site-packages/jsonschema/validators.py", line 934, in validate
    raise error
jsonschema.exceptions.ValidationError: Additional properties are not allowed ('o3r_name' was unexpected)
[...]
On instance['device']['info']:
    {'o3r_name': 'My O3R'}
:::
::::
::::{group-tab} C++
:::cpp
static void CheckJSONFormat(const std::string& format, const std::string& value) {
// This is necessary because "format" is a keyword both used internally by the schema
// validator and in the O3R schema.
    if (format == "ipv4") {
        std::clog << "Simulate IPV4 formatting";
    }
    else {
        throw std::logic_error("Don't know how to validate " + format);
    }
}
int
main()
{
    auto o3r = std::make_shared<ifm3d::O3R>();
    auto schema = o3r->GetSchema();
    nlohmann::json_schema::json_validator validator{ nullptr, CheckJSONFormat };
    validator.set_root_schema(nlohmann::json::parse(schema.dump(0)));
    auto correct_conf = ifm3d::json::parse(R"({"device":{"info":{"name": "My O3R"}}})");
    validator.validate(nlohmann::json::parse(correct_conf.dump(0)));
    // Validation successful: no exception raised
    auto incorrect_conf = ifm3d::json::parse(R"({"device":{"info":{"o3r_name": "My O3R"}}})");
    validator.validate(nlohmann::json::parse(incorrect_conf.dump(0)));
    // Exception raised during the validation
    return 0;
}
:::
:::bash
>>> terminate called after throwing an instance of 'std::invalid_argument'
what():  At /device/info of {"o3r_name":"My O3R"} - validation failed for additional property 'o3r_name': instance invalid as per false-schema
:::
::::
:::::

Note that the schema might change depending on some parameters (see details [below](#parameters-impacting-the-json-schema)). For example, different modes have different allowed offset values. When retrieving the schema using the ifm3d API, the schema for the current set of parameters is provided. It is therefore possible that the schema validation succeeds with the current schema, but the configuration fails because of a change in the schema due to the new configuration.
### Parameters impacting the JSON schema

The following parameters will change the JSON schema for other parameters:
- The mode: `/ports/portX/mode`,
- The application class: `/applications/instances/appX/class`,
- The application ports: `/applications/instances/appx/ports`.

## Persistent configuration

The O3R provides a way to persistently save a configuration so that the device reboots with the expected configuration: the [save_init() function in Python](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.device.O3R.html#ifm3dpy.device.O3R.save_init), or [SaveInit() in c++](https://api.ifm3d.com/stable/cpp_api/classifm3d_1_1O3R.html#a7316e073bf5625c08d7c11a70e5ce07a). It allows the user to write as persistent configuration the current configuration of the device.

If calling the `save_init` function without any argument, the exact configuration will be saved, including the sample numbers of the connected camera heads. For this reason, **we strongly recommend persistently saving only snippets of the configuration** (only available in ifm3d >= 1.4.1).

:::python
o3r.save_init(["/ports/port2/processing/extrinsicHeadToUser"])
:::

During the boot-up process the VPU compares the persistent configuration to the current hardware configuration. If there is any mismatch, for instance a camera head was replaced, the respective port will be put to ERROR state and the port LED flashes in red.
The `ERROR_BOOT_SEQUENCE_HEAD_INVALID_SERIALNUMBER` for the mismatched port will be displayed in the diagnostic.

When facing this issue, the user can  do the following:
1. As a first troubleshooting step, use the [`get_init` function](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.device.O3R.html#ifm3dpy.device.O3R.get_init) ([`GetInit()`](https://api.ifm3d.com/stable/cpp_api/classifm3d_1_1O3R.html#a0d703bc04a0d893733cbb1f5c6983d82) in c++) to assess the current persistent configuration.
1. If a configuration is saved and you want to change it, the only option currently is to perform a factory reset. This is available in all the provide software interfaces (ifm3d and the Vision Assistant) and will reset the setting to the factory settings. The only downside is that it will also erase the whole OEM user space (docker container, application code, etc).


:::{note}
The [`reset`](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.device.O3R.html#ifm3dpy.device.O3R.reset) function of the ifm3d API does not remove a persistent configuration from the device. It will only reset a specific set of the configuration to default until the next reboot.
:::

### Persistent settings without `save_init`
:::{note}
This feature was introduced in FW version 1.1.30
:::

The following settings will automatically be persistently saved on the device, without needing to call the `save_init` function:
- Network settings
- NTP settings
- SSH OEM keys
- Docker daemon registry configuration

## Factory reset

To bring back an O3R platform to factory settings, use the [`factory_reset`](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.device.O3R.html#ifm3dpy.device.O3R.factory_reset) function ([`FactoryReset()` in c++](https://api.ifm3d.com/stable/cpp_api/classifm3d_1_1O3R.html#a51c399c7672a1be536e6b1b81b5a0ddc)).

The factory reset function allows the user to preserve the network settings. This is useful to reset a device on the network without having to change one's local IP settings. Simply switch the flag to `True` in the factory reset function: `factory_reset(keep_network_settings = True)`.
# How to switch ODS applications

:::{note}
The support for multiple applications was introduced in firmware version 1.0.x.
:::

## Configuring multiple applications

An application configuration implementation should consist of the following steps:

1. Monitoring the boot-up process to validate that the O3R system is fully booted and available,
2. Deleting any apps that were previously set and saved as a persistent configuration on the device
3. Loading the desired applications configuration from file
4. Creating an `AppHandler` class instance:
   1. Creating the App Handler class instance with the knowledge off all desired app instance list
   2. Setting each single application in a sequential order via the App Handler - monitoring the application configuration
   3. (Setting a dummy extrinsic calibration for all camera heads used in at least on ODS instance - for the ODS apps to be functional)

:::{note}
Regarding step 3, splitting the application into more manageable "smaller chunks" is a good idea to keep single configuration times low and monitor each application switch more closely.
If an application instance creation fails, the system only rolls back the current configuration and not the complete configuration of all apps.
:::

:::{warning}
The ODS application requires the `transZ` extrinsic calibration parameters of dependent camera heads to be different to their default values: `transZ != 0`.
:::
<!-- TODOOOO: App switching code has to be refactored to new examples -->

> Please see the full example for a working copy of this code.
```py title="Robust application configuration"
IP = "192.168.0.69"
o3r = O3R(ip=IP)
try:
    monitor_bootup(ip=IP, o3r=o3r, stages=["device", "ports"])
    logger.debug("O3R device available")
except TimeoutError as e:
    logger.error(
        "no connection to VPU device with camera heads connected could be established"
    )
    raise e

if delete_apps.check_for_existing_app(o3r):
    delete_apps.delete_existing_app(o3r)
    logger.debug("deleted all existing apps")

ods_2app_conf = default_values.ODS_APP_SWITCH_CONFIG
with open(ods_2app_conf) as file:
    ods_config = json.load(file)

# 1. create am app Handlder object
apps_list = list(ods_config["applications"]["instances"].keys())
app_handle = AppHandler(ip=IP, o3r=o3r, app_active="", apps=apps_list)

# 2. set ODS applications: i.e. create application instances
single_apps = get_single_app_instances(ods_config)
for sg in single_apps:
    app_handle.set_ods_config(sg)
logger.debug(f'Applications available after sequential configuration:\n {app_handle.ods_config["applications"]["instances"].keys()}')

# 3. set extrinsic calibration for ODS application to be functional
for p in app_handle.get_cam_ports(ods_config):
    set_dummy_extrinsics(app_handle.o3r, port_number=p.split("port")[-1])
```


## State machine design for robust application switches

### Requirements

+ Only one active application (that is, in `RUN` state) is allowed.
+ Applications will automatically set the states of dependent data streams, for example if `app0` uses `port0, port1, port6` a state change of the application will automatically switch the states of `port0, port1, port6` as well to match the state of the application.
+ An inactive state (all applications in `CONF` state) is allowed.
+ Only data from a live application can be retrieved.

:::{warning}
Between an application switch the ODS internal visual odometry module needs an additional 5 seconds to fully settle. Only after it has fully initialized the AGV can start moving.
:::

See the example implementation here:
```py title="VO module initialization time"
def set_app_active(self, app_req: str) -> None:
    if app_req not in self.apps:
        raise ValueError("app not available")

    # set currently active app to CONF state if not equal to requested app
    if self.app_active != "" and app_req != self.app_active:
        self._set_app_state(app=self.app_active, state="CONF")
    self._set_app_state(app=app_req, state="RUN")
    self.app_active = app_req

    # additional grace period to allow the ODS applications vo module to fully initialize
    time.sleep(5)
```

### State machine states

A typical use case of multiple applications is an AGV that can drive in multiple directions.
The states are therefore:

+ `Driving forward`
+ `Driving backward`
+ `Stationary`

Any state change between the three states of the AGV should trigger a state change of the ODS applications.

There is a one-to-one relation between the AGV states and the applications states:

+ `Driving forward` == `app0 active`
+ `Driving backward` = `app1 active`
+ `Stationary` == `all apps inactive`

```py title="Application state changes"
 # 4.1. set one app active and request some data
app_handle.set_app_active(app_req="app0")
app_handle.get_data(app="app0")

# 4.2. set a different app active and request some data
app_handle.set_app_active(app_req="app1")
app_handle.get_data(app="app1")

# 5. request data from a non-active app
try:
    app_handle.get_data(app="app0")
except RuntimeError as e:
    logger.error(e)

# 6. set all apps to inactive state, i.e. to save battery power
app_handle.set_all_apps_inactive()

```


### How to switch applications

A App Handler class should automatically resolve mutually exclusive activations of multiple app instances and resolve requests to data from inactive apps.

Such an App Handler class shall has three primary methods:
+ `set_ods_config`: allow for setting multiple applications sequentially and keep track of all available applications
+ `set_app_active`: set one application to `RUN` state and resolve any other applications to `CONF` state
+ `set_all_apps_inactive`: set all application instances to `CONF` state to preserve battery power and allow for cool-off.

The additional method implemented `get_data` is an example method for how to retrieve one data set from a live application. Please be aware the the internal FrameGrabber module of the ifm3d / ifm3dpy API needs 0.5 seconds of grace period after call it's constructor to buffer data.

If this grace period is not met the user might not be abele to receive any data from this FrameGrabber class instance at all!

## Full example
> Note: the example code below was taken from the main method of the example implementation in [ods_examples/switch_application.py]

Check the full implementation as a Python3 helper class here:
```py title="Application state machine"
--8<-- "ods_examples/switch_application.py"
```
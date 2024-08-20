# Changing parameters

Every port parameter can be set manually with the ifmVisionAssistant - under `Port settings` menu. For example, the switch from `CONF` to `RUN` state.

![conf to run](resources/manual_con_run.gif)

## Short parameter overview

**This documentation does not include the description of every parameter, but rather focus on the general approach to change a parameter. For a list of settings, parameters, etc please check the documentation [here](../../Technology/3D/ProcessingParams/index_processing_params.md)**

Every port menu includes its own configuration / parameters. These parameters can be changed manually via the ifmVisionAssistant. The ifmVisionAssistant is however not considered as the main configuration tool. This role is fulfilled by the [ifm3d-library](https://api.ifm3d.com/stable/).

The ifmVisionAssistant is a tool to verify the overall system and experience certain changes live.

The parameters subgroups are automatically split equivalently to the `config.json` / parameter JSON schema  - see ifm3d-library. This means that the configuration of parameters in the ifmVisionAssistant is always up-to-date with the available parameters via the JSON parameter structure.

|Symbol|Parameters|Description|
|---|---|---|
|![general parameter](resources/general_paraemter.png)|General port parameter|General settings like mode, state|
|![acquisition parameter](resources/acquisition_parameter.png)|acquisition|Imager configuration related parameters like exposure time|
|![data parameter](resources/data_parameter.png)|data|Information about the transferred data|
|![info parameter](resources/info_parameter.png)|info|Information about the connected hardware like hardware production state.|
|![processing parameter](resources/processing_parameter.png)|processing|Parameters for post processing data. Like extrinsic calibration|

After changing a parameter, the ifmVisionAssistant will not save the configuration.

**Note: The calibrated IMU (Inertial Measurement Unit) system provides parameters at Port 6. Port 6 represents the IMU.**

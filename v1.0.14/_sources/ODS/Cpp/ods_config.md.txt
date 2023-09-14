# How to configure ODS

## A basic JSON

The configuration example uses the following JSON for a simple configuration. This configuration expects at least one Head (3D imager) at port 2.

:::{literalinclude} Examples/Configs/ods_one_head_config.json
:language: json
:::

:::{note}
`port6` is always part of the "ports" configuration. It refers to the `IMU` and is needed for the ODS algorithm to work properly.
:::

## JSON validation
This example show how to use the [nlohmann_json_schema_validator](https://github.com/pboettch/json-schema-validator.git) package to validate configurations before setting them. Validating the configuration is something that is done under-the-hood by the O3R before the configuration is set, but it does not provide a verbose error handling. The nlohmann_json_schema_validator package will tell the user exactly where the error is in the provided JSON. It also allows us to display the use of the O3R schema. 

The dependency to nlohmann_json_schema_validator is set as optional in the examples, and if the package is not found on the user's machine, the validation will be ignored. To enable the use of this package, install it following the instructions [here](https://github.com/pboettch/json-schema-validator#build-out-of-source). Note that you will also need to install or upgrade the package [nlohmann-json](https://github.com/nlohmann/json/releases) to version >=3.8, as it is used as a dependency by nlohmann_json_schema_validator.

## The configuration example

:::{literalinclude} Examples/ods_config.cpp
:caption: ods_config.cpp
:language: cpp
:::

:::{literalinclude} Examples/ods_config.h
:caption: ods_config.h
:language: cpp
:::
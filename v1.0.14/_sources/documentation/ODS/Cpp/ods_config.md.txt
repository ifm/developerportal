# How to configure ODS

## A basic json

The configuration example uses the following JSON for a simple configuration. This configuration expects at least one Head (3D imager) at port 2.

:::{literalinclude} Examples/Configs/ods_one_head_config.json
:language: json
:::

:::{note}
`port6` is always part of the "ports" configuration. It refers to the `IMU` and is needed for the ODS algorithm to work properly.
:::

## The configuration example

:::{literalinclude} Examples/ods_config.cpp
:caption: ods_config.cpp
:language: cpp
:::

:::{literalinclude} Examples/ods_config.h
:caption: ods_config.h
:language: cpp
:::
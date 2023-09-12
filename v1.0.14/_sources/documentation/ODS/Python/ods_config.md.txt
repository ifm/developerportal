# How to configure ODS

## A basic json

The configuration example uses the following `JSON` for a simple configuration. This configuration expects at least one Head (3D imager) at `port 2`.

:::{literalinclude} examples/configs/ods_one_head_config.json
:language: json
:::

:::{note}
`port6` is always part of the "ports" configuration. It refers to the `IMU` and is needed for the ODS algorithm to work properly.
:::
## The configuration example
:::{literalinclude} examples/ods_config.py
:language: python
:::


:::{tip} Resetting the application(s)
If issues with the receiving of data or changing the configuration occur, an reset of the application(s) could solve these issues.

```python
from ifm3dpy.device import O3R
o3r = O3R()
o3r.reset("/applications")
```
:::
# CUDA usage
Starting from FW 1.4.30 all 3D data is processed by default on the GPU using a CUDA based implementation.

## `useCuda` parameter

| Variable name | Short description                                                                             |
| ------------- | --------------------------------------------------------------------------------------------- |
| `useCuda`     | Defines whether to process the data on the GPU (`useCuda = true`) or CPU (`useCuda = false`). |

When `useCuda` is `True`, the distance data is computed on the GPU. This enables more camera streams and applications to be processed simultaneously on the total system - including CPU and GPU. We typically recommend to leave CUDA processing enabled.

Processing the 3D data using CUDA can be enabled or disabled within the system JSON configuration, by changing the `<value>` placeholder accordingly:
```json
{
  "ports": {
    "portX": {
      "processing": {
        "diParam": {
          "useCuda": <value>
        }
      }
    }
  }
}
```

:::{note}
+ Note that using CUDA will lead to a small increase of the RAM usage per port: see the [resource management documentation](../../../SoftwareInterfaces/Docker/resource_management.md) for more details.
+ Note that disabling `useCuda` does not automatically free up the RAM previously allocated to the CUDA processes. To free up the RAM, a reboot is necessary. Check out the [RAM usage section](#ram-usage) below.
:::

## RAM usage
The process to free up RAM should be as follows:

1. Set the `useCuda` parameter to `false` for all the desired ports. A mix and match is possible.
  ```json
  {
    "ports": {
      "portX": {
        "processing": {
          "diParam": {
            "useCuda": false
          }
        }
      }
    }
  }
  ```

  For example in Python with:

  ```python 
  o3r.set({"ports":{"portX":{"processing":{"diParam":{"useCuda":False}}}}})
  ```
  Replace the placeholder value `portX` accordingly.

2. Perform a `save_init` for these specific parameters, for example in Python with:
  ```python
  o3r.save_init(["/ports/portX/processing/diParam/useCuda"])
  ``` 
  where `portX` is the relevant port.

  If multiple camera streams need to be persistently configured to run on the CPU, all the streams and their respective parameters must be set in a single `save_init` command. Setting multiple `save_init` commands consecutively will only apply the last one.

  You can simply use the `save_init` method on the list of parameters, for example in Python with:
  ```python
  o3r.save_init(["/ports/portX/processing/diParam/useCuda", "/ports/portY/processing/diParam/useCuda"])
  ``` 
  where `portX` and `PortY` are the relevant ports.

3. Perform a reboot to release previously allocated RAM resources.
  The system will reboot with the saved configuration.


:::{note}
If the user performs a `save_init` command without providing the respective JSON pointers, the complete JSON configuration will be saved, including the complete hardware configuration. 
This means that exchanging cameras, for example, will raise an error.

To remove this persistent configuration, for example in case a camera head needs to be replaced, one has to perform a `factory_reset`.

Removing the persistent configuration is currently only via a `factory_reset` possible.
:::


## Required concurrent parameter changes

**Since `useCuda` is not a sticky parameter, changing a parameter higher in the JSON hierarchy will result in all corresponding parameters below that JSON level being reset to their defaults unless changed within the *same* set command.**
Therefore one must change the `useCuda` parameter always when changing the selected camera mode, for example `standard_range2m` to `standard_range4m` and vice versa.

For example, when changing the mode of `portX` to `standard_range2m`, change the value of `useCuda` in the same call. 
In Python, you can do this with:
```
o3r.set({"ports":{"portX":{"mode":"standard_range2m", "processing":{"diParam":{"useCuda":False}}}}})
``` 
where `portX` is the relevant port.

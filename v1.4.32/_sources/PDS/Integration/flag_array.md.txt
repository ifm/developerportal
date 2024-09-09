---
nosearch: true
---

# PDS pixel flags

Additionally to the result of a specific PDS command, the user can access the pixel flags. These flags provide additional details as to what each pixel is used for in the PDS algorithm.

The flags are defined as below:
| Bit No. | Name                | Description                      | Application |
| ------- | ------------------- | -------------------------------- | ----------- |
| 0       | `USED_FOR_DEPTH_HINT` | Used for depth hint detection    | various     |
| 1       | `ORTHO_PROJECTED`     | Used for orthographic projection | various     |
| 2       | `GP_RANSAC`           | Part of pallet's face            | `getPallet`   |
| 3       | `GT_FLOOR_PLATE`      | Part of item's floor plate       | `getItem`     |
| 4       | `VOL_CHECK`           | Pixel inside `volCheck` volume     | `volCheck`    |
| 5       | `GR_BEAM_FACE`        | Part of beam face                | `getRack`     |
| 6       | `GR_BEAM_EDGE`        | Part of beam edge                | `getRack`     |
| 7       | `GR_UPRIGHT_FACE`     | Part of upright face             | `getRack`     |
| 8       | `GR_UPRIGHT_EDGE`     | Part of upright edge             | `getRack`     |
| 9       | `GR_CLEARING_VOL`     | Pixel inside clearing volume     | `getRack`     |

## Example
To retrieve the pixel flag in Python, follow the example below. The example uses a `getPallet` command, but the pixel flags are published for every PDS command and can be accessed in the same way.

:::{literalinclude} ../Python/get_flags.py
:caption: get_flags.py
:language: python
:::
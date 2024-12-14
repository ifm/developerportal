---
nosearch: true
---

# ODS PLC App setup Guide

## O3R Hardware and Software requirements

### Hardware requirements

| Article           | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| OVP811            | Latest VPU generation with pre-installed ODS license              |
| O3R222 (AB/AC/AD) | <li>3D: 38k 224x172, 60°x45°</li> <li>2D: 1280x800, 127°x80°</li> |
| O3R225 (AB/AC/AD) | <li>3D: 38k 224x172, 105°x78°</li><li>2D: 1280x800, 127°x80°</li> |

Use 1 Gigabit/s rated hardware: cables, switches only.

### Software requirements

| Software | Version              |
| -------- | -------------------- |
| Firmware | 1.5.14 |

<!--| ifmVisionAssistant   | 2.9.x (download the latest version from [ifm.com](https://www.ifm.com/de/de/product/OVP811?tab=documents)) | -->

## PLC Hardware and Software requirements

### PLC Hardware requirements

The current function block is developed only for the following PLC's.
| Article        | Description                       |
| -------------- | --------------------------------- |
| SIEMENS S71500 | S7CPU series (cycle time < 20 ms) |

### PLC Software requirements

| Software           | Version |
| ------------------ | ------- |
| SIEMENS TIA Portal | >= V16  |

## State Machine overview

A state machine serves as an abstraction to accomplish the successful interface between ODS, PLC Applications and PLC.
![State Machine](plc_resources/state_machine.drawio.svg)

:::{note}
    If there are any diagnostics raised during the configuration / operation state, please review the [diagnostic reaction strategy documentation](../SoftwareInterfaces/ifmDiagnostic/diagnostic_reaction_strategy.md) to resolve the issues.
:::

## Prerequisites

Extrinsic calibration of the cameras and VPU is a prerequisite for setting up an ODS application. Please refer to this [document](https://ifm3d.com/latest/CalibrationRoutines/index_calibrations.html) for extrinsic calibration routines.

## Setup procedure

To setup PLC based AGV with O3R ODS (collision avoidance), follow these steps.

- [ODS PLC App setup Guide](#ods-plc-app-setup-guide)
  - [O3R Hardware and Software requirements](#o3r-hardware-and-software-requirements)
    - [Hardware requirements](#hardware-requirements)
    - [Software requirements](#software-requirements)
  - [PLC Hardware and Software requirements](#plc-hardware-and-software-requirements)
    - [PLC Hardware requirements](#plc-hardware-requirements)
    - [PLC Software requirements](#plc-software-requirements)
  - [State Machine overview](#state-machine-overview)
  - [Prerequisites](#prerequisites)
  - [Setup procedure](#setup-procedure)
    - [ODS application setup: creation and configuration](#ods-application-setup-creation-and-configuration)
    - [PLC application setup: creation and configuration](#plc-application-setup-creation-and-configuration)
      - [Configuration parameters](#configuration-parameters)
    - [PLC hardware setup: Network Topology](#plc-hardware-setup-network-topology)
    - [SIEMENS Function Block](#siemens-function-block)

### ODS application setup: creation and configuration

To create and configure the ODS application instance please refer to the [ODS section](https://ifm3d.com/latest/ODS/index_ods.html).

:::{note}

- The PLC function block is only able to configure between already existing presets of the ODS application (via PLC application). Meaning, when a preset index load is requested from the PLC to the PLC application, the PLC application will internally load the given ODS preset. If preset index is not existing, then the system will throw a asynchronous diagnostic: invalid configuration.
- Therefore, the presets of ODS application have to be configured prior to creating the PLC application.
:::

To configure the presets of an ODS application, please refer to the [presets documentation](../ODS/Presets/presets.md).

Example preset configurations for different driving scenarios can be found in [driving scenarios document](driving_scenarios.md)

### PLC application setup: creation and configuration

In ifmVisionAssistant, create the PLC application from the applications in the `Application` window by clicking on the ![add_app](../CalibrationRoutines/MCC/_resources/add_app.png) icon.

#### Configuration parameters

| **Parameter**          | **Description**                                                       |
| ---------------------- | --------------------------------------------------------------------- |
| `name`                 | To configure the custom name for the application                      |
| `state`                | The current application state. Per default, the state is set to `RUN` |
| `configuration/odsApp` | Identifier of the ODS app instance. (e.g. `app0`)                     |

<!--                   | `ports`                                                               | --------- | -->

The PLC application is per default in `RUN` state. Therefore the ODS application shall be saved to be in `RUN` state at every bootup session.

:::{note}
    The PLC embedded application sends data over TCP/IP without waiting for acknowledgement. When an additional network load introduced by the user may result in network saturations i.e. communication delays.
:::

### PLC hardware setup: Network Topology

To estabilish a successful communication between PLC and VPU, both devices must be in same subnet range. Please refer to the [Ethernet interfaces](https://ifm3d.com/latest/Technology/VPU/ethernet.html) documentation for setting up the static IP address on VPU.

:::{note}
    - Please use only `ETH0` as a main communication interface between VPU and PLC.
    - `ETH1` can be used for the debugging purposes via GUI / API.
    - Ethernet ring topologies are not supported: `ETH0` and `ETH1` must not be in same subnet range.
:::

### SIEMENS Function Block

The SIEMENS function block provided by ifm is intended to provide a interface between PLC and PLC application on VPU. There are four functions included in the function block

- Establishing a TCP connection to the PLC server of the VPU
- Monitoring the connection to the PLC server
- Receiving the ODS result data and displays at the outputs
- Sending the zone sets to be activated

![fb_layout](plc_resources/FB_layout.jpg)

**Activating a preset in the ODS**
The presets are stored in the ODS and labelled with an identifier. When the user inputs the identifier of the preset at the PresetIdx input parameter the Function Block will

    - Sends the command to activate the specified zone set when the value of the PresetId input parameter is changed
    - Sends the command to activate the specified zone set each time the connection to the PLC server of the VPU is established
    - Repeats the command periodically if it was previously rejected by the PLC server 
    - Shows in the ActivePresetSuccess output = TRUE if the command was accepted by the PLC server of the VPU
    - Shows in the ActivePresetFailed output = TRUE if the command was rejected by the PLC server of the VPU or a communication error occurred during transmission

:::{note}
    A positive acknowledgement of the command does not mean that the zone set is already active in the ODS. The configuration used to determine the zone assignment is always displayed in the ODS.ZoneConfigID output.
:::

For more details of Function Block implementation and configuration see the {download}`Function Block PDF <./function_block/ifm-OVP81x-ODS-V1-1_S7-1500_TCP_EN.pdf>`.
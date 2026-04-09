# Firmware 1.21.6 release notes

The following release note provides an overview of the features of the firmware 1.21.6.

The firmware update file for the OVP81x devices is available on [ifm.com](https://www.ifm.com).

## Compatibility

### Previous releases

The previous version is v1.20.29

### Compatible software versions

This firmware release works with the following software package versions.

| Software           | Version   |
| ------------------ | --------- |
| ifmVisionAssistant | >= 2.10.12 |
| ifm3d API          | >= 1.6.12  |

### Compatible processing platforms

:::{warning}
FW 1.21.6 does not support the OVP80x family.
**Do not update an OVP80x with this firmware. Such a FW update will fail, and the device will reboot to the previous FW version installed.**
:::

This firmware release can be applied to the following ifm video processing platforms:

| Article | Description                                                              |
| ------- | ------------------------------------------------------------------------ |
| OVP810  | Series product with TX2-NX NVIDIA board.                                 |
| OVP811  | Series product with TX2-NX NVIDIA board, including an ODS license.       |
| OVP812  | Series product with TX2-NX NVIDIA board, including a PDS license.        |
| OVP813  | Series product with TX2-NX NVIDIA board, including ODS and PDS licenses. |

### Supported camera articles

This firmware release supports the following ifm camera articles:

| Camera Article | Description                                                |
| -------------- | ---------------------------------------------------------- |
| O3R222         | 3D: 38k 224x172, 60°x45° IP54 <br> 2D: 1280x800, 127°x80°  |
| O3R225         | 3D: 38k 224x172, 105°x78° IP54 <br> 2D: 1280x800, 127°x80° |
| O3R252*        | 3D: VGA 640x480, 64°x50° IP54 <br> 2D: 1280x800, 127°x80°  |

> * `O3R252` is not supported by any embedded applications.

## Base Device

### Added

- Enhanced device security by introducing **password protection** feature, allowing users to restrict unauthorized access to critical configurations.  
  For details, refer to the [Security Overview](../../../Technology/VPU/security.md) document.
- A built-in firewall has been added to control inbound traffic. When enabled, the firewall **blocks all inbound traffic**, allowing only explicitly defined ports necessary for communication.
  - **Default behavior:** The firewall is disabled by default.
  - To enable it, set the parameter `/device/network/firewall/active` to `true` and reboot the device.
  - **Outbound traffic** remains unrestricted for both Ethernet interfaces. For more details, please refer to the [default firewall rules](../../../Technology/VPU/security.md#default-firewall-rules) section.

:::{important}

- Password protection is persisted across firmware upgrades and downgrades starting from firmware version 1.21.6 and above.
:::

## PLC Application

### Added

- Added support for the **EtherNet/IP interface** in the PLC application.  
  For setup and integration, refer to the [EtherNet/IP Documentation](../../../PLC/ethernet-ip.md).

### Known Issues

- **VGA camera heads** are currently not supported by any embedded applications.

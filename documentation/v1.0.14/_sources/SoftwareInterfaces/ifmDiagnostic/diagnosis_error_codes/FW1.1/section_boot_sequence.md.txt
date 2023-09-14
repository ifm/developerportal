

### Boot sequence

| ID | Name | Description |
|----|------|-------------|
| 101014 | ERROR_BOOT_SEQUENCE_VPU_EEPROM | VPU EEPROM content invalid |
| 101018 | ERROR_BOOT_SEQUENCE_INVALID_CONFIGURATION | Unable to construct a valid device configuration |


### TCU

| ID | Name | Description |
|----|------|-------------|
| 101000 | ERROR_BOOT_SEQUENCE_TCU_INVALID_FW | The installed TCU firmware is incompatible |

### Port connectivity

| ID | Name | Description |
|----|------|-------------|
| 101006 | ERROR_BOOT_SEQUENCE_PORT_CALIBRATION | The port calibration is invalid |
| 101007 | ERROR_BOOT_SEQUENCE_PORT_INVALID_CONFIGURATION | The init configuration does not match the port |
| 101015 | ERROR_BOOT_SEQUENCE_PORT_DUMMY_CALIBRATION | A dummy calibration is used for the port |
| 101017 | ERROR_BOOT_SEQUENCE_PORT_CONFIGURATION_TIMEOUT | The imager did not respond to the frame software |
| 101019 | ERROR_BOOT_SEQUENCE_PORT_EEPROM_OVERRIDE | A user-provided EEPROM file is used instead of the actual EEPROM |
| 101020 | ERROR_BOOT_SEQUENCE_PORT_CALIBRATION_OVERRIDE | A user-provided calibration file is used |
| 101021 | ERROR_BOOT_SEQUENCE_PORT_IDENTIFICATION | Port identification data is invalid |

### Camera head

| ID | Name | Description |
|----|------|-------------|
| 101004 | ERROR_BOOT_SEQUENCE_HEAD_INVALID_DRIVER | The appropriate driver for the connected head is not available |
| 101008 | ERROR_BOOT_SEQUENCE_HEAD_INVALID_SERIALNUMBER | The serial number of an extrinsically calibrated head does not match; please recalibrate after changing heads |
| 101016 | ERROR_BOOT_SEQUENCE_HEAD_INVALID_COMBINATION | Only 2D/2D pairing or 3D/3D pairing is allowed |

#### ICC

| ID | Name | Description |
|----|------|-------------|
| 101010 | ERROR_BOOT_SEQUENCE_HEAD_ICC_FW_CHECK | Due to incorrect ICC firmware data an ICC update is attempted |
| 101011 | ERROR_BOOT_SEQUENCE_HEAD_ICC_FW_UPDATE | The ICC firmware data is still incorrect after an ICC update |
| 101012 | ERROR_BOOT_SEQUENCE_HEAD_ICC_FW_INCOMPATIBLE | Due to an incompatible ICC firmware version an ICC update is attempted |
| 101013 | ERROR_BOOT_SEQUENCE_HEAD_ICC_FLASH | Unable to read the ICC flash |

### IMU

| ID | Name | Description |
|----|------|-------------|
| 101002 | ERROR_BOOT_SEQUENCE_IMU_INVALID_HW | The installed IMU (if any) was not recognised |
| 101003 | ERROR_BOOT_SEQUENCE_IMU_INVALID_CALIBRATION | The IMU calibration is either missing or incorrect |

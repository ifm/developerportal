# Ethernet/IP

This document outlines the Ethernet/IP data structure exchanged between the PLC application and the PLC. It also explains the structure of commands sent from the PLC to the PLC application.

## EDS File for EtherNet/IP

The EDS file for the EtherNet/IP interface can be downloaded directly from the VPU’s web interface when the device is powered.

By default, you can access it via your browser at:

[http://192.168.0.69/](http://192.168.0.69/)

:::{note}
Replace the IP address if the VPU has been configured with a different one.
:::

## Assemblies

- Assembly 100: Commands sent to the VPU.
- Assembly 101: Command responses from the VPU.
- Assembly 110: Cyclic data (ODS without polar occupancy data, PDS, and diagnostic data).
- Assembly 111: ODS polar occupancy grid.

Assembly connections are configured as follows:
- Assembly 101: listen-only or input-only
- Assembly 110: listen-only or input-only
- Assembly 111: listen-only or input-only

The following connection pairs are available, but only one can be active per PLC application (mutually exclusive):
- Assembly 100 + Assembly 101 (exclusive owner)
- Assembly 100 + Assembly 110 (exclusive owner)
- Assembly 100 + Assembly 111 (exclusive owner)

## Assembly 100

The structure of Assembly 100 is described as follows:

|byte|0-1|2-3|4-25|
|----|---|---|----|
|description|command word|ticket number |command data|

**Command word**
Only one command can be set at a time within the command word field. The available command bits are:

| **Bit** | **Description**    |
|--------:|--------------------|
| 0       | reserved           |
| 1       | reserved           |
| 2       | reserved           |
| 3       | reserved           |
| 4       | reserved           |
| 5       | reserved           |
| 6       | reserved           |
| 7       | reserved           |
| 8       | reserved           |
| 9       | ODS – Activation of the overhanging load region |
| 10      | ODS – Selection of the Zone Set             |
| 11      | ODS – Setting maximum Height                |
| 12      | PDS – GetPallet                             |
| 13      | PDS – GetItem                               |
| 14      | PDS – GetRack                               |
| 15      | PDS – VolCheck                              |

**Ticket number**
The ticket number can be in the range from 1000 to 9999 and can be used to check the result output of which command for timinig critical tasks like PDS espicially if same command is sent with different command data.

**Command data**
The content of the command data section depends on the command word and is defined in the following sections.

| Name                           | Command description                                                                                                                          | Command size | Command type |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------ |
| ODS overhanging load           | Bitmask for the overhanging load selection                                                                                                   | 2            | uint16       |
| ODS Selection of the Zone      | The index of the preset to select                                                                                                            | 2            | uint16       |
| ODS Setting the maximum height | The height in mm                                                                                                                             | 2            | uint16       |
| PDS `getPallet`                | `ApplicationId`: Position in the PDS application list of the application selected for configuration [0..1]                                   | 2            | uint16       |
|                                | `DepthHint`:  Estimated distance between pallet and calibrated coordinate system center in [millimeters]. Set to <=0 for automatic detection | 2            | int16        |
|                                | `PalletIndex`: Index of the pallet parameter set [0..9]                                                                                      | 2            | int16        |
|                                | `PalletOrder`: 0->scoreDescending, 1->zDescending, 2->zAscending, 3 ->yDescending, 4 -> yAscending                                           | 2            | int16        |
| PDS `getItem`                  | Available upon request                                                                                                                       |              |              |
| PDS `getRack`                  | `ApplicationId`:  Position in the PDS application list of the application selected for configuration [0..1]                                  | 2            | uint16       |
|                                | `HorizontalDropPosition`:  Selection of the horizontal drop setting: 0->left, 1->center, 2->right                                            | 2            | uint16       |
|                                | `VerticalDropPosition`:  Selection of the vertical drop setting: 0->interior, 1->floor                                                       | 2            | uint16       |
|                                | `DepthHint`:  Estimated distance between rack and coordinate system center in [millimeters]                                                  | 2            | uint16       |
|                                | `ZHint`:  Estimated z-coordinate of the rack shelf in [millimeters]                                                                          | 2            | uint16       |
|                                | `ClearingVolumeXMin`:  Minimum x-coordinate in [millimeters] of the volume which will be checked for obstacles                               | 2            | uint16       |
|                                | `ClearingVolumeXMax`:   Maximum x-coordinate in [millimeters] of the volume which will be checked for obstacles                              | 2            | uint16       |
|                                | `ClearingVolumeYMin`:   Minimum y-coordinate in [millimeters] of the volume which will be checked for obstacles                              | 2            | uint16       |
|                                | `ClearingVolumeYMax`:   Maximum y-coordinate in [millimeters] of the volume which will be checked for obstacles                              | 2            | uint16       |
|                                | `ClearingVolumeZMin`:   Minimum z-coordinate in [millimeters] of the volume which will be checked for obstacles                              | 2            | uint16       |
|                                | `ClearingVolumeZMax`:   Maximum z-coordinate in [millimeters] of the volume which will be checked for obstacles                              | 2            | uint16       |
| PDS `volCheck`                 | `ApplicationId`: Position in the PDS application list of the application selected for configuration [0..1]                                   | 2            | uint16       |
|                                | `VolumeXMin`:  Minimum x-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |
|                                | `VolumeXMax`:  Maximum x-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |
|                                | `VolumeYMin`:  Minimum y-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |
|                                | `VolumeYMax`:  Maximum y-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |
|                                | `VolumeZMin`:  Minimum z-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |
|                                | `VolumeZMax`:  Maximum z-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |

## Assembly 101

The device uses Assembly 101 as a back channel to the PLC. It is used to confirm the execution of a command and to report any errors that occurred during execution.

|byte|0-1|2-3|4-7|8-15|
|----|---|---|----|---|
|description| message counter|command word for mirroring  |command error codes|command response currently no responses are defined. Therefore it is reserved for future use. |

### Command Error Codes for Assembly 101

| **Name**                  | **Value** | **Description**                               |
|---------------------------|---------:|-----------------------------------------------|
| `EIP_ERROR_NO_ERROR`      | 0         | No command error                              |
| `EIP_ERROR_CMD_UNKNOWN`   | 1         | Unknown command                               |
| `EIP_ERROR_CMD_FAILED`    | 2         | Command processing was unsuccessful           |
| `EIP_ERROR_CMD_DATA_INVALID` | 3      | Invalid data given for the command            |
| `EIP_ERROR_TOO_MANY_CMDS` | 4         | Too many commands executed                    |
### General Reply to an Implemented Command

If the command is implemented, the data in the data section is valid, and no error occurs during execution, the producing assembly must be updated as follows:

- Increment the message counter by 1  
- Mirror the command bits from the consuming assembly  
- Set the command error codes to `0`  
- Fill the command response if applicable, otherwise set it to `0`

### Reply to an Implemented Command That Fails

If execution of the command results in an error, the producing assembly must contain:

- Message counter incremented by 1  
- Command bits mirrored from the consuming assembly  
- Command error code set accordingly  
- Command response section set to `0`

## Command Execution via Assemblies 100 and 101

![ass1001-100](./plc_resources/eip.drawio.svg)

- **Initialization**: All assembly buffers are set to `0` on startup.  
- **Single Command Trigger**: A single bit transition from `0 → 1` triggers the corresponding command, using the data section. The PLC needs to keep the bit set until the VPU reflects the command in the `Command word mirror` in the Assembly 101.
- **Multiple Bit Changes**: Multiple simultaneous `0 → 1` transitions are treated as an error.  
- **Command Reset**: The PLC must reset the command bit from `1 → 0` before issuing a new command. The device will reset the command mirror and increment the message counter.  
- **Client Disconnect**: If the client disconnects during the handshake process, it is aborted and all buffers are reset.  

For understanding the point above please refer to this scheme representing the command word from the assembly 100 and 101

![ass1001-100](./plc_resources/eip_ass100.drawio.svg)
- **Successful Execution**:  
  - Message counter incremented  
  - Command bits mirrored  
  - Error code set to `0`  
  - Response set if available, else `0`  
- **Execution Error**:  
  - Message counter incremented  
  - Command bits mirrored  
  - Error code set  
  - Response section set to `0`  
- **Unimplemented Command**:  
  - Treated as an error  
  - Message counter incremented  
  - Command bits mirrored  
  - Error code set  
  - Response section set to `0`

## Assembly 110

This assembly defines the cyclic data received from the PLC application. It includes ODS data and/or data from up to two PDS applications.

| **Field**                     | **Size (Bytes)** | **Type**  | **Description**                                               |
|------------------------------|------------------|-----------|---------------------------------------------------------------|
| Message counter              | 2                | `uint16`  | Message counter                      |
| Generic PLC Ethernet Result Frame | 288          |           | Generic PLC Ethernet Result, without "Polar occupancy grid" |

The Generic PLC Ethernet Result Frame is structured as follows. Each frame contains five main elements:

1. Header  
2. ODS data  
3. PDS data from PDS app 1  
4. PDS data from PDS app 2  
5. Diagnostic data
6. PLC application group severity

### Frame Fields

Starting from firmware version 1.21.6, the protocol version used for the result frame is v3.1.

<table border="1" cellspacing="0" cellpadding="5">
  <thead>
    <tr>
      <th>Field</th>
      <th>Size (Bytes)</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Protocol Version</td>
      <td>2</td>
      <td>uint16</td>
      <td>High byte: major version (incompatible across versions)  <br> Low byte: minor version (compatible within same major) <br> Actual version is 3.1</td>
    </tr>
    <tr>
      <td>Size</td>
      <td>2</td>
      <td>uint16</td>
      <td> Total size of this frame in bytes <br> Actual size 288 bytes</td>
    </tr>
    <tr>
      <td>ODS result data</td>
      <td>22 </td>
      <td>see <a href="#ods-result-data">the ODS result data description</a> </td>
      <td>For EIP, this data packet is misaligned (MessageCounter) and its internal ordering fixes the alignment.</td>
    </tr>
    <tr>
      <td>PDS result data for first PDS app</td>
      <td>48</td>
      <td>see <a href="#pds-result-data">the PDS result data description</a> </td>
      <td></td>
    </tr>
    <tr>
      <td>PDS result data for second PDS app</td>
      <td>48</td>
      <td>see <a href="#pds-result-data">the PDS result data description</a> </td>
      <td></td>
    </tr>
    <tr>
      <td>Diagnostic Counter</td>
      <td> 4 </td>
      <td> uint16[2] </td>
      <td> 2 bytes: the current diagnostic slice counting from zero. <br> 2 bytes: the total amount of diagnostic slices.</td>
    </tr>
    <tr>
      <td>Diagnostic Data</td>
      <td>160</td>
      <td>DiagData data[20]</td>
      <td>
        The rolling diagnostic information. If there is no diagnostic information, the Diagnostic slice counter is set to zero and the Diagnostic Data is filled with zeros.
        An array of 20 diagnostic data structs is available.
        <br><br>
        <strong>DiagData Struct Details:</strong><br><br>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Source</td>
              <td>uint16</td>
              <td>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>0 - 6: port0 ... port6</li>
                  <li>100 - 119: app0 ... app19</li>
                  <li>255: other</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>Severity</td>
              <td>uint8</td>
              <td>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>1: no_incident</li>
                  <li>2: info</li>
                  <li>3: minor</li>
                  <li>4: major</li>
                  <li>5: critical</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>Diagnostic ID</td>
              <td>uint32</td>
              <td>0:no diagnostic event. For Diagnostic event IDs and descriptions please refer <a href="../SoftwareInterfaces/ifmDiagnostic/diagnostic.html#error-codes-and-descriptions">this page</a>. </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>Severity</td>
      <td>2</td>
      <td>uint16</td>
      <td>
        Application diagnostic severity state of PLC app, with these possible values:<br><br>
        <ul style="margin: 0; padding-left: 20px;">
          <li>1: <code>no_incident</code></li>
          <li>2: <code>info</code></li>
          <li>3: <code>minor</code></li>
          <li>4: <code>major</code></li>
          <li>5: <code>critical</code></li>
          <li>6: <code>not available</code> (application instance not existing)</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

#### ODS result data

| Field                | Size (Bytes)             | Type                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Result age indicator | 2                        | uint16                                            | Indicates whether the ODS data was received from the ODS application (0 if received, otherwise incremented). <br> 0 if ODS data was received from the ODS applications, If no new data is present for the next PLC app frame, the value is increased, If the value reaches 255, it will not reset. It will stay at 255 until new data is received, If no previous ODS data is available, it will indicate 255.                           |
| Severity             | 2                        | uint16                                            | Application diagnotic severity state of corresponding ODS app, with these possible values: <br><br> <li>1: `no_incident`</li> <li>2: `info`</li><li>3: `minor`</li> <li>4: `major`</li> <li>5: `critical`</li><li>6: `not available` (application instance not existing)</li>                                                                                                                                                                                     |
| Zone status flags    | 6                        | uint16 [3]                                  | Zone status flags (3 UINT, 0: zone free, 1: zone occupied)                                                                                                                                                                                                                                                                                                                                                                              |
| Zone config ID       | 4                        | uint32                                            | 32-bit integer representing the zone configuration ID.                                                                                                                                                                                                                                                                                                                                                                                   |
| Time Stamp           | 8                        | uint32[2]           | Time stamp of the ODS algorithm result. VPU time (including NTP if configured).                                                                                                                                                                                                                                                                                                                                                          |

#### PDS result data

| Field                | Size (Bytes) | Type                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Result age indicator | 2            | uint16                                | Indicates whether PDS data was received from the PDS application (0 if received, otherwise incremented). <br>0 if PDS data was received from the PDS application, If no new data is present for the next PLC app frame, the value is increased, If the value reaches 255, it will not reset. It will stay at 255 until new data is received, If no previous output of PDS is available, it will indicate 255. |
| Severity             | 2            | uint16                                | Application diagnotic severity state of corresponding PDS app, with these possible values: <br><br> <li>1: `no_incident`</li> <li>2: `info`</li><li>3: `minor`</li> <li>4: `major`</li> <li>5: `critical`</li><li>6: `not available` (application instance not existing)</li>                                                                                                                                                          |
| PDS command ID       | 2            | uint16                                | The ID of the PDS command of this response data: <br>02200: get pallet, <br> 02201: get item, <br> 02202: get rack, <br> 02203: volume check.                                                                                                                                                                                                                                                                 |
| Ticket               | 2            | uint16                                | The unique ID of the command, sent back to the PLC for book keeping: <br>0: default value, the command was not issued py the PLC, <br>nonzero: PCIC ticket id for commands coming via PCIC, or of command data.                                                                                                                                                                                               |
| Timestamp            | 8            | uint64 for TCP/IP, uint32[2] for EIP  | Time stamp of the PDS algorithm result. VPU time (including NTP if configured).                                                                                                                                                                                                                                                                                                                               |
| Response             | 32           | uint8[32] for PLC, uint16[16] for EIP | The PDS Result for the given command. padded with zeros, this can be one of: <br>[Get pallet result data](#get-pallet-result-data) <br> [Get rack result data](#get-rack-result-data) <br> [Volume check result data](#volume-check-result-data). <br> For EtherNet/IP, the EDS provides a datatype unit16[16] for these values.                                                                              |

##### Get pallet result data

| Field            | Size (Bytes) | Type  | Description                                                                                                                                                                           |
| ---------------- | ------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DetectionValid` | 2            | int16 | Boolean flag: 0 indicates an invalid detection, 1 indicates valid results. The flag shall be zero if `numDetectedPallets` from the getPallet output is zero, or if an error occurred. |
| `PalletIndex`    | 2            | int16 | Index of the parameter set which was used to detect the pallet.                                                                                                                       |
| `CenterX`        | 2            | int16 | X-Coordinate of the Center Block [millimeters].                                                                                                                                       |
| `CenterY`        | 2            | int16 | Y-Coordinate of the Center Block [millimeters].                                                                                                                                       |
| `CenterZ`        | 2            | int16 | Z-Coordinate of the Center Block [millimeters].                                                                                                                                       |
| `LeftPocketX`    | 2            | int16 | X-Coordinate of the Left Pocket [millimeters].                                                                                                                                        |
| `LeftPocketY`    | 2            | int16 | Y-Coordinate of the Left Pocket [millimeters].                                                                                                                                        |
| `LeftPocketZ`    | 2            | int16 | Z-Coordinate of the Left Pocket [millimeters].                                                                                                                                        |
| `RightPocketX`   | 2            | int16 | X-Coordinate of the Right Pocket [millimeters].                                                                                                                                       |
| `RightPocketY`   | 2            | int16 | Y-Coordinate of the Right Pocket [millimeters].                                                                                                                                       |
| `RightPocketZ`   | 2            | int16 | Z-Coordinate of the Right Pocket [millimeters].                                                                                                                                       |
| `Roll`           | 2            | int16 | Pallet's rotation about the x-axis [milliradians].                                                                                                                                    |
| `Pitch`          | 2            | int16 | Pallet's rotation about the y-axis [milliradians].                                                                                                                                    |
| `Yaw`            | 2            | int16 | Pallet's rotation about the z-axis [milliradians].                                                                                                                                    |

##### Get rack result data

| Field            | Size (Bytes) | Type   | Description                                                                |
| ---------------- | ------------ | ------ | -------------------------------------------------------------------------- |
| `DetectionValid` | 2            | int16  | Boolean flag: 0 indicates an invalid detection, 1 indicates valid results. |
| `PositionX`      | 2            | int16  | X-Coordinate of the rack position [millimeters].                           |
| `PositionY`      | 2            | int16  | Y-Coordinate of the rack position [millimeters].                           |
| `PositionZ`      | 2            | int16  | Z-Coordinate of the rack position [millimeters].                           |
| `Roll`           | 2            | int16  | Rotation of the rack about the x-axis [milliradians].                      |
| `Pitch`          | 2            | int16  | Rotation of the rack about the y-axis [milliradians].                      |
| `Yaw`            | 2            | int16  | Rotation of the rack about the z-axis [milliradians].                      |
| `NumPixels`      | 4            | uint32 | Number of pixels inside the clearing volume.                               |
| `AnchoredSide`   | 2            | int16  | 0 -> left, 1 -> center (should never happen), 2 -> right.                  |
| `Flags`          | 2            | int16  | Bitmask, encoding the detection status bits (O3R-13130).                   |

##### Volume check result data

| Field       | Size (Bytes) | Type   | Description                                                                    |
| ----------- | ------------ | ------ | ------------------------------------------------------------------------------ |
| `NumPixels` | 4            | uint32 | Number of pixels inside the volume.                                            |
| `nearestX`  | 4            | int32  | Smallest x-coordinate inside the volume (derived from quantile) [millimeters]. |

## Assembly 111

The Polar Occupancy Grid Frame has a fixed size of 1400 bytes.

| **Field**                    | **Size (Bytes)** | **Type**       | **Description**                                                                 |
|-----------------------------|------------------|----------------|---------------------------------------------------------------------------------|
| Message counter             | 2                | `uint16`       | The message counter is incremented with each message sent via the producing assembly, starting from a value of 1. Once the maximum value is reached, the counter wraps around and restarts at 1.|
| Result Age Indicator        | 2                | `uint16`       |	Indicates whether data was received from the PLC application (0 if received, otherwise incremented) |
| Timestamp high              | 4                | `uint32`       | High 2 bytes of timestamp, VPU time (including NTP if configured) |
| Timestamp low               | 4                | `uint32`       | Low 2 bytes of timestamp, VPU time (including NTP if configured) |
| Severity         | 2                | `uint16`       | ODS application severity values are mapped to numeric values as follows: <br> no_incident is mapped to 1 <br> info is mapped to 2 <br> minor is mapped to 3 <br> major is mapped to 4 <br> critical is mapped to 5 <br> not_available is mapped to 6 |
| Reserved                    | 36               | `uint16[18]`   | Reserved for future status information                                         |
| Polar Occupancy Grid        | 1350             | `uint16[675]`  | Distance to nearest object in mm  Angle resolution ≈ 0.53° (360°/675). For more informations [see this documentation](../ODS/OccupancyGrid/occupancy_grid.md#polar-occupancy-grid)|
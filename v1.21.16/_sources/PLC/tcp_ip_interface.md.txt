# Communication interface

This document describes the TCP/IP data structure sent from the PLC application to the PLC, as well as the structure of the commands that can be sent from the PLC to the PLC application. 

## Data structure
The data stream between the PLC application and the PLC is formatted at follows `<ticket><Length><CR+LF><ticket><CONTENT><CR+LF>`, where `<CR+LF>` is the carriage return (CR: `\r` or `0x0D`) and line feed (LF: `\n` or `0x0A`).

### Complete Packet Structure Overview

The following diagram shows the complete TCP/IP packet structure with all layers:

```
┌─────────────────────────────────────────────────────┐
│           PCIC Protocol Wrapper (TCP/IP)            │
├─────────────────────────────────────────────────────┤
│ Ticket (request):                4 bytes (ASCII)    │
│ 'L' + Length (9 digits):        10 bytes (ASCII)    │
│ <CR+LF>:                          2 bytes (ASCII)   │ ← PCIC Header: 16 bytes (ASCII) 
├─────────────────────────────────────────────────────┤
│ Ticket (response):               4 bytes (ASCII)    │ ← Length field STARTS here
├─────────────────────────────────────────────────────┤
│              CONTENT (1694 bytes)                   │
│ ┌─────────────────────────────────────────────────┐ │
│ │ "star":                      4 bytes (ASCII)    │ │
│ │ Chunk Header:               48 bytes (binary)   │ │
│ │ PLC Frame:                1638 bytes (binary)   │ │
│ │ "stop":                      4 bytes (ASCII)    │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ <CR+LF>:                          2 bytes (ASCII)   │ ← Length field ENDS here
└─────────────────────────────────────────────────────┘
   Total: 1716 bytes
   Length field value: L000001700 (covers bytes 16-1715)
```
Total Packet Size:
• 16 (header) + 4 (ticket) + 1694 (content) + 2 (`<CR+LF>`) = 1716 bytes

Length Field Value (content from ticket through final `<CR+LF>`):
• 1700 bytes (includes ticket + `star` + Chunk + Frame + `stop` + `<CR+LF>`)

The header portion (`<ticket><Length><CR+LF>`) and the `star` and `stop` markers consist of ASCII characters, while the data between the `star` and `stop` markers (Chunk Header and PLC Frame) is binary.

### Tags

`<ticket>` is an ASCII character string containing 4 digits [0-9] interpreted as a decimal value. A message to the device is answered with the same ticket. Ticket 0000 is reserved for asynchronous messages (process data). For user-initiated commands, tickets should be in the range 1000-9999.

`<Length>` is an ASCII character string starting with an 'L' followed by 9 ASCII digits. The field is transmitted as ASCII characters (e.g., "L000001700"), but the 9 digits represent a decimal number indicating the byte count of the data that follows after the first `<CR+LF>`. For example, "L000001700" means 1700 bytes of data follow.

`<CONTENT>` is the command sent to the device, or the answer to the previously sent command. The `star` and `stop` markers are also included in the content.

### Content
The PLC application sends the data via a TCP Socket at the rate of 20 Hz (same as ODS framerate).
If there is no data received from the ODS application, then the PLC application sends the cached data, that is, the previous ODS data. 
In this case, the result age indicator is incremented by 1 for every 50 milliseconds without a new result.
The PLC application is mapped to a TCP/IP communication port (referred also as PCIC Port) and this is assigned based on application instance indicator (510xx where xx correspond to the application index).

| Field            | Size (Bytes) | Type               | Description                                                                                                                                                                   |
| ---------------- | ------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `star`           | 4            | `string` (ASCII)   | `star` refers to the "start" marker in the data                                                                                                                               |
| Chunk header     | 48           | `header` (binary)  | Serialization format of the image (matrix) data with header version 2. All information is stored in little endian format. Refer to the [chunk header section](#chunk-header). |
| PLC result frame | 1638 | `plc_result_frame` (binary) | Refer to [the PLC result frame description](#plc-result-frame-description). |
| `stop`           | 4            | `string` (ASCII)   | `stop` refers to the "stop" marker in the data.                                                                                                                               |

> **Total Content Size (`star` through `stop`):**
> - 4 + 48 + 1638 + 4 = **1694 bytes**
>
> The `<Length>` field in the PCIC header will contain the total size from the second `<ticket>` through the final `<CR+LF>`, which includes the content above plus the ticket (4 bytes) and final `<CR+LF>` (2 bytes).

#### Chunk Header Description

| Offset | Name               | Description                                                                              | Size [Byte] |
| ------ | ------------------ | ---------------------------------------------------------------------------------------- | ----------- |
| 0x0000 | `CHUNK_TYPE`       | The chunk type is `O3R_RESULT_PLC`.                                                      | 4           |
| 0x0004 | `CHUNK_SIZE`       | Size of the whole image chunk in bytes. After this count of bytes the next chunk starts. | 4           |
| 0x0008 | `HEADER_SIZE`      | Number of bytes starting from 0x0000 until the data.                                     | 4           |
| 0x000C | `HEADER_VERSION`   | Version number of the header (=2)                                                        | 4           |
| 0x0010 | `IMAGE_WIDTH`      | Size of the binary data in bytes.                                                        | 4           |
| 0x0014 | `IMAGE_HEIGTH`     | Always 1.                                                                                | 4           |
| 0x0018 | `PIXEL_FORMAT`     | Pixel format, `FORMAT_8U` in this case.                                                  | 4           |
| 0x001C | `TIME_STAMP`       | Timestamp in uS (deprecated)                                                             | 4           |
| 0x0020 | `FRAME_COUNT`      | Frame count. Increased with every frame enqueued for sending.                            | 4           |
| 0x0024 | `STATUS_CODE`      | Will always be 0.                                                                        | 4           |
| 0x0028 | `TIME_STAMP_SEC`   | Timestamp in seconds                                                                     | 4           |
| 0x002C | `TIME_STAMP_NSEC`  | Timestamp nanoseconds                                                                    | 4           |
| 0x0030 | `PLC_RESULT_FRAME` | See [PLC result frame](#plc-result-frame-description)                                    |             |

#### PLC Result frame description
From firmware version 1.21.6, the protocol version used for the result frame is v3.1.

> **Frame Size:** 1638 bytes (includes 1350-byte polar occupancy grid in ODS data)

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
      <td> Total size of this frame in bytes <br> Actual size: <strong>1638 bytes</strong> (includes 1350-byte polar occupancy grid)</td>
    </tr>
    <tr>
      <td>ODS result data</td>
      <td>1372</td>
      <td>see <a href="#ods-result-data">the ODS result data description</a> </td>
      <td>Includes 22 bytes of basic ODS fields plus 1350-byte polar occupancy grid.</td>
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
              <td>uint16</td>
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
              <td>0:no diagnostic event. For Diagnostic event IDs and descriptions please refer <a href="../SoftwareInterfaces/ifmDiagnostic/diagnostic.html#error-codes-and-descriptions">this page</a>. <br><br><strong>Note:</strong> Each DiagData struct is 8 bytes total (2+2+4 = Source+Severity+ID).</td>
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

##### ODS result data

| Field                | Size (Bytes)             | Type                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Result age indicator | 2                        | uint16                                            | Indicates whether the ODS data was received from the ODS application (0 if received, otherwise incremented). <br> 0 if ODS data was received from the ODS applications, If no new data is present for the next PLC app frame, the value is increased, If the value reaches 255, it will not reset. It will stay at 255 until new data is received, If no previous ODS data is available, it will indicate 255.                           |
| Severity             | 2                        | uint16                                            | Application diagnotic severity state of corresponding ODS app, with these possible values: <br><br> <li>1: `no_incident`</li> <li>2: `info`</li><li>3: `minor`</li> <li>4: `major`</li> <li>5: `critical`</li><li>6: `not available` (application instance not existing)</li>                                                                                                                                                                                     |
| Zone status flags    | 6                        | uint16 status[3]                                  | Zone status flags (array of 3 uint16 values = 6 bytes total, 0: zone free, 1: zone occupied)                                                                                                                                                                                                                                                                                                                                                                              |
| Zone config ID       | 4                        | uint32                                            | 32-bit integer representing the zone configuration ID.                                                                                                                                                                                                                                                                                                                                                                                   |
| Time Stamp           | 8                        | uint64           | Time stamp of the ODS algorithm result. VPU time (including NTP if configured).                                                                                                                                                                                                                                                                                                                                                          |
| Polar occupancy grid | 1350 | uint16[675] | Distance to nearest object in mm. Angle resolution ≈ 0.53° (360°/675). This 1350-byte field is included in the frame, making the total ODS data 1372 bytes (22 basic + 1350 polar grid). For more information [see this documentation](../ODS/OccupancyGrid/occupancy_grid.md#polar-occupancy-grid) |

##### PDS result data

| Field                | Size (Bytes) | Type                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Result age indicator | 2            | uint16                                | Indicates whether PDS data was received from the PDS application (0 if received, otherwise incremented). <br>0 if PDS data was received from the PDS application, If no new data is present for the next PLC app frame, the value is increased, If the value reaches 255, it will not reset. It will stay at 255 until new data is received, If no previous output of PDS is available, it will indicate 255. |
| Severity             | 2            | uint16                                | Application diagnotic severity state of corresponding PDS app, with these possible values: <br><br> <li>1: `no_incident`</li> <li>2: `info`</li><li>3: `minor`</li> <li>4: `major`</li> <li>5: `critical`</li><li>6: `not available` (application instance not existing)</li>                                                                                                                                                          |
| PDS command ID       | 2            | uint16                                | The ID of the PDS command of this response data: <br>02200: get pallet, <br> 02201: get item, <br> 02202: get rack, <br> 02203: volume check.                                                                                                                                                                                                                                                                 |
| Ticket               | 2            | uint16                                | The unique ID of the command, sent back to the PLC for book keeping: <br>0: default value, the command was not issued py the PLC, <br>nonzero: PCIC ticket id for commands coming via PCIC, or of command data.                                                                                                                                                                                               |
| Timestamp            | 8            | uint64  | Time stamp of the PDS algorithm result. VPU time (including NTP if configured).                                                                                                                                                                                                                                                                                                                               |
| Response             | 32           | uint8[32] | The PDS Result for the given command. Padded with zeros, this can be one of: <br>[Get pallet result data](#get-pallet-result-data) <br> [Get rack result data](#get-rack-result-data) <br> [Volume check result data](#volume-check-result-data).                                                                              |

###### Get pallet result data

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

###### Get rack result data

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

###### Volume check result data

| Field       | Size (Bytes) | Type   | Description                                                                    |
| ----------- | ------------ | ------ | ------------------------------------------------------------------------------ |
| `NumPixels` | 4            | uint32 | Number of pixels inside the volume.                                            |
| `nearestX`  | 4            | int32  | Smallest x-coordinate inside the volume (derived from quantile) [millimeters]. |

### Python example to simulate the PLC

To simulate the data exchange between the PLC and the PLC application, we have created two python scripts.

These scripts can be used as a base to understand the data structure of the commands that can be sent from PLC to the PLC application and unpack the data from the PLC application.

You can find these scripts in our [ifm3d-examples repository](https://github.com/ifm/ifm3d-examples/tree/main/ovp8xx/python).

## Command structure

This chapter describes the structure of the PCIC command that can be sent from the PLC to the PLC-Application to change parameters such as changing the active preset.

Similarly as the data stream between the PLC application and the PLC, the command sent from the PLC to the PLC application is formatted at follows: `<ticket><Length><CR+LF><ticket><CONTENT><CR+LF>`, where:
- `<ticket>` is an ASCII character string containing 4 digits [0-9] interpreted as a decimal value. A message to the device is answered with the same ticket. For user-initiated commands, tickets should be in the range 1000-9999.
- `<length>` is an ASCII character string starting with an 'L' followed by 9 ASCII digits. The field is transmitted as ASCII characters (e.g., "L000000022"), but the 9 digits represent a decimal number indicating the byte count of the data that follows.
- `<CONTENT>` is the command sent to the device. The `star` and `stop` markers are also included in the content.
- `<CR+LF>` is the carriage return (CR: `\r` or `0x0D`) and line feed (LF: `\n` or `0x0A`).

The header, consisting of `<ticket><Length><CR+LF>`, could look like:
```bash
1234L000000022\r\n
```
With:
- `"1234"`: the ticket, 4 ASCII characters
- `"L"`: 1 ASCII character (literal 'L')
- `"000000022"`: the length field, 9 ASCII characters representing the decimal value 22
- `"\r\n"`: 2 characters (`<CR+LF>`)

This brings the total header length to 4 (ticket) + 1 (L) + 9 (length digits) + 2 (`<CR+LF>`) = 16 ASCII characters.

**Note:** The length value "000000022" is transmitted as ASCII characters but represents the decimal number 22, indicating 22 bytes of data follow.

### Command content

The command content section, `<ticket><CONTENT><CR+LF>`, consists of: 
- `ticket`: the ticket identifier, same as in header. Must be in the range 1000-9999 (e.g., `1234`) (ASCII).
- `CONTENT`: `f<Parameter-ID><reserved><version><VALUE>`
  - `f`: Command type (ASCII character).
  - `Parameter-ID`: A 5-digit parameter ID (see [available commands](#available-commands)) (ASCII).
  - `reserved`: Fixed string `"#00000"` (ASCII).
  - `version`: Always (version 1.1) for all `f` commands (binary, hex notation: `\x01\x01`).
  - `VALUE`: Binary data in little endian. Size depends on command (binary).

> **Important:** The total message length (specified in the `<Length>` field) varies based on the command being sent. Each command has a different `VALUE` size depending on the number and types of parameters it requires. The `<Length>` field contains the size of everything from the second `<ticket>` through the final `<CR+LF>`. For example:
> - ODS commands (02100-02102): **Length = 22** (2-byte VALUE)
> - PDS getPallet (02200): **Length = 28** (8-byte VALUE)
> - PDS getRack (02202): **Length = 42** (22-byte VALUE)
> - PDS volCheck (02203): **Length = 34** (14-byte VALUE)
> 
> **Formula:** Length = 4 (ticket) + 1 (f) + 5 (parameter ID) + 6 (reserved) + 2 (version) + VALUE_SIZE + 2 (`<CR+LF>`) = 20 + VALUE_SIZE

#### Available Commands

All `f` commands use protocol version **1.1** (`\x01\x01`).

| Parameter ID | Command                | Value Size | Description                                                          |
| ------------ | ---------------------- | ---------- | -------------------------------------------------------------------- |
| **02100**    | ODS overhanging load   | 2 bytes    | Bitmask (uint16) for overhanging load selection                      |
| **02101**    | ODS Zone selection     | 2 bytes    | Preset index (uint16) to select                                      |
| **02102**    | ODS Maximum height     | 2 bytes    | Height in mm (uint16)                                                |
| **02200**    | PDS getPallet          | 8 bytes    | See [getPallet parameters](#getpallet-parameters)                    |
| **02202**    | PDS getRack            | 22 bytes   | See [getRack parameters](#getrack-parameters)                        |
| **02203**    | PDS volCheck           | 14 bytes   | See [volCheck parameters](#volcheck-parameters)                      |

##### getPallet Parameters

| Field            | Size (Bytes) | Type   | Description                                                                                                              |
| ---------------- | ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| `ApplicationId`  | 2            | uint16 | Position in the PDS application list of the application selected for configuration [0..1].                               |
| `DepthHint`      | 2            | int16  | Estimated distance between pallet and calibrated coordinate system center in [millimeters]. Set to <=0 for automatic detection. |
| `PalletIndex`    | 2            | int16  | Index of the pallet parameter set [0..9].                                                                                |
| `PalletOrder`    | 2            | int16  | 0->scoreDescending, 1->zDescending, 2->zAscending, 3->yDescending, 4->yAscending.                                       |

##### getRack Parameters

| Field                   | Size (Bytes) | Type   | Description                                                                                               |
| ----------------------- | ------------ | ------ | --------------------------------------------------------------------------------------------------------- |
| `ApplicationId`         | 2            | uint16 | Position in the PDS application list of the application selected for configuration [0..1].                |
| `HorizontalDropPosition`| 2            | uint16 | Selection of the horizontal drop setting: 0->left, 1->center, 2->right.                                  |
| `VerticalDropPosition`  | 2            | uint16 | Selection of the vertical drop setting: 0->interior, 1->floor.                                            |
| `DepthHint`             | 2            | uint16 | Estimated distance between rack and coordinate system center in [millimeters].                            |
| `ZHint`                 | 2            | uint16 | Estimated z-coordinate of the rack shelf in [millimeters].                                                |
| `ClearingVolumeXMin`    | 2            | uint16 | Minimum x-coordinate in [millimeters] of the volume which will be checked for obstacles.                  |
| `ClearingVolumeXMax`    | 2            | uint16 | Maximum x-coordinate in [millimeters] of the volume which will be checked for obstacles.                  |
| `ClearingVolumeYMin`    | 2            | uint16 | Minimum y-coordinate in [millimeters] of the volume which will be checked for obstacles.                  |
| `ClearingVolumeYMax`    | 2            | uint16 | Maximum y-coordinate in [millimeters] of the volume which will be checked for obstacles.                  |
| `ClearingVolumeZMin`    | 2            | uint16 | Minimum z-coordinate in [millimeters] of the volume which will be checked for obstacles.                  |
| `ClearingVolumeZMax`    | 2            | uint16 | Maximum z-coordinate in [millimeters] of the volume which will be checked for obstacles.                  |

##### volCheck Parameters

| Field         | Size (Bytes) | Type   | Description                                                                                  |
| ------------- | ------------ | ------ | -------------------------------------------------------------------------------------------- |
| `ApplicationId` | 2          | uint16 | Position in the PDS application list of the application selected for configuration [0..1].   |
| `VolumeXMin`  | 2            | uint16 | Minimum x-coordinate in [millimeters] of the volume which will be checked for pixels.        |
| `VolumeXMax`  | 2            | uint16 | Maximum x-coordinate in [millimeters] of the volume which will be checked for pixels.        |
| `VolumeYMin`  | 2            | uint16 | Minimum y-coordinate in [millimeters] of the volume which will be checked for pixels.        |
| `VolumeYMax`  | 2            | uint16 | Maximum y-coordinate in [millimeters] of the volume which will be checked for pixels.        |
| `VolumeZMin`  | 2            | uint16 | Minimum z-coordinate in [millimeters] of the volume which will be checked for pixels.        |
| `VolumeZMax`  | 2            | uint16 | Maximum z-coordinate in [millimeters] of the volume which will be checked for pixels.        |

#### Example 1: Setting the maximum height (ODS)

To set the maximum height to `400 mm`, the `f` command would be formatted as:
```
f02102#00000\x01\x01\x90\x01\r\n
```
With:
- `02102`: the parameter ID for "Setting the maximum height".
- `#00000`: reserved field.
- `\x01\x01`: the version number (1.1)
- `\x90\x01`: Value to set for the maximum height: `400 mm` (little endian format).

#### Example 2: Select Zone Set (ODS)

To select a zone set, the `f` command could look like:
```
f02101#00000\x01\x01\x03\x00\r\n
```

- `02101`: Parameter ID for "Selection of the zone set",
- `#00000`: Reserved field,
- `\x01\x01`: Version 1.1,
- `\x03\x00`: Preset identifier for the selected zone set (in little endian format), in this case index 3.

To activate the zone set at index 3, the full command would be:
```
1234L000000022\r\n1234f02101#00000\x01\x01\x03\x00\r\n
```
With: 
- `1234`: ticket,
- `L000000022`: message length,
- `\r\n`: carriage return and line feed,
- `1234`: ticket,
- `f`: command type,
- `02101`: parameter ID corresponding to selecting the zone set,
- `#00000`: reserved section,
- `\x01\x01`: version number, 1.1,
- `\x03\x00`: index 3
- `\r\n`: carriage return and line feed.

In this case, the message length would be:
- Header: 16 characters  
- Content (what goes in Length field): 4 (ticket) + 1 (f) + 5 (parameter ID) + 6 (reserved) + 2 (version) + 2 (VALUE) + 2 (`<CR+LF>`) = **22 characters**
- Total message: 16 (header) + 22 (content) = 38 characters

#### Example 3: Get Pallet (PDS)

To retrieve pallet-related information from the PDS system, the `f` command includes multiple values:

```
1234L000000028\r\n1234f02200#00000\x01\x01\x00\x00\xff\xff\x00\x00\x00\x00\r\n
```
with 

- `1234`: ticket.  
- `L000000028`: message length (28 characters for the content after first `<CR+LF>`).  
- `\r\n`: `<CR+LF>` (carriage return and line feed).  
- `1234`: ticket.
- `f`: command identifier.  
- `02200`: parameter ID for the PDS `getPallet` function.  
- `#00000`: reserved field.  
- `\x01\x01`: version 1.1 (all `f` commands use version 1.1).  
- `\x00\x00`: `app_id = 0` (uint16).  
- `\xff\xff`: `depth_hint = -1` (int16, little endian).  
- `\x00\x00`: `pallet_index = 0` (int16).  
- `\x00\x00`: `pallet_order = 0` (int16).  
- `\r\n`: carriage return and line feed.  

**Message length calculation:**

- Header: 16 characters  
- Content (what goes in Length field): 4 (ticket) + 1 (f) + 5 (parameter ID) + 6 (reserved) + 2 (version) + 8 (VALUE) + 2 (`<CR+LF>`) = **28 characters**
- Total message: 16 (header) + 28 (content) = 44 characters

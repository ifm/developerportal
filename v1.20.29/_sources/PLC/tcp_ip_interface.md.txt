# Communication interface

This document describes the data structure sent from the PLC application to the PLC, as well as the structure of the commands that can be sent from the PLC to the PLC application. 

## Data structure
The data stream between the PLC application and the PLC is formatted at follows `<ticket><Length>CR+LF<ticket><CONTENT>CR LF`, where `CR` is the carriage return (`\r`) and `LF` is the line feed (`\n`).

### Tags

`<ticket>` is a character string containing 4 digits [0-9] interpreted as a decimal value. A message to the device is answered with the same ticket. Ticket 0000 is reserved for asynchronous messages (process data).

`<length>` is a character string starting with an 'L' followed by 9 digits interpreted as a decimal value. The number is the length of data that follows. 

`<CONTENT>` is the command sent to the device, or the answer to the previously sent command. The `STAR` and `STOP` are also included in the content.

### Content
The PLC application sends the data via a TCP Socket at the rate of 20 Hz (same as ODS framerate). 
If there is no data received from the ODS application, then the PLC application sends the cached data, that is, the previous ODS data. 
In this case, the result age indicator is incremented by 1 for every 50 milliseconds without a new result.
The PLC application is mapped to a TCP/IP communication port (referred also as PCIC Port) and this is assigned based on application instance indicator (510xx where xx correspond to the application index).

| Field            | Size (Bytes) | Type               | Description                                                                                                                                                                   |
| ---------------- | ------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `STAR`           | 4            | `string`           | `STAR` refers to the "start" marker in the data                                                                                                                               |
| Chunk header     | 48           | `header`           | Serialization format of the image (matrix) data with header version 2. All information is stored in little endian format. Refer to the [chunk header section](#chunk-header). |
| PLC result frame | 188          | `plc_result_frame` | Refer to [the PLC result frame description](#plc-result-frame-description).                                                                                                   |
| `STOP`           | 4            | `string`           | `STOP` refers to the "stop" marker in the data.                                                                                                                               |

#### Chunk Header Description

| Offset | Name               | Description                                                                              | Size [Byte] |
| ------ | ------------------ | ---------------------------------------------------------------------------------------- | ----------- |
| 0x0000 | `CHUNK_TYPE`       | The chunk type is `O3R_RESULT_PLC`.                                                      | 4           |
| 0x0004 | `CHUNK_SIZE`       | Size of the whole image chunk in bytes. After this count of bytes the next chunk starts. | 4           |
| 0x0004 | `HEADER_SIZE`      | Number of bytes starting from 0x0000 until the data.                                     | 4           |
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
As of firmware version 1.20.29, the protocol version used for the result frame is v2.1.

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
      <td>High byte: major version (not compatible across versions) <br> Low byte: minor version(compatible within one major version)</td>
    </tr>
    <tr>
      <td>Size</td>
      <td>2</td>
      <td>uint16</td>
      <td>The size of this frame in bytes (fixed value of 1000 for version 2.1)</td>
    </tr>
    <tr>
      <td>ODS result data</td>
      <td>1372 for TCP/IP <br> 22 for EIP</td>
      <td>see <a href="#ods-result-data">the ODS result data description</a> </td>
      <td>Size and types depend on the encapsulation used (TCP/IP vs. EIP).</td>
    </tr>
    <tr>
      <td>PDS result data for first PDS app</td>
      <td>48</td>
      <td>see <a href="#pds-result-data">the PDS result data description</a> </td>
      <td>Size and types depend on the encapsulation used (TCP/IP vs. EIP).</td>
    </tr>
    <tr>
      <td>PDS result data for second PDS app</td>
      <td>48</td>
      <td>see <a href="#pds-result-data">the PDS result data description</a> </td>
      <td>Size and types depend on the encapsulation used (TCP/IP vs. EIP).</td>
    </tr>
    <tr>
      <td>Diagnostic Counter</td>
      <td> 4 </td>
      <td> uint16[2] </td>
      <td> 2 bytes: the current diagnostic slice counting from zero (max. 0 for v2.1). <br> 2 bytes: the total amount of diagnostic slices (max. 1 for v2.1).</td>
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
  </tbody>
</table>

##### ODS result data

| Field                | Size (Bytes)             | Type                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Result age indicator | 2                        | uint16                                            | Indicates whether the ODS data was received from the ODS application (0 if received, otherwise incremented). <br> 0 if ODS data was received from the ODS applications, If no new data is present for the next PLC app frame, the value is increased, If the value reaches 255, it will not reset. It will stay at 255 until new data is received, If no previous ODS data is available, it will indicate 255.                           |
| Severity             | 2                        | uint16                                            | Application diagnotic severity state, with these possible values: <br><br> <li>1: `no_incident`</li> <li>2: `info`</li><li>3: `minor`</li> <li>4: `major`</li> <li>5: `critical`</li><li>6: `not available` (application instance not existing)</li>                                                                                                                                                                                     |
| Zone status flags    | 6                        | uint16 status[3]                                  | Zone status flags (3 bytes, 0: zone free, 1: zone occupied)                                                                                                                                                                                                                                                                                                                                                                              |
| Zone config ID       | 4                        | uint32                                            | 32-bit integer representing the zone configuration ID.                                                                                                                                                                                                                                                                                                                                                                                   |
| Time Stamp           | 8                        | uint64 for TCP/IP <br>uint32[2] for EIP           | Time stamp of the ODS algorithm result. VPU time (including NTP if configured).                                                                                                                                                                                                                                                                                                                                                          |
| Polar occupancy grid | 1350 (TCP/IP) or 0 (EIP) | uint16[675] for PLC, skipped for EIP assembly 110 | A compressed version of the grid using polar coordinates. The index corresponds to the angle (index i corresponds to the angle slice i*360/675 degree to (i+1)*360/675 degree), which is defined by atan2(ry, rx). The ray direction is given by (rx, ry). The value is the distance to nearest occupied cell on the ray from the vehicle origin, given in [mm]. In case there are no occupied cells on the ray, the value 65535 is set. |

##### PDS result data

| Field                | Size (Bytes) | Type                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Result age indicator | 2            | uint16                                | Indicates whether PDS data was received from the PDS application (0 if received, otherwise incremented). <br>0 if PDS data was received from the PDS application, If no new data is present for the next PLC app frame, the value is increased, If the value reaches 255, it will not reset. It will stay at 255 until new data is received, If no previous output of PDS is available, it will indicate 255. |
| Severity             | 2            | uint16                                | Application diagnotic severity state, with these possible values: <br><br> <li>1: `no_incident`</li> <li>2: `info`</li><li>3: `minor`</li> <li>4: `major`</li> <li>5: `critical`</li><li>6: `not available` (application instance not existing)</li>                                                                                                                                                          |
| PDS command ID       | 2            | uint16                                | The ID of the PDS command of this response data: <br>02200: get pallet, <br> 02201: get item, <br> 02202: get rack, <br> 02203: volume check.                                                                                                                                                                                                                                                                 |
| Ticket               | 2            | uint16                                | The unique ID of the command, sent back to the PLC for book keeping: <br>0: default value, the command was not issued py the PLC, <br>nonzero: PCIC ticket id for commands coming via PCIC, or of command data.                                                                                                                                                                                               |
| Timestamp            | 8            | uint64 for TCP/IP, uint32[2] for EIP  | Time stamp of the PDS algorithm result. VPU time (including NTP if configured).                                                                                                                                                                                                                                                                                                                               |
| Response             | 32           | uint8[32] for PLC, uint16[16] for EIP | The PDS Result for the given command. padded with zeros, this can be one of: <br>[Get pallet result data](#get-pallet-result-data) <br> [Get rack result data](#get-rack-result-data) <br> [Volume check result data](#volume-check-result-data). <br> For EtherNet/IP, the EDS provides a datatype unit16[16] for these values.                                                                              |

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

Similarly as the data stream between the PLC application and the PLC, the command sent from the PLC to the PLC application is formatted at follows: `<ticket><Length>CR+LF<ticket><CONTENT>CR LF`, where:
- `<ticket>` is a character string containing 4 digits [0-9] interpreted as a decimal value. A message to the device is answered with the same ticket. Ticket 0000 is reserved for asynchronous messages (process data).
- `<length>` is a character string starting with an 'L' followed by 9 digits interpreted as a decimal value. The number is the length of data that follows. 
- `<CONTENT>` is the command sent to the device. The `STAR` and `STOP` are also included in the content.
- `CR` is the carriage return (`\r`) and `LF` is the line feed (`\n`).

The header, consisting of `<ticket><Length>CR+LF`, could look like:
```bash
1234L000000022\r\n
```
With:
- `"1234"`: the ticket, 4 characters
- `"L"`: 1 character
- `"000000022"`: the length, 9 characters,
- `"\r\n"`: 2 characters

This brings the total header length to 4 (ticket) + 1 (L) + 9 (length) + 2 (CR/LF), which is 16 characters.

### Command content

The command content section, `<ticket><CONTENT>CR LF`, consists of the following parts: 
- `ticket`: the ticket identifier, which is the same as in the header. It must be ≥ 1000 (e.g., `1234`).
- `CONTENT`: `f<Parameter-ID><reserved><version><VALUE>`
  - `f`: Command type (ASCII).
  - `Parameter-ID`: A 5-digit parameter ID of the parameter to be set, see [the available parameter IDs](#parameter-id-list),
  - `reserved`: Fixed value `"#00000"`.
  - `version`: the version, 2 bytes with one byte for the major version and one byte for the minor version (hexadecimal).
  - `VALUE`: the binary data in little endian for the given command. The size depends on the command (hexadecimal).

#### Parameter ID and corresponding command `VALUE`

Here is a list of available parameter ID for setting or reading values via the `f` command. The value of the command itself depends on the parameter ID. The description for the command corresponding to a specific parameter ID is also in the table below.

| Parameter ID | Name                           | Command description                                                                                                                          | Command size | Command type |
| ------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------ |
| 02100        | ODS overhanging load           | Bitmask for the overhanging load selection                                                                                                   | 2            | uint16       |
| 02101        | ODS Selection of the Zone      | The index of the preset to select                                                                                                            | 2            | uint16       |
| 02102        | ODS Setting the maximum height | The height in mm                                                                                                                             | 2            | uint16       |
| 02200        | PDS `getPallet`                | `ApplicationId`: Position in the PDS application list of the application selected for configuration [0..1]                                   | 2            | uint16       |
|              |                                | `DepthHint`: 	Estimated distance between pallet and calibrated coordinate system center in [millimeters]. Set to <=0 for automatic detection | 2            | int16        |
|              |                                | `PalletIndex`: Index of the pallet parameter set [0..9]                                                                                      | 2            | int16        |
|              |                                | `PalletOrder`:	0->scoreDescending, 1->zDescending, 2->zAscending, 3 ->yDescending, 4 -> yAscending                                           | 2            | int16        |
| 02201        | PDS `getItem`                  | Available upon request                                                                                                                       |              |              |
| 02202        | PDS `getRack`                  | `ApplicationId`: 	Position in the PDS application list of the application selected for configuration [0..1]                                  | 2            | uint16       |
|              |                                | `HorizontalDropPosition`: 	Selection of the horizontal drop setting: 0->left, 1->center, 2->right                                            | 2            | uint16       |
|              |                                | `VerticalDropPosition`: 	Selection of the vertical drop setting: 0->interior, 1->floor                                                       | 2            | uint16       |
|              |                                | `DepthHint`: 	Estimated distance between rack and coordinate system center in [millimeters]                                                  | 2            | uint16       |
|              |                                | `ZHint`: 	Estimated z-coordinate of the rack shelf in [millimeters]                                                                          | 2            | uint16       |
|              |                                | `ClearingVolumeXMin`: 	Minimum x-coordinate in [millimeters] of the volume which will be checked for obstacles                               | 2            | uint16       |
|              |                                | `ClearingVolumeXMax`:  	Maximum x-coordinate in [millimeters] of the volume which will be checked for obstacles                              | 2            | uint16       |
|              |                                | `ClearingVolumeYMin`:  	Minimum y-coordinate in [millimeters] of the volume which will be checked for obstacles                              | 2            | uint16       |
|              |                                | `ClearingVolumeYMax`:  	Maximum y-coordinate in [millimeters] of the volume which will be checked for obstacles                              | 2            | uint16       |
|              |                                | `ClearingVolumeZMin`:  	Minimum z-coordinate in [millimeters] of the volume which will be checked for obstacles                              | 2            | uint16       |
|              |                                | `ClearingVolumeZMax`:  	Maximum z-coordinate in [millimeters] of the volume which will be checked for obstacles                              | 2            | uint16       |
| 02203        | PDS `volCheck`                 | `ApplicationId`: Position in the PDS application list of the application selected for configuration [0..1]                                   | 2            | uint16       |
|              |                                | `VolumeXMin`: 	Minimum x-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |
|              |                                | `VolumeXMax`: 	Maximum x-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |
|              |                                | `VolumeYMin`: 	Minimum y-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |
|              |                                | `VolumeYMax`: 	Maximum y-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |
|              |                                | `VolumeZMin`: 	Minimum z-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |
|              |                                | `VolumeZMax`: 	Maximum z-coordinate in [millimeters] of the volume which will be checked for pixels                                          | 2            | uint16       |

#### Example 1: setting the maximum height

To set the maximum height to `400 mm`, the `f` command would be formatted as:
```
f02102#00000\x01\x01\x90\x01\r\n
```
With:
- `02102`: the parameter ID for "Setting the maximum height".
- `#00000`: reserved field.
- `\x01\x01`: the version number (1.1)
- `\x90\x01`: Value to set for the maximum height: `400 mm` (little endian format).

#### Example 2: Select Zone Set 

To select a zone set, the `f` command could look like:
```
f02101#00000\x01\x01\x03\x00\r\n
```

- `02101`: Parameter ID for "Selection of the zone set",
- `#00000`: Reserved field,
- `\x01\x01`: Version,
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
- Data: 4 (ticket) + 1 (f) + 5 (parameter ID) + 6 (reserved) + 2 (version) + 2 (index) + 2  (CR and LF) characters
- Total Length: 22 characters


---
nosearch: true
---

# PLC TCP/IP communication interface

## PLC Application -> PLC

The PLC application sends the data via TCP Socket(510xx) at the rate of 20 Hz(~ to ODS framerate). If there is no data received from ODS application then PLC application sends the cache data i.e. previous ODS result data but increments the `Result Age Indicator` by **1** for every 50 milliseconds.

The PLC application is mapped to a TCP/IP communication port (referred also as PCIC Port) and this is assigned based on application instance indicator.

| Application Instance | TCP/IP Port |
| -------------------- | ----------- |
| `app0`               | 51010       |
| `app1`               | 51011       |
| `app2`               | 51012       |
| `app<x>`             | 5101<x>     |

The PLC application output can be deserialized based on the following schema.

<table>
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
      <td>uint8 version[2]</td>
      <td>
        <ul>
          <li>1 byte major version (not compatible across versions)</li>
          <li>1 byte minor version (compatible within one major version)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Size</td>
      <td>2</td>
      <td>uint16</td>
      <td>The size of this frame in bytes (fixed value of 188 for version 1.1)</td>
    </tr>
    <tr>
      <td>ODS Result Data</td>
      <td>16</td>
      <td>uint8[16]</td>
      <td>
        <table>
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
              <td>Result Age Indicator</td>
              <td>1</td>
              <td>uint8</td>
              <td>
                <ul>
                  <p>Indicates whether ODS data was received from the ODS application (0 if received, otherwise incremented)</p>
                  <li>If no new data is present for the next PLC-App frame the value is increased till 255 and saturates. This is implemented to inform user if there is any broken communication or error in ODS cameras.</li>
                  <li>The value will stay `255` until it receives data from ODS application.</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>Zone status flags</td>
              <td>3</td>
              <td>uint8</td>
              <td>
                Zone status flags (3 bytes, 0: zone free, 1: zone occupied)
              </td>
            </tr>
            <tr>
              <td>ZoneConfigID</td>
              <td>4</td>
              <td>uint8</td>
              <td>
                32-bit integer representing the Zone Configuration ID
              </td>
            </tr>
            <tr>
              <td>Time Stamp</td>
              <td>8</td>
              <td>uint64</td>
              <td>
                Time stamp of ODS algorithm result. VPU time (including NTP if configured)
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>PDS</td>
      <td>46</td>
      <td>uint8[46]</td>
      <td>- TBD - </td>
    </tr>
    <tr>
      <td>Diagnostic Counter</td>
      <td>2</td>
      <td>uint8[2]</td>
      <td>1 byte the current diagnostic slice counting from zero (max. 0 for v1.1) 1 byte the total amount of diagnostics slices (max. 1 for v1.1)</td>
    </tr>
    <tr>
      <td>Diagnostic Data</td>
      <td>120</td>
      <td>DiagData data[20]</td>
      <td>The rolling diagnostic information, in case there is no diagnostic information the Diagnostic slice counter is set to zero and the diagnostic Data is filled with zeros. There is an array of 20 diagnostic data structs available.
      <p>The Diagnostic data (DiagData) is a struct of:</p>
        <ul>
          <li>Source: uint8
            <ul>
              <li>0,...,6: port0, .... port6</li>
              <li>100,...119: app0, .... app19</li>
              <li>255: other</li>
            </ul>
          </li>
          <li>Active: uint8 contains 1 in case of an active diagnostic</li>
          <li>Diagnostic ID: uint32</li>
        </ul>
    </tr>
  </tbody>
</table>

:::{note}
  The PLC application will send the data at 20Hz (~ODS framerate). If the ODS application is set to `IDLE` state then PLC application will send the cached ODS data i.e. the previously received data.
:::

## PLC -> PLC Application

To configure the presets of ODS application, a PCIC command has to be sent to the PLC application on VPU and in ifm O3R ecosystem this command is referred as `f-command`.

The `f-command` includes the following information:
- `Parameter-ID` : A fixed 5 decimal ASCII padded with `0`. The ID to set presets of ODS application is **`02101`**
- `reserved` : fixed value **`#00000`**
- `Data` : The data must be constructed in the following format.

| Field             | Size(Bytes) | Type             | Description                                                                                                                          |
| ----------------- | ----------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Version           | 2           | uint8 version[2] | <li> 1 byte major version (not compatible across versions).</li> <li>1 byte minor version (compatible within one major version)</li> |
| Preset identifier Data | 2           | uint16[]         | The data in multiples of uint16 in Little-Endian format                                                                              |

**For example, to load the preset identifier `3` then the command looks like `f02101#00000\x01\x01\x03\x00`**

## Switching Delays

The delays in switching the presets of ODS application and reflecting in the PLC application results are dependent on the preset configuration. Please refer to the [preset documentation under load parameter](../ODS/Presets/presets.md).
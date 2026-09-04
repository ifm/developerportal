# Function Block

The current function block is developed only for the following PLC.

| Article        | Description                       | Software          |
| -------------- | --------------------------------- | ----------------- |
| SIEMENS S71500 | S7CPU series (cycle time < 20 ms) | TIA Portal >= V16 |

The SIEMENS function block provided by ifm is intended to provide a interface between the PLC and the PLC application on the VPU. There are four functions included in the function block!
- Establishing a TCP connection to the PLC application of the VPU,
- Monitoring the connection to the PLC application,
- Receiving the ODS and PDS result data and displaying the outputs,
- Sending commands to configure ODS or to trigger PDS.


For more details of function block implementation and configuration see the {download}`function block PDF  <ifm-OVP81x-ProtV2_S7-1500_TCP EN.pdf>`.
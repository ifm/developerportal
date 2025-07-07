# PLC application

The PLC application developed by ifm is a freely available application included in firmware versions 1.20.29 and above.

The purpose of the PLC application is to simplify the data exchange between an ifm embedded application such as ODS and PDS and a programmable logic controller (PLC).

Communication from PLC to VPU allows basic operations and the ability to configure the system according to a dictionary of presets. 
Presets are pre-configured sets of zones and active cameras based on different driving scenarios.
The VPU can be then treated as a server for querying app data from the PLC, and for switching the active preset, depending on the context.

The image below illustrates the communication between the ODS application, PLC application, and the PLC device.

![PLC app to PLC communication](./plc_resources/plc_vpu_comms.drawio.svg)

:::{toctree}
    :maxdepth: 2
Setup guide <setup_guide>
TCP/IP communication interface <tcp_ip_interface>
Ethernet/IP <ethernet-ip>
Function block <function_block/index_fb>
Example driving scenarios <driving_scenarios>
:::
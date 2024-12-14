---
nosearch: true
---

# PLC application

The PLC application developed by ifm is an embedded additional application included in firmware version `>= 1.5.11`.
The purpose of the PLC application is to simplify the data exchange between and configuration between an ifm embedded application such as ODS <!-- and PDS --> on the VPU and a programmable logic controller (PLC).

The PLC application allows for efficient and fast data transfer of application output and ensures seamless operation within the O3R ecosystem. The PLC application functions as a server with PLC acting as a client.

The system of embedded solution app (ODS/PDS) and PLC app is designed a multi part system.
The configuration, meaning presets of the ODS application are configured in the respective solution app itself. In addition the PLC app acts as a intermediate communication partner for "reshaping" the output data to be PLC compatible and providing PLC friendly configuration interfaces.

The user can configure different zones / zone-sets and the active cameras based for different driving scenarios via their respective preset.
Please take a closer look at the figures below for a better understanding of the interoperability between the ifm PLC application (and solution application) with a PLC.

![PLC  app -> PLC](plc_resources/plc_app-plc_image.drawio.svg)

:::{toctree}
    :maxdepth: 2
Setup guide<setup_guide>
TCP/IP communication interface<tcp_ip_interface>
Function block<function_block/index_fb>
:::
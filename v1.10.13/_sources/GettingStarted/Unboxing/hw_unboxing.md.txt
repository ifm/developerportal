# Hardware unboxing

Check out our wiring video:
:::{youtube} msPANzaOuSY
:::

If you prefer to read, here are the steps to wire an O3R platform.
You need the following hardware from ifm:
- One or several camera heads (O3R222 or O3R225 for example),
![HEAD](./resources/head.jpg "O3R - HEAD")
- An OVP8xx (for example the OVP810), 
![VPU](./resources/vpu.jpg "O3R - VPU")
- One FAKRA cable for each camera head.

You also need:
- A strong enough power source: 3.5A and 24V minimum,
- An Ethernet cable.

Then, follow the instructions below:
1. First, connect the heads to the VPU; the only requirement is to connect pairs of same imager types together, for instance as shown below:  
   ![CONNECTION-OVERVIEW](./resources/connection_overview.png "Connections")  
2. Connect power to the VPU, the pins are defined as follows:
   - 1 screen
   - 2 24 V
   - 3 GND
   - 4 CAN +
   - 5 CAN -
3. Connect the Ethernet cable,
4. Once all the connected cameras LEDs are green, the VPU is properly booted up.  

That's it!

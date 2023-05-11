
# Diagnostic retrieval
**How to get diagnostics data**

Diagnostic information can be monitored using a selection of tools.
The diagnostic information can be simultaneously retrieved using different tools: iVA, API, ...

## ifm Vision Assistant: Receiving diagnostic data
Diagnosis information can be monitored via the ifm Vision Assistant (iVA) since version 2.6.
For an explanation on how to get this information see the documentation on the [main website](https://ifm3d.com/documentation/GettingStarted/ifmVisionAssistant/device_and_diagnosis_data.html).

## ifm3d / ifm3dpy: Receiving diagnostic data

The `ifm3d / ifm3dpy` library provide functions to pull diagnostic data directly from the device.

For ifm3d 1.1.0 and above, it is possible to retrieve the diagnosis information as follows:
:::::{tabs}
::::{group-tab} Python
:::python
from ifm3dpy.device import O3R
o3r = O3R()
o3r.get_diagnostic()
:::
::::
::::{group-tab} c++
:::cpp
#include <ifm3d/device/o3r.h>
auto o3r = std::make_shared<ifm3d::O3R>();
auto diag = o3r->GetDiagnostic();
:::
::::
::::{group-tab} CLI
:::bash
ifm3d diagnostic
:::
::::
:::::

Diagnostic information can be monitored via two separate ways inside the API:
1. Via polling the complete diagnostic information JSON: via RPC
2. Via listening asynchronously for diagnostic changes: via PCIC

Option 1 gives the full set of information, while option 2 only gives the user the changes.

For option 1 see the O3R module related methods: [`get_diagnostic`](https://api.ifm3d.com/html/_autosummary/ifm3dpy.O3R.html?highlight=diagnostic#ifm3dpy.O3R.get_diagnostic) and [`get_diagnostic_filtered`](https://api.ifm3d.com/html/_autosummary/ifm3dpy.O3R.html?highlight=diagnostic#ifm3dpy.O3R.get_diagnostic_filtered).

For option 2 see the framegrabber related methods: [`on_aync_error`](https://api.ifm3d.com/html/_autosummary/ifm3dpy.FrameGrabber.html#ifm3dpy.FrameGrabber.on_async_error) and [`on_async_notification`](https://api.ifm3d.com/html/_autosummary/ifm3dpy.FrameGrabber.html#ifm3dpy.FrameGrabber.on_async_notification).

## additional debugging information

When experiencing software bugs or crashes, providing the output of the systemD `journalctl` command is useful for debugging. Save it with the following commands:
```bash
$ ssh oem@192.168.0.69
o3r-vpu-c0:~$ journalctl > log.txt
```

Alternatively one can retrieve this information via the APIs CLI:
```sh
$ ifm3d trace

Usage:
  ifm3d [<global options>] trace [<trace options>]

 global options:
  -h, --help             Produce this help message and exit
      --ip arg           IP address of the sensor (default: 192.168.0.69)
      --xmlrpc-port arg  XMLRPC port of the sensor (default: 80)
      --password arg     Password for establishing an edit-session with the
                         sensor (default: )

 trace options:
  -l, --limit arg  Limit the amount of trace log messages printed. (default:
                   100)
```

Attach these logs to the issue created on GitLab for the specific issue.

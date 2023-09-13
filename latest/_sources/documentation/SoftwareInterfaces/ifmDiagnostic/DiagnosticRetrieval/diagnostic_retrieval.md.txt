
# Diagnostic retrieval

The diagnostic information can be simultaneously retrieved using different tools: iVA, ifm3d API, etc.

## With the ifm Vision Assistant
Diagnosis information can be monitored via the ifm Vision Assistant (iVA) since version 2.6.
For an explanation on how to get this information see [the iVA documentation](../../iVA/device_and_diagnosis_data.md).

## With ifm3d or ifm3dpy

The `ifm3d / ifm3dpy` library provide functions to pull diagnostic data directly from the device.

Diagnostic information can be monitored via two separate ways inside the API:
1. Via polling the complete diagnostic information JSON
2. Via listening asynchronously for diagnostic changes

Option 1 gives the full set of information, or a filtered subset as specified by the user:
:::::{tabs}
::::{group-tab} Python
:::python
from ifm3dpy.device import O3R
o3r = O3R()
o3r.get_diagnostic()
o3r.get_diagnostic_filtered({"state":"active"})
:::
::::
::::{group-tab} c++
:::cpp
#include <ifm3d/device/o3r.h>
auto o3r = std::make_shared<ifm3d::O3R>();
auto diag = o3r->GetDiagnostic();
auto diag = o3r->GetDiagnosticFiltered(ifm3d::JSON::parse("{\"state\":\"active\"}"));
:::
::::
::::{group-tab} CLI
:::bash
ifm3d diagnostic
:::
::::
:::::

:::{note}
See the `O3R` related methods: [`get_diagnostic`](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.device.O3R.html#ifm3dpy.device.O3R.get_diagnostic) and [`get_diagnostic_filtered`](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.device.O3R.html#ifm3dpy.device.O3R.get_diagnostic_filtered).
:::

Option 2 provides diagnostic updates asynchronously as they occur. For this purpose, a dedicated PCIC port (50009) is available.

:::::{tabs}
::::{group-tab} Python
:::python
from ifm3dpy.device import O3R
from ifm3dpy.framegrabber import FrameGrabber
o3r = O3R()
fg = FrameGrabber(o3r, 50009)
fg.on_async_error(lambda id, JSON: print(f"Got error {id} with content: {JSON}"))
fg.start([])

:::
::::
::::{group-tab} c++
:::cpp
#include <iostream>
#include <chrono>
#include <thread>
#include <ifm3d/device/o3r.h>
#include <ifm3d/fg.h>

using namespace ifm3d::literals;

void AsyncDiagCallback(int id, const std::string &message){
    std::cout << "Error id: " << id << std::endl
              << "Message: " << message
              << std::endl;
}
int
main()
{

  // Declare the device object (one object only, corresponding to the VPU)
  auto o3r = std::make_shared<ifm3d::O3R>();
  auto fg = std::make_shared<ifm3d::FrameGrabber>(o3r, 50009);
  fg->OnAsyncError(&AsyncDiagCallback);
  fg->Start({});
  std::this_thread::sleep_for (std::chrono::seconds(10));
  return 0;
}
:::
::::
:::::

:::{note} 
See the `framegrabber` related methods: [`on_aync_error`](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.framegrabber.FrameGrabber.html#ifm3dpy.framegrabber.FrameGrabber.on_async_error) and [`on_async_notification`](https://api.ifm3d.com/stable/_autosummary/ifm3dpy.framegrabber.FrameGrabber.html#ifm3dpy.framegrabber.FrameGrabber.on_async_notification).
:::

## Additional debugging information

When experiencing software bugs or crashes, providing the output of the systemD `journalctl` command is useful for debugging. Save it with the following commands:
```bash
$ ssh oem@192.168.0.69
o3r-vpu-c0:~$ journalctl > log.txt
```

Alternatively one can retrieve this information via the API's CLI:
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

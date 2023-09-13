# ifmVisionAssistant on Linux

All stable versions of ifmVisonAssistant are natively compatible with Windows OS if not marked otherwise.

A stable version of ifmVisionAssistant for Linux OS and will be released soon.
As a workaround until the ifmVisionAssistant will be released for Linux Debian based systems, use Wine("Wine is Not an Emulator") to "emulate" ifmVisionAssistant.

Wine("Wine is Not an Emulator")  is a compatibility layer capable of running Windows applications on several POSIX-compliant operating systems, such as Linux, macOS, & BSD. Instead of simulating internal Windows logic like a virtual machine or emulator, Wine translates Windows API calls into POSIX calls on the fly, eliminating the performance and memory penalties of other methods and allowing you to cleanly integrate Windows applications into your desktop.

Please follow the installation instructions documented on the [Wine website](https://wiki.winehq.org/Ubuntu)

To check the installation of wine execute the following command:

```bash
$wine --version
```

**Optional: Configuring Wine to resembles Windows 10**

By default, the wine configuration resembles Windows 7 environment. The user can configure
```bash
$wine winecfg
```

We suggest as an optional step to change your Wine configuration to resemble a Windows 10 environment.

## ifmVisionAssistant

1. Download the latest ifmVisionAssistant from the [official ifm website](https://www.ifm.com/de/en/product/OVP800?tab=documents)
2. Extract the downloaded zip file
3. Navigate to the folder where the ifmVisionAssistant files are extracted
4. Execute the following command in a bash terminal to launch the ifmVisionAssistant application.

```bash
$sudo wine ifmVisionAssistant.exe
```

![wine_iVA.gif](resources/wine_iVA.gif)


*Most Wine related warnings can be ignored*

### ifmVisionAssistant logging
If you experience any unexpected GUI related issues please launch the ifmVisionAssistant application with the additional flag `log`.

```bash
$wine ifmVisionAssistant.exe -log

This prints the output to STD OUT and also generates an additional log files in your .wine directory under `/home/raxxxx/.wine/dosdevices/c:/users/rasheed/AppData/Roaming/ifm electronic/ifmVisionAssistant/logs`.
Please include those logs when reporting any issues.

### Known limitations:
+ Sensor search might be limited depending on your machine and network broadcast settings.
+ Saving and loading files from your hard drive may only be possible the wine instance has been started with elevated rights - `sudo`.
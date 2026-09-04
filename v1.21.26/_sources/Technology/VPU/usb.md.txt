# USB

The OVP8xx VPU devices have two separate USB interfaces:
1. USB Type A USB 3 interface
2. USB Type B USB 2 interface

Only the USB-A interface is available to the user. The USB-B interface is only used for debugging by ifm users.

## USB mass storage devices
The USB Typ A interface can be used by the developer or end user to connect USB mass storage devices such as USB sticks and external USB SSD devices.

The following file system formats are supported for the external storage devices mentioned above:
+ FAT32 - For FAT32 formatted devices no additional steps are required. It can be directly mounted via the auto-mount daemon to the VPU.
+ EXT4  - For EXT4 formatted devices the user needs to perform additional steps to match the OEM users UID and GID on the VPU’s embedded OS. Otherwise only read permissions are granted when mounting the USB storage device.

See options about [format to EXT4 ](#format-usb-mounting-preparation-ext4-only)

Other USB mass storage devices that require additional drivers may function if the drivers are installed within the respective Docker containers. ifm does not provide official support for these devices, and they may be used in development or production at the user's own risk. Compatibility limitations could arise from updates to the embedded firmware of the VPU, which may require driver updates in the user’s software containers. Continuous compatibility across embedded firmware versions is not guaranteed.

It is possible to increase the VPU memory size by utilizing USB thumb drives or USB SSDs on the USB-A interface. To use any USB storage device, it is necessary to mount the drive first.

:::{note}
The USB auto mount service mounts your USB mass storage device to `/run/media/system/<USB_name>/`. See the details [here](#plug-in-and-mounting)
:::

## USB Cameras

Starting with firmware version 1.4.30, USB cameras will be assigned to the `/dev/video0` node by the VPU. Only USB cameras using the default `v4l2` framework on the Linux kernel, such as webcams, have been tested. Note that users cannot directly access **V4L** devices or the `/dev/video0` node on the VPU without using a Docker container. To access these nodes, pass the respective video device node to the Docker container with the `--device` flag. If the USB camera requires special drivers, installation and testing in a Docker container is recommended.

**Example: How to use USB web camera on VPU using Docker container**
- Install `ffmpeg` and `v4l-utils` in the Docker container by copying the following lines in your Dockerfile:

```docker
RUN apt-get update && \
    apt-get install -y ffmpeg \
    v4l-utils
```

- Run the Docker container in the interactive mode
```shell
$ docker run -ti -v $(pwd):/home/ifm/ --device=/dev/video0:/dev/video0:rwm <docker-image-name>
```

- Capture a frame using `ffmpeg` tool inside Docker container that will create an image **out.png** in the home folder

```shell
root@<docker_id>$ ffmpeg -f v4l2 -video_size 1280x720 -i /dev/video0 -frames 1 out.jpg
```

## USB hubs

Compatibility and support for USB hubs are not guaranteed, and their use is at your own risk. Standard low-power devices may function properly; however, devices with higher power consumption could exceed the power limits of the USB-A interface, potentially causing damage to the OVP8xx VPU device.

Advanced "USB network topologies" may not be supported by the OVP8xx VPU devices. The USB interface is defined to be used by a single USB client device.

## Other USB devices: USB HID, USB network adapters, ...

Devices like mice, keyboards and generic USB input devices such as controllers, may function (fully or partially) if their respective drivers are either included by default in the embedded Linux OS or installed within an appropriate Docker container. However, compatibility and support for external hardware devices are not guaranteed.

However, access to external HID USB devices such as USB mice, keyboards, controllers, etc. may be restricted based on OEM `oem user groups`.
The OEM user is not part of the `dialout` group and is therefore restricted on its interactions with such HID and further USB devices. Adding the OEM user to other groups is not possible.
If such access is required, please get in contact with the ifm robotics support team.

The OEM users groups are:
```bash
$ groups oem
oem docker systemd-journal
```
Not supported device are:

+ USB-to-Ethernet adapters
+ Generic USB sensors

## Format USB mounting preparation (EXT4 only)

**Option 1:**

"Access for all users, potentially insecure approach"

The simplest approach is to mount the EXT4-formatted device on your Linux laptop and adjust the read and write permissions to allow access for any user:
1. Mount the SSD to your laptop
2. Change the mount point to be accessible by all users:
```bash
user@laptop:~$ chmod 777 /media/<mount_point>
```
Please be aware that the `chmod` command only affects the existing files within `/media/<mount_point>`.


**Option 2:**

"Setting the VPU's OEM user UID and GID specifically"

Please note that setting user-specific GID and UID must be done **per** user. This means you’ll need to configure it for the OEM user on the VPU to write to the device, as well as for any specific users created inside your Docker container.

An example workflow for setting the UID and GID of the VPU's OEM user is shown below.

1. On the VPU: Find out the requested users UID and GID on the VPU or inside the Docker container
    ```bash
    oem@o3r-vpu-c0:~# id -u oem
    989
    oemt@o3r-vpu-c0:~# id -g oem
    987
    ```

2. On your Linux laptop: Change the USB mount point on your **Linux Laptop** via `chown`
    ```bash
    user@laptop:~$ sudo chown 989:987 -R /media/<mount_point>
    ```

:::{note}
Please note that changing the GID and UID for mount points may result in read access issues for the USB storage device on your laptop. To restore read access, reset the GID and UID to match the values of your personal user account.
:::

### Plug in and mounting

After plugging in the drive, the mount is started by using the command `mount`

```bash
o3r-vpu-c0:~$ mount
proc on /proc type proc (rw,relatime)
none on /dev type devtmpfs (rw,relatime,size=1578060k,nr_inodes=394515,mode=755)
sysfs on /sys type sysfs (rw,relatime)
/dev/mmcblk0p1 on / type ext4 (rw,relatime,data=ordered)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)
devpts on /dev/pts type devpts (rw,relatime,gid=5,mode=620,ptmxmode=666)
tmpfs on /run type tmpfs (rw,nosuid,nodev,mode=755)
tmpfs on /sys/fs/cgroup type tmpfs (ro,nosuid,nodev,noexec,mode=755)
cgroup2 on /sys/fs/cgroup/unified type cgroup2 (rw,nosuid,nodev,noexec,relatime)
cgroup on /sys/fs/cgroup/systemd type cgroup (rw,nosuid,nodev,noexec,relatime,xattr,name=systemd)
pstore on /sys/fs/pstore type pstore (rw,nosuid,nodev,noexec,relatime)
cgroup on /sys/fs/cgroup/pids type cgroup (rw,nosuid,nodev,noexec,relatime,pids)
cgroup on /sys/fs/cgroup/net_cls,net_prio type cgroup (rw,nosuid,nodev,noexec,relatime,net_cls,net_prio)
cgroup on /sys/fs/cgroup/cpuset type cgroup (rw,nosuid,nodev,noexec,relatime,cpuset)
cgroup on /sys/fs/cgroup/freezer type cgroup (rw,nosuid,nodev,noexec,relatime,freezer)
cgroup on /sys/fs/cgroup/memory type cgroup (rw,nosuid,nodev,noexec,relatime,memory)
cgroup on /sys/fs/cgroup/cpu,cpuacct type cgroup (rw,nosuid,nodev,noexec,relatime,cpu,cpuacct)
cgroup on /sys/fs/cgroup/debug type cgroup (rw,nosuid,nodev,noexec,relatime,debug)
cgroup on /sys/fs/cgroup/hugetlb type cgroup (rw,nosuid,nodev,noexec,relatime,hugetlb)
cgroup on /sys/fs/cgroup/blkio type cgroup (rw,nosuid,nodev,noexec,relatime,blkio)
cgroup on /sys/fs/cgroup/devices type cgroup (rw,nosuid,nodev,noexec,relatime,devices)
cgroup on /sys/fs/cgroup/perf_event type cgroup (rw,nosuid,nodev,noexec,relatime,perf_event)
mqueue on /dev/mqueue type mqueue (rw,nosuid,nodev,noexec,relatime)
hugetlbfs on /dev/hugepages type hugetlbfs (rw,relatime)
debugfs on /sys/kernel/debug type debugfs (rw,nosuid,nodev,noexec,relatime)
tmpfs on /tmp type tmpfs (rw,nosuid,nodev)
configfs on /sys/kernel/config type configfs (rw,nosuid,nodev,noexec,relatime)
tmpfs on /var/volatile type tmpfs (rw,relatime)
/dev/mmcblk0p33 on /opt/ifm/data type ext4 (rw,relatime,data=ordered)
overlay on /etc/systemd/network type overlay (rw,relatime,lowerdir=/etc/systemd/network,upperdir=/opt/ifm/data/overlayfs/upper/network,workdir=/opt/ifm/data/overlayfs/work/network)
tmpfs on /run/user/989 type tmpfs (rw,nosuid,nodev,relatime,size=392056k,mode=700,uid=989,gid=987)
systemd-1 on /run/media/system/IFM type autofs (rw,relatime,fd=79,pgrp=1,timeout=3,minproto=5,maxproto=5,direct)
```

If the mount is successful you can find the drive at `/run/media/system/<USB_name>/`.

```bash
o3r-vpu-c0:~$ ls -la /run/media/system/IFM/
total 957660
drwxrwxrwx 6 oem  oem       4096 Jan  1  1970 .
drwxrwxrwx 3 root root        60 Feb  7 15:54 ..
...
```
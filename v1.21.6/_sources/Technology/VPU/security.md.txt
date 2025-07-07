# Security overview

## Introduction

To enhance the security of the VPU, from the firmware versions 1.21.6 and above a new feature of password protection and sealing capability is introduced. This feature allows users to lock specific configuration parameters against modification, supporting improved system integrity and controlled access to devices in the field.

This functionality is particularly valuable in distributed or production environments where maintaining a predictable and secure system state is critical.

## Feature Overview

The password protection feature enables authentication-based control over modifications to critical configuration settings. This is essential for securing devices in the field and ensuring configuration integrity before and after deployment.

- **SSH Access Control**
  - Path: `/device/network/authorized_keys`
  - Prevents unauthorized SSH access by locking the list of authorized public keys.
  - Ensures only approved credentials can be used to access the VPU.
  - Useful for enforcing deployment consistency and securing access before devices are deployed in the field.

- **Network Firewall Rules**
  - Paths:
    - `/device/network/firewall/active`
    - `/device/network/eth0/firewall/userPorts`
    - `/device/network/eth1/firewall/userPorts`
  - **Default behavior:** 
    - The firewall is disabled by default. To enable it, set `/device/network/firewall/active` to `true` and reboot the device.
  - If firewall is enabled, it restricts which ports can accept inbound traffic on primary (ETH0) and secondary (ETH1) Ethernet interfaces.
  - If firewall is enabled, it ensures that only explicitly allowed services remain accessible, reducing the attack surface.
       
:::{note}

- Password protection applies to the parameters for which the schema includes the `sealed` attribute. As of firmware **1.21.6**, only the parameters listed above are password protected.
- After modifying firewall settings, you must reboot the device for changes to become active. Save your work before initiating the restart.
- Once a password is set, changes to protected parameters are only possible with the correct password. For more information, please refer to the [changing password protected parameters](#changing-password-protected-parameters) section.
- The password protected parameters can still be read normally but can be written only when correct password is provided.
- When a password is set, the protection persists across reboots and firmware upgrades/downgrades. However, if the device is downgraded to a firmware version prior to **1.21.6**, the password protection feature will not be enforced —posing a potential security risk.
:::

### Default Firewall rules

#### Primary Ethernet interface `ETH0`

For the primary ethernet interface, **all inbound traffic is blocked by default**, except for the following ports.

| Port Range       | Protocol | Description                                                                 |
|------------------|----------|-----------------------------------------------------------------------------|
| 80               | TCP      | HTTP port for XML-RPC communication                                         |
| 44818            | TCP      | EtherNet/IP TCP (only allowed if EtherNet/IP is activated)                  |
| 50009            | TCP      | PCIC diagnostic port                                                        |
| 50010–50016      | TCP      | PCIC ports for imagers                                                      |
| 51010–51029      | TCP      | PCIC ports for applications                                                 |
| 2222             | UDP      | EtherNet/IP UDP (only allowed if EtherNet/IP is activated)                  |
| 3321             | UDP      | Discovery                                                                   |
| 5353             | UDP      | mDNS (Multicast DNS for local network service discovery)                    |

:::{note}
    All ports under `1024` are reserved for system and not able to be configured. For example, port 22 is reserved for SSH and is not user-configurable.
:::

#### Secondary Ethernet interface `ETH1`

For the secondary Ethernet interface, **all inbound traffic is blocked by default**, except for the following ports:

| Port Range       | Protocol | Description                                                                 |
|------------------|----------|-----------------------------------------------------------------------------|
| 80               | TCP      | HTTP port for XML-RPC communication                                         |
| 50009            | TCP      | PCIC diagnostic port                                                        |
| 50010–50016      | TCP      | PCIC ports for imagers                                                      |
| 51010–51029      | TCP      | PCIC ports for applications                                                 |
| 3321             | UDP      | Discovery                                                                   |
| 5353             | UDP      | mDNS (Multicast DNS for local network service discovery)                    |

:::{important}
Outbound traffic shall be allowed for both ethernet interfaces, all ports are open.
:::

## Usage

This section provides step-by-step guidance on using the password protection and sealing capabilities.

### Prerequisites

- OVP81x VPU with firmware version ≥ 1.21.6
- Access to the device via the ifm3d API (Python/C++)
- SSH public key (if sealing authorized_keys)
- Appropriate user permissions

### Password management

A password must be set before configurations can be sealed. Passwords are used to lock and unlock access to protected fields.

There are no guidelines to select the the passwords but please chose the strong passwords as there is no current brute-force lockout. A proper password management is essential.

:::{note}
    Support for managing passwords via the CLI was introduced in ifm3d API version 1.6.12 and later. Ensure you are using this version or newer to access this functionality.
:::

:::::{tabs}
::::{group-tab} Python
```python

from ifm3dpy.device import O3R

IP_ADDRESS = "192.168.0.69"
o3r = O3R(ip=IP_ADDRESS)
sealed_box = o3r.sealed_box()

## Setting a new password
sealed_box.set_password(new_password="Colloportus", old_password=None)
print("Password set successfully")

## Changing the password
sealed_box.set_password(new_password="ProtegoMaxima2025", old_password="Colloportus")
print("Password changed successfully")

## Remove the password
sealed_box.remove_password(password="ProtegoMaxima2025")
print("Password removed successfully")

```
::::
::::{group-tab} c++
```cpp
#include <ifm3d/device/o3r.h>
#include <ifm3d/device/err.h>
#include <fstream>
#include <iostream>
#include <string>
#include <stdexcept>

using namespace ifm3d;
int main()
{
    try
    {   
        const std::string IP_ADDRESS = "192.168.0.69";
        auto o3r = std::make_shared<ifm3d::O3R>(IP_ADDRESS);
        // Access the SealedBox API
        auto sealed_box = o3r->SealedBox();

        // Set new password
        const std::string password = "Colloportus"; // Example password
        sealed_box->SetPassword(password);
        std::cout << "Password set successfully" << std::endl;

        // Change the password
        const std::string new_password = "ProtegoMaxima2025"; // Example password
        sealed_box->SetPassword(new_password, password);
        std::cout << "Password changed successfully" << std::endl;

        // Remove the password

        sealed_box->RemovePassword(new_password);
        std::cout << "Password removed successfully" << std::endl;
    }
    catch (const ifm3d::Error& err)
    {
        std::cerr << "Error setting password: " << err.what() << std::endl;
        return -1;
    }
}
```
::::
::::{group-tab} CLI
```bash
ifm3d ovp8xx sealedbox isPasswordProtected # To check if device is password protected
```

```bash
ifm3d ovp8xx sealedbox setPassword --new-password Colloportus # To set a new password
```

```bash
ifm3d ovp8xx sealedbox setPassword --new-password ProtegoMaxima2025 # To change a password enter the current password when prompted
Old Password:
```

```bash
ifm3d ovp8xx sealedbox removePassword # To remove password
```
::::
:::::

### Password management mechanism

The VPU implements a secure, modern password protection system using public-key cryptography based on [libsodium's SealedBox](https://libsodium.gitbook.io/doc/public-key_cryptography/sealed_boxes) construction. This ensures passwords are protected both in transit and at rest, without ever being exposed in plaintext.

- **Ephemeral Key Generation:** On every device reboot, the VPU generates a new ephemeral public/private key pair, used exclusively for sealed box operations. The private key is retained securely on the VPU and never leaves the device, guaranteeing that only the local system can decrypt incoming credentials.
- **Public Key Exposure:** The corresponding public key is exposed as a read-only JSON parameter at the path:
  - `/device/crypto/sealedbox/public_key`
  - External systems may use this key to encrypt secrets (e.g., passwords), but cannot decrypt them.
- **Replay Attack Mitigation with Nonce:** Each encrypted message includes a cryptographic nonce (number used once), offering strong protection against replay attacks. This mechanism ensures intercepted messages cannot be reused or replayed to gain unauthorized access.
- **No Plaintext Password Exposure:** At no point is the password stored or transmitted in plaintext. It is encrypted before transmission and is never visible to external systems or stored unencrypted on the VPU.

### Changing password protected parameters

Password protection takes effect immediately once a device password is set, preventing unauthorized changes to protected configuration parameters.

To update these protected parameters, any configuration changes must be submitted along with the current password using the sealedbox mechanism as shown in below example. These parameters are read-only for anyone who is not authenticated.


:::::{tabs}
::::{group-tab} Python
```python

import os
from ifm3dpy.device import O3R

IP_ADDRESS = "192.168.0.69"
o3r = O3R(ip=IP_ADDRESS)
sealed_box = o3r.sealed_box()

## SSH Key
key_path = "/home/xyz/.ssh/id_o3r.pub"
with open(key_path, "r") as f:
    ssh_pub_key = f.read().strip()

## Seal/Protect the configurations
configuration = {
    "device": {
        "network": {
            "authorized_keys": ssh_pub_key
        }
    }
}

sealed_box.set(password="ProtegoMaxima2025", configuration=configuration)
print("Configuration sealed successfully")
```
::::
::::{group-tab} c++
```cpp
#include <ifm3d/device/o3r.h>
#include <ifm3d/device/err.h>
#include <fstream>
#include <iostream>
#include <string>
#include <stdexcept>

using namespace ifm3d;
int main()
{
    try
    {
        const std::string IP_ADDRESS = "192.168.0.69";
        auto o3r = std::make_shared<ifm3d::O3R>(IP_ADDRESS);

        // Access the SealedBox API
        auto sealed_box = o3r->SealedBox();

        // Read SSH public key from file
        const std::string key_path = "/home/xyz/.ssh/id_o3r.pub";
        std::ifstream key_file(key_path);
        if (!key_file.is_open())
        {
            std::cerr << "Failed to open SSH public key file: " << key_path << std::endl;
            return -1;
        }
        std::stringstream buffer;
        buffer << key_file.rdbuf();
        std::string ssh_pub_key = buffer.str();
        key_file.close();

        ifm3d::json configuration = {{"device", {
                                            {"network", {
                                                {"authorized_keys", ssh_pub_key}
                                            }}
                                        }}
                                    };
        // Seal the configuration
        const std::string password = "Colloportus"; // Input password here
        sealed_box->Set(password, configuration);

        std::cout << "Configuration sealed successfully" << std::endl;
        }
    catch (const ifm3d::Error& err)
    {
        std::cerr << "Error setting password: " << err.what() << std::endl;
        return -1;
    }
}
```
::::
::::{group-tab} CLI
```bash
ifm3d ovp8xx sealedbox set --file config.json
```
::::
:::::

### Recovery

If the password is **lost or forgotten**, then please reach out to ifm support team at support.efector.object-ident@ifm.com for the instructions to recover the device.

### Best practices

- **Test First:** Validate your authorized_keys and firewall rules before sealing to avoid lockouts.
- **Store Passwords Securely:** Use password managers.
- **Keep Backup Keys:** Always have a backup access key added to authorized_keys.

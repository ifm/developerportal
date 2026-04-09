# Guidelines for embedded software development and deployment

The O3R ecosystem is designed as a multi user and shared resource system.

There are multiple guidelines that we suggest to follow to ensure that this system can function as designed:
1. Software (code) encapsulation
2. Access and user rights
3. Concurrently running processes and system load


## Software (code) encapsulation via Docker containers
To allow multiple different software stacks to coexist and run on the VPU, the O3R ecosystem is designed to accept OEM software code via Docker containers.

This confirms to the advantages of software container technology, namely:

**1. Consistency Across Environments**
Containers encapsulate all dependencies and configurations necessary to run an application, ensuring that it behaves the same way across different environments. This eliminates the classic "it works on my machine" problem, enhancing reliability and reducing bugs related to environmental differences.

**2. Portability**
Containers are designed to run consistently across different platforms and cloud environments. This makes it easier to move applications between on-premises infrastructure and various cloud providers, facilitating multi-cloud and hybrid cloud strategies.

**3. Rapid Deployment and Rollback**
Containers allow for rapid deployment and easy rollback of applications. If an update fails, it's straightforward to roll back to a previous container version, minimizing downtime and disruptions.

**4. Isolation**
Containers provide a high level of isolation for applications. Each container runs in its own isolated environment, which enhances security and prevents conflicts between applications running on the same host.

**5. Simplified Dependency Management**
By bundling applications with their dependencies, containers simplify the management of software dependencies. This ensures that the correct versions of libraries and tools are used, preventing issues related to dependency conflicts.

**6. Improved CI/CD Pipelines**
Containers integrate seamlessly with continuous integration and continuous deployment (CI/CD) pipelines. They enable faster and more reliable build, test, and deployment cycles, which enhances the overall development workflow and reduces time to market.

**7. Enhanced Security**
Containers can enhance security by isolating applications and their dependencies from the host system and each other. Additionally, tools and practices for container security, such as image scanning and runtime protection, help mitigate security risks.

And more ...

### Direct deployment on the OVP (VPU) OS
A direct software deployment is **not** suggested, even though technically possible based on the pre-installed interpreters and libraries.
If one chooses to proceed with a native deployment, without the intermediate software container, they may do this by their own risk.

Respective Python versions are indicated via the release notes, but may be up to change depending on the underlying Yocto build.

### Importing OS based runtime environments libraries: TensorRT
There are a few exception to the concepts stated above.
In the case of Tensor Real Time libraries, these are (typically) shared between the host OS and Docker containers, to save flash space and ensure hardware compatibility.

These shall be imported inside the Docker container from the host via a respective NVIDIA runtime. See the [TensorRT documentation](./tensorRT/TensorRT_on_a_VPU_hardware.md) for further details.


## Access and user rights
There are two user (groups) on each O3R FW:
1. OEM: to be used by a software developer / end user
2. root: Not accessible by the oem developer or end customer

Please double check the `oem` user group access rights per FW version yourself.
For further details also see the [deploy Docker documentation](./deployVPU.md) and information available for the `Technology/VPU` section.

Elevated access right via the root user can not be granted.
If missing access right hold you back from developing your application based on the concepts outlined in this document, please let us know - so specific right may be granted.


## Concurrently running processes and system load
Since the system is designed as a shared resource unit, the OEM software developer shall keep the resource constraints of the total system in mind.
For this reason a indication of how resource is required for operation of the ifm software stacks per use case - see the [documentation here](TODO-add-link).

There are currently not quotas set for the Docker daemon.
Meaning if it allocates more resource than what can be shared to allow "normal" operation, the system may become unresponsive and run with reduced 3D and 2D data processing, and ifm embedded application performance.

We therefore ask the OEM software developer to monitor their system load per iteration of their software stack and ifm hardware and software (FW version) for:
+ RAM usage: i.e. memory leaks
+ CPU time and CPU core pinning
+ GPU time
+ General IO and load on flash memory
+ Number of write cycles on the flash memory
+ Ethernet traffic bandwidth

We suggest tools such as [Prometheus](https://github.com/prometheus/node_exporter) for tracking and visualization over time, instead of snapshots in time via tools such as `top` / `htop`.
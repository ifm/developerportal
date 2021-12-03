# Enabling GPU usage on the VPU
## Using the GPU of the VPU

The VPU provides substantial GPU (Graphical Processing Unit) power to the user. The best way to experience this is using CUDA and the samples from NVIDIA. To do so, we are building a container with the sample files from NVIDIA, push it to the VPU and execute it. This, however is not enough. Docker is not using the GPU power if not specified. We need to activate this too via the right runtime.

### Dockerfile sample

The following Dockerfile builds the container with the samples from NVIDIA (see <https://github.com/NVIDIA/cuda-samples/tree/master/Samples/deviceQuery>).

Dockerfile:

```Docker
# Base linux for tegra (l4t) amr64/aarch64 image
FROM nvcr.io/nvidia/l4t-base:r32.4.3 AS buildstage

# Install necessary updates + git (for cloning the nvidia samples). Tag v10.2 specifies the right commit. VPU runs CUDA 10.2
RUN apt-get update && apt-get install -y --no-install-recommends make g++ git && apt-get install ca-certificates -y
RUN git clone --depth 1 --branch v10.2 https://github.com/NVIDIA/cuda-samples.git /tmp/

# Change into the right directory and install/make the samples
WORKDIR /tmp/Samples/deviceQuery
RUN make clean && make

# Multistage build to reduce the image size on the platform
FROM nvcr.io/nvidia/l4t-base:r32.4.3

# Copy the samples from the buildstage into the final image
RUN mkdir -p /usr/local/bin
COPY --from=buildstage /tmp/Samples/deviceQuery/deviceQuery /usr/local/bin

# Execute the deviceQuery and check for CUDA support. Don't forget the runtime with the docker run command
CMD ["/usr/local/bin/deviceQuery"]

```

Building the container:

```console
$ docker image build . -t cuda-samples
Sending build context to Docker daemon  875.5MB
Step 1/9 : FROM nvcr.io/nvidia/l4t-base:r32.4.3 AS buildstage
 ---> c93fc89026d9
...
Successfully tagged cuda-samples:latest
```

After building the container, you can follow the steps from the documentation to test the container on the VPU:
- [Save the container](../../GeneralDoc/docker.md#saving-a-container): ```$ docker save cuda-samples > cuda-samples.tar```
- [Transfer the container](../../GeneralDoc/docker.md#scp): ```$ scp cuda-samples.tar oem@192.168.0.69:/home/oem```
- [Load the container](../../GeneralDoc/docker.md#load-and-start-container): ```$ docker load < cuda-samples.tar```

### Start the container with the NVIDIA runtime

To use CUDA and the GPU, you have to specify the NVIDIA runtime, either with the `docker run` command, or within the `docker-compose.yml` (see [autostart](INSERTLINK)).

#### Using `docker run`
Use the `--runtime nvidia` argument when running your container. The output of the running container should look similar to this:

```console
o3r-vpu-c0:~$ docker run -it --runtime nvidia cuda-samples
/usr/local/bin/deviceQuery Starting...

 CUDA Device Query (Runtime API) version (CUDART static linking)

Detected 1 CUDA Capable device(s)

Device 0: "NVIDIA Tegra X2"
  CUDA Driver Version / Runtime Version          10.2 / 10.2
  CUDA Capability Major/Minor version number:    6.2
  Total amount of global memory:                 3829 MBytes (4014751744 bytes)
  ( 2) Multiprocessors, (128) CUDA Cores/MP:     256 CUDA Cores
  GPU Max Clock rate:                            1300 MHz (1.30 GHz)
  Memory Clock rate:                             1300 Mhz
  Memory Bus Width:                              128-bit
  L2 Cache Size:                                 524288 bytes
  Maximum Texture Dimension Size (x,y,z)         1D=(131072), 2D=(131072, 65536), 3D=(16384, 16384, 16384)
  Maximum Layered 1D Texture Size, (num) layers  1D=(32768), 2048 layers
  Maximum Layered 2D Texture Size, (num) layers  2D=(32768, 32768), 2048 layers
  Total amount of constant memory:               65536 bytes
  Total amount of shared memory per block:       49152 bytes
  Total number of registers available per block: 32768
  Warp size:                                     32
  Maximum number of threads per multiprocessor:  2048
  Maximum number of threads per block:           1024
  Max dimension size of a thread block (x,y,z): (1024, 1024, 64)
  Max dimension size of a grid size    (x,y,z): (2147483647, 65535, 65535)
  Maximum memory pitch:                          2147483647 bytes
  Texture alignment:                             512 bytes
  Concurrent copy and kernel execution:          Yes with 1 copy engine(s)
  Run time limit on kernels:                     No
  Integrated GPU sharing Host Memory:            Yes
  Support host page-locked memory mapping:       Yes
  Alignment requirement for Surfaces:            Yes
  Device has ECC support:                        Disabled
  Device supports Unified Addressing (UVA):      Yes
  Device supports Compute Preemption:            Yes
  Supports Cooperative Kernel Launch:            Yes
  Supports MultiDevice Co-op Kernel Launch:      Yes
  Device PCI Domain ID / Bus ID / location ID:   0 / 0 / 0
  Compute Mode:
     < Default (multiple host threads can use ::cudaSetDevice() with device simultaneously) >

deviceQuery, CUDA Driver = CUDART, CUDA Driver Version = 10.2, CUDA Runtime Version = 10.2, NumDevs = 1
Result = PASS
```

Note that starting the container without the runtime leads to a FAIL:

```console
o3r-vpu-c0:~$ docker run -it cuda
/usr/local/bin/deviceQuery Starting...

 CUDA Device Query (Runtime API) version (CUDART static linking)

cudaGetDeviceCount returned 35
-> CUDA driver version is insufficient for CUDA runtime version
Result = FAIL
```
#### Use `docker-compose` to specify the runtime
Specifying the runtime in `docker-compose.yml` is possible for versions above `version: "2.3"` to get the runtime argument.  

```yml
version: "2.3"
services:
    cuda:
        image: cuda
        runtime: nvidia
```

Start the container using `docker-compose up`:

```console
o3r-vpu-c0:~$ docker-compose up
Creating network "oem_default" with the default driver
Creating oem_cuda_1 ... done
Attaching to oem_cuda_1
cuda_1  | /usr/local/bin/deviceQuery Starting...
cuda_1  |
cuda_1  |  CUDA Device Query (Runtime API) version (CUDART static linking)
cuda_1  |
cuda_1  | Detected 1 CUDA Capable device(s)
cuda_1  |
cuda_1  | Device 0: "NVIDIA Tegra X2"
cuda_1  |   CUDA Driver Version / Runtime Version          10.2 / 10.2
cuda_1  |   CUDA Capability Major/Minor version number:    6.2
cuda_1  |   Total amount of global memory:                 3829 MBytes (4014751744 bytes)
cuda_1  |   ( 2) Multiprocessors, (128) CUDA Cores/MP:     256 CUDA Cores
cuda_1  |   GPU Max Clock rate:                            1300 MHz (1.30 GHz)
cuda_1  |   Memory Clock rate:                             1300 Mhz
cuda_1  |   Memory Bus Width:                              128-bit
cuda_1  |   L2 Cache Size:                                 524288 bytes
cuda_1  |   Maximum Texture Dimension Size (x,y,z)         1D=(131072), 2D=(131072, 65536), 3D=(16384, 16384, 16384)
cuda_1  |   Maximum Layered 1D Texture Size, (num) layers  1D=(32768), 2048 layers
cuda_1  |   Maximum Layered 2D Texture Size, (num) layers  2D=(32768, 32768), 2048 layers
cuda_1  |   Total amount of constant memory:               65536 bytes
cuda_1  |   Total amount of shared memory per block:       49152 bytes
cuda_1  |   Total number of registers available per block: 32768
cuda_1  |   Warp size:                                     32
cuda_1  |   Maximum number of threads per multiprocessor:  2048
cuda_1  |   Maximum number of threads per block:           1024
cuda_1  |   Max dimension size of a thread block (x,y,z): (1024, 1024, 64)
cuda_1  |   Max dimension size of a grid size    (x,y,z): (2147483647, 65535, 65535)
cuda_1  |   Maximum memory pitch:                          2147483647 bytes
cuda_1  |   Texture alignment:                             512 bytes
cuda_1  |   Concurrent copy and kernel execution:          Yes with 1 copy engine(s)
cuda_1  |   Run time limit on kernels:                     No
cuda_1  |   Integrated GPU sharing Host Memory:            Yes
cuda_1  |   Support host page-locked memory mapping:       Yes
cuda_1  |   Alignment requirement for Surfaces:            Yes
cuda_1  |   Device has ECC support:                        Disabled
cuda_1  |   Device supports Unified Addressing (UVA):      Yes
cuda_1  |   Device supports Compute Preemption:            Yes
cuda_1  |   Supports Cooperative Kernel Launch:            Yes
cuda_1  |   Supports MultiDevice Co-op Kernel Launch:      Yes
cuda_1  |   Device PCI Domain ID / Bus ID / location ID:   0 / 0 / 0
cuda_1  |   Compute Mode:
cuda_1  |      < Default (multiple host threads can use ::cudaSetDevice() with device simultaneously) >
cuda_1  |
cuda_1  | deviceQuery, CUDA Driver = CUDART, CUDA Driver Version = 10.2, CUDA Runtime Version = 10.2, NumDevs = 1
cuda_1  | Result = PASS
oem_cuda_1 exited with code 0
```

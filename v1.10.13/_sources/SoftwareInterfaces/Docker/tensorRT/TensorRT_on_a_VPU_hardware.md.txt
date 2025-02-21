# Using TensorRT

This document outlines the general process of AI inference acceleration with TensorRT on an OVP8xx device.

## Building a TensorRT container

There are two options:

- Use a base NVIDIA container and import the runtime libraries directly from the firmware. This is the preferred method that we will describe below.
- Use a complete NVIDIA container that includes the TensorRT libraries directly. This is not recommended since containers sizes will increase dramatically.

### NVIDIA base containers

NVIDIA provides L4T-based containers with TensorFlow that can be downloaded directly from [their containers catalog](https://ngc.nvidia.com/catalog/containers/nvidia:l4t-tensorflow).
TensorFlow should be used with the corresponding recommended version of JetPack.
The recommendations can be found on the [TensorFlow for Jetson website](https://docs.nvidia.com/deeplearning/frameworks/install-tf-jetson-platform-release-notes/tf-jetson-rel.html).

#### Compatibility Matrix

<table>
  <thead>
    <tr>
      <th>VPU Hardware</th>
      <th>VPU Firmware</th>
      <th>L4T Version</th>
      <th>Jetpack Version</th>
      <th>Tensorflow</th>
      <th>Pytorch</th>
      <th>Machine learning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>OVP81x</td>
      <td>1.10.13</td>
      <td><a href="https://developer.nvidia.com/embedded/linux-tegra-r32.7.5">R32.7.5</a></td>
      <td>4.6.5</td>
      <td>
        <br> nvcr.io/nvidia/l4t-tensorflow:r32.7.1-tf2.7-py3 </br>
        <br> nvcr.io/nvidia/l4t-tensorflow:r32.7.1-tf1.15-py3 </br>
      </td>
      <td>
        <br> nvcr.io/nvidia/l4t-pytorch:r32.7.1-pth1.10-py3 </br>
        <br> nvcr.io/nvidia/l4t-pytorch:r32.7.1-pth1.9-py3 </br>
      </td>
      <td>nvcr.io/nvidia/l4t-ml:r32.7.1-py3</td>
    </tr>
    <tr>
      <td>OVP81x</td>
      <td>1.4.30</td>
      <td><a href="https://developer.nvidia.com/embedded/linux-tegra-r32.7.3">R32.7.3</a></td>
      <td>4.6.3</td>
      <td>
        <br> nvcr.io/nvidia/l4t-tensorflow:r32.7.1-tf2.7-py3 </br>
        <br> nvcr.io/nvidia/l4t-tensorflow:r32.7.1-tf1.15-py3 </br>
      </td>
      <td>
        <br> nvcr.io/nvidia/l4t-pytorch:r32.7.1-pth1.10-py3 </br>
        <br> nvcr.io/nvidia/l4t-pytorch:r32.7.1-pth1.9-py3 </br>
      </td>
      <td>nvcr.io/nvidia/l4t-ml:r32.7.1-py3</td>
    </tr>
    <tr>
      <td>OVP80x</td>
      <td>1.4.32</td>
      <td><a href="https://developer.nvidia.com/embedded/linux-tegra-r32.4.3">R32.4.3</a></td>
      <td>4.4.0</td>
      <td>
        <br> nvcr.io/nvidia/l4t-tensorflow:r32.4.3-tf2.2-py3 </br>
        <br> nvcr.io/nvidia/l4t-tensorflow:r32.4.3-tf1.15-py3 </br>
      </td>
      <td>nvcr.io/nvidia/l4t-pytorch:r32.4.3-pth1.6-py3</td>
      <td>nvcr.io/nvidia/l4t-ml:r32.4.3-py3</td>
    </tr>
  </tbody>
</table>

The underlying structure of the container loads the TensorRT libraries and is handled by NVIDIA and Docker - as long as the versions of the container and JetPack closely match.

:::{note}
  To access or modify the Dockerfiles and scripts used to build the NVIDIA containers, see this [GitHub repository](https://github.com/dusty-nv/jetson-containers)
:::

#### Verify the functionality

Start an interactive session in the container and try to import torch in interactive python as shown below.
This assumes that the containers has previously been deployed on to the VPU.

```bash
ovp81x-fc-6c-6d:~$ docker run -ti --runtime nvidia nvcr.io/nvidia/l4t-ml:r32.7.1-py3
allow 10 sec for JupyterLab to start @ http://172.17.0.2:8888 (password nvidia)
JupterLab logging location:  /var/log/jupyter.log  (inside the container)
root@89e52a1dfd4c:/# python3
Python 3.6.9 (default, Dec  8 2021, 21:08:43) 
[GCC 8.4.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import torch
>>> torch.cuda.is_available()
True
>>> torch.cuda.device_count()
1
>>> torch.cuda.current_device()
0
>>> torch.cuda.get_device_name(0)
'NVIDIA Tegra X2'
>>> 
```

To mount scripts, data, etc. from your Jetson's filesystem to run inside the container, use Docker's `-v` flag when starting your Docker instance:

```bash
$ docker run -it --rm --runtime nvidia --network host -v /home/user/project:/location/in/container nvidia nvcr.io/nvidia/l4t-ml:r32.7.1-py3
```

## Using TensorRT in a container on the VPU

TensorRT applications can be memory-intensive. Here's how you can manage memory effectively:

1. Use `l4t-cuda-base` image and build TensorRT inside the container using Dockerfile. We recommend using Docker's multistage build feature to reduce the size in the final container.

2. Reduce the container mounting size by using [.dockerignore file](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
Follow the [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) to minimize the number of layers and overall size.


Once the docker container is deployed on the VPU, you can proceed as follows:

1. Run TensorRT models using `trtexec` inside the `l4t-base` container. This container will copy TensorRT from the host.
2. `trtexec` runs the model, filing it with random data for testing purposes. This is a first indication whether the adapted model can be run on the final architecture.
3. Adapt the model for the final deployment architecture. This may involve updating the model based on its structure and the operators and layers used. Not all operators and model adaptations may be available in the OVP8xx JetPack version. You may need to update your model on your development machine, export a new ONNX model with opset 11 operators, and adapt it again. This could be an iterative process.

### Adaptations for the OVP8xx architecture

The model has to be exported and adapted to the final deployment architecture.
Refer to the [NVIDIA documentation for this process](https://docs.nvidia.com/deeplearning/tensorrt/quick-start-guide/index.html#basic-workflow). This adaptation must be done on the final deployment architecture. Compiling on similar architectures, like Jetson evaluation boards, will result in an incompatible instruction set for the OVP8xx architecture.

We recommend exporting the neural network model to an ONNX model. Adapting the model for the deployment architecture may require updates. This could be an iterative process to get the model running on the final architecture. Update your model on your development machine, export a new ONNX model with opset 11 operators, and test this update in Docker.

For ONNX exports with opset 11 settings and further ONNX operator support, refer to the [official `onnx-tensorrt` documentation](https://github.com/onnx/onnx-tensorrt/blob/release/7.1/operators.md).

### Runtime inference cycle times

Adapting the model as described will result in a model with a specific runtime on the VPU. You may need to adjust for different model sizes and operations. Remember, the typical cycle time on a development machine may not accurately reflect the expected cycle times on OVP8xx (TX2/TX2-NX) hardware.

## Calculating the inference on OVP81x VPU using YOLOv11 ONNX Model file

1. Pull the machine learning base image provided by NVIDIA

:::{bash}
  $ docker pull nvcr.io/nvidia/l4t-ml:r32.7.1-py3
:::

2. Create a YOLOv11 ONNX model file using python script

:::{python}
  from ultralytics import YOLO
:::

  # Load a pretrained YOLO model (recommended for training)
  model = YOLO("yolo11n.pt")

  # Export the model to ONNX format
  model.export(format="onnx", imgsz=[480,640])
:::

3. Copy the Docker container and ONNX model file to VPU
4. Run the docker image in interactive mode
   
```bash
$ docker run --runtime nvidia -it --runtime nvidia --gpus all -v /path/to/your/model:/workspace/model nvcr.io/nvidia/l4t-ml:r32.7.1-py3
```
### Example runs
- Run the command inside a docker container to measure inference timings

```bash
$ usr/src/tensorrt/bin/trtexec --onnx=yolov11/yolov11n.onnx --verbose --fp16
```

### Inference timings

| Model     | Batch Size | Precision | Inference time |
| --------- | ---------- | --------- | -------------- |
| YOLOv11-N | 1          | FP16      | 20.62 ms       |
| YOLOv11-M | 1          | FP16      | 93.24 ms       |

## Deepstream-l4t

The Deepstream-l4t NGC container is used in this example.

1. Pull the Deepstream-l4t NGC container.
  ```bash
  $ docker pull nvcr.io/nvidia/deepstream-l4t:5.1-21.02-samples
  ```

2. Verify the successful pull by listing the Docker images.
	```bash
	$ docker image ls
	REPOSITORY                          TAG                         IMAGE ID             CREATED             SIZE
	nvcr.io/nvidia/deepstream-l4t       5.1-21.02-samples           0ff77669c10          6 months ago        2.72GB
	```

3. Start the container on the VPU: please replace the mounted volume directory with your directory of choice containing the ONNX model
   ```bash
   $ docker container run -it --rm --net=host --runtime nvidia -v /home/jetsontx2/for_container/:/home/dl_models nvcr.io/nvidia/deepstream-l4t:5.1-21.02-samples bash
    ```

4. In the container, navigate to `/home/dl_models directory` and run `trtexec` with the following command:
    ```bash
    $ /usr/src/tensorrt/bin/trtexec --onnx=/home/dl_models/yolov4tiny_relu_best_ops12_fp32.onnx --fp16 --explicitBatch=1
    ```

5. Optimal performance is achieved by using fp16 (floating point 16) precision.
    For TX2 board, the compute capability is 6.2 (that is SM62 architecture), which does not have INT8 feature.
    The output of trtexec for Yolov4 Tiny network and fp16 precision is as below:
    ```bash
    root@jetsontx2-desktop:/home/dl_models# /usr/src/tensorrt/bin/trtexec --onnx=/home/dl_models/yolov4tiny_relu_best_ops12_fp32.onnx --fp16 --explicitBatch=1
    &&&& RUNNING TensorRT.trtexec # /usr/src/tensorrt/bin/trtexec --onnx=/home/dl_models/yolov4tiny_relu_best_ops12_fp32.onnx --fp16 --explicitBatch=1
    [09/23/2021-10:20:45] [I] === Model Options ===
    [09/23/2021-10:20:45] [I] Format: ONNX
    [09/23/2021-10:20:45] [I] Model: /home/dl_models/yolov4tiny_relu_best_ops12_fp32.onnx
    [09/23/2021-10:20:45] [I] Output:
    [09/23/2021-10:20:45] [I] === Build Options ===
    [09/23/2021-10:20:45] [I] Max batch: explicit
    [09/23/2021-10:20:45] [I] Workspace: 16 MB
    [09/23/2021-10:20:45] [I] minTiming: 1
    [09/23/2021-10:20:45] [I] avgTiming: 8
    [09/23/2021-10:20:45] [I] Precision: FP32+FP16
    [09/23/2021-10:20:45] [I] Calibration:
    [09/23/2021-10:20:45] [I] Safe mode: Disabled
    [09/23/2021-10:20:45] [I] Save engine:
    [09/23/2021-10:20:45] [I] Load engine:
    [09/23/2021-10:20:45] [I] Builder Cache: Enabled
    [09/23/2021-10:20:45] [I] NVTX verbosity: 0
    [09/23/2021-10:20:45] [I] Inputs format: fp32:CHW
    [09/23/2021-10:20:45] [I] Outputs format: fp32:CHW
    [09/23/2021-10:20:45] [I] Input build shapes: model
    [09/23/2021-10:20:45] [I] Input calibration shapes: model
    [09/23/2021-10:20:45] [I] === System Options ===
    [09/23/2021-10:20:45] [I] Device: 0
    [09/23/2021-10:20:45] [I] DLACore:
    [09/23/2021-10:20:45] [I] Plugins:
    [09/23/2021-10:20:45] [I] === Inference Options ===
    [09/23/2021-10:20:45] [I] Batch: Explicit
    [09/23/2021-10:20:45] [I] Input inference shapes: model
    [09/23/2021-10:20:45] [I] Iterations: 10
    [09/23/2021-10:20:45] [I] Duration: 3s (+ 200ms warm up)
    [09/23/2021-10:20:45] [I] Sleep time: 0ms
    [09/23/2021-10:20:45] [I] Streams: 1
    [09/23/2021-10:20:45] [I] ExposeDMA: Disabled
    [09/23/2021-10:20:45] [I] Spin-wait: Disabled
    [09/23/2021-10:20:45] [I] Multithreading: Disabled
    [09/23/2021-10:20:45] [I] CUDA Graph: Disabled
    [09/23/2021-10:20:45] [I] Skip inference: Disabled
    [09/23/2021-10:20:45] [I] Inputs:
    [09/23/2021-10:20:45] [I] === Reporting Options ===
    [09/23/2021-10:20:45] [I] Verbose: Disabled
    [09/23/2021-10:20:45] [I] Averages: 10 inferences
    [09/23/2021-10:20:45] [I] Percentile: 99
    [09/23/2021-10:20:45] [I] Dump output: Disabled
    [09/23/2021-10:20:45] [I] Profile: Disabled
    [09/23/2021-10:20:45] [I] Export timing to JSON file:
    [09/23/2021-10:20:45] [I] Export output to JSON file:
    [09/23/2021-10:20:45] [I] Export profile to JSON file:
    [09/23/2021-10:20:45] [I]
    ----------------------------------------------------------------
    Input filename:   /home/dl_models/yolov4tiny_relu_best_ops12_fp32.onnx
    ONNX IR version:  0.0.6
    Opset version:    12
    Producer name:    pytorch
    Producer version: 1.8
    Domain:
    Model version:    0
    Doc string:
    ----------------------------------------------------------------
    [09/23/2021-10:20:47] [W] [TRT] onnx2trt_utils.cpp:220: Your ONNX model has been generated with INT64 weights, while TensorRT does not natively support INT64. Attempting to cast down to INT32.
    [09/23/2021-10:20:47] [W] [TRT] onnx2trt_utils.cpp:246: One or more weights outside the range of INT32 was clamped
    [09/23/2021-10:20:47] [W] [TRT] onnx2trt_utils.cpp:246: One or more weights outside the range of INT32 was clamped
    [09/23/2021-10:20:47] [W] [TRT] onnx2trt_utils.cpp:246: One or more weights outside the range of INT32 was clamped
    [09/23/2021-10:20:47] [W] [TRT] onnx2trt_utils.cpp:246: One or more weights outside the range of INT32 was clamped
    [09/23/2021-10:20:47] [W] [TRT] Output type must be INT32 for shape outputs
    [09/23/2021-10:20:56] [I] [TRT] Some tactics do not have sufficient workspace memory to run. Increasing workspace size may increase performance, please check verbose output.
    [09/23/2021-10:24:32] [I] [TRT] Detected 1 inputs and 6 output network tensors.
    [09/23/2021-10:24:33] [I] Starting inference threads
    [09/23/2021-10:24:36] [I] Warmup completed 0 queries over 200 ms
    [09/23/2021-10:24:36] [I] Timing trace has 0 queries over 3.01861 s
    [09/23/2021-10:24:36] [I] Trace averages of 10 runs:
    [09/23/2021-10:24:36] [I] Average on 10 runs - GPU latency: 11.6003 ms - Host latency: 11.7851 ms (end to end 11.8375 ms, enqueue 6.83557 ms)
    [09/23/2021-10:24:36] [I] Average on 10 runs - GPU latency: 11.0905 ms - Host latency: 11.2746 ms (end to end 11.2852 ms, enqueue 6.02471 ms)
    [09/23/2021-10:24:36] [I] Average on 10 runs - GPU latency: 11.0689 ms - Host latency: 11.2532 ms (end to end 11.2637 ms, enqueue 5.55458 ms)
    [09/23/2021-10:24:36] [I] Average on 10 runs - GPU latency: 11.1319 ms - Host latency: 11.3166 ms (end to end 11.3275 ms, enqueue 6.30752 ms)
    ```

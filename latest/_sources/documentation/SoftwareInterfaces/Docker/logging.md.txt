# How to handle verbose logging for Docker containers

Starting in FW version 1.0.x the logging of STD OUT and STD ERROR have been changed to no longer be stored as separate Docker specific log files.
They are now forwarded to the systemD journal by default.

This is a stability improvement: Log files of Docker containers will no longer continuously grow in size over the lifetime of a Docker container.
Please be aware that if the system wide systemD logging is set to persistent instead of volatile, this can still cause large log files on the device.

## Docker default logging

By default Docker containers handle (verbose) logging in ways that is not well suited to space-constrained systems, for example embedded devices.

There are a different options to reduce the chances of deadlocked systems because of (persistent) container logging:
1. If a (persistent) volume is mounted to a container, please be aware that the logs are persistent beyond the container lifetime. The data has to be cleaned up manually by the user.
2. [Docker logging drivers](#docker-logging-drivers)

### Docker logging drivers
See the Docker documentation about logging drivers [here](https://docs.docker.com/config/containers/logging/configure/)

### Docker logging configuration
By default, no log-rotation is performed. As a result, log-files stored by the default JSON file logging driver can cause a significant amount of disk space to be used for containers that generate much output, which can lead to disk space exhaustion.

Docker keeps the JSON file logging driver (without log-rotation) as a default to retain backward compatibility with older versions of Docker, and for situations where Docker is used as runtime for Kubernetes.

For other situations, the “local” logging driver is recommended as it performs log-rotation by default, and uses a more efficient file format. Refer to the Configure the default logging driver section below to learn how to configure the “local” logging driver as a default, and the local file logging driver page for more details about the “local” logging driver.

### Run a docker container with logging driver configuration
The following example starts a container with log output in non-blocking mode and a 4 megabyte buffer:
```shell
docker run -it --log-opt mode=non-blocking --log-opt max-buffer-size=4m <IMAGE>
```

### Double check the docker logging configuration for a container
Check the configuration in a new shell:
```shell
$ docker inspect -f '{{.HostConfig.LogConfig}}' <CONTAINER>

{json-file map[max-buffer-size:4m mode:non-blocking]}
```

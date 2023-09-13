# Autostart a container on the VPU

Once the container has been transferred to the VPU, you can set up an autostart service to automatically run the containers as start-up.
For auto-starting a container, `Docker compose` is used. The VPU already provides a service `.config/systemd/user/oem-dc@.service` which can be used for auto-starting a service: this is what we will use.

## Docker compose

Generate a sample directory and a `docker-compose.yml` file at following destination: `/usr/share/oem/docker/compose/`. for example `/usr/share/oem/docker/compose/jupyter/docker-compose.yml`

This file should contain the information for starting the container you need.

### Sample docker-compose.yml

The following `docker-compose.yml` file would create a service called `jupyter`, based on the image `jupyter` and bind the container ports 8888 to the host port 8888 on start.

```yaml
version: "3.3"
services:
    jupyter:
        image: jupyter
        ports:
            - 8888:8888
```

> Note: The Docker version on the VPU expects the docker-compose.yml to be either version 2.2 or 3.3. Fur further information refer to [docker compose](<https://docs.docker.com/compose/gettingstarted/>).

## Start the container

A `docker-compose.yml` can be started via `docker-compose up` within the `docker-compose.yml` directory.  
<!-- **TODOOO: add example of `docker compose-up`**   -->
It is also possible to start the service with `systemctl`:

```bash
systemctl --user start oem-dc@jupyter
```

After a few seconds, the service should have started and it is possible to get the status of this service:

```bash
systemctl --user status oem-dc@jupyter
```
<!-- TODO: add the result of this cmd -->

Another way of seeing all running container is `docker ps`.

## Auto start the container after a reboot of the VPU

To restart the container automatically, simply `enable` the service:

```bash
systemctl --user enable oem-dc@jupyter
```

See [Start the container](#start-the-containers) on how to start the container with a `docker-compose.yml file`

## Save data on consistently on the VPU with a container
**TODO: move this section to a more appropriate chapter**
*Coming soon*

Data created and saved within a container is only available for the running instance of the container itself. Restarting the container leads to a loss of the previously saved data. Use `volumes` to avoid this scenario.
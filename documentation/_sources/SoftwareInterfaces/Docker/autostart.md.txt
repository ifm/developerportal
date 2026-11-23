# Autostart a container on the VPU

This document explains how to automatically start your container automatically after a VPU reboot.

## What you need before you begin

- The container image is already available on the VPU (either pulled from a registry or loaded locally).
- You have a folder on the VPU where you can store your `docker-compose.yml` file.

The VPU already provides a systemd user service at `.config/systemd/user/oem-dc-autostart.service`. We will enable this service to start your Docker Compose project automatically.

## Docker Compose (beginner-friendly overview)

Docker Compose lets you define how to run one or more containers in a single file named `docker-compose.yml`. The file describes:

- **Which image to run** (your container image)
- **How to restart** the container if it stops
- **Which ports to expose** (if the app has a web UI)
- **Where to store data** (volumes)

Create a folder and place a `docker-compose.yml` file in it, for example:

```sh
mkdir -p /home/oem/my_docker
```

:::{important}
        This directory does not persist across firmware updates or factory resets.
:::

Save your Compose file at:

```sh
nano /home/oem/my_docker/docker-compose.yml
```

### Sample `docker-compose.yml`

The following file creates a service called `jupyter`, based on the image `jupyter`, and exposes port 8888 so you can access it from the VPU.

```yaml
services:
    jupyter:
        image: jupyter
        restart: unless-stopped
        ports:
            - "8888:8888"

```

## Start / stop the container (manual)

A `docker-compose.yml` can be started from its directory using `docker-compose up`.  

```sh
cd /home/oem/my_docker
docker-compose up -d
```

:::{note}
- `-d` runs the containers in detached mode (in the background). For more detailed explanation, refer to [Docker CLI documentation](https://docs.docker.com/reference/cli/docker/compose/up/)
:::

Check if it is running:

```sh
docker-compose ps
```

To stop the container, navigate to the directory where docker-compose file is located and execute

```sh
docker-compose down
```

To view logs (helpful for troubleshooting):

```sh
docker-compose logs -f
```

## Auto-start the container after a VPU reboot

To restart the container automatically, enable the following user service:

```bash
systemctl --user enable oem-dc-autostart.service
```

To start it right away without rebooting:

```bash
systemctl --user start oem-dc-autostart.service
```

To check the status of the user service:

```bash
systemctl --user status oem-dc-autostart.service
```

To disable the automatic Docker start again:

```bash
systemctl --user disable oem-dc-autostart.service
```

> Hint: `oem-dc-autostart.service` only makes sure that Docker itself is started after boot. It does not report the status of your container and does not by itself guarantee that a container will start. Make sure your container uses a suitable restart policy such as `always` or `unless-stopped`. For details, see the official Docker documentation on [start containers automatically](https://docs.docker.com/engine/containers/start-containers-automatically/).

## Persist data on the VPU (volumes)

Data stored inside a container is lost when the container is removed. To keep data between restarts, use a volume or a host folder.

Example using a host folder:

```yaml
services:
    app:
        image: your-image
        restart: unless-stopped
        volumes:
            - /home/oem/data:/app/data
```

For more details, see [Docker volumes](https://docs.docker.com/engine/storage/volumes/).

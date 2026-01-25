# Docker & Containerisation

**Containerisation** is a concept in software engineering that helps complex applications be **re-usable** and **portable**; by putting apps or other processes in _containers_ (similar to, but not quite identical to, virtual machines). A container is the running object itself, but the files in that container are known as the respective _container image_.

Simply put, while developers typically distribute just the **source code** (typically as Git repos), containerisation lets you ship the source code, all its **dependencies**,and everything else it needs, including (almost) the entire operating system, ensuring the app will run (near) identically across platforms. Thanks to [various OS tricks](https://en.wikipedia.org/wiki/Linux_namespaces), performance isn't significantly impacted; and you also get the advantage of complete separation between two running containers – neither needs to know that the other exists, and so if one breaks then the rest of the machine is completely unaffected.

**Docker** is one of the most popular tools for managing both running containers; and images. It's incredibly useful in a hackathon – the ability to simply get something that works on one machine to work just as well on another is invaluable, and you can also rely on existing container images for various parts of a project.

## Table of Contents

<!-- TOC -->

- [Docker \& Containerisation](#docker--containerisation)
  - [Table of Contents](#table-of-contents)
  - [Getting started](#getting-started)
  - [Running an image](#running-an-image)
    - [Configuring your image](#configuring-your-image)
    - [Networking](#networking)
    - [Other useful commands](#other-useful-commands)
    - [Compose](#compose)
    - [Dockerfiles \& Building](#dockerfiles--building)
    - [Publishing to Docker Hub](#publishing-to-docker-hub)

<!-- /TOC -->

## Getting started

Installing Docker varies by OS.

On MacOS and Windows, download [Docker Desktop](https://docs.docker.com/desktop/).

Linux has [Docker Engine](https://docs.docker.com/engine/install/) which is also available in [binaries](https://docs.docker.com/engine/install/binaries/).

> [!NOTE]
> The binaries are available for Windows too, but they don't include _Compose_, which we'll use later.

You can also install [_Podman_](https://podman.io/docs/installation), a drop-in replacement for Docker for Windows, Linux and MacOS (just replace the `docker` in commands with `podman`).

Once you have a working `docker` command (see below), you can proceed with the rest of this guide.

> [!TIP]
> Try running `docker run hello-world`; docker commands might need root permission if your user isn't in the `docker` group.

## Running an image

Creating a container and running an image is as simple as `docker run <image name>`. Here, we'll work with the [Postgres](https://hub.docker.com/_/postgres) example image (hosted on [Docker Hub](https://hub.docker.com/); similar to GitHub in the sense that it's a repository, but of images).

Running that Postgres image is as simple as `docker run postgres`. But if you try this straight out of the box, you'll see it complains about environment variables, and we come to the next major point of running images: **configuring** them.

### Configuring your image

There are many ways to customize the behaviour of an image. Many are specified by the image authors (so read the documentation!!).

We can change the behaviour of an image by utilising:

- **Environment variables**: add a `-e VARIABLE_NAME=variable-value` flag to your `docker run` command. You can add multiple.
- **Ports**: to bind a port from the image to a port on the host, use the `-p` flag. `-p 8080:80` will forward _container port 80_ to _host port 8080_. So, navigating to `localhost:8080` in a web browser will show whatever is on the container's port `80`.
- **Volumes** (data volumes): You can pass files or directories to the container with the `-v` flag. The flag below binds `./some_local_data` on the host to `var/app/some_other_data` in the container. This could be a directory or a file. Volumes are two-way, so if the container makes changes to the mounted data, the host can see this.

    ```bash
    -v ./some_local_data:/var/app/some_other_data
    ```

Other useful flags include:

- `--rm` automatically **removes the container** once the process exits.
- `-i` & `-t`, together, allow you to interface with the container in a **shell-like way**; you'll often see the `-it` (or `-ti`) flags on containers to be interacted with.
- `--name <some container name>` specifies the **name of the container**, often making it easier to refer to with other commands or containers.

### Networking

Docker containers can, by default, access each-other by IP address. They **can't access the host**, however. To let running containers access the host, the network type has to be changed.

Docker has **networks** that define how containers connect to each other, the host machine, and the outside world. When Docker starts-up initially, a network called "**bridge**" is created. It uses the "bridge" network driver, which (unsurprisingly) bridges the network to the outside world – containers on a bridge network can see each other (on the same network) and the outside world, but not the host.

The other commonly-used network driver, "**host**", allows containers to see the host (as well as each other). If two containers don't share a network; even if the networks they're on have the same network type; they can't access each-other.

Containers can, by default, only access each other by IP, but on any user-created (non-default) network the container name will resolve to the container of interest; provided it's on the same network.

> [!TIP]
> You can find the IP of a network by inspecting the `docker inspect <container name or id>` command. This also gives a lot of general useful information about any container.

Networking isn't massively useful in a hackathon context, since the isolation of containers isn't a massive concern, but it can be useful to know how to allow containers to connect to host services:  

- `docker network create -d host my_network` creates a network named "my_network" with the host driver,
- `docker run --network name=my_network <container image and other flags>` allows that container to access the host on `localhost` (the container must then use its own IP to address itself).

### Other useful commands

Other commands that might prove useful include:

- `docker exec [-it] <container_name> <command>` runs a **shell command** in a running container.
- `docker ps` shows all **running containers**.
- `docker kill <container_name>` or `docker restart <container_name` kills & removes, or restarts a _running_ container.
- `docker rm <container_name>` removes a _non-running container_.
- `docker stop <container_name>` **stops** (without removing) a running container.

`docker --help` will give you an exhaustive list including any that we've missed.

### Compose

To get Postgres working, you need to set an environment variable for the password:

```bash
docker run postgres -e POSTGRES_PASSWORD=some_password
```

But if you want to be able to access it from `localhost`, you need to forward the relevant port:

```bash
docker run postgres -e POSTGRES_PASSWORD=some_password -p 5432:5432
```

And if you want to have access to the data yourself, you need to bind the volume:

```bash
docker run postgres -e POSTGRES_PASSWORD=some_password -p 5432:5432 -v ./my/own/datadir:/var/lib/postgresql
```

As you can imagine, this gets unwieldly rather fast, especially if you have multiple containers, and you need to iterate quickly on setup and configuration. That's where **Docker Compose** comes in!

**Docker Compose** is a declarative way of creating and running groups of containers and networks. Containers and networks are defined in a `docker-compose.yml` file, which looks something like this:

```yaml
services:
    my_postgres_container:
        image: postgres:latest
        environment:
            POSTGRES_USER: some_username
        ports:
            - "5432:5432"
        volumes: 
            - "./my/own/datadir:/var/lib/postgresql"

    some_other_container:
        image: something_else:latest
```

We can run this configuration with `docker compose up -d` (where the `-d` detatches you from the `stdin`/`stdout` of the containers). You can specify individual containers by name:

```bash
docker compose up -d some_other_container
```

Similarly, you can also remove (`docker down -d <container>`) or restart (`docker restart -d <container>`) containers from the Compose.

### Dockerfiles & Building

Docker also allows you to build images yourself. This can be useful for sharing environments between team members, or potentially deploying somewhere. To do this, we're going to "dockerize" an existing application – specifically, some arbitrary Python Flask backend.

I've created an incredibly simple [`main.py`](/docker/example_app/main.py), but running it isn't as simple – we need to have python installed, and ideally also gunicorn.

In order to create a Docker image, we need a **Dockerfile**, which is a list of instructions for Docker to follow to construct the image.

[Our Dockerfile for `main.py`](/docker/example_app/Dockerfile) looks as follows:

```Dockerfile
FROM python:latest

WORKDIR /var/app/

COPY main.py ./

RUN pip install gunicorn flask

EXPOSE 8000

CMD ["gunicorn", "main:app", "-b", "0.0.0.0:8000"]
```

The commands shown are the **most commonly-used** ones in Dockerfile. Here's what they do:

- `FROM`: This is (almost) always the first command in any Dockerfile. It specifies a "base" image to build upon.
- `WORKDIR`: This sets the current working directory for the following commands (such as `COPY` or `RUN`, in this case).
- `COPY`: This copies a file (or files) from the directory on the host where the `docker build` command is run, into the container image.
- `RUN`: This runs a command in the container. Here, it installs dependencies for the app that aren't included in the base image.
- `EXPOSE`: Exposes a port on the container. It doesn't do much internally, but acts as a sort-of documentation for users of the image.
- `CMD`: This specifies the default command to run when the container is started with `docker run`.

In order to actually build this image, use the command:

```bash
docker build . -t <"a name for your image">
```

The image can then be built with:

```bash
docker run <"a name for your image">
```

Finally, `docker run <a name for your image> -p 8000:8000` allows you to visit `localhost:8000` and see your working app!

### Publishing to Docker Hub

Sharing images between members of your group can often be useful. Images can be published to Docker Hub if you have a Docker Hub account and have logged-in (`docker login`) with `docker push <image name>`.

If you do publish your image, its name (used in `docker build`) should follow the format of `<username>/<project name>:<version>`.

To store the image, however, you first nee to create a repository (on Docker Hub itself). After publishing, other people can use your image with:

```bash
docker run <username>/<project name>:<version>
```

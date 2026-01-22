# Docker and containerisation

Containerisation is a concept in software engineering that helps complex applications be re-usable and portable; by putting apps or other processes in _containers_ (similar to, but not quite identical to, virtual machines). A container is the running object, but the files upon that container are known as the respective _container image_.

Simply put, while developers typically distribute just the source code (as Git repos), containerisation lets you ship the source code, all its dependencies, everything else it needs, and indeed (almost) the entire operating system to ensure that the app will run, and in the same way, in one place as another. Thanks to [various OS tricks](https://en.wikipedia.org/wiki/Linux_namespaces) performance isn't significantly impacted; and you also get the advantage of complete separation between two running containers EMDASH neither needs to know that the other exists, and so if one breaks then the rest of the machine is completely unaffected.

**Docker** is one of the most popular tools for managing both running containers; and images. It's incredibly useful in a hackathon EMDASH the ability to simply get something that works on one machine to work just as well on another is invaluable, and using existing container images for various parts of a project is a commonly used strategy.

## Getting started

Installing Docker varies on a per-OS basis, but on MacOS and Windows [Docker Desktop](https://docs.docker.com/desktop/) is available. Linux has [Docker Engine](https://docs.docker.com/engine/install/) which is also available in [binaries](https://docs.docker.com/engine/install/binaries/). The binaries are available for Windows too, but they don't include Compose, which we'll use later.

You can also install [Podman](https://podman.io/docs/installation), a drop-in replacement for Docker for Windows, Linux and MacOS (just replace the `docker` in commands with `podman`).

Once you have a working `docker` command (try `docker run hello-world`; docker commands might need root permission if your user isn't in the `docker` group) you can proceed with the rest of this guide.

## Running an image

Creating a container and running an image is as simple as `docker run <image name>`. Here, we'll work with the [Postgres](https://hub.docker.com/_/postgres) example image (here hosted on [Docker Hub](https://hub.docker.com/); much akin to GitHub in the sense that it's a repository, but of images).

Running postgres is as simple as `docker run postgres`. If you try this, you'll see it complains about environment variables, and we come to the next major point of running images: configuring them.

### Configuring your image

There are many ways to customize the behaviour of an image. Many are specified by the image authors (read the documentation!!).

Ways to change the behaviour of an image include:

- Environment variables: add a `-e VARIABLE_NAME=variable-value` flag to your `docker run` command. You can add multiple.
- Ports: to bind a port from the image to a port on the host, use the `-p` flag: `-p 8080:80` will forward _container port 80_ to _host port 8080_, i.e. navigating to `localhost:8080` in a web browser will show whatever is on the container's port `80`.
- Volumes (data volumes): You can pass files or directories to the container with the `-v` flag: `-v ./some_local_data:/var/app/some_other_data` means that `./some_local_data` on the host (relative to where the docker command was run) is bound to `/var/app/some_other_data` in the container; whether it be a directory or a file. Volumes are two-way EMDASH if the container makes changes to the mounted data, the host can see this.

Other useful flags include:

- `--rm`: Automatically remove the container once the process exits
- `-i` and `-t`: Together, this allows you to interface with the container in a shell-like way; you'll often see the `-it` (or `-ti`) flags on containers to be interacted with.
- `--name <some container name>`: Specifies the name of the container, often making it easier to refer to with other commands or containers.

### Networking

Docker containers can, by default, access each-other by IP address. They can't access the host, however. To let running containers access the host, the network type has to be changed.

Docker has networks that define how containers connect to each other, the host machine, and the outside world. When docker starts-up initially, one network called "bridge" is created. It uses the "bridge" network driver, which (unsurprisingly) bridges the network to the outside world EMDASH containers on a bridge network can see each other (on the same network) and the outside world, but not the host.

The other commonly-used network driver, **host**, allows containers to see the host (as well as each other). If two containers don't share a network; even if the networks they're on have the same network type; they can't access each-other.

Containers can by default only access each other by IP (which you can find by inspecting the `docker inspect <container name or id>` command; which gives a lot of useful information about any container); but on any user-created (none-default) network the container name will resolve to the container of interest; provided it's on the same network.

Networking isn't massively useful in a hackathon context, since isolation isn't a massive concern, but it can be useful to know how to allow containers to connect to host services:  
`docker network create -d host my_network` to create a network named "my_network" with the host driver, and then  
`docker run --network name=my_network <container image and other flags>` to allow that container to access the host on `localhost` (the container must then use its own IP to address itself).

### Other useful commands

Other commands that might prove useful include:

- `docker exec [-it] <container_name> <command>`: Run a command in a running container
- `docker ps`: Show running containers
- `docker kill <container_name>` and `docker restart <container_name`: Kills (and removes) or restarts a running container
- `docker rm <container_name>`: Removes a non-running container
- `docker stop <container_name>`: Stops (without removing) a running container
An exhaustive list can be seen with `docker --help`.

### Compose

So, in order to get postgres working, you need to set an environment variable for the password: `docker run postgres -e POSTGRES_PASSWORD=some_password`

But if you want to be able to access it from localhost, you need to forward the relevant port: `docker run postgres -e POSTGRES_PASSWORD=some_password -p 5432:5432`

And if you want to have access to the data yourself, you need to bind the volume: `docker run postgres -e POSTGRES_PASSWORD=some_password -p 5432:5432 -v ./my/own/datadir:/var/lib/postgresql`

As you can imagine, this gets unwieldly rather fast, especially if you have multiple containers, and you need to iterate quickly on setup and configuration. That's where Docker Compose comes in!

Docker Compose is a declarative way of creating and running groups of containers and networks. Containers and networks are defined in a `docker-compose.yml` file, which looks something like this:

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

Run this with `docker compose up -d` (where the `-d` detatches you from the stdin/stdout of the containers). You can specify individual containers by name (`docker compose up -d some_other_container`). Similarly, you can also remove or restart containers from the Compose or the entire Compose (`docker down -d <container>` and `docker restart -d <container>`).

### Dockerfiles and building

Docker also allows you to build images yourself. This can be useful for sharing environments between team members, or potentially deploying somewhere. In order to do this, we're going to "dockerize" an existing application EMDASH specifically some arbitrary Python Flask backend. I've created an incredibly simple `main.py`, but running it isn't as simple EMDASH we need to have python installed, and ideally also gunicorn.

In order to make a docker image, we need a Dockerfile, which is a list of instructions for docker to follow to construct the image. Dockerfiles look something like this (this is for the python app):

```Dockerfile
FROM python:latest

WORKDIR /var/app/

COPY main.py ./

RUN pip install gunicorn flask

EXPOSE 8000

CMD ["gunicorn", "main:app", "-b", "0.0.0.0:8000"]
```

The commands shown are the most commonly used ones in Dockerfile. Here's what they do:

- `FROM`: This is (almost) always the first command in any Dockerfile. It specifies a "base" image to build upon.
- `WORKDIR`: This sets the current working directory for following commands (used here by `COPY` and `RUN`)
- `COPY`: This copies a file or files from the directory on the host where the `docker build` command is run into the container image.
- `RUN`: This runs a command in the container. Here, it installs dependencies for the app that aren't included in the base image.
- `EXPOSE`: Exposes a port on the container. It doesn't do much internally, but acts as a sort-of documentation for users of the image.
- `CMD`: This specifies the default command to run when the container is started with `docker run`

In order to actually build this, use the command `docker build . -t <a name for your image>`; which will then allow you to run it with `docker run <a name for your image>`. Using `docker run <a name for your image> -p 8000:8000` will allow you to visit `localhost:8000` and see the results of the app!

### Publishing to Docker Hub

Sharing images between people is often useful. Images can be published to Docker Hub if you have a Docker Hub account and have logged-in (`docker login`) with `docker push <image name>`. In that case, your image name (used in `docker build`) should follow the format of `<username>/<project name>:<version>`. You need to create the repository to store the image first, however (on Docker Hub itself). After publishing, other people can use your image with `docker run <username>/<project name>:<version>`.

# Angular, Keycloak, and Playwright

This repository contains a reference application for configuring Angular to use Keycloak for authentication and to authenticate with Keycloak in Playwright tests.

## Development

While this repo is public and meant to be shared, as the author it is setup for my development workflow. I use [devcontainers](https://containers.dev/) for all of my development. I also work on Windows using WSL so the commands that are run outside of the containers are written for Powershell and they may not work in your terminal. You can just ask your favorite AI pair programmer to convert them :)

Keycloak is installed as a Docker container in the [docker-compose](./.devcontainer/docker-compose.yml) file. It uses the embedded h2 database because using an external database is outside the scope of this project. Since we are using the embedded database there are a few things we need to do that will allow us to export the keycloak data, store it with the project, and then import it when the Keycloak container (re)starts.

**Note: there is a keycloak configuration file with one realm named 'dev' in the /.keycloak directory. This file gets imported automatically when the container starts. It has one user with the username 'dev.user' and the absolutely secure and unguessable password of 'Pa$$word1'**

First, the keycloak service creates a volume to store the h2 data. Since exporting this data requires the keycloak service to be stopped when running this export command, this will allow us access to the data when the container is stopped. Also, this volume needs to be accessed by the keyclok user so there is an 'init' container that runs first to ensure this. See the [docker-compose](./.devcontainer/docker-compose.yml) file.

Since we already have a config file, these steps are here for reference and only need to be performed if you change the keycloak config through the admin UI and want to save that config.

Stop the keycloak container. This can either done through Docker desktop (easy) or you can run the following commands in the terminal or your host system:

To get the keycloak container id or name

```powershell
docker ps
```

To stop the container

```powershell
docker stop <keycloak container id or name>
```

Then we need to export the keycloak config as json. This requires running the Keycloak image in a different container with the data volume mounted.

- change <keycloak data volume name> to the name of the volume container containing the keycloak h2 database.

```powershell
docker run --rm -v <keycloak data volume name>:/opt/keycloak/data/h2 -v ${PWD}:/tmp quay.io/keycloak/keycloak:26.2.5 export --realm dev --file /tmp/dev-export.json
```

The previous command mounted the current working directory `${PWD}` on the host machine as a volume so that is where the exported json file is. We now need to copy it from the host to the app container.

- replace the <id or name of app container> with the id or name of the Angular app container

```powershell
docker cp ./dev-export.json <id or name of the app container>:/workspaces/angular-keycloak-playwright/.keycloak
```

You will need to manually delete the exported file from the host directory after copying (there is also an empty folder created called 'hsperfdata_keycloak' that can be deleted as well)

## Angular configuration

TODO

# OVVL Web App

[OVVL](ovvl.org) makes it possible to conceptualize complex software architectures and to analyze them for potential threats and vulnerabilities.

OVVL requires a connection to the [server](https://github.com/OVVL-HSO/OVVL-Server) in order to work correctly.  

OVVL is developed at [University of Applied Sciences Offenburg](https://www.hs-offenburg.de/) and part of the BMBF KMU-Innovation Project "CloudProtect" (Förderkennzeichen 16KIS0850).

## Run

The first time you try to run the app, you have to run `npm install` to install all required dependencies.
After that, you can run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Docker

You can run the application with docker by executing these commands:

```
docker build -t angular-docker .  

docker run -d -p 80:80 --name angular-app angular-docker
```

## Technologies

The application is built using [Angular 7](https://angular.io/) and [NGRX](https://ngrx.io/).

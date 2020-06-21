# Github Ngsearch
Author: IsaacRF239

Deployed app URL: http://isaacrf.com/apps/github-ngsearch

Angular test app that consumes GitHub API to retrieve data. This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Usage instructions

Production app can be accesed on http://isaacrf.com/apps/github-ngsearch

### Search
Use the search bar to search for users by their login name. The search is performed as you type

![Search](https://user-images.githubusercontent.com/2803925/83993510-e6eea280-a953-11ea-9202-693eac95ffbf.gif)

### Theming
Theme button can be used to dinamically swap themes

![Theming](https://user-images.githubusercontent.com/2803925/83993507-e5bd7580-a953-11ea-80b2-799a2a032f42.gif)

### User Detail

Click an user to go to the user detail

![Details](https://user-images.githubusercontent.com/2803925/83993503-e3f3b200-a953-11ea-9e6b-630633d8624c.gif)

## Key Features

### Responsive

Layout is adapted to be well visualized in any resolution.

![ngsearch-responsive](https://user-images.githubusercontent.com/2803925/85222356-8717e300-b3ba-11ea-8a82-a7b81346fdef.gif)

### Mobile ready and animated

App is ready for mobile resolution and navigation transitions are animated.

![ngsearch-animations](https://user-images.githubusercontent.com/2803925/85222357-897a3d00-b3ba-11ea-813c-9e5beb702ceb.gif)

### Cache in memory

This app caches the user details once retrieved, and this data has a configurable lifetime, setted to 1 hour by default. GitHub API is called in every navigation to user detail, however, succesive calls are filled with an Etag header field GitHub uses to determine if data has changed since the last call. If not, GitHub API just return a 304, not modified error, and data is then retrieved from cache.

Calls with a 304 error don't count towards API call limits, and since they return empty, they are also fast in most case scenarios.

An optional timeout and offline cache could be also implemented to avoid sucessive calls for a period of time, but that's out of the scope of this project.

![ngsearch-cache](https://user-images.githubusercontent.com/2803925/85222358-8aab6a00-b3ba-11ea-9c29-90ffd3584e61.gif)

## Project Build

### Development server

Run `ng serve --open` for a dev server. The app will automatically reload if you change any of the source files.

### Build

Run `ng build --prod --base-href ./` to build the project production ready. The build artifacts will be stored in the `dist/` directory.

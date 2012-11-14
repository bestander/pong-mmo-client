Super Pong: HTML5 Pong multiplayer game
=============

WIP It is a very early development stage

- Package manager is chosen: component
- Test framework: Jasmine
- Game rules are WIP
- Game renderer is not started. First will try an ad-hoc canvas one, then will switch to [CAAT](https://github.com/hyperandroid/CAAT)
- Game controls and Hot Seat are not started

Description
------------

TODO


API
------------

TODO

This web project has the following setup:
-------------

* component.json - [component](https://github.com/component/component/) library descriptor
* index.js - main CommonJS module that binds all the pieces together
* lib/ - components folder
    * renderer.js - CJS module responsible for rendering the game objects on the screen
    * gameLogic.js - CJS module responsible for all game events and rules being followed
* tests/ - [jasmine](http://pivotal.github.com/jasmine/) unit tests and test spec runner
* Makefile - standard compilation descriptor for [component](https://github.com/component/component/)
* example/ - folder for example files
* build/ - folder that is created by [component](https://github.com/component/component/) with `make build` command
* components/ - folder with project dependencies, will be created by [component](https://github.com/component/component/) with 'make components' command
* MIT-LICENSE - license wording

License
----------
All application code is released under MIT License, dependencies have their own permissive open source licenses.

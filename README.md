# WebGL Chess
Thanks for visiting! I created this project to get familiar with WebGL. [Click here to play](http://steelcastle.biz/webgl-chess/)

## Building and Deploying
The client source is bundled into a release with a python script. With your working directory in **src/tools**, run `python client_release.py`. After this, the **release** directory is ready to be deployed. Any HTTP server should be sufficient for hosting the client.

The game server requires Node.js. Copy the **src/server** directory to the destired location. From there, run `npm install`. To start the server, run `node main.js`.

## Automated Tests
Tests are run with Jasmine, which is included in the release builds. To run tests on a release, simply open **testing/SpecRunner.html** in your desired browser.

---

Copyright 2016 Connor Douthat

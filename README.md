MVAAppstore Mobile
======================

An all in one appstore for gospel ministry apps and mobile portal to the mvacontest apps. [Homepage](http://mvaappstore.com/)

## Like to join?
If you will like to contribute to the gospel ministry in app development, we openly welcome you. [Dev Blog](http://mvaappstore.com/dev/)

- [Read more](http://mvacontest.com/news)

## Run it yourself

#### Getting started
You can create your own project locally using Yoeman with:

Having Node npm installed, run
  $ npm install -g yo
  
Create and CD into your working project directory then scalfold a blank ionic project and manually replace the /app folder with mine
  $ md mvaappstore && cd mvaappstore
  $ yo ionic
  
#### Add Plugins
Add the following plugins to the application:

  $ cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
  $ cordova plugin add org.apache.cordova.console
  $ cordova plugin add org.apache.cordova.device
  $ cordova plugin add org.apache.cordova.dialogs
  $ cordova plugin add org.apache.cordova.inappbrowser
  $ cordova plugin add org.apache.cordova.splashscreen

Plugin versions used
----------------------

nl.x-services.plugins.socialsharing 4.3.6 "SocialSharing"
org.apache.cordova.console 0.2.10 "Console"
org.apache.cordova.device 0.2.11 "Device"
org.apache.cordova.dialogs 0.2.10 "Notification"
org.apache.cordova.inappbrowser 0.5.1 "InAppBrowser"
org.apache.cordova.splashscreen 0.3.2 "Splashscreen"

#### Add a Platform
  $ cordova platform add android
  
#### Test the App on your browser using grunt and livereload
  $ grunt serve
  
#### Build the App
  $ grunt build
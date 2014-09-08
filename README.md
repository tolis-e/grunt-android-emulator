# grunt-android-emulator 
[![Build Status](https://travis-ci.org/tolis-e/grunt-android-emulator.png?branch=0.1.0)](https://travis-ci.org/tolis-e/grunt-android-emulator) [![NPM version](https://badge.fury.io/js/grunt-android-emulator.png)](http://badge.fury.io/js/grunt-android-emulator)
> This project contains a Grunt plugin which includes tasks to:

* Create an Android emulator
* Start an Android emulator
* Stop an Android emulator
* Unlock an Android emulator
* Install an APK
* Start an activity

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-android-emulator --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-android-emulator');
```

## create-android-emulator task
> This task creates an Android emulator. You can execute it using:

`grunt create-android-emulator:emulator-1` where `emulator-1` is a the emulator's id as shown in the below configuration.

```js
grunt.initConfig({
    grunt_android_emulator: {
        emulators: [{
            id: 'emulator-1',
            create: {
                '--name': 'testAVD',
                //'--sdcard': '10M',
                //'--snapshot': '',
                //'--path': 'avd',
                '--force': '',
                //'--skin': '',
                '--target': 'android-18',
                '--abi': 'armeabi-v7a'
            }
        }]
    }
});
```
### Options

#### --name or -n
Type: `String`  
Description: `Name of the new AVD`  
Usage: `[required]`

#### --target or -t
Type: `String`  
Description: `Target ID of the new AVD`  
Usage: `[required]`

#### --path or -p
Type: `String`  
Description: `Directory where the new AVD will be created`  
Usage: `[optional]`

#### --force or -f
Type: `-`  
Description: `Forces creation (overwrites an existing AVD)`  
Usage: `[optional]`

#### --skin or -s
Type: `String`  
Description: `Skin for the new AVD`  
Usage: `[optional]`

#### --abi or -b
Type: `String`  
Description: `The ABI to use for the AVD`  
Usage: `[optional]`

#### --sdcard or -c
Type: `String`  
Description: `Path to a shared SD card image, or size of a new sdcard for the new AVD`  
Usage: `[optional]`

#### --snapshot or -a
Type: `String`  
Description: `Place a snapshots file in the AVD, to enable persistence`  
Usage: `[optional]`

## start-android-emulator
> This task starts an Android emulator. You can execute it using:

`grunt start-android-emulator:emulator-1` where `emulator-1` is a the emulator's id as shown in the below configuration.

```js
grunt.initConfig({
    grunt_android_emulator: {
        emulators: [{
            id: 'emulator-1',
            start: {
                '-port': '5556',
                //'-no-window': '',
                '-no-audio': '',
                // '-force-32bit': ''
                //'-no-boot-anim': '',
                //'-no-skin': '',
                //'-memory': '1024'
                //'-avd': 'testAVD'
            }
        }],
    }
});
```
### Options

#### -port
Type: `String`  
Description: `TCP port that will be used for the console`  
Usage: `[optional]`  
Default: `5554`

#### -memory
Type: `String`  
Description: `Physical RAM size in MB`  
Usage: `[optional]`  

#### -avd
Type: `String`  
Description: `AVD name`  
Usage: `[optional]`  
Default: `The --name or -n value of the emulator's create options`

#### -no-audio
Type: `-`  
Description: `Disable audio support`  
Usage: `[optional]`

#### -no-skin
Type: `-`  
Description: `Don't use any emulator skin`  
Usage: `[optional]`

#### -no-boot-anim
Type: `-`  
Description: `Disable animation for faster boot`  
Usage: `[optional]`

#### -no-window
Type: `-`  
Description: `Disable graphical window display`  
Usage: `[optional]`

Execute `emulator -help` in a terminal to see a list of the available options. _Note that the -ports option is not supported_

## stop-android-emulator
> This task stops an Android emulator. You can execute it using:

`grunt stop-android-emulator:emulator-1` where `emulator-1` is a the emulator's id.

## unlock-android-emulator
> This task unlocks an Android emulator. You can execute it by using:

`grunt unlock-android-emulator:emulator-1` where `emulator-1` is a the emulator's id.

The plugin uses the `-port` option of the `start` options to find the emulator to stop or 5554 in case this option is not defined.

## install-apk task
> This task installs an APK in an Android emulator. You can execute it using:

`grunt install-apk:emulator-1:apk-1` where `emulator-1` is a the emulator's id and apk-1 is the APK's id as shown in the below configuration.

```js
grunt.initConfig({
    grunt_android_emulator: {
        emulators: [{
            id: 'emulator-1',
            create: {
                '--name': 'testAVD',
                //'--sdcard': '10M',
                //'--snapshot': '',
                //'--path': 'avd',
                '--force': '',
                //'--skin': '',
                '--target': 'android-18',
                '--abi': 'armeabi-v7a'
            }
        }],
        apks: [{
            id: "apk-1",
            path: "./apk/test.apk",
            activities: [{
                id: "activity-1",
                packageName: "org.jboss.aerogear",
                name: "AeroGearMain"
            }]
        }]
    }
});
```
### Options

#### path
Type: `String`  
Description: `Relative or absolute path of the APK`  
Usage: `[required]`

## start-activity task
> This task starts an activity. You can execute it using:

`grunt start-activity:emulator-1:apk-1:activity-1` where `emulator-1` is a the emulator's id, apk-1 is the APK's id and activity-1 is the activity's id as shown in the below configuration.

```js
grunt.initConfig({
    grunt_android_emulator: {
        emulators: [{
            id: 'emulator-1',
            create: {
                '--name': 'testAVD',
                //'--sdcard': '10M',
                //'--snapshot': '',
                //'--path': 'avd',
                '--force': '',
                //'--skin': '',
                '--target': 'android-18',
                '--abi': 'armeabi-v7a'
            }
        }],
        apks: [{
            id: "apk-1",
            path: "./apks/test.apk",
            activities: [{
                id: "activity-1",
                packageName: "org.jboss.aerogear",
                name: "AeroGearMain"
            }]
        }]
    }
});
```
### Options

#### activities[x].id
Type: `String`  
Description: `Identifier of the activity`  
Usage: `[required]`

#### activities[x].packageName
Type: `String`  
Description: `Package name`  
Usage: `[required]`

#### activities[x].name
Type: `String`  
Description: `Activity name`  
Usage: `[required]`

## Example
> The [example](https://github.com/tolis-e/grunt-android-emulator/tree/master/example) folder contains a sample example which depicts how to use this plugin.

## Release History

### 0.1.2
*Released 08 September 2014

 * Remove validation from create options --device option support

### 0.1.1
*Released 13 December 2013*

* Add APK installation and start activity support

### 0.1.0
*Released 20 October 2013*

* Initial release

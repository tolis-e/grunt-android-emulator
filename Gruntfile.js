/**
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /*
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
                },
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
            apks: [{
                id: "apk-1",
                path: "/home/test/apks/test.apk",
                activities: [{
                    id: "activity-1",
                    package: "org.jboss.aerogear",
                    name: "AeroGearMain"
                }]
            }]
        },*/
        jshint: {
            all: {
                src: [ "Gruntfile.js", "src/**/*.js", "tasks/*.js" ],
                options: {
                    jshintrc: ".jshintrc"
                }
            }
        }
    });
   
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint']);
};

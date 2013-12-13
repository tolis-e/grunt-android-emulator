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
module.exports = function (grunt) {
    'use strict';

    var GruntModule = require('../src/lib/grunt-module').GruntModule,
        StringModule = require('../src/lib/string-module').StringModule,
        Logger = require('../src/lib/log-module').Logger,
        AndroidEmulatorModule = require('../src/core/emulator-module').AndroidEmulatorModule,
        path = require('path');

    // TODO: improve validation and avoid repeated code inside tasks

    grunt.registerTask('create-android-emulator', 'Create Android Emulator', function (id) {
        var done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            },
            options = {},
            emulators = GruntModule.getOption('grunt_android_emulator.emulators');

        if (!id || StringModule.trim(id) === '')
        {
            Logger.error(['task: create-android-emulator: invalid emulator id: ', id].join(''));
            callbacks.error();
            return;
        }
        else if (!emulators || emulators.length < 1)
        {
            Logger.error('task: create-android-emulator: emulators configuration is missing in Gruntfile');
            callbacks.error();
            return;
        }
        else
        {
            for (var i=0, emulator; i<emulators.length; i++)
            {
                if (emulators[i] && emulators[i].id === id)
                {
                    emulator = emulators[i];
                    break;
                }
            }
            
            if (!emulator)
            {
                Logger.error(['task: create-android-emulator: emulator id: ', id, ' does not exist in Gruntfile'].join(''));
                callbacks.error();
                return;
            }
            else
            {
                Logger.info(['task: create-android-emulator: emulator with id: ', id, ' exists in Gruntfile'].join(''));
                var createOptions = emulator.create;
                if (!createOptions)
                {
                    Logger.error(['task: create-android-emulator: create: options are missing for emulator id: ', id, ' in Gruntfile'].join(''));
                    callbacks.error();
                    return;
                }
                else
                {
                    for (var option in createOptions)
                    {
                        Logger.info(['task: create-android-emulator: option: \'', option, '\' value: \'', createOptions[option], '\' '].join(''));
                        options[option] = createOptions[option];
                    }
                    var validationErrors = AndroidEmulatorModule.validateCreateOptions(options);
                    if (validationErrors && StringModule.trim(validationErrors) !== '')
                    {
                        Logger.error(['task: create-android-emulator: create: invalid options: ', validationErrors].join(''));
                        callbacks.error();
                        return;
                    }
                    else
                    {
                        // create emulator
                        AndroidEmulatorModule.create(options, callbacks);
                    }
                }
            }
        }
    });

    grunt.registerTask('start-android-emulator', 'Start Android Emulator', function (id) {
        var done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            },
            options = {},
            emulators = GruntModule.getOption('grunt_android_emulator.emulators');

        if (!id || StringModule.trim(id) === '')
        {
            Logger.error(['task: start-android-emulator: invalid emulator id: ', id].join(''));
            callbacks.error();
            return;
        }
        else if (!emulators || emulators.length < 1)
        {
            Logger.error('task: start-android-emulator: emulator configuration is missing in Gruntfile');
            callbacks.error();
            return;
        }
        else
        {
            for (var index=0, emulator; index<emulators.length; index++)
            {
                if (emulators[index] && emulators[index].id === id)
                {
                    emulator = emulators[index];
                    break;
                }
            }
            
            if (!emulator)
            {
                Logger.error(['task: start-android-emulator: emulator id: ', id, ' does not exist in Gruntfile'].join(''));
                callbacks.error();
                return;
            }
            else
            {
                Logger.info(['task: start-android-emulator: emulator with id: ', id, ' exists in Gruntfile'].join(''));
                var createOptions = emulator.create || {},
                    startOptions = emulator.start || {};
                for (var option in startOptions)
                {
                    Logger.info(['task: start-android-emulator: option: \'', option, '\' value: \'', startOptions[option], '\' '].join(''));
                    options[option] = startOptions[option];
                }
                var emulatorName = createOptions['--name'] || createOptions['-n'],
                    port = startOptions['-port'],
                    ports = startOptions['-ports'];

                    options['-avd'] = startOptions['-avd'] || emulatorName;

                    if (!options['-avd'] || StringModule.trim(options['-avd']) === '')
                    {
                        Logger.error(['task: start-android-emulator: -avd option is missing for emulator id: ', id, ' in Gruntfile. Setup the --name or -n option in create options or the -avd in start options'].join(''));
                        callbacks.error();
                        return;
                    }
                    if (!port || StringModule.trim(port) === '')
                    {
                        options['-port'] = 5554;
                    }
                    if (ports && StringModule.trim(ports) !== '')
                    {
                        Logger.error('task: start-android-emulator: -ports option is not supported in this version of the grunt-android-emulator plugin');
                        callbacks.error();
                        return;
                    }
                    AndroidEmulatorModule.start(options, callbacks);
            }
        }
    });

    grunt.registerTask('stop-android-emulator', 'Stop Android Emulator', function (id) {
        var done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            },
            options = {},
            emulators = GruntModule.getOption('grunt_android_emulator.emulators');

        if (!id || StringModule.trim(id) === '')
        {
            Logger.error(['task: stop-android-emulator: invalid emulator id: ', id].join(''));
            callbacks.error();
            return;
        }
        else if (!emulators || emulators.length < 1)
        {
            Logger.error('task: stop-android-emulator: emulator configuration is missing in Gruntfile');
            callbacks.error();
            return;
        }
        else
        {
            for (var index=0, emulator; index<emulators.length; index++)
            {
                if (emulators[index] && emulators[index].id === id)
                {
                    emulator = emulators[index];
                    break;
                }
            }
            
            if (!emulator)
            {
                Logger.error(['task: stop-android-emulator: emulator id: ', id, ' does not exist in Gruntfile'].join(''));
                callbacks.error();
                return;
            }
            else
            {
                Logger.info(['task: stop-android-emulator: emulator with id: ', id, ' exists in Gruntfile'].join(''));
                var port = emulator.start && emulator.start['-port'] || 5554;
                options['-port'] = port;
                AndroidEmulatorModule.stop(options, callbacks);
            }
        }
    });

    grunt.registerTask('unlock-android-emulator', 'Unlock Android Emulator', function (id) {
        var done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            },
            options = {},
            emulators = GruntModule.getOption('grunt_android_emulator.emulators');

        if (!id || StringModule.trim(id) === '')
        {
            Logger.error(['task: unlock-android-emulator: invalid emulator id: ', id].join(''));
            callbacks.error();
            return;
        }
        else if (!emulators || emulators.length < 1)
        {
            Logger.error('task: unlock-android-emulator: emulator configuration is missing in Gruntfile');
            callbacks.error();
            return;
        }
        else
        {
            for (var index=0, emulator; index<emulators.length; index++)
            {
                if (emulators[index] && emulators[index].id === id)
                {
                    emulator = emulators[index];
                    break;
                }
            }
            
            if (!emulator)
            {
                Logger.error(['task: unlock-android-emulator: emulator id: ', id, ' does not exist in Gruntfile'].join(''));
                callbacks.error();
                return;
            }
            else
            {
                Logger.info(['task: unlock-android-emulator: emulator with id: ', id, ' exists in Gruntfile'].join(''));
                var port = emulator.start && emulator.start['-port'] || 5554;
                options['-port'] = port;
                AndroidEmulatorModule.unlock(options, callbacks);
            }
        }
    });

    grunt.registerTask('install-apk', 'Install APK in Android Emulator', function (emulatorId, apkId) {
        var done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            },
            options = {},
            emulators = GruntModule.getOption('grunt_android_emulator.emulators'),
            apks = GruntModule.getOption(['grunt_android_emulator.apks'].join(''));

        if (!emulatorId || StringModule.trim(emulatorId) === '')
        {
            Logger.error(['task: install-apk: invalid emulator id: ', emulatorId].join(''));
            callbacks.error();
            return;
        }
        else if (!emulators || emulators.length < 1)
        {
            Logger.error('task: install-apk: emulator configuration is missing in Gruntfile');
            callbacks.error();
            return;
        }
        else if (!apks || apks.length < 1)
        {
            Logger.error(['task: install-apk: apks configuration is missing in Gruntfile'].join(''));
            callbacks.error();
            return;
        }
        else
        {
            for (var index=0, emulator; index < emulators.length; index++)
            {
                if (emulators[index] && emulators[index].id === emulatorId)
                {
                    emulator = emulators[index];
                    break;
                }
            }

            for (var apkIndex=0, apk; apkIndex < apks.length; apkIndex++)
            {
                if (apks[apkIndex] && apks[apkIndex].id === apkId)
                {
                    apk = apks[apkIndex];
                    break;
                }
            }

            if (!apk)
            {
                Logger.error(['task: install-apk: apk id: ', apkId, ' does not exist in Gruntfile'].join(''));
                callbacks.error();
                return;
            }
            else if (!emulator)
            {
                Logger.error(['task: install-apk: emulator id: ', emulatorId, ' does not exist in Gruntfile'].join(''));
                callbacks.error();
                return;
            }
            else
            {
                var apkPath = apk.path ? path.resolve(apk.path) : undefined;
                
                if (apkPath === undefined || !grunt.file.isFile(apkPath))
                {
                    Logger.error(['task: install-apk: apk path: ', apkPath, ' does not exist'].join(''));
                    callbacks.error();
                    return;
                }
                else
                {
                    var port = emulator.start && emulator.start['-port'] || 5554;
                    options['-port'] = port;
                    options['apkPath'] = apkPath;
                    AndroidEmulatorModule.installAPK(options, callbacks);
                }
            }
        }
    });
    
    grunt.registerTask('start-activity', 'Start an activity', function (emulatorId, apkId, activityId) {
        var done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            },
            options = {},
            emulators = GruntModule.getOption('grunt_android_emulator.emulators'),
            apks = GruntModule.getOption(['grunt_android_emulator.apks'].join(''));

        if (!emulatorId || StringModule.trim(emulatorId) === '')
        {
            Logger.error(['task: start-activity: invalid emulator id: ', emulatorId].join(''));
            callbacks.error();
            return;
        }
        else if (!emulators || emulators.length < 1)
        {
            Logger.error('task: start-activity: emulator configuration is missing in Gruntfile');
            callbacks.error();
            return;
        }
        else if (!apks || apks.length < 1)
        {
            Logger.error(['task: start-activity: apks configuration is missing in Gruntfile'].join(''));
            callbacks.error();
            return;
        }
        else
        {
            for (var index=0, emulator; index < emulators.length; index++)
            {
                if (emulators[index] && emulators[index].id === emulatorId)
                {
                    emulator = emulators[index];
                    break;
                }
            }

            for (var apkIndex=0, apk; apkIndex < apks.length; apkIndex++)
            {
                if (apks[apkIndex] && apks[apkIndex].id === apkId)
                {
                    apk = apks[apkIndex];
                    break;
                }
            }

            if (!apk)
            {
                Logger.error(['task: start-activity: apk id: ', apkId, ' does not exist in Gruntfile'].join(''));
                callbacks.error();
                return;
            }
            else if (!emulator)
            {
                Logger.error(['task: start-activity: emulator id: ', emulatorId, ' does not exist in Gruntfile'].join(''));
                callbacks.error();
                return;
            }
            else
            {
                var activities = apk.activities;
                if (!activities || activities.length < 1)
                {
                    Logger.error('task: start-activity: activities configuration is missing in Gruntfile');
                    callbacks.error();
                    return;
                }
                else
                {
                    for (var activityIndex=0, activity; index < activities.length; activityIndex++)
                    {
                        if (activities[activityIndex] && activities[activityIndex].id === activityId)
                        {
                            activity = activities[activityIndex];
                            break;
                        }
                    }
                
                    if (!activity || !activity.packageName || !activity.name)
                    {
                        Logger.error('task: start-activity: activity package or path is not defined: ');
                        callbacks.error();
                        return;
                    }
                    else
                    {
                        var port = emulator.start && emulator.start['-port'] || 5554;
                        options['-port'] = port;
                        options['packageName'] = activity.packageName;
                        options['activity'] = activity.name;
                        AndroidEmulatorModule.startActivity(options, callbacks);
                    }
                }
            }
        }
    });
};

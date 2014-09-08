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
var grunt = require('grunt'),
    shell = require('shelljs'),
    StringModule = require('../lib/string-module').StringModule,
    Logger = require('../lib/log-module').Logger,
    path = require('path');

module.exports.AndroidEmulatorModule =
{
    validateCreateOptions: function (options)
    {
        if (options)
        {
            var name = options['--name'] || options['-n'],
                target = options['--target'] || options['-t'],
                avdPath = options['--path'] || options['-p'],
                sdcard = options['--sdcard'] || options['-c'],
                errors;
            // name should not be empty
            if (!name || StringModule.trim(name) === '')
            {
                errors = [errors, ' name: \'', name, '\' '].join('');
            }
            // target should not be empty
            if (!target || StringModule.trim(target) === '')
            {
                errors = [errors, ' target: \'', target, '\' '].join('');
            }
            // validate path
            if (avdPath && StringModule.trim(avdPath) !== '')
            {
                var absoluteAvdPath = path.resolve(avdPath);
                if (!grunt.file.isDir(absoluteAvdPath))
                {
                    errors = [errors, ' path: \'', absoluteAvdPath, '\' '].join('');
                }
            }
            if (sdcard && StringModule.trim(sdcard) !== '')
            {
                var sdcardPath = path.resolve(sdcard);
                if (!grunt.file.isFile(sdcardPath) && !(/^[0-9]+[K|M]{1}$/.test(sdcard)))
                {
                    errors = [errors, ' sdcard: \'', sdcard, '\' '].join('');
                }
            }
            
            return errors;
        }
        return 'create: configuration is missing in Gruntfile';
    },
    create: function (options, callbacks)
    {
        if (options)
        {
            var createEmulatorCmd = 'echo no | android create avd';
            
            for (var id in options)
            {
                var value = StringModule.trim(options[id]);
                if (id)
                {
                    if (id === '--path' || id === '-p' || ((id === '--sdcard' || id === '-c') && !(/^[0-9]+[K|M]{1}$/.test(value))))
                    {
                        value = path.resolve(value);
                    }
                    createEmulatorCmd = [createEmulatorCmd, ' ', id, StringModule.trim(value) !== '' ? ' ' : '', value].join('');
                }
            }

            Logger.info(['AndroidEmulatorModule: create: ', createEmulatorCmd].join(''));

            var createEmulator = shell.exec(createEmulatorCmd, function (code, output) {
                if (code === 0 && !/Error:/.test(output) && /Do you wish to create a custom hardware profile/.test(output))
                {
                    Logger.info('AndroidEmulatorModule: create: emulator was successfully created');
                    callbacks.success();
                }
                else
                {
                    Logger.error('AndroidEmulatorModule: create: error occured');
                    callbacks.error();
                }
            });
        }
    },
    start: function (options, callbacks)
    {
        if (options)
        {
            var startEmulatorCmd = 'emulator';

            for (var id in options)
            {
                if (id)
                {
                    var value = StringModule.trim(options[id]);
                    startEmulatorCmd = [startEmulatorCmd, ' ', id, value !== '' ? ' ' : '', value].join('');
                }
            }

            Logger.info(['AndroidEmulatorModule: start: ', startEmulatorCmd].join(''));
            
            var startEmulator = shell.exec(startEmulatorCmd, function (statusCode, output) {
                if (statusCode !== 0)
                {
                    callbacks.error();
                }
            });
            
            Logger.info('AndroidEmulatorModule: start: wait to boot');
            var waitEmulatorToBootCmd = [__dirname, '/', 'wait_emulator_to_boot.sh', ' ', options['-port']].join(''),
                waitEmulatorToBootExec = shell.exec(waitEmulatorToBootCmd, function(code, output) {
                    if (code === 0 && /successfully booted/.test(output))
                    {
                        Logger.info('AndroidEmulatorModule: start: emulator booted successfully');
                        callbacks.success();
                    }
                    else
                    {
                        Logger.error('AndroidEmulatorModule: start: emulator boot failed');
                        callbacks.error();
                    }
                });
        }
    },
    stop: function (options, callbacks)
    {
        if (options)
        {
            var stopEmulatorCmd = ['adb -s emulator-', options['-port'], ' emu kill'].join('');

            Logger.info(['AndroidEmulatorModule: stop: ', stopEmulatorCmd].join(''));
            
            var stopEmulator = shell.exec(stopEmulatorCmd, function (statusCode, output) {
                if (statusCode === 0 && !/error/.test(output))
                {
                    Logger.info('AndroidEmulatorModule: stop: emulator successfully stopped');
                    callbacks.success();
                }
                else
                {
                    Logger.error('AndroidEmulatorModule: stop: emulator stop failed');
                    callbacks.error();
                }
            });
        }
    },
    unlock: function (options, callbacks)
    {
        if (options)
        {
            var unlockEmulatorCmd = ['adb -s emulator-',
                                        options['-port'],
                                        ' shell input keyevent 82 && adb -s emulator-',
                                        options['-port'],
                                        ' shell input keyevent 4'
                                    ].join('');

            Logger.info(['AndroidEmulatorModule: unlock: ', unlockEmulatorCmd].join(''));

            var unlockEmulator = shell.exec(unlockEmulatorCmd, function (statusCode, output) {
                if (statusCode === 0)
                {
                    Logger.info('AndroidEmulatorModule: unlock: emulator successfully unlocked');
                    callbacks.success();
                }
                else
                {
                    Logger.error('AndroidEmulatorModule: stop: emulator unlock failed');
                    callbacks.error();
                }
            });
        }
    },
    installAPK: function (options, callbacks)
    {
        if (options)
        {
            var installApkCmd = ['adb -s emulator-',
                                        options['-port'],
                                        ' install -r ',
                                        options['apkPath']
                                    ].join('');

            Logger.info(['AndroidEmulatorModule: installAPK: ', installApkCmd].join(''));

            var installAPK = shell.exec(installApkCmd, function (statusCode, output) {
                if (statusCode === 0)
                {
                    Logger.info('AndroidEmulatorModule: installAPK: APK successfully installed');
                    callbacks.success();
                }
                else
                {
                    Logger.error('AndroidEmulatorModule: installAPK: APK installation failed');
                    callbacks.error();
                }
            });
        }
    },
    startActivity: function (options, callbacks)
    {
        if (options)
        {
            var startActivityCmd = ['adb -s emulator-',
                                        options['-port'],
                                    ' shell am start -n ',
                                    options['packageName'],
                                    '/',
                                    options['packageName'],
                                    '.',
                                    options['activity']
                                ].join('');

            Logger.info(['AndroidEmulatorModule: startActivity: ', startActivityCmd].join(''));

            var startActivity = shell.exec(startActivityCmd, function (statusCode, output) {
                if (statusCode === 0)
                {
                    Logger.info('AndroidEmulatorModule: startActivity: activity successfully started');
                    callbacks.success();
                }
                else
                {
                    Logger.error('AndroidEmulatorModule: startActivity: activity failure');
                    callbacks.error();
                }
            });
        }
    }
};

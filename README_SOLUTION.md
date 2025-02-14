### Launching program - explanation

Before the execution needs to be sure that:

- API program it's alive to avoid errors with connection
- parameters from **_env.ts_** are steal correct - default values are defined
- domain of API program is default - **_localhost_**, if not needs to be changed in urls of **_api-handlers_**

After that, use:

```powershell
npm run start
```

which runs main program - **_src/RTCLauncher.ts_**

### API Server Emulator

For making sure that the program is working correctly with API server,
an emulator was created in **branch _api-server-emulator_** in directory **_src/api-emulator_**.

To run the emulator:
- change branch from **_default branch - master_** to **_api-server-emulator_**
- run using command:
```powershell
npm run start-with-emulator
```

### RTC Tests

Checking if program correctly processing received data, tests was created in file **_test/rtc.test.ts_**
with cases which will occur during running of the program.
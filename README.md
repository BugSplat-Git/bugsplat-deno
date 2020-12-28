[![BugSplat](https://s3.amazonaws.com/bugsplat-public/npm/header.png)](https://www.bugsplat.com)

## Introduction
BugSplat-Deno is a TypeScript error reporting system for [Deno](https://deno.land/) applications. Before continuing with the tutorial please make sure you have completed the following checklist:
* [Sign Up](https://app.bugsplat.com/v2/sign-up) as a new BugSplat user.
* [Log In](https://app.bugsplat.com/auth0/login) using your email address.

## Configuration
To add the bugsplat package to your application, run the following shell command at the root of your project’s directory:
```shell
import { BugSplat } from 'https://deno.land/x/bugsplat@todobg/bugsplat.ts';
```

Create a new instance of the BugSplat class with the name of your BugSplat database, the name of your application and the version of your application:
```js
const bugsplat = new BugSplat("DatabaseName", "AppName", "1.0.0.0");
```

Use bugsplat-deno to capture errors that originate inside of try-catch blocks:
```js
try {
    throw new Error("BugSplat");
} catch (error) {
    await bugsplat.post(error);
}
```

You can also use bugsplat-deno to post errors from non-fatal promise rejections:
```js
Promise.reject(new Error("BugSplat!")).catch(error => bugsplat.post(error, {}));
```

After posting an error with bugsplat-deno, navigate to the [Crashes](https://app.bugsplat.com/v2/crashes?database=Fred&c0=appName&f0=CONTAINS&v0=my-deno-crasher) page. You should see a new crash report for the application you just configured. Click the link in the ID column to see details about your crash on the [Crash](https://app.bugsplat.com/v2/crash?database=Fred&id=95484) page:

![Crashes](https://s3.amazonaws.com/bugsplat-public/deno/crashes.png)
![Crash](https://s3.amazonaws.com/bugsplat-public/deno/crash.png)

That’s it! Your application is now configured to post crash reports to BugSplat.

## API

In addition to the configuration demonstrated above, there are a few public methods that can be used to customize your BugSplat integration:
```ts
bugsplat.setDefaultAppKey(appKey); // Additional metadata that can be queried via BugSplat's web application
bugsplat.setDefaultUser(user); // The name or id of your user
bugsplat.setDefaultEmail(email); // The email of your user
bugsplat.setDefaultDescription(description); // Additional info about your crash that gets reset after every post
async bugsplat.post(error, options); // Posts an arbitrary Error object to BugSplat
// If the values options.appKey, options.user, options.email, options.description are set the corresponding default values will be overwritten
// Returns a promise that resolves with properties: error (if there was an error posting to BugSplat), response (the response from the BugSplat crash post API), and original (the error passed by bugsplat.post)
```

## Contributing

BugSplat loves open source software! Please check out our project on [GitHub](https://github.com/BugSplat-Git/bugsplat-deno) and send us a Pull Request.
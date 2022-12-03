import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Amplify, { API} from 'aws-amplify';

const getEnvironmentEndPoint = () => {
  //console.log(process.env.NODE_ENV);
  return "https://n5gtz7ou22.execute-api.ap-southeast-2.amazonaws.com/dev";
}

console.log(getEnvironmentEndPoint());

Amplify.configure({
    Auth: {
      // REQUIRED - Amazon Cognito Identity Pool ID
      identityPoolId: "ap-southeast-2:4d305a0a-b0be-4c0f-908b-376ac07f9bab",
      // REQUIRED - Amazon Cognito Region
      mandatorySignIn: false,
      region: "ap-southeast-2",
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: "ap-southeast-2_535p3zx8z",
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: "4b4clhjpqjpm5m91b265shtett"
    },
    API: {
      endpoints: [
        {
          name: "dev-API",
          endpoint: getEnvironmentEndPoint(),
          region: "ap-southeast-2"
        }
      ]
    }//,
    // Storage: {
    //   AWSS3: {
    //     bucket: '', //REQUIRED -  Amazon S3 bucket
    //     region: 'ap-southeast-2', //OPTIONAL -  Amazon service region
    //   }
    // }
  });



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

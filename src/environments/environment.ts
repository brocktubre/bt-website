// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  aws_identity_pool_id: 'us-east-1:9ec9ca94-5d0f-4be2-bdd5-1ab0c0bbbd8c',
  region: 'us-east-1',
  public_bucket_name: 'brocktubre-s3-sandbox-bucket',
  dynamodb_table_name: 'brocktubre-s3-lambda-dynamodb-integration-sandbox-table',
  auth0: {
    clientID: 'o10co8Eu-ethIXGsm36vwKdvbIY9FdTp',
    domain: 'brocktubre.auth0.com',
    responseType: 'token id_token',
    audience: 'https://brocktubre.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile'
  },
  qrReader: {
    s3: {
      qrCodeCaptureBucket: 'qr-code-capture'
    },
    apiGateway: {
      processQrCodeUrl: 'https://dr1yb4vbs0.execute-api.us-east-1.amazonaws.com/integration/process-code/'
    },
    dynamoDb : {
      tableName: 'qr-code-info'
    }
  },
  grades: {
    dynamoDb : {
      tableName: 'grades-table'
    },
    lambda : {
      functionName: 'get-grades-with-secret-id',
      functionNameGetTotal: 'get-total-points'
    }
  },
  firehose : {
    stream_name: 'website-capture-sandbox-delivery-stream'
  },
  kinesis : {
    stream_name: 'website-sandbox-kinesis-data-stream'
  },
  cuhackit: {
    api: {
      get_tweets: 'https://iaxktfzlre.execute-api.us-east-1.amazonaws.com/integration/get-tweets'
    }
  },
  brewStats: {
    // tslint:disable-next-line:max-line-length
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwLzGAPosqMgL2iPjpERprc5T9Mfi_PAatkjwG6CSm_O0L46fuH7ddJOPUJy6PRWtLoOMhpZvbhJGD/pubhtml?gid=0&single=true',
    // tslint:disable-next-line:max-line-length
    jsonUrl: 'https://spreadsheets.google.com/feeds/list/1FTIzhYpEeWyCXQJBHUyuyO3F_6Bqg91qA4e_RV2mZOk/od6/public/values?alt=json'
  }
};

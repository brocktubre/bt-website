import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class KinesisSandboxService {
  private kinesis;

  constructor(private authService: AuthService) {
    AWS.config.update({
      accessKeyId: localStorage.getItem('accessKeyId'),
      secretAccessKey: localStorage.getItem('secretAccessKey'),
      sessionToken: localStorage.getItem('sessionToken')
    });
    const creds = new AWS.Credentials(AWS.config.credentials);
    this.kinesis = new AWS.Kinesis({ region: environment.region, signatureVersion: 'v4', credentials: creds });
  }

  public putMouseMoveRecord(payload: any) {
    const params = {
        Data: JSON.stringify(payload), /* Strings will be Base-64 encoded on your behalf */ /* required */
        PartitionKey: uuid(), /* required */
        StreamName: environment.kinesis.stream_name
    };
    this.kinesis.putRecord(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      }
    });

    // var params = {
    //   Data: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */, /* required */
    //   PartitionKey: 'STRING_VALUE', /* required */
    //   StreamName: 'STRING_VALUE', /* required */
    //   ExplicitHashKey: 'STRING_VALUE',
    //   SequenceNumberForOrdering: 'STRING_VALUE'
    // };
    // kinesis.putRecord(params, function(err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else     console.log(data);           // successful response
    // });
  }

}

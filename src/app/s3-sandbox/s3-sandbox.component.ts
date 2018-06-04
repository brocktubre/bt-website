import { S3SandboxService } from './s3-sandbox.service';
import { S3ObjectModel } from './../shared/models/s3-object.model';
import { environment } from './../../environments/environment';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-s3-sandbox',
  templateUrl: './s3-sandbox.component.html',
  styleUrls: ['./s3-sandbox.component.css']
})
export class S3SandboxComponent implements OnInit {
  public aws;
  public s3;
  public objectList: Array<S3ObjectModel>;
  public loadingObjs: boolean;
  public bucketName: string;
  public fileToUpload: any;

  @ViewChild('fileInput') myFileInput: ElementRef;
  @ViewChild('fileInputVal') myFileInputVal: ElementRef;

  constructor(private s3SandboxService: S3SandboxService) {
    this.objectList = new Array<S3ObjectModel>();
    this.loadingObjs = false;
    this.bucketName = environment.public_bucket_name;
  }

  ngOnInit() {
    // this.s3SandboxService.getItemsFromBucket(this.bucketName).subscribe(items => {
    //   this.objectList = items;
    //   this.loadingObjs = false;
    // });
  }

  public fileChanged($event) {
    const file = this.myFileInput.nativeElement.files[0];

    if (file === undefined) {
      console.log('Cancel selected. Do nothing. ', file);

    } else {
      console.log('File change detected. ', file);
      this.myFileInputVal.nativeElement.value = file.name;
      this.fileToUpload = file;
    }

  }

  public uploadObject() {
    const file = this.myFileInputVal.nativeElement.files;

    if (file === undefined) {
      console.log('No file selected.');
    }else {
      console.log('We want to upload this document: ', this.fileToUpload);
      this.s3SandboxService.uploadObjectToS3(this.fileToUpload);
    }
  }

}

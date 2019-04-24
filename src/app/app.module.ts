import { KinesisSandboxService } from './shared/kinesis-sandbox/kinesis-sandbox.service';
import { LambdaSandboxService } from './shared/lambda-sandbox/lambda-sandbox.service';
import { QrReaderService } from './shared/qr-reader/qr-reader.service';
import { DynamodbSandboxService } from './shared/dynamodb-sandbox/dynamodb-sandbox.service';
import { S3SandboxService } from './shared/s3-sandbox/s3-sandbox.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { S3SandboxComponent } from './shared/s3-sandbox/s3-sandbox.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { AuthService } from './shared/auth/auth.service';
import { AuthGuardService } from './shared/auth/auth-guard.service';
import { ValidationMessagesService } from './shared/validation-messages/validation-messages.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationMessagesComponent } from './shared/validation-messages/validation-messages.component';
import { CallbackComponent } from './shared/callback/callback.component';
import { QrReaderComponent } from './shared/qr-reader/qr-reader.component';
import { HttpClientModule } from '@angular/common/http';
import { AttendanceComponent } from './shared/qr-reader/attendance/attendance.component';
import { MomentModule } from 'angular2-moment/moment.module';
import { GradesComponent } from './shared/grades/grades.component';
import { AuthHelper } from './shared/auth/auth.helper';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { FirehoseSandboxService } from './shared/firehose-sandbox/firehose-sandbox.service';
import { CUHackitComponent } from './shared/cuhackit/cuhackit.component';
import { ComprehendSandboxService } from './shared/comprehend-sandbox/comprehend-sandbox.service';
import { QuizQuestionHelperComponent } from './src/app/shared/quiz-question-helper/quiz-question-helper.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    PortfolioComponent,
    FooterComponent,
    NavbarComponent,
    S3SandboxComponent,
    ValidationMessagesComponent,
    CallbackComponent,
    QrReaderComponent,
    AttendanceComponent,
    GradesComponent,
    CUHackitComponent,
    QuizQuestionHelperComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BsModalModule,
    ReactiveFormsModule,
    HttpClientModule,
    MomentModule,
    Ng2TableModule
  ],
  providers: [
    Title,
    S3SandboxService,
    DynamodbSandboxService,
    AuthService,
    AuthGuardService,
    ValidationMessagesService,
    QrReaderService,
    LambdaSandboxService,
    AuthHelper,
    KinesisSandboxService,
    FirehoseSandboxService,
    ComprehendSandboxService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

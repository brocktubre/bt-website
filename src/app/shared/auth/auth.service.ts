import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User;
  public accessKeyId: string;
  public secretKey: string;
  public expiration: Date;
  public sessionToken: string;

  constructor(private _firebaseAuth: AngularFireAuth,
              private router: Router) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe((user) => {
        if (user) {
          this.userDetails = user;
          console.log(this.userDetails);
        }else {
          this.userDetails = null;
        }
    });
  }

  public signInRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public isLoggedIn() {
    if (!this.userDetails) {
        return false;
    } else {
        return true;
    }
  }

  public logout() {
      this._firebaseAuth.auth.signOut().then((res) => {
        this.userDetails = null;
        this.router.navigate(['home']);
      });
  }

  public getUsersDeatils() {
    return this.userDetails;
  }

  public setIdentity(dataIdentityId: any) {
    this.accessKeyId = dataIdentityId.Credentials.AccessKeyId;
    this.secretKey = dataIdentityId.Credentials.SecretKey;
    this.expiration = dataIdentityId.Credentials.Expiration;
    this.sessionToken = dataIdentityId.Credentials.SessionToken;
  }

}
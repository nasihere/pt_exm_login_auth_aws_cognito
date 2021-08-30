import { Request, Response } from 'express';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

let pems: { [key: string]: any }  = {}

class AuthMiddleware {
  private poolRegion: string = 'us-east-2';
  private userPoolId: string = 'us-east-2_75kdy7fh8';

  constructor() {
    this.setUp()
  }


  private async setUp() {
    const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;

    try {
      const response = await fetch(URL);
      if (response.status !== 200) {
        throw 'request not successful'
      }
      const data = await response.json();
      const { keys } = data;
        for (let i = 0; i < keys.length; i++) {
          const key_id = keys[i].kid;
          const modulus = keys[i].n;
          const exponent = keys[i].e;
          const key_type = keys[i].kty;
          const jwk = { kty: key_type, n: modulus, e: exponent };
          const pem = jwkToPem(jwk);
          pems[key_id] = pem;
        }
        console.log("got PEMS")
    } catch (error) {
      console.log(error)
      console.log('Error! Unable to download JWKs');
    }
  }
}

export default AuthMiddleware
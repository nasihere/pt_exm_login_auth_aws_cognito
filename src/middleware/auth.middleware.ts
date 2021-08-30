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
  public verifyToken(req: Request, resp: Response, next): void {
    console.log("Middleware", req.path)
    const nonSecurePaths = ['/', '/auth/signin', '/auth/signup','/auth/verify'];
    if (nonSecurePaths.includes(req.path)) return next();
    
    
    const  token = req.header("authorization");
    if (!token) {
      console.log("No token found");
      return resp.status(401).end();
    }

    let decodedJwt: any = jwt.decode(token, { complete: true });
    if (decodedJwt === null) {
      console.log("verify expired");
      resp.status(401).end()
      return
    }
    console.log(decodedJwt)
    let kid = decodedJwt.header.kid;
    let pem = pems[kid];
    console.log(pem)
    if (!pem) {
      console.log("verify expired");
      resp.status(401).end()
      return
    }
    jwt.verify(token, pem, function (err: any, payload: any) {
      if (err) {
        console.log("verify expired", err);
        resp.status(401).end()
        return
      } else {
        next()
      }
    })
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
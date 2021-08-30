import AWS from 'aws-sdk';
import crypto from 'crypto'

export default class Cognito {
  private config = {
    apiVersion: '2016-04-18',
    region: 'us-east-2',
  }
  private secretHash = '1ba5hoadk8eb91b4fj072dkn5q0c7p3osa946socp6pvmp7qhh9d'
  private clientId = '7bdvubmre22p6j95lpa85p1ua1';

  private cognitoIdentity;

  constructor(){
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config)
  }

  public async signUpUser(username: string, password: string, userAttr: Array<any>): Promise<boolean> {
    
    var params = {
      ClientId: this.clientId, /* required */
      Password: password, /* required */
      Username: username, /* required */
      SecretHash: this.hashSecret(username),
      UserAttributes: userAttr,
    }

    try {
      const data = await this.cognitoIdentity.signUp(params).promise()
      console.log(data)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public async signInUser(username: string, password: string): Promise<boolean> {
    var params = {
      AuthFlow: 'USER_PASSWORD_AUTH', /* required */
      ClientId: this.clientId, /* required */
      AuthParameters: {
        'USERNAME': username,
        'PASSWORD': password,
        'SECRET_HASH': this.hashSecret(username)
      },
    }

    try {
      let data = await this.cognitoIdentity.initiateAuth(params).promise();
      console.log(data); 
      return data;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  public async confirmSignUp(username: string, code: string): Promise<boolean> {
    var params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      Username: username,
      SecretHash: this.hashSecret(username),
    };

    try {
      const cognitoResp = await this.cognitoIdentity.confirmSignUp(params).promise();
      console.log(cognitoResp)
      return true
    } catch (error) {
      console.log("error", error)
      return false
    }
  }

  public async getUser(authorization: string): Promise<boolean> {
    var params = {
      AccessToken: authorization
    }
    console.log('params',params)

    try {
      let data = await this.cognitoIdentity.getUser(params).promise();
      console.log(data); 
      return data;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

 
  private hashSecret(username: string): string {
    return crypto.createHmac('SHA256', this.secretHash)
    .update(username + this.clientId)
    .digest('base64')  
  } 
}
/*

Mobile proto is still part of naming (user pool & user pool client names)
=> should use `id` in naming instead of CognitoStack (e.g. MobileProtoUserPool)
=> better naming conventions would be welcome too...

For Robot tests two emails are needed:
- existing-user@example.com
- testemail@example.com
=> maybe not worth it to make these automatic...

*/

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

export class CognitoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // User Pool
    const userPool = new cognito.UserPool(this, "CognitoStackUserPool", {
      userPoolName: "mobile-proto-user-pool",
      selfSignUpEnabled: true,
      signInAliases: { email: true },
    });

    // App Client for Mobile Proto Frontend
    const userPoolClient = new cognito.UserPoolClient(
      this,
      "CognitoStackFrontendClient",
      {
        userPool,
        userPoolClientName: "mobile-proto-frontend",
        authFlows: {
          custom: true,
          userPassword: true,
          userSrp: true,
        },
      }
    );

    // Identity Pool
    const identityPool = new cognito.CfnIdentityPool(
      this,
      "CognitoStackIdentityPool",
      {
        allowUnauthenticatedIdentities: false,
        cognitoIdentityProviders: [
          {
            clientId: userPoolClient.userPoolClientId,
            providerName: userPool.userPoolProviderName,
          },
        ],
      }
    );

    // Lambda Role
    const lambdaRole = new iam.Role(
      this,
      "CognitoStackPreSignUpLambdaExecutionRole",
      {
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole"
          ),
        ],
      }
    );

    // Pre-Signup Lambda Function
    const preSignUpLambda = new lambda.Function(
      this,
      "CognitoStackPreSignUpLambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset("pre-signup-lambda"),
        role: lambdaRole,
      }
    );

    // Attach Lambda as Pre-Signup Trigger
    userPool.addTrigger(cognito.UserPoolOperation.PRE_SIGN_UP, preSignUpLambda);

    // IAM Policy: CognitoStackPersonalS3
    const cognitoStackPersonalS3Policy = new iam.ManagedPolicy(
      this,
      "CognitoStackPersonalS3Policy",
      {
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["s3:ListBucket"],
            resources: ["arn:aws:s3:::diory-mobile-proto"],
            conditions: {
              StringLike: {
                // Only from user's own folder /users/$identityId/*
                "s3:prefix": ["users/${cognito-identity.amazonaws.com:sub}/*"],
              },
            },
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["s3:GetObject", "s3:PutObject"],
            resources: [
              // Only from user's own folder /users/$identityId/*
              "arn:aws:s3:::diory-mobile-proto/users/${cognito-identity.amazonaws.com:sub}/*",
            ],
          }),
        ],
      }
    );

    // IAM Policy: CognitoStackGetAWSCredentials
    const cognitoStackGetAWSCredentialsPolicy = new iam.ManagedPolicy(
      this,
      "CognitoStackGetAWSCredentialsPolicy",
      {
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["cognito-identity:GetCredentialsForIdentity"],
            resources: [
              cdk.Arn.format(
                {
                  service: "cognito-identity",
                  resource: "identitypool",
                  resourceName: identityPool.ref,
                },
                this
              ),
            ],
          }),
        ],
      }
    );

    // IAM Role for Authenticated Cognito Users
    const authenticatedRole = new iam.Role(this, "CognitoStackCommonUser", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      inlinePolicies: {
        CognitoStackPersonalS3Policy: cognitoStackPersonalS3Policy.document,
        CognitoStackGetAWSCredentialsPolicy:
          cognitoStackGetAWSCredentialsPolicy.document,
      },
    });

    // Attach Authenticated Role to Identity Pool
    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      "IdentityPoolRoleAttachment",
      {
        identityPoolId: identityPool.ref,
        roles: {
          authenticated: authenticatedRole.roleArn,
        },
      }
    );

    // Export as stack outputs
    new cdk.CfnOutput(this, "IdentityPoolIdOutput", {
      value: identityPool.ref,
      exportName: "IdentityPoolId",
    });

    new cdk.CfnOutput(this, "UserPoolIdOutput", {
      value: userPool.userPoolId,
      exportName: "UserPoolId",
    });

    new cdk.CfnOutput(this, "UserPoolClientIdOutput", {
      value: userPoolClient.userPoolClientId,
      exportName: "UserPoolClientId",
    });

    new cdk.CfnOutput(this, "RegionOutput", {
      value: this.region,
      exportName: "AppRegion",
    });
  }
}

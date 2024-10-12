import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

export class CognitoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // User Pool
    const userPool = new cognito.UserPool(this, "MyUserPool", {
      userPoolName: "my-user-pool",
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
    });

    // Identity Pool
    const identityPool = new cognito.CfnIdentityPool(this, "MyIdentityPool", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPool.userPoolId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    // Lambda Role
    const lambdaRole = new iam.Role(this, "LambdaExecutionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
    });

    // Pre-Signup Lambda Function
    // const preSignUpLambda = new lambda.Function(this, "PreSignUpLambda", {
    //   runtime: lambda.Runtime.NODEJS_20_X,
    //   handler: "index.handler",
    //   code: lambda.Code.fromAsset("cognito-pre-signup-lambda"),
    //   role: lambdaRole,
    // });

    // Attach Lambda as Pre-Signup Trigger
    // userPool.addTrigger(cognito.UserPoolOperation.PRE_SIGN_UP, preSignUpLambda);

    // IAM Role for Authenticated Cognito Users
    const authenticatedRole = new iam.Role(this, "CognitoAuthenticatedRole", {
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
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3ReadOnlyAccess"),
      ],
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
  }
}

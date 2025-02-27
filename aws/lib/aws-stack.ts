import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import {StackConfiguration} from "./stack-configuration";
import * as ssm from 'aws-cdk-lib/aws-ssm';

export class AwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const openIdConnectProviderArn = ssm.StringParameter.valueForStringParameter(this, "/eks/openIdConnectProviderArn");
    const openIdConnectProviderIssuer = ssm.StringParameter.valueForStringParameter(this, "/eks/openIdConnectProviderIssuer");
    const stringEqualsJson = new cdk.CfnJson(this, "OIDCStringEquals", {
      value: {
        [`${openIdConnectProviderIssuer}`]: "sts.amazonaws.com"
      }
    });
    const secretsRole = new iam.Role(this, 'SecretsRole', {
      roleName: 'argocd-secrets-role',
      assumedBy: new iam.FederatedPrincipal(
          openIdConnectProviderArn,
          {
            StringEquals: stringEqualsJson,
          },
          'sts:AssumeRoleWithWebIdentity'
      ),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('SecretsManagerReadWrite')],
    });

    new secretsmanager.Secret(this, 'ArgocdProtoTypeSecret', {
      secretName: 'argocd-prototype',
      secretObjectValue: {
        NAME: cdk.SecretValue.unsafePlainText(StackConfiguration.getName()),
      },
    });
  }
}

import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import {StackConfiguration} from "./stack-configuration";
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'MySQSQueue', {
      queueName: 'argocd-prototype-queue',
      visibilityTimeout: cdk.Duration.seconds(30),
    });

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

    secretsRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "sqs:SendMessage",
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      resources: [queue.queueArn],
    }));
    new secretsmanager.Secret(this, 'ArgocdProtoTypeSecret', {
      secretName: 'argocd-prototype',
      secretObjectValue: {
        NAME: cdk.SecretValue.unsafePlainText(StackConfiguration.getName()),
      },
    });
  }
}

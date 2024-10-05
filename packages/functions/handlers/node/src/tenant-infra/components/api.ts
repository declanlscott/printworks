import * as aws from "@pulumi/aws";
import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";

import { resource } from "../resource";

export interface ApiArgs {
  tenantId: string;
  papercutSecureBridgeFunctionArn: aws.lambda.Function["arn"];
}

export class Api extends pulumi.ComponentResource {
  private static instance: Api;

  private restApi: aws.apigateway.RestApi;
  private restApiPolicy: aws.apigateway.RestApiPolicy;

  private papercutResource: aws.apigateway.Resource;
  private secureBridgeResource: aws.apigateway.Resource;
  private papercutSecureBridgeRoutes: Array<PapercutSecureBridgeRoute> = [];

  private logGroup: aws.cloudwatch.LogGroup;
  private deployment: aws.apigateway.Deployment;
  private stage: aws.apigateway.Stage;
  private certificate: aws.acm.Certificate;
  private domainName: aws.apigateway.DomainName;
  private basePathMapping: aws.apigateway.BasePathMapping;

  public static getInstance(
    args: ApiArgs,
    opts: pulumi.ComponentResourceOptions,
  ): Api {
    if (!this.instance) this.instance = new Api(args, opts);

    return this.instance;
  }

  private constructor(...[args, opts]: Parameters<typeof Api.getInstance>) {
    super(`${resource.AppData.name}:aws:Api`, "Api", args, opts);

    this.restApi = new aws.apigateway.RestApi(
      "Api",
      {
        endpointConfiguration: {
          types: "REGIONAL",
        },
      },
      { ...opts, parent: this },
    );

    this.restApiPolicy = new aws.apigateway.RestApiPolicy(
      "Policy",
      {
        restApiId: this.restApi.id,
        policy: aws.iam.getPolicyDocumentOutput({
          statements: [
            {
              effect: "Allow",
              principals: [
                {
                  type: "AWS",
                  identifiers: [resource.WebOutputs.server.roleArn],
                },
              ],
              actions: ["execute-api:Invoke"],
              resources: [this.restApi.executionArn],
            },
          ],
        }).json,
      },
      { ...opts, parent: this },
    );

    this.papercutResource = new aws.apigateway.Resource(
      "PapercutResource",
      {
        restApi: this.restApi.id,
        parentId: this.restApi.rootResourceId,
        pathPart: "papercut",
      },
      { ...opts, parent: this },
    );

    this.secureBridgeResource = new aws.apigateway.Resource(
      "SecureBridgeResource",
      {
        restApi: this.restApi.id,
        parentId: this.papercutResource.id,
        pathPart: "secure-bridge",
      },
      { ...opts, parent: this },
    );

    this.papercutSecureBridgeRoutes.push(
      new PapercutSecureBridgeRoute(
        "AdjustSharedAccountAccountBalanceRoute",
        {
          restApiId: this.restApi.id,
          parentId: this.secureBridgeResource.id,
          pathPart: "adjustSharedAccountAccountBalance",
          requestSchema: {
            sharedAccountName: {
              type: "string",
            },
            adjustment: {
              type: "number",
            },
            comment: {
              type: "string",
            },
          },
          functionArn: args.papercutSecureBridgeFunctionArn,
        },
        { ...opts, parent: this },
      ),
    );

    this.papercutSecureBridgeRoutes.push(
      new PapercutSecureBridgeRoute(
        "GetSharedAccountPropertiesRoute",
        {
          restApiId: this.restApi.id,
          parentId: this.secureBridgeResource.id,
          pathPart: "getSharedAccountProperties",
          requestSchema: {
            sharedAccountName: {
              type: "string",
            },
            properties: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          functionArn: args.papercutSecureBridgeFunctionArn,
        },
        { ...opts, parent: this },
      ),
    );

    this.papercutSecureBridgeRoutes.push(
      new PapercutSecureBridgeRoute(
        "IsUserExistsRoute",
        {
          restApiId: this.restApi.id,
          parentId: this.secureBridgeResource.id,
          pathPart: "isUserExists",
          requestSchema: {
            username: {
              type: "string",
            },
          },
          functionArn: args.papercutSecureBridgeFunctionArn,
        },
        { ...opts, parent: this },
      ),
    );

    this.papercutSecureBridgeRoutes.push(
      new PapercutSecureBridgeRoute(
        "ListSharedAccountsRoute",
        {
          restApiId: this.restApi.id,
          parentId: this.secureBridgeResource.id,
          pathPart: "listSharedAccounts",
          requestSchema: {
            offset: {
              type: "integer",
            },
            limit: {
              type: "integer",
            },
          },
          functionArn: args.papercutSecureBridgeFunctionArn,
        },
        { ...opts, parent: this },
      ),
    );

    this.papercutSecureBridgeRoutes.push(
      new PapercutSecureBridgeRoute(
        "ListUserSharedAccountsRoute",
        {
          restApiId: this.restApi.id,
          parentId: this.secureBridgeResource.id,
          pathPart: "listUserSharedAccounts",
          requestSchema: {
            username: {
              type: "string",
            },
            offset: {
              type: "integer",
            },
            limit: {
              type: "integer",
            },
            ignoreUserAccountSelectionConfig: {
              type: "boolean",
            },
          },
          functionArn: args.papercutSecureBridgeFunctionArn,
        },
        { ...opts, parent: this },
      ),
    );

    this.logGroup = new aws.cloudwatch.LogGroup(
      "LogGroup",
      {
        name: pulumi.interpolate`/aws/vendedlogs/apis/${this.restApi.name}`,
        retentionInDays: 14,
      },
      { ...opts, parent: this },
    );

    this.deployment = new aws.apigateway.Deployment(
      "Deployment",
      {
        restApi: this.restApi.id,
        // TODO: Better triggers based on above resources
        triggers: {
          deployedAt: new Date().toISOString(),
        },
      },
      { ...opts, parent: this },
    );

    this.stage = new aws.apigateway.Stage(
      "Stage",
      {
        restApi: this.restApi.id,
        stageName: resource.AppData.stage,
        deployment: this.deployment.id,
        accessLogSettings: {
          destinationArn: this.logGroup.arn,
          format: JSON.stringify({
            // request info
            requestTime: `"$context.requestTime"`,
            requestId: `"$context.requestId"`,
            httpMethod: `"$context.httpMethod"`,
            path: `"$context.path"`,
            resourcePath: `"$context.resourcePath"`,
            status: `$context.status`, // integer value, do not wrap in quotes
            responseLatency: `$context.responseLatency`, // integer value, do not wrap in quotes
            xrayTraceId: `"$context.xrayTraceId"`,
            // integration info
            functionResponseStatus: `"$context.integration.status"`,
            integrationRequestId: `"$context.integration.requestId"`,
            integrationLatency: `"$context.integration.latency"`,
            integrationServiceStatus: `"$context.integration.integrationStatus"`,
            // caller info
            ip: `"$context.identity.sourceIp"`,
            userAgent: `"$context.identity.userAgent"`,
            principalId: `"$context.authorizer.principalId"`,
          }),
        },
      },
      { ...opts, parent: this },
    );

    this.certificate = new aws.acm.Certificate(
      "Certificate",
      {
        domainName: `api.${args.tenantId}.${resource.AppData.domainName.fullyQualified}`,
        validationMethod: "DNS",
      },
      { ...opts, parent: this },
    );

    this.domainName = new aws.apigateway.DomainName(
      "DomainName",
      {
        domainName: this.certificate.domainName,
        regionalCertificateArn: this.certificate.arn,
      },
      { ...opts, parent: this },
    );

    this.certificate.domainValidationOptions.apply((options) =>
      options.map(
        (option, index) =>
          new cloudflare.Record(
            `CertificateValidationRecord${index}`,
            {
              zoneId: cloudflare
                .getZone({ name: resource.AppData.domainName.value })
                .then((zone) => zone.id),
              name: option.resourceRecordName,
              content: option.resourceRecordValue,
              type: option.resourceRecordType,
            },
            { ...opts, parent: this },
          ),
      ),
    );

    this.basePathMapping = new aws.apigateway.BasePathMapping(
      "BasePathMapping",
      {
        restApi: this.restApi.id,
        domainName: this.domainName.id,
        stageName: this.stage.stageName,
      },
      { ...opts, parent: this },
    );

    this.registerOutputs({
      api: this.restApi.id,
      policy: this.restApiPolicy.id,
      papercutResource: this.papercutResource.id,
      secureBridgeResource: this.secureBridgeResource.id,
      logGroup: this.logGroup.id,
      deployment: this.deployment.id,
      stage: this.stage.id,
      certificate: this.certificate.id,
      domainName: this.domainName.id,
      basePathMapping: this.basePathMapping.id,
    });
  }
}

interface PapercutSecureBridgeRouteArgs {
  restApiId: aws.apigateway.RestApi["id"];
  parentId: aws.apigateway.Resource["id"];
  pathPart: pulumi.Input<string>;
  requestSchema: pulumi.Input<Record<string, unknown>>;
  functionArn: aws.lambda.Function["arn"];
}

class PapercutSecureBridgeRoute extends pulumi.ComponentResource {
  private resource: aws.apigateway.Resource;
  private requestValidator: aws.apigateway.RequestValidator;
  private requestModel: aws.apigateway.Model;
  private method: aws.apigateway.Method;
  private integration: aws.apigateway.Integration;

  public constructor(
    name: string,
    args: PapercutSecureBridgeRouteArgs,
    opts: pulumi.ComponentResourceOptions,
  ) {
    super(
      `${resource.AppData.name}:aws:PapercutSecureBridgeRoute`,
      name,
      args,
      opts,
    );

    this.resource = new aws.apigateway.Resource(
      `${name}Resource`,
      {
        restApi: args.restApiId,
        parentId: args.parentId,
        pathPart: args.pathPart,
      },
      { ...opts, parent: this },
    );

    this.requestValidator = new aws.apigateway.RequestValidator(
      `${name}RequestValidator`,
      {
        restApi: args.restApiId,
        validateRequestBody: true,
        validateRequestParameters: false,
      },
      { ...opts, parent: this },
    );

    this.requestModel = new aws.apigateway.Model(
      `${name}RequestModel`,
      {
        restApi: args.restApiId,
        contentType: "application/json",
        schema: pulumi.jsonStringify({
          $schema: "http://json-schema.org/draft-04/schema#",
          title: `${name}RequestModel`,
          type: "object",
          properties: args.requestSchema,
        }),
      },
      { ...opts, parent: this },
    );

    this.method = new aws.apigateway.Method(
      `${name}Method`,
      {
        restApi: args.restApiId,
        resourceId: this.resource.id,
        httpMethod: "POST",
        authorization: "AWS_IAM",
        requestValidatorId: this.requestValidator.id,
        requestModels: {
          "application/json": this.requestModel.id,
        },
      },
      { ...opts, parent: this },
    );

    this.integration = new aws.apigateway.Integration(
      `${name}Integration`,
      {
        restApi: args.restApiId,
        resourceId: this.resource.id,
        httpMethod: this.method.httpMethod,
        integrationHttpMethod: "POST",
        type: "AWS_PROXY",
        uri: args.functionArn,
      },
      { ...opts, parent: this },
    );

    this.registerOutputs({
      resource: this.resource.id,
      requestValidator: this.requestValidator.id,
      requestModel: this.requestModel.id,
      method: this.method.id,
      integration: this.integration.id,
    });
  }
}
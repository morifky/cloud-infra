# Engineering Task Notes

My notes for the Tripla engineering [tasks](https://github.com/umami-dev/interview/blob/main/terraform-parse/README.md)

## 1. Create `Terraform-Parse` Service

I chose to use Node.js (Fastify framework) with TypeScript.

### High Level
 1. Receive a POST request with a JSON payload.
 2. Parse the payload and validate it.
 3. I store the Terraform resource model definitions that act as resource templates. The idea here is to make it versioned and easy to update later. For example, if AWS releases a new version of the S3 resource, I can just update the model definition, and the service will use the new version automatically.
 4. There are steps to map between user input and the resource templates.
 5. Next, there are steps to generate HCL files.

I put the code in the `terraform_parse_service` folder.

## 2. Infrastructure (Terraform)

Some improvements I made:

1. Created separate modules for both `s3` and `eks`.
2. Made the modules generic and reusable.
3. In order to handle multi-environment infrastructure, I chose to use something I call the "overlay pattern." The generic Terraform module can be overlaid with environment-specific configuration, and each environment can have its own configuration.
To make this work, I leveraged a tool called 'terragrunt'. This way, I can see the benefit of having the infrastructure configuration remain declarative while still keeping the same source from the generic Terraform module.

## 3. Platform (Kubernetes + Helm)

The original Helm chart did not work because there was no templating syntax inside the `templates` directory.

Some improvements I made:

    1. Enabled proper Helm templating. Thus, we can adjust the configuration from the `values.yaml` file.
    2. Improved Kubernetes code, including proper resource definitions, liveness probes, readiness probes, rolling update strategies, etc.
    3. Fixed the backend application settings. Added the `"-listen=:<PORT>"` argument so we can override the container port listener properly.
    4. Confirmed that the frontend pod can send requests to the backend pod.
```
➜  helm git:(main) ✗ kubectl exec -it tripla-apps-frontend-77b854dbbb-qfr2j sh
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl exec [POD] -- [COMMAND] instead.
# curl -XGET http://tripla-apps-backend-svc/
hello
```

## 4. Thoughts on managing multi-environments
My thought on this is to keep the configuration declarative.

GitOps implementation will help to keep every single piece of infrastructure and application configuration in sync with the desired state while keeping it declarative.

For infrastructure, my approach for the infrastructure level is the same as what I described in point 2, when I refactored the Terraform code.

For the application level, I'd prefer to use `kustomize` instead of Helm.
I think it can provide value by keeping the configuration declarative for each different environment configuration (kustomize overlay pattern) while keeping the base manifest generic and reusable.

## 5. AI Usage

I took this engineering task as an opportunity to see how AI can help me boost my productivity. I can see the benefit of being more focused on the outcome I intend (design idea, architecture decision, etc.), and letting AI help me with the code generation.
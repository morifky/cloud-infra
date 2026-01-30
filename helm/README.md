## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+

## Installing the Chart

To install the chart with the release name `my-release`:

```console
helm install my-release ./helm
```

The command deploys Tripla Apps on the Kubernetes cluster in the default configuration. The [Configuration](#configuration) section lists the parameters that can be configured during installation.

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```console
helm uninstall my-release
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Configuration

The following table lists the configurable parameters of the Tripla Apps chart and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `nameOverride` | Override the name of the chart | `""` |
| `fullnameOverride` | Override the full name of the chart | `""` |
| `namespace` | Override the Release namespace if set | `""` |
| `commonLabels` | Common labels to add to all resources | `{}` |
| `commonAnnotations` | Common annotations to add to all resources | `{}` |
| `frontend.replicas` | Number of frontend replicas | `1` |
| `frontend.image.repository` | Frontend image repository | `nginx` |
| `frontend.image.tag` | Frontend image tag | `stable` |
| `frontend.service.type` | Frontend service type | `ClusterIP` |
| `frontend.service.port` | Frontend service port | `80` |
| `frontend.resources` | Frontend resource requests/limits | See `values.yaml` |
| `backend.replicas` | Number of backend replicas | `1` |
| `backend.image.repository` | Backend image repository | `hashicorp/http-echo` |
| `backend.image.tag` | Backend image tag | `1.0.0` |
| `backend.service.type` | Backend service type | `ClusterIP` |
| `backend.service.port` | Backend service port | `80` |
| `backend.hpa.enabled` | Enable Horizontal Pod Autoscaler for backend | `true` |
| `backend.hpa.minReplicas` | Minimum number of backend replicas | `1` |
| `backend.hpa.maxReplicas` | Maximum number of backend replicas | `10` |
| `backend.resources` | Backend resource requests/limits | See `values.yaml` |

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`. For example:

```console
helm install my-release ./helm \
  --set frontend.replicas=2 \
  --set backend.hpa.maxReplicas=5
```

Alternatively, a YAML file that specifies the values for the above parameters can be provided while installing the chart. For example:

```console
helm install my-release ./helm -f values.yaml
```

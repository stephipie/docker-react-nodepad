# My Notepad Chart

This Helm chart deploys a full-stack notepad application with React frontend, Node.js backend, and PostgreSQL database.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- kubectl configured with a Kubernetes cluster
- A Kubernetes Ingress controller (like nginx-ingress)

## Installing the Chart

1. Add the Bitnami repository for PostgreSQL dependency:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

2. Install the chart:
```bash
helm install my-notepad-app ./deploy/helm/my-notepad-chart \
  --namespace your-namespace \
  --create-namespace \
  --set database.auth.password=your-password \
  --set database.auth.postgresPassword=your-postgres-password
```

## Configuration

The following table lists the configurable parameters of the my-notepad chart and their default values:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `frontend.replicaCount` | Number of frontend replicas | `1` |
| `frontend.image.repository` | Frontend image repository | `stephipie/frontend-app` |
| `frontend.image.tag` | Frontend image tag | `latest` |
| `backend.replicaCount` | Number of backend replicas | `1` |
| `backend.image.repository` | Backend image repository | `stephipie/backend-app` |
| `backend.image.tag` | Backend image tag | `latest` |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.host` | Ingress hostname | `my-notepad.local` |

## Accessing the Application

Once installed, you can access the application through the configured ingress host:

1. Add the ingress hostname to your /etc/hosts file:
```bash
echo "127.0.0.1 my-notepad.local" | sudo tee -a /etc/hosts
```

2. Access the application at http://my-notepad.local

## Uninstalling the Chart

To uninstall the chart:
```bash
helm uninstall my-notepad-app
```

## Development

### Updating Dependencies
```bash
helm dependency update
```

### Local Testing
```bash
# Lint the chart
helm lint .

# Test template rendering
helm template .
```

### Helm Chart for Application Deployment

This Helm chart deploys an application along with its associated Kubernetes resources, including a Deployment, Service, Ingress, Secret, Service, and ServiceAccount.

---

### Components

#### Deployment

```
Deploys the application container based on the specified Docker image.
Configurable parameters include the application name, Docker image, and secret references.
```

#### Ingress

```
Creates an ALB (Application Load Balancer) ingress with specified annotations for health checks, SSL redirection, and certificate management.
Supports defining custom domains.
```

#### Service

```
Exposes the application through a `NodePort` service for access within the cluster or externally via the Ingress.
```

#### Secret

```
Manages sensitive data like JWT secrets.
Automatically encodes secret values in base64.
```

#### ServiceAccount

```
Configures access to AWS services (e.g., Amazon S3) through IAM roles via the service account.
```

---

### Prerequisites

1. Kubernetes cluster running in AWS with EKS.
2. Helm 3 installed on your local machine.
3. AWS IAM Role for Service Accounts (IRSA) configured for accessing AWS services (if needed).
4. AWS ALB Ingress Controller installed in the cluster.

---

### Installation

1. Clone the repository containing the Helm chart.

   ```bash
   git clone <repository-url>
   cd <chart-directory>
   ```


2. Deploy with `values.yaml`:

   ```bash
   helm install <release-name> . -f values.yaml
   ```

---

### Configuration

#### Default Values

The following are configurable in the `values.yaml` file:

```yaml
appName: my-app
image:
  repository: nginx
  tag: latest
  pullPolicy: IfNotPresent

aws:
  certificate: "arn:aws:acm:region:account:certificate/certificate-id"
  ingressClassName: alb
  roleArn: "arn:aws:iam::account-id:role/role-name"

networking:
  subdomain: "app"

baseDomain: example.com

jwtSecretData:
  SECRET_KEY: "my-secret-key"
  ANOTHER_SECRET: "another-secret-key"
```

#### Key Parameters

- **`appName`**: Name of the application.
- **`image.repository`**: Docker image repository.
- **`image.tag`**: Docker image tag.
- **`aws.certificate`**: ARN of the ACM certificate for HTTPS.
- **`aws.ingressClassName`**: Ingress class name (e.g., `alb`).
- **`aws.roleArn`**: IAM Role ARN for the ServiceAccount.
- **`networking.subdomain`**: Subdomain for the application.
- **`baseDomain`**: Base domain for the application.
- **`jwtSecretData`**: Key-value pairs for secrets, automatically encoded to base64.

---

### Resources Created

1. **Deployment**
   ```
   Runs the application with the specified Docker image.
   ```
2. **Service**
   ```
   Exposes the application on port 80 using a `NodePort` service.
   ```
3. **Ingress**
   ```
   Routes traffic through an ALB and sets up SSL termination with the provided certificate.
   ```
4. **Secret**
   ```
   Stores sensitive application configuration, such as JWT keys.
   ```
5. **ServiceAccount**
   ```
   Grants the pod access to AWS services using an IAM role.
   ```

---

### Example Usage

To deploy the application with custom values:

1. Use `values.yaml` file:

   ```yaml
   appName: my-app
   image:
     repository: my-docker-repo/my-app
     tag: v1.0.0

   aws:
     certificate: "arn:aws:acm:region:account:certificate-id"
     ingressClassName: alb
     roleArn: "arn:aws:iam::account-id:role/role-name"

   networking:
     subdomain: "myapp"

   baseDomain: mydomain.com

   jwtSecretData:
     SECRET_KEY: "my-secret-key"
     API_TOKEN: "my-api-token"
   ```

2. Install the chart:

   ```bash
   helm install my-app-release . -f values.yaml
   ```

3. Verify the deployment:

   ```bash
   kubectl get all
   ```

---

### Accessing the Application

1. The application will be accessible at `http://<subdomain>.<baseDomain>` or `https://<subdomain>.<baseDomain>`.
2. Check the Ingress resource for the assigned DNS:
   ```bash
   kubectl get ingress <release-name>-ingress
   ```

---

### Uninstallation

To uninstall the release:

```bash
helm uninstall <release-name>
```

This will remove all Kubernetes resources associated with the release.

---

### Notes

- Ensure that the `alb.ingress.kubernetes.io/certificate-arn` annotation points to a valid ACM certificate.
- The `eks.amazonaws.com/role-arn` annotation in the ServiceAccount must match an existing IAM role with sufficient permissions.
- The values.yaml contains valid parameters that will deploy nginx server and expose it to test.stage.kartenmacherei.de
-  After deployment, you may need to wait a few minutes for the DNS of test.stage.kartenmacherei.de to propagate.








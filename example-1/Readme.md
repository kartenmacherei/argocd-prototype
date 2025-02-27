# Key Features of Pods:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
```


### Smallest Unit in Kubernetes

A pod is the most granular unit of deployment, management, and scaling in Kubernetes.
Where Your Logic Runs

### Where Your Logic Runs

Pods host one or more containers that run your application logic, whether it's a web server, a database, or a background worker.

### Ephemeral Nature
Pods are temporary and can be restarted or rescheduled by Kubernetes if a node fails or an update is needed.

### Managed by Higher-Level Controllers

Since pods are short-lived, they are typically managed by controllers like:
Deployments (for scalable, stateless apps)
StatefulSets (for stateful apps like databases)
DaemonSets (for running a pod on every node)

### Inter-Pod Communication

Each pod gets a unique IP address and can communicate with other pods using ClusterIP services or DNS-based service discovery.
Scaling with Replicas

##  Pods are not directly scaled; instead, they are scaled via ReplicaSets or Deployments, ensuring high availability.

__________ 

# Why Use a Deployment?


```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3  # Runs 3 instances (pods)
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
```

### Manages Pods Automatically

Instead of manually creating and managing pods, a Deployment ensures the right number of replicas are running.

### Self-Healing

If a pod crashes or a node fails, the Deployment will recreate the pod automatically.

### Rolling Updates & Rollbacks

Enables seamless updates without downtime and allows rollbacks in case of failures.

### Scalability

Easily scale your application up or down by changing the number of replicas.

_______ 
# Why Use a Service?

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx  # Matches pods with label app=nginx
  ports:
    - protocol: TCP
      port: 80         # Service port
      targetPort: 80   # Pod's containerPort
  type: ClusterIP  # Default service type
```

### Stable Networking

Pods get dynamic IPs when restarted, but a Service provides a fixed IP (ClusterIP) and DNS name to access them.

### Load Balancing

Distributes traffic across multiple pods behind the service.

### Pod Discovery

Enables pods to communicate using a DNS-based service name instead of IP addresses.

### External Access

Some service types allow exposing applications outside the cluster.

_________________________________

### SSH into a pod: 

`kubectl exec -it debug-pod -- sh`


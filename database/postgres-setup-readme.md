Per codebase review, PostgreSQL should be deployed as a stateful service to ensure data persistence and stability. 
Here’s how we can set it up step-by-step:

Step 1: Create a Namespace for PostgreSQL
First, create a dedicated namespace for PostgreSQL to keep it isolated and organized:

```
kubectl create namespace solid-api-2024

```


Step 2: Create Persistent Storage for PostgreSQL

PostgreSQL needs persistent storage to store the database files. We will use a PersistentVolumeClaim (PVC) to create storage that survives pod restarts.

Create a file named postgres-pvc.yaml with the following content:
```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: solid-api-2024
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi

```
Next, apply the PersistentVolumeClaim:

```
kubectl apply -f postgres-pvc.yaml
```


Step 3: Create a Deployment for PostgreSQL

Create Kubernetes Secrets:
- Create a Kubernetes secret to store the database credentials:

```
kubectl create secret generic postgres-credentials \
  --from-literal=username=postgres \
  --from-literal=password=postgres \
  --from-literal=database=fullstack-challenge-prod \
  -n solid-api-2024

```

- Create a file named postgres-deployment.yaml with the following configuration to deploy PostgreSQL:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: solid-api-2024
  labels:
    app: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:13-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: password
        - name: POSTGRES_DB
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: database
        volumeMounts:
        - mountPath: /var/lib/postgresql/data
          name: postgres-storage
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
```

Apply the deployment:

```
kubectl apply -f postgres-deployment.yaml
```


Step 4: Expose PostgreSQL as a Service

To allow other pods and services in the cluster to connect to the PostgreSQL database, expose it as a ClusterIP service:
Create a file named postgres-service.yaml with the following content:
```
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: solid-api-2024
spec:
  type: ClusterIP
  ports:
  - port: 5432
    targetPort: 5432
  selector:
    app: postgres

```
Apply the service:

```
kubectl apply -f postgres-service.yaml
```

Step 5: Verify the Setup

1. Check the Pods:
	- Verify that the PostgreSQL pod is running:
```
kubectl get pods -n solid-api-2024
```
2. Check the service:
	- Verify that the PostgreSQL service is up:
```
kubectl get svc -n solid-api-2024
```

We should see a ClusterIP service named postgres listening on port 5432.


Step 6: Update Application to Use PostgreSQL

Now that PostgreSQL is running in the cluster, we need to update the testbed application's configuration to connect to this database: (in database/config.json)(here it aligns with industry best practice)

```
{
  "prod": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "port": process.env.DB_PORT,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  },
  "dev": {
    "username": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": 5432,
    "database": "fullstack-challenge-dev",
    "dialect": "postgres",
    "dialectOptions": {}
  }
}

```
- Update the environment variables in the application deployment manifest to point to the PostgreSQL service.
- Example environment variables for Node.JS app:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-api
  namespace: default
  labels:
    app: nodejs-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nodejs-api
  template:
    metadata:
      labels:
        app: nodejs-api
    spec:
      containers:
      - name: nodejs-api
        image: ghcr.io/<github-repo-name>/node-api:latest
        ports:
        - containerPort: 5050
        env:
        - name: DB_HOST
          value: "postgres.postgres.svc.cluster.local"  # Service name of PostgreSQL in Kubernetes
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: password
        - name: DB_NAME
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: database
        - name: DB_PORT
          value: "5432"

```
Note: The DB_HOST is set to postgres.postgres.svc.cluster.local, which is the internal DNS for accessing the postgres service in the postgres namespace.


Summary of PostgreSQL Setup:

1. Create Namespace for PostgreSQL to keep it organized.
2. Create Persistent Storage using a PersistentVolumeClaim to store database data.
3. Deploy PostgreSQL as a deployment with environment variables.
4. Expose PostgreSQL as a ClusterIP service for internal cluster access.
5. Update Application Configuration to connect to PostgreSQL using the internal service DNS name.
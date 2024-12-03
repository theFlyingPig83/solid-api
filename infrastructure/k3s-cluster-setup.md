How to manually setup k3s:

A. Master Node

1. Install K3s:
- Run the following command to install K3s on the master node:

```
curl -sfL https://get.k3s.io | sh -
```

- K3s will be installed and configured to run as the control plane on the master node.

2. Get the Node Token:
- To allow the worker node to join the cluster, you need the node token:

```
sudo cat /var/lib/rancher/k3s/server/node-token
```
- Copy the node token. We will need it to join the worker node to the master node.

3. Verify Installation:
- Run the following command to verify that K3s is running:

```
sudo k3s kubectl get nodes
```

- Now we should see the master node listed.
node token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (masked)


B. Worker Node

1. Install K3s and Join the Master Node:
- Install K3s on the worker node and provide the master node IP and node token obtained earlier:

```
curl -sfL https://get.k3s.io | K3S_URL=https://<master_node_ip>:6443 K3S_TOKEN=<node_token> sh -

```

- Replace <master_node_ip> with the IP address of the master node and <node_token> with the node token you copied.

2. Verify Worker Node Joining:
- On the master node, run the following command to verify that the worker has successfully joined the cluster:

```
sudo k3s kubectl get nodes
```

- We should see both the master and worker nodes listed.


C. Set Up Kubeconfig for Managing the Cluster

1. Get Kubeconfig from the Master Node:
	- The kubeconfig file, which contains the configuration to access the cluster, is located at /etc/rancher/k3s/k3s.yaml on the master node.
	- To access the cluster from your local machine, copy the kubeconfig file:
	
```
scp -i id_xxx root@<master_node_ip>:/etc/rancher/k3s/k3s.yaml ~/.kube/config

```

Note: Make sure your local directory ~/.kube/ exists AND edit the config file to use remote master node IP. 

2. Update Kubeconfig Permissions:
	- Update the permissions to secure the kubeconfig file:
```
chmod 600 ~/.kube/config

```

3. Verify Local Access:
	- To confirm that you can interact with the K3s cluster from your local machine, run:
	- 
```
kubectl get nodes

```

We should see both the master and worker nodes listed locally!
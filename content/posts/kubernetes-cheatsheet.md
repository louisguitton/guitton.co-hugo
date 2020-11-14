---
title: Kubernetes Deployment Cheat Sheet
date: 2020-07-16
lastmod: 2020-11-09
categories:
  - Code
summary: Get a Kubectl Cheat Sheet to use Kubernetes and Helm in practice. Troubleshoot your deployment and your application. Updated regularly.
keywords:
  - kubernetes cheat sheet
  - kubectl cheat sheet
  - kubectl exec
  - kubectl commands
images:
  - /images/kubernetes_cheat_sheet.png
---

This is the Kubectl Cheat Sheet I wrote for my team at OneFootball. It is designed **to help you use Kubernetes and Helm in practice.** You will learn how to troubleshoot your deployment and your application.

Last updated on: {{< lastmod >}}

![Kubernetes Cheat Sheet](/images/kubernetes_cheat_sheet.png "Kubernetes Cheat Sheet")

## Prerequisites: doublecheck your setup

You will need to **check your kubernetes context**, for example you might want to switch between a staging kubernetes cluster and a production cluster.

You will want to double **check your helm versions** too. One ⚠️ thing to pay attention to is whether you have the same version in your client than in your cluster.

```sh
# Kubectl Alias
alias k=kubectl

# check your context
k config current-context

# switch context
k config use-context <context>

# check versions
helm version

# check you see all releases, if not: it might be due to you using
# a higher helm version than on the cluster
helm ls

# convenience command to permanently save the namespace
# for all subsequent kubectl commands in that context
k config set-context --current --namespace=<your-default-namespace>
```

## Use the Kubernetes Dashboard

The Kubernetes Dashboard is a web-based Kubernetes user interface. While most of the commands in this cheat sheet are about the `kubectl` CLI, **using a GUI can be helpful**, especially when you're starting out.

In particular, you can use Dashboard to get an overview of applications running on your cluster, as well as for creating or modifying individual Kubernetes resources, or troubleshoot your containerized application. For example you can scale a Deployment, restart a pod etc...

```sh
k proxy
```

```sh
open http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
```

## Debbuging the helm deployment

When you're deploying a new application, things can go wrong for many reasons: the pod can't pull the docker image, or the liveliness probes fail for some reason etc... Here are commands to help you debug your deployment.

```sh
# check Kubernetes logs
# We create objects with `helm`, not with `kubectl` directly.
helm status <my-deployment>
# or get your pod name and describe it
k get po -o wide
k describe po <my-pod>

# if you're facing a CrashLoopBackOff, it's useful to access the logs from the previous (crashed) instance using -p
k logs po <my-pod> -p

# profile CPU and memory consumption on nodes
k describe nodes | egrep 'Name:|Resource' -A2 | grep -v Roles | grep -v Labels

# manually scale down and up the deployment, it will use the latest pod
# useful when pod is stuck due to lack of resources,
# or if your chart change was ambassador-only
k scale deployment <my-deployment> --replicas=0
k scale deployment <my-deployment> --replicas=1
```

## Debugging the deployed application

Once the application is deployed, it can still fail. You then need to investigate the application itself. You can do so by checking its logs or port-forwarding the application to your local machine.

```sh
# check the application logs
k logs -f -l app=<my-deployment>
# or get your pod name and check the logs
k get po -o wide
k logs <my-pod>

# ssh into the pod
k exec --stdin --tty <my-pod> -- /bin/sh

# listen on port 5000 on the local machine and forward to port 8501 on the pod
k port-forward <my-pod> 5000:8501
```

## Debugging Ambassador configs

If you're using a reverse proxy in front of your application, things could fail there too. Here are commands to debug your Ambassador configs.

```sh
# open the Ambassador UI
k port-forward svc/ambassador-private-admin -n ambassador 8877
open http://localhost:8877/ambassador/v0/diag/

# watch Ambassador logs
k logs -f -n ambassador \
    -l release=ambassador-private \
    --max-log-requests 6 \
    -c ambassador
```

## Other Useful Bits

```sh
# Retrieve a k8s secret
kubectl get secrets <my-deployment> \
    -o jsonpath="{.data.POSTGRES_PASSWORD}" | base64 --decode
```

```yml
apiVersion: apps/v1
kind: Deployment  # create a deployment of a container
---
apiVersion: v1
kind: Service  # create a service, that allows us to connect to a given deployment
---
apiVersion: v1
kind: PersistentVolume  # create a "disk" that provides space for pods to store data
```

## References

- [kubectl Cheat Sheet | Kubernetes](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [#Helm #Kubernetes #cheatsheet, happy helming!](https://gist.github.com/tuannvm/4e1bcc993f683ee275ed36e67c30ac49)
- [Troubleshoot Applications | Kubernetes](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application)
- [Debug Running Pods | Kubernetes](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/)

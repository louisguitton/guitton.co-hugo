---
title: Kubernetes Deployment Cheatsheet
date: 2020-07-16
categories:
  - Code
summary: Get a Kubectl Cheat Sheet to use Kubernetes and Helm in practice. Troubleshoot your deployment and your application. Updated regularly.
keywords:
  - kubernetes cheat sheet
  - kubectl cheat sheet
  - kubectl exec
  - kubectl commands
lastmod: 2020-11-09
---

This is the Kubectl Cheat Sheet I wrote for my team at OneFootball. It is designed **to help you use Kubernetes and Helm in practice.** You will learn how to troubleshoot your deployment and your application.

Last updated on: {{< lastmod >}}

## Prerequisites: check your setup

```sh
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

## Kubernetes Dashboard

```sh
k proxy
```

```sh
open http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
```

## Debbuging the helm deployment

We create objects with `helm`, not with `kubectl` directly.

```sh
# check Kubernetes logs
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

## Debugging the application

```sh
# check the application logs
k logs -f -l app=<my-deployment>
# or get your pod name and check the logs
k get po -o wide
k logs <my-pod>

# ssh into the pod
kubectl exec --stdin --tty <my-pod> -- /bin/sh

# listen on port 5000 on the local machine and forward to port 8501 on the pod
kubectl port-forward <my-pod> 5000:8501
```

## Debugging Ambassador configs

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

## Others

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

## References

- [kubectl Cheat Sheet | Kubernetes](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [#Helm #Kubernetes #cheatsheet, happy helming!](https://gist.github.com/tuannvm/4e1bcc993f683ee275ed36e67c30ac49)
- [Troubleshoot Applications | Kubernetes](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application)
- [Debug Running Pods | Kubernetes](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/)

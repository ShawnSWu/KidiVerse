# Kubernetes 

Welcome to the **Kubernetes** documentation — your *ultimate guide* to deploying, scaling, and managing containerized applications.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Components](#core-components)
3. [Useful Commands](#useful-commands)
4. [Cluster Setup](#cluster-setup)
5. [Links and Resources](#links-and-resources)
6. [Tasks](#tasks)
7. [Footnotes](#footnotes)

---

## Overview

> Kubernetes (commonly referred to as **K8s**) is an open-source system for automating deployment, scaling, and management of containerized applications.

Kubernetes was initially designed by Google[^1] and is now maintained by the [CNCF](https://www.cncf.io).

Here is a logo:

![Kubernetes Logo](https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg)

Use `kubectl version` to check the version of your Kubernetes CLI.

---

## Core Components

| Component      | Description                       |
| -------------- | --------------------------------- |
| kube-apiserver | Handles all REST requests         |
| etcd           | Key-value store for configuration |
| kube-scheduler | Assigns pods to nodes             |
| kubelet        | Manages pods on a worker node     |
| controller     | Controller                        |
~~kube-up.sh~~ has been deprecated in favor of kubeadm.

Some components are optional but useful:

* *Dashboard UI*
* **Helm** for package management
* ~~Heapster~~ (deprecated)

---

### Controller

![[controller.gif]]

## Useful Commands

### Code Block

``` bash
kubectl get pods -A
kubectl describe node
```
### Inline Code

Use `kubectl get svc` to list services.

### HTML Key Bindings

To exit a watch command, press <kbd>Ctrl</kbd> + <kbd>C</kbd>.

---

## Cluster Setup

1. Install **Minikube** or **Kind**
2. Start the Kubernetes cluster
3. Deploy your first pod
4. Validate with `kubectl get pods`

Nested tasks:

* Setup kubeconfig

  * Copy config to `~/.kube/config`
  * Use `kubectl config use-context`

---

## Links and Resources

* [Kubernetes Official Docs](https://kubernetes.io/docs)
* [CNCF Projects](https://www.cncf.io/projects/)

### Image

![[master_node.png]]

---

## Tasks

* [x] Install kubectl
* [x] Create a namespace
* [ ] Deploy a sample app
* [ ] Configure Ingress rules

---
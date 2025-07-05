# Ingress

An **Ingress** acts like an application-layer (Layer-7) router.  
It watches your cluster for Ingress resources and programs the underlying load balancer (NGINX, Traefik, etc.) to map hostnames + paths → cluster Services.

![Ingress](Ingress.png)

---

## Minimal HTTPS Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    # Force HTTPS and redirect HTTP → HTTPS (NGINX example)
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  ingressClassName: nginx               # which controller should handle this
  tls:
  - hosts:
    - demo.example.com
    secretName: demo-tls                # pre-created TLS secret (kubectl create secret tls …)

  rules:
  - host: demo.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-svc
            port:
              number: 80

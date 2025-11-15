# inventory-system

Deploy to Minikube — step-by-step
1.	Start minikube:
minikube start --driver=docker
2.	Build docker images inside minikube so Kubernetes can pull them directly (recommended):
# load minikube docker env so `docker build` produces images in minikube's Docker daemon
eval $(minikube -p minikube docker-env)

# from project root
docker build -t inventory-backend:latest ./backend
docker build -t inventory-frontend:latest ./frontend
3.	Apply k8s manifests:
kubectl apply -f k8s/postgres-secret.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
4.	Get minikube IP and open the frontend:
minikube ip
# then open http://<minikube-ip>:30000
5.	If something fails, check logs:
kubectl get pods
kubectl logs deployment/inventory-backend
kubectl logs deployment/postgres

# inventory-system

Deploy to Minikube — step-by-step
1.	Start minikube:
minikube start

2.	Build docker images inside minikube so Kubernetes can pull them directly Docker daemon
eval $(minikube -p minikube docker-env)

# from project root
docker build -t inventory-backend:latest ./backend
docker build -t inventory-frontend:latest ./frontend

3.	Apply k8s manifests:
cd ./k8s
kubectl apply -f .

kubectl apply -f k8s/.

kubectl apply -f k8s/postgres-secret.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

4.	Get minikube IP and open the frontend:
kubectl port-forward svc/inventory-backend 8000:8000
kubectl port-forward svc/inventory-frontend 3000:3000

5.	If something fails, check logs:
kubectl get pods
kubectl logs deployment/inventory-frontend
kubectl logs deployment/inventory-backend
kubectl logs deployment/postgres

ลบ Docker image ที่อยู่ใน Kubernetes nodes
docker image prune -a

docker build -t inventory-frontend:latest ./frontend
kubectl rollout restart deployment inventory-frontend
kubectl port-forward svc/inventory-frontend 3000:3000

docker system prune -a -f
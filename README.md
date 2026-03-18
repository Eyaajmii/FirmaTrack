🐾 Firma Track - Guide Complet
Firma Track est une solution complète de suivi et de gestion, intégrant une architecture Cloud-Simulé performante. Le projet combine un backend robuste sous Spring Boot, une application mobile React Native avec mode hors-ligne, et une interface d'administration React (pp. 1-3).
🏗️ Architecture Technique
Le projet repose sur une isolation totale via une Machine Virtuelle Ubuntu Server 22.04 LTS (VirtualBox) utilisant la conteneurisation Docker (p. 2).
Backend : API REST Spring Boot, Sécurité JWT, PostgreSQL 15 (p. 2).
Mobile : React Native avec base SQLite locale pour la synchronisation hors-ligne (p. 4).
Web : Interface Admin React (p. 3).
Infrastructure : Docker & Docker-Compose (Services : DB, API) (p. 2).
🚀 Fonctionnalités Clés
Sécurité & Accès : Gestion des identités via Spring Security et cryptage BCrypt (p. 4).
Géo-services : Intégration de Google Maps API pour la localisation des vétérinaires (p. 4).
Synchronisation Intelligente : Mode hors-ligne avec SQLite et détection automatique de reconnexion pour envoi vers l'API (p. 4).
Système d'Alertes : Notifications push via Firebase FCM (p. 4).
Espace Communautaire : Forum de questions/réponses avec système de commentaires (p. 4).
🛠️ Installation et Prérequis
Logiciels nécessaires (p. 5)
Node.js (LTS 20+) : Pour les parties React et React Native.
JDK 17 ou 21 : Pour le backend Spring Boot.
Docker Desktop : Pour la gestion des conteneurs.
Environnement VM : VirtualBox ou VMware (Ubuntu Server).
Lancement Rapide
Infrastructure : Lancez la VM et les conteneurs Docker via docker-compose up (p. 6).
Backend : Importez /firma-backend dans IntelliJ IDEA et lancez l'application (pp. 3, 5).
Mobile : Configurez l'émulateur Android Studio et lancez le projet dans /firma-mobile via VS Code (p. 5).
📊 Gestion du Projet (Méthodologie Agile)
Le projet suit un workflow Scrum strict (p. 3) :
Trello : Pilotage des sprints (Backlog, In Progress, Code Review, Done).
Git Workflow :
Branche main protégée (aucun push direct).
Branches de fonctionnalités : feature-nom-module.
Pull Requests validées par le Scrum Master uniquement.
Branche main protégée (aucun push direct).
Branches de fonctionnalités : feature-nom-module.
Pull Requests validées par le Scrum Master uniquement

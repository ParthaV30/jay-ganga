pipeline {
    agent any

    environment {
        IMAGE_NAME = "jay-ganga-app"
        CONTAINER_NAME = "jay-ganga-container"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Clone Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/ParthaV30/jay-ganga.git'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build --no-cache -t $IMAGE_NAME .
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker run -d -p 3000:3000 \
                --name $CONTAINER_NAME \
                $IMAGE_NAME
                '''
            }
        }
    }
}
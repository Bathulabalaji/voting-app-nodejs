pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/Bathulabalaji/voting-app-nodejs', branch: 'main'
            }
        }
    }

    post {
        always {
            echo 'Build finished'
        }
    }
}


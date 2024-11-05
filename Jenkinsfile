pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/Bathulabalaji/voting-app-nodejs', branch: 'main'
            }
        }
        stage('Build') {
            steps {
                echo "Code has been checked out!"
                bat 'node server.js'
            }
        }
    }

    post {
        always {
            //echo 'Build finished'
            emailext body: 'build completed', subject: 'Jenkins new file building', to: 'bathulabalaji04@gmail.com'
        }
    }
}


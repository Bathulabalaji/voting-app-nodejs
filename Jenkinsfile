pipeline {
    agent { label 'your-slave-label' }
 
    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/Bathulabalaji/voting-app-nodejs', branch: 'main'
            }
        }
 
    post {
        always {
            echo 'Build finished'
        }
    }
}

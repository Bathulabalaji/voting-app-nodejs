pipeline {
    agent { label 'your-slave-label' }
 
    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/ruchir-panchamukhi/demo-githubactions', branch: 'main'
            }
        }
 
    post {
        always {
            echo 'Build finished'
        }
    }
}

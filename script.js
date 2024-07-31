document.addEventListener("DOMContentLoaded", function () {
    loadProjects();
});

function loadProjects() {
    fetch('projects/project1.json')
        .then(response => response.json())
        .then(data => {
            const projectList = document.getElementById('projects');
            projectList.innerHTML = '';

            data.projects.forEach(project => {
                const li = document.createElement('li');
                li.textContent = project.name;
                li.addEventListener('click', () => loadWorkflow(project));
                projectList.appendChild(li);
            });
        });
}

function loadWorkflow(project) {
    const workflowList = document.getElementById('workflow-steps');
    workflowList.innerHTML = '';

    project.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step.name;
        if (step.completed) {
            li.classList.add('completed');
        }
        li.addEventListener('click', () => toggleStepCompletion(li, step));
        workflowList.appendChild(li);
    });
}

function toggleStepCompletion(li, step) {
    step.completed = !step.completed;
    li.classList.toggle('completed');
    // Here you could save the updated state to a server or local storage
}

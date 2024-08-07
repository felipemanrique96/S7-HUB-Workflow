document.addEventListener('DOMContentLoaded', function () {
    const phases = document.querySelectorAll('.phase');
    const connectors = {
        'phase1': document.querySelector('.connector1'),
        'phase2': document.querySelector('.connector2'),
        'phase3': document.querySelector('.connector3'),
        'phase4': document.querySelector('.connector4'),
        'phase5': null // No connector after the last phase
    };
    const sideConnectorLeft = document.querySelector('.side-connector-left');
    const sideConnectorRight = document.querySelector('.side-connector-right');
    const resetButton = document.getElementById('resetButton');
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popupTitle');
    const popupList = document.getElementById('popupList');
    const popupPhaseNumber = document.getElementById('popupPhaseNumber');
    const completionRatio = document.getElementById('completionRatio');
    const completionPercentage = document.getElementById('completionPercentage');
    const commentPopup = document.getElementById('commentPopup');
    const commentText = document.getElementById('commentText');
    const saveCommentButton = document.getElementById('saveComment');
    const closeCommentPopupButton = document.getElementById('closeCommentPopup');
    const closePopupButton = document.getElementById('closePopup');
    const projectProgress = document.getElementById('projectProgress');

    const projectIdInput = document.getElementById('projectIdInput');
    const loadProjectButton = document.getElementById('loadProjectButton');
    const saveButton = document.getElementById('saveButton');

    let currentCommentItem = null;
    let currentPhaseId = null;
    let currentIndex = null;

    const phaseDetails = {
        'phase1': {
            title: 'ANALISI',
            items: [
                'Definire rilievo e sistema di rilevamento',
                'Se è un progetto esistente definire nuvola di punti',
                'Paragonare rilievo con la cartografia comunale',
                'Far partire le indagini geologiche - Analisi chimica, permeabilità e capacità portante del terreno',
                'Analisi dei sottoservizi',
                'Analisi urbanistica',
                'Definire team di lavoro interno e RTP',
                'Prevedere le attività da esternalizzare'
            ],
        },
        'phase2': {
            title: 'KICK-OFF',
            items: [
                'Primo checkup economico',
                'Check up struttura',
                'Checkup antincendio',
                'Definire le prime stratigrafie',
            ],
        },
        'phase3': {
            title: 'AUTORIZZAZIONI',
            items: [
                'Definire gli enti a convocare',
                'Conferenza dei servizi',
                'Creare un riassunto dei pareri',
                'Prevedere le integrazioni richieste',
            ],
        },
        'phase4': {
            title: 'SVILUPPO',
            items: [
                'Definire stratigrafie finale',
                'Comporre i diversi abachi',
                'Secondo Checkup economico',
            ],
        },
        'phase5': {
            title: 'DETTAGLIO',
            items: [
                'Definire i dettagli tecnologici',
                'Confermare i preventivi che sono stati richiesti prima',
                'Check up economico finale',
            ],
        },
    };

    function fetchProjectsFromLocalStorage() {
        const projects = JSON.parse(localStorage.getItem('projects')) || {};
        console.log('Projects from Local Storage:', projects); // Log the projects from local storage
        return projects;
    }

    function saveProjectsToLocalStorage(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    function syncProjectList() {
        const projects = fetchProjectsFromLocalStorage();
        updateProjectDropdown(projects);
    }

    function updateProjectDropdown(projects) {
        projectIdInput.innerHTML = '<option value="">Select a project</option>';

        Object.entries(projects).forEach(([id, name]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${id} - ${name}`;
            projectIdInput.appendChild(option);
        });
    }

    function loadState(projectId) {
        const state = JSON.parse(localStorage.getItem(`popupState-${projectId}`)) || {};
        return state;
    }

    function saveState(projectId, state) {
        localStorage.setItem(`popupState-${projectId}`, JSON.stringify(state));
    }

    function updateCompletionInfo(phaseId) {
        const state = loadState(projectIdInput.value);
        const items = phaseDetails[phaseId].items;
        const completedItems = items.filter((item, index) => state[phaseId] && state[phaseId][index]);
        const total = items.length;
        const completed = completedItems.length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        completionRatio.textContent = `${completed}/${total}`;
        completionPercentage.textContent = `${percentage}%`;

        const phase = document.getElementById(phaseId);
        let percentageElement = phase.querySelector('.phase-percentage');
        let progressBar = phase.querySelector('.progress-bar');

        if (!percentageElement) {
            percentageElement = document.createElement('div');
            percentageElement.classList.add('phase-percentage');
            phase.appendChild(percentageElement);
        }

        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.classList.add('progress-bar');
            phase.appendChild(progressBar);
        }

        percentageElement.textContent = `${percentage}%`;
        progressBar.style.width = `${percentage}%`;

        const connector = connectors[phaseId];
        if (connector) {
            if (percentage === 100) {
                connector.classList.add('active');
            } else {
                connector.classList.remove('active');
            }
        }

        if (phaseId === 'phase1' && sideConnectorLeft) {
            if (percentage > 0) {
                sideConnectorLeft.classList.add('active');
            } else {
                sideConnectorLeft.classList.remove('active');
            }
        }
        if (phaseId === 'phase5' && sideConnectorRight) {
            if (percentage === 100) {
                sideConnectorRight.classList.add('active');
            } else {
                sideConnectorRight.classList.remove('active');
            }
        }
        
        updateProjectProgress(); 
    }

    function updateProjectProgress() {
        const state = loadState(projectIdInput.value);
        const phases = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'];
        let totalPercentage = 0;
        let phaseCount = 0;

        phases.forEach(phaseId => {
            const items = phaseDetails[phaseId].items;
            const completedItems = items.filter((item, index) => state[phaseId] && state[phaseId][index]);
            const total = items.length;
            const completed = completedItems.length;
            const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
            totalPercentage += percentage;
            phaseCount++;
        });

        const averagePercentage = phaseCount === 0 ? 0 : Math.round(totalPercentage / phaseCount);
        projectProgress.textContent = `Project Progress: ${averagePercentage}%`;
    }

    function populatePopup(phaseId) {
        const state = loadState(projectIdInput.value);
        popupTitle.textContent = phaseDetails[phaseId].title;
        popupList.innerHTML = ''; 
        phaseDetails[phaseId].items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            if (state[phaseId] && state[phaseId][index]) {
                listItem.classList.add('checked');
            }
            const commentIcon = document.createElement('span');
            commentIcon.classList.add('comment-icon');
            commentIcon.classList.add(state[phaseId] && state[phaseId].comments && state[phaseId].comments[index] ? 'filled' : 'unfilled');
            commentIcon.addEventListener('click', function (event) {
                event.stopPropagation();
                openCommentPopup(listItem, phaseId, index);
            });
            listItem.appendChild(commentIcon);

            listItem.addEventListener('click', function () {
                this.classList.toggle('checked');
                const currentState = loadState(projectIdInput.value);
                if (!currentState[phaseId]) {
                    currentState[phaseId] = {};
                }
                currentState[phaseId][index] = this.classList.contains('checked');
                saveState(projectIdInput.value, currentState);
                updateCompletionInfo(phaseId);
            });
            popupList.appendChild(listItem);
        });
        popupPhaseNumber.textContent = phaseId.replace('phase', ''); 
        updateCompletionInfo(phaseId);

        const flowchartRect = document.querySelector('.flowchart-wrapper').getBoundingClientRect();
        popup.style.top = '120%'; 
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
    }

    function openCommentPopup(listItem, phaseId, index) {
        currentCommentItem = listItem;
        currentPhaseId = phaseId;
        currentIndex = index;
        const state = loadState(projectIdInput.value);
        const comment = state[phaseId] && state[phaseId].comments && state[phaseId].comments[index] ? state[phaseId].comments[index] : '';
        commentText.value = comment;
        commentPopup.classList.add('visible');
        commentPopup.style.display = 'block';

        const popupRect = popup.getBoundingClientRect();
        commentPopup.style.top = '150%';
        commentPopup.style.left = `${popupRect.right + window.innerWidth * 0.01}px`;
        commentPopup.style.transform = 'translateX(0)';
    }

    function closeCommentPopup() {
        commentPopup.classList.remove('visible');
        setTimeout(() => {
            commentPopup.style.display = 'none';
        }, 400);
    }

    saveCommentButton.addEventListener('click', function () {
        if (currentCommentItem) {
            const state = loadState(projectIdInput.value);
            if (!state[currentPhaseId]) {
                state[currentPhaseId] = {};
            }
            if (!state[currentPhaseId].comments) {
                state[currentPhaseId].comments = {};
            }
            state[currentPhaseId].comments[currentIndex] = commentText.value;
            saveState(projectIdInput.value, state);
            updateCommentIcon(currentCommentItem.querySelector('.comment-icon'), commentText.value);
            closeCommentPopup();
        }
    });

    closeCommentPopupButton.addEventListener('click', function () {
        closeCommentPopup();
    });

    closePopupButton.addEventListener('click', function () {
        popup.classList.remove('visible');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 400);
    });

    document.addEventListener('click', function (event) {
        if (!popup.contains(event.target) && !event.target.closest('.phase') && !commentPopup.contains(event.target) && !event.target.classList.contains('comment-icon')) {
            popup.classList.remove('visible');
            setTimeout(() => {
                popup.style.display = 'none';
                phases.forEach(p => p.classList.remove('active'));
            }, 400);
        }
    });

    phases.forEach(phase => {
        phase.addEventListener('click', function (event) {
            const phaseId = this.id;
            const isActive = this.classList.contains('active');
            if (!isActive || !popup.classList.contains('visible')) {
                phases.forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                populatePopup(phaseId);
                popup.classList.add('visible');
                popup.style.display = 'block';
            } else {
                popup.classList.remove('visible');
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 400);
            }
        });
    });

    function updateCommentIcon(icon, comment) {
        if (comment) {
            icon.classList.remove('unfilled');
            icon.classList.add('filled');
        } else {
            icon.classList.remove('filled');
            icon.classList.add('unfilled');
        }
    }

    function loadProjectData(projectId) {
        const state = loadState(projectId);
        if (state) {
            phases.forEach(phase => {
                const phaseId = phase.id;
                updateCompletionInfo(phaseId);
            });
        } else {
            alert('Project ID not found.');
        }
    }

    loadProjectButton.addEventListener('click', function () {
        const projectId = projectIdInput.value.trim();
        if (projectId) {
            loadProjectData(projectId);
        } else {
            alert('Please select a Project ID.');
        }
    });

    saveButton.addEventListener('click', function () {
        const projectId = projectIdInput.value.trim();
        if (projectId) {
            const currentState = {};
            phases.forEach(phase => {
                const phaseId = phase.id;
                currentState[phaseId] = loadState(phaseId);
            });
            saveState(projectId, currentState);
            alert('Project data saved.');
        } else {
            alert('Please select a Project ID.');
        }
    });

    resetButton.addEventListener('click', function () {
        projectIdInput.value = '';

        phases.forEach(phase => {
            phase.classList.remove('active');
        });

        Object.keys(connectors).forEach(key => {
            const connector = connectors[key];
            if (connector) {
                connector.classList.remove('active');
            }
        });

        sideConnectorLeft.classList.remove('active');
        sideConnectorRight.classList.remove('active');

        popup.classList.remove('visible');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 400);

        closeCommentPopup();

        localStorage.removeItem(`popupState-${projectIdInput.value}`);

        phases.forEach(phase => {
            const percentageElement = phase.querySelector('.phase-percentage');
            const progressBar = phase.querySelector('.progress-bar');
            if (percentageElement) {
                percentageElement.textContent = '0%';
            }
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        });

        phases.forEach(phase => {
            const phaseId = phase.id;
            updateCompletionInfo(phaseId);
        });
    });

    phases.forEach(phase => {
        const phaseId = phase.id;
        updateCompletionInfo(phaseId);
    });

    syncProjectList();

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver((mutations) => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    
    // Wait for #projectTableBody to be available and then set up the MutationObserver
    waitForElement('#projectTableBody').then(targetNode => {
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    syncProjectList(); // Re-fetch and update the project list
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    });
});

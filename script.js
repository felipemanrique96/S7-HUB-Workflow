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

    const phaseDetails = {
        'phase1': {
            title: 'INDAGINI',
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

    function loadState() {
        const state = JSON.parse(localStorage.getItem('popupState')) || {};
        return state;
    }

    function saveState(state) {
        localStorage.setItem('popupState', JSON.stringify(state));
    }

    function updateCompletionInfo(phaseId) {
        const state = loadState();
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

        // Update connectors
        const connector = connectors[phaseId];
        if (connector) {
            if (percentage === 100) {
                connector.classList.add('active');
            } else {
                connector.classList.remove('active');
            }
        }

        // Update side connectors based on phase 1 and phase 5 completion
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
        
    }

    function populatePopup(phaseId) {
        const state = loadState();
        popupTitle.textContent = phaseDetails[phaseId].title;
        popupList.innerHTML = ''; // Clear previous list items
        phaseDetails[phaseId].items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            if (state[phaseId] && state[phaseId][index]) {
                listItem.classList.add('checked');
            }
            listItem.addEventListener('click', function () {
                this.classList.toggle('checked');
                const currentState = loadState();
                if (!currentState[phaseId]) {
                    currentState[phaseId] = {};
                }
                currentState[phaseId][index] = this.classList.contains('checked');
                saveState(currentState);
                updateCompletionInfo(phaseId);
            });
            popupList.appendChild(listItem);
        });
        popupPhaseNumber.textContent = phaseId.replace('phase', ''); // Set phase number
        updateCompletionInfo(phaseId); // Initial calculation of completion info
    }

    phases.forEach(phase => {
        phase.addEventListener('click', function (event) {
            const phaseId = this.id;
            const isActive = this.classList.contains('active');
            // Toggle popup visibility and content
            if (!isActive) {
                phases.forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                populatePopup(phaseId);
                popup.classList.add('visible');
                popup.style.display = 'block';
                popup.style.top = `${this.getBoundingClientRect().bottom + window.scrollY}px`;
                popup.style.left = `${this.getBoundingClientRect().left + window.scrollX + this.offsetWidth / 2 - popup.offsetWidth / 2}px`;
            } else {
                popup.classList.remove('visible');
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 400); // Wait for transition to complete before hiding
            }
        });
    });

    // Close popup when clicking outside
    document.addEventListener('click', function (event) {
        if (!popup.contains(event.target) && !event.target.closest('.phase')) {
            popup.classList.remove('visible');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 400); // Wait for transition to complete before hiding
        }
    });

    // Add event listener to reset button
    resetButton.addEventListener('click', function () {
        // Remove 'active' class from all phases and connectors
        phases.forEach(phase => {
            phase.classList.remove('active');
        });

        Object.keys(connectors).forEach(key => {
            const connector = connectors[key];
            if (connector) {
                connector.classList.remove('active');
            }
        });

        // Remove active class from side connectors
        sideConnectorLeft.classList.remove('active');
        sideConnectorRight.classList.remove('active');

        // Hide the popup
        popup.classList.remove('visible');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 400); // Wait for transition to complete before hiding

        // Clear the localStorage
        localStorage.removeItem('popupState');

        // Clear completion percentages and progress bars
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

        // Update completion info for all phases
        phases.forEach(phase => {
            const phaseId = phase.id;
            updateCompletionInfo(phaseId);
        });
    });

    // Initialize completion percentages and progress bars for all phases on load
    phases.forEach(phase => {
        const phaseId = phase.id;
        updateCompletionInfo(phaseId);
    });
});

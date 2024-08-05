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

    const phaseDetails = {
        'phase1': {
            title: 'INDAGINI',
            items: [
                'Conduct thorough research.',
                'Gather necessary data.',
                'Consult relevant experts.',
            ],
        },
        'phase2': {
            title: 'KICK-OFF',
            items: [
                'Define project goals.',
                'Identify stakeholders.',
                'Outline initial timeline.',
            ],
        },
        'phase3': {
            title: 'AUTORIZZAZIONI',
            items: [
                'Obtain necessary permits.',
                'Ensure legal compliance.',
                'Confirm approvals with authorities.',
            ],
        },
        'phase4': {
            title: 'SVILUPPO',
            items: [
                'Develop project plan.',
                'Allocate resources.',
                'Establish communication channels.',
            ],
        },
        'phase5': {
            title: 'DETTAGLIO',
            items: [
                'Finalize project details.',
                'Review project milestones.',
                'Prepare final documentation.',
            ],
        },
    };

    phases.forEach(phase => {
        phase.addEventListener('click', function () {
            const phaseId = this.id;
            const phaseIndex = parseInt(phaseId.replace('phase', ''), 10);

            // Check if the clicked phase is currently active
            const isActive = this.classList.contains('active');

            // Deactivate all phases and connectors
            phases.forEach(p => {
                if (parseInt(p.id.replace('phase', ''), 10) < phaseIndex) {
                    p.classList.add('active');
                } else if (p === this) {
                    this.classList.toggle('active');
                } else {
                    p.classList.remove('active');
                }
            });

            Object.keys(connectors).forEach(key => {
                const connector = connectors[key];
                if (connector) {
                    if (parseInt(key.replace('phase', ''), 10) < phaseIndex) {
                        connector.classList.add('active');
                    } else {
                        connector.classList.remove('active');
                    }
                }
            });

            // Handle the last connector specifically when phase5 is toggled
            const lastConnector = document.querySelector('.connector4');
            if (phaseIndex === 5 && !isActive) {
                if (lastConnector) {
                    lastConnector.classList.add('active');
                }
                sideConnectorRight.classList.add('active');
            } else if (phaseIndex === 5 && isActive) {
                if (lastConnector) {
                    lastConnector.classList.remove('active');
                }
                sideConnectorRight.classList.remove('active');
            } else if (phaseIndex < 5) {
                if (lastConnector) {
                    lastConnector.classList.remove('active');
                }
            }

            // Handle side connectors
            const phase1 = document.getElementById('phase1');
            sideConnectorLeft.classList.toggle('active', phase1.classList.contains('active'));

            const phase5 = document.getElementById('phase5');
            sideConnectorRight.classList.toggle('active', phase5.classList.contains('active'));

            // Toggle popup visibility and content
            if (this.classList.contains('active')) {
                popupTitle.textContent = phaseDetails[phaseId].title;
                popupList.innerHTML = ''; // Clear previous list items
                phaseDetails[phaseId].items.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = item;
                    listItem.addEventListener('click', function () {
                        this.classList.toggle('checked');
                    });
                    popupList.appendChild(listItem);
                });
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
    });
});

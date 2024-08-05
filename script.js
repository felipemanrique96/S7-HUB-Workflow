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
    });
});

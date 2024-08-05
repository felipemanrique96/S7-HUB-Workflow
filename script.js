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

    phases.forEach(phase => {
        phase.addEventListener('click', function () {
            const phaseId = this.id;
            const phaseIndex = parseInt(phaseId.replace('phase', ''), 10);

            // Determine if the clicked phase is active
            const isActive = this.classList.contains('active');

            // Deactivate all phases and connectors
            phases.forEach(p => {
                p.classList.remove('active');
            });
            Object.values(connectors).forEach(connector => {
                if (connector) {
                    connector.classList.remove('active');
                }
            });
            sideConnectorLeft.classList.remove('active');
            sideConnectorRight.classList.remove('active');

            if (!isActive) {
                // Activate the clicked phase and previous phases
                phases.forEach(p => {
                    if (parseInt(p.id.replace('phase', ''), 10) <= phaseIndex) {
                        p.classList.add('active');
                    }
                });

                // Activate connectors
                Object.keys(connectors).forEach(key => {
                    if (parseInt(key.replace('phase', ''), 10) <= phaseIndex) {
                        const connector = connectors[key];
                        if (connector) {
                            connector.classList.add('active');
                        }
                    }
                });

                // Activate side connectors
                if (phaseIndex >= 1) {
                    sideConnectorLeft.classList.add('active');
                }
                if (phaseIndex >= 5) {
                    sideConnectorRight.classList.add('active');
                }
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const phases = document.querySelectorAll('.phase');

    phases.forEach(phase => {
        phase.addEventListener('click', () => {
            alert(phase.querySelector('.description').innerText);
        });
    });
});

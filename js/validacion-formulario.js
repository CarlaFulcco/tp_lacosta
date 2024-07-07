document.getElementById('formContac').addEventListener('submit', function (event) {
    event.preventDefault();

    const hotelName = document.getElementById('text').value;
    const estrellas = document.getElementById('Estrellas').value;
    const telefono = document.getElementById('number').value;
    const sitioWeb = document.getElementById('email').value;
    const descripcion = document.getElementById('mensaje').value;

    const hotelTableBody = document.getElementById('hotelTableBody');
    let row;

    if (this.dataset.editing) {
        // Edit existing row
        row = document.querySelector(`tr[data-id="${this.dataset.editing}"]`);
        delete this.dataset.editing;
    } else {
        // Create new row
        row = document.createElement('tr');
        hotelTableBody.appendChild(row);
    }

    row.dataset.id = new Date().getTime(); // Unique ID for each row
    row.classList.remove('archived'); // Ensure the row is not archived upon editing
    row.innerHTML = `
        <td>${hotelName}</td>
        <td>${'⭐'.repeat(estrellas)}</td>
        <td>${telefono}</td>
        <td><a href="${sitioWeb}" target="_blank">${sitioWeb}</a></td>
        <td>${descripcion}</td>
        <td>
            <button title="Completar" class="complete-btn"><i class='bx bxs-message-square-check'></i></button>
            <button title="Editar" class="edit-btn"><i class='bx bxs-message-square-edit'></i></button>
            <button title="Archivar" class="archive-btn"><i class='bx bxs-message-square-x'></i></button>
        </td>
    `;

    this.reset();
});

document.getElementById('hotelTableBody').addEventListener('click', function (event) {
    const row = event.target.closest('tr');
    if (event.target.closest('.edit-btn')) {
        const hotelName = row.cells[0].innerText;
        const estrellas = row.cells[1].innerText.length;
        const telefono = row.cells[2].innerText;
        const sitioWeb = row.cells[3].querySelector('a').href;
        const descripcion = row.cells[4].innerText;

        document.getElementById('text').value = hotelName;
        document.getElementById('Estrellas').value = estrellas;
        document.getElementById('number').value = telefono;
        document.getElementById('email').value = sitioWeb;
        document.getElementById('mensaje').value = descripcion;

        document.getElementById('formContac').dataset.editing = row.dataset.id;
    } else if (event.target.closest('.archive-btn')) {
        row.classList.toggle('archived');
        applyFilter();
    } else if (event.target.closest('.complete-btn')) {
        row.classList.toggle('completed');
        applyFilter();
    }
});

// Filter buttons
document.getElementById('VerTodos').addEventListener('click', function () {
    applyFilter('todos');
});

document.getElementById('VerCompletados').addEventListener('click', function () {
    applyFilter('completados');
});

document.getElementById('VerArchivados').addEventListener('click', function () {
    applyFilter('archivados');
});

function applyFilter(filter = 'todos') {
    const rows = document.querySelectorAll('#hotelTableBody tr');
    rows.forEach(row => {
        row.style.display = 'table-row'; // Reset all rows to be visible
        if (filter === 'completados' && !row.classList.contains('completed')) {
            row.style.display = 'none';
        }
        if (filter === 'archivados' && !row.classList.contains('archived')) {
            row.style.display = 'none';
        }
        if (filter === 'todos') {
            row.style.display = 'table-row';
        }
    });

    document.querySelectorAll('.headerActionButton').forEach(button => button.classList.remove('active'));
    document.getElementById(`Ver${capitalizeFirstLetter(filter)}`).classList.add('active');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
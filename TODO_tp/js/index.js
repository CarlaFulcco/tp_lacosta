let BASE_URL = 'http://localhost:5000';

let filterButtons = {
    "Todos": document.querySelector("#VerTodos"),
    "Completados": document.querySelector("#VerCompletados"),
    "Archivados": document.querySelector("#VerArchivados")
};

let hotelContainer = document.querySelector(".hoteles-container");

function archiveHotel(event) {
    let id = event.currentTarget.id_hotel;

    let url = BASE_URL + '/api/hoteles/archived/' + id;

    fetchData(url, "DELETE", () => {
        location.reload();
    });
}

function editHotel(event) {
    let id = event.currentTarget.id_hotel;
    window.location.replace("pages/add_update_hoteles.html?id_hotel=" + id);
}

function completeHotel(event) {
    let id = event.currentTarget.id_hotel;

    let url = BASE_URL + '/api/hoteles/completed/' + id;

    fetchData(url, "PUT", () => {
        location.reload();
    });
}

function loadHotel(hotel_status) {
    let fetch_data = {
        'Todos': {
            'URL': BASE_URL + '/api/hoteles/todos/',
            'HotelTemplatesName': 'Todos'
        },

        'Completados': {
            'URL': BASE_URL + '/api/hoteles/completed/',
            'HotelTemplatesName': 'Completados'
        },

        'Archivados': {
            'URL': BASE_URL + '/api/hoteles/archived/',
            'HotelTemplatesName': 'Archivados'
        },
    };

    if (!(hotel_status in fetch_data)){
        throw new Error(`El Parametro: ${hotel_status} no está definido!`);
    }

    fetchData(fetch_data[hotel_status].URL, "GET", (data) => {
        let hoteles = [];
        for (const hotel of data) {
            let newHotel = document.createElement('div');
            newHotel.innerHTML = `
                <h3 class="titulo">${hotel.nombre}</h3>
                <p class="descripcion">${hotel.descripcion}</p>
                <p class="fecha">${hotel.fecha_creacion}</p>
                <input type="hidden" class="id_hotel" value="${hotel.id}">
                <button id="Archivar">Archivar</button>
                <button id="Editar">Editar</button>
                <button id="Completar">Completar</button>
            `;

            newHotel.querySelector("#Archivar").addEventListener("click", archiveHotel);
            newHotel.querySelector("#Editar").addEventListener("click", editHotel);
            newHotel.querySelector("#Completar").addEventListener("click", completeHotel);

            hoteles.push(newHotel);
        }

        hotelContainer.replaceChildren(...hoteles);
    });
}

function setActiveFilter(event) {
    Object.values(filterButtons).forEach(button => button.classList.remove("active"));
    event.currentTarget.classList.add("active");
    loadHotel(event.currentTarget.filterName);
}

function setFilters() {
    Object.entries(filterButtons).forEach(([name, button]) => {
        button.addEventListener("click", setActiveFilter);
        button.filterName = name;
    });
}

setFilters();
loadHotel('Todos');
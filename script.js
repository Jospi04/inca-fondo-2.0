let menuVisible = false;
//Función que oculta o muestra el menu
function mostrarOcultarMenu(){
    if(menuVisible){
        document.getElementById("nav").classList ="";
        menuVisible = false;
    }else{
        document.getElementById("nav").classList ="responsive";
        menuVisible = true;
    }
}

function seleccionar(){
    //oculto el menu una vez que selecciono una opcion
    document.getElementById("nav").classList = "";
    menuVisible = false;
}
//Funcion que aplica las animaciones de las habilidades
function efectoHabilidades(){
    var fortalezas = document.getElementById("fortalezas");
    var distancia_fortalezas = window.innerHeight - fortalezas.getBoundingClientRect().top;
    if(distancia_fortalezas >= 500){
        let habilidades = document.getElementsByClassName("progreso");
        habilidades[0].classList.add("rapido");
        habilidades[1].classList.add("seguridad");
        habilidades[2].classList.add("procesamiento");
        habilidades[3].classList.add("plataforma");
        habilidades[4].classList.add("conexion");
        habilidades[5].classList.add("soporte");
        habilidades[6].classList.add("respuesta");
        habilidades[7].classList.add("transparencia");
        habilidades[8].classList.add("asesoramiento");
        habilidades[9].classList.add("disponibilidad");
    }
}


//detecto el scrolling para aplicar la animacion de la barra de habilidades
window.onscroll = function(){
    efectoHabilidades();
} 

document.addEventListener('DOMContentLoaded', function() {
    // Toggle Sidebar (si aplica)
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    if (document.getElementById('toggleSidebar')) {
        document.getElementById('toggleSidebar').addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });
    }

    // Calendar Logic
    let currentDate = new Date(2025, 4, 1); // Mayo 2025 por defecto
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const events = JSON.parse(localStorage.getItem('paymentEvents')) || [
        { title: 'Pago #1', date: '2025-05-03', amount: 1000, method: 'Transferencia', color: '#ef4444' },
        { title: 'Pago #2', date: '2025-06-03', amount: 1500, method: 'Efectivo', color: '#ef4444' },
        { title: 'Pago #3', date: '2025-07-03', amount: 500, method: 'Pendiente', color: '#eab308' },
        { title: 'Pago #4', date: '2025-08-03', amount: 500, method: 'Pendiente', color: '#eab308' }
    ];

    function updateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const calendarGrid = document.getElementById('calendarGrid');
        const today = new Date(2025, 4, 11); // 11 de mayo de 2025 como "hoy"

        // Update header
        document.querySelector('.calendar-header h3').textContent = `${monthNames[month]} ${year}`;

        // Clear previous days (except day names)
        while (calendarGrid.children.length > 7) {
            calendarGrid.removeChild(calendarGrid.lastChild);
        }

        // Add empty days before the first day of the month
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Ajuste para que lunes sea 0
        for (let i = 0; i < adjustedFirstDay; i++) {
            const emptyDay = document.createElement('div');
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = day;

            const currentDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (currentDay === today.toISOString().split('T')[0]) {
                dayDiv.classList.add('today');
            }

            const dayEvents = events.filter(event => event.date === currentDay);
            if (dayEvents.length > 0) {
                dayDiv.classList.add('event');
                if (dayEvents.some(event => event.color === '#eab308')) {
                    dayDiv.classList.add('completed');
                }
            }

            dayDiv.addEventListener('click', function() {
                const existingEvents = events.filter(event => event.date === currentDay);
                if (existingEvents.length > 0) {
                    Swal.fire({
                        title: `Pagos - ${currentDay}`,
                        html: existingEvents.map(event => `
                            <p><strong>${event.title}</strong></p>
                            <p>Importe: S/ ${event.amount.toFixed(2)}</p>
                            <p>Método: ${event.method}</p>
                            <p>Estado: ${event.color === '#ef4444' ? 'Pendiente' : 'Realizado'}</p>
                        `).join('<hr>'),
                        showCancelButton: true,
                        confirmButtonText: 'Agregar Otro Pago',
                        cancelButtonText: 'Cerrar',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'btn bg-blue-600 text-white px-4 py-2 rounded-lg mr-2',
                            cancelButton: 'btn bg-gray-300 text-gray-800 px-4 py-2 rounded-lg'
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            showAddPaymentModal(currentDay);
                        }
                    });
                } else {
                    showAddPaymentModal(currentDay);
                }
            });

            calendarGrid.appendChild(dayDiv);
        }
    }

    function showAddPaymentModal(currentDay) {
        Swal.fire({
            title: `Agregar Pago - ${currentDay}`,
            html: `
                <input type="text" id="eventTitle" class="border p-2 w-full mb-2 rounded" placeholder="Nombre del pago (ej. Pago #5)">
                <input type="number" id="eventAmount" class="border p-2 w-full mb-2 rounded" placeholder="Importe (ej. 500)">
                <input type="text" id="eventMethod" class="border p-2 w-full mb-2 rounded" placeholder="Método (ej. Transferencia)">
                <select id="eventColor" class="border p-2 w-full mt-2 rounded">
                    <option value="#ef4444">Pendiente (Rojo)</option>
                    <option value="#eab308">Realizado (Amarillo)</option>
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn bg-blue-600 text-white px-4 py-2 rounded-lg mr-2',
                cancelButton: 'btn bg-gray-300 text-gray-800 px-4 py-2 rounded-lg'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const title = document.getElementById('eventTitle').value;
                const amount = document.getElementById('eventAmount').value;
                const method = document.getElementById('eventMethod').value;
                const color = document.getElementById('eventColor').value;
                if (title && amount && method) {
                    events.push({
                        title: title,
                        date: currentDay,
                        amount: parseFloat(amount),
                        method: method,
                        color: color
                    });
                    saveEvents();
                    updateCalendar();
                    updateEventList();
                    Swal.fire({
                        icon: 'success',
                        title: '¡Guardado!',
                        text: 'El pago ha sido agregado.',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'btn bg-blue-600 text-white px-4 py-2 rounded-lg'
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Por favor, completa todos los campos.',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'btn bg-red-600 text-white px-4 py-2 rounded-lg'
                        }
                    });
                }
            }
        });
    }

    function updateEventList() {
        const eventList = document.getElementById('eventList');
        eventList.innerHTML = events.map(event => `
            <div class="event-item">
                <p><strong>${event.title}</strong></p>
                <p>${new Date(event.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} - S/ ${event.amount.toFixed(2)}</p>
                <p>${event.method} - ${event.color === '#ef4444' ? 'Pendiente' : 'Realizado'}</p>
            </div>
        `).join('');
    }

    function saveEvents() {
        localStorage.setItem('paymentEvents', JSON.stringify(events));
    }

    // Navigation
    if (document.getElementById('prevMonth')) {
        document.getElementById('prevMonth').addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
            updateEventList();
        });
    }

    if (document.getElementById('nextMonth')) {
        document.getElementById('nextMonth').addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
            updateEventList();
        });
    }

    // Initial call
    updateCalendar();
    updateEventList();

    // Logout Button (si aplica)
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', function() {
            Swal.fire({
                icon: 'question',
                title: '¿Cerrar sesión?',
                text: 'Serás redirigido a la página de inicio.',
                showCancelButton: true,
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn bg-red-600 text-white px-4 py-2 rounded-lg mr-2',
                    cancelButton: 'btn bg-gray-300 text-gray-800 px-4 py-2 rounded-lg'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('paymentEvents');
                    window.location.href = 'index.html';
                }
            });
        });
    }

    // Set User Email (si aplica)
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email') || 'usuario@ejemplo.com';
    if (document.getElementById('userEmail')) {
        document.getElementById('userEmail').textContent = userEmail;
    }
});
const rezerwacjaButton = document.getElementById('rezerwacjaButton');
const przedmiotId = document.getElementById('calendar1').dataset.przedmiotId;
const monthSelect = [document.getElementById('monthSelect1'), document.getElementById('monthSelect2')];
const daySelect = [document.getElementById('daySelect1'), document.getElementById('daySelect2')];
const yearSelect = [document.getElementById('yearSelect1'), document.getElementById('yearSelect2')];
const rezerwacjaInfo = document.getElementById('rezerwacjaInfo');

const daysInMonth = {
    "01": 31, "02": 28, "03": 31, "04": 30, "05": 31, "06": 30,
    "07": 31, "08": 31, "09": 30, "10": 31, "11": 30, "12": 31
};

const generateDayOptions = (j) => {

    const selectedMonth = monthSelect[j].value;
    const daysCount = daysInMonth[selectedMonth];

    daySelect[j].innerHTML = '';
    for (let i = 1; i <= daysCount; i++) {
        const dayValue = i < 10 ? `0${i}` : `${i}`;
        const option = document.createElement('option');
        option.value = dayValue;
        option.textContent = dayValue;
        daySelect[j].appendChild(option);
    }

};

const checkReservationsForMonth = (j) => {
    const selectedYear = yearSelect[j].value;
    const selectedMonth = monthSelect[j].value;
    let firstAvailableDay = null;
    let isAnyDayAvailable = false;

    for (let i = 1; i <= 31; i++) {
        if (i < 10) {
            i = `0${i}`;
        }
        const selectedDate = `${selectedYear}-${selectedMonth}-${i}`;

        fetch(`/przedmioty/${przedmiotId}/${selectedDate}`)
            .then(response => response.json())
            .then(reservations => {
                const option = daySelect[j].querySelector(`option[value="${i}"]`);

                if (!option) return; // Sprawdź czy opcja istnieje

                if (!reservations['isReserved'] && firstAvailableDay === null) {
                    firstAvailableDay = i;
                }
                if (reservations['isReserved']) {
                    option.classList.add('option-disabled');
                    option.disabled = true;
                } else {
                    option.classList.add('option-available');
                    option.disabled = false;
                    isAnyDayAvailable = true;
                }

                if (!isAnyDayAvailable) {
                    daySelect[j].selectedIndex = -1;
                } else if (firstAvailableDay !== null) {
                    daySelect[j].value = firstAvailableDay;
                }
            })
            .catch(err => console.error('Błąd pobierania rezerwacji:', err));
    }

};

// Dodaj nasłuchiwanie zmiany roku i miesiąca
yearSelect[0].addEventListener('change', () => {
    generateDayOptions(0);
    checkReservationsForMonth(0);
});

yearSelect[1].addEventListener('change', () => {
    generateDayOptions(1);
    checkReservationsForMonth(1);
});

monthSelect[0].addEventListener('change', () => {
    generateDayOptions(0);
    checkReservationsForMonth(0);
});

monthSelect[1].addEventListener('change', () => {
    generateDayOptions(1);
    checkReservationsForMonth(1);
});

const redirectToReservation = () => {
    const imie = document.getElementById('firstName').value;
    const nazwisko = document.getElementById('lastName').value;
    if (daySelect[0].selectedIndex == -1 || daySelect[1].selectedIndex == -1 || imie.length == 0 || nazwisko.length == 0) {
        rezerwacjaInfo.textContent = 'Uzupełnij brakujące informacje!';
    } else {
        const selectedYear1 = yearSelect[0].value;
        const selectedMonth1 = monthSelect[0].value;
        const selectedDay1 = daySelect[0].value;
        const reservationDate_from = `${selectedYear1}-${selectedMonth1}-${selectedDay1}`;
        const selectedYear2 = yearSelect[1].value;
        const selectedMonth2 = monthSelect[1].value;
        const selectedDay2 = daySelect[1].value;
        const reservationDate_to = `${selectedYear2}-${selectedMonth2}-${selectedDay2}`;
        const start = reservationDate_from;
        const stop = reservationDate_to;

        if (reservationDate_from > reservationDate_to) {
            rezerwacjaInfo.textContent = 'Data końcowa musi być taka sama lub późniejsza niż data początkowa!';
        } else {
            fetch(`/przedmioty/${przedmiotId}/rezerwacja`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({imie, nazwisko, start, stop})
            })
                .then(response => response.json())
                .then(data => {
                    if (data.rezerwacjaId) {
                        rezerwacjaInfo.textContent = `Udało się zarezerwować! ID rezerwacji: ${data.rezerwacjaId}`;
                    } else {
                        rezerwacjaInfo.textContent = 'Wystąpił błąd podczas rezerwacji.';
                    }
                })
                .catch(err => {
                    console.error('Błąd podczas dokonywania rezerwacji:', err);
                    rezerwacjaInfo.textContent = 'Wystąpił błąd podczas rezerwacji.';
                });
            generateDayOptions(0);
            checkReservationsForMonth(0);
            generateDayOptions(1);
            checkReservationsForMonth(1);
        }
    }
};

rezerwacjaButton.addEventListener('click', redirectToReservation);

generateDayOptions(0);
checkReservationsForMonth(0);
generateDayOptions(1);
checkReservationsForMonth(1);
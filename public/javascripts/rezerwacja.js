document.addEventListener('DOMContentLoaded', function() {
    let rezerwacjaId = document.getElementById('rezerwacjaId').value;
    const sprawdzButton = document.getElementById('sprawdzButton');
    const anulujButton = document.getElementById('anulujButton');
    const rezerwacjaDane = document.getElementById('rezerwacjaDane');

    anulujButton.style.display = 'none';

    sprawdzButton.addEventListener('click', function() {
        rezerwacjaId = document.getElementById('rezerwacjaId').value;

        fetch(`/rezerwacja/${rezerwacjaId}`)
            .then(response => response.json())
            .then(rezerwacja => {
                if (rezerwacja.error) {
                    rezerwacjaDane.textContent = rezerwacja.error; // Wyświetlenie komunikatu błędu
                    return;
                }

                const imie = rezerwacja.imie;
                const nazwisko = rezerwacja.nazwisko;
                const nazwa = rezerwacja.nazwa;
                const miejsce = rezerwacja.miejsce;
                const start = rezerwacja.start;
                const stop = rezerwacja.stop;

                rezerwacjaDane.textContent = `Rezerwacja: ${nazwa} - ${miejsce} dla ${imie} ${nazwisko}, od ${start} do ${stop}`;
                anulujButton.style.display = 'block'; // Pokazanie przycisku anulowania

            })
            .catch(error => {
                anulujButton.style.display = 'none';
                rezerwacjaDane.textContent = 'Brak rezerwacji w systemie';
            });

    });

    anulujButton.addEventListener('click', function() {
        fetch(`/rezerwacja/${rezerwacjaId}/anuluj`, { method: 'DELETE' })
            .then(response => response.json())
            .then(result => {
                rezerwacjaDane.textContent = result.message; // Wyświetlenie komunikatu po usunięciu rezerwacji
                anulujButton.style.display = 'none'; // Ukrycie przycisku anulowania po usunięciu rezerwacji
            })
            .catch(error => {
                console.error('Błąd podczas usuwania rezerwacji:', error.message);
                rezerwacjaDane.textContent = 'Błąd podczas usuwania rezerwacji. Spróbuj ponownie później.';
            });
    });
});

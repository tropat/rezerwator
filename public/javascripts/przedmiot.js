const rezerwacjaButton = document.getElementById('rezerwacjaButton');
const przedmiotId = document.getElementById('calendar1').dataset.przedmiotId;
const miesiacSelect = [document.getElementById('monthSelect1'), document.getElementById('monthSelect2')];
const dzienSelect = [document.getElementById('daySelect1'), document.getElementById('daySelect2')];
const rokSelect = [document.getElementById('yearSelect1'), document.getElementById('yearSelect2')];
const rezerwacjaInfo = document.getElementById('rezerwacjaInfo');

const dniMiesiac = {
    "01": 31, "02": 28, "03": 31, "04": 30, "05": 31, "06": 30,
    "07": 31, "08": 31, "09": 30, "10": 31, "11": 30, "12": 31
};

const genetujDniMiesiaca = (j) => {

    const wybranyMiesiac = miesiacSelect[j].value;
    const liczbaDni = dniMiesiac[wybranyMiesiac];

    dzienSelect[j].innerHTML = '';
    for (let i = 1; i <= liczbaDni; i++) {
        const dzien = i < 10 ? `0${i}` : `${i}`;
        const option = document.createElement('option');
        option.value = dzien;
        option.textContent = dzien;
        dzienSelect[j].appendChild(option);
    }

};

const sprawdzRezerwacjeMiesiac = (j) => {
    const wybranyRok = rokSelect[j].value;
    const wybranyMiesiac = miesiacSelect[j].value;
    let pierwszyDostepny = null;
    let czyDostepny = false;

    for (let i = 1; i <= 31; i++) {
        if (i < 10) {
            i = `0${i}`;
        }
        const wybranaData = `${wybranyRok}-${wybranyMiesiac}-${i}`;

        fetch(`/przedmioty/${przedmiotId}/${wybranaData}`)
            .then(response => response.json())
            .then(rezerwacje => {
                const option = dzienSelect[j].querySelector(`option[value="${i}"]`);

                if (!option) return;

                if (!rezerwacje['isReserved'] && pierwszyDostepny === null) {
                    pierwszyDostepny = i;
                }
                if (rezerwacje['isReserved']) {
                    option.classList.add('option-disabled');
                    option.disabled = true;
                } else {
                    option.classList.add('option-available');
                    option.disabled = false;
                    czyDostepny = true;
                }

                if (!czyDostepny) {
                    dzienSelect[j].selectedIndex = -1;
                } else if (pierwszyDostepny !== null) {
                    dzienSelect[j].value = pierwszyDostepny;
                }
            })
            .catch(err => console.error('Błąd pobierania rezerwacji:', err));
    }

};

rokSelect[0].addEventListener('change', () => {
    genetujDniMiesiaca(0);
    sprawdzRezerwacjeMiesiac(0);
});

rokSelect[1].addEventListener('change', () => {
    genetujDniMiesiaca(1);
    sprawdzRezerwacjeMiesiac(1);
});

miesiacSelect[0].addEventListener('change', () => {
    genetujDniMiesiaca(0);
    sprawdzRezerwacjeMiesiac(0);
});

miesiacSelect[1].addEventListener('change', () => {
    genetujDniMiesiaca(1);
    sprawdzRezerwacjeMiesiac(1);
});

const zarezerwuj = () => {
    const imie = document.getElementById('firstName').value;
    const nazwisko = document.getElementById('lastName').value;
    if (dzienSelect[0].selectedIndex == -1 || dzienSelect[1].selectedIndex == -1 || imie.length == 0 || nazwisko.length == 0) {
        rezerwacjaInfo.textContent = 'Uzupełnij brakujące informacje!';
    } else {
        const wybranyRok1 = rokSelect[0].value;
        const wybranyMiesiac1 = miesiacSelect[0].value;
        const wybranyDzien1 = dzienSelect[0].value;
        const dataRezerwacji_od = `${wybranyRok1}-${wybranyMiesiac1}-${wybranyDzien1}`;
        const wybranyRok2 = rokSelect[1].value;
        const wybranyMiesiac2 = miesiacSelect[1].value;
        const wybranyDzien2 = dzienSelect[1].value;
        const dataRezerwacji_do = `${wybranyRok2}-${wybranyMiesiac2}-${wybranyDzien2}`;
        const start = dataRezerwacji_od;
        const stop = dataRezerwacji_do;

        if (dataRezerwacji_od > dataRezerwacji_do) {
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
            genetujDniMiesiaca(0);
            sprawdzRezerwacjeMiesiac(0);
            genetujDniMiesiaca(1);
            sprawdzRezerwacjeMiesiac(1);
        }
    }
};

rezerwacjaButton.addEventListener('click', zarezerwuj);

genetujDniMiesiaca(0);
sprawdzRezerwacjeMiesiac(0);
genetujDniMiesiaca(1);
sprawdzRezerwacjeMiesiac(1);
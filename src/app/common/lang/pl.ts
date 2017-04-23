export const pl = {

    layoutManager: {

        title: 'HtmlCuttingHelper - wycinarka :)',
        uploadFile: 'Wybierz plik',
        pasteUrl: 'Wklej URL obrazka',
        getUtl: 'Wczytaj',
        freeSpace: 'Wolna przestrzeń %{freeSpace} (najwięcej zużywają obrazki bez z pliku czyli linku)',

        table: {
            col: {
                id: 'ID',
                name : 'Nazwa (i link opcjonalnie)',
                actions: 'Akcje',
            },
            actions: {
                edit: 'Edytuj',
                editName: 'Edytuj nazwę',
                preview: 'Podgląd',
                del: 'Usuń',
            }
        },

        err: {
            linkProblem: 'Podany link jest uszkodzony lub serwer odmawia dostępu' +
            ' dla zapytań typu CORS. Sprubój zciągnąć obrazek i pobrać go jako z' +
            ' lokalnego pliku. Możesz też podać alternatywny link do obrazka' +
            ' który załadowałeś na serwer akceptujący zapytania CORS np.' +
            ' http://imgur.com/ . Możesz też użyć proxy zezwalające na CORS' +
            ' - np. spróbuj wkleić ten link: https://cors-anywhere.herokuapp.com/%{url}',
            noFreeSpace: 'Problem z wczytaniem pliku: nie masz wystarczająco miejsca w' +
            ' pamięci przeglądarki! Usuń stare obrazki (bez linku) by mieć go więcej' +
            ' (max 5MB).',
        },
    },

    layoutViewer: {
        image_name: 'Nazwa obrazka:',
        buttons: {
            close: 'Zamknij okienko - możesz je ponownie otworzyć przez podwójne kliknięcie',
            compact: 'Tryb kompaktowy',
            full: 'Wyświetl więcej informacji',
            save: 'Wytni zaznaczenie i zapisz do pliku',
        },

        help: {
            draw: 'Narysuj zaznaczenie używąc',
            mouse: 'Myszy!',
            click: 'Klik/Spacja',
            click_info: ': wybierz kolor',
            dbclick: 'Podwójne-kliknięcie',
            dbclick_info: ': pokaż informacje',
            wheel: 'Rolka',
            wheel_info: 'pionowy scroll',
            shift: '+Shift',
            shift_info: ': poziomy',
            alt: '+Alt',
            alt_info: ': co pixel',
            arrows: 'Strzałki',
            arrows_info: ': poruszaj co pixel zaznaczenie-krawędź-wierzchołek lub kolor',
            s: 'S',
            s_info: ': wytni zaznaczenie i zapisz je w pliku',
            i: 'i',
            i_info: ': pokaż/ukryj panelik',
        },

        num_long: {
            img_wh: 'Obraz - szerokość x wysokość:',
            scr_wh: 'Ekran - szerokość x wysokość:',
            img_lt: 'Obraz - lewo x góra:',
            mouse_xy: 'Mysz - lewo x góra:',

            box: 'Zaznaczenie (box):',
            box_lt: 'Lewo x góra (lt):',
            box_rb: 'Prawo x dół (rb):',
            box_wh: 'Szerokość x Wysokość:',
        },

        num_short: {
            img: 'obraz:',
            lt: 'lt:',
            screen: 'ekran:',
            mouse: 'mysz:',
            box: 'box',
            rb: 'rb:',
            size: 'roziar:',
        },
    }
};

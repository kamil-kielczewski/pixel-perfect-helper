export const pl = {

    layoutManager: {

        title: 'Pixel Perfect Helper',
        uploadFile: 'Wybierz plik <br/>(przenieś tu)',
        pasteUrl: 'Wklej URL obrazka',
        getUtl: 'Wczytaj',
        freeSpace: 'Wolna przestrzeń %{freeSpace} (najwięcej zużywają obrazki z pliku, najmniej' +
            ' z linku)',
        donate: 'Jeśli podoba Ci się to narzędzie - rzuć trochę grosza co łaska królu złoty :)',
        info1: 'Wybierz plik layoutu otrzymany od grafika a następnie przejdź do ' +
            'jego mierzenia i wycinania!',
        info2: '(wszystkie Twoje pliki/linki są trzymane w pamięci przeglądarki - nie sa nigdzie' +
            ' uploadowane)',
        or: 'Lub',
        notChrome: 'Przepraszamy, ale to narzędzie nie działa jeszcze na innych przeglądarkach' +
            ' poza Google Chrome',
        tutorial: 'Szybkie szkolenie',

        table: {
            col: {
                id: 'ID',
                name : 'Nazwa',
                actions: 'Akcje',
            },
            actions: {
                edit: 'Mierz',
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
            ' <b>http://imgur.com</b> lub dysk google. Możesz też użyć proxy zezwalające na CORS' +
            ' - np. spróbuj wkleić ten link:' +
            ' <br/><b>https://cors-anywhere.herokuapp.com/%{url}</b>',
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

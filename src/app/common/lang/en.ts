export const en = {

    layoutManager: {

        title: 'Html Cutting Helper',
        uploadFile: 'Choose file <br/>(drag here)',
        pasteUrl: 'Paste Image URL',
        getUtl: 'Get',
        freeSpace: 'Free space %{freeSpace} (the most space use pictures from files)',
        donate: 'If you like this app - please donate :)',
        info1: 'Choose layout picture from your graphican and then start cutting it!',
        info2: '(all your files/links are save in browser memory - nothing is uploaded)',
        or: 'Or',
        notChrome: 'Sorry but this tool not working yet for other browsers than Google Chrome',

        table: {
            col: {
                id: 'ID',
                name : 'Name (and optional link)',
                actions: 'Actions',
            },
            actions: {
                edit: 'Start cutting',
                editName: 'Edit name',
                preview: 'Preview',
                del: 'Delete',
            }
        },

        err: {
            linkProblem: 'The image url is broken or the server don\'t give' +
                ' access to CORS origin reference. Try download image and upload it here' +
                ' from local file. You can also provide alternative link to this image by' +
                ' upload image to different server which allow CORS origin e.g' +
                ' <b>http://imgur.com</b> or google disc . You can also use some proxy which allow CORS origin' +
                ' - e.g. try this link: <br/><b>https://cors-anywhere.herokuapp.com/%{url}</b>',
            noFreeSpace: 'Problem with upload file: you have not free space in' +
                ' your browser local storage! Remove some old images (without link) to get more' +
                ' space (max 5MB).',
        },
    },

    layoutViewer: {
        image_name: 'Picture name:',
        buttons: {
            close: 'Close this panel - you can reopen by double click or reload page',
            compact: 'Compact mode',
            full: 'Show more information',
            save: 'Cut page to selection box and save it',
        },

        help: {
            draw: 'Draw box using',
            mouse: 'Mouse!',
            click: 'Click/Space',
            click_info: ': select color',
            dbclick: 'Double-click',
            dbclick_info: ': show info',
            wheel: 'Wheel',
            wheel_info: 'vertical scroll',
            shift: '+Shift',
            shift_info: ': horizontal',
            alt: '+Alt',
            alt_info: ': per-pixel',
            arrows: 'Arrows',
            arrows_info: ': move per-pixel box-edge-vertex,color',
            s: 'S',
            s_info: ': crop to selection box and save image',
            i: 'i',
            i_info: ': show/hide info box',
        },

        num_long: {
            img_wh: 'Image Width x Height:',
            scr_wh: 'Screen Width x Height:',
            img_lt: 'Image Left x Top:',
            mouse_xy: 'Image Left x Top:',

            box: 'Selection Box:',
            box_lt: 'Left x Top:',
            box_rb: 'Right x Bottom:',
            box_wh: 'Width x Height:',
        },

        num_short: {
            img: 'img:',
            lt: 'lt:',
            screen: 'screen:',
            mouse: 'mouse:',
            box: 'box',
            rb: 'rb:',
            size: 'size:',
        },
    }
};

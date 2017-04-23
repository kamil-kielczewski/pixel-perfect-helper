export const en = {

    layoutManager: {

        title: 'HtmlCuttingHelper',
        uploadFile: 'Choose file',
        pasteUrl: 'Paste Image URL',
        getUtl: 'Get',
        freeSpace: 'Free space %{freeSpace} (the most space use pictures from files)',

        table: {
            col: {
                id: 'ID',
                name : 'Name (and optional link)',
                actions: 'Actions',
            },
            actions: {
                edit: 'Edit',
                editName: 'Edit name',
                preview: 'Preview',
                del: 'Delete',
            }
        },

        err: {
            linkProblem: 'The image url is broken or the server don\'t give' +
                ' access to cors origin reference. Try download image and upload it here' +
                ' from local file. You can also provide alternative link to this image by' +
                ' upload image to different server which allow cors origin e.g' +
                ' http://imgur.com/ . You can also use some proxy which allow cors origin' +
                ' - e.g. try this link: https://cors-anywhere.herokuapp.com/${url}',
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

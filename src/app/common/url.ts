export class Url {

    /**
     * Method return  local address ( not full url) in angular app (can be language dependendt)
     * This function use polyglot libraty in Lang class to put parameters inside final short link
     *
     * @param  {string} routingName Routing name from app/comon/lang/
     * @param  {any}    values      Parameters that maby might appear in link
     *                              eg: "users/23/education", here { user_id:=23 },
     * @return {string}             Short url for instance "users/hobbies"
     */
    public static to(routingName: string, values?: any) {
        if (routingName === 'layoutsViewer') {
            return 'view/' + values['key'];
        }
        throw 'Unknow route';
    }

}

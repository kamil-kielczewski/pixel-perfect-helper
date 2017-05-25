/**
 * This class is mainly for provide named routes
 */
export class Url {

    /**
     * Method return local address ( not full url) in angular app
     * It body is meets requirement of AoT JS supported subset
     * https://gist.github.com/chuckjaz/65dcc2fd5f4f5463e492ed0cb93bca60
     *
     * @param  {string} routingName Routing name from app/comon/lang/
     * @param  {any}    values      Parameters names or its values that might appear in link
     *         eg:
     *         Desired link: "users/23/education"
     *         routingName ='usersEducation'
     *         values['user_id'] = 23 (or ':user_id' for angular app.routes.ts routing params)
     *         return map filed: 'usersEducation' : 'users/' + values['user_id'] + '/education',
     *
     * @return {string}             Short url for instance "users/23/education"
     */
    public static to(routingName: string, values = {}) {
        return {
            layoutsViewer : 'view/' + values['id'],
        }[routingName];
    }

}

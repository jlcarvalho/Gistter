'use strict';
/*jshint esnext: true */

const AUTH = new WeakMap();
const TIMEOUT = new WeakMap();

class NavbarDirective {
    constructor ($timeout, Auth) {
        AUTH.set(this, Auth);
        TIMEOUT.set(this, $timeout);

        this.templateUrl = 'components/navbar/navbar.html';
        this.restrict = 'E';
        this.transclude = true;
        this.controllerAs = 'navbar';
        this.bindToController = true; // because the timeout is isolated
    }

    controller () {
        this.Auth = AUTH.get(NavbarDirective.instance);
        if(this.Auth.isLogged()){
            TIMEOUT.get(NavbarDirective.instance)(() => {
                this.Auth.getUser().then((user) => {
                  this.user = user;
                });
            })
        }
    }

    static directiveFactory($timeout, Auth) {
        NavbarDirective.instance = new NavbarDirective($timeout, Auth);
        return NavbarDirective.instance;
    }
}

NavbarDirective.directiveFactory.$inject = ['$timeout', 'Auth'];

export default NavbarDirective;

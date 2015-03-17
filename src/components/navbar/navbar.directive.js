'use strict';
/*jshint esnext: true */

const AUTH = new WeakMap();
const GITHUB = new WeakMap();
const TIMEOUT = new WeakMap();

class NavbarDirective {
    constructor ($timeout, Auth, GH) {
        AUTH.set(this, Auth);
        GITHUB.set(this, GH);
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
            this.Auth.getUser().then((user) => {
              this.user = user;
            });

            TIMEOUT.get(NavbarDirective.instance)(() => {
                GITHUB.get(NavbarDirective.instance).getUser().show(false, (err, user) => {
                    this.user = user;
                })
            })
        }
    }

    static directiveFactory($timeout, Auth, GH) {
        NavbarDirective.instance = new NavbarDirective($timeout, Auth, GH);
        return NavbarDirective.instance;
    }
}

NavbarDirective.directiveFactory.$inject = ['$timeout', 'Auth', 'GH'];

export default NavbarDirective;

'use strict';
/*jshint esnext: true */

class NavbarDirective {
    constructor () {
        this.templateUrl = 'components/navbar/navbar.html'; 
        this.restrict = 'E'; 
        this.transclude = true;
        this.controllerAs = 'navbar';
        this.bindToController = true; // because the scope is isolated
    }

    controller ($scope, Auth, GH) {
        this.Auth = Auth;
        
        if(Auth.isLogged()){       
            GH.getUser().show(false, (err, user) => {
                this.user = user;
                $scope.$apply();
            })
        }
    }

    static directiveFactory() {
        NavbarDirective.instance = new NavbarDirective();
        return NavbarDirective.instance;
    }
}

export default NavbarDirective;
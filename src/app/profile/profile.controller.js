/**
 * Created by jeanlucasdecarvalhosilva on 17/03/15.
 */
'use strict';
/*jshint esnext: true */

class ProfileCtrl
{
  constructor($scope, $state, $stateParams, $mdDialog, Auth, GH)
  {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.GH = GH;

    if(Auth.isLogged()){
      GH.getUser().show(false, (err, user) => {
        this.current_user = user;
        $scope.$apply();
      })
    }

    GH.getUser().show($stateParams.user.substring(0, $stateParams.user.length-1), (err, user) => {
      this.user = user;
      $scope.$apply();
    })
  }
}

ProfileCtrl.$inject = ['$scope', '$state', '$stateParams', '$mdDialog', 'Auth', 'GH'];
export default ProfileCtrl;

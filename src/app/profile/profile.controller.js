/**
 * Created by jeanlucasdecarvalhosilva on 17/03/15.
 */
'use strict';
/*jshint esnext: true */

class ProfileCtrl
{
  constructor($scope, $state, $stateParams, Auth, GH)
  {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.Auth = Auth;
    this.GH = GH.getInstance(sessionStorage['token']);

    Auth.getUser().then((user) => {
      this.current_user = user;
    })

    var username = $stateParams.user.substring(0, $stateParams.user.length-1);
    this.GH.getUser().show(username, (err, user) => {
      this.user = user;
      $scope.$apply();
    })

    this.GH.getUser().userGists(username, (err, gists) => {
      this.gists = _.filter(gists, function(gist){
        var coder = gist.description.split('Coder: ')
        if(coder.length > 1){
          gist.description = coder[1];
          return gist;
        }
      });
      $scope.$apply();
    });
  }
}

ProfileCtrl.$inject = ['$scope', '$state', '$stateParams', 'Auth', 'GH'];
export default ProfileCtrl;

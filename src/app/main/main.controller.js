'use strict';
/*jshint esnext: true */

class MainCtrl {
  constructor ($scope, $state, $stateParams, $mdDialog, $http, Auth, GH) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.GH = GH.getInstance(sessionStorage['token']);

    this.desc = '';

      this.content = {
        html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Gistter</title>

    <!-- Necessary to insert the styles -->
    <link rel="stylesheet" type="text/css" href="main.css">
  </head>
  <body>
    <!-- Your code here -->


    <!-- Necessary to insert the javascript -->
    <script type="text/javascript" src="app.js"></script>
  </body>
</html>`,
        css: '',
        js: ''
      }
    

    Auth.getUser().then((user) => {
      this.user = user;
    })

    if(!!$stateParams.gistId){
      var gist = this.GH.getGist($stateParams.gistId);

      gist.read((err, gist) => {
        this.gist = gist;
        this.desc = gist.description || '';

        this.content.html = !!gist.files['index.html'] ? gist.files['index.html'].content : '';
        this.content.css = !!gist.files['main.css'] ? gist.files['main.css'].content : '';
        this.content.js = !!gist.files['app.js'] ? gist.files['app.js'].content : '';

        $scope.$apply();
      });
    }
  }

  newGist() {
    this.$state.go('home', {gistId: ''}, { reload: true })
  }

  save (){
    var files = {};

    if(!!this.content.html) {
      files['index.html'] = {
          "content": this.content.html
      }
    }

    if(!!this.content.css) {
      files['main.css'] = {
          "content": this.content.css
      }
    }

    if(!!this.content.js) {
      files['app.js'] = {
          "content": this.content.js
      }
    }

    if(this.$stateParams.gistId === ''){
      this.GH.getGist().create({
        "access_token": sessionStorage['token'],
        "description": this.desc || 'Gistter: ',
        "public": true,
        "files": files
      }, (error, gist) => {
        console.dir(gist);
        this.$state.go('home', {gistId: gist.id});
      })
    } else {
      this.GH.getGist(this.$stateParams.gistId).update({
        "access_token": sessionStorage['token'],
        "description": this.desc,
        "files": files
      }, (error, gist) => {
        console.dir(gist);
      })
    }
  }

  isNew() {
    return !this.gist;
  }

  isOwner() {
    return !!this.gist && !!this.$stateParams.gistId && this.user && this.gist.owner && (this.user.id === this.gist.owner.id);
  }

  hasOwner() {
    return !!this.gist && !!this.gist.owner;
  }

  isForkeable() {
    return !!this.gist && !!this.$stateParams.gistId && this.user && this.gist.owner && (this.user.id !== this.gist.owner.id);
  }

  fork() {
    this.GH.getGist(this.$stateParams.gistId).fork((error, gist) => {
        console.dir(gist);
        this.$state.go('home', {gistId: gist.id});
    })
  }

  info(ev) {
    this.$mdDialog.show({
      controller: function DialogController($scope, $mdDialog, GH, desc, isOwner, hasOwner, isNew) {
        $scope.desc = desc.split('Gistter: ')[1];
        $scope.isOwner = isOwner;
        $scope.hasOwner = hasOwner;
        $scope.isNew = isNew;

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.update = function(desc) {
          $mdDialog.hide(desc);
        };

      },
      template:
      `
        <md-dialog aria-label="Gist description">
          <md-content>
          <form name="userForm">
              <md-input-container flex>
                <label>Description</label>
                <textarea ng-model="desc" columns="1" md-maxlength="500" ng-disabled="hasOwner && !isOwner && !isNew"></textarea>
              </md-input-container>
            </md-content>
          </form>
          <div class="md-actions" layout="row">
            <md-button ng-click="cancel()">
              Close
            </md-button>
            <md-button ng-click="update(desc)" class="md-primary" ng-if="!(hasOwner && !isOwner && !isNew)">
              Save
            </md-button>
          </div>
        </md-dialog>
      `,
      targetEvent: ev,
      locals: {
        desc: this.desc,
        isOwner: this.isOwner(),
        hasOwner: this.hasOwner(),
        isNew: this.isNew()
      },
    })
    .then((desc) => {
      this.desc = 'Gistter: ' + desc;
      this.save();
    }, () => {
      console.dir('You cancelled the dialog.');
    });
  }
}

MainCtrl.$inject = ['$scope', '$state', '$stateParams', '$mdDialog', '$http', 'Auth', 'GH'];
export default MainCtrl;

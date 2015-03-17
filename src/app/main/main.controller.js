'use strict';
/*jshint esnext: true */

class MainCtrl {
  constructor ($scope, $state, $stateParams, $mdDialog, Auth, GH) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.GH = GH;

    this.desc = '';

    if(Auth.isLogged()){
        GH.getUser().show(false, (err, user) => {
            this.user = user;
            $scope.$apply();
        })
    }

    if(!!$stateParams.gistId){
      var gist = GH.getGist($stateParams.gistId);

      gist.read((err, gist) => {
        this.gist = gist;
        this.desc = gist.description || '';

        this.html = !!gist.files['index.html'] ? gist.files['index.html'].content : '';
        this.css = !!gist.files['main.css'] ? gist.files['main.css'].content : '';
        this.js = !!gist.files['app.js'] ? gist.files['app.js'].content : '';

        this.updateIframe();
      });
    }

    this.checkStorage();
    this.updateIframe();
  }

  checkStorage () {
    this.html = !!sessionStorage["html"] ? sessionStorage["html"] : '';
    this.css = !!sessionStorage["css"] ? sessionStorage["css"] : '';
    this.js = !!sessionStorage["js"] ? sessionStorage["js"] : '';
  }

  updateIframe() {
    var print = `
      <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Coder</title>
            <style>${this.css}</style>
          </head>
          <body>
            ${this.html}
            <script>${this.js}</script>
          </body>
        </html>`;

    (document.getElementById("preview").contentWindow.document).write(print);
    (document.getElementById("preview").contentWindow.document).close()
  }// Store contents of textarea in sessionStorage

  change (type) {
    sessionStorage[type] = this[type];

    this.updateIframe();
  }

  newGist() {
    sessionStorage['html'] = '';
    sessionStorage['css'] = '';
    sessionStorage['js'] = '';

    this.$state.go('home', {gistId: ''}, { reload: true })
  }

  save (){
    var files = {};

    if(!!sessionStorage['html']) {
      files['index.html'] = {
          "content": sessionStorage['html']
      }
    }

    if(!!sessionStorage['css']) {
      files['main.css'] = {
          "content": sessionStorage['css']
      }
    }

    if(!!sessionStorage['js']) {
      files['app.js'] = {
          "content": sessionStorage['js']
      }
    }

    if(this.$stateParams.gistId === ''){
      this.GH.getGist().create({
        "access_token": sessionStorage['token'],
        "description": this.desc,
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

  isOwner() {
    return !!this.gist && !!this.$stateParams.gistId && (this.user.id === this.gist.owner.id);
  }

  fork() {
    this.GH.getGist(this.$stateParams.gistId).fork((error, gist) => {
        console.dir(gist);
        this.$state.go('home', {gistId: gist.id});
    })
  }

  info(ev) {
    this.$mdDialog.show({
      controller: function DialogController($scope, $mdDialog, GH, desc, isOwner) {
        $scope.desc = desc.split('Coder: ')[1];
        $scope.isOwner = isOwner;
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
                <textarea ng-model="desc" columns="1" md-maxlength="500" ng-disabled="!isOwner"></textarea>
              </md-input-container>
            </md-content>
          </form>
          <div class="md-actions" layout="row">
            <md-button ng-click="cancel()">
              Close
            </md-button>
            <md-button ng-click="update(desc)" class="md-primary" ng-if="isOwner">
              Save
            </md-button>
          </div>
        </md-dialog>
      `,
      targetEvent: ev,
      locals: {
        desc: this.desc,
        isOwner: this.isOwner()
      },
    })
    .then((desc) => {
      this.desc = 'Coder: ' + desc;
      this.save();
    }, () => {
      console.dir('You cancelled the dialog.');
    });
  }
}

MainCtrl.$inject = ['$scope', '$state', '$stateParams', '$mdDialog', 'Auth', 'GH'];
export default MainCtrl;

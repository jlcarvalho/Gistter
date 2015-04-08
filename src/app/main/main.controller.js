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

    $http.get('app/main/editorTemplate.html').success((data) => {
      this.content = {
        html: sessionStorage.html || data,
        css: sessionStorage.css || '',
        js: sessionStorage.js || ''
      }
    });
    

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
    sessionStorage['html'] = this.htmlTemplate;
    sessionStorage['css'] = '';
    sessionStorage['js'] = '';

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

  isForkeable() {
    return !!this.gist && !!this.$stateParams.gistId && (this.user.id !== this.gist.owner.id);
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

MainCtrl.$inject = ['$scope', '$state', '$stateParams', '$mdDialog', '$http', 'Auth', 'GH'];
export default MainCtrl;

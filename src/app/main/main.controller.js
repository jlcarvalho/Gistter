'use strict';
/*jshint esnext: true */

class MainCtrl {
  constructor ($scope, $state, $stateParams, Auth, GH) {
    this.Auth = Auth;

    if(Auth.isLogged()){
        GH.getUser().show(false, (err, user) => {
            this.user = user;
            $scope.$apply();
        })
    }

    if(!!$stateParams.gistId){
      var gist = GH.getGist($stateParams.gistId);

      gist.read((err, gist) => {
        this.html = !!gist.files['index.html'] ? gist.files['index.html'].content : '';
        this.css = !!gist.files['main.css'] ? gist.files['main.css'].content : '';
        this.js = !!gist.files['app.js'] ? gist.files['app.js'].content : '';

        this.updateIframe();
      });
    }

    this.checkStorage();
    this.updateIframe();

    // Store contents of textarea in sessionStorage
    this.change = (type) => {
      sessionStorage[type] = this[type];

      this.updateIframe();
    }

    this.save = () => {
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

      if($stateParams.gistId === ''){
        GH.getGist().create({
          "access_token": sessionStorage['token'],
          "description": "Coder: the description for this gist",
          "public": true,
          "files": files
        }, function(error, gist){
          console.dir(gist);
          $state.go('home', {gistId: gist.id})
        })
      } else {
        GH.getGist($stateParams.gistId).update({
          "access_token": sessionStorage['token'],
          "description": "Coder: the description for this gist",
          "files": files
        }, function(error, gist){
          console.dir(gist);
        })
      }
    }
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
  }
}

MainCtrl.$inject = ['$scope', '$state', '$stateParams', 'Auth', 'GH'];
export default MainCtrl;

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

      GH.getGist().create({
        "access_token": sessionStorage['token'],
        "description": "Coder: the description for this gist",
        "public": true,
        "files": files
      }, function(error, gist){
        console.dir(gist);
        $state.go('home', {gistId: gist.id})
      })
    }
  }

  checkStorage () {
    if (sessionStorage["html"]) {
      this.html = sessionStorage["html"];
    }
    if (sessionStorage["css"]) {
      this.css = sessionStorage["css"];
    }
    if (sessionStorage["js"]) {
      this.js = sessionStorage["js"];
    }
  }

  updateIframe() {
    (document.getElementById("preview").contentWindow.document).write(
      this.html+"<style>"+this.css+"<\/style><script>"+this.js+"<\/script>"
    );
    (document.getElementById("preview").contentWindow.document).close()
  }
}

MainCtrl.$inject = ['$scope', '$state', '$stateParams', 'Auth', 'GH'];
export default MainCtrl;

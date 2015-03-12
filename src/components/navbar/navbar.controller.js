'use strict';
/*jshint esnext: true */

class NavbarCtrl {
  constructor (GH) {
    this.date = new Date();
    this.user = GH.getUser();
    //this.gists = GH.getGist().create({
    //  "access_token": sessionStorage['token'],
    //  "description": "the description for this gist",
    //  "public": true,
    //  "files": {
    //    "file1.txt": {
    //      "content": "String file contents"
    //    }
    //  }
    //}, function(data){
    //  console.dir(data);
    //})
  }
}

NavbarCtrl.$inject = ['GH'];

export default NavbarCtrl;

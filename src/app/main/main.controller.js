'use strict';
/*jshint esnext: true */

class MainCtrl {
  constructor () {
    this.checkStorage();
    this.updateIframe();

    // Store contents of textarea in sessionStorage
    this.change = function(type){
      sessionStorage[type] = this[type];

      this.updateIframe();
    }

    // Clear textareas with button
    //angular.element(".clearLink").click(function (){
    //  this.html = "";
    //  this.css = "";
    //  this.js = "";
    //  sessionStorage.clear();
    //});
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

///MainCtrl.$inject = [];
export default MainCtrl;

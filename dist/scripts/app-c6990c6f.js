!function e(t,n,o){function i(s,r){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!r&&c)return c(s,!0);if(a)return a(s,!0);throw new Error("Cannot find module '"+s+"'")}var u=n[s]={exports:{}};t[s][0].call(u.exports,function(e){var n=t[s][1][e];return i(n?n:e)},u,u.exports,e,t,n,o)}return n[s].exports}for(var a="function"==typeof require&&require,s=0;s<o.length;s++)i(o[s]);return i}({1:[function(e){"use strict";var t=e("../components/auth/auth.service")["default"],n=e("../components/github/github.service")["default"],o=e("./login/login.controller")["default"],i=e("./main/main.controller")["default"],a=e("../components/navbar/navbar.directive")["default"];angular.module("coder",["restangular","ui.router","ngMaterial","ui.ace"]).controller("LoginCtrl",o).controller("MainCtrl",i).directive("navbar",a.directiveFactory).service("Auth",t).service("GH",n).config(["$locationProvider","$stateProvider","$urlRouterProvider",function(e,t,n){e.html5Mode(!0),t.state("home",{url:"/editor/:gistId?",templateUrl:"app/main/main.html",controller:"MainCtrl as main"}).state("login",{url:"/login?code",templateUrl:"app/login/login.html",controller:"LoginCtrl as login"}),n.otherwise("/editor/")}])},{"../components/auth/auth.service":4,"../components/github/github.service":5,"../components/navbar/navbar.directive":6,"./login/login.controller":2,"./main/main.controller":3}],2:[function(e,t,n){"use strict";var o=function(e,t,n){e.isLogged()||e.getToken(t.code).then(function(){n.go("home")},function(e){e&&console.dir("Oops!")})};o.$inject=["Auth","$stateParams","$state"],n["default"]=o},{}],3:[function(e,t,n){"use strict";var o=function(){var e=function(e,t,n,o,i){var a=this;if(this.Auth=o,o.isLogged()&&i.getUser().show(!1,function(t,n){a.user=n,e.$apply()}),n.gistId){var s=i.getGist(n.gistId);s.read(function(e,t){a.html=t.files["index.html"]?t.files["index.html"].content:"",a.css=t.files["main.css"]?t.files["main.css"].content:"",a.js=t.files["app.js"]?t.files["app.js"].content:"",a.updateIframe()})}this.checkStorage(),this.updateIframe(),this.change=function(e){sessionStorage[e]=a[e],a.updateIframe()},this.save=function(){var e={};sessionStorage.html&&(e["index.html"]={content:sessionStorage.html}),sessionStorage.css&&(e["main.css"]={content:sessionStorage.css}),sessionStorage.js&&(e["app.js"]={content:sessionStorage.js}),""===n.gistId?i.getGist().create({access_token:sessionStorage.token,description:"Coder: the description for this gist","public":!0,files:e},function(e,n){console.dir(n),t.go("home",{gistId:n.id})}):i.getGist(n.gistId).update({access_token:sessionStorage.token,description:"Coder: the description for this gist",files:e},function(e,t){console.dir(t)})}};return e.prototype.checkStorage=function(){this.html=sessionStorage.html?sessionStorage.html:"",this.css=sessionStorage.css?sessionStorage.css:"",this.js=sessionStorage.js?sessionStorage.js:""},e.prototype.updateIframe=function(){document.getElementById("preview").contentWindow.document.write(this.html+"<style>"+this.css+"</style><script>"+this.js+"</script>"),document.getElementById("preview").contentWindow.document.close()},e}();o.$inject=["$scope","$state","$stateParams","Auth","GH"],n["default"]=o},{}],4:[function(e,t,n){"use strict";var o=function(){var e=function(e,t){this.http=e,this.promise=t};return e.prototype.getToken=function(e){var t=this.promise.defer();return this.http.get("https://jlcarv-coder.herokuapp.com/authenticate/"+e).success(function(e){e.hasOwnProperty("error")?t.reject(!0):(sessionStorage.token=e.token,t.resolve(!0))}),t.promise},e.prototype.isLogged=function(){return angular.isDefined(sessionStorage.token)?!0:void 0},e}();o.$inject=["$http","$q"],n["default"]=o},{}],5:[function(e,t,n){"use strict";var o=function(){var e=new Github({token:sessionStorage.token,auth:"oauth"});return e};n["default"]=o},{}],6:[function(e,t,n){"use strict";var o=new WeakMap,i=new WeakMap,a=new WeakMap,s=function(){var e=function(e,t,n){o.set(this,t),i.set(this,n),a.set(this,e),this.templateUrl="components/navbar/navbar.html",this.restrict="E",this.transclude=!0,this.controllerAs="navbar",this.bindToController=!0};return e.prototype.controller=function(){var t=this;o.get(e.instance).isLogged()&&a.get(e.instance)(function(){i.get(e.instance).getUser().show(!1,function(e,n){t.user=n})})},e.directiveFactory=function(t,n,o){return e.instance=new e(t,n,o),e.instance},e}();s.directiveFactory.$inject=["$timeout","Auth","GH"],n["default"]=s},{}]},{},[1]),angular.module("coder").run(["$templateCache",function(e){e.put("app/login/login.html",'<div layout="vertical" layout-fill=""><div layout="row" layout-sm="column" layout-align="space-around"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div></div>'),e.put("app/main/main.html",'<div layout="vertical" layout-fill=""><navbar><md-button ng-href="editor" class="md-raised">New</md-button><md-button ng-if="main.Auth.isLogged()" ng-click="main.save()" class="md-raised">Save</md-button><span flex=""></span> <a ng-if="!main.Auth.isLogged()" href="https://github.com/login/oauth/authorize?client_id=6e6377a2f4543ef05194&scope=user:email,user:follow,gist" class="btn-github">Log in with Github</a><div ng-if="main.Auth.isLogged()" layout="row" layout-align="end center"><img ng-src="{{main.user.avatar_url}}" alt="{{main.user.name}}" class="face"> <span>{{main.user.name}}</span></div></navbar><md-content><div class="techs" layout-align="space-around center"><md-content flex="33"><div ng-model="main.html" ng-change="main.change(\'html\')" ui-ace="{ useWrapMode : true, theme:\'monokai\', mode: \'html\', require: [\'ace/ext/language_tools\'], advanced: { enableSnippets: true, enableBasicAutocompletion: true, enableLiveAutocompletion: true } }"></div><md-button class="md-accent md-fab md-fab-top-right" ng-disabled="true">HTML</md-button></md-content><md-content flex="33"><div ng-model="main.css" ng-change="main.change(\'css\')" ui-ace="{ useWrapMode : true, theme:\'monokai\', mode: \'css\', require: [\'ace/ext/language_tools\'], advanced: { enableSnippets: true, enableBasicAutocompletion: true, enableLiveAutocompletion: true } }"></div><md-button class="md-accent md-fab md-fab-top-right" ng-disabled="true">CSS</md-button></md-content><md-content flex="33"><div ng-model="main.js" ng-change="main.change(\'js\')" ui-ace="{ useWrapMode : true, theme:\'monokai\', mode: \'javascript\', require: [\'ace/ext/language_tools\'], advanced: { enableSnippets: true, enableBasicAutocompletion: true, enableLiveAutocompletion: true } }"></div><md-button class="md-accent md-fab md-fab-top-right" ng-disabled="true">JS</md-button></md-content></div><iframe id="preview"></iframe></md-content></div>'),e.put("components/navbar/navbar.html",'<md-toolbar><div class="md-toolbar-tools"><span>Coder</span><div layout="row" layout-align="space-between center" source="" ng-transclude="" flex="100"></div></div></md-toolbar>')}]);
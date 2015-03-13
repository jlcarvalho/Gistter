!function t(e,n,o){function i(s,r){if(!n[s]){if(!e[s]){var c="function"==typeof require&&require;if(!r&&c)return c(s,!0);if(a)return a(s,!0);throw new Error("Cannot find module '"+s+"'")}var u=n[s]={exports:{}};e[s][0].call(u.exports,function(t){var n=e[s][1][t];return i(n?n:t)},u,u.exports,t,e,n,o)}return n[s].exports}for(var a="function"==typeof require&&require,s=0;s<o.length;s++)i(o[s]);return i}({1:[function(t){"use strict";var e=t("../components/auth/auth.service")["default"],n=t("../components/github/github.service")["default"],o=t("./login/login.controller")["default"],i=t("./main/main.controller")["default"],a=t("../components/navbar/navbar.directive")["default"];angular.module("coder",["restangular","ui.router","ngMaterial","ui.ace"]).controller("LoginCtrl",o).controller("MainCtrl",i).directive("navbar",a.directiveFactory).service("Auth",e).service("GH",n).config(["$locationProvider","$stateProvider","$urlRouterProvider",function(t,e,n){t.html5Mode(!0),e.state("home",{url:"/editor/:gistId?",templateUrl:"app/main/main.html",controller:"MainCtrl as main"}).state("login",{url:"/login?code",templateUrl:"app/login/login.html",controller:"LoginCtrl as login"}),n.otherwise("/editor/")}])},{"../components/auth/auth.service":4,"../components/github/github.service":5,"../components/navbar/navbar.directive":6,"./login/login.controller":2,"./main/main.controller":3}],2:[function(t,e,n){"use strict";var o=function(t,e,n){t.isLogged()||t.getToken(e.code).then(function(){n.go("home")},function(t){t&&console.dir("Oops!")})};o.$inject=["Auth","$stateParams","$state"],n["default"]=o},{}],3:[function(t,e,n){"use strict";var o=function(){var t=function(t,e,n,o,i){var a=this;if(this.Auth=o,o.isLogged()&&i.getUser().show(!1,function(e,n){a.user=n,t.$apply()}),n.gistId){var s=i.getGist(n.gistId);s.read(function(t,e){a.html=e.files["index.html"]?e.files["index.html"].content:"",a.css=e.files["main.css"]?e.files["main.css"].content:"",a.js=e.files["app.js"]?e.files["app.js"].content:"",a.updateIframe()})}this.checkStorage(),this.updateIframe(),this.change=function(t){sessionStorage[t]=a[t],a.updateIframe()},this.save=function(){var t={};sessionStorage.html&&(t["index.html"]={content:sessionStorage.html}),sessionStorage.css&&(t["main.css"]={content:sessionStorage.css}),sessionStorage.js&&(t["app.js"]={content:sessionStorage.js}),""===n.gistId?i.getGist().create({access_token:sessionStorage.token,description:"Coder: the description for this gist","public":!0,files:t},function(t,n){console.dir(n),e.go("home",{gistId:n.id})}):i.getGist(n.gistId).update({access_token:sessionStorage.token,description:"Coder: the description for this gist",files:t},function(t,e){console.dir(e)})}};return t.prototype.checkStorage=function(){this.html=sessionStorage.html?sessionStorage.html:"",this.css=sessionStorage.css?sessionStorage.css:"",this.js=sessionStorage.js?sessionStorage.js:""},t.prototype.updateIframe=function(){document.getElementById("preview").contentWindow.document.write(this.html+"<style>"+this.css+"</style><script>"+this.js+"</script>"),document.getElementById("preview").contentWindow.document.close()},t}();o.$inject=["$scope","$state","$stateParams","Auth","GH"],n["default"]=o},{}],4:[function(t,e,n){"use strict";var o=function(){var t=function(t,e){this.http=t,this.promise=e};return t.prototype.getToken=function(t){var e=this.promise.defer();return this.http.get("http://localhost:9999/authenticate/"+t).success(function(t){t.hasOwnProperty("error")?e.reject(!0):(sessionStorage.token=t.token,e.resolve(!0))}),e.promise},t.prototype.isLogged=function(){return angular.isDefined(sessionStorage.token)?!0:void 0},t}();o.$inject=["$http","$q"],n["default"]=o},{}],5:[function(t,e,n){"use strict";var o=function(){var t=new Github({token:sessionStorage.token,auth:"oauth"});return t};n["default"]=o},{}],6:[function(t,e,n){"use strict";var o=new WeakMap,i=new WeakMap,a=new WeakMap,s=function(){var t=function(t,e,n){o.set(this,e),i.set(this,n),a.set(this,t),this.templateUrl="components/navbar/navbar.html",this.restrict="E",this.transclude=!0,this.controllerAs="navbar",this.bindToController=!0};return t.prototype.controller=function(){var e=this;o.get(t.instance).isLogged()&&a.get(t.instance)(function(){i.get(t.instance).getUser().show(!1,function(t,n){e.user=n})})},t.directiveFactory=function(e,n,o){return t.instance=new t(e,n,o),t.instance},t}();s.directiveFactory.$inject=["$timeout","Auth","GH"],n["default"]=s},{}]},{},[1]),angular.module("coder").run(["$templateCache",function(t){t.put("app/login/login.html",'<div layout="vertical" layout-fill=""><div layout="row" layout-sm="column" layout-align="space-around"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div></div>'),t.put("app/main/main.html",'<div layout="vertical" layout-fill=""><navbar><md-button ng-href="editor" class="md-raised">New</md-button><md-button ng-if="main.Auth.isLogged()" ng-click="main.save()" class="md-raised">Save</md-button><span flex=""></span> <a ng-if="!main.Auth.isLogged()" href="https://github.com/login/oauth/authorize?client_id=6e6377a2f4543ef05194&scope=user:email,user:follow,gist" class="btn-github">Log in with Github</a><div ng-if="main.Auth.isLogged()" layout="row" layout-align="end center"><img ng-src="{{main.user.avatar_url}}" alt="{{main.user.name}}" class="face"> <span>{{main.user.name}}</span></div></navbar><md-content><div class="techs" layout-align="space-around center"><md-content flex="33"><div ng-model="main.html" ng-change="main.change(\'html\')" ui-ace="{ useWrapMode : true, theme:\'monokai\', mode: \'html\', require: [\'ace/ext/language_tools\'], advanced: { enableSnippets: true, enableBasicAutocompletion: true, enableLiveAutocompletion: true } }"></div><md-button class="md-accent md-fab md-fab-top-right" ng-disabled="true">HTML</md-button></md-content><md-content flex="33"><div ng-model="main.css" ng-change="main.change(\'css\')" ui-ace="{ useWrapMode : true, theme:\'monokai\', mode: \'css\', require: [\'ace/ext/language_tools\'], advanced: { enableSnippets: true, enableBasicAutocompletion: true, enableLiveAutocompletion: true } }"></div><md-button class="md-accent md-fab md-fab-top-right" ng-disabled="true">CSS</md-button></md-content><md-content flex="33"><div ng-model="main.js" ng-change="main.change(\'js\')" ui-ace="{ useWrapMode : true, theme:\'monokai\', mode: \'javascript\', require: [\'ace/ext/language_tools\'], advanced: { enableSnippets: true, enableBasicAutocompletion: true, enableLiveAutocompletion: true } }"></div><md-button class="md-accent md-fab md-fab-top-right" ng-disabled="true">JS</md-button></md-content></div><iframe id="preview"></iframe></md-content></div>'),t.put("components/navbar/navbar.html",'<md-toolbar><div class="md-toolbar-tools"><span>Coder</span><div layout="row" layout-align="space-between center" source="" ng-transclude="" flex="100"></div></div></md-toolbar>')}]);
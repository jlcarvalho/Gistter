/**
 * Created by JeanLucas on 17/03/2015.
 */
'use strict';
/*jshint esnext: true */

class PreviewDirective {
  constructor () {
    this.template = '<div ng-id="{{id}}" class="preview"><iframe id="{{id}}Iframe" allowfullscreen></iframe><div class="drag-cover"></div></div>';
    this.restrict = 'E';
    this.replace = true;
    this.scope = {
      id: '@',
      content: '='
    };
  }

  link (scope, element) {
    scope.$watch('content', (c) => {
      if(angular.isDefined(scope.id) && angular.isDefined(c))
      {
        var html = c.html || '';
        var css = c.css || '';
        var js = c.js || '';

        var print = html.replace('<link rel="stylesheet" type="text/css" href="main.css">', '<style>' + css + '</style>')
                        .replace('<script type="text/javascript" src="app.js"></script>', '<script>' + js + '</script>');

        (document.getElementById(scope.id + 'Iframe').contentWindow.document).write(print);
        (document.getElementById(scope.id + 'Iframe').contentWindow.document).close()
      }
    }, true)
  }

  static directiveFactory() {
    PreviewDirective.instance = new PreviewDirective();
    return PreviewDirective.instance;
  }
}

export default PreviewDirective;

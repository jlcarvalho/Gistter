/**
 * Created by JeanLucas on 17/03/2015.
 */
'use strict';
/*jshint esnext: true */

class PreviewDirective {
  constructor () {
    this.template = '<iframe ng-id="{{id}}"></iframe>';
    this.restrict = 'E';
    this.replace = true;
    this.scope = {
      id: '@',
      content: '='
    };
  }

  link (scope, element) {
    scope.$watch('content', (c) => {
      if(angular.isDefined(scope.id))
      {
        sessionStorage.html = c.html || '';
        sessionStorage.css = c.css || '';
        sessionStorage.js = c.js || '';

        var print = `
                    <!doctype html>
                    <html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <title>Coder</title>
                        <style>${sessionStorage.css}</style>
                      </head>
                      <body>
                        ${sessionStorage.html}
                        <script>${sessionStorage.js}</script>
                      </body>
                    </html>`;

        (document.getElementById(scope.id).contentWindow.document).write(print);
        (document.getElementById(scope.id).contentWindow.document).close()
      }
    }, true)
  }

  static directiveFactory() {
    PreviewDirective.instance = new PreviewDirective();
    return PreviewDirective.instance;
  }
}

export default PreviewDirective;
